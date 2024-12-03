import localFont from 'next/font/local';
import { Menu } from './menu';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] flex gap-8 h-screen`}
    >
      <div className="flex flex-col w-[20%] p-8 border-r">
        <div className="font-semibold text-2xl mb-6">ReactLit</div>
        <Menu />
      </div>
      <div className="flex-auto flex flex-col p-8 overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
