import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'After Eight Digital Talent | WILL VEGAS HIRE HER?',
  description: 'Production Studio for Ava Montcrief, Jackie Quintera, and Sienna Torneu across Instagram & TikTok',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#080B14] text-slate-100 antialiased">
      <body className="min-h-screen flex flex-col bg-[#080B14] text-slate-100 selection:bg-purple-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-[#060910] py-4 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                After Eight Digital Talent • WILL VEGAS HIRE HER? • Ava Montcrief, Jackie Quintera & Sienna Torneu
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Multi-User Sync: Enabled</span>
                <span>•</span>
                <span>AI Transparency: Standardized</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
