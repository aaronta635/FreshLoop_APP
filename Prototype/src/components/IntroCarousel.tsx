import React, { useState } from 'react';
import { ChevronRight, DollarSign, Leaf, MapPin } from 'lucide-react';

interface IntroCarouselProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: DollarSign,
    iconBg: '#EF8E00',
    title: 'Save Money',
    description: 'Get delicious meals at up to 70% off from your favorite local restaurants and cafes',
    emoji: '💰'
  },
  {
    icon: Leaf,
    iconBg: '#D9E021',
    title: 'Reduce Waste',
    description: 'Help fight food waste by rescuing perfectly good meals that would otherwise be thrown away',
    emoji: '🌍'
  },
  {
    icon: MapPin,
    iconBg: '#00492C',
    title: 'Eat Local',
    description: 'Support your local community while discovering amazing food spots in Wollongong, Dapto, and Unanderra',
    emoji: '🏪'
  }
];

export function IntroCarousel({ onComplete }: IntroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Skip Button */}
      <div className="px-6 pt-12 pb-4">
        <button
          onClick={handleSkip}
          className="ml-auto block text-[#00492C]/60 hover:text-[#00492C] transition-colors"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Icon */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg"
          style={{ backgroundColor: slide.iconBg }}
        >
          <span style={{ fontSize: '64px' }}>{slide.emoji}</span>
        </div>

        {/* Title */}
        <h2 className="text-[#00492C] mb-4" style={{ fontSize: '36px', fontWeight: 700 }}>
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-[#00492C]/70 max-w-sm" style={{ fontSize: '18px', lineHeight: '1.6' }}>
          {slide.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pb-12">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-8 h-2 bg-[#00492C] rounded-full'
                  : 'w-2 h-2 bg-[#00492C]/20 rounded-full hover:bg-[#00492C]/40'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors flex items-center justify-center gap-2"
          style={{ fontSize: '18px', fontWeight: 700 }}
        >
          {currentSlide === SLIDES.length - 1 ? "Let's Get Started" : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
