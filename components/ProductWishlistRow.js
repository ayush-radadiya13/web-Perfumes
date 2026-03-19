'use client';

import WishlistButton from './WishlistButton';

export default function ProductWishlistRow({ productId }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <span className="text-sm text-cream-muted">Wishlist</span>
      <WishlistButton productId={productId} className="!h-11 !w-11" />
    </div>
  );
}
