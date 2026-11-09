'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin/login');
        router.refresh();
      }}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium transition-all hover:bg-background active:scale-95"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
