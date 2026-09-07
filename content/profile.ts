export type Language = 'zh' | 'en';
export type Localized = { zh: string; en: string };
export type Education = { period: Localized; school: Localized; degree: Localized; detail: Localized };
export type Publication = { title: string; authors: string; venue: Localized; year: string; status: 'published' | 'preprint' | 'submitted'; abstract?: Localized; doi?: string; pdf?: string; code?: string; bibtex?: string };
export type Achievement = { year: string; title: Localized; organization: Localized; detail?: Localized; distinction?: Localized; url?: string };
export type Project = { title: Localized; period: string; role: Localized; description: Localized; tags: string[]; url?: string };
export type Profile = {
  ready: boolean; updated: string; name: Localized; initials: string;
  role: Localized; affiliation: Localized; department: Localized; location: Localized;
  photo: string; email: string; secondaryEmail: string; cv: Localized; github: string; scholar: string; openreview: string; orcid: string;
  introduction: Localized[]; interests: { title: Localized; description: Localized }[];
  education: Education[]; metrics: { label: Localized; value: string; note: Localized }[];
  courses: { name: Localized; grade?: string }[];
  experience: { title: Localized; role: Localized; detail: Localized }[];
  publications: Publication[]; projects: Project[]; competitions: Achievement[]; honors: Achievement[];
  skills: { title: Localized; text: Localized }[];
  news: { date: string; text: Localized; url?: string }[];
  personalNote: Localized;
};

