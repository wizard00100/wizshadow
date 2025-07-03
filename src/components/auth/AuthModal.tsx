import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (signInData.email && signInData.password) {
        const user = {
          id: '1',
          name: 'Darth Traveler',
          email: signInData.email,
          rank: 'Sith Acolyte'
        };
        onAuthSuccess(user);
        toast.success('Welcome back to the dark side!');
        onClose();
      } else {
        toast.error('Invalid credentials. The Force is not strong with you.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setShowOTP(true);
      setIsLoading(false);
      toast.success('OTP sent to your email. Check your inbox.');
    }, 1500);
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      const user = {
        id: '2',
        name: signUpData.name,
        email: signUpData.email,
        rank: 'New Acolyte'
      };
      onAuthSuccess(user);
      toast.success('Account created! Welcome to the Empire!');
      onClose();
      setIsLoading(false);
      setShowOTP(false);
    }, 1500);
  };

  const resendOTP = () => {
    toast.success('OTP resent to your email');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-sith-black border-sith-red/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center sith-text-glow title-font">
            Join the Empire
          </DialogTitle>
        </DialogHeader>

        {!showOTP ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-sith-gray/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-sith-red data-[state=active]:text-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-sith-red data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sith-red">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@empire.galaxy"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sith-red">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="pl-10 pr-10 bg-sith-gray/50 border-sith-red/30 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-sith-red hover:text-sith-red-light"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full sith-button" disabled={isLoading}>
                  {isLoading ? 'Authenticating...' : 'Enter the Empire'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sith-red">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Sith name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sith-red">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@empire.galaxy"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sith-red">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="pl-10 pr-10 bg-sith-gray/50 border-sith-red/30 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-sith-red hover:text-sith-red-light"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-sith-red">Confirm Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 bg-sith-gray/50 border-sith-red/30 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-sith-red hover:text-sith-red-light"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full sith-button" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Join the Dark Side'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-sith-red">Verify Your Email</h3>
              <p className="text-gray-400">
                Enter the 6-digit code sent to {signUpData.email}
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-sith-red/30 text-white" />
                  <InputOTPSlot index={1} className="border-sith-red/30 text-white" />
                  <InputOTPSlot index={2} className="border-sith-red/30 text-white" />
                  <InputOTPSlot index={3} className="border-sith-red/30 text-white" />
                  <InputOTPSlot index={4} className="border-sith-red/30 text-white" />
                  <InputOTPSlot index={5} className="border-sith-red/30 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleOTPVerification} 
                className="w-full sith-button" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Join Empire'}
              </Button>

              <button
                type="button"
                onClick={resendOTP}
                className="text-sith-red hover:text-sith-red-light text-sm underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;