'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register(e.target.name.value, e.target.email.value, e.target.password.value);
      router.push('/');
    } catch (er) {
      setErr(er.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-ink mb-2">Create account</h1>
      <p className="text-ink/60 text-sm mb-8">Join Lumière Parfums to manage your orders.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="name"
          required
          placeholder="Full name"
          className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold/40 outline-none"
        />
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
          minLength={6}
          placeholder="Password (min 6 characters)"
          className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold/40 outline-none"
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-ink text-cream font-semibold rounded-lg hover:bg-plum disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{' '}
        <Link href="/login" className="text-plum font-medium underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
