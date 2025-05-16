import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserDetailsApi } from '@/services/auth.services';
import { useSession } from 'next-auth/react';

interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  [key: string]: any;
}

interface UserContextType {
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails | null) => void;
  loading: boolean;
  refetchUserDetails: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserDetailsApi();
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserDetails();
    } else {
      setUserDetails(null);
      setLoading(false);
    }
  }, [session]);

  const value = {
    userDetails,
    setUserDetails,
    loading,
    refetchUserDetails: fetchUserDetails,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
} 