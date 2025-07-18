import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, HelpCircle, FileText, Mail, Phone, MessageSquare, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportPageProps {
  onBack: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'guides'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: '',
    priority: 'medium'
  });

  const faqData = [
    {
      question: "How do I start earning USDT?",
      answer: "To start earning USDT, simply watch ads on our platform. Each ad you watch earns you a small amount of USDT. The more ads you watch, the more you earn. You can also earn through our referral program by inviting friends."
    },
    {
      question: "What is the minimum withdrawal amount?",
      answer: "The minimum withdrawal amount is 10 USDT. This helps us cover transaction fees and ensure efficient processing of withdrawals."
    },
    {
      question: "How long does it take to receive my withdrawal?",
      answer: "Withdrawals are typically processed within 24-48 hours. USDT withdrawals are sent to your provided wallet address once approved by our team."
    },
    {
      question: "How does the referral program work?",
      answer: "When someone signs up using your referral code, you earn a bonus for each ad they watch. You can earn up to 20% of their earnings as referral bonuses."
    },
    {
      question: "What are VIP tiers and how do I unlock them?",
      answer: "VIP tiers provide additional benefits like higher earnings per ad, exclusive rewards, and priority support. You can unlock VIP tiers by watching a certain number of ads daily and maintaining an active streak."
    },
    {
      question: "Is my account secure?",
      answer: "Yes, we implement industry-standard security measures including two-factor authentication, KYC verification, and encrypted data storage to protect your account and funds."
    },
    {
      question: "Can I use multiple accounts?",
      answer: "No, we only allow one account per person. Using multiple accounts is against our terms of service and may result in account suspension."
    },
    {
      question: "What cryptocurrencies do you support?",
      answer: "We currently support USDT (TRC20 and ERC20), Bitcoin (BTC), and Ethereum (ETH) for deposits and withdrawals."
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn how to create an account and start earning USDT",
      icon: "🚀",
      content: "Step-by-step guide to setting up your account and beginning your earning journey."
    },
    {
      title: "Ad Watching Tips",
      description: "Maximize your earnings with these proven strategies",
      icon: "📺",
      content: "Best practices for watching ads efficiently and earning more USDT."
    },
    {
      title: "Referral Program Guide",
      description: "Learn how to earn through our referral system",
      icon: "👥",
      content: "Complete guide to the referral program and how to maximize your referral earnings."
    },
    {
      title: "VIP Program Explained",
      description: "Everything you need to know about VIP tiers",
      icon: "👑",
      content: "Detailed explanation of VIP tiers, benefits, and how to unlock them."
    },
    {
      title: "Security Best Practices",
      description: "Keep your account and funds safe",
      icon: "🔒",
      content: "Essential security tips to protect your account and cryptocurrency."
    },
    {
      title: "Withdrawal Guide",
      description: "How to withdraw your earnings safely",
      icon: "💰",
      content: "Step-by-step process for withdrawing your USDT earnings to your wallet."
    }
  ];

  const contactMethods = [
    {
      name: "Email Support",
      description: "Get help via email",
      icon: Mail,
      contact: "support@usdtrewards.com",
      responseTime: "Within 24 hours"
    },
    {
      name: "Live Chat",
      description: "Chat with our support team",
      icon: MessageSquare,
      contact: "Available 24/7",
      responseTime: "Instant"
    },
    {
      name: "Phone Support",
      description: "Call us directly",
      icon: Phone,
      contact: "+1 (555) 123-4567",
      responseTime: "Within 2 hours"
    }
  ];

  const filteredFaq = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    alert('Thank you for contacting us! We will get back to you within 24 hours.');
    setContactForm({
      subject: '',
      message: '',
      email: '',
      priority: 'medium'
    });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Support & Help Center</h1>
            <p className="text-slate-400">Get help and find answers to your questions</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center">
              <MessageCircle size={24} className="text-blue-400 mr-3" />
              <div>
                <p className="text-slate-400 text-sm">Support Tickets</p>
                <p className="text-white text-xl font-bold">24/7</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center">
              <HelpCircle size={24} className="text-green-400 mr-3" />
              <div>
                <p className="text-slate-400 text-sm">Response Time</p>
                <p className="text-white text-xl font-bold">&lt; 24h</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center">
              <FileText size={24} className="text-purple-400 mr-3" />
              <div>
                <p className="text-slate-400 text-sm">Help Articles</p>
                <p className="text-white text-xl font-bold">50+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 rounded-lg p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'faq'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'guides'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Help Guides
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'contact'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaq.map((faq, index) => (
                <div key={index} className="bg-slate-800 rounded-lg border border-slate-700">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp size={20} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-slate-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaq.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No FAQ items found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="text-4xl mb-4">{guide.icon}</div>
                <h3 className="text-white font-semibold mb-2">{guide.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{guide.description}</p>
                <p className="text-slate-300 text-sm">{guide.content}</p>
                <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Read More →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Contact Methods</h3>
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center mb-3">
                    <method.icon size={24} className="text-blue-400 mr-3" />
                    <div>
                      <h4 className="text-white font-medium">{method.name}</h4>
                      <p className="text-slate-400 text-sm">{method.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-300">{method.contact}</p>
                    <p className="text-slate-400 text-sm">Response time: {method.responseTime}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What can we help you with?"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                    rows={5}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage; 