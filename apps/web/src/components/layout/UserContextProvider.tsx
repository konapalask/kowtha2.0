import React, { createContext, useState, ReactNode, useContext } from "react";

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
}

export const UserContext = createContext<UserContextType>({
  userDetails: null,
  setUserDetails: () => {},
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
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