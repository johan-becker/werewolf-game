import { Card } from '@/components/ui/card';
import { MoonPhaseIndicator } from '@/components/werewolf/moon-phase-indicator';
import { Moon } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding and Moon Phase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-moonlight-900 via-moonlight-800 to-blood-900 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center space-x-3 text-white">
            <Moon className="h-8 w-8" />
            <span className="font-display font-bold text-2xl">Werewolf Game</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center">
            <MoonPhaseIndicator size="large" />
          </div>

          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-white">Join the Pack</h2>
            <p className="text-moonlight-200 text-lg max-w-md mx-auto">
              Embrace your inner wolf. Form alliances, claim territories, and survive the lunar
              cycles.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-moonlight-300 text-sm">
            "The moon calls to those who are ready to answer."
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-3 mb-4">
              <Moon className="h-8 w-8 text-moonlight-600" />
              <span className="font-display font-bold text-2xl">Werewolf Game</span>
            </Link>
            <div className="flex justify-center mb-6">
              <MoonPhaseIndicator size="medium" />
            </div>
          </div>

          <Card className="card-werewolf p-8">{children}</Card>

          {/* Footer links */}
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <Link href="/help" className="hover:text-foreground transition-colors">
                Help
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; 2025 Werewolf Game. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
