import React from 'react';
import { Home, Compass, ShoppingCart, User } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'search' as Screen, icon: Compass, label: 'Explore' },
    { id: 'orders' as Screen, icon: ShoppingCart, label: 'Orders' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' }
  ];

  return (
    <div className="bg-[#00492C] px-6 py-4 safe-area-bottom border-t border-white/10">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
            >
              <div
                className={`transition-colors ${
                  isActive ? 'text-[#D9E021]' : 'text-white/60'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`transition-colors ${
                  isActive ? 'text-[#D9E021]' : 'text-white/60'
                }`}
                style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}