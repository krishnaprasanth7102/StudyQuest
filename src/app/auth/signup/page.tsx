"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md p-4 relative z-10">
        <Link href="/auth/login" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
        <div className="glass-card p-8 rounded-[2rem] border-white/10">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/25 mb-4">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-slate-900 dark:text-white">Join StudyQuest</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">Start your journey to academic excellence</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="Alex" className="rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Smith" className="rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="alex@university.edu" className="rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-11" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-11" required />
            </div>
            <Button type="submit" className="w-full gradient-button h-12 rounded-xl text-lg font-semibold shadow-xl shadow-primary/20 mt-4" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Free Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline">Terms of Service</Link> and{" "}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
