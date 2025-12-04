import React, { useState } from 'react';
import { ArrowLeft, Search as SearchIcon, Star, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SearchProps {
  onViewDeal: (dealId: string) => void;
  onBack: () => void;
}

const POPULAR_SEARCHES = [
  '☕ Coffee',
  '🍕 Pizza',
  '🥗 Salads',
  '🍜 Asian',
  '🥖 Bakery',
  '🍔 Burgers'
];

const ALL_DEALS = [
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
  }
];

export function Search({ onViewDeal, onBack }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = searchQuery
    ? ALL_DEALS.filter(
        (deal) =>
          deal.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4 text-white text-sm">
          <span>08:30</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-white rounded-sm" />
            <div className="w-4 h-3 border border-white rounded-sm" />
            <div className="w-4 h-3 border border-white rounded-sm" />
          </div>
        </div>

        {/* Title & Search */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white flex-1" style={{ fontSize: '28px', fontWeight: 700 }}>
            Explore
          </h2>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00492C]/40" />
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white rounded-full focus:outline-none text-[#00492C]"
            style={{ fontSize: '16px' }}
            autoFocus
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {!searchQuery ? (
          <>
            {/* Popular Searches */}
            <div className="mb-8">
              <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-3">
                {POPULAR_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => setSearchQuery(search.split(' ')[1])}
                    className="bg-[#EAEBC4] px-5 py-3 rounded-full text-[#00492C] hover:bg-[#00492C] hover:text-white transition-colors"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* All Items */}
            <div>
              <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
                All Available
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {ALL_DEALS.map((deal) => (
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
                      <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-[#00492C] hover:text-white transition-colors">
                        <Plus className="w-5 h-5 text-[#00492C]" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-[#00492C]/60 mb-1" style={{ fontSize: '12px' }}>
                        {deal.category}
                      </p>
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
          </>
        ) : filteredDeals.length > 0 ? (
          <div>
            <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
              Results for "{searchQuery}"
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {filteredDeals.map((deal) => (
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
                  </div>
                  <div className="p-4">
                    <p className="text-[#00492C]/60 mb-1" style={{ fontSize: '12px' }}>
                      {deal.category}
                    </p>
                    <h4 className="text-[#00492C] mb-2" style={{ fontSize: '14px', fontWeight: 700 }}>
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
        ) : (
          <div className="text-center py-12">
            <div className="bg-[#EAEBC4] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-10 h-10 text-[#00492C]/40" />
            </div>
            <h3 className="text-[#00492C] mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
              No Results Found
            </h3>
            <p className="text-[#00492C]/60" style={{ fontSize: '16px' }}>
              Try searching for something else
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
