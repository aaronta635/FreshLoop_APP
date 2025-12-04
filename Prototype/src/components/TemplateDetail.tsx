import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TemplateDetailProps {
  templateId?: string | null;
  onBack: () => void;
  onSave: (templateData: any) => void;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Halal', 'Kosher'];
const ALLERGEN_OPTIONS = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Shellfish', 'Fish', 'Sesame'];

export function TemplateDetail({ templateId, onBack, onSave }: TemplateDetailProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    suggestedPrice: '',
    originalPrice: '',
    description: '',
    dietary: [] as string[],
    allergens: [] as string[],
    image: null as string | null
  });

  const toggleDietary = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(item => item !== option)
        : [...prev.dietary, option]
    }));
  };

  const toggleAllergen = (option: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(option)
        ? prev.allergens.filter(item => item !== option)
        : [...prev.allergens, option]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <button onClick={onBack} className="text-white mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '28px', fontWeight: 700 }}>
          {templateId ? 'Edit Template' : 'New Template'}
        </h2>
        <p className="text-white/80 mt-1" style={{ fontSize: '14px' }}>
          Save time by reusing deal setups
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-[#00492C] mb-3 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Template Image
            </label>
            {formData.image ? (
              <div className="relative">
                <div className="w-full h-48 rounded-3xl overflow-hidden">
                  <ImageWithFallback
                    src={formData.image}
                    alt="Template"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: null })}
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-[#00492C]" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#00492C]/30 rounded-3xl p-12 text-center hover:border-[#00492C] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-[#00492C]/40 mx-auto mb-3" />
                <p className="text-[#00492C]" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Upload Deal Image
                </p>
                <p className="text-[#00492C]/60 mt-1" style={{ fontSize: '12px' }}>
                  PNG or JPG, max 5MB
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Template Title
            </label>
            <input
              type="text"
              placeholder="e.g. Strawberry Bliss Pancakes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-white border-2 border-[#00492C]/20 rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
              style={{ fontSize: '16px' }}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-6 py-4 bg-white border-2 border-[#00492C]/20 rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
              style={{ fontSize: '16px' }}
              required
            >
              <option value="">Select category</option>
              <option value="Snacks">Snacks</option>
              <option value="Food">Food</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#00492C]" style={{ fontSize: '16px' }}>
                  $
                </span>
                <input
                  type="number"
                  step="0.10"
                  placeholder="0.00"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full pl-10 pr-6 py-4 bg-white border-2 border-[#00492C]/20 rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                  style={{ fontSize: '16px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
                Loop Price
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#00492C]" style={{ fontSize: '16px' }}>
                  $
                </span>
                <input
                  type="number"
                  step="0.10"
                  placeholder="0.00"
                  value={formData.suggestedPrice}
                  onChange={(e) => setFormData({ ...formData, suggestedPrice: e.target.value })}
                  className="w-full pl-10 pr-6 py-4 bg-white border-2 border-[#00492C]/20 rounded-full focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C]"
                  style={{ fontSize: '16px' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#00492C] mb-2 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Description
            </label>
            <textarea
              placeholder="Describe what's included in this deal..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-6 py-4 bg-white border-2 border-[#00492C]/20 rounded-3xl focus:outline-none focus:border-[#00492C] transition-colors text-[#00492C] resize-none"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-[#00492C] mb-3 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Dietary Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleDietary(option)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    formData.dietary.includes(option)
                      ? 'bg-[#D9E021] border-[#D9E021] text-[#00492C]'
                      : 'bg-white border-[#00492C]/20 text-[#00492C] hover:border-[#00492C]'
                  }`}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {formData.dietary.includes(option) && '✓ '}
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Allergen Tags */}
          <div>
            <label className="block text-[#00492C] mb-3 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 600 }}>
              Allergen Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleAllergen(option)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    formData.allergens.includes(option)
                      ? 'bg-[#EF8E00] border-[#EF8E00] text-white'
                      : 'bg-white border-[#00492C]/20 text-[#00492C] hover:border-[#EF8E00]'
                  }`}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {formData.allergens.includes(option) && '⚠️ '}
                  {option}
                </button>
              ))}
            </div>
            <p className="text-[#00492C]/60 mt-3" style={{ fontSize: '12px' }}>
              Select all allergens present in this dish
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-[#D9E021]/20 border border-[#D9E021] rounded-3xl p-4">
            <p className="text-[#00492C]" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              💡 <strong>Tip:</strong> Templates help you publish deals faster. You can always adjust quantities and pickup times when using a template.
            </p>
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="px-6 pb-8 pt-4 bg-white border-t border-[#00492C]/10">
        <button
          onClick={handleSubmit}
          className="w-full bg-[#EF8E00] text-white py-5 rounded-full hover:bg-[#d67e00] transition-colors"
          style={{ fontSize: '18px', fontWeight: 700 }}
        >
          Save Template
        </button>
      </div>
    </div>
  );
}
