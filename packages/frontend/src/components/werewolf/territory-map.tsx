'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Users, Sword, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TerritoryStatus = 'CONTROLLED' | 'CONTESTED' | 'NEUTRAL' | 'ENEMY'
export type TerrainType = 'FOREST' | 'MOUNTAIN' | 'PLAINS' | 'SWAMP' | 'URBAN' | 'COASTAL'

interface Territory {
  id: string
  name: string
  status: TerritoryStatus
  terrain: TerrainType
  size: number
  population: number
  resources: number
  packName?: string
  position: { x: number; y: number }
  shape: string // SVG path
  strategicValue: number
  defenseBonus: number
  huntingBonus: number
}

interface TerritoryMapProps {
  territories: Territory[]
  userPackId?: string
  selectedTerritoryId?: string
  showControls?: boolean
  interactive?: boolean
  className?: string
  onTerritorySelect?: (territory: Territory) => void
  onTerritoryAttack?: (territoryId: string) => void
  onTerritoryDefend?: (territoryId: string) => void
}

const statusColors: Record<TerritoryStatus, string> = {
  CONTROLLED: 'fill-forest-500/80 stroke-forest-700',
  CONTESTED: 'fill-blood-500/80 stroke-blood-700',
  NEUTRAL: 'fill-shadow-400/80 stroke-shadow-600',
  ENEMY: 'fill-blood-600/80 stroke-blood-800',
}

const terrainPatterns: Record<TerrainType, string> = {
  FOREST: 'url(#forest-pattern)',
  MOUNTAIN: 'url(#mountain-pattern)',
  PLAINS: 'url(#plains-pattern)',
  SWAMP: 'url(#swamp-pattern)',
  URBAN: 'url(#urban-pattern)',
  COASTAL: 'url(#coastal-pattern)',
}

export function TerritoryMap({
  territories,
  userPackId,
  selectedTerritoryId,
  showControls = true,
  interactive = true,
  className,
  onTerritorySelect,
  onTerritoryAttack,
  onTerritoryDefend,
}: TerritoryMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTerritoryClick = (territory: Territory, e: React.MouseEvent) => {
    e.stopPropagation()
    if (interactive) {
      onTerritorySelect?.(territory)
    }
  }

  const getTerritoryStatusBadge = (status: TerritoryStatus) => {
    const statusInfo = {
      CONTROLLED: { label: 'Controlled', color: 'bg-green-100 text-green-800' },
      CONTESTED: { label: 'Contested', color: 'bg-red-100 text-red-800' },
      NEUTRAL: { label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
      ENEMY: { label: 'Enemy', color: 'bg-red-100 text-red-800' },
    }
    return statusInfo[status]
  }

  return (
    <TooltipProvider>
      <Card className={cn('relative overflow-hidden', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display">Territory Map</CardTitle>
            {showControls && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative h-96 overflow-hidden bg-gradient-to-br from-moonlight-50 to-forest-50">
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
            >
              {/* Define patterns for different terrain types */}
              <defs>
                <pattern id="forest-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="20" height="20" fill="#22c55e" opacity="0.1" />
                  <circle cx="10" cy="10" r="2" fill="#16a34a" opacity="0.3" />
                </pattern>
                <pattern id="mountain-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="20" height="20" fill="#64748b" opacity="0.1" />
                  <polygon points="10,5 15,15 5,15" fill="#475569" opacity="0.3" />
                </pattern>
                <pattern id="plains-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="20" height="20" fill="#84cc16" opacity="0.1" />
                  <line x1="0" y1="10" x2="20" y2="10" stroke="#65a30d" opacity="0.3" />
                </pattern>
                <pattern id="swamp-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="20" height="20" fill="#059669" opacity="0.1" />
                  <circle cx="10" cy="10" r="3" fill="#047857" opacity="0.2" />
                </pattern>
                <pattern id="urban-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="20" height="20" fill="#6b7280" opacity="0.1" />
                  <rect x="8" y="8" width="4" height="4" fill="#374151" opacity="0.3" />
                </pattern>
                <pattern id="coastal-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="20" height="20" fill="#3b82f6" opacity="0.1" />
                  <circle cx="10" cy="10" r="2" fill="#2563eb" opacity="0.3" />
                </pattern>
              </defs>

              {/* Background map grid */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Render territories */}
              {territories.map((territory) => (
                <Tooltip key={territory.id}>
                  <TooltipTrigger asChild>
                    <g
                      className={cn(
                        'cursor-pointer transition-all duration-200',
                        interactive && 'hover:opacity-90',
                        selectedTerritoryId === territory.id && 'ring-2 ring-blood-500'
                      )}
                      onClick={(e) => handleTerritoryClick(territory, e)}
                    >
                      <path
                        d={territory.shape}
                        className={cn(
                          statusColors[territory.status],
                          'stroke-2 transition-all duration-200'
                        )}
                        fill={terrainPatterns[territory.terrain]}
                      />
                      
                      {/* Territory center marker */}
                      <circle
                        cx={territory.position.x}
                        cy={territory.position.y}
                        r="4"
                        className="fill-white stroke-gray-800 stroke-2"
                      />
                      
                      {/* Territory name */}
                      <text
                        x={territory.position.x}
                        y={territory.position.y - 10}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-800"
                      >
                        {territory.name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{territory.name}</h4>
                        <Badge className={getTerritoryStatusBadge(territory.status).color}>
                          {getTerritoryStatusBadge(territory.status).label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{territory.terrain.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{territory.population}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>+{territory.defenseBonus}% def</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Sword className="w-3 h-3" />
                          <span>+{territory.huntingBonus}% hunt</span>
                        </div>
                      </div>
                      
                      {territory.packName && (
                        <p className="text-xs text-muted-foreground">
                          Controlled by: {territory.packName}
                        </p>
                      )}
                      
                      <div className="flex space-x-2">
                        {territory.status === 'NEUTRAL' && (
                          <Button
                            size="sm"
                            onClick={() => onTerritoryAttack?.(territory.id)}
                            className="text-xs"
                          >
                            Claim
                          </Button>
                        )}
                        {territory.status === 'CONTESTED' && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onTerritoryAttack?.(territory.id)}
                              className="text-xs"
                            >
                              Attack
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onTerritoryDefend?.(territory.id)}
                              className="text-xs"
                            >
                              Defend
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </svg>

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <h5 className="font-medium text-sm">Legend</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center space-x-2">
                    <div className={cn('w-3 h-3 rounded', color.replace('fill-', 'bg-').replace('/80', ''))} />
                    <span>{status.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Territory stats */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm space-y-1">
                <p className="font-medium">Territory Control</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span>Controlled: {territories.filter(t => t.status === 'CONTROLLED').length}</span>
                  <span>Contested: {territories.filter(t => t.status === 'CONTESTED').length}</span>
                  <span>Neutral: {territories.filter(t => t.status === 'NEUTRAL').length}</span>
                  <span>Enemy: {territories.filter(t => t.status === 'ENEMY').length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}