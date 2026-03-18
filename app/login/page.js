'use client';

import { useState, Suspense } from 'react';
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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
      <p className="text-ink/60 text-sm mb-8">
        Sign in to track orders and download receipts.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold/40 outline-none"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold/40 outline-none"
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-ink text-cream font-semibold rounded-lg hover:bg-plum disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        No account?{' '}
        <Link href="/register" className="text-plum font-medium underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-20 text-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
