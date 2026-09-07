import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { profile, site, sitePath, type Language } from '@/content/profile';
import '@/app/globals.css';
export function pageMetadata(language: Language): Metadata {
  const title = `${profile.name[language]} | ${language === 'zh' ? '学术主页' : 'Academic Homepage'}`;
  const description = profile.introduction.map(p => p[language]).join(' ');
  const url = `${site.origin}${sitePath(language === 'en' ? 'en/' : '')}`;
  return {
    metadataBase: new URL(site.origin), title, description,
    robots: profile.ready ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: url, languages: { 'zh-CN': `${site.origin}${sitePath()}`, en: `${site.origin}${sitePath('en/')}`, 'x-default': `${site.origin}${sitePath()}` } },
    openGraph: { title, description, type: 'profile', locale: language === 'zh' ? 'zh_CN' : 'en_US', url },
    icons: { icon: sitePath('favicon.svg') },
  };
}
export function PageLayout({ children, language }: { children: ReactNode; language: Language }) {
  const structuredData = profile.ready ? {
    '@context': 'https://schema.org', '@type': 'Person', name: profile.name[language],
    alternateName: profile.name[language === 'zh' ? 'en' : 'zh'], url: `${site.origin}${sitePath()}`,
    ...(profile.photo ? { image: `${site.origin}${sitePath(profile.photo)}` } : {}),
    ...(profile.email ? { email: profile.email } : {}),
    sameAs: [profile.github, profile.scholar, profile.openreview, profile.orcid].filter(Boolean),
  } : null;
  return <html lang={language === 'zh' ? 'zh-CN' : 'en'}><body>{children}
    {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />}
  </body></html>;
}
