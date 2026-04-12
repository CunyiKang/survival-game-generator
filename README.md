# 王智慧生存游戏生成器

> 输入一个 AI API Key，就能自动生成任意主题的"王智慧生存游戏"绑定制 Web 游戏

本项目是一个开放的《李智慧生存游戏》模式生成器。用户只需提供 AI API，即可完成：

1. **选择/自定义主题** — 抑郁、精神分裂、PTSD、一般生活等
2. **AI 自动生成题库** — 按年龄段生成具体情境题目
3. **全绳马单人/团体游戏** — 单人 AI 游戏 / 多人在线游戏
4. **更提：** 上传播样表、专业书籍、网络资料，自定义题目生成规则

用法：

```bash
# 本地运行
git clone https://github.com/yourname/survival-game-generator.git
cd survival-game-generator
npm install
# 在 config.js 中填入 AI API Key
node server.js
# 打开 http://localhost:3000

# 也可直接打开 index.html（模拟数据，无须 API）
```

---

## 项目结构

```
survival-game-generator/
├── index.html          — Web 游戏主页
├── config.js           — AI API 配置（项目根盘）
├── server.js           — Node.js 后端服务（AI 生成 API）
├── themes/             — 主题题库
│   ├── general/       — 一般生活版题库（默认，模拟数据）
│   ├── depression/    — 抑郁主题
│   ├── schizophrenia/ — 精神分裂主题
│   └── ptsd/         — PTSD 主题
├── src/
│   ├── game-core.js     — 游戏核心逻辑
│   ├── ui-manager.js   — UI 管理
│   ├── ai-client.js    — AI 客户端（调用后端 API）
│   └── mock-data.js    — 模拟数据
├── assets/           — CSS 与图标
└── corpus/            — 语料库（未来模块，上传播样表/书籍用于生成）
    ├── UPLOAD.md      — 语料库使用说明
    └── README.md

---

## 游戏规则（原版模拟）

| 属性 | 初始值 | 死亡条件 | 担当者 |
|-----------|-----------|-------------------|------------|
| 自尊心 | 50 | = 0 即死亡 | 孩子（消极） |
| 社交性 | 50 | = 0 即死亡 | 爸爸（顾家居宴） |
| 感受性 | 50 | = 0 即死亡 | 妈妈（无条件消费） |
| 顺应性 | 50 | = 0 即死亡 | 孩子（扭曲） |
| 压力值 | 0  | = 100 即死亡 | 异性朋友（分担压力） |

**游戏结束条件：**
- 任何属性达到 0 或压力达到 100 → 游戏结束（全员失败）
- 安全度过全部生活阶段 → 属性最高的观察者胜利

---

## 贡献与开发

欢迎 PR！新增主题：

1. 在 `themes/` 下创建文件夹（英文名）
2. 写 `theme.json` — 主题配置
3. 写 `scenarios/` — 场景题库
4. 提 PR 即可合并入主 Cabin

---

MIT License | 开发者：您的 GitHub ID
