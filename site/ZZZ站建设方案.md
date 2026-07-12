# ZZZ Database 站建设方案

> 对标：zenless.gg（竞品）
> 数据源：zenless-zone-zero.fandom.com / prydwen.gg
> 模板：复用 Wuthering 站 build 管道
> 日期：2026-07-12

---

## 一、站点定位

| 维度 | Wuthering 站 | ZZZ 站 |
|---|---|---|
| 游戏类型 | 开放世界动作 RPG | 都市动作 RPG（箱庭） |
| 核心数据 | 角色 ×68，武器 ×48，回声 ×41 | Agent ×37，W-Engine ×55，Drive Disc ×30，Bangboo ×20 |
| 核心工具 | Build Planner | Build Planner（配装器） |
| 流量词 | "jinhsi build" "wuthering tier list" | "miyabi build" "ZZZ tier list" |
| 竞品 | wuthering.gg（16K 月流量） | zenless.gg（16K 月流量） |

---

## 二、全站结构

```
ZZZ/
├─ index.html                   首页
├─ /agents/                     角色列表（7列网格）
├─ /agents/{slug}/              角色详情页
├─ /w-engines/                  音擎列表（7列网格）
├─ /w-engines/{slug}/           音擎详情页
├─ /drive-discs/                驱动盘列表（卡片）
├─ /drive-discs/{slug}/         驱动盘详情
├─ /tier-list/                  梯度榜（S/A/B/C/D）
├─ /build-planner/              配装器（选择页+编辑页）
├─ /bangboo/                    邦布数据库
├─ /items/                      材料表格式列表
├─ /codes/                      兑换码页
├─ /data/
│   ├─ /agents/
│   ├─ /w-engines/
│   ├─ /drive-discs/
│   └─ /bangboo/
├─ /images/
│   ├─ /agents/
│   ├─ /w-engines/
│   └─ /drive-discs/
├─ /scripts/
│   ├─ build.js
│   └─ build-*.js
└─ shared.css
```

---

## 三、色系规范

| 变量 | 值 | 用途 |
|---|---|---|
| `--bg` | `#0a0a1a` | 全站页面背景（ZZZ深色霓虹风） |
| `--surface` | `#12122a` | 卡片/面板背景 |
| `--accent` | `#00e5ff` | 全局强调色（ZZZ青蓝霓虹） |
| `--accent2` | `#f500c7` | 二级强调（ZZZ粉红霓虹） |
| `--text` | `#ffffff` | 正文 |
| `--text2` | `#8899aa` | 辅助文字 |
| `--text3` | `#556677` | 小字 |
| `--border` | `rgba(0,229,255,0.12)` | 默认边框 |
| `--nav-bg` | `#0d0d22` | 导航栏 |
| 字体 | Inter 400/500/600 | 全站 |
| 圆角 | 12px | 所有组件 |

---

## 四、导航结构

```
[⚡ Logo]  Agents  Tier List  Database ▾  Build Planner  Codes
                                     ├─ W-Engines
                                     ├─ Drive Discs
                                     └─ Bangboo
```

---

## 五、分阶段实施

### Phase 1：基础设施（0.5 天）
- 创建目录 + wrangler.jsonc
- 从 Wuthering 复制 shared.css + 改 ZZZ 色系
- 首页 + 导航

### Phase 2：Agent 数据库（1 天）
- 数据提取：wiki API → JSON（37+ Agents）
- 列表页 + 详情页 + 图片

### Phase 3：W-Engine + Drive Discs（1 天）
- W-Engine 数据 + 列表 + 详情
- Drive Disc 数据 + 列表 + 详情

### Phase 4：Tier List + Build Planner（0.5 天）
- Tier List（复用 Wuthering 模板）
- Build Planner（改 Agent + W-Engine + Disc 选项）

### Phase 5：Bangboo + 辅助页面（0.5 天）
- Bangboo 列表 + 详情
- Items + Codes

### Phase 6：SEO + 上线（0.5 天）

---

## 六、与 Wuthering 站的复用

| 组件 | 复用率 |
|---|---|
| build.js 管道 | 90% |
| shared.css | 70%（改色系） |
| 导航组件 | 95% |
| 卡片组件 | 90% |
| 表格组件 | 90% |
| Build Planner | 85%（Agent/W-Engine/Disc 替换角色/武器/回声） |
| Tier List | 95% |
| SEO 模板 | 90% |
