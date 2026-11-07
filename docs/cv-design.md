# 简历排版与资料来源

## 版式参考

本次重新排版参考了以下公开中文简历案例的结构与排版方式，没有复制其示例经历或成果：

- [ZilongXie / Resume-Chinese](https://github.com/ZilongXie/Resume-Chinese)：紧凑的基础信息、分节、日期右对齐、以经历内容为主。
- [forfrt / cn_resume](https://github.com/forfrt/cn_resume)：中文正文与西文的字体搭配、清晰的章节层级和规则对齐。

当前实现为原创 ReportLab 排版：居中姓名与联系方式，中文宋体正文配黑体标题，西文 Times New Roman；黑白细分隔线；奖项年份统一靠右。燕宝奖学金放在荣誉首项，获奖比例使用暗红，本年级唯一获奖者说明加粗。两种语言各一页。

## 数据范围

- 主页与 PDF 共用的排名、奖项来自用户更新的 `content/profile.ts`。当前排名 3/175，前 1.71%。
- 燕宝奖学金的“获奖比例 0.3%”和“本年级唯一获奖者”均为用户提供的资料；未自行扩大为全国排名或指定统计分母。
- 论文题名和完整作者顺序依据 [arXiv:2603.07904](https://arxiv.org/abs/2603.07904) 核对，Chibang Tao 在原始作者顺序中加粗；未标注未提供的共同一作或个人贡献。
- “ICLR 2027 在投”是用户提供的投稿状态。中英文均以在投/Under review 表述，不作为录用论文。
- 该论文仅列入 PDF CV。元数据位于 `content/cv-only.json`，主页的 `publications` 数组保持为空。

资料核对与更新日期：2026-11-08。
