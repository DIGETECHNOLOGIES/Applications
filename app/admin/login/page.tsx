import { redirect } from 'next/navigation';
import { Lock } from 'lucide-react';
import { isAdmin } from '@/lib/auth';
import { AdminLoginForm } from '@/components/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin');

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="pointer-events-none absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full bg-primary opacity-20 blur-[120px]" />
      <div className="glass relative w-full max-w-sm rounded-[2rem] p-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
          <div className="leading-tight">
            <p className="text-lg font-black italic tracking-tighter text-primary">DIGETECH</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Admin</p>
          </div>
        </div>
        <h1 className="mt-6 flex items-center gap-2 text-2xl font-extrabold">
          <Lock className="h-5 w-5 text-primary" /> Sign in
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Enter the admin password to view applications.</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
