export interface WebFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'textarea' | 'array' | 'boolean';
  required?: boolean;
  options?: string[]; // for select fields
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  readOnly?: boolean;
  placeholder?: string;
  arrayItemFields?: WebFieldDefinition[]; 
}

export interface WebArrayItemDefinition {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'textarea';
  required?: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface WebSectionDefinition {
  id: string;
  label: string;
  fields: WebFieldDefinition[];
  required?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface WebFormDefinition {
  id: string;
  name: string;
  sections: WebSectionDefinition[];
  version?: string;
}

export interface WebFormData {
  [sectionId: string]: {
    [fieldId: string]: any;
  };
}

export interface WebFormSubmissionData {
  verificationType: string;
  findings: string;
  addressType: string;
  verificationData: WebFormData;
}
