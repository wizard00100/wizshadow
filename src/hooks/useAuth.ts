import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...')
        
        // Set a timeout to prevent infinite loading - increased to 30 seconds
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 30000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (!mounted) return;
        
        console.log('Session retrieved:', session ? 'Found' : 'None')
        
        // Check for local subscription data and update user metadata if needed
        if (session?.user) {
          const localSubscription = localStorage.getItem('sith-subscription');
          if (localSubscription) {
            try {
              const subData = JSON.parse(localSubscription);
              
              // Update user metadata if rank has changed
              if (session.user.user_metadata?.rank !== subData.tier) {
                const { error } = await supabase.auth.updateUser({
                  data: {
                    ...session.user.user_metadata,
                    rank: subData.tier,
                    subscription_tier: subData.tier.toLowerCase(),
                    subscription_type: subData.plan,
                    subscription_start: subData.startDate,
                    subscription_end: subData.endDate
                  }
                });
                
                if (!error && mounted) {
                  // Refresh session to get updated user data
                  const { data: { session: updatedSession } } = await supabase.auth.getSession();
                  setUser(updatedSession?.user ?? null);
                } else if (mounted) {
                  setUser(session.user);
                }
              } else if (mounted) {
                setUser(session.user);
              }
            } catch (e) {
              console.error('Error parsing local subscription:', e);
              if (mounted) setUser(session.user);
            }
          } else if (mounted) {
            setUser(session.user);
          }
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          console.log('Setting loading to false')
          setLoading(false);
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session')
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            // Check for local subscription data on sign in
            const localSubscription = localStorage.getItem('sith-subscription');
            if (localSubscription) {
              try {
                const subData = JSON.parse(localSubscription);
                
                // Update user metadata with subscription info
                const { error } = await supabase.auth.updateUser({
                  data: {
                    ...session.user.user_metadata,
                    rank: subData.tier,
                    subscription_tier: subData.tier.toLowerCase(),
                    subscription_type: subData.plan,
                    subscription_start: subData.startDate,
                    subscription_end: subData.endDate
                  }
                });
                
                if (!error && mounted) {
                  // Refresh session to get updated user data
                  const { data: { session: updatedSession } } = await supabase.auth.getSession();
                  setUser(updatedSession?.user ?? null);
                } else if (mounted) {
                  setUser(session.user);
                }
              } catch (e) {
                console.error('Error parsing local subscription on sign in:', e);
                if (mounted) setUser(session.user);
              }
            } else if (mounted) {
              setUser(session.user);
            }
          } else if (event === 'SIGNED_OUT') {
            if (mounted) {
              setUser(null);
              // Clear local subscription data on sign out
              localStorage.removeItem('sith-subscription');
            }
          } else if (mounted) {
            setUser(session?.user ?? null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (mounted) {
            setUser(session?.user ?? null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    )

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [])

  return { user, loading }
}