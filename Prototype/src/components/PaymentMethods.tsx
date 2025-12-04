import React from 'react';
import { ArrowLeft, CreditCard, Plus, MoreVertical } from 'lucide-react';

interface PaymentMethodsProps {
  onBack: () => void;
}

const PAYMENT_METHODS = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '5555',
    expiry: '09/26',
    isDefault: false
  }
];

export function PaymentMethods({ onBack }: PaymentMethodsProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="mb-4 text-gray-600 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-gray-900">Payment Methods</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Payment Cards */}
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-5 text-white relative overflow-hidden"
          >
            {/* Card Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-8">
                <CreditCard className="w-8 h-8" />
                {method.isDefault && (
                  <div className="bg-[#A8E6A1] text-gray-900 px-3 py-1 rounded-full">
                    Default
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-white/60 mb-2">Card Number</p>
                <p className="tracking-wider">•••• •••• •••• {method.last4}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 mb-1">Expiry</p>
                  <p>{method.expiry}</p>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#A8E6A1] hover:bg-[#A8E6A1]/5 transition-colors">
          <div className="bg-[#F7F7F5] rounded-full p-3">
            <Plus className="w-6 h-6 text-gray-700" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 mb-1">Add Payment Method</p>
            <p className="text-gray-500">Credit or Debit Card</p>
          </div>
        </button>

        {/* Payment Info */}
        <div className="bg-[#FFF7C2] rounded-2xl p-4 mt-6">
          <h4 className="text-gray-900 mb-2">🔒 Secure Payments</h4>
          <p className="text-gray-700">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>
    </div>
  );
}
