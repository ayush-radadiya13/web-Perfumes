'use client';

import Link from 'next/link';
import {useState} from 'react';

const footerLink = 'text-[#cccccc] hover:text-gold transition-colors text-sm';

const categories = [
  {label: 'Women', href: '/products'},
  {label: 'Men', href: '/products'},
  {label: 'Unisex', href: '/products'},
  {label: 'Collections', href: '/collections'},
  {label: 'Gift Sets', href: '/categories'},
];

const shopping = [
  {label: 'Payments', href: '/checkout'},
  {label: 'Delivery options', href: '#'},
  {label: 'Buyer protection', href: '#'},
];

const customerCare = [
  {label: 'Help center', href: '#'},
  {label: 'Terms & Conditions', href: '#'},
  {label: 'Privacy policy', href: '#'},
  {label: 'Returns & refund', href: '#'},
  {label: 'Survey & feedback', href: '#'},
];

const pages = [
  {label: 'About Us', href: '#'},
  {label: 'Shop', href: '/products'},
  {label: 'Contact Us', href: '#'},
  {label: 'Services', href: '#'},
  {label: 'Blog', href: '#'},
];

function SocialIcon({href, label, children}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-90"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleNewsletter(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Newsletter + brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl font-semibold tracking-wide inline-block bg-gradient-to-r from-[#c58b2b] via-[#b06138] to-[#d4a373] bg-clip-text text-transparent"
            >
              Lumière Perfumes
            </Link>
            <h2 className="mt-6 text-base font-semibold text-white">
              Subscribe to Our Newsletter:
            </h2>
            <p className="mt-2 text-sm text-[#cccccc] max-w-md">
              Receive updates on new arrivals and special promotions!
            </p>
            <form onSubmit={handleNewsletter} className="mt-5 flex max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email here"
                className="min-w-0 flex-1 rounded-l-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-cream placeholder:text-cream-muted/70 outline-none focus:border-[#b06138]/50 focus:ring-1 focus:ring-[#b06138]/30"
                autoComplete="email"
              />
              <button
                type="submit"
                className="shrink-0 rounded-r-xl bg-[#b06138] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d5630]"
              >
                Submit
              </button>
            </form>
            {submitted && (
              <p className="mt-2 text-sm text-gold">Thanks — you&apos;re on the list.</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SocialIcon href="https://twitter.com" label="X (Twitter)">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2] text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </span>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </span>
              </SocialIcon>
              <SocialIcon href="https://instagram.com" label="Instagram">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </span>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            <div>
              <p className="font-semibold text-white text-sm mb-4">Categories</p>
              <ul className="space-y-3">
                {categories.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-4">Shopping</p>
              <ul className="space-y-3">
                {shopping.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-4">Customer care</p>
              <ul className="space-y-3">
                {customerCare.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-4">Pages</p>
              <ul className="space-y-3">
                {pages.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-cream-muted">
          <p>© {new Date().getFullYear()} Lumière Perfumes. All rights reserved.</p>
          <p className="text-cream-muted/80">Artisan scents. Timeless elegance.</p>
        </div>
      </div>
    </footer>
  );
}
