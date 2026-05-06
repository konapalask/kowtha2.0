/**
 * Utility to check loan completion status and disable bank name fields
 * This approach dynamically checks if a loan is completed
 */

// Check if loan is completed based on various status indicators
export const isLoanCompleted = (verificationData: any): boolean => {
  if (!verificationData) return false;
  
  // Check main loan status
  if (verificationData.status) {
    const completedStatuses = [
      "FieldVerificationComplete",
      "FVCompleted",
      "BackendCompleted",
      "Completed"
    ];
    if (completedStatuses.includes(verificationData.status)) {
      return true;
    }
  }
  
  // Check verification statuses
  if (verificationData.verifications && Array.isArray(verificationData.verifications)) {
    // Check if all verifications are completed
    const allCompleted = verificationData.verifications.every((v: any) => 
      v.status === "Completed"
    );
    if (allCompleted) {
      return true;
    }
    
    // Check if any verification has approvedStatus (Positive/Negative)
    const hasApprovedStatus = verificationData.verifications.some((v: any) => 
      v.approvedStatus === "Positive" || v.approvedStatus === "Negative"
    );
    if (hasApprovedStatus) {
      return true;
    }
  }
  
  // Check individual verification data
  if (verificationData.verificationData) {
    // Check if verification has approvedStatus
    if (verificationData.verificationData.approvedStatus) {
      return verificationData.verificationData.approvedStatus === "Positive" || 
             verificationData.verificationData.approvedStatus === "Negative";
    }
  }
  
  return false;
};

// Check if mobile verification is completed for a specific loan
export const isMobileVerificationCompleted = (loanData: any): boolean => {
  if (!loanData) return false;
  
  // Check if loan has verifications array
  if (loanData.verifications && Array.isArray(loanData.verifications)) {
    // Check if any verification is completed
    const hasCompletedVerification = loanData.verifications.some((v: any) => 
      v.status === "Completed"
    );
    
    if (hasCompletedVerification) {
      return true;
    }
    
    // Check if any verification has approvedStatus (Positive/Negative)
    const hasApprovedStatus = loanData.verifications.some((v: any) => 
      v.approvedStatus === "Positive" || v.approvedStatus === "Negative"
    );
    
    if (hasApprovedStatus) {
      return true;
    }
  }
  
  // Check loan status directly
  if (loanData.status) {
    const completedStatuses = [
      "FVCompleted",
      "BackendCompleted",
      "Completed"
    ];
    if (completedStatuses.includes(loanData.status)) {
      return true;
    }
  }
  
  return false;
};

// Get current verification data from various sources
export const getCurrentVerificationData = (): any => {
  // Try to get from window object if available (set by parent components)
  if (typeof window !== 'undefined' && (window as any).currentVerificationData) {
    return (window as any).currentVerificationData;
  }
  
  // Try to get from localStorage as fallback
  try {
    const stored = localStorage.getItem('currentVerificationData');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Set current verification data (called by parent components)
export const setCurrentVerificationData = (data: any): void => {
  if (typeof window !== 'undefined') {
    (window as any).currentVerificationData = data;
  }
  
  // Also store in localStorage as backup
  try {
    localStorage.setItem('currentVerificationData', JSON.stringify(data));
  } catch {
    // Ignore localStorage errors
  }
};

// Dynamic field disabler hook
export const useLoanCompletionChecker = () => {
  const verificationData = getCurrentVerificationData();
  const completed = isLoanCompleted(verificationData);
  
  return {
    isLoanCompleted: completed,
    disableBankNameFields: completed,
  };
};

// Utility to disable bank name fields dynamically based on loan completion
export const shouldDisableBankNameField = (): boolean => {
  const verificationData = getCurrentVerificationData();
  return isLoanCompleted(verificationData);
};
