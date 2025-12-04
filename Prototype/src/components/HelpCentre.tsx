import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react';

interface HelpCentreProps {
  onBack: () => void;
}

const FAQ_DATA = [
  {
    id: '1',
    question: 'How does Fresh Loop work?',
    answer: 'Fresh Loop connects you with local restaurants that have surplus food available at discounted prices. Browse available Loops, reserve your meal, and pick it up during the specified time window.'
  },
  {
    id: '2',
    question: 'What is a "Loop"?',
    answer: 'A Loop is a discounted meal or food item that would otherwise go to waste. It\'s typically near its sell-by date but still fresh and safe to eat.'
  },
  {
    id: '3',
    question: 'How do I pick up my order?',
    answer: 'After reserving a Loop, you\'ll receive a QR code and pickup code. Show either at the restaurant during your pickup window and mention "Fresh Loop" to collect your order.'
  },
  {
    id: '4',
    question: 'Can I choose what\'s in my Loop?',
    answer: 'Most Loops are "surprise bags" where the contents vary based on daily availability. Some restaurants specify what you\'ll receive in the description.'
  },
  {
    id: '5',
    question: 'What if I can\'t make my pickup window?',
    answer: 'You can cancel your reservation up to 2 hours before your pickup window for a full refund. After that, the Loop cannot be refunded.'
  },
  {
    id: '6',
    question: 'Is the food safe to eat?',
    answer: 'Yes! All food is fresh and safe to eat. It\'s simply surplus or near its sell-by date. Restaurants follow all food safety regulations.'
  }
];

export function HelpCentre({ onBack }: HelpCentreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = searchQuery
    ? FAQ_DATA.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQ_DATA;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="mb-4 text-gray-600 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-gray-900 mb-4">Help Centre</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F7F7F5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A8E6A1]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Actions */}
        <section>
          <h3 className="text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#A8E6A1] rounded-2xl p-4 text-left hover:bg-[#95d98e] transition-colors">
              <MessageCircle className="w-6 h-6 text-gray-900 mb-2" />
              <p className="text-gray-900">Live Chat</p>
              <p className="text-gray-700">Chat with support</p>
            </button>
            <button className="bg-[#FFF7C2] rounded-2xl p-4 text-left hover:bg-[#fff5a8] transition-colors">
              <Mail className="w-6 h-6 text-gray-900 mb-2" />
              <p className="text-gray-900">Email Us</p>
              <p className="text-gray-700">Get help via email</p>
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="text-gray-900 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[#F7F7F5] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-900 text-left">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 ml-2" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No results found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h3 className="text-gray-900 mb-3">Contact Information</h3>
          <div className="bg-[#F7F7F5] rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <p className="text-gray-900">support@freshloop.com.au</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Phone</p>
              <p className="text-gray-900">1800 FRESH LOOP</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Hours</p>
              <p className="text-gray-900">Monday - Sunday, 8am - 10pm AEST</p>
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <div className="bg-gradient-to-br from-[#A8E6A1] to-[#FFF7C2] rounded-2xl p-6 text-center">
          <h4 className="text-gray-900 mb-2">Still need help?</h4>
          <p className="text-gray-700 mb-4">
            Our support team is here to assist you with any questions or concerns.
          </p>
          <button className="bg-white text-gray-900 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
