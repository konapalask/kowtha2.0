export interface WorkVerificationData {
    basicDetails?: {
      aadhar: string;
      tenure: string;
      bankName: string;
      panNumber: string;
      loanAmount: string;
      applicantName: string;
      purposeOfLoan: string;
      qualification: string;
      prospectNumber: string;
      };
      existingLoans?: {
        loans: Array<{
          emi: string;
          tenure: string;
          purpose: string;
          bankName: string;
          loanAmount: string;
        }>;
      };
      pastEmployment?: {
        employments: Array<{
          toDate: string;
          fromDate: string;
          designation: string;
          employerName: string;
          contactPersonName: string;
          reasonForMovement: string;
          contactPersonNumber: string;
        }>;
      };
      employmentDetails?: {
        netSalary: string;
        salaryMode: string;
        companySize: string;
        designation: string;
        grossSalary: string;
        employerType: string;
        isOfficeNameSame: string;
        officeNameCorrection: string;
        idCardNumber: string;
        isAddressSame: string;
        officeAddress: string;
        officeLocality: string;
        natureOfService: string;
        addressCorrection: string;
        currentOfficeName: string;
        employerTypeOther: string;
        yearsInCurrentJob: string;
        totalWorkExperience: string;
        natureOfServiceOther: string;
      };
      colleagueReferences?: {
        references: Array<{
          name: string;
          address: string;
          yearsKnown: string;
          designation: string;
          emailAddress: string;
          contactNumber: string;
        }>;
      };
      uploadedItems?: Array<{
        id: string;
        uri: string;
        type: string;
        pincode: string;
        isCamera: string;
        latitude: string;
        locality: string;
        longitude: string;
        timestamp: string;
        s3ImageUrl: string;
        isOverlayNeeded: string;
      }>;
}