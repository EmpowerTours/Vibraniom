import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vibraniom App",
  description: "Music recommendation app on Monad",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <nav className="flex justify-between items-center max-w-4xl mx-auto">
            <Link href="/" className="text-xl font-bold">Vibraniom</Link>
            <div className="space-x-4">
              <Link href="/listener">Listener</Link>
              <Link href="/artist">Artist Upload</Link>
              <Link href="/artist/music">My Music</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
