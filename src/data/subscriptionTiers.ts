export interface SubscriptionTier {
  id: string;
  name: string;
  rank: string;
  monthlyPrice: number;
  yearlyPrice: number;
  perks: string[];
  destinationLimit: number;
  hasAiChat: boolean;
  hasReviews: boolean;
  hasExclusiveDeals: boolean;
  hasPrioritySupport: boolean;
  hasVipContent: boolean;
  hasPersonalAssistant: boolean;
  hasEarlyBooking: boolean;
  hasSecretRealms: boolean;
  color: string;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    rank: 'Acolyte',
    monthlyPrice: 0,
    yearlyPrice: 0,
    perks: [
      'Basic access to 5 locations',
      'Limited reviews viewing',
      'Standard booking priority',
      'Basic customer support'
    ],
    destinationLimit: 5,
    hasAiChat: false,
    hasReviews: false,
    hasExclusiveDeals: false,
    hasPrioritySupport: false,
    hasVipContent: false,
    hasPersonalAssistant: false,
    hasEarlyBooking: false,
    hasSecretRealms: false,
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 'inquisitor',
    name: 'Inquisitor',
    rank: 'Inquisitor',
    monthlyPrice: 199,
    yearlyPrice: 1999,
    perks: [
      'Access to 15 locations',
      'Use Darth ZEN AI assistant',
      'Leave and read all reviews',
      'Standard booking priority',
      'Email support'
    ],
    destinationLimit: 15,
    hasAiChat: true,
    hasReviews: true,
    hasExclusiveDeals: false,
    hasPrioritySupport: false,
    hasVipContent: false,
    hasPersonalAssistant: false,
    hasEarlyBooking: false,
    hasSecretRealms: false,
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'lord',
    name: 'Lord',
    rank: 'Lord',
    monthlyPrice: 499,
    yearlyPrice: 4999,
    perks: [
      'Access to all public locations',
      'Full Darth ZEN capabilities',
      'Exclusive deals and discounts',
      'Priority AI support',
      'Advanced booking features',
      'VIP customer service'
    ],
    destinationLimit: 999,
    hasAiChat: true,
    hasReviews: true,
    hasExclusiveDeals: true,
    hasPrioritySupport: true,
    hasVipContent: false,
    hasPersonalAssistant: false,
    hasEarlyBooking: true,
    hasSecretRealms: false,
    color: 'from-purple-600 to-purple-800'
  },
  {
    id: 'darth',
    name: 'Darth',
    rank: 'Darth',
    monthlyPrice: 999,
    yearlyPrice: 9499,
    perks: [
      'Access to ALL locations including secret realms',
      'Personal Sith assistant',
      'VIP exclusive content',
      'Early access to new destinations',
      'Custom itinerary planning',
      'Direct line to Darth ZEN',
      'Unlimited booking modifications',
      'Concierge services'
    ],
    destinationLimit: 999,
    hasAiChat: true,
    hasReviews: true,
    hasExclusiveDeals: true,
    hasPrioritySupport: true,
    hasVipContent: true,
    hasPersonalAssistant: true,
    hasEarlyBooking: true,
    hasSecretRealms: true,
    color: 'from-yellow-600 to-yellow-800'
  }
];

export const getUserTier = (userRank: string): SubscriptionTier => {
  return subscriptionTiers.find(tier => tier.rank === userRank) || subscriptionTiers[0];
};