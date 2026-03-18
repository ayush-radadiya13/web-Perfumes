import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import { CartProvider } from '../components/CartProvider';
import { WishlistProvider } from '../components/WishlistProvider';
import Header from '../components/Header';

export const metadata = {
  title: 'Lumière Parfums | Luxury Fragrances',
  description: 'Discover curated perfumes and exclusive collections.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          <footer className="border-t border-ink/10 bg-ink text-cream/90 py-10 mt-16">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6 text-sm">
              <div>
                <p className="font-display text-lg text-gold">Lumière Parfums</p>
                <p className="mt-2 opacity-80">Artisan scents. Timeless elegance.</p>
              </div>
              <p className="opacity-60">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </footer>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
