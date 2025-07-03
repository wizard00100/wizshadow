import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { signUp, signIn, signInWithGoogle, resetPassword } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
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

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        toast.error('The dark side rejects your credentials. Try again.');
        return;
      }

      if (data.user) {
        toast.success('Welcome back to the dark side, my apprentice!');
        onClose();
        setSignInData({ email: '', password: '' });
      }
    } catch (error) {
      toast.error('The Force disturbance prevents your entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Your passwords do not align with the Force.');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Your password lacks the strength of the dark side. Minimum 6 characters required.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
      
      if (error) {
        toast.error('The dark side rejects your offering. Try again.');
        return;
      }

      if (data.user) {
        toast.success('Welcome to the darkness, young apprentice!');
        onClose();
        setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error('A disturbance in the Force prevents your ascension.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error('The Empire\'s alliance with Google has failed.');
        return;
      }

      toast.success('Redirecting through the Imperial network...');
    } catch (error) {
      toast.error('A disturbance in the Force blocks your path.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await resetPassword(forgotPasswordEmail);
      
      if (error) {
        toast.error('The dark side cannot locate this email in our archives.');
        return;
      }

      toast.success('A message from the Empire has been sent. Check your communications.');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error) {
      toast.error('The Force prevents this transmission.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-sith-black border-sith-red/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center sith-text-glow title-font">
              RECOVER YOUR POWER
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-sith-red font-syncopate">IMPERIAL EMAIL</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email coordinates"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-sith-red/30 text-white hover:bg-sith-gray/50 font-syncopate"
                onClick={() => setShowForgotPassword(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                RETREAT
              </Button>
              <Button type="submit" className="flex-1 sith-button" disabled={isLoading}>
                {isLoading ? 'TRANSMITTING...' : 'SEND IMPERIAL MESSAGE'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-sith-black border-sith-red/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center sith-text-glow title-font">
            JOIN THE EMPIRE
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-sith-gray/50">
            <TabsTrigger value="signin" className="data-[state=active]:bg-sith-red data-[state=active]:text-white font-syncopate">
              SIGN IN
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-sith-red data-[state=active]:text-white font-syncopate">
              SIGN UP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sith-red font-syncopate">IMPERIAL EMAIL</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@empire.galaxy"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sith-red font-syncopate">DARK SIDE PASSWORD</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your secret power"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="pl-10 pr-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-sith-red hover:text-sith-red-light underline font-exo"
                >
                  Lost your power?
                </button>
              </div>

              <Button type="submit" className="w-full sith-button" disabled={isLoading}>
                {isLoading ? 'AUTHENTICATING...' : 'ENTER THE EMPIRE'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sith-red/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-sith-black px-2 text-gray-400 font-syncopate">OR CONTINUE WITH</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-sith-red/30 text-white hover:bg-sith-gray/50 font-syncopate"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              IMPERIAL GOOGLE ACCESS
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sith-red font-syncopate">SITH NAME</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your dark identity"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sith-red font-syncopate">IMPERIAL EMAIL</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@empire.galaxy"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="pl-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sith-red font-syncopate">DARK SIDE PASSWORD</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Forge your secret power"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="pl-10 pr-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
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
                <Label htmlFor="signup-confirm-password" className="text-sith-red font-syncopate">CONFIRM POWER</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-sith-red" />
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your secret power"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 bg-sith-gray/50 border-sith-red/30 text-white font-exo"
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
                {isLoading ? 'CREATING ACCOUNT...' : 'JOIN THE DARK SIDE'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sith-red/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-sith-black px-2 text-gray-400 font-syncopate">OR CONTINUE WITH</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-sith-red/30 text-white hover:bg-sith-gray/50 font-syncopate"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              IMPERIAL GOOGLE ACCESS
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;