'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imgError, setImgError] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(e.target.email.value, e.target.password.value);
      router.push(next);
    } catch (er) {
      setErr(er.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0e14] p-3 sm:p-4">
      <div className="w-full max-w-4xl flex bg-[#0f0e14] rounded-2xl overflow-hidden shadow-2xl">
      {/* Left panel - image */}
      <div className="hidden lg:flex lg:w-[45%] relative rounded-l-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1825]/80 to-[#0f0e14]/90 z-10" />
        {/*<div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1523] via-[#2d2640] to-[#1a1825]" />*/}
        {!imgError && (
          <Image
            src="/loginimage.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="45vw"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-5 left-5 z-20">
          <Link href="/" className="text-white font-display text-lg tracking-wide">
            Lumière
          </Link>
        </div>
        {/*<Link*/}
        {/*  href="/"*/}
        {/*  className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm hover:bg-white/15 transition"*/}
        {/*>*/}
        {/*  Back to website →*/}
        {/*</Link>*/}
        <div className="absolute bottom-6 left-5 right-5 z-20 text-white">
          <p className="text-base font-display leading-snug">Capturing Moments, Creating Memories</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-5 flex justify-between items-center gap-3">
            <Link href="/" className="text-white font-display text-lg shrink-0">
              Lumière
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs sm:text-sm whitespace-nowrap"
            >
              Back to website →
            </Link>
          </div>

          <h1 className="text-2xl sm:text-[1.65rem] font-display font-semibold text-white mb-1.5">
            Welcome back
          </h1>
          <p className="text-cream-muted text-xs sm:text-sm mb-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="auth-link">
              Create one
            </Link>
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="auth-input !py-2 h-10 px-3 text-sm"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                className="auth-input !py-2 h-10 px-3 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cream-muted hover:text-cream p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {err && <p className="text-red-400 text-xs sm:text-sm">{err}</p>}
            <button type="submit" disabled={loading} className="auth-btn !py-2.5 text-sm">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0f0e14] text-cream-muted">
        Loading…
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
