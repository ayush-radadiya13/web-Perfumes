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
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-10">Categories</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.slice(0, 8).map((c) => {
              const src = categoryImageSrc(c.image);
              return (
                  <Link
                      key={c._id}
                      href={`/products?category=${c._id}`}
                      className="group relative aspect-[3/2] rounded-lg overflow-hidden border border-ink/10 bg-ink/5 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                  >
                      {src ? (
                          <Image
                              src={src}
                              alt={c.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 568px) 40vw, 20vw"
                              unoptimized
                          />
                      ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-plum/30 via-ink/20 to-gold/20 flex items-center justify-center p-4">
                              <span className="font-display text-xl text-ink/80 text-center">{c.name}</span>
                          </div>
                      )}
                      {src && (
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
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
        <p className="text-center text-ink/50 py-12">No categories yet. Add them from the admin panel.</p>
      )}
    </div>
  );
}
