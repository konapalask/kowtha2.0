import axiosInstance from "../config/axios.config";

export interface Verification {
  id: number;
  type: "Permanent Address" | "Current Address" | "Work";
  assignmentMethod: "Local" | "Remote";
  office?: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Completed";
}

export interface Loan {
  [key: string]: any;
  // id: number;
  // applicationNumber: string;
  // applicantName: string;
  // applicantPhone: string;
  // applicantAddress: string;
  // loanType: string;
  // bankName: string;
  // status: string;
  // assignee: string;
  // uploadedAt: string;
  // updatedAt: string;
  // verifications: Verification[];
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
  employeeCode?: string;
  employeeName?: string;
}

export const getLoansApi = (
  page?: number,
  limit?: number,
  filters?: LoanFilters
) => {
  return axiosInstance.get<any>("/loans", {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const getLoansByIdApi = (id: string) => {
  return axiosInstance.get<Loan>(`/loans?id=${id}`);
};

export const updateLoanApi = (loanId: number, payload: Partial<Loan>) => {
  return axiosInstance.patch<Loan>(`/loans/${loanId}`, payload);
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
  return axiosInstance.post<Verification>(
    `/loans/${loanId}/verifications/${verificationType}/assign`,
    payload
  );
};

export const importLoansApi = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post<{ message: string }>("/loans/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getVerifierLoansApi = () => {
  return axiosInstance.get<VerifierLoan[]>(`/loans/get-verifier-loans`);
};

export const assignExecutivesApi = (loanId: number, payload: any) => {
  return axiosInstance.post<Verification>(
    `/loans/${loanId}/assign-loan-executive`,
    payload
  );
};

export const getExecutivesApi = () => {
  return axiosInstance.get<any>(`/accounts/users?role=FieldExecutive`);
};

export const getFieldExecutivesApi = () => {
  return axiosInstance.get<any[]>(`/loans/field-executive`);
};

export const createLoanApi = (payload: any) => {
  return axiosInstance.post<any>(`/loans`, payload);
};

export const deleteFieldAssignmentApi = (
  loanId: number,
  type: string,
  payload: any
) => {
  return axiosInstance.delete<any>(`/loans/${loanId}/verification/${type}`, {
    data: payload,
  });
};
