import React, { useState } from 'react';
import { ArrowLeft, Plus, Settings, Clock, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DealTemplatesLibraryProps {
  onBack: () => void;
  onUseTemplate: (templateId: string) => void;
  onEditTemplate: (templateId: string) => void;
  onCreateNew: () => void;
  onNavigate: (screen: any) => void;
}

const TEMPLATES = [
  {
    id: 'tmpl-001',
    title: 'Strawberry Bliss Pancakes',
    category: 'Snacks',
    suggestedPrice: 2.80,
    originalPrice: 8.50,
    dietary: ['Vegetarian'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDAzODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    usedCount: 15
  },
  {
    id: 'tmpl-002',
    title: 'Classic Grilled Ribeye',
    category: 'Food',
    suggestedPrice: 10.90,
    originalPrice: 32.00,
    dietary: ['Gluten Free'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2NDAzODYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    usedCount: 23
  },
  {
    id: 'tmpl-003',
    title: 'Healthy Premium Bowl',
    category: 'Food',
    suggestedPrice: 12.80,
    originalPrice: 24.50,
    dietary: ['Vegan', 'Gluten Free'],
    allergens: ['Nuts'],
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjM5NzgyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    usedCount: 31
  },
  {
    id: 'tmpl-004',
    title: 'Garlic Butter Roast Chicken',
    category: 'Food',
    suggestedPrice: 12.80,
    originalPrice: 28.00,
    dietary: ['Gluten Free'],
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1633237308525-cd587cf71926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdCUyMGNoaWNrZW4lMjBkaW5uZXJ8ZW58MXx8fHwxNzY0MDM4NjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    usedCount: 19
  }
];

export function DealTemplatesLibrary({ onBack, onUseTemplate, onEditTemplate, onCreateNew, onNavigate }: DealTemplatesLibraryProps) {
  return (
    <div className="h-full bg-[#FFFFEF] flex flex-col">
      {/* Header */}
      <div className="bg-[#00492C] px-6 pt-12 pb-6">
        <button onClick={onBack} className="text-white mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
          Your Deal Templates
        </h2>
        <p className="text-white/80" style={{ fontSize: '14px' }}>
          Quickly publish deals from pre-saved setups
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="space-y-4">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#00492C]/60 uppercase tracking-wider" style={{ fontSize: '10px', fontWeight: 600 }}>
                          {template.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#EF8E00] text-[#EF8E00]" />
                          <span className="text-[#00492C]" style={{ fontSize: '11px', fontWeight: 600 }}>
                            {template.rating}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-[#00492C] truncate mb-1" style={{ fontSize: '16px', fontWeight: 700 }}>
                        {template.title}
                      </h3>
                      <p className="text-[#00492C]/60" style={{ fontSize: '12px' }}>
                        Used {template.usedCount} times
                      </p>
                    </div>
                    
                    {/* Edit Icon */}
                    <button
                      onClick={() => onEditTemplate(template.id)}
                      className="p-2 rounded-full hover:bg-[#EAEBC4] transition-colors"
                    >
                      <Settings className="w-5 h-5 text-[#00492C]/60" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[#00492C]" style={{ fontSize: '20px', fontWeight: 700 }}>
                      ${template.suggestedPrice}
                    </p>
                    <p className="text-[#00492C]/40 line-through" style={{ fontSize: '14px' }}>
                      ${template.originalPrice}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.dietary.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#D9E021]/20 text-[#00492C] px-2 py-1 rounded-full"
                        style={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        {tag}
                      </span>
                    ))}
                    {template.allergens.length > 0 && (
                      <span
                        className="bg-[#EF8E00]/20 text-[#EF8E00] px-2 py-1 rounded-full"
                        style={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        ⚠️ {template.allergens.length} allergen{template.allergens.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onUseTemplate(template.id)}
                    className="w-full bg-[#00492C] text-white py-2.5 rounded-full hover:bg-[#003821] transition-colors"
                    style={{ fontSize: '13px', fontWeight: 700 }}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State if no templates */}
        {TEMPLATES.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#EAEBC4] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-[#00492C]/40" />
            </div>
            <h3 className="text-[#00492C] mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
              No Templates Yet
            </h3>
            <p className="text-[#00492C]/60 mb-6" style={{ fontSize: '16px' }}>
              Create your first template to save time
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onCreateNew}
        className="fixed bottom-24 right-8 bg-[#EF8E00] text-white w-16 h-16 rounded-full shadow-xl hover:bg-[#d67e00] transition-all hover:scale-110 flex items-center justify-center"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}