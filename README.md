# 陶池邦的学术主页

中英双语个人学术主页，采用简洁的白底单栏布局。首屏提供邮箱、GitHub 和 PDF CV 下载，正文包含教育与成绩、研究经历、项目、Publications、精选竞赛、荣誉和可滚动 News。

- 网站：https://cybertime-cs.github.io/
- 英文：https://cybertime-cs.github.io/en/
- 源码：https://github.com/cybertime-cs/cybertime-cs.github.io

## 本地开发

需要 Node.js 24 和 npm。

首次下载项目、缺少依赖，或需要按更新后的锁文件重新安装依赖时，先执行 `npm ci`。安装前请在本项目所有预览终端按 `Ctrl+C`，等程序退出，避免 Windows 下文件被占用。

```sh
npm ci
```

日常更换照片、修改文字或栏目内容，不需要重新安装依赖。只需启动预览：

```sh
npm run dev
```

打开 http://localhost:3000/ ，英文版为 http://localhost:3000/en/ 。预览已在运行时直接修改并保存文件即可；确认效果后，在预览终端按 `Ctrl+C` 停止，再执行发布前检查：

```sh
npm run build
npm run check
npm run lint
```

`npm run build` 生成可部署的纯静态 `out/` 目录。检查涵盖中英文文档语言、所有章节、导航锚点、SEO 元信息、本地资源及 CV 链接。

详细操作请看 [个人主页维护指南](维护指南.md)。

## 日常更新

个人资料集中在 **`content/profile.ts`**。中文和英文用 `{ zh: '中文', en: 'English' }` 分开填写，页面共用同一套布局。

| 字段 | 内容 |
| --- | --- |
| `name`, `role`, `affiliation`, `department` | 姓名、身份、学校和学院 |
| `email`, `secondaryEmail`, `github` | 首屏联系方式与 GitHub 链接 |
| `photo` | 新照片路径，例如 `files/portrait.jpg`；空值时显示姓名缩写 |
| `cv` | 中英文 PDF 路径，当前为 `files/cv-zh.pdf` 和 `files/cv-en.pdf` |
| `introduction` | 精简个人简介 |
| `education`, `metrics`, `courses` | 教育、GPA、排名、课程信息 |
| `experience`, `projects`, `skills` | 研究经历、项目贡献、技术能力 |
| `publications` | 论文列表，当前为空，页面显示“目前暂无论文发表” |
| `competitions`, `honors` | 精选竞赛、奖学金和荣誉 |
| `news` | 按时间倒序排列的简短动态 |
| `updated` | 最近一次资料更新时间 |

### 添加 News

在 `news` 数组的开头添加一条，日期可以是 `YYYY`、`YYYY-MM` 或 `YYYY-MM-DD`，不要填不确定的日期。内容只需一句话，可选 `url` 链接到成果。

```ts
{
  date: 'YYYY-MM',
  text: {
    zh: '在这里写一句真实的新进展。',
    en: 'Write the corresponding update in English.',
  },
  // url: '成果的完整链接',
},
```

News 使用固定高度滚动区域，支持鼠标滚轮、触摸和键盘。更多条目不会把页面无限拉长。

### 添加论文

论文记录包含正式题名、作者、会议或期刊、年份和状态，支持摘要、PDF、代码、DOI 与 BibTeX。

- `published`：已发表
- `preprint`：预印本
- `submitted`：投稿中

保持真实发表状态；不要将投稿与录用混淆。未配置的论文链接不会生成按钮。

### 替换照片和简历

新照片放进 `public/files/`，然后修改 `photo`。当前没有使用原始简历照片。

中英文公开 CV 已放在 `public/files/cv-zh.pdf` 和 `public/files/cv-en.pdf`。日后更新个人经历时，也同步更新这两份 PDF。网页上的下载链接会根据页面语言选择对应文件。原始 Word 简历不在公开仓库中。

## GitHub Pages 发布

仓库名称必须是 `cybertime-cs.github.io`，对应根网址 https://cybertime-cs.github.io/ 。

仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。推送到 `main` 或 `master` 后，`.github/workflows/deploy.yml` 自动构建、检查并部署 `out/`。

`content/profile.ts` 的 `site.origin` 与 `site.basePath` 控制网站地址；`next.config.ts` 的 `basePath` 保持一致。当前根站点的 `basePath` 是空字符串。若将来变更账号或域名，请同步修改链接和 CV。

## 实现说明

- React + Vinext，使用项目自己的导出脚本按实际公开 URL 生成静态 HTML；无需运行后端服务器。
- 语言切换使用普通链接并保留所在章节。禁用 JavaScript 仍能阅读页面、切换语言和下载 CV。
- 使用系统字体，无外部字体服务、访问统计或第三方图片依赖。
- 全身大白图标跟随鼠标，保留原生指针，在触屏及“减少动画”设置下关闭。
- 支持响应式布局、跳过导航、键盘焦点与打印；News 使用已安装的可访问性滚动组件。
- 每种语言都有独立 URL、页面语言、canonical、hreflang 和 Person 结构化数据。
- 页面结构参考 [Jon Barron](https://jonbarron.info/) 与 [Deepak Pathak](https://www.cs.cmu.edu/~dpathak/)，未复制他们的个人内容。

```text
content/profile.ts           个人资料和网站地址
lib/copy.ts                  中英文界面文案
components/academic-page.tsx 页面栏目
components/interactions.tsx  语言锚点、大白鼠标挂件、引用复制
app/globals.css              样式与响应式/打印适配
public/files/                公开照片、简历和论文
scripts/export-static.mjs    导出公开页面和资源
scripts/check-static.mjs     检查静态输出
.github/workflows/deploy.yml 自动部署
```
