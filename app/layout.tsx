import type { Metadata } from 'next';
import Providers from './providers';  // Add this import
import './globals.css';

export const metadata: Metadata = {
  title: 'Vibraniom App',
  description: 'Music recommendation app on Monad',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
