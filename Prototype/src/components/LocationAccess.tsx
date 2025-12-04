import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface LocationAccessProps {
  onComplete: () => void;
}

export function LocationAccess({ onComplete }: LocationAccessProps) {
  const [manualEntry, setManualEntry] = useState(false);
  const [location, setLocation] = useState('');

  const handleUseLocation = () => {
    // Simulate getting location
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const handleSubmitLocation = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-8">
        <h2 className="text-white text-center" style={{ fontSize: '32px', fontWeight: 700 }}>
          Your Location
        </h2>
        <p className="text-white/80 mt-2 text-center" style={{ fontSize: '16px' }}>
          Help us find Loops near you
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Illustration */}
        <div className="w-48 h-48 bg-[#EAEBC4] rounded-full flex items-center justify-center mb-8 relative">
          <MapPin className="w-24 h-24 text-[#00492C]" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D9E021] rounded-full flex items-center justify-center animate-pulse">
            <Navigation className="w-8 h-8 text-[#00492C]" />
          </div>
        </div>

        {!manualEntry ? (
          <div className="w-full max-w-md space-y-4">
            <h3 className="text-[#00492C] text-center mb-6" style={{ fontSize: '24px', fontWeight: 700 }}>
              Enable Location Services
            </h3>
            <p className="text-[#00492C]/70 text-center mb-8" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              We'll show you the best Loops available in Wollongong, Dapto, and Unanderra
            </p>

            {/* Use My Location Button */}
            <button
              onClick={handleUseLocation}
              className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors flex items-center justify-center gap-3"
              style={{ fontSize: '18px', fontWeight: 700 }}
            >
              <Navigation className="w-5 h-5" />
              Use My Location
            </button>

            {/* Manual Entry */}
            <button
              onClick={() => setManualEntry(true)}
              className="w-full bg-transparent border-3 border-[#00492C] text-[#00492C] py-5 rounded-full hover:bg-[#00492C] hover:text-white transition-colors"
              style={{ fontSize: '18px', fontWeight: 700, borderWidth: '3px' }}
            >
              Enter Manually
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmitLocation} className="space-y-6">
              <div>
                <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Suburb or Postcode
                </label>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00492C]/40" />
                  <input
                    type="text"
                    placeholder="e.g. Wollongong, 2500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                    style={{ fontSize: '16px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors"
                style={{ fontSize: '18px', fontWeight: 700 }}
              >
                Continue
              </button>

              <button
                type="button"
                onClick={() => setManualEntry(false)}
                className="w-full text-[#00492C]/60 hover:text-[#00492C] py-3"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Back
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Skip */}
      <div className="px-8 pb-8 text-center">
        <button
          onClick={onComplete}
          className="text-[#00492C]/60 hover:text-[#00492C]"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
