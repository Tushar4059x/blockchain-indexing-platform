'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Blockchain Indexing Platform</span>
            <span className="block text-primary-600">Powered by Helius</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Easily index Solana blockchain data into your PostgreSQL database. No RPC, Geyser, or Validator infrastructure needed.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {session ? (
              <div className="rounded-md shadow">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="rounded-md shadow">
                <Link
                  href="/auth/signin"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">NFT Bids</h3>
              <p className="mt-2 text-base text-gray-500">
                Track current bids on NFTs across various marketplaces
              </p>
            </div>
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">NFT Prices</h3>
              <p className="mt-2 text-base text-gray-500">
                Monitor real-time NFT prices and market trends
              </p>
            </div>
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Token Borrow</h3>
              <p className="mt-2 text-base text-gray-500">
                Track available tokens for borrowing across lending protocols
              </p>
            </div>
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Token Prices</h3>
              <p className="mt-2 text-base text-gray-500">
                Monitor token prices across different DEXes and platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 