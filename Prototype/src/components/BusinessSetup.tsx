import React, { useState } from 'react';
import { Store, MapPin, Clock, CreditCard, Upload, Check, ChevronRight } from 'lucide-react';

interface BusinessSetupProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 'info', label: 'Business Info', icon: Store },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'hours', label: 'Hours', icon: Clock },
  { id: 'banking', label: 'Banking', icon: CreditCard }
];

export function BusinessSetup({ onComplete }: BusinessSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    phone: '',
    address: '',
    suburb: 'Wollongong',
    postcode: '',
    bsb: '',
    accountNumber: '',
    accountName: ''
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'info':
        return (
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-[#00492C] mb-3 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Business Logo
              </label>
              <div className="border-2 border-dashed border-[#00492C]/30 rounded-3xl p-8 text-center hover:border-[#00492C] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-[#00492C]/40 mx-auto mb-3" />
                <p className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Upload Logo
                </p>
                <p className="text-[#00492C]/60 mt-1" style={{ fontSize: '12px' }}>
                  PNG or JPG, max 2MB
                </p>
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Business Name
              </label>
              <input
                type="text"
                placeholder="e.g. Harbor Kitchen"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              >
                <option value="">Select category</option>
                <option value="cafe">Cafe</option>
                <option value="restaurant">Restaurant</option>
                <option value="bakery">Bakery</option>
                <option value="grocery">Grocery Store</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="0400 000 000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Street Address
              </label>
              <input
                type="text"
                placeholder="123 Crown Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Suburb
                </label>
                <select
                  value={formData.suburb}
                  onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                  className="w-full px-4 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                  style={{ fontSize: '16px' }}
                  required
                >
                  <option value="Wollongong">Wollongong</option>
                  <option value="Dapto">Dapto</option>
                  <option value="Unanderra">Unanderra</option>
                </select>
              </div>

              <div>
                <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Postcode
                </label>
                <input
                  type="text"
                  placeholder="2500"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  className="w-full px-4 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                  style={{ fontSize: '16px' }}
                  required
                />
              </div>
            </div>

            <div className="bg-[#D9E021]/20 border border-[#D9E021] rounded-3xl p-4">
              <p className="text-[#00492C]" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                💡 Make sure this matches your business's physical pickup location
              </p>
            </div>
          </div>
        );

      case 'hours':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
                Business Hours
              </h3>
              <p className="text-[#00492C]/60 mb-6" style={{ fontSize: '14px' }}>
                Set your typical pickup windows
              </p>

              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="bg-white rounded-2xl p-4 flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" defaultChecked={day !== 'Sunday'} />
                    <span className="flex-1 text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      {day}
                    </span>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="px-3 py-2 bg-[#EAEBC4] rounded-full text-[#00492C]"
                      style={{ fontSize: '14px' }}
                    />
                    <span className="text-[#00492C]/60">-</span>
                    <input
                      type="time"
                      defaultValue="17:00"
                      className="px-3 py-2 bg-[#EAEBC4] rounded-full text-[#00492C]"
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'banking':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                BSB
              </label>
              <input
                type="text"
                placeholder="000-000"
                value={formData.bsb}
                onChange={(e) => setFormData({ ...formData, bsb: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Account Number
              </label>
              <input
                type="text"
                placeholder="12345678"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Account Name
              </label>
              <input
                type="text"
                placeholder="Business Name Pty Ltd"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div className="bg-[#EAEBC4] rounded-3xl p-4">
              <p className="text-[#00492C]/60" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                🔒 Your banking details are encrypted and secure. Payments are processed weekly.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <h2 className="text-white mb-6" style={{ fontSize: '32px', fontWeight: 700 }}>
          Setup Your Business
        </h2>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isCompleted
                      ? 'bg-[#D9E021]'
                      : isCurrent
                      ? 'bg-[#EF8E00]'
                      : 'bg-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-[#00492C]" />
                  ) : (
                    <Icon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-white/60'}`} />
                  )}
                </div>
                <p
                  className={`text-xs text-center ${
                    isCurrent ? 'text-white' : 'text-white/60'
                  }`}
                  style={{ fontWeight: isCurrent ? 600 : 400 }}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {renderStep()}
        </form>
      </div>

      {/* Actions */}
      <div className="px-6 pb-8 pt-4 space-y-3">
        <button
          onClick={handleNext}
          className="w-full bg-[#EF8E00] text-white py-5 rounded-full hover:bg-[#d67e00] transition-colors flex items-center justify-center gap-2"
          style={{ fontSize: '18px', fontWeight: 700 }}
        >
          {currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
          <ChevronRight className="w-5 h-5" />
        </button>

        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="w-full text-[#00492C]/60 hover:text-[#00492C] py-3"
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
