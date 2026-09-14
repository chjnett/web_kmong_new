import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ATELIER AERO — 생활을 담고, 여백을 남기다', description: '아틀리에 에어로. 고급 주거 리모델링 설계와 시공, 3D 공간 경험을 만나보세요.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
