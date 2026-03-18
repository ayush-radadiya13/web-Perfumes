"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (user) {
    router.replace("/");
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await register(name, email, password);
      router.push("/");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Register failed");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20 sm:px-6">
      <h1 className="font-serif text-2xl text-stone-100">Register</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          required
          placeholder="Name"
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-stone-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-stone-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6)"
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-stone-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button type="submit" className="w-full rounded-full bg-amber-600 py-3 font-medium text-black">
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/login" className="text-amber-500">
          Log in
        </Link>
      </p>
    </div>
  );
}
