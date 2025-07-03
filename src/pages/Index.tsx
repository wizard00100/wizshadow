import React, { useState, useMemo } from 'react';
import { Search, MapPin, Shield, Zap, Star, Crown, Swords, Moon, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StarField from '@/components/StarField';
import AuthModal from '@/components/auth/AuthModal';
import BookingModal from '@/components/booking/BookingModal';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const destinations = [
    {
      name: "Mustafar Volcano Spires",
      description: "Lava bath chambers and fortress suites",
      price: "2,500 Imperial Credits",
      image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&w=800&q=80",
      danger: 5,
      luxury: 4,
      keywords: ["mustafar", "volcano", "lava", "fortress", "fire", "heat"]
    },
    {
      name: "Exegol Meditation Crypts",
      description: "Infinite silence and power surges",
      price: "5,000 Imperial Credits",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      danger: 4,
      luxury: 5,
      keywords: ["exegol", "meditation", "crypts", "silence", "power", "dark"]
    },
    {
      name: "Korriban Tomb Suites",
      description: "Sleep among the ancient Sith Lords",
      price: "3,800 Imperial Credits",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      danger: 5,
      luxury: 3,
      keywords: ["korriban", "tomb", "ancient", "sith", "lords", "burial"]
    },
    {
      name: "Dromund Kaas Sky Sanctums",
      description: "Luxury in a storm-wracked skyline",
      price: "4,200 Imperial Credits",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80",
      danger: 3,
      luxury: 5,
      keywords: ["dromund", "kaas", "sky", "storm", "luxury", "skyline"]
    },
    {
      name: "Dathomir Nightsister Retreats",
      description: "Mystical caves with ancient magic",
      price: "4,500 Imperial Credits",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      danger: 4,
      luxury: 4,
      keywords: ["dathomir", "nightsister", "magic", "caves", "mystical", "witches"]
    },
    {
      name: "Malachor Shadow Temples",
      description: "Where the Force itself was broken",
      price: "6,000 Imperial Credits",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
      danger: 5,
      luxury: 3,
      keywords: ["malachor", "shadow", "temples", "force", "broken", "ancient"]
    }
  ];

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;
    
    const query = searchQuery.toLowerCase();
    return destinations.filter(destination => 
      destination.name.toLowerCase().includes(query) ||
      destination.description.toLowerCase().includes(query) ||
      destination.keywords.some(keyword => keyword.includes(query))
    );
  }, [searchQuery]);

  const amenities = [
    { name: "Force Meditation Chambers", icon: Moon, description: "Channel the dark side in isolation" },
    { name: "Lightsaber Dueling Arenas", icon: Swords, description: "Practice your combat skills" },
    { name: "Anti-Jedi Detection Fields", icon: Shield, description: "Complete privacy guaranteed" },
    { name: "Dark Side Spa", icon: Zap, description: "Rejuvenate with Force lightning" }
  ];

  const reviews = [
    {
      name: "Darth Malak",
      rank: "Sith Lord",
      rating: 5,
      review: "The meditation chambers on Exegol exceeded my expectations. The dark side flows strongly here.",
      planet: "Exegol"
    },
    {
      name: "Savage Opress",
      rank: "Sith Acolyte",
      rating: 4,
      review: "Mustafar's volcanic energy is intoxicating. Perfect for dark rituals.",
      planet: "Mustafar"
    },
    {
      name: "Asajj Ventress",
      rank: "Dark Assassin",
      rating: 5,
      review: "Korriban's ancient tombs whisper secrets of power. Highly recommended.",
      planet: "Korriban"
    }
  ];

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('May the Force be with you on your next journey');
  };

  const handleBookDestination = (destination: any) => {
    if (!user) {
      toast.error('You must join the Empire first to book destinations');
      setShowAuthModal(true);
      return;
    }
    setSelectedDestination(destination);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-sith-black overflow-x-hidden relative">
      <StarField />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 holographic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold sith-text-glow title-font">ShadowPortals</h1>
              <span className="text-sith-red text-sm font-medium">The Galaxy's Dark Elite</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#destinations" className="hover:text-sith-red transition-colors font-medium">Destinations</a>
              <a href="#amenities" className="hover:text-sith-red transition-colors font-medium">Amenities</a>
              <a href="#reviews" className="hover:text-sith-red transition-colors font-medium">Reviews</a>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border border-sith-red/30">
                        <AvatarFallback className="bg-sith-red text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-sith-black border-sith-red/30" align="end">
                    <DropdownMenuItem className="text-white hover:bg-sith-gray/50">
                      <User className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-sith-red">{user.rank}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-white hover:bg-sith-gray/50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="sith-button"
                  onClick={() => setShowAuthModal(true)}
                >
                  Join the Empire
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden nebula-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sith-black/50 to-sith-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-sith-red/10 via-transparent to-sith-red/10 animate-red-flicker"></div>
        </div>

        <div className="relative z-10 text-center px-4 animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-black mb-6 sith-text-glow animate-pulse-glow title-font">
            SHADOWPORTALS
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-sith-red font-bold">
            Book Your Stay in the Shadows of the Galaxy
          </p>
          <p className="text-xl mb-8 opacity-90 font-medium">
            Luxury, secrecy, and domination await in the darkest corners of space.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-sith-red" />
                <Input
                  placeholder="Search destinations... let the dark side guide you"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-sith-gray/80 border-sith-red/30 text-white placeholder-gray-400 h-12 backdrop-blur-sm"
                />
              </div>
              <Button className="sith-button h-12 px-8">
                Search the Void
              </Button>
            </div>
          </div>

          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-sith-red" />
              <span className="font-medium">Jedi-Free Zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-sith-red" />
              <span className="font-medium">Force Enhanced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-sith-red" />
              <span className="font-medium">Empire Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 sith-text-glow">Dark Destinations</h2>
            <p className="text-xl text-gray-300">Where only the most powerful dare to tread</p>
            {searchQuery && (
              <p className="text-sith-red mt-2">
                Found {filteredDestinations.length} destinations matching "{searchQuery}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <Card key={index} className="galaxy-card hover:sith-glow transition-all duration-500 group cursor-pointer overflow-hidden animate-float-slow">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sith-black via-transparent to-transparent opacity-80"></div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className="bg-sith-red/90 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                      Danger: {destination.danger}/5
                    </div>
                    <div className="bg-sith-red/90 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                      Luxury: {destination.luxury}/5
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-sith-red">{destination.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    {destination.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-sith-red">{destination.price}</span>
                    <Button 
                      className="sith-button"
                      onClick={() => handleBookDestination(destination)}
                    >
                      Enter the Darkness
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDestinations.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No destinations found matching your search.</p>
              <p className="text-sith-red">The dark side has not yet revealed these secrets...</p>
            </div>
          )}
        </div>
      </section>

      {/* Sith Concierge Bot */}
      <section className="py-20 px-4 bg-sith-gray/20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="holographic p-12 rounded-2xl animate-float-slow">
            <div className="w-32 h-32 mx-auto mb-8 bg-sith-red/20 rounded-full flex items-center justify-center sith-glow animate-pulse-glow">
              <div className="w-16 h-16 bg-sith-red rounded-full animate-glow-pulse"></div>
            </div>
            <h2 className="text-4xl font-bold mb-4 sith-text-glow title-font">Darth ZEN</h2>
            <p className="text-xl mb-6 text-sith-red font-semibold">Your Sith Concierge Bot</p>
            <p className="text-lg mb-8 text-gray-300">
              "Greetings, worthy traveler. I sense great power within you. Allow me to guide you to destinations that match your darkness level and Force sensitivity."
            </p>
            <Button className="sith-button text-lg px-8 py-4">
              Consult the Dark Oracle
            </Button>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 sith-text-glow">Sith Amenities</h2>
            <p className="text-xl text-gray-300">Luxuries befitting the dark side elite</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <Card key={index} className="galaxy-card hover:sith-glow transition-all duration-300 text-center group">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-sith-red/20 rounded-full flex items-center justify-center group-hover:bg-sith-red/40 transition-colors group-hover:animate-pulse-glow">
                    <amenity.icon className="h-8 w-8 text-sith-red" />
                  </div>
                  <CardTitle className="text-xl text-sith-red">{amenity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{amenity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 px-4 bg-sith-gray/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 sith-text-glow">Empire Reviews</h2>
            <p className="text-xl text-gray-300">Testimonials from the galaxy's most feared</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="galaxy-card hover:sith-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl text-sith-red">{review.name}</CardTitle>
                      <CardDescription className="text-gray-400 font-medium">{review.rank}</CardDescription>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-sith-red fill-current" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 italic">"{review.review}"</p>
                  <div className="flex items-center space-x-2 text-sm text-sith-red">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{review.planet}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Side Loyalty Program */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 sith-text-glow">Dark Side Ascension</h2>
          <p className="text-xl mb-12 text-gray-300">Rise through the ranks of our loyalty program</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Acolyte', 'Inquisitor', 'Lord', 'Darth'].map((rank, index) => (
              <div key={index} className="galaxy-card p-6 hover:sith-glow transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-4 bg-sith-red/20 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Crown className="h-8 w-8 text-sith-red" />
                </div>
                <h3 className="text-xl font-bold text-sith-red mb-2">{rank}</h3>
                <p className="text-sm text-gray-400">
                  {index + 1 === 1 && "Begin your journey into darkness"}
                  {index + 1 === 2 && "Access exclusive destinations"}
                  {index + 1 === 3 && "Force-enhanced luxury suites"}
                  {index + 1 === 4 && "Ultimate power and access"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sith-black border-t border-sith-red/20 py-12 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 sith-text-glow title-font">ShadowPortals</h3>
              <p className="text-gray-400">The galaxy's premier dark side travel platform.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sith-red">Destinations</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Mustafar</li>
                <li>Exegol</li>
                <li>Korriban</li>
                <li>Dromund Kaas</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sith-red">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Hyperspace Travel</li>
                <li>Force Training</li>
                <li>Sith Concierge</li>
                <li>Dark Side Spa</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sith-red">Empire Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Hologram: +GAL-SITH-RULE</li>
                <li>darkside@shadowportals.empire</li>
                <li>Death Star Sector 7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sith-red/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ShadowPortals. All rights reserved across the galaxy. May the Force serve you.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        destination={selectedDestination}
      />
    </div>
  );
};

export default Index;