// Public academic profile. Keep dates and achievements faithful to your records.
// Images and CVs use paths relative to public/; an empty photo uses initials.
export const profile: Profile = {
  ready: true, updated: '2026-09-07',
  name: { zh: '陶池邦', en: 'Chibang Tao' }, initials: 'CT',
  role: { zh: '计算机科学与技术专业本科生', en: 'Undergraduate in Computer Science' },
  affiliation: { zh: '西北工业大学', en: 'Northwestern Polytechnical University' },
  department: { zh: '计算机学院', en: 'School of Computer Science' },
  location: { zh: '中国 · 西安', en: 'Xi’an, China' },
  photo: '', email: 'tcb@mail.nwpu.edu.cn', secondaryEmail: 't3482379751@gmail.com',
  cv: { zh: 'files/cv-zh.pdf', en: 'files/cv-en.pdf' },
  github: 'https://github.com/cybertime-cs', scholar: '', openreview: '', orcid: '',
  introduction: [
    { zh: '我是西北工业大学计算机学院计算机科学与技术专业的本科生，预计于 2028 年 7 月毕业。我的研究兴趣包括视觉–语言–动作模型（VLA）、WAM、多模态感知与大语言模型。', en: 'I am an undergraduate in Computer Science at Northwestern Polytechnical University, expecting to graduate in July 2028. My research interests include vision-language-action (VLA) models, WAM, multimodal perception, and large language models.' },
    { zh: '我曾在 ASLP 语音实验室参与科研实习，也在校内舞蹈机器人基地的软件组从事机器人感知与调试工作。我的项目涉及大语言模型的参数高效微调、目标检测，以及机器人软硬件协同调试。', en: 'I have undertaken a research internship at the ASLP speech laboratory and worked with the software team of the university’s dancing robotics group. My projects involve parameter-efficient fine-tuning of language models, object detection, and robot software and hardware debugging.' },
  ],
  interests: [],
  education: [{
    period: { zh: '预计 2028 年 7 月毕业', en: 'Expected July 2028' },
    school: { zh: '西北工业大学', en: 'Northwestern Polytechnical University' },
    degree: { zh: '计算机学院 · 计算机科学与技术 · 本科', en: 'Undergraduate in Computer Science and Technology, School of Computer Science' },
    detail: { zh: '', en: '' },
  }],
  metrics: [
    { label: { zh: 'GPA', en: 'GPA' }, value: '3.98 / 4.1', note: { zh: '', en: '' } },
    { label: { zh: '专业排名', en: 'Rank' }, value: '3 / 173', note: { zh: '', en: '' } },
    { label: { zh: '英语六级', en: 'CET-6' }, value: '565', note: { zh: '', en: '' } },
  ],
  courses: [
    { name: { zh: '计算机组成原理', en: 'Computer Organization' } },
    { name: { zh: '数据结构', en: 'Data Structures' } },
    { name: { zh: '算法分析与设计', en: 'Algorithm Analysis and Design' } },
    { name: { zh: '数字逻辑设计', en: 'Digital Logic Design' } },
  ],
  experience: [
    { title: { zh: 'ASLP 语音实验室', en: 'ASLP Speech Laboratory' }, role: { zh: '科研实习', en: 'Research internship' }, detail: { zh: '参与语音数据测试链路构建和 SeedAudio 链路搭建，学习并实践深度学习与神经网络方法。', en: 'Contributed to speech-data testing pipelines and a SeedAudio pipeline, while studying and applying deep learning methods.' } },
    { title: { zh: '舞蹈机器人基地', en: 'Dancing Robotics Group' }, role: { zh: '软件组成员', en: 'Software team member' }, detail: { zh: '参与机器人视觉、语音及韵律模块的部署与调试，使用 OpenCV、Vosk 和 Whisper 等工具。团队在 2026 年 RoboCup 中国专项赛获得国家一等奖（季军）。', en: 'Worked on deployment and debugging of vision, speech, and rhythm modules using tools including OpenCV, Vosk, and Whisper. The team received a national first prize (third place) at the 2026 RoboCup China Special Competition.' } },
  ],
  projects: [
    { title: { zh: 'Qwen3.5 轻量化模型的 LoRA 微调', en: 'LoRA Fine-tuning of Qwen3.5' }, period: '', role: { zh: '参数高效微调实验', en: 'Parameter-efficient fine-tuning' }, description: { zh: '基于 Qwen3.5-0.8B 开展有限算力下的指令微调实验，完成环境配置、数据加载与训练脚本编写，并跟踪分析训练损失和准确率。', en: 'Conducted instruction fine-tuning experiments with Qwen3.5-0.8B under limited compute. Set up the environment, data loading, and LoRA training scripts, and tracked training loss and accuracy.' }, tags: ['LLM', 'LoRA', 'PEFT'] },
    { title: { zh: '面向机器人的 YOLOv8 目标检测', en: 'YOLOv8 Object Detection for Robotics' }, period: '', role: { zh: '数据集构建与模型训练', en: 'Dataset construction and model training' }, description: { zh: '面向水瓶、罐装饮料等日常物体，完成图像采集、清洗、标注及训练/验证划分；参与模型训练与调参，为机器人构建视觉感知模块。', en: 'Collected, cleaned, and annotated images of everyday objects such as bottles and cans. Created training and validation splits and contributed to model training and tuning for robot perception.' }, tags: ['YOLOv8', 'Computer Vision'] },
    { title: { zh: '机器人舵机动作调试软件', en: 'Robot Servo Debugging Software' }, period: '', role: { zh: '团队协作开发', en: 'Collaborative development' }, description: { zh: '与软件组成员共同开发和改进机器人舵机动作调试工具，支持动作调试流程。相关团队成果已取得两项软件著作权。', en: 'Collaborated on software for debugging robot servo motions. The related team work has resulted in two software copyright registrations.' }, tags: ['Robotics', 'Software Development'] },
  ],
  publications: [],
  competitions: [
    { year: '2026', title: { zh: 'RoboCup 机器人大赛中国专项赛', en: 'RoboCup China Special Competition' }, distinction: { zh: '国家一等奖 · 季军', en: 'National First Prize · Third Place' }, organization: { zh: '', en: '' } },
    { year: '2025', title: { zh: 'RoboCup 机器人大赛中国专项赛', en: 'RoboCup China Special Competition' }, distinction: { zh: '国家三等奖', en: 'National Third Prize' }, organization: { zh: '', en: '' } },
    { year: '', title: { zh: '睿抗机器人设计大赛', en: 'RAICOM Robotics Design Competition' }, distinction: { zh: '省级一等奖', en: 'Provincial First Prize' }, organization: { zh: '', en: '' } },
    { year: '', title: { zh: '三维数字化建模大赛', en: '3D Digital Modeling Competition' }, distinction: { zh: '省级特等奖', en: 'Provincial Special Prize' }, organization: { zh: '', en: '' } },
    { year: '', title: { zh: '国际数学建模竞赛（美赛）', en: 'Mathematical Contest in Modeling' }, distinction: { zh: 'Honorable Mention', en: 'Honorable Mention' }, organization: { zh: '', en: '' } },
    { year: '', title: { zh: '西北工业大学大学生数学竞赛', en: 'Northwestern Polytechnical University Mathematics Competition' }, distinction: { zh: '校一等奖', en: 'University First Prize' }, organization: { zh: '', en: '' } },
  ],
  honors: [
    { year: '2025', title: { zh: '国家奖学金', en: 'National Scholarship' }, organization: { zh: '', en: '' } },
    { year: '2025', title: { zh: '校一等奖学金', en: 'University First-class Scholarship' }, organization: { zh: '西北工业大学', en: 'Northwestern Polytechnical University' } },
  ],
  skills: [
    { title: { zh: '编程', en: 'Programming' }, text: { zh: 'C / C++、Python、Java；Codeforces 1400+（Specialist）。', en: 'C / C++, Python, Java; Codeforces 1400+ (Specialist).' } },
    { title: { zh: '研究与工程', en: 'Research & engineering' }, text: { zh: 'LoRA / PEFT、YOLOv8、OpenCV、Vosk、Whisper、机器人软件调试。', en: 'LoRA / PEFT, YOLOv8, OpenCV, Vosk, Whisper, and robotics software debugging.' } },
  ],
  // Add one dated sentence here for each update. Most recent entries go first.
  news: [
    { date: '2026', text: { zh: '与机器人团队在 RoboCup 中国专项赛获得国家一等奖（季军）。', en: 'Our robotics team received a national first prize (third place) at the RoboCup China Special Competition.' } },
    { date: '2025', text: { zh: '获得国家奖学金。', en: 'Received the National Scholarship.' } },
    { date: '2025', text: { zh: '获得西北工业大学校一等奖学金。', en: 'Received the University First-class Scholarship at Northwestern Polytechnical University.' } },
    { date: '2025', text: { zh: '与机器人团队在 RoboCup 中国专项赛获得国家三等奖。', en: 'Our robotics team received a national third prize at the RoboCup China Special Competition.' } },
  ],
  personalNote: { zh: '', en: '' },
};
export const site = { origin: 'https://cybertime-cs.github.io', basePath: '' };
export const localize = (value: Localized, language: Language) => value[language];
export const sitePath = (path = '') => `${site.basePath}/${path.replace(/^\//, '')}`;
