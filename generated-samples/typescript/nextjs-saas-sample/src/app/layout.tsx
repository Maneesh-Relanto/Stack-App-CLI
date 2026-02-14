import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My SaaS Application',
  description: 'Built with Next.js 14, TypeScript, Tailwind CSS, Stripe, and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <nav className="border-b border-gray-200 px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">My SaaS</h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
