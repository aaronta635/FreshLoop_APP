import React, { useState } from 'react';
import { ArrowLeft, Heart, Star, Clock, MapPin, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DealDetailsProps {
  dealId: string | null;
  onReserve: (deal: any) => void;
  onBack: () => void;
}

const DEAL_DATA: Record<string, any> = {
  '1': {
    id: '1',
    restaurant: 'Strawberry Bliss Pancake',
    category: 'Snacks',
    location: 'Wollongong Harbor, 123 Marine Dr',
    distance: '0.8 km',
    originalPrice: 18,
    price: 2.8,
    savings: 84,
    rating: 4.0,
    reviews: 234,
    pickupTime: '5:00 PM - 6:00 PM',
    available: 3,
    description: 'Fluffy pancakes topped with fresh strawberries, whipped cream, and maple syrup. A delightful breakfast treat that would otherwise go to waste!',
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDAzODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    about: 'Harbor Kitchen is a cozy waterfront cafe serving fresh, locally-sourced meals. Join us in fighting food waste while enjoying quality food.',
  },
  '2': {
    id: '2',
    restaurant: 'Classic Grilled Ribeye',
    category: 'Food',
    location: '45 Crown St, Wollongong',
    distance: '1.2 km',
    originalPrice: 32,
    price: 10.9,
    savings: 66,
    rating: 4.0,
    reviews: 189,
    pickupTime: '6:00 PM - 7:00 PM',
    available: 2,
    description: 'Premium grilled ribeye steak with seasonal vegetables. Restaurant quality meal at an incredible discount!',
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2NDAzODYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    about: 'Premium steakhouse committed to reducing waste while serving exceptional quality meals.',
  }
};

export function DealDetails({ dealId, onReserve, onBack }: DealDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const deal = dealId ? DEAL_DATA[dealId] || DEAL_DATA['1'] : DEAL_DATA['1'];

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header with Image */}
      <div className="relative">
        <ImageWithFallback
          src={deal.image}
          alt={deal.restaurant}
          className="w-full h-80 object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#00492C]" />
          </button>
          
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-[#EF8E00] text-[#EF8E00]' : 'text-[#00492C]'
              }`}
            />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-24 left-6 bg-white rounded-full px-3 py-2 flex items-center gap-2 shadow-lg">
          <Star className="w-5 h-5 fill-[#EF8E00] text-[#EF8E00]" />
          <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 700 }}>
            {deal.rating}
          </span>
          <span className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
            ({deal.reviews})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Title & Category */}
          <div>
            <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
              {deal.category}
            </p>
            <h2 className="text-[#00492C] mb-3" style={{ fontSize: '28px', fontWeight: 700 }}>
              {deal.restaurant}
            </h2>
            
            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-[#00492C]/40 line-through" style={{ fontSize: '20px' }}>
                ${deal.originalPrice}
              </span>
              <span className="text-[#00492C]" style={{ fontSize: '28px', fontWeight: 700 }}>
                ${deal.price}
              </span>
              <div className="bg-[#D9E021] text-[#00492C] px-3 py-1 rounded-full">
                <span style={{ fontSize: '14px', fontWeight: 700 }}>Save {deal.savings}%</span>
              </div>
            </div>
          </div>

          {/* Pickup Info */}
          <div className="bg-[#EAEBC4] rounded-3xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#00492C] rounded-full p-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#00492C] mb-1" style={{ fontSize: '16px', fontWeight: 700 }}>
                  Pickup Window
                </p>
                <p className="text-[#00492C]/70" style={{ fontSize: '14px' }}>
                  {deal.pickupTime} • Today
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#00492C] rounded-full p-2">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#00492C] mb-1" style={{ fontSize: '16px', fontWeight: 700 }}>
                  Location
                </p>
                <p className="text-[#00492C]/70" style={{ fontSize: '14px' }}>
                  {deal.location}
                </p>
                <p className="text-[#EF8E00] mt-1" style={{ fontSize: '14px', fontWeight: 600 }}>
                  {deal.distance} away
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[#00492C] mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
              What You'll Get
            </h3>
            <p className="text-[#00492C]/80" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {deal.description}
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[#00492C] mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
              About
            </h3>
            <p className="text-[#00492C]/80" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {deal.about}
            </p>
          </div>

          {/* Availability */}
          <div className="bg-[#D9E021]/20 border-2 border-[#D9E021] rounded-3xl p-4 text-center">
            <p className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
              Only {deal.available} Loops left! 🔥
            </p>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="px-6 pb-8 pt-4 bg-[#FFFFEF] border-t border-[#00492C]/10">
        <button
          onClick={() => onReserve(deal)}
          className="w-full bg-[#EF8E00] text-white py-4 rounded-full hover:bg-[#d67e00] transition-colors shadow-lg flex items-center justify-center gap-3"
          style={{ fontSize: '18px', fontWeight: 700 }}
        >
          <Plus className="w-6 h-6" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
