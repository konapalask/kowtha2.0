import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {getItem, setItem} from '../helpers/utility';

interface DepartmentRole {
  department: string;
  role: string;
  officeId: number;
}

interface UserDetails {
  id: number;
  mobile: string;
  employeeCode: string;
  name: string;
  email: string | null;
  defaultDepartment: string;
  status: string;
  locality: string;
  departmentRoles: DepartmentRole[];
}

interface UserContextType {
  userDetails: UserDetails | null;
  currentDept: string;
  setCurrentDept: (dept: string) => void;
  isLoading: boolean;
  refreshUserDetails: () => Promise<void>;
  availableDepartments: string[];
  hasMultipleDepartments: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [currentDept, setCurrentDeptState] = useState<string>('FI');
  const [isLoading, setIsLoading] = useState(true);

  // Get available departments from user details
  const availableDepartments =
    userDetails?.departmentRoles?.map(role => role.department) || [];
  const hasMultipleDepartments = availableDepartments.length > 1;

  // Set current department and persist it
  const setCurrentDept = async (dept: string) => {
    setCurrentDeptState(dept);
    await setItem('currentDept', dept);
  };

  // Load user details and determine initial department
  const refreshUserDetails = async () => {
    try {
      setIsLoading(true);
      const details = await getItem('userDetails');
      const savedDept = await getItem('currentDept');

      if (details) {
        setUserDetails(details);

        // Determine initial department
        const departments =
          details.departmentRoles?.map(role => role.department) || [];

        if (departments.length === 1) {
          // User has only one department
          setCurrentDeptState(departments[0]);
          await setItem('currentDept', departments[0]);
        } else if (departments.length > 1) {
          // User has multiple departments
          if (savedDept && departments.includes(savedDept)) {
            // Use saved department if it's still valid
            setCurrentDeptState(savedDept);
          } else {
            // Use default department or first available
            const defaultDept = details.defaultDepartment || departments[0];
            setCurrentDeptState(defaultDept);
            await setItem('currentDept', defaultDept);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user details on mount
  useEffect(() => {
    refreshUserDetails();
  }, []);

  const value: UserContextType = {
    userDetails,
    currentDept,
    setCurrentDept,
    isLoading,
    refreshUserDetails,
    availableDepartments,
    hasMultipleDepartments,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
