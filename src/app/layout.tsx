import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXMIND - Knowledge Continuity Platform',
  description: 'The Adaptive Knowledge Continuity Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
