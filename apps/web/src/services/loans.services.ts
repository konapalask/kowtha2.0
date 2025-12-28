import axiosInstance from "../config/axios.config";
import {
  getWithDepartment,
  postWithDepartment,
  patchWithDepartment,
  deleteWithDepartment,
} from "./api.services";

export interface Verification {
  id: number;
  type: "Permanent Address" | "Current Address" | "Work";
  assignmentMethod: "Local" | "Remote";
  office?: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Completed";
}

export interface Loan {
  id: number;
  applicationNumber: string;
  applicantName: string;
  applicantMobile: string;
  loanAmount: string;
  loanType: string;
  bankName: string;
  applicantType: string;
  templateName?: string;
  status: string;
  verifierId?: string;
  verifications?: any[];
  [key: string]: any;
}

export interface VerifierLoan {
  data: {
    data: {
      id: number;
      applicationNumber: string;
      applicantName: string;
      status: string;
      uploadedAt: string;
      updatedAt: string;
      documents: string[];
    };
  };
}

// export interface GetLoansResponse {
//   data: Loan[];
//   total: number;
// }

interface LoanFilters {
  status?: string;
  applicationNumber?: string;
  fieldExecutiveEmployeeCode?: string;
  fieldExecutiveName?: string;
  postponed?: boolean | string;
  applicantName?: string;
  applicantMobile?: string;
  bankName?: string;
  startDate?: string;
  endDate?: string;
}

export const getLoansApi = (
  page?: number,
  limit?: number,
  filters?: LoanFilters
) => {
  return getWithDepartment("/loans", {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const getLoansByIdApi = (id: string) => {
  return getWithDepartment(`/loans`, {
    params: { id },
  });
};

export const updateLoanApi = (loanId: number, payload: Partial<Loan>) => {
  return patchWithDepartment(`/loans/${loanId}`, payload);
};

export const assignVerificationApi = (
  loanId: number,
  verificationType: string,
  payload: {
    assignmentMethod: "Local" | "Remote";
    office?: string;
    assignee: string;
  }
) => {
  return postWithDepartment(
    `/loans/${loanId}/verifications/${verificationType}/assign`,
    payload
  );
};

export const importLoansApi = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return postWithDepartment("/loans/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getVerifierLoansApi = (
  page: number = 1,
  limit: number = 10,
  filters?: {
    applicationNumber?: string;
    applicantName?: string;
  }
) => {
  const params: any = { page, limit };

  if (filters?.applicationNumber && filters.applicationNumber.trim() !== "") {
    params.applicationNumber = filters.applicationNumber.trim();
  }
  if (filters?.applicantName && filters.applicantName.trim() !== "") {
    params.applicantName = filters.applicantName.trim();
  }
  
  return getWithDepartment(`/loans/get-verifier-loans`, {
    params,
  });
};

export const assignExecutivesApi = (loanId: number, payload: any) => {
  return postWithDepartment(`/loans/${loanId}/assign-loan-executive`, payload);
};

export const updateExecutivesApi = (loanId: number, payload: any) => {
  return patchWithDepartment(`/loans/${loanId}/update-executive`, payload);
};

export const getExecutivesApi = () => {
  return getWithDepartment(`/accounts/users`, {
    params: { role: "FieldExecutive" },
  });
};

export const getFieldExecutivesApi = () => {
  return getWithDepartment(`/loans/field-executive`);
};

export const createLoanApi = (payload: any) => {
  return postWithDepartment(`/loans`, payload);
};

export const deleteFieldAssignmentApi = (
  loanId: number,
  type: string,
  payload: any
) => {
  return deleteWithDepartment(`/loans/${loanId}/verification/${type}`, {
    data: payload,
  });
};

export const deleteLoanApi = (id: number) => {
  return deleteWithDepartment(`/loans/${id}`);
};

export const reassignLoanApi = (loanId: number) => {
  return postWithDepartment(`/loans/${loanId}/reassign`);
};

export const sendPdEmailReplyApi = (loanId: number, department: string) => {
  return postWithDepartment(`/loans/${loanId}/pd-email-reply`, {}, {
    params: { department },
  });
};
