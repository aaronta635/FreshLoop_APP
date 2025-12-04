import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PreferencesSetupProps {
  onComplete: () => void;
}

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'gluten-free', label: 'Gluten Free', emoji: '🌾' },
  { id: 'dairy-free', label: 'Dairy Free', emoji: '🥛' },
  { id: 'halal', label: 'Halal', emoji: '🕌' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️' }
];

const FOOD_TYPES = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🥞' },
  { id: 'lunch', label: 'Lunch', emoji: '🍱' },
  { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
  { id: 'snacks', label: 'Snacks', emoji: '🍪' },
  { id: 'beverages', label: 'Beverages', emoji: '☕' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' }
];

const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Budget Friendly', range: 'Under $5', emoji: '💵' },
  { id: 'moderate', label: 'Moderate', range: '$5 - $15', emoji: '💳' },
  { id: 'premium', label: 'Premium', range: '$15+', emoji: '💎' }
];

export function PreferencesSetup({ onComplete }: PreferencesSetupProps) {
  const [dietary, setDietary] = useState<string[]>([]);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('moderate');

  const toggleDietary = (id: string) => {
    setDietary(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleFoodType = (id: string) => {
    setFoodTypes(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <h2 className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
          Your Preferences
        </h2>
        <p className="text-white/80 mt-2" style={{ fontSize: '16px' }}>
          Help us personalize your experience
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Dietary Preferences */}
        <section>
          <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
            Dietary Preferences
          </h3>
          <p className="text-[#00492C]/60 mb-4" style={{ fontSize: '14px' }}>
            Select all that apply
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DIETARY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleDietary(option.id)}
                className={`p-4 rounded-3xl border-2 transition-all ${
                  dietary.includes(option.id)
                    ? 'bg-[#00492C] border-[#00492C] text-white'
                    : 'bg-white border-[#00492C]/20 text-[#00492C] hover:border-[#00492C]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: '24px' }}>{option.emoji}</span>
                  {dietary.includes(option.id) && (
                    <div className="bg-[#D9E021] rounded-full p-1">
                      <Check className="w-3 h-3 text-[#00492C]" />
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, textAlign: 'left' }}>
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Food Types */}
        <section>
          <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
            What are you looking for?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {FOOD_TYPES.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleFoodType(option.id)}
                className={`p-4 rounded-3xl border-2 transition-all ${
                  foodTypes.includes(option.id)
                    ? 'bg-[#00492C] border-[#00492C] text-white'
                    : 'bg-white border-[#00492C]/20 text-[#00492C] hover:border-[#00492C]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: '24px' }}>{option.emoji}</span>
                  {foodTypes.includes(option.id) && (
                    <div className="bg-[#D9E021] rounded-full p-1">
                      <Check className="w-3 h-3 text-[#00492C]" />
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, textAlign: 'left' }}>
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Budget */}
        <section>
          <h3 className="text-[#00492C] mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>
            Budget Preference
          </h3>
          <div className="space-y-3">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setBudget(option.id)}
                className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                  budget === option.id
                    ? 'bg-[#00492C] border-[#00492C] text-white'
                    : 'bg-white border-[#00492C]/20 text-[#00492C] hover:border-[#00492C]'
                }`}
              >
                <span style={{ fontSize: '32px' }}>{option.emoji}</span>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: '16px', fontWeight: 700 }}>{option.label}</p>
                  <p className={`${budget === option.id ? 'text-white/80' : 'text-[#00492C]/60'}`} style={{ fontSize: '14px' }}>
                    {option.range}
                  </p>
                </div>
                {budget === option.id && (
                  <div className="bg-[#D9E021] rounded-full p-1.5">
                    <Check className="w-4 h-4 text-[#00492C]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 pt-4 space-y-3">
        <button
          onClick={handleComplete}
          className="w-full bg-[#00492C] text-white py-5 rounded-full hover:bg-[#003821] transition-colors"
          style={{ fontSize: '18px', fontWeight: 700 }}
        >
          Save Preferences
        </button>
        <button
          onClick={handleComplete}
          className="w-full text-[#00492C]/60 hover:text-[#00492C] py-3"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
