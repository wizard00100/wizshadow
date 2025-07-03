import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed');
          navigate('/');
          return;
        }

        if (data.session) {
          toast.success('Successfully signed in with Google!');
          navigate('/');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-sith-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sith-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sith-red text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;