// Example demonstrating how to handle nested object fields like proposedLoanDetails
// This shows the structure and usage of the new object type support

import { WebFormDefinition, WebFieldDefinition } from '@/types/webSchema';

// Example schema for proposedLoanDetails with nested repaymentFrom object
export const proposedLoanDetailsSchema: WebFormDefinition = {
  id: 'proposedLoanDetails',
  name: 'Proposed Loan Details',
  sections: [
    {
      id: 'proposedLoanDetails',
      label: 'Proposed Loan Details',
      fields: [
        {
          id: 'amount',
          label: 'Loan Amount',
          type: 'number',
          required: true,
          placeholder: 'Enter loan amount',
        },
        {
          id: 'tenure',
          label: 'Tenure (months)',
          type: 'number',
          required: true,
          placeholder: 'Enter tenure in months',
        },
        {
          id: 'product',
          label: 'Product Type',
          type: 'select',
          required: true,
          options: ['G', 'H', 'I'], // Example options
          placeholder: 'Select product type',
        },
        {
          id: 'repaymentFrom',
          label: 'Repayment From',
          type: 'object',
          required: true,
          objectFields: [
            {
              id: 'bankName',
              label: 'Bank Name',
              type: 'text',
              required: true,
              placeholder: 'Enter bank name',
            },
            {
              id: 'accountNo',
              label: 'Account Number',
              type: 'text',
              required: true,
              placeholder: 'Enter account number',
            },
            {
              id: 'typeSAAccount',
              label: 'Account Type',
              type: 'select',
              required: true,
              options: ['Savings', 'Current', 'Fixed Deposit'],
              placeholder: 'Select account type',
            },
          ],
        },
      ],
      required: true,
      collapsible: true,
      defaultExpanded: true,
    },
  ],
  version: '1.0',
};

// Example data structure that matches the schema
export const exampleProposedLoanData = {
  proposedLoanDetails: {
    amount: 500000,
    tenure: 6,
    product: 'G',
    repaymentFrom: {
      bankName: 'Tata Ubl',
      accountNo: '1234567890',
      typeSAAccount: 'Savings',
    },
  },
};

// Example of how the form data would be structured for submission
export const exampleFormSubmissionData = {
  verificationType: 'Business',
  findings: 'All details verified',
  addressType: 'Business',
  verificationData: {
    proposedLoanDetails: {
      amount: 500000,
      tenure: 6,
      product: 'G',
      repaymentFrom: {
        bankName: 'Tata Ubl',
        accountNo: '1234567890',
        typeSAAccount: 'Savings',
      },
    },
    // ... other sections
  },
};

// Helper function to validate nested object fields
export function validateNestedObjectField(
  field: WebFieldDefinition,
  data: any,
  sectionId: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (field.type === 'object' && field.objectFields) {
    const objectData = data[sectionId]?.[field.id];
    
    if (field.required && (!objectData || typeof objectData !== 'object')) {
      errors.push(`${field.label} is required`);
      return { isValid: false, errors };
    }
    
    if (objectData) {
      field.objectFields.forEach((objectField) => {
        const value = objectData[objectField.id];
        
        if (objectField.required) {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors.push(`${objectField.label} is required`);
          }
        }
        
        // Additional validation based on field type
        if (objectField.validation && value) {
          if (objectField.validation.pattern && !new RegExp(objectField.validation.pattern).test(value)) {
            errors.push(`${objectField.label} format is invalid`);
          }
          if (objectField.validation.min && Number(value) < objectField.validation.min) {
            errors.push(`${objectField.label} must be at least ${objectField.validation.min}`);
          }
          if (objectField.validation.max && Number(value) > objectField.validation.max) {
            errors.push(`${objectField.label} must be at most ${objectField.validation.max}`);
          }
        }
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Example usage in a React component
export const ExampleUsage = `
// In your React component:
import { EnhancedDynamicFormRenderer } from '@/components/forms/EnhancedDynamicFormRenderer';
import { proposedLoanDetailsSchema, exampleProposedLoanData } from './nestedObjectExample';

const MyComponent = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    // Data structure will be:
    // {
    //   proposedLoanDetails: {
    //     amount: 500000,
    //     tenure: 6,
    //     product: 'G',
    //     repaymentFrom: {
    //       bankName: 'Tata Ubl',
    //       accountNo: '1234567890',
    //       typeSAAccount: 'Savings',
    //     },
    //   },
    // }
  };

  const handleDataChange = (sectionId: string, data: any) => {
    console.log('Data changed in section:', sectionId, data);
  };

  return (
    <EnhancedDynamicFormRenderer
      schema={proposedLoanDetailsSchema}
      initialData={exampleProposedLoanData}
      onSubmit={handleSubmit}
      onDataChange={handleDataChange}
      readOnly={false}
      showValidation={true}
      autoSave={true}
    />
  );
};
`;

// Example of how to handle the data in your API
export const apiHandlingExample = `
// In your API handler:
export const handleProposedLoanDetailsUpdate = async (data: any) => {
  const { proposedLoanDetails } = data;
  
  // Access nested object fields
  const loanAmount = proposedLoanDetails.amount;
  const tenure = proposedLoanDetails.tenure;
  const product = proposedLoanDetails.product;
  
  // Access nested repaymentFrom object
  const bankName = proposedLoanDetails.repaymentFrom.bankName;
  const accountNo = proposedLoanDetails.repaymentFrom.accountNo;
  const accountType = proposedLoanDetails.repaymentFrom.typeSAAccount;
  
  // Update database
  await updateVerificationData({
    proposedLoanDetails: {
      amount: loanAmount,
      tenure: tenure,
      product: product,
      repaymentFrom: {
        bankName: bankName,
        accountNo: accountNo,
        typeSAAccount: accountType,
      },
    },
  });
};
`;
