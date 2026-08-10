#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];
if (!target) {
  console.error("用法：node validate-interactive-html.mjs <HTML路径>");
  process.exit(2);
}

const fullPath = path.resolve(target);
if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
  console.error(`文件不存在：${fullPath}`);
  process.exit(2);
}

const source = fs.readFileSync(fullPath, "utf8");
const errors = [];
const warnings = [];
const openingTags = [...source.matchAll(/<([a-z][\w:-]*)\b([^<>]*?)>/gis)].map((match) => ({
  name: match[1].toLowerCase(),
  attrs: match[2],
}));

function collectAttributes(name, tagName) {
  const values = [];
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i");
  for (const tag of openingTags) {
    if (tagName && tag.name !== tagName) continue;
    const match = tag.attrs.match(pattern);
    if (match) values.push(match[2]);
  }
  return values;
}

const ids = collectAttributes("id");
const idSet = new Set();
for (const id of ids) {
  if (idSet.has(id)) errors.push(`重复标识：${id}`);
  idSet.add(id);
}

for (const href of collectAttributes("href")) {
  if (href.startsWith("#") && href.length > 1 && !idSet.has(href.slice(1))) {
    errors.push(`页内链接缺少目标：${href}`);
  }
}

for (const attr of ["aria-controls", "aria-describedby", "aria-labelledby", "for"]) {
  for (const value of collectAttributes(attr)) {
    for (const ref of value.trim().split(/\s+/).filter(Boolean)) {
      if (!idSet.has(ref)) errors.push(`${attr} 缺少目标：${ref}`);
    }
  }
}

if (!/<html\b[^>]*\blang\s*=/i.test(source)) warnings.push("html 元素缺少 lang 属性");
if (!/<meta\b[^>]*\bname\s*=\s*(["'])viewport\1/i.test(source)) warnings.push("缺少 viewport 元信息");

for (const tag of openingTags.filter((item) => item.name === "button")) {
  if (!/\btype\s*=/i.test(tag.attrs)) warnings.push("存在未声明 type 的 button");
}

for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const attrs = match[1];
  const body = match[2];
  if (/\bsrc\s*=/i.test(attrs)) continue;
  const type = attrs.match(/\btype\s*=\s*(["'])(.*?)\1/i)?.[2]?.toLowerCase();
  if (type === "module") {
    warnings.push("内联模块脚本需另行做语法检查");
    continue;
  }
  if (type && !["text/javascript", "application/javascript"].includes(type)) continue;
  try {
    new Function(body);
  } catch (error) {
    errors.push(`内联脚本语法错误：${error.message}`);
  }
}

const uniqueErrors = [...new Set(errors)];
const uniqueWarnings = [...new Set(warnings)];

console.log(`文件：${fullPath}`);
console.log(`标识数：${ids.length}`);
for (const warning of uniqueWarnings) console.log(`提醒：${warning}`);
for (const error of uniqueErrors) console.error(`错误：${error}`);

if (uniqueErrors.length) {
  console.error(`检查失败：${uniqueErrors.length} 个错误，${uniqueWarnings.length} 个提醒。`);
  process.exit(1);
}

console.log(`检查通过：0 个错误，${uniqueWarnings.length} 个提醒。`);
