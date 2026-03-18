import Link from 'next/link';
import Image from 'next/image';
import { BASE, getCollections } from '../../lib/api';

export const revalidate = 60;

function collectionImageSrc(image) {
  if (!image || typeof image !== 'string') return '';
  if (image.startsWith('http')) return image;
  return `${BASE.replace(/\/$/, '')}${image.startsWith('/') ? '' : '/'}${image}`;
}

export default async function CollectionsPage() {
  let collections = [];
  try {
    collections = await getCollections();
  } catch {}

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-10">Collections</h1>
      <div className="grid sm:grid-cols-3 gap-8">
        {collections.map((c) => {
          const src = collectionImageSrc(c.image);
          const extras = (c.previewImages || [])
            .filter((u) => u && collectionImageSrc(u) !== src)
            .slice(0, 3)
            .map((u) => collectionImageSrc(u));
          return (
            <Link
              key={c._id}
              href={`/products?collection=${c._id}`}
              className="group block rounded-xl overflow-hidden border border-ink/10 bg-ink shadow-sm hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            >
              <div className="relative bg-ink/20">
                <div className="relative aspect-[3/3]">
                  {src ? (
                    <Image
                      src={src}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-plum/40 via-ink/30 to-gold/20 p-6">
                      <span className="font-display text-2xl text-cream text-center">{c.name}</span>
                    </div>
                  )}
                  {src && (
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />
                  )}
                  {src && (
                    <span className="absolute bottom-3 left-3 right-3 font-display text-xl text-cream drop-shadow-md">
                      {c.name}
                    </span>
                  )}
                </div>
                {/*{extras.length > 0 && (*/}
                {/*  <div className="flex gap-2 p-3 bg-ink/90 border-t border-ink/20">*/}
                {/*    {extras.map((thumbSrc, i) => (*/}
                {/*      <div*/}
                {/*        key={`${c._id}-thumb-${i}`}*/}
                {/*        className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-cream/20"*/}
                {/*      >*/}
                {/*        <Image*/}
                {/*          src={thumbSrc}*/}
                {/*          alt=""*/}
                {/*          fill*/}
                {/*          className="object-cover"*/}
                {/*          sizes="80px"*/}
                {/*          unoptimized*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
              {(c.featured || c.description) && (
                <div className="p-6 bg-ink text-cream">
                  {c.featured && (
                    <span className="text-gold text-xs uppercase tracking-widest">Featured</span>
                  )}
                  {c.description && (
                    <p className={`text-cream/70 text-sm ${c.featured ? 'mt-2' : ''}`}>
                      {c.description}
                    </p>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
      {!collections.length && (
        <p className="text-center text-ink/50 py-12">No collections yet.</p>
      )}
    </div>
  );
}
