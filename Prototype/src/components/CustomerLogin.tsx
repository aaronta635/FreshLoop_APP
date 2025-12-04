import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface CustomerLoginProps {
  onComplete: () => void;
  onBack: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function CustomerLogin({ onComplete, onBack, onSwitchToSignup, onForgotPassword }: CustomerLoginProps) {
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
        <h2 className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
          Welcome Back
        </h2>
        <p className="text-white/80 mt-2" style={{ fontSize: '16px' }}>
          Login to continue saving food
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              onClick={onForgotPassword}
              className="text-[#EF8E00] hover:underline"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors mt-8"
            style={{ fontSize: '18px', fontWeight: 700 }}
          >
            Log In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-[#00492C]" style={{ fontSize: '16px' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#EF8E00] hover:underline"
              style={{ fontWeight: 700 }}
            >
              Sign Up
            </button>
          </p>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#00492C]/20" />
          <span className="text-[#00492C]/60" style={{ fontSize: '14px' }}>or</span>
          <div className="flex-1 h-px bg-[#00492C]/20" />
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full bg-white border-2 border-[#00492C]/20 text-[#00492C] py-4 rounded-full hover:border-[#00492C] transition-colors flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full" />
            <span style={{ fontSize: '16px', fontWeight: 600 }}>Continue with Google</span>
          </button>
          <button className="w-full bg-white border-2 border-[#00492C]/20 text-[#00492C] py-4 rounded-full hover:border-[#00492C] transition-colors flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full" />
            <span style={{ fontSize: '16px', fontWeight: 600 }}>Continue with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
