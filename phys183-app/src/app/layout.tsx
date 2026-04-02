import type { Metadata } from 'next';
import './globals.css';
import StarField from '@/components/layout/StarField';
import NavBar from '@/components/layout/NavBar';

export const metadata: Metadata = {
  title: 'PHYS183 — Interactive Astronomy',
  description: 'Interactive study app for PHYS183',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#03030a', minHeight: '100vh', color: '#e2e8f0' }}>
        <StarField />
        <NavBar />
        <main style={{ position: 'relative', zIndex: 1, paddingTop: '64px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
