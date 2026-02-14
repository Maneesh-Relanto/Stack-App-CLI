import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat Assistant',
  description: 'Powered by OpenAI and built with Next.js 14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <nav className="border-b border-gray-700 px-4 py-3 bg-gray-900 bg-opacity-50 backdrop-blur">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">🤖 AI Assistant</h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
