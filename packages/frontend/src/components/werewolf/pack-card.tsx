'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Crown, Shield, Sword, Heart, Eye, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WerewolfRole = 'ALPHA' | 'BETA' | 'OMEGA' | 'HUNTER' | 'HEALER' | 'SCOUT' | 'GUARDIAN'
export type PackStatus = 'ACTIVE' | 'DORMANT' | 'DISBANDED' | 'RECRUITING'

interface PackMember {
  id: string
  name: string
  role: WerewolfRole
  avatar?: string
  isOnline: boolean
  transformationCount: number
}

interface Territory {
  id: string
  name: string
  size: number
  isControlled: boolean
}

interface PackCardProps {
  id: string
  name: string
  alpha: PackMember
  members: PackMember[]
  territories: Territory[]
  status: PackStatus
  description?: string
  memberLimit?: number
  reputation: number
  className?: string
  onJoinPack?: (packId: string) => void
  onViewDetails?: (packId: string) => void
  isUserPack?: boolean
}

const roleIcons: Record<WerewolfRole, React.ReactNode> = {
  ALPHA: <Crown className="w-4 h-4" />,
  BETA: <Shield className="w-4 h-4" />,
  OMEGA: <Heart className="w-4 h-4" />,
  HUNTER: <Sword className="w-4 h-4" />,
  HEALER: <Heart className="w-4 h-4" />,
  SCOUT: <Eye className="w-4 h-4" />,
  GUARDIAN: <Shield className="w-4 h-4" />,
}

const roleColors: Record<WerewolfRole, string> = {
  ALPHA: 'text-blood-600 bg-blood-100',
  BETA: 'text-moonlight-600 bg-moonlight-100',
  OMEGA: 'text-forest-600 bg-forest-100',
  HUNTER: 'text-shadow-600 bg-shadow-100',
  HEALER: 'text-emerald-600 bg-emerald-100',
  SCOUT: 'text-amber-600 bg-amber-100',
  GUARDIAN: 'text-blue-600 bg-blue-100',
}

const statusColors: Record<PackStatus, string> = {
  ACTIVE: 'text-forest-600 bg-forest-100',
  DORMANT: 'text-amber-600 bg-amber-100',
  DISBANDED: 'text-shadow-600 bg-shadow-100',
  RECRUITING: 'text-blood-600 bg-blood-100',
}

export function PackCard({
  id,
  name,
  alpha,
  members,
  territories,
  status,
  description,
  memberLimit = 12,
  reputation,
  className,
  onJoinPack,
  onViewDetails,
  isUserPack = false,
}: PackCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalMembers = members.length + 1 // +1 for alpha
  const onlineMembers = members.filter(m => m.isOnline).length + (alpha.isOnline ? 1 : 0)
  const controlledTerritories = territories.filter(t => t.isControlled).length
  const totalTerritorySize = territories.reduce((sum, t) => sum + t.size, 0)

  const getReputationStars = (rep: number) => {
    const stars = Math.min(5, Math.max(0, Math.floor(rep / 20)))
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-3 h-3',
          i < stars ? 'text-amber-400 fill-amber-400' : 'text-shadow-300'
        )}
      />
    ))
  }

  return (
    <Card className={cn('card-werewolf hover:shadow-lg transition-all duration-300', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-display flex items-center space-x-2">
              <span>{name}</span>
              {isUserPack && (
                <Badge variant="secondary" className="text-xs">
                  Your Pack
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[status]}>
                {status.toLowerCase()}
              </Badge>
              <div className="flex items-center space-x-1">
                {getReputationStars(reputation)}
                <span className="text-xs text-muted-foreground ml-1">
                  ({reputation})
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{totalMembers}/{memberLimit}</span>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alpha and Online Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={alpha.avatar} alt={alpha.name} />
                <AvatarFallback className="text-xs">
                  {alpha.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full',
                alpha.isOnline ? 'bg-forest-500' : 'bg-shadow-400'
              )} />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium flex items-center space-x-1">
                <span>{alpha.name}</span>
                <Badge className={cn('text-xs', roleColors.ALPHA)}>
                  {roleIcons.ALPHA}
                  Alpha
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {alpha.transformationCount} transformations
              </p>
            </div>
          </div>
          
          <div className="text-right text-sm">
            <p className="text-forest-600 font-medium">{onlineMembers} online</p>
            <p className="text-muted-foreground text-xs">of {totalMembers} members</p>
          </div>
        </div>

        {/* Territory Info */}
        <div className="flex items-center justify-between py-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {controlledTerritories} territor{controlledTerritories !== 1 ? 'ies' : 'y'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalTerritorySize} km²
          </span>
        </div>

        {/* Expandable Member List */}
        {totalMembers > 1 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-xs"
            >
              {isExpanded ? 'Hide' : 'Show'} Members ({members.length})
            </Button>
            
            {isExpanded && (
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 p-2 rounded bg-card/50">
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-2 h-2 border border-background rounded-full',
                        member.isOnline ? 'bg-forest-500' : 'bg-shadow-400'
                      )} />
                    </div>
                    <div>
                      <div className="text-xs font-medium truncate">{member.name}</div>
                      <Badge className={cn('text-xs', roleColors[member.role])}>
                        {roleIcons[member.role]}
                        {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(id)}
            className="flex-1"
          >
            View Details
          </Button>
          {!isUserPack && status === 'RECRUITING' && totalMembers < memberLimit && (
            <Button
              size="sm"
              onClick={() => onJoinPack?.(id)}
              className="flex-1 bg-blood-600 hover:bg-blood-700"
            >
              Join Pack
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}