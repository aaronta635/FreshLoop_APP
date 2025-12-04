import React, { useState } from 'react';
import { MapPin, X, Star, Clock, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MapViewProps {
  onViewDeal: (dealId: string) => void;
  onClose: () => void;
}

const MAP_DEALS = [
  {
    id: '1',
    restaurant: 'Harbor Kitchen',
    lat: -34.4278,
    lng: 150.8931,
    price: 2.8,
    rating: 4.0,
    pickupTime: '5:00 PM - 6:00 PM',
    category: 'Cafe',
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDAzODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    restaurant: 'Green Bowl Co.',
    lat: -34.4318,
    lng: 150.8851,
    price: 12.8,
    rating: 4.5,
    pickupTime: '6:00 PM - 7:00 PM',
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjM5NzgyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    restaurant: 'Steakhouse Premium',
    lat: -34.4258,
    lng: 150.8971,
    price: 10.9,
    rating: 4.8,
    pickupTime: '7:00 PM - 8:00 PM',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2NDAzODYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function MapView({ onViewDeal, onClose }: MapViewProps) {
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  const deal = selectedDeal ? MAP_DEALS.find(d => d.id === selectedDeal) : null;

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Map Area */}
      <div className="flex-1 relative bg-[#EAEBC4]">
        {/* Simulated Map */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EAEBC4] to-[#BDBEFA]">
          {/* Map Pins */}
          {MAP_DEALS.map((mapDeal, index) => (
            <button
              key={mapDeal.id}
              onClick={() => setSelectedDeal(mapDeal.id)}
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-110"
              style={{
                left: `${30 + index * 20}%`,
                top: `${40 + index * 15}%`
              }}
            >
              <div className={`relative ${selectedDeal === mapDeal.id ? 'scale-125' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  selectedDeal === mapDeal.id ? 'bg-[#EF8E00]' : 'bg-[#00492C]'
                }`}>
                  <MapPin className="w-6 h-6 text-white fill-white" />
                </div>
                {selectedDeal === mapDeal.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#EF8E00] rotate-45" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg hover:bg-[#FFFFEF] transition-colors z-10"
        >
          <X className="w-6 h-6 text-[#00492C]" />
        </button>

        {/* My Location Button */}
        <button className="absolute bottom-6 right-6 bg-white rounded-full p-4 shadow-lg hover:bg-[#FFFFEF] transition-colors z-10">
          <Navigation className="w-6 h-6 text-[#00492C]" />
        </button>
      </div>

      {/* Bottom Sheet */}
      {deal && (
        <div className="bg-white rounded-t-[32px] p-6 shadow-2xl">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={deal.image}
                alt={deal.restaurant}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#00492C] truncate mb-1" style={{ fontSize: '18px', fontWeight: 700 }}>
                    {deal.restaurant}
                  </h3>
                  <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                    {deal.category}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[#EAEBC4] px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                  <span className="text-[#00492C]" style={{ fontSize: '12px', fontWeight: 600 }}>
                    {deal.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#00492C]/60" />
                <span className="text-[#00492C]/60" style={{ fontSize: '12px' }}>
                  {deal.pickupTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[#00492C]" style={{ fontSize: '20px', fontWeight: 700 }}>
                  ${deal.price}
                </p>
                <button
                  onClick={() => onViewDeal(deal.id)}
                  className="bg-[#EF8E00] text-white px-6 py-2 rounded-full hover:bg-[#d67e00] transition-colors"
                  style={{ fontSize: '14px', fontWeight: 700 }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!deal && (
        <div className="bg-white rounded-t-[32px] p-6 text-center">
          <MapPin className="w-12 h-12 text-[#00492C]/40 mx-auto mb-3" />
          <p className="text-[#00492C]/60" style={{ fontSize: '16px' }}>
            Select a pin to view details
          </p>
        </div>
      )}
    </div>
  );
}
