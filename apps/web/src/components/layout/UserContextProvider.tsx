import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { getItem, setItem } from "@/helpers/localStorage";
import { USER_DETAILS } from "@/constants/defaultKeys";

interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  [key: string]: any;
}

interface UserContextType {
  userDetails: UserDetails | null | undefined;
  setUserDetails: (details: UserDetails | null | undefined) => void;
}

export const UserContext = createContext<UserContextType>({
  userDetails: undefined,
  setUserDetails: () => {},
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  // Add error handling for localStorage access and handle undefined
  const [userDetails, setUserDetails] = useState<UserDetails | null | undefined>(() => {
    try {
      const storedDetails = getItem(USER_DETAILS, true);
      if (!storedDetails) return null;
      return storedDetails as UserDetails;
    } catch (error) {
      console.error('Error reading user details from localStorage:', error);
      return null;
    }
  });

  // Improved error handling and type safety with undefined support
  const updateUserDetails = (details: UserDetails | null | undefined) => {
    try {
      if (details) {
        setItem(USER_DETAILS, details, true);
      } else {
        localStorage.removeItem(USER_DETAILS);
      }
      setUserDetails(details);
    } catch (error) {
      console.error('Error updating user details:', error);
      setUserDetails(null);
    }
  };

  // Add cleanup and error handling
  useEffect(() => {
    return () => {
      try {
        const currentDetails = getItem(USER_DETAILS, true);
        if (!currentDetails) {
          localStorage.removeItem(USER_DETAILS);
        }
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails: updateUserDetails
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};

// Updated type guard to handle undefined
export const isUserDetails = (value: any): value is UserDetails => {
  if (value === null || value === undefined) return false;
  return typeof value === 'object' && 
         ('id' in value || 'email' in value || 'name' in value);
};

// Helper function to safely access user details
export const getUserDetail = <T extends keyof UserDetails>(
  details: UserDetails | null | undefined,
  key: T,
  defaultValue?: UserDetails[T]
): UserDetails[T] | undefined => {
  if (!details) return defaultValue;
  return details[key] ?? defaultValue;
};

export default UserContextProvider;
