import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'
import '@/styles/transformations.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { WebSocketProvider } from '@/providers/websocket-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Werewolf Game',
    template: '%s | Werewolf Game'
  },
  description: 'Join the ultimate werewolf experience. Form packs, claim territories, and survive the lunar cycles.',
  keywords: ['werewolf', 'game', 'multiplayer', 'pack', 'territory', 'moon phases'],
  authors: [{ name: 'Werewolf Game Team' }],
  creator: 'Werewolf Game',
  publisher: 'Werewolf Game',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://werewolf-game.com',
    title: 'Werewolf Game - Ultimate Pack Experience',
    description: 'Join the ultimate werewolf experience. Form packs, claim territories, and survive the lunar cycles.',
    siteName: 'Werewolf Game',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Werewolf Game - Ultimate Pack Experience',
    description: 'Join the ultimate werewolf experience. Form packs, claim territories, and survive the lunar cycles.',
    creator: '@werewolfgame',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          defaultTheme="system"
          enableTransformationMode
        >
          <WebSocketProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
            <Toaster />
          </WebSocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}