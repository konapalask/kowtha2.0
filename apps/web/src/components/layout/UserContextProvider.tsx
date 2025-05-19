import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { getCookie } from "@/helpers/localStorage";
import { ACCESS_TOKEN } from "@/constants/defaultKeys";
import { getUserDetailsApi } from "@/services/auth.services";

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
}

export const UserContext = createContext<UserContextType>({
  userDetails: null,
  setUserDetails: () => {},
  loading: true,
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user details from API if token exists
  useEffect(() => {
    const initializeUser = async () => {
      const token = getCookie(ACCESS_TOKEN);
      if (token) {
        try {
          const response = await getUserDetailsApi();
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUserDetails(null);
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  // Wrap setUserDetails to ensure type safety
  const updateUserDetails = (details: UserDetails | null) => {
    setUserDetails(details);
  };

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails: updateUserDetails, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

export default UserContextProvider; 