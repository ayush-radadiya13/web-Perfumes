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
    <div className="group block rounded-lg glass-card overflow-hidden hover:shadow-gold-glow-sm transition-all duration-300 hover:scale-[1.02]">
      <div
        className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 p-3 bg-gradient-to-b from-white/[0.07] via-[#12100e] to-[#0a0a0a] shadow-[inset_0_0_32px_rgba(0,0,0,0.45)]"
      >
        <Link href={href} className="absolute inset-0 z-[1]" aria-label={product.name} />
        <div className="relative z-0 flex h-full w-full items-center justify-center">
          {product.images?.[0] ? (
            <Image
              src={imgUrl(product.images[0])}
              alt={product.name}
              fill
              className="object-contain object-center p-0.5 group-hover:scale-[1.03] transition duration-500"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
            />
          ) : (
            <span className="relative z-0 text-cream-muted/50 text-xs">No image</span>
          )}
        </div>
        <div className="absolute top-1.5 right-1.5 z-20">
          <WishlistButton productId={product._id} />
        </div>
      </div>
      <Link href={href} className="block p-3">
        <p className="text-[10px] sm:text-[11px] text-gold/90 uppercase tracking-wider leading-tight">{product.category?.name}</p>
        <h3 className="font-display text-sm sm:text-base mt-0.5 text-cream group-hover:text-gold transition-colors duration-200 line-clamp-2 leading-snug">{product.name}</h3>
        <p className="mt-1.5 text-sm font-semibold text-gold">{formatINR(product.price)}</p>
      </Link>
    </div>
  );
}
