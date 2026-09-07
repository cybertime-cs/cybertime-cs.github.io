import Image from 'next/image';
import type { ReactNode } from 'react';
import { profile, sitePath, type Language, type Achievement } from '@/content/profile';
import { copy } from '@/lib/copy';
import { Enhancements, Citation } from '@/components/interactions';
import { ScrollArea } from '@/components/ui/scroll-area';

function External({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="content-section" aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>{title}</h2>{children}</section>;
}
function Achievements({ items, language }: { items: Achievement[]; language: Language }) {
  return <ul className="achievement-list">{items.map((item, i) => <li key={i}><div><span className="achievement-name">{item.url ? <External href={item.url}>{item.title[language]}</External> : item.title[language]}</span>{item.distinction && <span> — {item.distinction[language]}</span>}{item.detail && <p className="detail">{item.detail[language]}</p>}</div>{item.year && <time>{item.year}</time>}</li>)}</ul>;
}
export function AcademicPage({ language }: { language: Language }) {
  const t = copy[language];
  const zh = language === 'zh';
  const cv = profile.cv[language];
  const navigation = ['about', 'education', 'research', 'publications', 'competitions', 'honors', 'news'] as const;
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header"><div className="header-inner"><nav aria-label={t.menu}>{navigation.map((id) => <a key={id} href={`#${id}`} data-section-link={id} aria-current={id === 'about' ? 'location' : undefined}>{t.nav[id]}</a>)}</nav><div className="language-switch" aria-label={zh ? '切换语言' : 'Switch language'}><a href={sitePath()} hrefLang="zh-CN" lang="zh-CN" aria-current={zh ? 'page' : undefined} data-language-link="zh">中文</a><span aria-hidden="true">/</span><a href={sitePath('en/')} hrefLang="en" lang="en" aria-current={!zh ? 'page' : undefined} data-language-link="en">English</a></div></div></header>
    <main id="main" className="academic-page" tabIndex={-1}>
      <section id="about" className="about-section" aria-labelledby="name-heading">
        <div className="about-main"><h1 id="name-heading">{profile.name[language]} <span lang={zh ? 'en' : 'zh-CN'}>{profile.name[zh ? 'en' : 'zh']}</span></h1>
          <p className="affiliation">{profile.role[language]}<br />{profile.department[language]}, {profile.affiliation[language]}</p>
          <p className="contact-line"><a href={`mailto:${profile.email}`}>{profile.email}</a><span className="secondary-email"><span aria-hidden="true"> · </span><a href={`mailto:${profile.secondaryEmail}`}>{profile.secondaryEmail}</a></span></p>
          <div className="quick-links" aria-label={t.academicLinks}>
            <External href={profile.github}>GitHub</External>
            {cv && <a href={sitePath(cv)} download>{t.cvDownload}</a>}
            {profile.scholar && <External href={profile.scholar}>Google Scholar</External>}
            {profile.openreview && <External href={profile.openreview}>OpenReview</External>}
            {profile.orcid && <External href={profile.orcid}>ORCID</External>}
          </div>
          <div className="introduction">{profile.introduction.map((paragraph, i) => <p key={i}>{paragraph[language]}</p>)}</div>
        </div>
        <div className="portrait-column">{profile.photo ? <Image className="portrait" unoptimized src={sitePath(profile.photo)} width={320} height={380} alt={profile.name[language]} priority /> : <div className="initials-portrait" aria-hidden="true">{profile.initials}</div>}<p>{profile.location[language]}</p></div>
      </section>
      <Section id="education" title={t.education}>
        {profile.education.map((item, i) => <article key={i} className="education-entry"><div className="entry-heading"><h3>{item.school[language]}</h3><span className="date">{item.period[language]}</span></div><p>{item.degree[language]}</p>{item.detail[language] && <p>{item.detail[language]}</p>}</article>)}
        <dl className="academic-record">{profile.metrics.map((metric, i) => <div key={i}><dt>{metric.label[language]}</dt><dd>{metric.value}</dd></div>)}</dl>
        {profile.courses.length > 0 && <p className="coursework"><strong>{t.coursework}{zh ? '：' : ': '}</strong>{profile.courses.map(course => course.name[language]).join(zh ? '、' : ', ')}{zh ? '。' : '.'}</p>}
      </Section>
      <Section id="research" title={t.research}>
        <h3 className="subheading">{t.researchExperience}</h3>
        {profile.experience.map((entry, i) => <article className="research-entry" key={i}><h4>{entry.title[language]} <span>· {entry.role[language]}</span></h4><p>{entry.detail[language]}</p></article>)}
        <h3 className="subheading projects-heading">{t.projects}</h3>
        {profile.projects.map((project, i) => <article className="research-entry" key={i}><h4>{project.url ? <External href={project.url}>{project.title[language]}</External> : project.title[language]}</h4><p>{project.description[language]}</p></article>)}
        {profile.skills.length > 0 && <dl className="skills-list">{profile.skills.map((skill, i) => <div key={i}><dt>{skill.title[language]}</dt><dd>{skill.text[language]}</dd></div>)}</dl>}
      </Section>
      <Section id="publications" title={t.publications}>
        {profile.publications.length ? <div className="publication-list">{profile.publications.map((paper, i) => <article className="publication" key={i}><h3>{paper.title}</h3><p>{paper.authors}</p><p className="publication-venue">{paper.venue[language]}{paper.venue[language] && ', '}{paper.year} · {t[paper.status]}</p><div className="paper-links">{paper.doi && <External href={paper.doi}>DOI</External>}{paper.pdf && <External href={paper.pdf.startsWith('http') ? paper.pdf : sitePath(paper.pdf)}>{t.paper}</External>}{paper.code && <External href={paper.code}>{t.code}</External>}</div>{paper.abstract && <details className="paper-abstract"><summary>{t.abstract}</summary><p>{paper.abstract[language]}</p></details>}{paper.bibtex && <Citation text={paper.bibtex} language={language} />}</article>)}</div> : <p className="publication-empty">{t.publicationEmpty}</p>}
      </Section>
      <Section id="competitions" title={t.competitions}><Achievements items={profile.competitions} language={language} /></Section>
      <Section id="honors" title={t.honors}><Achievements items={profile.honors} language={language} /></Section>
      <Section id="news" title={t.news}><ScrollArea className="news-scroll" render={<section aria-label={zh ? '近期动态，可滚动' : 'Recent updates, scrollable'} />}><ul className="news-list">{profile.news.map((item, i) => <li key={i}><time dateTime={item.date}>{item.date}</time><p>{item.url ? <External href={item.url}>{item.text[language]}</External> : item.text[language]}</p></li>)}</ul></ScrollArea></Section>
      <footer className="footer"><span>© {profile.updated.slice(0, 4)} {profile.name[language]}</span><span>{t.updated}: <time dateTime={profile.updated}>{profile.updated}</time></span><a href="#about">{t.backToTop} ↑</a></footer>
    </main>
    <Enhancements language={language} />
  </>;
}
