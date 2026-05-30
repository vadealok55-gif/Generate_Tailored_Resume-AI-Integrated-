import React from 'react';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from './providers';

export const metadata = {
  title: 'ResumeForge - AI-Powered Resume Builder',
  description: 'Intelligently tailor and optimize your resume for any job description in minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
