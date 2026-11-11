"""Build the two public CV PDFs from profile.ts plus PDF-only paper metadata.

Run with a Python environment containing reportlab and pypdf. This script does
not edit the homepage's publications array. Review rendered PDFs before copying
output/pdf/cv-*.pdf to public/files/.
"""
import json
import re
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' / 'pdf'
OUT.mkdir(parents=True, exist_ok=True)
profile = json.loads(subprocess.check_output(
    ['node', '--input-type=module', '-e',
     'import {profile} from "./content/profile.ts"; process.stdout.write(JSON.stringify(profile));'],
    cwd=ROOT, encoding='utf-8'))
cv_only = json.loads((ROOT / 'content/cv-only.json').read_text(encoding='utf-8'))

FONT_DIR = Path('C:/Windows/Fonts')
for name, filename, index in [('Song', 'simsun.ttc', 0), ('Hei', 'simhei.ttf', 0),
                               ('Times', 'times.ttf', 0), ('TimesB', 'timesbd.ttf', 0),
                               ('TimesI', 'timesi.ttf', 0)]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename), subfontIndex=index))
pdfmetrics.registerFontFamily('Song', normal='Song', bold='Hei', italic='Song', boldItalic='Hei')
pdfmetrics.registerFontFamily('Times', normal='Times', bold='TimesB', italic='TimesI', boldItalic='TimesB')
PAGE_W, PAGE_H = A4
LEFT = 43
WIDTH = PAGE_W - 2 * LEFT
RED = '#b91c1c'


def safe(text):
    return escape(str(text)).replace('\u2014', '-').replace('\u2013', '-')


def mixed_fonts(text, bold=False):
    """Set Latin runs in Times while retaining Song/Hei for Chinese glyphs."""
    output, bold_depth = [], int(bold)
    for part in re.split(r'(<[^>]+>|&[A-Za-z0-9#]+;)', text):
        if part.startswith('<'):
            if part == '<b>':
                bold_depth += 1
            elif part == '</b>':
                bold_depth -= 1
            output.append(part)
        elif part.startswith('&'):
            output.append(part)
        else:
            face = 'TimesB' if bold_depth else 'Times'
            output.append(re.sub(r'[A-Za-z0-9][A-Za-z0-9 ,.:/%()|+\-]*',
                                 lambda match: f'<font name="{face}">{match[0]}</font>', part))
    return ''.join(output)


