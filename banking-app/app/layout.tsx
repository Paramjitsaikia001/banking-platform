/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for the entire banking application.
 * It provides:
 * - Global providers (Auth, User context)
 * - Header component across all pages
 * - Toast notifications system
 * - Font configuration (Inter)
 * - SEO metadata
 * 
 * The layout uses Next.js 13+ App Router structure where this file
 * wraps all pages in the application.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Header from '@/components/header';
import { AuthProvider } from '@/app/context/auth-context';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider } from '@/components/theme-provider';

// Configure Inter font for consistent typography across the app
const inter = Inter({ subsets: ['latin'] });

// SEO metadata for the banking platform
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* AuthProvider: Manages user authentication state across the app */}
          <AuthProvider>
            {/* UserProvider: Manages user data and preferences */}
            <UserProvider>
              {/* Header: Navigation and user controls - appears on all pages */}
              <Header />
              {/* Main content area - renders page-specific content */}
              <main>{children}</main>
              {/* Toaster: Global notification system for user feedback */}
              <Toaster position="top-right" />
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
