import React, { useState } from 'react';
import { ArrowLeft, Info, Minus, Plus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReservationsProps {
  onViewDeal: (dealId: string) => void;
}

const CART_ITEMS = [
  {
    id: '1',
    name: 'Latte Art',
    category: 'Hot Coffe',
    price: 1234.56,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDAzODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    name: 'Croissant',
    category: 'Snack',
    price: 1234.56,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1608220874995-aa3e5301c676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMHBhc3RyaWVzfGVufDF8fHx8MTc2NDAwNDMxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    name: 'Matcha',
    category: 'Matcha',
    price: 1234.56,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjM5NzgyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function Reservations({ onViewDeal }: ReservationsProps) {
  const [cartItems, setCartItems] = useState(CART_ITEMS);
  
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 3703.68;
  const delivery = 370.368;
  const total = 4074.048;

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

        {/* Title Bar */}
        <div className="flex items-center gap-4">
          <button className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white flex-1" style={{ fontSize: '28px', fontWeight: 700 }}>
            YOU CART
          </h2>
          <button className="text-white">
            <Info className="w-6 h-6" />
          </button>
        </div>

        {/* Pickup Location */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1.5">
              <div className="w-5 h-5 bg-[#00492C] rounded-full" />
            </div>
            <div>
              <p className="text-white/70 text-xs">Pickup Store</p>
              <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                123 Anywhere St., Any City
              </p>
            </div>
          </div>
          <button className="bg-[#BDBEFA] text-[#00492C] px-4 py-2 rounded-full" style={{ fontSize: '14px', fontWeight: 600 }}>
            Change
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#EAEBC4] rounded-3xl p-4 flex items-center gap-4"
            >
              {/* Item Image */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[#00492C] mb-1" style={{ fontSize: '18px', fontWeight: 700 }}>
                  {item.name}
                </h4>
                <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '14px' }}>
                  {item.category}
                </p>
                <div className="bg-[#00492C] text-white px-3 py-1 rounded-full inline-block" style={{ fontSize: '12px', fontWeight: 600 }}>
                  $ {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-[#00492C] text-white rounded-full p-1.5 hover:bg-[#003821] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-[#00492C] min-w-[20px] text-center" style={{ fontSize: '16px', fontWeight: 700 }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-[#00492C] text-white rounded-full p-1.5 hover:bg-[#003821] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="bg-[#00492C] text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between text-[#00492C]">
            <span style={{ fontSize: '16px' }}>Discount</span>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>
              $ {discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#00492C]">
            <span style={{ fontSize: '16px' }}>Delivery</span>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>
              $ {delivery.toLocaleString('en-US', { minimumFractionDigits: 3 })}
            </span>
          </div>
          <div className="h-px bg-[#00492C]/20 my-4" />
          <div className="flex items-center justify-between text-[#00492C]">
            <span style={{ fontSize: '20px', fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: '24px', fontWeight: 700 }}>
              $ {total.toLocaleString('en-US', { minimumFractionDigits: 3 })}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="px-6 pb-8 pt-4">
        <button className="w-full bg-[#EF8E00] text-white py-4 rounded-full hover:bg-[#d67e00] transition-colors shadow-lg"
          style={{ fontSize: '18px', fontWeight: 700 }}>
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
