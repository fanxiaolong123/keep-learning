# Keep Learning

[中文说明](README.zh-CN.md)

Keep Learning is a cross-platform plugin repository for structured, active learning. Its first plugin, **MetaLearn**, guides learners through four stages: positioning, knowledge mapping, deep understanding, and integration.

The same MetaLearn skill works in both Codex and Claude Code. The learning protocol has one source of truth; only the platform manifests differ.

## Install for Claude Code

```bash
claude plugin marketplace add fanxiaolong123/keep-learning
claude plugin install meta-learn@keep-learning
```

Start a new Claude Code session, then invoke:

```text
/meta-learn:meta-learn
```

You can also ask naturally: `Help me systematically learn distributed systems.`

## Install for Codex

Add the GitHub marketplace:

```bash
codex marketplace add fanxiaolong123/keep-learning
```

Then open Codex, run `/plugins`, select the **Keep Learning** marketplace, and install **MetaLearn**. Start a new thread after installation and invoke `@meta-learn`, or describe what you want to learn.

## How MetaLearn Works

1. **Positioning**: identify your real starting point, motivation, target depth, and learning boundaries.
2. **Knowledge map**: build a personalized, source-grounded map before studying details.
3. **Deep understanding**: learn through Socratic dialogue, active retrieval, decision scenarios, and teaching-back.
4. **Integration**: connect the new knowledge to your existing network and test transfer.

MetaLearn is designed to make the learner do the cognitive work. It does not replace thinking with summaries.

## Update

Claude Code:

```bash
claude plugin marketplace update keep-learning
claude plugin update meta-learn@keep-learning
```

Codex:

```bash
codex marketplace add fanxiaolong123/keep-learning
```

Then refresh or reinstall MetaLearn from `/plugins` and start a new thread.

## Development

Validate the repository locally:

```bash
bash scripts/validate.sh
```

The source plugin is in [`plugins/meta-learn`](plugins/meta-learn). Do not duplicate the skill content for individual platforms.

## License

[MIT](LICENSE)
