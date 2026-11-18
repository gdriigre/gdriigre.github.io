import type { Metadata } from 'next';
import './globals.css';
import SplashCursor from './splash-cursor';

export const metadata: Metadata = {
  title: '谢达 XIE DA — AI 内容制作与 AIGC 视频',
  description: '谢达的个人作品集：短视频剪辑、即梦 AI 视频制作与环境艺术设计基础。',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}<SplashCursor /></body></html>;
}
