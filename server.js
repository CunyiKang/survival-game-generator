/**
 * 游戏服务器 - v2.0
 * 支持：多主题、AI题库生成、角色系统
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const THEMES_DIR = path.join(__dirname, 'themes');
const MOCK_DATA_PATH = path.join(__dirname, 'src', 'scenarios.json');
const CONFIG_PATH = path.join(__dirname, 'config.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  try {
    // API 路由
    if (pathname.startsWith('/api/')) {
      await handleAPI(req, res, pathname, url);
      return;
    }

    // 静态文件
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain; charset=utf-8';

    // JS/CSS 文件设置无缓存
    const headers = {
      'Content-Type': contentType,
    };
    if (ext === '.js' || ext === '.css') {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    res.end(fs.readFileSync(filePath));

  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error: ' + err.message);
  }
});

// === API 处理 ===

async function handleAPI(req, res, pathname, url) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // GET /api/themes - 获取主题列表
  if (pathname === '/api/themes' && req.method === 'GET') {
    const themes = loadAllThemes();
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, themes }));
    return;
  }

  // GET /api/theme/:id - 获取单个主题
  const themeMatch = pathname.match(/^\/api\/theme\/([a-zA-Z0-9_-]+)$/);
  if (themeMatch && req.method === 'GET') {
    const themeId = themeMatch[1];
    const theme = loadTheme(themeId);
    if (theme) {
      res.writeHead(200);
      res.end(JSON.stringify(theme));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: '主题不存在' }));
    }
    return;
  }

  // POST /api/generate-scenarios - AI 生成题库
  if (pathname === '/api/generate-scenarios' && req.method === 'POST') {
    const body = await readBody(req);
    const { themeId, stage, count = 5 } = JSON.parse(body);
    const theme = loadTheme(themeId);
    if (!theme) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: '主题不存在' }));
      return;
    }
    const scenarios = await generateScenarios(theme, stage, parseInt(count));
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, scenarios }));
    return;
  }

  // GET /api/mock-scenarios - 获取模拟数据
  if (pathname === '/api/mock-scenarios' && req.method === 'GET') {
    try {
      const mockData = extractMockData();
      res.writeHead(200);
      res.end(JSON.stringify(mockData));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // POST /api/judge - AI 裁判评分
  if (pathname === '/api/judge' && req.method === 'POST') {
    const body = await readBody(req);
    const data = JSON.parse(body);
    const judge = await getAIJudge(data);
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, judge }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: '未知 API' }));
}

// === 主题加载 ===

function loadAllThemes() {
  const themes = [];
  if (!fs.existsSync(THEMES_DIR)) return themes;

  fs.readdirSync(THEMES_DIR).forEach(dir => {
    const configPath = path.join(THEMES_DIR, dir, 'theme.json');
    if (fs.existsSync(configPath)) {
      try {
        const theme = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        themes.push({
          id: theme.id,
          name: theme.name,
          icon: theme.icon,
          description: theme.description,
          stages: theme.stages || ['童年', '少年', '青年', '中年', '老年'],
          roleCount: (theme.roles || []).length,
          hasScenarios: fs.existsSync(path.join(THEMES_DIR, dir, 'scenarios'))
        });
      } catch (e) {
        console.error(`加载主题失败 ${dir}:`, e.message);
      }
    }
  });
  return themes;
}

function loadTheme(themeId) {
  const configPath = path.join(THEMES_DIR, themeId, 'theme.json');
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

// === AI 生成 ===

async function generateScenarios(theme, stage, count = 5) {
  // 加载 API 配置
  let apiConfig = { provider: 'openai', model: 'gpt-3.5-turbo', apiKey: '' };
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const match = content.match(/apiKey:\s*['"]([^'"]+)['"]/);
      const providerMatch = content.match(/provider:\s*['"]([^'"]+)['"]/);
      const modelMatch = content.match(/model:\s*['"]([^'"]+)['"]/);
      if (match) apiConfig.apiKey = match[1];
      if (providerMatch) apiConfig.provider = providerMatch[1];
      if (modelMatch) apiConfig.model = modelMatch[1];
    }
  } catch (e) {
    console.error('加载配置失败:', e.message);
  }

  if (!apiConfig.apiKey) {
    return { error: '请先在 config.js 中配置 API Key' };
  }

  const systemPrompt = theme.systemPrompt || `你是《${theme.name}》游戏设计师。`;
  
  const userPrompt = `请为《${theme.name}》生成 ${count} 道关于"${stage}"阶段的题目。

主题：${theme.description}
阶段：${stage}

请生成 ${count} 个情景，每个情景格式如下（严格 JSON 数组格式）：

{
  "id": "scenario_1",
  "stage": "${stage}",
  "title": "情景标题",
  "description": "情景描述，100-200字，详细描述背景和冲突",
  "options": [
    {
      "id": "opt_a",
      "text": "选项A描述",
      "effects": {
        "self_自尊心": -10,
        "self_社交性": +5,
        "self_压力值": +15,
        "father_自尊心": 0,
        ...
      }
    }
  ]
}

角色列表：
${(theme.roles || []).map(r => `- ${r.name} (${r.id}): 守护属性 ${r.guardian}`).join('\n')}

请只输出 JSON 数组，不要其他文字。`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API 错误 ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // 提取 JSON
    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    
    const scenarios = JSON.parse(jsonStr);
    return { success: true, scenarios };

  } catch (e) {
    return { success: false, error: e.message };
  }
}

// === AI 裁判 ===

async function getAIJudge(data) {
  const { scenario, choice, statsBefore, statsAfter, themeName } = data;
  
  let apiConfig = { provider: 'openai', model: 'gpt-3.5-turbo', apiKey: '' };
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const match = content.match(/apiKey:\s*['"]([^'"]+)['"]/);
      if (match) apiConfig.apiKey = match[1];
    }
  } catch (e) {}

  if (!apiConfig.apiKey) {
    return '（AI 裁判需要配置 API Key）';
  }

  const prompt = `你是《${themeName}》游戏的 AI 裁判。请对玩家的选择给出简短评价（50-100字）。`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `情景：${scenario}\n选择：${choice}\n选择前状态：${JSON.stringify(statsBefore)}\n选择后状态：${JSON.stringify(statsAfter)}` }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '（无评价）';

  } catch (e) {
    return `（评价生成失败: ${e.message}）`;
  }
}

// === 模拟数据提取 ===

function extractMockData() {
  if (!fs.existsSync(MOCK_DATA_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(MOCK_DATA_PATH, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('解析 mock 数据失败:', e.message);
    return [];
  }
}

// === 工具函数 ===

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// === 启动 ===

server.listen(PORT, () => {
  const themes = loadAllThemes();
  const themeNames = themes.map(t => `${t.icon} ${t.name}`).join(', ');
  console.log('');
  console.log('🎮 王智慧生存游戏生成器');
  console.log('   服务已启动: http://localhost:' + PORT);
  console.log('   主题数量:', themes.length);
  console.log('   主题列表:', themeNames || '无');
  
  // 加载 API 配置
  let apiConfig = '未配置';
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const match = content.match(/apiKey:\s*['"]([^'"]+)['"]/);
      apiConfig = match ? '已配置 ✅' : '未配置 ❌';
    }
  } catch (e) {}
  console.log('   API:', apiConfig);
});
