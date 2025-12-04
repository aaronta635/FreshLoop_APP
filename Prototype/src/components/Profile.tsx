import React from 'react';
import { User, CreditCard, Bell, Heart, HelpCircle, Store, ChevronRight, LogOut, Settings, Award } from 'lucide-react';

interface ProfileProps {
  onNavigate: (screen: any) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-8">
        <h2 className="text-white text-center mb-6" style={{ fontSize: '28px', fontWeight: 700 }}>
          Profile
        </h2>

        {/* User Card */}
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#EAEBC4] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#00492C]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#00492C] mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                Alex Johnson
              </h3>
              <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
                alex.johnson@email.com
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#EAEBC4] rounded-2xl p-3 text-center">
              <p className="text-[#00492C] mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>12</p>
              <p className="text-[#00492C]/60" style={{ fontSize: '12px' }}>Loops</p>
            </div>
            <div className="bg-[#EAEBC4] rounded-2xl p-3 text-center">
              <p className="text-[#00492C] mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>$168</p>
              <p className="text-[#00492C]/60" style={{ fontSize: '12px' }}>Saved</p>
            </div>
            <div className="bg-[#EAEBC4] rounded-2xl p-3 text-center">
              <p className="text-[#00492C] mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>30kg</p>
              <p className="text-[#00492C]/60" style={{ fontSize: '12px' }}>CO₂</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Account Section */}
        <div className="mb-6">
          <h3 className="text-[#00492C] mb-3" style={{ fontSize: '18px', fontWeight: 700 }}>
            Account
          </h3>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => onNavigate('edit-profile')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#EAEBC4] transition-colors border-b border-[#00492C]/5"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#EAEBC4] rounded-full p-2">
                  <User className="w-5 h-5 text-[#00492C]" />
                </div>
                <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Edit Profile
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00492C]/40" />
            </button>

            <button
              onClick={() => onNavigate('payment-methods')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#EAEBC4] transition-colors border-b border-[#00492C]/5"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#EAEBC4] rounded-full p-2">
                  <CreditCard className="w-5 h-5 text-[#00492C]" />
                </div>
                <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Payment Methods
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00492C]/40" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#EAEBC4] transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#EAEBC4] rounded-full p-2">
                  <Bell className="w-5 h-5 text-[#00492C]" />
                </div>
                <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Notifications
                </span>
              </div>
              <div className="w-12 h-7 bg-[#00492C] rounded-full relative">
                <div className="absolute right-1 top-1 w-5 h-5 bg-[#D9E021] rounded-full transition-all" />
              </div>
            </button>
          </div>
        </div>

        {/* Business Section */}
        <div className="mb-6">
          <h3 className="text-[#00492C] mb-3" style={{ fontSize: '18px', fontWeight: 700 }}>
            Business
          </h3>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => onNavigate('merchant')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#EAEBC4] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#EF8E00] rounded-full p-2">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Partner Dashboard
                  </p>
                  <p className="text-[#00492C]/60" style={{ fontSize: '12px' }}>
                    Manage your restaurant
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00492C]/40" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h3 className="text-[#00492C] mb-3" style={{ fontSize: '18px', fontWeight: 700 }}>
            Support
          </h3>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => onNavigate('help-centre')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#EAEBC4] transition-colors border-b border-[#00492C]/5"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#EAEBC4] rounded-full p-2">
                  <HelpCircle className="w-5 h-5 text-[#00492C]" />
                </div>
                <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Help Centre
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00492C]/40" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#EAEBC4] transition-colors border-b border-[#00492C]/5">
              <div className="flex items-center gap-3">
                <div className="bg-[#EAEBC4] rounded-full p-2">
                  <Settings className="w-5 h-5 text-[#00492C]" />
                </div>
                <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Settings
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00492C]/40" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-2">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-red-600" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Log Out
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Impact Card */}
        <div className="bg-gradient-to-br from-[#00492C] to-[#003821] rounded-3xl p-6 text-center">
          <Award className="w-12 h-12 text-[#D9E021] mx-auto mb-3" />
          <h4 className="text-white mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
            Eco Warrior
          </h4>
          <p className="text-white/80" style={{ fontSize: '14px' }}>
            You've saved 12 meals from waste!
          </p>
        </div>

        {/* App Info */}
        <div className="text-center text-[#00492C]/40 pt-6" style={{ fontSize: '12px' }}>
          <p>Fresh Loop v1.0.0</p>
          <p className="mt-1">make every bite count 🌱</p>
        </div>
      </div>
    </div>
  );
}
