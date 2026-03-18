import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getReviews, BASE } from '../../../lib/api';
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
      <Link href="/products" className="text-sm text-plum hover:underline mb-8 inline-block">
        ← Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] relative bg-ink/5 rounded-lg overflow-hidden">
          {main ? (
            <Image src={imgUrl(main)} alt={product.name} fill className="object-cover" priority sizes="50vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-ink/30">No image</div>
          )}
        </div>
        <div>
          <p className="text-plum text-sm uppercase tracking-wider">{product.category?.name}</p>
          <h1 className="font-display text-4xl mt-2 text-ink">{product.name}</h1>
          <p className="text-3xl font-semibold text-gold mt-4">${Number(product.price).toFixed(2)}</p>
          {product.volumeMl && (
            <p className="text-sm text-ink/50 mt-1">{product.volumeMl} ml</p>
          )}
          <p className="mt-6 text-ink/80 leading-relaxed whitespace-pre-line">{product.description}</p>
          {product.fragranceNotes && (
            <div className="mt-6 p-4 bg-white border border-ink/10 rounded">
              <p className="text-xs uppercase text-ink/50 mb-1">Notes</p>
              <p>{product.fragranceNotes}</p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-start gap-8">
            <AddToCart product={product} />
            <ProductWishlistRow productId={product._id} />
          </div>
          <p className="text-sm text-ink/50 mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>

      <section className="mt-20 border-t border-ink/10 pt-16">
        <h2 className="font-display text-2xl mb-8">Reviews</h2>
        <ReviewList reviews={reviews} />
        <div className="mt-10 max-w-md">
          <h3 className="font-medium mb-4">Write a review</h3>
          <ReviewForm productId={product._id} />
        </div>
      </section>
    </div>
  );
}
