import type { Metadata } from 'next';
import './globals.css';
import SplashCursor from './splash-cursor';

export const metadata: Metadata = {
  title: '谢达 XIE DA — 内容创作与智能体应用',
  description: '谢达的个人简历：环境艺术设计专业背景，求职方向为剪辑运营、内容创作、图片创作与智能体应用。了解个人经历、联系谢达或下载 PDF 简历。',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}<SplashCursor /></body></html>;
}
