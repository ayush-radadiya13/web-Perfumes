import Link from 'next/link';
import {BASE, getCategories} from '../../lib/api';
import Image from "next/image";

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories = [];
  try {
    categories = await getCategories();
  } catch {}

    function categoryImageSrc(image) {
        if (!image || typeof image !== 'string') return '';
        if (image.startsWith('http')) return image;
        return `${BASE.replace(/\/$/, '')}${image.startsWith('/') ? '' : '/'}${image}`;
    }


    return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">Categories</h1>
        <p className="text-gold mb-10 max-w-xl">
            Discover scents curated to match your mood and elevate your presence.
        </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-6">
          {categories.slice(0, 8).map((c) => {
              const src = categoryImageSrc(c.image);
              return (
                  <Link
                      key={c._id}
                      href={`/products?category=${c._id}`}
                      className="group relative aspect-[4/4] rounded-md overflow-hidden glass-card hover:shadow-gold-glow-sm transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                  >
                      {src ? (
                          <Image
                              src={src}
                              alt={c.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 568px) 40vw, 20vw"
                              unoptimized
                          />
                      ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-white/5 to-plum/20 flex items-center justify-center p-4">
                              <span className="font-display text-xl text-cream/80 text-center">{c.name}</span>
                          </div>
                      )}
                      {src && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      )}
                      {src && (
                          <span className="absolute bottom-0 left-0 right-0 p-3 font-medium text-cream text-sm md:text-base tracking-wide">
                      {c.name}
                    </span>
                      )}
                  </Link>
              );
          })}
      </div>
      {!categories.length && (
        <p className="text-center text-cream-muted py-12">No categories yet. Add them from the admin panel.</p>
      )}
    </div>
  );
}
