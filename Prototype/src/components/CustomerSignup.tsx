import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface CustomerSignupProps {
  onComplete: () => void;
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export function CustomerSignup({ onComplete, onBack, onSwitchToLogin }: CustomerSignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
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
        <h2 className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
          Create Account
        </h2>
        <p className="text-white/80 mt-2" style={{ fontSize: '16px' }}>
          Join Fresh Loop and start saving today
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00492C]/40" />
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-[#EAEBC4] border-2 border-transparent rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00492C]/40" />
              <input
                type="email"
                placeholder="Enter your email"
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
                placeholder="Create a password"
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
            <p className="text-[#00492C]/60 mt-2 ml-5" style={{ fontSize: '12px' }}>
              Must be at least 8 characters
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-5 h-5 rounded border-2 border-[#00492C]/30 text-[#00492C] focus:ring-[#00492C]"
              required
            />
            <label htmlFor="terms" className="text-[#00492C]/70" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              I agree to the{' '}
              <button type="button" className="text-[#EF8E00] hover:underline font-semibold">
                Terms & Conditions
              </button>{' '}
              and{' '}
              <button type="button" className="text-[#EF8E00] hover:underline font-semibold">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors mt-8"
            style={{ fontSize: '18px', fontWeight: 700 }}
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-[#00492C]" style={{ fontSize: '16px' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#EF8E00] hover:underline"
              style={{ fontWeight: 700 }}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
