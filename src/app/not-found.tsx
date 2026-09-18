import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">Page not found</h2>
      <p className="mt-2 text-slate-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}