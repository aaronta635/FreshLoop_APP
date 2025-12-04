import React from 'react';
import { Heart, Star, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FavouritesProps {
  onViewDeal: (dealId: string) => void;
}

const FAVORITE_DEALS = [
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
  }
];

const FAVORITE_RESTAURANTS = [
  {
    id: '1',
    name: 'Harbor Kitchen',
    cuisine: 'Cafe • Wollongong',
    rating: 4.8,
    loopsSaved: 8
  },
  {
    id: '2',
    name: 'Green Bowl Co.',
    cuisine: 'Healthy • Wollongong',
    rating: 4.6,
    loopsSaved: 5
  }
];

export function Favourites({ onViewDeal }: FavouritesProps) {
  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <h2 className="text-white text-center" style={{ fontSize: '28px', fontWeight: 700 }}>
          Favorites
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
        {/* Saved Loops */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#EF8E00] fill-[#EF8E00]" />
            <h3 className="text-[#00492C]" style={{ fontSize: '20px', fontWeight: 700 }}>
              Saved Loops
            </h3>
          </div>

          {FAVORITE_DEALS.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl">
              <div className="bg-[#EAEBC4] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#00492C]/40" />
              </div>
              <h4 className="text-[#00492C] mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                No Saved Loops
              </h4>
              <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                Tap the heart icon to save your favorites
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {FAVORITE_DEALS.map((deal) => (
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
                    <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                      <Heart className="w-4 h-4 fill-[#EF8E00] text-[#EF8E00]" />
                    </button>
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
          )}
        </section>

        {/* Favorite Restaurants */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-[#D9E021] fill-[#D9E021]" />
            <h3 className="text-[#00492C]" style={{ fontSize: '20px', fontWeight: 700 }}>
              Favorite Restaurants
            </h3>
          </div>

          <div className="space-y-3">
            {FAVORITE_RESTAURANTS.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#EAEBC4] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#00492C]" style={{ fontSize: '24px' }}>
                      🍽️
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#00492C] mb-1 truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
                      {restaurant.name}
                    </h4>
                    <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '14px' }}>
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                        <span className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 600 }}>
                          {restaurant.rating}
                        </span>
                      </div>
                      <span className="text-[#00492C]/40">•</span>
                      <span className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                        {restaurant.loopsSaved} Loops saved
                      </span>
                    </div>
                  </div>
                  <Heart className="w-6 h-6 fill-[#EF8E00] text-[#EF8E00] flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tip Card */}
        <div className="bg-gradient-to-br from-[#D9E021] to-[#EF8E00] rounded-3xl p-6">
          <h4 className="text-[#00492C] mb-2" style={{ fontSize: '18px', fontWeight: 700 }}>
            💡 Pro Tip
          </h4>
          <p className="text-[#00492C]" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            Get notified when your favorite restaurants have new Loops available! Enable notifications in settings.
          </p>
        </div>
      </div>
    </div>
  );
}