class CV:
    def __init__(self, lang):
        self.lang = lang
        self.font = 'Song' if lang == 'zh' else 'Times'
        self.bold = 'Hei' if lang == 'zh' else 'TimesB'
        self.size = 10.6 if lang == 'zh' else 10.5
        self.leading = 15.1 if lang == 'zh' else 14.0
        self.y = PAGE_H - 34
        self.path = OUT / f'cv-{lang}.pdf'
        self.c = canvas.Canvas(str(self.path), pagesize=A4, pageCompression=1)
        self.c.setTitle(f'{profile["name"][lang]} - ' + ('学术简历' if lang == 'zh' else 'Academic CV'))
        self.c.setAuthor(profile['name']['en'])

    def p(self, text, size=None, leading=None, bold=False, align=0, after=0,
          x=LEFT, width=WIDTH, color='#111111'):
        style = ParagraphStyle('line', fontName=self.bold if bold else self.font,
                               fontSize=size or self.size, leading=leading or self.leading,
                               textColor=colors.HexColor(color), alignment=align,
                               wordWrap='CJK' if self.lang == 'zh' else None)
        paragraph = Paragraph(mixed_fonts(text, bold) if self.lang == 'zh' else text, style)
        _, height = paragraph.wrap(width, PAGE_H)
        paragraph.drawOn(self.c, x, self.y - height)
        self.y -= height + after

    def section(self, zh, en):
        self.y -= 8
        self.p(zh if self.lang == 'zh' else en, size=11.4, leading=15, bold=True)
        self.c.setLineWidth(0.45)
        self.c.setStrokeColor(colors.HexColor('#333333'))
        self.c.line(LEFT, self.y - 2, PAGE_W - LEFT, self.y - 2)
        self.y -= 7

    def row(self, text, date='', bold=False, after=1):
        top = self.y
        date_font = self.font if re.search(r'[\u4e00-\u9fff]', date) else 'Times'
        date_width = max(52, pdfmetrics.stringWidth(date, date_font, 9.7) + 12) if date else 0
        self.p(text, width=WIDTH - date_width, bold=bold, after=after)
        if date:
            self.c.setFillColor(colors.HexColor('#333333'))
            self.c.setFont(date_font, 9.7)
            self.c.drawRightString(PAGE_W - LEFT, top - self.leading + 3, safe(date))

    def entry(self, title, desc):
        self.p(title, bold=True, after=0)
        self.p(desc, after=4, x=LEFT + 10, width=WIDTH - 10)

    def header(self):
        zh = self.lang == 'zh'
        self.p(safe(profile['name'][self.lang]), size=23, leading=29, bold=True, align=1, after=3)
        self.p('西北工业大学 计算机学院 · 计算机科学与技术本科生' if zh else
               'Northwestern Polytechnical University | School of Computer Science',
               size=10.2, leading=14, align=1, after=2)
        contact = (f'<link href="mailto:{profile["email"]}">{profile["email"]}</link>'
                   ' &nbsp; | &nbsp; <link href="https://github.com/cybertime-cs">github.com/cybertime-cs</link>'
                   ' &nbsp; | &nbsp; <link href="https://cybertime-cs.github.io/">cybertime-cs.github.io</link>')
        self.p(contact, size=9.4, leading=13, align=1, after=1)

    def finish(self):
        if self.y < 35:
            raise RuntimeError(f'{self.lang}: content exceeds the single-page layout: y={self.y:.1f}')
        self.c.setFont(self.font, 7.8)
        self.c.setFillColor(colors.HexColor('#666666'))
        label = '更新：' if self.lang == 'zh' else 'Updated: '
        self.c.drawRightString(PAGE_W - LEFT, 21, label + profile['updated'])
        self.c.save()
        reader = PdfReader(self.path)
        assert len(reader.pages) == 1
        text = reader.pages[0].extract_text()
        required = ['0.3%', 'ICLR 2027', 'DyQ-VLA', 'Chibang Tao', profile['updated']]
        for token in required:
            assert token in text, (self.lang, token)
        assert ('在投' if self.lang == 'zh' else 'Under review') in text
        (OUT / f'cv-{self.lang}-text.txt').write_text(text, encoding='utf-8')
        print(f'{self.path}: 1 page; content bottom {self.y:.1f} pt')


