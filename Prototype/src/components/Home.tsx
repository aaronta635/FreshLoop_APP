import React, { useState } from 'react';
import { MapPin, Search, Star, Plus, Utensils, Coffee, Tag, LayoutGrid } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  onViewDeal: (dealId: string) => void;
  onNavigate: (screen: any) => void;
}

const DEALS = [
  {
    id: '1',
    restaurant: 'Strawberry Bliss Pancake',
    category: 'Snacks',
    rating: 4.0,
    price: 2.8,
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDAzODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    restaurant: 'Classic Grilled Ribeye',
    category: 'Food',
    rating: 4.0,
    price: 10.9,
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2NDAzODYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    restaurant: 'Garlic Butter Roast Chicken',
    category: 'Food',
    rating: 4.0,
    price: 12.8,
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjM5NzgyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '4',
    restaurant: 'Healthy Premium Steak',
    category: 'Food',
    rating: 4.0,
    price: 2.8,
    image: 'https://images.unsplash.com/photo-1645292821217-fb77e7fa7269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZvb2QlMjBib3dsfGVufDF8fHx8MTc2NDAzODY0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function Home({ onViewDeal, onNavigate }: HomeProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (dealId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dealId)) {
      newFavorites.delete(dealId);
    } else {
      newFavorites.add(dealId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="h-full bg-[#FFFFEF]">
      {/* Header with Location & Search */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        {/* Status Bar Simulation */}
        <div className="flex items-center justify-between mb-4 text-white text-sm">
          <span>08:30</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-white rounded-sm" />
            <div className="w-4 h-3 border border-white rounded-sm" />
            <div className="w-4 h-3 border border-white rounded-sm" />
          </div>
        </div>

        {/* Location */}
        <button className="flex items-center gap-3 mb-4 bg-white/10 rounded-full px-4 py-2">
          <div className="bg-white rounded-full p-1">
            <MapPin className="w-4 h-4 text-[#00492C]" />
          </div>
          <div className="text-left">
            <p className="text-white/70 text-xs">Location</p>
            <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>123 Anywhere St., Any City</p>
          </div>
        </button>

        {/* Search Bar */}
        <button
          onClick={() => onNavigate('search')}
          className="w-full bg-transparent border-2 border-white/30 text-white/60 px-6 py-3 rounded-full text-left flex items-center gap-3"
        >
          <Search className="w-5 h-5" />
          <span style={{ fontSize: '14px' }}>Think your favourite food...</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto pb-24">
        {/* Promo Banner */}
        <div className="px-6 -mt-6 mb-6">
          <div className="relative h-44 rounded-3xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2NDAzODYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Promo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-center" style={{ fontSize: '36px', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                20% PROMO
                <br />
                CASHBACK
              </h2>
            </div>
          </div>
        </div>

        {/* Category Icons */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2">
              <div className="bg-[#00492C] rounded-3xl p-4 w-full aspect-square flex items-center justify-center hover:bg-[#003821] transition-colors">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <span className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 600 }}>Food</span>
            </button>

            <button className="flex flex-col items-center gap-2">
              <div className="bg-[#00492C] rounded-3xl p-4 w-full aspect-square flex items-center justify-center hover:bg-[#003821] transition-colors">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <span className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 600 }}>Beverage</span>
            </button>

            <button className="flex flex-col items-center gap-2">
              <div className="bg-[#00492C] rounded-3xl p-4 w-full aspect-square flex items-center justify-center hover:bg-[#003821] transition-colors">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <span className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 600 }}>Sale</span>
            </button>

            <button className="flex flex-col items-center gap-2">
              <div className="bg-[#00492C] rounded-3xl p-4 w-full aspect-square flex items-center justify-center hover:bg-[#003821] transition-colors">
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <span className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 600 }}>Others</span>
            </button>
          </div>
        </div>

        {/* Premium Food Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#00492C]" style={{ fontSize: '20px', fontWeight: 700 }}>Premium Food</h3>
            <button className="text-[#00492C]" style={{ fontSize: '14px' }}>▼</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {DEALS.slice(0, 2).map((deal) => (
              <div
                key={deal.id}
                onClick={() => onViewDeal(deal.id)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={deal.image}
                    alt={deal.restaurant}
                    className="w-full h-40 object-cover"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                    <span className="text-[#00492C]" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {deal.rating}
                    </span>
                  </div>
                  {/* Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(deal.id);
                    }}
                    className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-[#00492C] hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5 text-[#00492C]" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[#00492C]/60 mb-1" style={{ fontSize: '12px' }}>{deal.category}</p>
                  <h4 className="text-[#00492C] mb-2 line-clamp-2" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {deal.restaurant}
                  </h4>
                  <p className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 700 }}>
                    ${deal.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#00492C]" style={{ fontSize: '20px', fontWeight: 700 }}>Featured</h3>
            <button className="text-[#00492C]" style={{ fontSize: '14px' }}>▼</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {DEALS.slice(2, 4).map((deal) => (
              <div
                key={deal.id}
                onClick={() => onViewDeal(deal.id)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={deal.image}
                    alt={deal.restaurant}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                    <span className="text-[#00492C]" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {deal.rating}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(deal.id);
                    }}
                    className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-[#00492C] hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5 text-[#00492C]" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[#00492C]/60 mb-1" style={{ fontSize: '12px' }}>{deal.category}</p>
                  <h4 className="text-[#00492C] mb-2 line-clamp-2" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {deal.restaurant}
                  </h4>
                  <p className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 700 }}>
                    ${deal.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
