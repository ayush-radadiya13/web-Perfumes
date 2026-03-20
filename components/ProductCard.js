import Link from 'next/link';
import Image from 'next/image';
import { BASE } from '../lib/api';
import { formatINR } from '../lib/currency';
import WishlistButton from './WishlistButton';

function imgUrl(src) {
  if (!src) return '/placeholder.jpg';
  if (src.startsWith('http')) return src;
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}

export default function ProductCard({ product }) {
  const href = `/products/${product.slug}`;

  return (
    <div className="group block rounded-xl glass-card overflow-hidden hover:shadow-gold-glow-sm transition-all duration-300 hover:scale-[1.02]">
      <div className="aspect-[3/4] relative bg-white/5">
        <Link href={href} className="absolute inset-0 z-[1]" aria-label={product.name} />
        {product.images?.[0] ? (
          <Image
            src={imgUrl(product.images[0])}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-cream-muted/50 text-sm z-0">No image</div>
        )}
        <div className="absolute top-2 right-2 z-20">
          <WishlistButton productId={product._id} />
        </div>
      </div>
      <Link href={href} className="block p-4">
        <p className="text-xs text-gold/90 uppercase tracking-wider">{product.category?.name}</p>
        <h3 className="font-display text-lg mt-1 text-cream group-hover:text-gold transition-colors duration-200">{product.name}</h3>
        <p className="mt-2 font-semibold text-gold">{formatINR(product.price)}</p>
      </Link>
    </div>
  );
}
