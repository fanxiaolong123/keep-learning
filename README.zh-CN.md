# Keep Learning

[English](README.md)

Keep Learning 是一个面向结构化主动学习的跨平台插件仓库。首个插件 **MetaLearn** 通过四个阶段引导学习者：定位、知识地图、深入理解和知识整合。

Codex 与 Claude Code 共用同一份 MetaLearn Skill。学习方法只有一个源码，平台差异仅保留在 manifest 和 marketplace 配置中。

## 安装到 Claude Code

```bash
claude plugin marketplace add fanxiaolong123/keep-learning
claude plugin install meta-learn@keep-learning
```

重新启动 Claude Code 会话，然后调用：

```text
/meta-learn:meta-learn
```

也可以直接说：`请系统地带我学习分布式系统。`

## 安装到 Codex

添加 GitHub marketplace：

```bash
codex marketplace add fanxiaolong123/keep-learning
```

随后进入 Codex，运行 `/plugins`，选择 **Keep Learning** marketplace 并安装 **MetaLearn**。安装后新建一个线程，通过 `@meta-learn` 调用，或直接描述想学习的主题。

## MetaLearn 如何工作

1. **定位**：识别真实起点、学习动机、目标深度和范围边界。
2. **知识地图**：先依据可靠来源建立个性化地图，再进入细节。
3. **深入理解**：通过苏格拉底式对话、主动检索、决策场景和反向教学学习。
4. **知识整合**：把新知识接入已有知识网络，并验证迁移能力。

MetaLearn 的目标是让学习者完成真正的认知工作，而不是用 AI 总结替代思考。

## 更新

Claude Code：

```bash
claude plugin marketplace update keep-learning
claude plugin update meta-learn@keep-learning
```

Codex：

```bash
codex marketplace add fanxiaolong123/keep-learning
```

然后在 `/plugins` 中刷新或重新安装 MetaLearn，并新建线程。

## 开发与验证

```bash
bash scripts/validate.sh
```

插件源码位于 [`plugins/meta-learn`](plugins/meta-learn)。不同平台不复制 Skill 教学内容。

## 许可证

[MIT](LICENSE)
