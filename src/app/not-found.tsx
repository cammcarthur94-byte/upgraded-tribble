import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 text-emerald-600 shadow-sm">
        <Search className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-8 text-sm leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Overview
      </Link>
    </div>
  );
}
