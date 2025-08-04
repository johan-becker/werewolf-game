'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Users, Shield, Zap, MapPin, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: Moon,
    title: 'Dynamic Moon Phases',
    description:
      'Experience real-time lunar cycles that affect werewolf abilities and transformation timing.',
    color: 'text-gray-500',
  },
  {
    icon: Users,
    title: 'Pack Dynamics',
    description:
      'Form alliances, establish hierarchies, and coordinate with your pack members in real-time.',
    color: 'text-green-500',
  },
  {
    icon: Shield,
    title: 'Role Strategy',
    description:
      "Master unique abilities for each role - from Seer's insight to Alpha's pack leadership.",
    color: 'text-red-500',
  },
  {
    icon: Zap,
    title: 'Real-time Gameplay',
    description: 'Lightning-fast WebSocket communication ensures seamless multiplayer experience.',
    color: 'text-blue-400',
  },
  {
    icon: MapPin,
    title: 'Territory Control',
    description: 'Claim and defend territories across diverse biomes with strategic advantages.',
    color: 'text-green-600',
  },
  {
    icon: MessageCircle,
    title: 'Enhanced Communication',
    description: 'Advanced chat system with channels, @mentions, and role-based permissions.',
    color: 'text-gray-600',
  },
];

export function FeaturesSection() {
  return (
    <section className="section-werewolf">
      <div className="container-werewolf">
        <div className="text-center mb-16">
          <h2 className="text-heading mb-4">Unleash Your Wild Side</h2>
          <p className="text-subheading max-w-3xl mx-auto">
            Experience the most immersive werewolf game ever created. With cutting-edge features and
            supernatural attention to detail, every full moon brings new adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="card-werewolf group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}
                    >
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-gray-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional feature highlight */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-red-100 dark:from-gray-900 dark:to-red-900 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4 text-red-500" />
            <span>New features added every full moon cycle</span>
          </div>
        </div>
      </div>
    </section>
  );
}
