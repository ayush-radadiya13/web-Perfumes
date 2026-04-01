import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getReviews, BASE } from '../../../lib/api';
import { formatINR } from '../../../lib/currency';
import AddToCart from '../../../components/AddToCart';
import ProductWishlistRow from '../../../components/ProductWishlistRow';
import ReviewForm from '../../../components/ReviewForm';
import ReviewList from '../../../components/ReviewList';

export const revalidate = 30;

function imgUrl(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}

export default async function ProductPage({ params }) {
  let product;
  let reviews = [];
  try {
    product = await getProductBySlug(params.slug);
    reviews = await getReviews(product._id);
  } catch {
    notFound();
  }

  const main = product.images?.[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors mb-8 inline-block">
        ← Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
        <div className="flex justify-center md:justify-start">
          <div className="relative w-full max-w-lg md:max-w-md h-[420px] md:h-[400px] max-h-[420px] rounded-xl overflow-hidden bg-white/5 glass-card p-4 flex items-center justify-center">
            {main ? (
              <Image
                src={imgUrl(main)}
                alt={product.name}
                fill
                className="object-contain object-center"
                priority
                sizes="(max-width: 768px) 90vw, 380px"
              />
            ) : (
              <div className="relative z-10 flex h-full min-h-[200px] w-full items-center justify-center text-cream-muted/50">
                No image
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-gold/90 text-sm uppercase tracking-wider">{product.category?.name}</p>
          <h1 className="font-display text-4xl mt-2 text-cream">{product.name}</h1>
          <p className="text-3xl font-semibold text-gold mt-4">{formatINR(product.price)}</p>
          {product.volumeMl && (
            <p className="text-sm text-cream-muted mt-1">{product.volumeMl} ml</p>
          )}
          <p className="mt-6 text-cream/90 leading-relaxed whitespace-pre-line">{product.description}</p>
          {product.fragranceNotes && (
            <div className="mt-6 p-4 glass-card rounded-xl">
              <p className="text-xs uppercase text-cream-muted mb-1">Notes</p>
              <p className="text-cream/90">{product.fragranceNotes}</p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-start gap-8">
            <AddToCart product={product} />
            <ProductWishlistRow productId={product._id} />
          </div>
          <p className="text-sm text-cream-muted mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>

      <section className="mt-20 border-t border-white/10 pt-16">
        <h2 className="font-display text-2xl text-cream mb-8">Reviews</h2>
        <ReviewList reviews={reviews} />
        <div className="mt-10 max-w-md">
          <h3 className="font-medium text-cream mb-4">Write a review</h3>
          <ReviewForm productId={product._id} />
        </div>
      </section>
    </div>
  );
}
