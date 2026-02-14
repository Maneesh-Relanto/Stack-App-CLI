'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to your SaaS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with Next.js 14, TypeScript, Tailwind CSS, Stripe, and Supabase
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">🚀 Lightning Fast</h3>
                <p className="text-gray-600">Built on Next.js 14 for optimal performance</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">💳 Stripe Ready</h3>
                <p className="text-gray-600">Accept payments and manage subscriptions</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">🔐 Secure Database</h3>
                <p className="text-gray-600">Powered by Supabase PostgreSQL</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="#"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
