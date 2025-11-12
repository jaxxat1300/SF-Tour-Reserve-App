'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import PlanningOptions, { Occasion, Duration, BudgetLevel, PartySize } from '@/components/PlanningOptions';
import { Sparkles, Map, Heart, Calendar, ArrowRight, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [occasion, setOccasion] = useState<Occasion>('general');
  const [budget, setBudget] = useState<BudgetLevel>(2);
  const [partySize, setPartySize] = useState<PartySize>('couple');
  const [customBudget, setCustomBudget] = useState<number>(0);
  const [showPlanningOptions, setShowPlanningOptions] = useState(false);

  const handleStartPlanning = () => {
    const params = new URLSearchParams();
    if (occasion !== 'general') params.set('occasion', occasion);
    if (budget !== 'custom') params.set('budget', budget.toString());
    if (budget === 'custom' && customBudget > 0) params.set('budget', customBudget.toString());
    if (partySize) params.set('partySize', partySize);
    
    router.push(`/search?${params.toString()}`);
  };

  const occasionCards = [
    { 
      icon: Sparkles, 
      label: 'Birthday', 
      href: '/search?occasion=birthday',
      color: 'primary',
      description: 'Celebrate your special day'
    },
    { 
      icon: Heart, 
      label: 'Anniversary', 
      href: '/search?occasion=anniversary',
      color: 'secondary',
      description: 'Romantic moments together'
    },
    { 
      icon: Calendar, 
      label: 'Date Night', 
      href: '/search?occasion=date-night',
      color: 'primary',
      description: 'Perfect evening out'
    },
    { 
      icon: Map, 
      label: 'Friends Hangout', 
      href: '/search?occasion=friends',
      color: 'secondary',
      description: 'Fun with friends'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[700px] bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920')",
          }}
        />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Plan Your Perfect
              <br />
              <span className="text-secondary-300">SF Celebration</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl">
              Discover unforgettable experiences for birthdays, anniversaries, and special moments in San Francisco
            </p>
          </motion.div>
          
          {/* Quick Start Planning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Start Planning</h2>
                <button
                  onClick={() => setShowPlanningOptions(!showPlanningOptions)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  {showPlanningOptions ? 'Hide Options' : 'Customize'}
                  <ArrowRight className={`h-4 w-4 transition-transform ${showPlanningOptions ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              {showPlanningOptions ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlanningOptions
                    occasion={occasion}
                    duration="full-day"
                    budget={budget}
                    customBudget={customBudget}
                    partySize={partySize}
                    onOccasionChange={setOccasion}
                    onDurationChange={() => {}}
                    onBudgetChange={setBudget}
                    onCustomBudgetChange={setCustomBudget}
                    onPartySizeChange={setPartySize}
                  />
                </motion.div>
              ) : (
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <SearchBar large />
                  </div>
                  <button
                    onClick={handleStartPlanning}
                    className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    <Wand2 className="h-5 w-5" />
                    Get Recommendations
                  </button>
                </div>
              )}
              
              {showPlanningOptions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleStartPlanning}
                    className="w-full px-6 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    Find Perfect Experiences
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Occasion Quick Links */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              Plan by Occasion
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Curated experiences perfect for every special moment
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasionCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="group block p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 h-full"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-${item.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 text-${item.color}-600`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything You Need to Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From discovery to itinerary, we've got you covered
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Map,
                title: 'Interactive Map',
                description: 'Visualize your itinerary on a beautiful map and optimize your route between locations',
                color: 'primary',
              },
              {
                icon: Calendar,
                title: 'Smart Planning',
                description: 'Build day plans, half-days, or evening itineraries tailored to your budget and occasion',
                color: 'secondary',
              },
              {
                icon: Heart,
                title: 'Save & Share',
                description: 'Bookmark favorites and share your perfect SF experience with friends and family',
                color: 'primary',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-10 w-10 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Plan Your Celebration?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover hidden gems and create unforgettable memories in San Francisco
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/search"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                Explore All Experiences
              </Link>
              <Link
                href="/itinerary"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Build Your Itinerary
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 SF Celebration Planner. Made with ❤️ for San Francisco explorers.
          </p>
        </div>
      </footer>
    </div>
  );
}
