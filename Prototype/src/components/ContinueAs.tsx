import React from 'react';
import logoImage from 'figma:asset/af70bf7e29d09e4c80dbcb620ddbbc473691db3c.png';

interface ContinueAsProps {
  onSelectCustomer: () => void;
  onSelectBusiness: () => void;
}

export function ContinueAs({ onSelectCustomer, onSelectBusiness }: ContinueAsProps) {
  return (
    <div className="h-full flex flex-col bg-[#00492C]">
      {/* Top Section - Logo & Tagline */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="bg-[#FFFFEF] rounded-[32px] px-8 py-6 mb-4">
          <img src={logoImage} alt="Fresh Loop" className="w-64 h-auto" />
        </div>

        {/* Tagline */}
        <p className="text-white text-center" style={{ fontSize: '18px' }}>
          make every <span className="text-[#EF8E00]" style={{ fontWeight: 700 }}>bite</span> count
        </p>
      </div>

      {/* Bottom Section - Lavender Background */}
      <div className="bg-[#BDBEFA] rounded-t-[48px] px-8 pt-12 pb-16">
        <h2 className="text-[#00492C] text-center mb-8" style={{ fontSize: '24px', fontWeight: 700 }}>
          Continue as
        </h2>

        <div className="space-y-4 max-w-md mx-auto">
          {/* Customer Button - Filled */}
          <button
            onClick={onSelectCustomer}
            className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors"
            style={{ fontSize: '20px', fontWeight: 700 }}
          >
            Customer
          </button>

          {/* Business Button - Outline */}
          <button
            onClick={onSelectBusiness}
            className="w-full bg-transparent border-3 border-[#00492C] text-[#00492C] py-5 rounded-full hover:bg-[#00492C] hover:text-white transition-colors"
            style={{ fontSize: '20px', fontWeight: 700, borderWidth: '3px' }}
          >
            Business
          </button>
        </div>
      </div>
    </div>
  );
}