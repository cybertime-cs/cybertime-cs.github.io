export const dynamic = 'force-static';
import { PageLayout, pageMetadata } from '@/components/page-layout';
export const metadata = pageMetadata('en');
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageLayout language="en">{children}</PageLayout>;
}
