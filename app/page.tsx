import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { Sparkles, Map, Heart, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920')",
          }}
        />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Discover Your Perfect
            <br />
            San Francisco Experience
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl">
            Plan unforgettable days in the city by the bay. From romantic dinners to family adventures,
            we'll help you create the perfect itinerary.
          </p>
          
          <div className="w-full max-w-2xl mb-12">
            <SearchBar large />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/search"
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore All Experiences
            </Link>
            <Link
              href="/itinerary"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Build Your Itinerary
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Plan by Occasion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, label: 'Date Night', href: '/search?occasion=date-night', color: 'secondary' },
              { icon: Sparkles, label: 'Birthday', href: '/search?occasion=birthday', color: 'primary' },
              { icon: Calendar, label: 'Anniversary', href: '/search?occasion=anniversary', color: 'primary' },
              { icon: Map, label: 'Solo Adventure', href: '/search?occasion=solo', color: 'secondary' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <item.icon className={`h-8 w-8 mb-4 text-${item.color}-600 group-hover:scale-110 transition-transform`} />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Curated experiences perfect for {item.label.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Everything You Need to Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Interactive Map</h3>
              <p className="text-gray-600">
                Visualize your itinerary on a beautiful map and optimize your route
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Planning</h3>
              <p className="text-gray-600">
                Build day plans, half-days, or evening itineraries tailored to your budget
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Save & Share</h3>
              <p className="text-gray-600">
                Bookmark favorites and share your perfect SF experience with friends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 SF Experience Discovery. Made with ❤️ for San Francisco explorers.
          </p>
        </div>
      </footer>
    </div>
  );
}