def build(lang):
    zh = lang == 'zh'
    cv = CV(lang)
    cv.header()
    cv.section('教育背景', 'Education')
    cv.row('<b>西北工业大学</b> · 计算机学院 · 计算机科学与技术' if zh else
           '<b>Northwestern Polytechnical University</b> - Computer Science and Technology',
           profile['education'][0]['period'][lang].replace(' ', '') if zh else profile['education'][0]['period'][lang])
    cet6 = next(metric for metric in profile['metrics'] if metric['label']['en'] == 'CET-6')
    cv.p(f'CET-6: {safe(cet6["value"])}')
    cv.p('研究兴趣：VLA、WAM、多模态感知、大语言模型。' if zh else
         'Research interests: VLA, WAM, multimodal perception, and large language models.')

    cv.section('荣誉奖励', 'Honors &amp; Scholarships')
    yanbao = profile['honors'][0]
    cv.row('<b>' + safe(yanbao['title'][lang]) + '</b>' +
           ('（2025-2026 学年度）' if zh else ' (2025-2026 academic year)'), '2026')
    cv.p((f'<b><font color="{RED}">获奖比例 0.3%</font>；本年级唯一获奖者。</b>' if zh else
          f'<b><font color="{RED}">0.3% recipient rate</font>; sole recipient in my cohort.</b>'),
         x=LEFT + 10, width=WIDTH - 10, after=2)
    for year, academic_year in [('2026', '2025-2026'), ('2025', '2024-2025')]:
        cv.row(f'<b>国家奖学金</b>（{academic_year} 学年度）' if zh else
               f'<b>National Scholarship</b> ({academic_year} academic year)', year)
    for year, academic_year in [('2026', '2025-2026'), ('2025', '2024-2025')]:
        cv.row(f'校一等奖学金（{academic_year} 学年度）' if zh else
               f'University First-class Scholarship ({academic_year} academic year)', year)

    cv.section('研究论文', 'Research Paper')
    for paper in cv_only['papers']:
        cv.p(f'<b><link href="{paper["url"]}">{safe(paper["title"])}</link></b>', after=1)
        authors = ', '.join('<b>' + safe(name) + '</b>' if name == profile['name']['en'] else safe(name)
                            for name in paper['authors'])
        cv.p(authors + '.', size=9.4, leading=11.8, after=1)
        cv.p('<b>' + safe(paper['status'][lang]) + '</b>' +
             f' &nbsp; | &nbsp; <link href="{paper["url"]}">arXiv:2603.07904</link>', after=0)

    cv.section('科研与项目经历', 'Research &amp; Project Experience')
    if zh:
        entries = [
            ('ASLP 语音实验室｜科研实习', '参与语音数据测试链路与 SeedAudio 链路搭建，学习并实践深度学习方法。'),
            ('舞蹈机器人基地｜软件组成员', '使用 OpenCV、Vosk、Whisper 部署和调试视觉、语音及韵律模块；协作开发舵机动作调试软件，团队相关成果取得两项软件著作权。'),
            ('Qwen3.5-0.8B 的 LoRA 微调', '完成环境配置、数据加载和训练脚本；跟踪并分析训练损失与准确率。'),
            ('YOLOv8 机器人目标检测', '完成日常物体图像采集、清洗、标注及训练/验证集划分，参与模型训练与调参。')]
    else:
        entries = [
            ('ASLP Speech Laboratory | Research Intern', 'Contributed to speech-data testing and SeedAudio pipelines; studied and applied deep learning methods.'),
            ('Dancing Robotics Group | Software Team Member', 'Deployed vision, speech and rhythm modules with OpenCV, Vosk and Whisper. Co-developed servo debugging tools; related team work received two software copyright registrations.'),
            ('LoRA Fine-tuning of Qwen3.5-0.8B', 'Implemented environment setup, data loading and training scripts; tracked training loss and accuracy.'),
            ('YOLOv8 Object Detection for Robotics', 'Collected, cleaned and annotated everyday-object images, split training/validation sets, and contributed to training and tuning.')]
    for title, desc in entries:
        cv.entry(title, desc)

    cv.section('竞赛获奖', 'Competition Awards')
    for i, award in enumerate(profile['competitions']):
        if zh:
            title = award['title']['zh'].replace('机器人大赛中国赛总决赛', '中国总决赛 · ').replace('机器人大赛中国赛专项赛', '中国专项赛 · ')
            label = safe(title) + '：' + safe(award['distinction']['zh'])
        else:
            title = award['title']['en'].replace(' — Dancing Robot ', ' / Dance ').removesuffix(' Competition')
            label = safe(title) + ': ' + safe(award['distinction']['en'])
        cv.row(label, award['year'], after=0)

    cv.section('技能', 'Skills')
    cv.p('编程：C/C++、Python、Java；Codeforces 1400+（Specialist）。' if zh else
         'Programming: C/C++, Python, Java; Codeforces 1400+ (Specialist).')
    cv.finish()


if __name__ == '__main__':
    build('zh')
    build('en')
