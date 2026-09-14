import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
export const metadata: Metadata = { title: 'ATELIER AERO — 생활을 담고, 여백을 남기다', description: '아틀리에 에어로의 고급 주거 리모델링. 시공 사례와 마감재, 설계·시공 과정을 확인하고 3D 쇼룸에서 공간을 살펴보세요.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}<Analytics /></body></html>; }
