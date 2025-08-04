'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';
import { Moon, Sun, Monitor, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, isTransforming, moonPhaseIntensity } = useTheme();

  const getThemeIcon = () => {
    if (isTransforming) {
      return <Zap className="h-4 w-4 animate-pulse text-blood-500" />;
    }

    switch (resolvedTheme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    if (isTransforming) return 'Transforming';

    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            'relative transition-all duration-300',
            isTransforming && 'ring-2 ring-blood-500/50 ring-offset-2',
            className
          )}
          style={{
            boxShadow: isTransforming
              ? `0 0 ${Math.round(moonPhaseIntensity / 10)}px rgba(239, 68, 68, 0.5)`
              : undefined,
          }}
        >
          <div className="flex items-center space-x-2">
            {getThemeIcon()}
            {showLabel && <span className="text-sm">{getThemeLabel()}</span>}
          </div>

          {/* Transformation indicator */}
          {isTransforming && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blood-500 rounded-full animate-pulse" />
          )}

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center space-x-2 cursor-pointer',
            theme === 'light' && 'bg-accent'
          )}
        >
          <Sun className="h-4 w-4" />
          <span>Light Mode</span>
          <span className="text-xs text-muted-foreground ml-auto">{theme === 'light' && '✓'}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center space-x-2 cursor-pointer',
            theme === 'dark' && 'bg-accent'
          )}
        >
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
          <span className="text-xs text-muted-foreground ml-auto">{theme === 'dark' && '✓'}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center space-x-2 cursor-pointer',
            theme === 'system' && 'bg-accent'
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          <span className="text-xs text-muted-foreground ml-auto">{theme === 'system' && '✓'}</span>
        </DropdownMenuItem>

        {/* Transformation status */}
        {moonPhaseIntensity > 0 && (
          <>
            <div className="border-t my-1" />
            <div className="px-2 py-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between mb-1">
                <span>Moon Intensity</span>
                <span>{Math.round(moonPhaseIntensity)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blood-400 to-blood-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${moonPhaseIntensity}%` }}
                />
              </div>
              {moonPhaseIntensity > 80 && (
                <div className="mt-1 text-blood-600 text-xs font-medium animate-pulse">
                  ⚠️ Transformation imminent
                </div>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile/sidebar use
export function CompactThemeToggle({ className }: { className?: string }) {
  const { toggleTheme, resolvedTheme, isTransforming } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        'relative transition-all duration-300',
        isTransforming && 'ring-2 ring-blood-500/50 ring-offset-2',
        className
      )}
    >
      {isTransforming ? (
        <Zap className="h-4 w-4 animate-pulse text-blood-500" />
      ) : resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}

      {isTransforming && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blood-500 rounded-full animate-pulse" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
