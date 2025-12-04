import React, { useState } from 'react';
import { Infinity } from 'lucide-react';
import welcomeLogo from 'figma:asset/865fc00e375dd5b031a842c3cf0d12b74729b4e7.png';

interface OnboardingProps {
  onContinue: () => void;
}

export function Onboarding({ onContinue }: OnboardingProps) {
  const [step, setStep] = useState<'splash' | 'login'>('splash');

  // Splash/Welcome Screen
  if (step === 'splash') {
    return (
      <div className="h-full flex flex-col bg-[#00492C]">
        {/* Logo Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Logo Badge with Infinity Loop */}
          <div className="relative mb-6">
            <div className="bg-[#FFFFEF] rounded-[32px] px-8 py-6">
              <div className="relative">
                <h1 className="text-[#00492C] text-[64px] leading-none tracking-tight" style={{ fontWeight: 700 }}>
                  FRESH
                </h1>
                <div className="flex items-center gap-2">
                  <h1 className="text-[#00492C] text-[64px] leading-none tracking-tight" style={{ fontWeight: 700 }}>
                    L
                  </h1>
                  <div className="relative" style={{ width: '72px', height: '48px' }}>
                    <svg viewBox="0 0 72 48" fill="none" className="w-full h-full">
                      <path 
                        d="M36 24C36 15.163 43.163 8 52 8C60.837 8 68 15.163 68 24C68 32.837 60.837 40 52 40C48.686 40 45.608 38.946 43.051 37.172C40.392 38.946 37.314 40 34 40C25.163 40 18 32.837 18 24C18 15.163 25.163 8 34 8C37.314 8 40.392 9.054 43.051 10.828C45.608 9.054 48.686 8 52 8" 
                        stroke="#00492C" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <h1 className="text-[#00492C] text-[64px] leading-none tracking-tight" style={{ fontWeight: 700 }}>
                    P
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-white text-[18px] text-center">
            make every <span className="text-[#EF8E00]" style={{ fontWeight: 700 }}>bite</span> count
          </p>
        </div>

        {/* Button Container */}
        <div className="bg-[#FFFFEF] rounded-t-[48px] p-8 pt-16 pb-12">
          <div className="space-y-4 max-w-md mx-auto">
            {/* Login Button - Filled */}
            <button
              onClick={() => setStep('login')}
              className="w-full bg-[#00492C] text-white py-4 rounded-full hover:bg-[#003821] transition-colors"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Login
            </button>

            {/* Sign Up Button - Outline */}
            <button
              onClick={onContinue}
              className="w-full bg-transparent border-3 border-[#00492C] text-[#00492C] py-4 rounded-full hover:bg-[#00492C] hover:text-white transition-colors"
              style={{ fontSize: '18px', fontWeight: 600, borderWidth: '3px' }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login Screen
  return (
    <div className="h-full flex flex-col bg-[#FFFFEF]">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-8">
        <h2 className="text-white text-center" style={{ fontSize: '28px', fontWeight: 700 }}>
          Welcome Back
        </h2>
        <p className="text-white/80 text-center mt-2" style={{ fontSize: '16px' }}>
          Login to continue saving food
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 p-8">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Email Input */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              EMAIL
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button className="text-[#EF8E00] hover:underline" style={{ fontSize: '14px', fontWeight: 500 }}>
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={onContinue}
            className="w-full bg-[#00492C] text-white py-4 rounded-full hover:bg-[#003821] transition-colors mt-8"
            style={{ fontSize: '18px', fontWeight: 600 }}
          >
            Login
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-[#00492C]" style={{ fontSize: '14px' }}>
            Don't have an account?{' '}
            <button onClick={() => setStep('splash')} className="text-[#EF8E00] hover:underline" style={{ fontWeight: 600 }}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
