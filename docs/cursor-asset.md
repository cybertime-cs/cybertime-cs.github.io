# 大白鼠标图标

网页素材：`public/baymax-cursor.png`，透明背景，96×96 像素，显示尺寸为 36×36 CSS 像素。

## 来源

- 作品：[Baymax Face.svg](https://commons.wikimedia.org/wiki/File:Baymax_Face.svg)
- 作者：FASTILY；页面记录的后续修订者为 FastilyClone。
- [原始 SVG 下载](https://upload.wikimedia.org/wikipedia/commons/c/cf/Baymax_Face.svg)
- 原始文件保存在同目录的 `baymax-face-original.svg`。
- 来源页面将这份简单几何图形标为公有领域（PD-textlogo，未达到著作权原创性门槛）。这里记录的是该素材页面的声明，并非迪士尼授权声明。
- 来源核对日期：2026-09-07。

## 小尺寸适配

保留原始脸部轮廓、眼睛和连接线的位置。将脸部内部填充为白色，将原 SVG 的描边宽度从 2 调整为 8，使轮廓在小尺寸下清晰可见。以等比缩放方式置于 96×96 的透明画布中，再导出为 PNG；没有拉伸脸部比例。

当前图标来自上述现成矢量素材，没有使用图像生成模型。图标随网站一起部署，网页不会向维基共享资源请求图片。

## 网页接入

- 文件路径：`components/interactions.tsx` 中的 `sitePath('baymax-cursor.png')`。
- 显示大小和指针偏移：`app/globals.css` 的 `#cursor-companion > img`。
- 挂件不接收点击；系统设置减少动画、触屏、离开页面时自动隐藏。
