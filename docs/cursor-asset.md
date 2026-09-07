# 全身大白鼠标图标

网页素材：`public/baymax-full-body.png`，透明背景，144×144 像素，显示尺寸为 48×48 CSS 像素。

## 来源

- 素材：[Baymax Clipart Group Bay Max - Drawing](https://www.clipartmax.com/middle/m2i8Z5i8i8A0G6A0_baymax-clipart-group-bay-max-drawing/)
- [素材下载页](https://www.clipartmax.com/max/m2i8Z5i8i8A0G6A0/)
- [原始透明 PNG](https://www.clipartmax.com/png/full/97-974808_baymax-clipart-group-bay-max-drawing.png)
- 来源页面标注 `License: Personal Use`，并明确提供个人网站/博客嵌入方式。当前用于非商业个人学术主页。页面未提供原作者完整授权信息；这里记录来源声明，不将它标注为公有领域、开源素材或迪士尼官方授权。
- 原图脚部的小署名随图完整保留，没有裁剪或抹除。
- 来源核对日期：2026-09-07。

## 小尺寸适配

实际下载到的原始 PNG 为 959×1176，含真实透明通道。中等尺寸预览图带有棋盘格，未用于网页。

只进行了等比例缩小，并置于 144×144 的透明正方形画布中，未裁切人物或改变造型。头、躯干、双手和双脚完整显示。网页以 48×48 显示，并通过 CSS 添加很淡的边缘阴影，让白色身体在白色背景上清晰可辨。

当前图标使用上述现成素材；没有采用生成失败的图像。PNG 随网站一起部署，网页不会向素材网站请求图片。

## 网页接入

- 图片引用：`components/interactions.tsx` 中的 `sitePath('baymax-full-body.png')`。
- 显示大小、淡阴影和指针偏移：`app/globals.css` 的 `#cursor-companion > img`。
- 挂件不接收点击；系统设置减少动画、触屏、离开页面时自动隐藏。
