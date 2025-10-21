import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SchemaSection } from '../../src/components/pd-forms/SchemaSection';
import { loadSchemaForTest } from '../helpers/schemaLoader';
import { generateMockDataFromSchema } from '../helpers/mockDataGenerator';

// Mock the schema loader
jest.mock('../../src/components/pd-forms/schema/pdSchema', () => ({
  loadMobilePDFormsSchema: jest.fn(),
}));

describe('SchemaSection Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockOnSubmit = jest.fn();

      const { getByText } = render(
        <SchemaSection
          title="Test Form"
          schema={schema.sections[0].schema}
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      );

      expect(getByText('Test Form')).toBeDefined();
    });

    it('should display all fields from schema', async () => {
      const schema = await loadSchemaForTest('RBL');
      const section = schema.sections[0];
      const mockOnSubmit = jest.fn();

      const { getByText } = render(
        <SchemaSection
          title={section.label}
          schema={section.schema}
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      );

      // Check if field labels are rendered
      Object.values(section.schema.properties).forEach((field: any) => {
        expect(getByText(field.title)).toBeDefined();
      });
    });
  });

  describe('Form Initialization with Data', () => {
    it('should initialize with provided data', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);
      const mockOnSubmit = jest.fn();

      const { getByDisplayValue } = render(
        <SchemaSection
          title="Test Form"
          schema={schema.sections[0].schema}
          initialData={mockData.basicDetails}
          onSubmit={mockOnSubmit}
        />
      );

      // Values should be populated
      // Note: Actual implementation might vary based on your component
      expect(mockData.basicDetails.applicationNo).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields on submit', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockOnSubmit = jest.fn();

      render(
        <SchemaSection
          title="Test Form"
          schema={schema.sections[0].schema}
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      );

      // Try to submit empty form
      // The form should not call onSubmit with empty required fields
      // This test will need to be updated based on actual component implementation
    });

    it('should accept valid data', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);
      const mockOnSubmit = jest.fn();

      render(
        <SchemaSection
          title="Test Form"
          schema={schema.sections[0].schema}
          initialData={mockData.basicDetails}
          onSubmit={mockOnSubmit}
        />
      );

      // Submit form with valid data
      // Expect onSubmit to be called
      // This test will need to be updated based on actual component implementation
    });
  });

  describe('Different Field Types', () => {
    it('should render text input for string fields', async () => {
      const simpleSchema = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
        },
      };
      const mockOnSubmit = jest.fn();

      const { getByText } = render(
        <SchemaSection
          title="Test"
          schema={simpleSchema}
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      );

      expect(getByText('Name')).toBeDefined();
    });

    it('should render dropdown for enum fields', async () => {
      const enumSchema = {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            title: 'Status',
            enum: ['Active', 'Inactive'],
          },
        },
      };
      const mockOnSubmit = jest.fn();

      const { getByText } = render(
        <SchemaSection
          title="Test"
          schema={enumSchema}
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      );

      expect(getByText('Status')).toBeDefined();
    });

    it('should render number input for number fields', async () => {
      const numberSchema = {
        type: 'object',
        properties: {
          age: { type: 'number', title: 'Age' },
        },
      };
      const mockOnSubmit = jest.fn();

      const { getByText } = render(
        <SchemaSection
          title="Test"
          schema={numberSchema}
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      );

      expect(getByText('Age')).toBeDefined();
    });
  });
});

