# Five Studio Official Website (`fivvestudio.com`)

Official static website for **Five Studio** — *Make Small. Play Big.*

Hosted on **GitHub Pages** with zero build steps (pure HTML / CSS / JS + SVG).

## 目录结构

```text
.
├── index.html                 # 工作室首页（含首款游戏 POOOP 展示）
├── styles.css                 # 全站样式（暗森绿 + 酸绿 #B7FC49 + 珊瑚红 #E76E63）
├── app.js                     # 像素点阵背景、移动端导航、一键复制邮箱
├── privacy/index.html         # 英文隐私政策页（Steamworks 后台必填：https://fivvestudio.com/privacy/）
├── 404.html                   # 自定义 404 页面
├── assets/
│   ├── favicon.svg            # 浏览器标签图标
│   ├── logo-mark.svg          # 导航与 404 页面手柄图标
│   ├── logo-horizontal.svg    # 横版完整 Logo
│   ├── logo-mono-white.svg    # 纯白反色 Logo
│   ├── og-cover.png           # 1200×630 社交分享封面图
│   ├── pooop-keyart.png       # 1280×720 POOOP 官方宣传图
│   └── pooop/                 # POOOP 透明角色图鉴预览精灵（240×240）
├── .nojekyll                  # 禁用 Jekyll 构建，原样发布静态文件
├── robots.txt
└── sitemap.xml
```

## 本地预览

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```

## 后续常见修改

1. **POOOP Steam 商店页过审上线后**：编辑 `index.html` 中 `#games` 区块，将 `Coming Soon on Steam` 状态标签替换为 `<a class="btn btn-primary" href="https://store.steampowered.com/app/5438440/" target="_blank" rel="noopener noreferrer">Wishlist on Steam</a>`（或 `View on Steam`），并将状态芯片同步更新为 `Out Now on Steam` / `Coming Soon`。
2. **新增或修改社媒链接**：编辑 `index.html` 中 `#socials` 区块。
3. **更新后发布**：直接 `git commit && git push`，GitHub Pages 会自动在 1 分钟内上线。

## Spaceship DNS 绑定自定义域名（不影响 Spacemail）

登录 **Spaceship → Advanced DNS**，**保留所有原有的 MX / TXT(SPF/DKIM/DMARC) 邮件记录不要删**，仅添加以下解析记录：

| Type | Host | Value |
| :--- | :--- | :--- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `changjiangi.github.io` |

生效后，在 GitHub 仓库 **Settings → Pages** 勾选 **Enforce HTTPS** 即可。
