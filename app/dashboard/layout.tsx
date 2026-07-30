import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <aside className="w-full md:w-64 shrink-0 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Dashboard</h2>
        <nav className="flex flex-col gap-1.5">
          <Link href="/dashboard" className="px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 hover:text-blue-600">
            Overview
          </Link>
          <Link href="/dashboard/posts" className="px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 hover:text-blue-600">
            Posts
          </Link>
          <Link href="/dashboard/comments" className="px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 hover:text-blue-600">
            Comments
          </Link>
        </nav>
      </aside>
      <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl shadow-sm p-6 lg:p-10 w-full">
        {children}
      </div>
    </div>
  );
}
