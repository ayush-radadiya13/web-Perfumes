'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BASE } from '../lib/api';

function imgUrl(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${BASE.replace(/\/$/, '')}${src.startsWith('/') ? '' : '/'}${src}`;
}

/**
 * @param {{ product: { name: string; slug: string; image: string | null; price: number; discountPercentage: number; finalPrice: number } }} props
 */
export default function HeroSaleBanner({ product }) {
  if (!product) return null;

  const src = imgUrl(product.image);
  const href = `/products/${product.slug}`;

  return (
    <section className="relative overflow-hidden text-cream hero-sale-enter">
      {/* Smoky luxury background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08060b] via-[#14101c] to-[#0a080e]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(76,29,74,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_80%,rgba(201,162,39,0.08),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20 lg:py-24">
        <div className="flex flex-col md:grid md:grid-cols-2 md:items-center gap-10 md:gap-14 lg:gap-16">
          {/* Image — top on mobile, right on desktop */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4] hero-sale-img rounded-sm overflow-hidden shadow-[0_25px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-gold/20">
              {src ? (
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:768px) 280px, 420px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-plum/40 to-ink flex items-center justify-center text-cream/40 text-sm tracking-widest uppercase">
                  {product.name}
                </div>
              )}
            </div>
          </div>

          {/* Copy — below on mobile, left on desktop */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="text-gold/90 text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 font-medium">
              Limited offer
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-tight text-cream">
              Perfume Year-End Sale!
            </h1>
            <p className="mt-5 text-2xl sm:text-3xl md:text-4xl font-display text-gold">
              Up to {product.discountPercentage}% OFF
            </p>
            <p className="mt-6 text-cream/65 text-sm sm:text-base max-w-xl mx-auto md:mx-0 leading-relaxed">
              Discover an exquisite collection of premium perfumes at unbelievable prices during our
              exclusive sale!
            </p>
            <p className="mt-4 text-cream/50 text-sm">
              <span className="line-through text-cream/40 mr-2">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-gold font-semibold text-lg">
                ${Number(product.finalPrice).toFixed(2)}
              </span>
              <span className="ml-2 text-cream/45">· {product.name}</span>
            </p>
            <Link
              href={href}
              className="inline-block mt-10 px-10 py-3.5 bg-gold text-ink font-semibold text-sm tracking-wide rounded-sm hover:bg-[#d4ad32] transition-colors duration-300 shadow-lg shadow-black/40"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
