import React, { useState } from 'react';
import { ContinueAs } from './components/ContinueAs';
import { IntroCarousel } from './components/IntroCarousel';
import { CustomerLogin } from './components/CustomerLogin';
import { CustomerSignup } from './components/CustomerSignup';
import { LocationAccess } from './components/LocationAccess';
import { PreferencesSetup } from './components/PreferencesSetup';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { MapView } from './components/MapView';
import { DealDetails } from './components/DealDetails';
import { Checkout } from './components/Checkout';
import { Reservations } from './components/Reservations';
import { Orders } from './components/Orders';
import { Favourites } from './components/Favourites';
import { Profile } from './components/Profile';
import { EditProfile } from './components/EditProfile';
import { PaymentMethods } from './components/PaymentMethods';
import { HelpCentre } from './components/HelpCentre';
import { BusinessLogin } from './components/BusinessLogin';
import { BusinessSetup } from './components/BusinessSetup';
import { MerchantDashboard } from './components/MerchantDashboard';
import { DealTemplatesLibrary } from './components/DealTemplatesLibrary';
import { TemplateDetail } from './components/TemplateDetail';
import { BottomNav } from './components/BottomNav';

export type Screen = 
  | 'continue-as'
  | 'customer-intro'
  | 'customer-signup'
  | 'customer-login'
  | 'location-access'
  | 'preferences-setup'
  | 'home'
  | 'search'
  | 'map-view'
  | 'deal-details'
  | 'checkout'
  | 'reservations'
  | 'orders'
  | 'favourites'
  | 'profile'
  | 'edit-profile'
  | 'payment-methods'
  | 'help-centre'
  | 'business-login'
  | 'business-setup'
  | 'merchant'
  | 'deal-templates'
  | 'template-detail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('continue-as');
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [reservedDeal, setReservedDeal] = useState<any>(null);

  const handleSelectCustomer = () => {
    setUserType('customer');
    setCurrentScreen('customer-intro');
  };

  const handleSelectBusiness = () => {
    setUserType('business');
    setCurrentScreen('business-login');
  };

  const handleCustomerOnboarding = () => {
    setCurrentScreen('customer-signup');
  };

  const handleCustomerLogin = () => {
    setCurrentScreen('location-access');
  };

  const handleLocationComplete = () => {
    setCurrentScreen('preferences-setup');
  };

  const handlePreferencesComplete = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleBusinessLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('merchant');
  };

  const handleBusinessSetupComplete = () => {
    setIsLoggedIn(true);
    setCurrentScreen('merchant');
  };

  const handleViewDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    setCurrentScreen('deal-details');
  };

  const handleReserveDeal = (deal: any) => {
    setReservedDeal(deal);
    setCurrentScreen('checkout');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'continue-as':
        return <ContinueAs onSelectCustomer={handleSelectCustomer} onSelectBusiness={handleSelectBusiness} />;
      
      // Customer Flow
      case 'customer-intro':
        return <IntroCarousel onComplete={handleCustomerOnboarding} />;
      case 'customer-signup':
        return (
          <CustomerSignup
            onComplete={handleCustomerLogin}
            onBack={() => setCurrentScreen('customer-intro')}
            onSwitchToLogin={() => setCurrentScreen('customer-login')}
          />
        );
      case 'customer-login':
        return (
          <CustomerLogin
            onComplete={handleCustomerLogin}
            onBack={() => setCurrentScreen('continue-as')}
            onSwitchToSignup={() => setCurrentScreen('customer-signup')}
            onForgotPassword={() => {}}
          />
        );
      case 'location-access':
        return <LocationAccess onComplete={handleLocationComplete} />;
      case 'preferences-setup':
        return <PreferencesSetup onComplete={handlePreferencesComplete} />;
      
      // Customer Main App
      case 'home':
        return <Home onViewDeal={handleViewDeal} onNavigate={handleNavigate} />;
      case 'search':
        return <Search onViewDeal={handleViewDeal} onBack={() => handleNavigate('home')} />;
      case 'map-view':
        return <MapView onViewDeal={handleViewDeal} onClose={() => handleNavigate('home')} />;
      case 'deal-details':
        return <DealDetails dealId={selectedDealId} onReserve={handleReserveDeal} onBack={() => handleNavigate('home')} />;
      case 'checkout':
        return <Checkout deal={reservedDeal} onComplete={() => handleNavigate('orders')} onBack={() => handleNavigate('deal-details')} />;
      case 'reservations':
        return <Reservations onViewDeal={handleViewDeal} />;
      case 'orders':
        return <Orders onViewDeal={handleViewDeal} />;
      case 'favourites':
        return <Favourites onViewDeal={handleViewDeal} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'edit-profile':
        return <EditProfile onBack={() => handleNavigate('profile')} />;
      case 'payment-methods':
        return <PaymentMethods onBack={() => handleNavigate('profile')} />;
      case 'help-centre':
        return <HelpCentre onBack={() => handleNavigate('profile')} />;
      
      // Business Flow
      case 'business-login':
        return (
          <BusinessLogin
            onComplete={handleBusinessLogin}
            onBack={() => setCurrentScreen('continue-as')}
            onSignup={() => setCurrentScreen('business-setup')}
          />
        );
      case 'business-setup':
        return <BusinessSetup onComplete={handleBusinessSetupComplete} />;
      case 'merchant':
        return <MerchantDashboard onBack={() => handleNavigate('profile')} onNavigateToTemplates={() => handleNavigate('deal-templates')} />;
      case 'deal-templates':
        return (
          <DealTemplatesLibrary
            onBack={() => handleNavigate('merchant')}
            onUseTemplate={(templateId) => {
              // Handle use template
              handleNavigate('merchant');
            }}
            onEditTemplate={(templateId) => {
              handleNavigate('template-detail');
            }}
            onCreateNew={() => {
              handleNavigate('template-detail');
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'template-detail':
        return (
          <TemplateDetail
            onBack={() => handleNavigate('deal-templates')}
            onSave={(templateData) => {
              // Handle save
              handleNavigate('deal-templates');
            }}
          />
        );
      
      default:
        return <ContinueAs onSelectCustomer={handleSelectCustomer} onSelectBusiness={handleSelectBusiness} />;
    }
  };

  const showBottomNav = 
    isLoggedIn && 
    userType === 'customer' &&
    !['deal-details', 'checkout', 'edit-profile', 'payment-methods', 'help-centre', 'map-view', 'orders'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#FFFFEF] flex items-center justify-center">
      {/* Mobile Container */}
      <div className="relative w-full max-w-[430px] h-screen bg-[#FFFFEF] shadow-2xl overflow-hidden flex flex-col">
        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
}