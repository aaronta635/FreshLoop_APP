import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Star, QrCode } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrdersProps {
  onViewDeal: (dealId: string) => void;
}

const ACTIVE_ORDERS = [
  {
    id: 'ord-001',
    dealId: '1',
    restaurant: 'Harbor Kitchen',
    item: 'Strawberry Bliss Pancake',
    price: 2.8,
    pickupTime: '5:00 PM - 6:00 PM',
    pickupCode: 'FL8492',
    status: 'ready',
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDAzODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

const PAST_ORDERS = [
  {
    id: 'ord-002',
    dealId: '2',
    restaurant: 'Green Bowl Co.',
    item: 'Healthy Premium Bowl',
    price: 12.8,
    pickupDate: 'Yesterday, 6:30 PM',
    status: 'completed',
    rated: false,
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjM5NzgyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'ord-003',
    dealId: '3',
    restaurant: 'Steakhouse Premium',
    item: 'Classic Grilled Ribeye',
    price: 10.9,
    pickupDate: '2 days ago',
    status: 'completed',
    rated: true,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2NDAzODYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function Orders({ onViewDeal }: OrdersProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [showQR, setShowQR] = useState<string | null>(null);

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <h2 className="text-white text-center mb-6" style={{ fontSize: '28px', fontWeight: 700 }}>
          My Orders
        </h2>

        {/* Tabs */}
        <div className="bg-[#EAEBC4] rounded-full p-1 grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-3 rounded-full transition-colors ${
              activeTab === 'active'
                ? 'bg-[#00492C] text-white'
                : 'bg-transparent text-[#00492C]'
            }`}
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            Active ({ACTIVE_ORDERS.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-3 rounded-full transition-colors ${
              activeTab === 'past'
                ? 'bg-[#00492C] text-white'
                : 'bg-transparent text-[#00492C]'
            }`}
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            Past ({PAST_ORDERS.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {activeTab === 'active' ? (
          ACTIVE_ORDERS.length > 0 ? (
            <div className="space-y-4">
              {ACTIVE_ORDERS.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                  <div className="p-5">
                    <div className="flex gap-4 mb-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={order.image}
                          alt={order.item}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#00492C]/60 mb-1" style={{ fontSize: '12px' }}>
                          {order.restaurant}
                        </p>
                        <h3 className="text-[#00492C] mb-2 truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
                          {order.item}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00492C]/60" />
                          <span className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                            {order.pickupTime}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-[#00492C]" style={{ fontSize: '18px', fontWeight: 700 }}>
                          ${order.price}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-4 bg-[#D9E021]/20 border border-[#D9E021] rounded-2xl px-4 py-3">
                      <CheckCircle className="w-5 h-5 text-[#00492C]" />
                      <span className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 600 }}>
                        Ready for pickup
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowQR(order.id)}
                        className="flex-1 bg-[#00492C] text-white py-3 rounded-full hover:bg-[#003821] transition-colors flex items-center justify-center gap-2"
                        style={{ fontSize: '14px', fontWeight: 700 }}
                      >
                        <QrCode className="w-4 h-4" />
                        Show QR Code
                      </button>
                      <button
                        onClick={() => onViewDeal(order.dealId)}
                        className="px-6 bg-[#EAEBC4] text-[#00492C] py-3 rounded-full hover:bg-[#d9dbb4] transition-colors"
                        style={{ fontSize: '14px', fontWeight: 700 }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-[#EAEBC4] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-[#00492C]/40" />
              </div>
              <h3 className="text-[#00492C] mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
                No Active Orders
              </h3>
              <p className="text-[#00492C]/60" style={{ fontSize: '16px' }}>
                Browse Loops to place your first order
              </p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {PAST_ORDERS.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm">
                <div className="flex gap-4 mb-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={order.image}
                      alt={order.item}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#00492C]/60 mb-1" style={{ fontSize: '12px' }}>
                      {order.restaurant}
                    </p>
                    <h3 className="text-[#00492C] mb-2 truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
                      {order.item}
                    </h3>
                    <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                      {order.pickupDate}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-[#00492C]" style={{ fontSize: '18px', fontWeight: 700 }}>
                      ${order.price}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {order.rated ? (
                  <div className="flex items-center gap-2 bg-[#EAEBC4] rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (order.rating || 0)
                              ? 'fill-[#EF8E00] text-[#EF8E00]'
                              : 'text-[#00492C]/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                      Thank you for your feedback!
                    </span>
                  </div>
                ) : (
                  <button className="w-full bg-[#EAEBC4] text-[#00492C] py-3 rounded-full hover:bg-[#d9dbb4] transition-colors flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>Rate this order</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <h3 className="text-[#00492C] mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
                Your QR Code
              </h3>
              <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                Show this to the staff at pickup
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-[#EAEBC4] rounded-3xl p-6 mb-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="w-full aspect-square bg-[#00492C] rounded-2xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-white" />
                </div>
              </div>
              <p className="text-center text-[#00492C] mt-4 tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                {ACTIVE_ORDERS[0].pickupCode}
              </p>
            </div>

            <button
              onClick={() => setShowQR(null)}
              className="w-full bg-[#00492C] text-white py-4 rounded-full hover:bg-[#003821] transition-colors"
              style={{ fontSize: '16px', fontWeight: 700 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
