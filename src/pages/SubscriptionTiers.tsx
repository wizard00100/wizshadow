import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StarField from '@/components/StarField';
import { toast } from '@/components/ui/sonner';

const SubscriptionTiers = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentRank = user?.user_metadata?.rank || 'Acolyte';

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      toast.error('You must join the Empire first');
      return;
    }

    if (tierId === 'acolyte') {
      toast.info('You are already an Acolyte. Upgrade to unlock more power!');
      return;
    }

    // Mock payment process
    toast.success(`Initiating ascension to ${tierId}... Payment portal would open here.`);
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Acolyte': return Shield;
      case 'Inquisitor': return Zap;
      case 'Lord': return Star;
      case 'Darth': return Crown;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-sith-black relative">
      <StarField />
      
      <div className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sith-red hover:text-sith-red-light mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-5xl font-bold mb-4 sith-text-glow title-font">
              Dark Side Ascension
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Rise through the ranks of our loyalty program
            </p>

            {user && (
              <div className="inline-flex items-center space-x-2 bg-sith-gray/30 px-4 py-2 rounded-lg border border-sith-red/30">
                <span className="text-gray-400">Current Rank:</span>
                <Badge className="bg-sith-red text-white">{currentRank}</Badge>
              </div>
            )}

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-sith-red"
              />
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-600 text-white ml-2">Save 17%</Badge>
              )}
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier) => {
              const Icon = getRankIcon(tier.rank);
              const isCurrentTier = currentRank === tier.rank;
              const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
              const savings = isYearly && tier.monthlyPrice > 0 
                ? (tier.monthlyPrice * 12 - tier.yearlyPrice) 
                : 0;

              return (
                <Card 
                  key={tier.id} 
                  className={`galaxy-card relative overflow-hidden transition-all duration-300 ${
                    isCurrentTier ? 'ring-2 ring-sith-red sith-glow' : 'hover:sith-glow'
                  } ${tier.rank === 'Darth' ? 'lg:scale-105' : ''}`}
                >
                  {tier.rank === 'Darth' && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-600 to-yellow-800 text-center py-2">
                      <span className="text-sm font-bold text-black">MOST POWERFUL</span>
                    </div>
                  )}

                  {isCurrentTier && (
                    <div className="absolute top-0 left-0 right-0 bg-sith-red text-center py-2">
                      <span className="text-sm font-bold text-white">CURRENT RANK</span>
                    </div>
                  )}

                  <CardHeader className={`text-center ${tier.rank === 'Darth' || isCurrentTier ? 'pt-12' : 'pt-6'}`}>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center animate-pulse-glow`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-sith-red title-font">{tier.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {tier.rank} Rank
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-center">
                    {/* Pricing */}
                    <div className="mb-6">
                      {price === 0 ? (
                        <div className="text-3xl font-bold text-sith-red">FREE</div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-sith-red">
                            ₹{price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            per {isYearly ? 'year' : 'month'}
                          </div>
                          {isYearly && savings > 0 && (
                            <div className="text-xs text-green-400 mt-1">
                              Save ₹{savings.toLocaleString()}/year
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6 text-left">
                      {tier.perks.map((perk, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-sith-red mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{perk}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={isCurrentTier}
                      className={`w-full ${
                        isCurrentTier 
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                          : 'sith-button'
                      }`}
                    >
                      {isCurrentTier ? 'Current Rank' : `Ascend to ${tier.name}`}
                    </Button>

                    {tier.rank === 'Darth' && (
                      <p className="text-xs text-yellow-400 mt-2 font-semibold">
                        Ultimate Power Awaits
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Feature Comparison */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 sith-text-glow">
              Power Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-sith-gray/20 rounded-lg border border-sith-red/30">
                <thead>
                  <tr className="border-b border-sith-red/30">
                    <th className="text-left p-4 text-sith-red">Feature</th>
                    {subscriptionTiers.map(tier => (
                      <th key={tier.id} className="text-center p-4 text-sith-red">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sith-red/20">
                    <td className="p-4 text-gray-300">Destination Access</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4 text-gray-300">
                        {tier.destinationLimit === 999 ? 'All' : tier.destinationLimit}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sith-red/20">
                    <td className="p-4 text-gray-300">Darth ZEN AI</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.hasAiChat ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sith-red/20">
                    <td className="p-4 text-gray-300">Reviews & Ratings</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.hasReviews ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sith-red/20">
                    <td className="p-4 text-gray-300">Exclusive Deals</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.hasExclusiveDeals ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sith-red/20">
                    <td className="p-4 text-gray-300">Priority Support</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.hasPrioritySupport ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sith-red/20">
                    <td className="p-4 text-gray-300">Secret Realms</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.hasSecretRealms ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Personal Assistant</td>
                    {subscriptionTiers.map(tier => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.hasPersonalAssistant ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="holographic p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 sith-text-glow">
                Ready to Embrace the Dark Side?
              </h3>
              <p className="text-gray-300 mb-6">
                Each rank unlocks new levels of power and access to the galaxy's most forbidden destinations. 
                Choose your path wisely, for once you start down the dark path, forever will it dominate your destiny.
              </p>
              {!user && (
                <Button 
                  onClick={() => navigate('/')}
                  className="sith-button text-lg px-8 py-3"
                >
                  Join the Empire
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTiers;