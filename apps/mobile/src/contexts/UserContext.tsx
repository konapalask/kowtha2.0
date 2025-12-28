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

  // Get available departments where user is FieldExecutive
  console.log('userDetails', userDetails);
  const availableDepartments =
    userDetails?.departmentRoles
      ?.filter((role: DepartmentRole) => role.role === 'FieldExecutive')
      .map((role: DepartmentRole) => role.department) || [];
  console.log('availableDepartments', availableDepartments);
  // Only show switcher if user is FieldExecutive in multiple departments
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

        // Determine initial department - only consider departments where user is FieldExecutive
        const fieldExecutiveDepartments =
          details.departmentRoles
            ?.filter((role: DepartmentRole) => role.role === 'FieldExecutive')
            .map((role: DepartmentRole) => role.department) || [];

        if (fieldExecutiveDepartments.length === 0) {
          // No FieldExecutive departments - fallback to first available department
          const allDepartments =
            details.departmentRoles?.map(
              (role: DepartmentRole) => role.department,
            ) || [];
          if (allDepartments.length > 0) {
            setCurrentDeptState(allDepartments[0]);
            await setItem('currentDept', allDepartments[0]);
          }
        } else if (fieldExecutiveDepartments.length === 1) {
          // User has only one FieldExecutive department
          setCurrentDeptState(fieldExecutiveDepartments[0]);
          await setItem('currentDept', fieldExecutiveDepartments[0]);
        } else {
          // User has multiple FieldExecutive departments
          if (savedDept && fieldExecutiveDepartments.includes(savedDept)) {
            // Use saved department if it's still valid
            setCurrentDeptState(savedDept);
          } else {
            // Use default department if it's a FieldExecutive department, otherwise first FieldExecutive department
            const defaultDept =
              details.defaultDepartment &&
              fieldExecutiveDepartments.includes(details.defaultDepartment)
                ? details.defaultDepartment
                : fieldExecutiveDepartments[0];
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
