import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';

interface BusinessLoginProps {
  onComplete: () => void;
  onBack: () => void;
  onSignup: () => void;
}

export function BusinessLogin({ onComplete, onBack, onSignup }: BusinessLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-8">
        <button onClick={onBack} className="text-white mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Business Icon */}
        <div className="bg-[#EF8E00] rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-white text-center" style={{ fontSize: '32px', fontWeight: 700 }}>
          Partner Login
        </h2>
        <p className="text-white/80 mt-2 text-center" style={{ fontSize: '16px' }}>
          Manage your Fresh Loop listings
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Business Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00492C]/40" />
              <input
                type="email"
                placeholder="your.business@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00492C]/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-14 pr-14 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#00492C]/40 hover:text-[#00492C]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-[#EF8E00] hover:underline"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#EF8E00] text-white py-5 rounded-full hover:bg-[#d67e00] transition-colors mt-8"
            style={{ fontSize: '18px', fontWeight: 700 }}
          >
            Login to Dashboard
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-[#00492C]" style={{ fontSize: '16px' }}>
            New partner?{' '}
            <button
              type="button"
              onClick={onSignup}
              className="text-[#EF8E00] hover:underline"
              style={{ fontWeight: 700 }}
            >
              Register your business
            </button>
          </p>
        </form>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-[#D9E021] to-[#EF8E00] rounded-3xl p-6 mt-8">
          <h4 className="text-[#00492C] mb-2" style={{ fontSize: '18px', fontWeight: 700 }}>
            🌟 Partner Benefits
          </h4>
          <ul className="text-[#00492C] space-y-2" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <li>• Reduce food waste & costs</li>
            <li>• Attract new customers</li>
            <li>• Easy-to-use dashboard</li>
            <li>• No upfront fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
