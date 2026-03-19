import './globals.css';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
import { CartProvider } from '../components/CartProvider';
import { WishlistProvider } from '../components/WishlistProvider';
import LayoutContent from '../components/LayoutContent';

const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});
const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Lumière Parfums | Luxury Fragrances',
  description: 'Discover curated perfumes and exclusive collections.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LayoutContent>{children}</LayoutContent>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
