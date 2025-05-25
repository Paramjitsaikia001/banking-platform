import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Header from '@/components/header';
import { AuthProvider } from '@/app/context/auth-context';
import { UserProvider } from '@/context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Banking Platform',
  description: 'A modern banking platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <Header />
            <main>{children}</main>
            <Toaster position="top-right" />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
