import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, MapPin, Zap, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { destinations, searchDestinations, getDestinationsByRank } from '@/data/destinations';
import { useAuth } from '@/hooks/useAuth';
import { getUserTier } from '@/data/subscriptionTiers';
import { useNavigate } from 'react-router-dom';
import StarField from '@/components/StarField';
import BookingModal from '@/components/booking/BookingModal';
import { toast } from '@/components/ui/sonner';

const AllDestinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRank = user?.user_metadata?.rank || 'Acolyte';
  const userTier = getUserTier(userRank);

  const filteredAndSortedDestinations = useMemo(() => {
    let filtered = searchQuery ? searchDestinations(searchQuery) : destinations;
    
    // Filter by user's subscription tier
    const accessibleDestinations = getDestinationsByRank(userRank);
    filtered = filtered.filter(dest => 
      accessibleDestinations.some(accessible => accessible.id === dest.id)
    );

    // Apply additional filters
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'high-adventure':
          filtered = filtered.filter(d => d.adventureLevel >= 8);
          break;
        case 'high-danger':
          filtered = filtered.filter(d => d.dangerLevel >= 8);
          break;
        case 'low-gravity':
          filtered = filtered.filter(d => d.gravityLevel < 0.8);
          break;
        case 'high-gravity':
          filtered = filtered.filter(d => d.gravityLevel > 1.5);
          break;
        case 'top-rated':
          filtered = filtered.filter(d => d.ratings.average >= 4.5);
          break;
      }
    }

    // Sort destinations
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      case 'adventure':
        filtered.sort((a, b) => b.adventureLevel - a.adventureLevel);
        break;
      case 'danger':
        filtered.sort((a, b) => b.dangerLevel - a.dangerLevel);
        break;
      case 'gravity':
        filtered.sort((a, b) => a.gravityLevel - b.gravityLevel);
        break;
      case 'price':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
          return priceA - priceB;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, filterBy, userRank]);

  const handleBookDestination = (destination: any) => {
    if (!user) {
      toast.error('You must join the Empire first to book destinations');
      return;
    }
    setSelectedDestination(destination);
    setShowBookingModal(true);
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.8) return { text: 'Elite', color: 'bg-yellow-600' };
    if (rating >= 4.5) return { text: 'Premium', color: 'bg-purple-600' };
    if (rating >= 4.0) return { text: 'Quality', color: 'bg-blue-600' };
    if (rating < 2.0) return { text: 'Dangerous', color: 'bg-red-600' };
    return { text: 'Standard', color: 'bg-gray-600' };
  };

  return (
    <div className="min-h-screen bg-sith-black relative">
      <StarField />
      
      {/* Header */}
      <div className="relative z-10 pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-sith-red hover:text-sith-red-light"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-4xl font-bold sith-text-glow title-font">All Dark Destinations</h1>
                <p className="text-gray-400 mt-2">
                  Explore {filteredAndSortedDestinations.length} destinations across the galaxy
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sith-red font-semibold">Your Rank: {userRank}</p>
              <p className="text-sm text-gray-400">
                Access to {userTier.destinationLimit === 999 ? 'all' : userTier.destinationLimit} destinations
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-sith-gray/50 border-sith-red/30 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-sith-black border-sith-red/30">
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="adventure">Adventure Level</SelectItem>
                <SelectItem value="danger">Danger Level</SelectItem>
                <SelectItem value="gravity">Gravity</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="bg-sith-gray/50 border-sith-red/30 text-white">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent className="bg-sith-black border-sith-red/30">
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="high-adventure">High Adventure (8+)</SelectItem>
                <SelectItem value="high-danger">High Danger (8+)</SelectItem>
                <SelectItem value="low-gravity">Low Gravity (<0.8G)</SelectItem>
                <SelectItem value="high-gravity">High Gravity (>1.5G)</SelectItem>
                <SelectItem value="top-rated">Top Rated (4.5+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedDestinations.map((destination) => {
              const ratingBadge = getRatingBadge(destination.ratings.average);
              
              return (
                <Card key={destination.id} className="galaxy-card hover:sith-glow transition-all duration-500 group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sith-black via-transparent to-transparent opacity-80"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      <Badge className={`${ratingBadge.color} text-white text-xs`}>
                        {ratingBadge.text}
                      </Badge>
                      <Badge className="bg-sith-red/90 text-white text-xs">
                        {destination.requiredRank}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-1">
                      <div className="bg-black/70 px-2 py-1 rounded text-xs flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-yellow-400" />
                        <span>A: {destination.adventureLevel}</span>
                      </div>
                      <div className="bg-black/70 px-2 py-1 rounded text-xs flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-red-400" />
                        <span>D: {destination.dangerLevel}</span>
                      </div>
                      <div className="bg-black/70 px-2 py-1 rounded text-xs">
                        {destination.gravityLevel}G
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/70 px-2 py-1 rounded">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-white">
                        {destination.ratings.average} ({destination.ratings.count})
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-sith-red">{destination.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {destination.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {destination.backgroundLore}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-sith-red">{destination.price}</span>
                      <Button 
                        className="sith-button"
                        onClick={() => handleBookDestination(destination)}
                      >
                        Enter the Darkness
                      </Button>
                    </div>

                    {/* Survival Notes Preview */}
                    {destination.survivalNotes.length > 0 && (
                      <div className="mt-3 p-2 bg-sith-red/10 border border-sith-red/30 rounded">
                        <p className="text-xs text-sith-red font-semibold mb-1">⚠ Survival Note:</p>
                        <p className="text-xs text-gray-300">{destination.survivalNotes[0]}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAndSortedDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400 mb-2">No destinations found</p>
              <p className="text-sith-red">The dark side has not yet revealed these secrets...</p>
              {userRank === 'Acolyte' && (
                <p className="text-sm text-gray-500 mt-4">
                  Upgrade your rank to access more destinations
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        destination={selectedDestination}
      />
    </div>
  );
};

export default AllDestinations;