export const dynamic = 'force-static';
import { PageLayout, pageMetadata } from '@/components/page-layout';
export const metadata = pageMetadata('zh');
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageLayout language="zh">{children}</PageLayout>;
}
