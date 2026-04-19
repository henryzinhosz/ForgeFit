
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Calendar, Database, Apple, Home, LogIn, LogOut, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useUser, signInWithGoogle, logout } from '@/firebase';
import { Button } from './ui/button';
import { getPlaceholderById } from '@/lib/placeholder-images';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/planner', icon: Calendar, label: 'Agenda' },
  { href: '/database', icon: Database, label: 'Exercícios' },
  { href: '/progress', icon: TrendingUp, label: 'Evolução' },
  { href: '/routine', icon: Apple, label: 'Rotina' },
];

export function Navigation() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const logoImg = getPlaceholderById('app-logo-neon');

  return (
    <>
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-b border-white/5 px-4 h-16 z-50 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)] relative border border-white/10">
              <Image 
                src={logoImg.imageUrl} 
                alt="ForgeFit Logo" 
                fill 
                className="object-cover"
                data-ai-hint={logoImg.imageHint}
              />
            </div>
            <span className="font-headline font-bold text-xl text-primary italic uppercase tracking-tighter">ForgeFit</span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-primary leading-none">Militar</span>
                <span className="text-xs font-bold text-white/60 truncate max-w-[120px]">{user.displayName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => logout(auth)} 
                className="text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => signInWithGoogle(auth)} 
              className="bg-white text-black hover:bg-white/90 font-black h-10 px-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> ENTRAR COM GOOGLE
            </Button>
          )}
        </div>
      </nav>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-2xl border-t border-white/5 px-2 py-3 z-50 safe-area-bottom md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 transition-all duration-300 rounded-2xl min-w-[64px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-tighter",
                  isActive ? "opacity-100" : "opacity-60"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="h-16 w-full" />
    </>
  );
}
