'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <footer className="border-t border-white/10 bg-[#0a0a0a] text-cream/90 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div>
            <p className="font-display text-lg text-gold">Lumière Perfumes</p>
            <p className="mt-2 text-cream-muted">Artisan scents. Timeless elegance.</p>
          </div>
          <p className="text-cream-muted">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
