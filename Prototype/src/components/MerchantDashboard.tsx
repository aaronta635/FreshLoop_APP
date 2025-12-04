import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, BarChart3, PlusCircle, Radio, User, Star, Clock, Settings, ThumbsUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/af70bf7e29d09e4c80dbcb620ddbbc473691db3c.png';

interface MerchantDashboardProps {
  onBack: () => void;
  onNavigateToTemplates?: () => void;
}

const CURRENT_DEALS = [
  {
    id: '1',
    title: 'Strawberry Bliss Pancakes',
    category: 'Snacks',
    price: 2.80,
    rating: 4.0,
    endsIn: 82, // minutes
    image: 'https://images.unsplash.com/photo-1637533114107-1dc725c6e576?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBwYW5jYWtlcyUyMGNvZmZlZXxlbnwxfHx8fDE3NjQwNTI5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    thumbsUp: true
  },
  {
    id: '2',
    title: 'Classic Grilled Ribeye',
    category: 'Food',
    price: 10.90,
    rating: 4.0,
    endsIn: 125,
    image: 'https://images.unsplash.com/photo-1712746785126-e9f28b5b3cc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGRpbm5lciUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY0MDAxNzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    thumbsUp: true
  }
];

const FEATURED_DEALS = [
  {
    id: '3',
    title: 'Garlic Butter Roast Chicken',
    category: 'Food',
    price: 12.80,
    rating: 4.0,
    endsIn: 95,
    image: 'https://images.unsplash.com/photo-1634864418542-ce6d816db486?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwZGlubmVyJTIwcGxhdGV8ZW58MXx8fHwxNzY0MDUyOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    thumbsUp: false
  },
  {
    id: '4',
    title: 'Healthy Premium Steak',
    category: 'Food',
    price: 2.80,
    rating: 4.0,
    endsIn: 210,
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2Mzk1MDc2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    thumbsUp: false
  }
];

