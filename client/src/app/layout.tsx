import type { Metadata } from 'next';
import './globals.css';
import { Roboto } from 'next/font/google';
import Navbar from '../components/Navbar';
import { AuthContextProvider } from '@/contexts/AuthContext';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Habits Together',
  description: 'Habits Together',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} antialiased bg-gray-600`}>
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
