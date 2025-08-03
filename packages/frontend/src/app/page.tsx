import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MoonPhaseIndicator } from '@/components/werewolf/moon-phase-indicator'
import { StatsCounter } from '@/components/werewolf/stats-counter'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { Moon, Users, Map, Timer } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-werewolf flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Moon className="h-6 w-6 text-gray-500" />
              <span className="font-bold text-xl">Werewolf Game</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/features"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Features
              </Link>
              <Link
                href="/about"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="btn-werewolf">
                  Join Pack
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Suspense fallback={<div className="h-96 loading-pulse" />}>
          <HeroSection />
        </Suspense>

        {/* Current Moon Phase */}
        <section className="section-werewolf bg-gray-50 dark:bg-gray-900">
          <div className="container-werewolf">
            <div className="text-center mb-12">
              <h2 className="text-heading mb-4">Current Lunar Cycle</h2>
              <p className="text-subheading max-w-2xl mx-auto">
                The moon's power influences all werewolves. Track the current phase and prepare for transformations.
              </p>
            </div>
            <div className="flex justify-center">
              <Suspense fallback={<div className="w-64 h-64 loading-pulse rounded-full" />}>
                <MoonPhaseIndicator size="large" showLabel />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Game Stats */}
        <section className="section-werewolf">
          <div className="container-werewolf">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-werewolf text-center">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <CardTitle className="text-2xl font-bold">
                    <StatsCounter end={1247} duration={2000} />
                  </CardTitle>
                  <CardDescription>Active Werewolves</CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-werewolf text-center">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <CardTitle className="text-2xl font-bold">
                    <StatsCounter end={156} duration={2000} />
                  </CardTitle>
                  <CardDescription>Active Packs</CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-werewolf text-center">
                <CardHeader>
                  <Map className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <CardTitle className="text-2xl font-bold">
                    <StatsCounter end={89} duration={2000} />
                  </CardTitle>
                  <CardDescription>Claimed Territories</CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-werewolf text-center">
                <CardHeader>
                  <Timer className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                  <CardTitle className="text-2xl font-bold">
                    <StatsCounter end={23} duration={2000} />
                  </CardTitle>
                  <CardDescription>Days to Full Moon</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <Suspense fallback={<div className="h-96 loading-pulse" />}>
          <FeaturesSection />
        </Suspense>

        {/* Call to Action */}
        <section className="section-werewolf bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
          <div className="container-werewolf text-center">
            <h2 className="text-display mb-6 text-white">
              Join the Hunt Tonight
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              The moon is calling. Answer its call and discover your true nature among the pack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="btn-werewolf text-lg px-8 py-4">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-gray-300 text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-gray-50 dark:bg-gray-900">
        <div className="container-werewolf py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-gray-500" />
                <span className="font-bold">Werewolf Game</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate werewolf pack experience.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Game</h4>
              <div className="space-y-2 text-sm">
                <Link href="/features" className="block hover:text-foreground/80">Features</Link>
                <Link href="/packs" className="block hover:text-foreground/80">Packs</Link>
                <Link href="/territories" className="block hover:text-foreground/80">Territories</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <Link href="/discord" className="block hover:text-foreground/80">Discord</Link>
                <Link href="/reddit" className="block hover:text-foreground/80">Reddit</Link>
                <Link href="/twitter" className="block hover:text-foreground/80">Twitter</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="block hover:text-foreground/80">Help Center</Link>
                <Link href="/contact" className="block hover:text-foreground/80">Contact</Link>
                <Link href="/privacy" className="block hover:text-foreground/80">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Werewolf Game. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}