function formatCountdown(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function MerchantDashboard({ onBack, onNavigateToTemplates }: MerchantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'analysis' | 'add' | 'live' | 'profile'>('home');
  const [currentDeals, setCurrentDeals] = useState(CURRENT_DEALS);
  const [featuredDeals, setFeaturedDeals] = useState(FEATURED_DEALS);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeals(prev => prev.map(deal => ({
        ...deal,
        endsIn: Math.max(0, deal.endsIn - 1)
      })));
      setFeaturedDeals(prev => prev.map(deal => ({
        ...deal,
        endsIn: Math.max(0, deal.endsIn - 1)
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Shop Info Section */}
      <div className="bg-[#FFFFEF] px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#00492C] rounded-full flex items-center justify-center">
            <span className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>S</span>
          </div>
          <div className="flex-1">
            <p className="text-[#00492C]" style={{ fontSize: '14px', fontWeight: 700 }}>
              Shop name
            </p>
            <p className="text-[#00492C]/60" style={{ fontSize: '12px' }}>
              123 Anywhere St., Any City
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-6 mb-6">
        <div className="relative h-40 rounded-3xl overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1728376334750-27b1e9280aad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHRhYmxlfGVufDF8fHx8MTc2NDA1MjkzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Manage Your Deals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
            <div>
              <h2 className="text-white mb-1" style={{ fontSize: '28px', fontWeight: 700 }}>
                MANAGE
              </h2>
              <h2 className="text-white" style={{ fontSize: '28px', fontWeight: 700 }}>
                YOUR <span className="text-[#EF8E00]">DEALS</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Current Deal Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#00492C]" style={{ fontSize: '18px', fontWeight: 700 }}>
            Current Deal
          </h3>
          <button className="text-[#00492C]/60 hover:text-[#00492C]">
            <span style={{ fontSize: '14px' }}>▼</span>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
          {currentDeals.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-[180px] bg-white rounded-2xl overflow-hidden shadow-sm relative">
              {/* Image */}
              <div className="relative h-32">
                <ImageWithFallback
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                {/* Rating Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                  <span className="text-[#00492C]" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {deal.rating}
                  </span>
                </div>
                {/* Thumbs Up Badge */}
                {deal.thumbsUp && (
                  <div className="absolute top-2 right-2 bg-[#EF8E00] rounded-full p-2">
                    <ThumbsUp className="w-4 h-4 fill-white text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 bg-[#00492C]">
                <p className="text-white/60 uppercase tracking-wider mb-1" style={{ fontSize: '9px', fontWeight: 600 }}>
                  {deal.category}
                </p>
                <h4 className="text-white mb-2 line-clamp-2" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.3' }}>
                  {deal.title}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                    ${deal.price}
                  </p>
                  <div className="flex items-center gap-1 text-[#D9E021]">
                    <Clock className="w-3 h-3" />
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>
                      {formatCountdown(deal.endsIn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#00492C]" style={{ fontSize: '18px', fontWeight: 700 }}>
            Featured
          </h3>
          <button className="text-[#00492C]/60 hover:text-[#00492C]">
            <span style={{ fontSize: '14px' }}>▼</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Image */}
              <div className="relative h-32">
                <ImageWithFallback
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                {/* Rating Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                  <span className="text-[#00492C]" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {deal.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 bg-[#00492C]">
                <p className="text-white/60 uppercase tracking-wider mb-1" style={{ fontSize: '9px', fontWeight: 600 }}>
                  {deal.category}
                </p>
                <h4 className="text-white mb-2 line-clamp-2" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.3' }}>
                  {deal.title}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                    ${deal.price}
                  </p>
                  <div className="flex items-center gap-1 text-[#D9E021]">
                    <Clock className="w-3 h-3" />
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>
                      {formatCountdown(deal.endsIn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
      <h2 className="text-[#00492C] mb-6" style={{ fontSize: '24px', fontWeight: 700 }}>
        Analytics
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Revenue
          </p>
          <p className="text-[#00492C]" style={{ fontSize: '28px', fontWeight: 700 }}>
            $5,234
          </p>
          <p className="text-[#D9E021]" style={{ fontSize: '12px', fontWeight: 600 }}>
            ↑ 12% vs last week
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Items Saved
          </p>
          <p className="text-[#00492C]" style={{ fontSize: '28px', fontWeight: 700 }}>
            487
          </p>
          <p className="text-[#D9E021]" style={{ fontSize: '12px', fontWeight: 600 }}>
            ↑ 8% vs last week
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Waste Reduced
          </p>
          <p className="text-[#00492C]" style={{ fontSize: '28px', fontWeight: 700 }}>
            1,200kg
          </p>
          <p className="text-[#EF8E00]" style={{ fontSize: '12px', fontWeight: 600 }}>
            3,600kg CO₂
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-[#00492C]/60 mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Rating
          </p>
          <p className="text-[#00492C]" style={{ fontSize: '28px', fontWeight: 700 }}>
            4.8
          </p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-[#00492C] mb-4" style={{ fontSize: '18px', fontWeight: 700 }}>
          Last 7 Days
        </h3>
        <div className="h-48 bg-[#EAEBC4] rounded-2xl flex items-center justify-center">
          <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
            Chart visualization here
          </p>
        </div>
      </div>
    </div>
  );

  const renderAddLoop = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
      <h2 className="text-[#00492C] mb-6" style={{ fontSize: '24px', fontWeight: 700 }}>
        Add Loop
      </h2>

      {/* Tab Selection */}
      <div className="bg-[#EAEBC4] rounded-full p-1 grid grid-cols-2 gap-1 mb-6">
        <button className="py-3 rounded-full bg-[#00492C] text-white transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>
          Create from Template
        </button>
        <button className="py-3 rounded-full bg-transparent text-[#00492C] transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>
          Create New
        </button>
      </div>

      {/* Quick Access to Templates */}
      <button
        onClick={() => onNavigateToTemplates && onNavigateToTemplates()}
        className="w-full bg-gradient-to-br from-[#D9E021] to-[#EF8E00] rounded-3xl p-6 mb-6 text-left hover:shadow-lg transition-all"
      >
        <h3 className="text-[#00492C] mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
          📋 Template Library
        </h3>
        <p className="text-[#00492C]/80" style={{ fontSize: '14px' }}>
          Use pre-saved deals to publish faster
        </p>
      </button>

      {/* Or create new */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-[#00492C] mb-4" style={{ fontSize: '18px', fontWeight: 700 }}>
          Or Create New Deal
        </h3>
        <p className="text-[#00492C]/60 mb-4" style={{ fontSize: '14px' }}>
          Start from scratch with a blank form
        </p>
        <button className="w-full bg-[#00492C] text-white py-4 rounded-full hover:bg-[#003821] transition-colors" style={{ fontSize: '16px', fontWeight: 700 }}>
          Start New Deal
        </button>
      </div>
    </div>
  );

  const renderLiveDeals = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
      <h2 className="text-[#00492C] mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
        Live Deals
      </h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button className="px-5 py-2 bg-[#00492C] text-white rounded-full whitespace-nowrap" style={{ fontSize: '14px', fontWeight: 600 }}>
          Active
        </button>
        <button className="px-5 py-2 bg-[#EAEBC4] text-[#00492C] rounded-full whitespace-nowrap hover:bg-[#d9dbb4]" style={{ fontSize: '14px', fontWeight: 600 }}>
          Upcoming
        </button>
        <button className="px-5 py-2 bg-[#EAEBC4] text-[#00492C] rounded-full whitespace-nowrap hover:bg-[#d9dbb4]" style={{ fontSize: '14px', fontWeight: 600 }}>
          Expired
        </button>
      </div>

      {/* Live Deals List */}
      <div className="space-y-3">
        {[...currentDeals, ...featuredDeals].map((deal) => (
          <div key={deal.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#00492C]/60 uppercase tracking-wider mb-1" style={{ fontSize: '10px', fontWeight: 600 }}>
                      {deal.category}
                    </p>
                    <h3 className="text-[#00492C] truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
                      {deal.title}
                    </h3>
                  </div>
                  <button className="p-2 rounded-full hover:bg-[#EAEBC4]">
                    <Settings className="w-5 h-5 text-[#00492C]/60" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[#00492C]" style={{ fontSize: '18px', fontWeight: 700 }}>
                    ${deal.price}
                  </p>
                  <div className="flex items-center gap-1 bg-[#D9E021]/20 px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-[#00492C]" />
                    <span className="text-[#00492C]" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {formatCountdown(deal.endsIn)} left
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-[#D9E021] text-[#00492C] px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 600 }}>
                    🔴 LIVE
                  </span>
                  <span className="text-[#00492C]/60" style={{ fontSize: '12px' }}>
                    3 sold today
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-[#00492C] rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
          <img src={logoImage} alt="Fresh Loop" className="w-16 h-16 object-contain" />
        </div>
        <h2 className="text-[#00492C] mb-1" style={{ fontSize: '24px', fontWeight: 700 }}>
          Harbor Kitchen
        </h2>
        <p className="text-[#00492C]/60" style={{ fontSize: '14px' }}>
          123 Anywhere St., Any City
        </p>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#EAEBC4] transition-colors">
          <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
            Business Info
          </span>
          <span className="text-[#00492C]/40">›</span>
        </button>
        <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#EAEBC4] transition-colors">
          <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
            Banking Details
          </span>
          <span className="text-[#00492C]/40">›</span>
        </button>
        <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#EAEBC4] transition-colors">
          <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
            Staff Management
          </span>
          <span className="text-[#00492C]/40">›</span>
        </button>
        <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#EAEBC4] transition-colors">
          <span className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
            Help & Support
          </span>
          <span className="text-[#00492C]/40">›</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Content */}
      {activeTab === 'home' && renderHome()}
      {activeTab === 'analysis' && renderAnalysis()}
      {activeTab === 'add' && renderAddLoop()}
      {activeTab === 'live' && renderLiveDeals()}
      {activeTab === 'profile' && renderProfile()}

      {/* Bottom Navigation */}
      <div className="bg-[#00492C] px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <HomeIcon className={`w-6 h-6 ${activeTab === 'home' ? 'text-[#D9E021]' : 'text-white/60'}`} />
            <span className={`${activeTab === 'home' ? 'text-[#D9E021]' : 'text-white/60'}`} style={{ fontSize: '11px', fontWeight: activeTab === 'home' ? 600 : 400 }}>
              Home
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <BarChart3 className={`w-6 h-6 ${activeTab === 'analysis' ? 'text-[#D9E021]' : 'text-white/60'}`} />
            <span className={`${activeTab === 'analysis' ? 'text-[#D9E021]' : 'text-white/60'}`} style={{ fontSize: '11px', fontWeight: activeTab === 'analysis' ? 600 : 400 }}>
              Analysis
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <div className={`relative ${activeTab === 'add' ? 'text-[#D9E021]' : 'text-white/60'}`}>
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className={`${activeTab === 'add' ? 'text-[#D9E021]' : 'text-white/60'}`} style={{ fontSize: '11px', fontWeight: activeTab === 'add' ? 600 : 400 }}>
              Add Loop
            </span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <Radio className={`w-6 h-6 ${activeTab === 'live' ? 'text-[#D9E021]' : 'text-white/60'}`} />
            <span className={`${activeTab === 'live' ? 'text-[#D9E021]' : 'text-white/60'}`} style={{ fontSize: '11px', fontWeight: activeTab === 'live' ? 600 : 400 }}>
              Live Deals
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <User className={`w-6 h-6 ${activeTab === 'profile' ? 'text-[#D9E021]' : 'text-white/60'}`} />
            <span className={`${activeTab === 'profile' ? 'text-[#D9E021]' : 'text-white/60'}`} style={{ fontSize: '11px', fontWeight: activeTab === 'profile' ? 600 : 400 }}>
              Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}