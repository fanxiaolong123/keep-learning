#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const raw = process.argv.slice(2);
const errors = [];
const warnings = [];

function usage(message) {
  if (message) console.error(message);
  console.error("用法：node validate-handbook.mjs <目录> --entry <入口> --map <知识地图> --modules <模块一> <模块二> ... --launcher <启动器> --title <规范名称>");
  process.exit(2);
}

if (!raw.length || raw[0].startsWith("--")) usage("缺少手册目录。");

const root = path.resolve(raw[0]);
const options = { entry: "index.html", map: "", modules: [], launcher: "", title: "" };

for (let index = 1; index < raw.length;) {
  const flag = raw[index++];
  if (flag === "--modules") {
    while (index < raw.length && !raw[index].startsWith("--")) options.modules.push(raw[index++]);
    continue;
  }
  if (!["--entry", "--map", "--launcher", "--title"].includes(flag)) usage(`未知参数：${flag}`);
  if (index >= raw.length || raw[index].startsWith("--")) usage(`${flag} 缺少值。`);
  options[flag.slice(2)] = raw[index++];
}

if (!options.map) usage("缺少 --map。");
if (!options.modules.length) usage("--modules 至少需要一个模块文件。");
if (!options.title) usage("缺少 --title。");

function safeResolve(relative, label) {
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    errors.push(`${label} 超出手册目录：${relative}`);
    return null;
  }
  return resolved;
}

function requireFile(relative, label) {
  const resolved = safeResolve(relative, label);
  if (!resolved) return null;
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    errors.push(`${label} 不存在：${relative}`);
    return null;
  }
  return resolved;
}

function read(relative, label) {
  const resolved = requireFile(relative, label);
  return resolved ? fs.readFileSync(resolved, "utf8") : "";
}

function attributes(source) {
  return [...source.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
}

function localTarget(value, fromFile) {
  if (!value || value.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return null;
  const clean = decodeURIComponent(value.split("#")[0].split("?")[0]);
  if (!clean) return null;
  return path.resolve(path.dirname(fromFile), clean);
}

function linkedLocalScripts(html, htmlFile) {
  const scripts = [];
  for (const match of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const target = localTarget(match[1], htmlFile);
    if (target && fs.existsSync(target) && fs.statSync(target).isFile()) scripts.push(fs.readFileSync(target, "utf8"));
  }
  return scripts;
}

function normalizedLinkTargets(html, htmlFile) {
  return attributes(html).map(value => localTarget(value, htmlFile)).filter(Boolean).map(value => path.normalize(value));
}

function containsFile(source, relative) {
  const decoded = decodeURIComponent(relative);
  return source.includes(relative) || source.includes(encodeURI(relative)) || source.includes(decoded) || source.includes(path.basename(decoded));
}

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) usage(`目录不存在：${root}`);

const entryFile = requireFile(options.entry, "入口文件");
const mapFile = requireFile(options.map, "知识地图");
const moduleFiles = options.modules.map((file, index) => requireFile(file, `模块 ${index + 1}`));
const courseRelatives = [options.map, ...options.modules];
const courseFiles = [mapFile, ...moduleFiles];
const entryHtml = entryFile ? fs.readFileSync(entryFile, "utf8") : "";

if (entryHtml && !entryHtml.includes(options.title)) errors.push(`入口页未出现规范名称：${options.title}`);

if (entryFile) {
  const entryTargetList = normalizedLinkTargets(entryHtml, entryFile);
  const entryTargets = new Set(entryTargetList);
  let orderCursor = -1;
  courseFiles.forEach((file, index) => {
    if (file && !entryTargets.has(path.normalize(file))) errors.push(`入口页缺少课程页面链接：${courseRelatives[index]}`);
    if (file) {
      const normalized = path.normalize(file);
      const position = entryTargetList.findIndex((target, targetIndex) => targetIndex > orderCursor && target === normalized);
      if (position === -1) errors.push(`入口目录顺序与参数不一致：${courseRelatives[index]}`);
      else orderCursor = position;
    }
  });
}

const allHtmlFiles = [entryFile, ...courseFiles].filter(Boolean);
for (const htmlFile of allHtmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const label = path.relative(root, htmlFile);

  for (const match of html.matchAll(/<(script|link)\b[^>]*\b(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi)) {
    errors.push(`${label} 依赖外部运行时资源：${match[2]}`);
  }

  for (const value of attributes(html)) {
    const target = localTarget(value, htmlFile);
    if (target && !fs.existsSync(target)) errors.push(`${label} 的本地资源不存在：${value}`);
  }

  const ids = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) errors.push(`${label} 存在重复标识：${duplicates.join("、")}`);
}

courseFiles.forEach((htmlFile, pageIndex) => {
  if (!htmlFile) return;
  const html = fs.readFileSync(htmlFile, "utf8");
  const relatedSource = [html, ...linkedLocalScripts(html, htmlFile)].join("\n");
  const expectedPrevious = pageIndex > 0 ? courseRelatives[pageIndex - 1] : null;
  const expectedNext = pageIndex < courseRelatives.length - 1 ? courseRelatives[pageIndex + 1] : null;

  if (!containsFile(relatedSource, options.entry)) errors.push(`${courseRelatives[pageIndex]} 缺少首页或学习目录目标。`);
  if (expectedPrevious && !containsFile(relatedSource, expectedPrevious)) errors.push(`${courseRelatives[pageIndex]} 缺少上一页目标：${expectedPrevious}`);
  if (expectedNext && !containsFile(relatedSource, expectedNext)) errors.push(`${courseRelatives[pageIndex]} 缺少下一页目标：${expectedNext}`);
});

if (options.launcher) {
  const launcher = requireFile(options.launcher, "启动器");
  if (launcher) {
    const mode = fs.statSync(launcher).mode;
    const source = fs.readFileSync(launcher, "utf8");
    if ((mode & 0o111) === 0) errors.push(`启动器不可执行：${options.launcher}`);
    if (!containsFile(source, options.entry)) errors.push(`启动器未指向入口文件：${options.entry}`);
  }
} else if (process.platform === "darwin") {
  warnings.push("当前是 macOS，但未提供 --launcher，未检查双击启动方式。");
}

if (!entryHtml.match(/href\s*=\s*["'][^"']*#(?:contents|目录)/i)) warnings.push("入口页未发现稳定的目录锚点；请人工确认“学习目录”落点。");

if (errors.length) {
  errors.forEach(item => console.error(`[错误] ${item}`));
  warnings.forEach(item => console.warn(`[提醒] ${item}`));
  console.error(`验证失败：${errors.length} 个错误，${warnings.length} 个提醒。`);
  process.exit(1);
}

warnings.forEach(item => console.warn(`[提醒] ${item}`));
console.log(`验证通过：入口 1 个，知识地图 1 个，模块 ${options.modules.length} 个；${warnings.length} 个提醒。`);
