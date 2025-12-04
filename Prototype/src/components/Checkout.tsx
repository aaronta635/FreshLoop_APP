import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, MapPin, QrCode, Copy, Check, Package } from 'lucide-react';

interface CheckoutProps {
  deal: any;
  onComplete: () => void;
  onBack: () => void;
}

export function Checkout({ deal, onComplete, onBack }: CheckoutProps) {
  const [step, setStep] = useState<'confirming' | 'confirmed'>('confirming');
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600);

  useEffect(() => {
    if (step === 'confirming') {
      const timer = setTimeout(() => {
        setStep('confirmed');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'confirmed') {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pickupCode = 'FL8492';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'confirming') {
    return (
      <div className="h-full bg-[#FFFFEF] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#00492C] border-t-[#D9E021] rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-[#00492C] mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
            Adding to Cart...
          </h3>
          <p className="text-[#00492C]/60" style={{ fontSize: '16px' }}>
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white flex-1" style={{ fontSize: '28px', fontWeight: 700 }}>
            Order Confirmed
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-6">
        {/* Success Message */}
        <div className="text-center py-6">
          <div className="bg-[#D9E021] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-[#00492C]" />
          </div>
          <h2 className="text-[#00492C] mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
            Success!
          </h2>
          <p className="text-[#00492C]/70" style={{ fontSize: '16px' }}>
            Your Loop is ready for pickup
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <p className="text-center text-[#00492C] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
            Show this at pickup
          </p>
          
          {/* QR Code */}
          <div className="bg-[#EAEBC4] rounded-3xl p-8 mb-4">
            <div className="bg-white rounded-2xl p-6 mb-4">
              <div className="w-full aspect-square bg-[#00492C] rounded-2xl flex items-center justify-center">
                <QrCode className="w-32 h-32 text-white" />
              </div>
            </div>
            
            {/* Pickup Code */}
            <div className="text-center">
              <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '14px' }}>
                Pickup Code
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#00492C] tracking-widest" style={{ fontSize: '24px', fontWeight: 700 }}>
                  {pickupCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-[#D9E021]" />
                  ) : (
                    <Copy className="w-5 h-5 text-[#00492C]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-[#D9E021] rounded-2xl p-4 text-center">
            <p className="text-[#00492C] mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>
              Time until pickup window
            </p>
            <p className="text-[#00492C]" style={{ fontSize: '24px', fontWeight: 700 }}>
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
            Order Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#EAEBC4] rounded-full p-2">
                <Package className="w-5 h-5 text-[#00492C]" />
              </div>
              <div className="flex-1">
                <p className="text-[#00492C] mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
                  {deal?.restaurant}
                </p>
                <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                  {deal?.category}
                </p>
              </div>
              <p className="text-[#00492C]" style={{ fontSize: '18px', fontWeight: 700 }}>
                ${deal?.price}
              </p>
            </div>

            <div className="h-px bg-[#00492C]/10" />

            <div className="flex items-start gap-3">
              <div className="bg-[#EAEBC4] rounded-full p-2">
                <Clock className="w-5 h-5 text-[#00492C]" />
              </div>
              <div className="flex-1">
                <p className="text-[#00492C] mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Pickup Time
                </p>
                <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                  {deal?.pickupTime} • Today
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#EAEBC4] rounded-full p-2">
                <MapPin className="w-5 h-5 text-[#00492C]" />
              </div>
              <div className="flex-1">
                <p className="text-[#00492C] mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Location
                </p>
                <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                  {deal?.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Instructions */}
        <div className="bg-[#D9E021]/20 border-2 border-[#D9E021] rounded-3xl p-6">
          <h4 className="text-[#00492C] mb-3" style={{ fontSize: '18px', fontWeight: 700 }}>
            Pickup Instructions
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-[#00492C]" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <li>Arrive during your pickup window</li>
            <li>Show your QR code or pickup code</li>
            <li>Mention "Fresh Loop" to staff</li>
            <li>Enjoy your meal! 🎉</li>
          </ol>
        </div>

        {/* Impact Card */}
        <div className="text-center bg-gradient-to-br from-[#00492C] to-[#003821] rounded-3xl p-6 mt-6">
          <p className="text-[#D9E021] mb-1" style={{ fontSize: '18px', fontWeight: 700 }}>
            🌍 Nice work!
          </p>
          <p className="text-white" style={{ fontSize: '14px' }}>
            You've saved approximately <strong>2.5kg CO₂</strong> with this Loop
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8 pt-4 bg-[#FFFFEF] border-t border-[#00492C]/10">
        <button
          onClick={onComplete}
          className="w-full bg-[#EF8E00] text-white py-4 rounded-full hover:bg-[#d67e00] transition-colors shadow-lg"
          style={{ fontSize: '18px', fontWeight: 700 }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
