
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FarmingProvider } from '@/context/farming-context';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'SmartKisan – Smart Farming Assistant',
  description: 'Empowering farmers with AI-driven plant disease detection, irrigation control, and market insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FarmingProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <main className="p-4 md:p-8">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </FarmingProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
