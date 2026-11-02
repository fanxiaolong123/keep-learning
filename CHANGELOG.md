# Changelog

All notable changes to Keep Learning are documented here.

## [Unreleased]

### Changed

- Step 3 模块实践去掉「按知识类型选择实践模式」，只保留案例决策模拟一条路线；版本升至 0.1.7。
- 插件技能目录整体恢复到拆分前的 7bc6ecd：只保留一个 `meta-learn` 技能，去掉 `metalearn-map`、`metalearn-study`、`metalearn-connect` 独立入口及其重复的参考文件副本，去掉 `metalearn-build-module`、`metalearn-assemble-handbook` 交互手册路线，入口技能恢复可被自动触发。
- Step 3 回到逐概念教学，模块实践去掉「模式 A — Mini-Project」。
- 版本升至 0.1.6。
- Claude Code 中 `meta-learn`、`metalearn-map`、`metalearn-study`、`metalearn-connect` 四个入口技能改为只能显式调用（`disable-model-invocation: true`）；`metalearn-build-module` 与 `metalearn-assemble-handbook` 仍可被流程自动加载。

### Added

- Step 2 知识地图新增可选的交互式 HTML 文档格式（单文件自包含，可折叠模块、勾选已掌握、可视化整体进度与模块依赖），由 `references/metalearn-map-template.html` 模板生成；生成时让用户在 HTML 与 Markdown 之间选择，并保留原有 Markdown 选项。

## [0.1.0] - 2026-06-15

### Added

- Initial public release of the MetaLearn plugin.
- Codex marketplace and plugin manifests.
- Claude Code marketplace and plugin manifests.
- Four-stage structured learning workflow.
