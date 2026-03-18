import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-900/20 bg-[#0a0a0c] py-12 text-stone-500">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-lg text-amber-200">Lumière Parfums</p>
          <p className="mt-2 text-sm">Curated fragrances for every moment.</p>
        </div>
        <div>
          <p className="font-medium text-stone-400">Shop</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/shop" className="hover:text-amber-500">
                All perfumes
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-amber-500">
                Collections
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-stone-400">Account</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/login" className="hover:text-amber-500">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-amber-500">
                Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center text-xs">© {new Date().getFullYear()} Lumière Parfums</p>
    </footer>
  );
}
