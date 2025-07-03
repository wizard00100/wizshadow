import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        // Check for local subscription data and update user metadata if needed
        if (session?.user) {
          const localSubscription = localStorage.getItem('sith-subscription');
          if (localSubscription) {
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
              
              if (!error) {
                // Refresh session to get updated user data
                const { data: { session: updatedSession } } = await supabase.auth.getSession();
                setUser(updatedSession?.user ?? null);
              } else {
                setUser(session.user);
              }
            } else {
              setUser(session.user);
            }
          } else {
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            // Check for local subscription data on sign in
            const localSubscription = localStorage.getItem('sith-subscription');
            if (localSubscription) {
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
              
              if (!error) {
                // Refresh session to get updated user data
                const { data: { session: updatedSession } } = await supabase.auth.getSession();
                setUser(updatedSession?.user ?? null);
              } else {
                setUser(session.user);
              }
            } else {
              setUser(session.user);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            // Clear local subscription data on sign out
            localStorage.removeItem('sith-subscription');
          } else {
            setUser(session?.user ?? null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(session?.user ?? null);
        } finally {
          setLoading(false);
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}