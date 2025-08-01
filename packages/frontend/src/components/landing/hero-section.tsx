'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MoonPhaseIndicator } from '@/components/werewolf/moon-phase-indicator'
import { ArrowRight, Moon, Users } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/10 to-transparent animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Moon phase indicator */}
          <div className="mb-8 flex justify-center">
            <MoonPhaseIndicator size="large" animated />
          </div>
          
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-red-400 bg-clip-text text-transparent">
            Werewolf Game
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Enter a world of supernatural strategy where trust is scarce and the moon holds ultimate power. 
            Join the pack or hunt them down.
          </p>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12 text-gray-300">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              <span className="text-lg">1,247+ Active Werewolves</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-red-400" />
              <span className="text-lg">156 Active Packs</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="btn-werewolf text-lg px-8 py-4 group">
                Join the Hunt
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-gray-300 text-gray-100 hover:bg-gray-100 hover:text-gray-900"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
          
          {/* Trust indicator */}
          <div className="mt-12 text-gray-400 text-sm">
            <p>Trusted by werewolf packs worldwide • Always free to play</p>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-red-300 rounded-full animate-pulse opacity-30" />
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-transparent rounded-full" />
      </div>
    </section>
  )
}