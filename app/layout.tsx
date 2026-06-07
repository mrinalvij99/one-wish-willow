import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'One Wish Willow',
  description: 'A cursed, interactive horror-themed web application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
