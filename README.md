# 🎭 生存游戏生成器

[![GitHub Stars](https://img.shields.io/github/stars/CunyiKang/survival-game-generator?style=social)](https://github.com/CunyiKang/survival-game-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-green)](https://cunyikang.github.io/survival-game-generator)

> **输入一个 AI API Key，就能自动生成任意主题的"李智慧生存游戏"桌游！**

基于经典桌游《李智慧生存游戏》的多人共情游戏引擎，支持 AI 自动生成题目、自定义主题、多人团体模式。

🎮 **在线体验**: [https://cunyikang.github.io/survival-game-generator](https://cunyikang.github.io/survival-game-generator)

---

## ✨ 特性

- 🤖 **AI 生成题库** — 输入 API Key 即可自动生成任意主题的场景题目
- 🎯 **6 个内置主题** — 女性困境、抑郁、精神分裂、焦虑、PTSD、霸凌
- 👥 **多人团体模式** — 支持 2-6 人同时游玩
- 💔 **共情机制** — 主角先做选择，旁观者后评价，真正理解他人处境
- 📊 **详细复盘报告** — 游戏结束后的深度分析与建议
- 🌐 **零部署** — 可直接打开 HTML 游玩，无需服务器

---

## 🎮 游戏玩法

### 核心规则

玩家扮演主角（如"李智慧"）及其身边的人，从童年到老年经历各种人生场景，做出选择并承受后果。

| 属性 | 初始值 | 失败条件 | 守护角色 |
|------|--------|----------|----------|
| 自尊心 | 50 | 归零即失败 | 爸爸 |
| 社会性 | 50 | 归零即失败 | 妈妈 |
| 感受性 | 50 | 归零即失败 | 弟弟 |
| 顺应性 | 50 | 归零即失败 | 同性朋友 |
| 压力值 | 0 | 达100即失败 | 异性朋友 |

**游戏结束条件:**
- ❌ 任何属性归零 → 全员失败
- ❌ 压力值达到 100 → 全员失败
- ✅ 安全度过全部阶段 → 属性最高者获胜

### 游戏流程

```
┌─────────────────────────────────────────────────────┐
│  主角轮：玩家以主角身份做出选择                        │
│          ↓                                          │
│  旁观者评价轮：每个旁观者评价主角的选择                 │
│          ↓                                          │
│  结果结算：根据评价调整属性值                          │
│          ↓                                          │
│  重复直到游戏结束 → 生成复盘报告                       │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 方式一：直接游玩（推荐新手）

1. 克隆项目或下载 ZIP
2. 双击打开 `index.html`
3. 选择主题，开始游戏！

> 使用内置模拟数据，无需 API Key

### 方式二：本地服务器（完整功能）

```bash
# 克隆项目
git clone https://github.com/CunyiKang/survival-game-generator.git
cd survival-game-generator

# 安装依赖
npm install

# 配置 AI API（可选）
# 编辑 config.js，填入你的 API Key

# 启动服务器
npm start

# 浏览器访问
# http://localhost:3000
```

### 方式三：AI 自动生成题库

1. 获取 AI API Key（支持 OpenAI、DeepSeek 等）
2. 编辑 `config.js`：

```javascript
module.exports = {
  // OpenAI 格式
  apiKey: 'sk-your-api-key',
  apiBase: 'https://api.openai.com/v1',
  model: 'gpt-4',
  
  // 或使用 DeepSeek（更便宜）
  // apiBase: 'https://api.deepseek.com/v1',
  // model: 'deepseek-chat',
};
```

3. 启动服务器后，在界面中输入自定义主题，AI 会自动生成题目！

---

## 📁 项目结构

```
survival-game-generator/
├── index.html           # 游戏主页
├── server.js            # Node.js 后端服务
├── config.js            # AI API 配置
├── package.json         # 项目配置
│
├── themes/              # 主题配置
│   ├── general/         # 原版-女性困境
│   ├── depression/      # 抑郁症主题
│   ├── schizophrenia/   # 精神分裂主题
│   ├── anxiety/         # 焦虑症主题
│   ├── ptsd/            # PTSD 主题
│   └── bullying/        # 霸凌主题
│
├── src/
│   ├── game-core.js     # 游戏核心逻辑
│   ├── game-flow.js     # 游戏流程引擎
│   ├── ui-manager.js    # UI 管理器
│   ├── ai-client.js     # AI 客户端
│   └── mock-data.js     # 模拟数据
│
├── assets/
│   ├── styles.css       # 样式文件
│   └── init.js          # 初始化脚本
│
└── README.md            # 本文件
```

---

## 🎨 内置主题

| 主题 | 图标 | 描述 | 适用场景 |
|------|------|------|----------|
| 女性困境 | 🌸 | 还原《李智慧生存游戏》原版 | 女性视角体验 |
| 抑郁症 | 🩶 | 与抑郁共处的生存挑战 | 心理健康科普 |
| 精神分裂 | 🧠 | 幻觉与现实交织的挑战 | 精神疾病理解 |
| 焦虑症 | 😰 | 持续紧张与恐惧的挑战 | 压力管理教育 |
| PTSD | 💔 | 创伤后应激障碍的挑战 | 创伤理解与共情 |
| 霸凌 | 💢 | 被欺凌与自我保护的挑战 | 反霸凌教育 |

---

## 🛠️ 自定义主题

### 创建新主题

1. 在 `themes/` 下创建文件夹（英文命名）

```bash
mkdir themes/my-theme
```

2. 创建 `theme.json` 配置文件：

```json
{
  "id": "my-theme",
  "name": "我的主题",
  "icon": "🎯",
  "description": "主题描述",
  "attributes": [
    { "id": "health", "name": "健康", "icon": "❤️", "initial": 50 },
    { "id": "money", "name": "财富", "icon": "💰", "initial": 50 },
    { "id": "happiness", "name": "幸福感", "icon": "😊", "initial": 50 }
  ],
  "roles": [
    { "id": "father", "name": "父亲", "icon": "👨", "guardAttribute": "health" },
    { "id": "mother", "name": "母亲", "icon": "👩", "guardAttribute": "happiness" }
  ],
  "stages": ["童年", "少年", "青年", "中年", "老年"],
  "protagonist": { "id": "protagonist", "name": "主角", "icon": "🧑" }
}
```

3. 提交 PR 合并到主仓库！

---

## 🤝 贡献指南

欢迎贡献代码、主题、翻译或建议！

### 贡献方式

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

### 开发指南

```bash
# 安装开发依赖
npm install

# 启动开发服务器
npm run dev

# 代码格式化
npm run format
```

---

## 📄 许可证

[MIT License](LICENSE) © 2024

---

## 🙏 致谢

- 灵感来源：《李智慧生存游戏》桌游
- 所有贡献者和主题创作者

---

## 📮 联系方式

- 问题反馈: [GitHub Issues](https://github.com/CunyiKang/survival-game-generator/issues)
- 功能建议: [GitHub Discussions](https://github.com/CunyiKang/survival-game-generator/discussions)

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**
