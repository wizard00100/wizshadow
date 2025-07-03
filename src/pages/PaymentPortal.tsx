import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Coins, Shield, Check, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriptionTiers, SubscriptionTier } from '@/data/subscriptionTiers';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import StarField from '@/components/StarField';
import { supabase } from '@/lib/supabase';

const PaymentPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'payment' | 'processing' | 'success'>('payment');
  
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    address: ''
  });

  const [upiData, setUpiData] = useState({
    id: ''
  });

  const [spaceCreditsData, setSpaceCreditsData] = useState({
    walletId: '',
    pin: ''
  });

  useEffect(() => {
    // Get tier from URL params
    const params = new URLSearchParams(location.search);
    const tierId = params.get('tier');
    const yearly = params.get('yearly') === 'true';
    
    if (tierId) {
      const tier = subscriptionTiers.find(t => t.id === tierId);
      if (tier) {
        setSelectedTier(tier);
        setIsYearly(yearly);
      } else {
        navigate('/subscription-tiers');
      }
    } else {
      navigate('/subscription-tiers');
    }
  }, [location, navigate]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 3);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        toast.error('The Empire requires all card details to proceed.');
        return false;
      }
      if (cardData.number.replace(/\s/g, '').length < 16) {
        toast.error('Your card number lacks the required Imperial digits.');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiData.id) {
        toast.error('The Empire requires your UPI coordinates.');
        return false;
      }
    } else if (paymentMethod === 'space-credits') {
      if (!spaceCreditsData.walletId || !spaceCreditsData.pin) {
        toast.error('Your Space Credits wallet requires full authentication.');
        return false;
      }
    }
    return true;
  };

  const updateUserRank = async (newRank: string) => {
    if (!user) return false;

    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          rank: newRank,
          subscription_tier: selectedTier?.id,
          subscription_type: isYearly ? 'yearly' : 'monthly',
          subscription_start: new Date().toISOString(),
          subscription_end: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        }
      });

      if (error) {
        console.error('Error updating user rank:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user rank:', error);
      return false;
    }
  };

  const processPayment = async () => {
    if (!validatePayment() || !selectedTier || !user) return;

    setIsProcessing(true);
    setPaymentStep('processing');
    
    try {
      // Simulate payment processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock payment success (90% success rate)
      const paymentSuccess = Math.random() > 0.1;
      
      if (paymentSuccess) {
        // Update user rank in Supabase
        const rankUpdateSuccess = await updateUserRank(selectedTier.rank);
        
        if (rankUpdateSuccess) {
          // Store subscription data locally as backup
          const subscriptionData = {
            tier: selectedTier.rank,
            plan: isYearly ? 'yearly' : 'monthly',
            price: isYearly ? selectedTier.yearlyPrice : selectedTier.monthlyPrice,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod,
            subscriptionId: `SITH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          };
          
          localStorage.setItem('sith-subscription', JSON.stringify(subscriptionData));
          
          setPaymentStep('success');
          toast.success('Payment successful! Your ascension to the dark side is complete.');
          
          // Redirect after success animation
          setTimeout(() => {
            navigate('/', { 
              state: { 
                subscriptionSuccess: true, 
                newRank: selectedTier.rank,
                userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Apprentice'
              } 
            });
          }, 4000);
        } else {
          toast.error('Payment successful but rank update failed. Contact Imperial support.');
          setIsProcessing(false);
          setPaymentStep('payment');
        }
      } else {
        toast.error('The Force rejects your offering. Payment failed.');
        setIsProcessing(false);
        setPaymentStep('payment');
      }
    } catch (error) {
      toast.error('A disturbance in the Force prevents your transaction.');
      setIsProcessing(false);
      setPaymentStep('payment');
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Apprentice';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Apprentice';
  };

  if (!selectedTier) {
    return (
      <div className="min-h-screen bg-sith-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sith-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sith-red text-lg title-font">LOADING IMPERIAL PAYMENT PORTAL...</p>
        </div>
      </div>
    );
  }

  const price = isYearly ? selectedTier.yearlyPrice : selectedTier.monthlyPrice;
  const savings = isYearly && selectedTier.monthlyPrice > 0 
    ? (selectedTier.monthlyPrice * 12 - selectedTier.yearlyPrice) 
    : 0;

  // Processing Animation
  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-sith-black relative flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-sith-red/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-sith-red border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-sith-red/20 rounded-full flex items-center justify-center animate-pulse-glow">
              <CreditCard className="h-8 w-8 text-sith-red" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 sith-text-glow title-font">
            PROCESSING SACRIFICE
          </h1>
          <p className="text-xl text-gray-300 mb-6 font-exo">
            The Empire is validating your offering...
          </p>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-sith-red rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <p className="text-sm text-gray-500 font-exo">
            Do not close this portal or the Force will be disturbed...
          </p>
        </div>
      </div>
    );
  }

  // Success Animation with Rank Confirmation
  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-sith-black relative flex items-center justify-center overflow-hidden">
        <StarField />
        
        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-sith-red text-xs font-mono opacity-30 animate-matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          {/* Success Icon */}
          <div className="w-40 h-40 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 rounded-full animate-pulse-glow"></div>
            <div className="absolute inset-2 bg-sith-black rounded-full flex items-center justify-center">
              <Check className="h-20 w-20 text-green-400" />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-sith-red rounded-full flex items-center justify-center animate-bounce">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-5xl font-bold mb-6 sith-text-glow title-font animate-pulse">
            ASCENSION COMPLETE
          </h1>
          
          <div className="mb-8 p-6 bg-sith-gray/30 rounded-xl border border-sith-red/30 holographic">
            <p className="text-2xl text-sith-red mb-4 planet-name">
              "You are now one with the Dark Side,"
            </p>
            <p className="text-3xl font-bold text-yellow-400 mb-2 title-font">
              {selectedTier.rank} {getUserDisplayName().toUpperCase()}
            </p>
            <p className="text-lg text-gray-300 font-exo">
              Your transformation is complete. Feel the power flow through you.
            </p>
          </div>

          {/* New Powers Unlocked */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-sith-red mb-4 font-syncopate">
              NEW POWERS UNLOCKED:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedTier.perks.slice(0, 4).map((perk, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-2 bg-sith-red/10 rounded border border-sith-red/30"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
                  <span className="text-sm text-gray-300 font-exo">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Details */}
          <div className="mb-8 p-4 bg-sith-gray/20 rounded-lg border border-sith-red/20">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 font-exo">Rank:</span>
                <span className="text-sith-red font-bold ml-2 font-syncopate">{selectedTier.rank}</span>
              </div>
              <div>
                <span className="text-gray-400 font-exo">Plan:</span>
                <span className="text-white ml-2 font-exo">{isYearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div>
                <span className="text-gray-400 font-exo">Amount:</span>
                <span className="text-green-400 font-bold ml-2 mono-text">₹{price.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 font-exo">Next Billing:</span>
                <span className="text-white ml-2 mono-text">
                  {new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sith-red font-syncopate animate-pulse">
              YOUR JOURNEY TO THE DARK SIDE CONTINUES...
            </p>
            <p className="text-sm text-gray-400 font-exo">
              Redirecting to your enhanced Imperial dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Payment Form
  return (
    <div className="min-h-screen bg-sith-black relative">
      <StarField />
      
      <div className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/subscription-tiers')}
              className="text-sith-red hover:text-sith-red-light mb-6 font-syncopate"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              RETURN TO RANKS
            </Button>
            
            <h1 className="text-4xl font-bold mb-4 sith-text-glow title-font">
              IMPERIAL PAYMENT PORTAL
            </h1>
            <p className="text-xl text-gray-300 font-exo">
              Complete your sacrifice to ascend to {selectedTier.rank} rank
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="galaxy-card">
              <CardHeader>
                <CardTitle className="text-2xl text-sith-red title-font">ORDER SUMMARY</CardTitle>
                <CardDescription className="font-exo">Your path to greater power</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Plan */}
                <div className="p-4 bg-sith-gray/30 rounded-lg border border-sith-red/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-sith-red planet-name">{selectedTier.name}</h3>
                      <p className="text-gray-400 font-exo">{selectedTier.rank} Rank</p>
                    </div>
                    <Badge className="bg-sith-red text-white font-syncopate">
                      {isYearly ? 'YEARLY' : 'MONTHLY'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {selectedTier.perks.slice(0, 3).map((perk, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300 font-exo">{perk}</span>
                      </div>
                    ))}
                    {selectedTier.perks.length > 3 && (
                      <p className="text-xs text-gray-500 font-exo">
                        +{selectedTier.perks.length - 3} more powers...
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-exo">Subscription ({isYearly ? 'Yearly' : 'Monthly'})</span>
                    <span className="font-bold mono-text">₹{price.toLocaleString()}</span>
                  </div>
                  
                  {isYearly && savings > 0 && (
                    <div className="flex justify-between items-center text-green-400">
                      <span className="font-exo">Yearly Savings</span>
                      <span className="font-bold mono-text">-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-sith-red/30 pt-3">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-sith-red font-syncopate">TOTAL</span>
                      <span className="font-bold text-sith-red mono-text">₹{price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="p-3 bg-sith-red/10 border border-sith-red/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-sith-red" />
                    <span className="text-xs text-sith-red font-bold font-syncopate">IMPERIAL SECURITY</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 font-exo">
                    Your payment is protected by the Empire's finest encryption protocols.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="galaxy-card">
              <CardHeader>
                <CardTitle className="text-2xl text-sith-red title-font">PAYMENT METHOD</CardTitle>
                <CardDescription className="font-exo">Choose your sacrifice method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-sith-red bg-sith-red/20' 
                        : 'border-sith-red/30 hover:border-sith-red/50'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-sith-red" />
                    <span className="text-xs font-syncopate">CARD</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'upi' 
                        ? 'border-sith-red bg-sith-red/20' 
                        : 'border-sith-red/30 hover:border-sith-red/50'
                    }`}
                  >
                    <Smartphone className="h-6 w-6 mx-auto mb-2 text-sith-red" />
                    <span className="text-xs font-syncopate">UPI</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('space-credits')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'space-credits' 
                        ? 'border-sith-red bg-sith-red/20' 
                        : 'border-sith-red/30 hover:border-sith-red/50'
                    }`}
                  >
                    <Coins className="h-6 w-6 mx-auto mb-2 text-sith-red" />
                    <span className="text-xs font-syncopate">CREDITS</span>
                  </button>
                </div>

                {/* Payment Forms */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="payment-card">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-syncopate text-gray-300">IMPERIAL CREDIT CARD</span>
                        <div className="flex space-x-1">
                          <div className="w-6 h-4 bg-blue-600 rounded"></div>
                          <div className="w-6 h-4 bg-red-600 rounded"></div>
                        </div>
                      </div>
                      <div className="text-lg font-bold mono-text mb-2">
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-exo">{cardData.name || 'CARDHOLDER NAME'}</span>
                        <span className="mono-text">{cardData.expiry || 'MM/YY'}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sith-red font-syncopate">CARDHOLDER NAME</Label>
                        <Input
                          value={cardData.name}
                          onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                          placeholder="DARTH CARDHOLDER"
                          className="bg-sith-gray/50 border-sith-red/30 text-white font-exo"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sith-red font-syncopate">CARD NUMBER</Label>
                        <Input
                          value={cardData.number}
                          onChange={(e) => handleCardInputChange('number', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="bg-sith-gray/50 border-sith-red/30 text-white mono-text"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sith-red font-syncopate">EXPIRY</Label>
                          <Input
                            value={cardData.expiry}
                            onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                            placeholder="MM/YY"
                            className="bg-sith-gray/50 border-sith-red/30 text-white mono-text"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label className="text-sith-red font-syncopate">CVV</Label>
                          <Input
                            value={cardData.cvv}
                            onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                            placeholder="123"
                            type="password"
                            className="bg-sith-gray/50 border-sith-red/30 text-white mono-text"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-sith-gray/30 rounded-lg border border-sith-red/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <Smartphone className="h-8 w-8 text-sith-red" />
                        <div>
                          <h3 className="font-bold text-sith-red font-syncopate">UPI PAYMENT</h3>
                          <p className="text-xs text-gray-400 font-exo">Unified Payments Interface</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sith-red font-syncopate">UPI ID</Label>
                      <Input
                        value={upiData.id}
                        onChange={(e) => setUpiData(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="darth@paytm"
                        className="bg-sith-gray/50 border-sith-red/30 text-white font-exo"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'space-credits' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-sith-gray/30 rounded-lg border border-sith-red/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <Coins className="h-8 w-8 text-sith-red" />
                        <div>
                          <h3 className="font-bold text-sith-red font-syncopate">SPACE CREDITS</h3>
                          <p className="text-xs text-gray-400 font-exo">Galactic Digital Currency</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sith-red font-syncopate">WALLET ID</Label>
                        <Input
                          value={spaceCreditsData.walletId}
                          onChange={(e) => setSpaceCreditsData(prev => ({ ...prev, walletId: e.target.value }))}
                          placeholder="SITH-WALLET-123456"
                          className="bg-sith-gray/50 border-sith-red/30 text-white mono-text"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sith-red font-syncopate">SECURITY PIN</Label>
                        <Input
                          value={spaceCreditsData.pin}
                          onChange={(e) => setSpaceCreditsData(prev => ({ ...prev, pin: e.target.value.replace(/[^0-9]/g, '').substring(0, 6) }))}
                          placeholder="••••••"
                          type="password"
                          className="bg-sith-gray/50 border-sith-red/30 text-white mono-text"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <Button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="w-full sith-button text-lg py-4"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>PROCESSING SACRIFICE...</span>
                    </div>
                  ) : (
                    `PROCEED WITH SACRIFICE - ₹${price.toLocaleString()}`
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center font-exo">
                  By proceeding, you pledge allegiance to the Empire and accept our terms of darkness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;