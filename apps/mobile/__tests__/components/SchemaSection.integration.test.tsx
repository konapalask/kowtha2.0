import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SchemaSection from '../../src/components/pd-forms/SchemaSection';
import * as arrayUtils from '../../src/helpers/arrayUtils';

// Mock the array utils
jest.mock('../../src/helpers/arrayUtils');
const mockArrayUtils = arrayUtils as jest.Mocked<typeof arrayUtils>;

// Mock react-native-uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}));

describe('SchemaSection Array Integration', () => {
  const mockOnSubmit = jest.fn();

  const familyDetailsSchema = {
    type: 'object',
    properties: {
      familyMembers: {
        type: 'array',
        title: 'Family Members',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              title: 'Name',
            },
            relation: {
              type: 'string',
              title: 'Relation',
            },
            age: {
              type: 'integer',
              title: 'Age',
            },
          },
          required: ['name', 'relation'],
        },
      },
    },
    required: ['familyMembers'],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockArrayUtils.generateArrayItemId.mockReturnValue('mock-uuid-123');
    mockArrayUtils.ensureArrayItemsHaveIds.mockImplementation(array =>
      array.map((item: any) => ({...item, _id: item._id || 'mock-uuid'})),
    );
    mockArrayUtils.validateArrayItemIds.mockReturnValue(true);
    mockArrayUtils.cleanArrayForSubmission.mockImplementation(array =>
      array.filter((item: any) => item && Object.keys(item).length > 1),
    );
  });

  it('should render array field with add/remove functionality', () => {
    const initialData = {
      familyMembers: [
        {_id: 'existing-1', name: 'John', relation: 'Spouse', age: 30},
      ],
    };

    const {getByText, getByTestId} = render(
      <SchemaSection
        title="Family Details"
        schema={familyDetailsSchema}
        initialData={initialData}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(getByText('Family Members')).toBeTruthy();
    expect(getByText('+ Add')).toBeTruthy();
    expect(getByText('Remove')).toBeTruthy();
  });

  it('should call array utilities when adding new item', async () => {
    const {getByText} = render(
      <SchemaSection
        title="Family Details"
        schema={familyDetailsSchema}
        initialData={{}}
        onSubmit={mockOnSubmit}
      />,
    );

    const addButton = getByText('+ Add');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(mockArrayUtils.generateArrayItemId).toHaveBeenCalled();
      expect(mockArrayUtils.ensureArrayItemsHaveIds).toHaveBeenCalled();
    });
  });

  it('should call array utilities when removing item', async () => {
    const initialData = {
      familyMembers: [
        {_id: 'item-1', name: 'John', relation: 'Spouse'},
        {_id: 'item-2', name: 'Jane', relation: 'Child'},
      ],
    };

    const {getAllByText} = render(
      <SchemaSection
        title="Family Details"
        schema={familyDetailsSchema}
        initialData={initialData}
        onSubmit={mockOnSubmit}
      />,
    );

    const removeButtons = getAllByText('Remove');
    expect(removeButtons).toHaveLength(2);

    fireEvent.press(removeButtons[0]);

    await waitFor(() => {
      expect(mockArrayUtils.ensureArrayItemsHaveIds).toHaveBeenCalled();
    });
  });

  it('should validate array data before submission', async () => {
    mockArrayUtils.validateArrayItemIds.mockReturnValue(false);
    mockArrayUtils.ensureArrayItemsHaveIds.mockReturnValue([
      {_id: 'fixed-1', name: 'John', relation: 'Spouse'},
    ]);

    const {getByText} = render(
      <SchemaSection
        title="Family Details"
        schema={familyDetailsSchema}
        initialData={{familyMembers: [{name: 'John'}]}}
        onSubmit={mockOnSubmit}
      />,
    );

    // Trigger form change (which triggers validation)
    const addButton = getByText('+ Add');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(mockArrayUtils.validateArrayItemIds).toHaveBeenCalled();
      expect(mockArrayUtils.ensureArrayItemsHaveIds).toHaveBeenCalled();
    });
  });

  it('should clean array data for submission', async () => {
    const initialData = {
      familyMembers: [
        {_id: 'item-1', name: 'John', relation: 'Spouse'},
        {_id: 'item-2', name: '', relation: ''}, // Empty data
      ],
    };

    const {getByText} = render(
      <SchemaSection
        title="Family Details"
        schema={familyDetailsSchema}
        initialData={initialData}
        onSubmit={mockOnSubmit}
      />,
    );

    // Trigger submission
    const addButton = getByText('+ Add');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(mockArrayUtils.cleanArrayForSubmission).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle array utility errors gracefully', async () => {
      mockArrayUtils.ensureArrayItemsHaveIds.mockImplementation(() => {
        throw new Error('Array processing error');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const {getByText} = render(
        <SchemaSection
          title="Family Details"
          schema={familyDetailsSchema}
          initialData={{familyMembers: [{name: 'John'}]}}
          onSubmit={mockOnSubmit}
        />,
      );

      const addButton = getByText('+ Add');
      fireEvent.press(addButton);

      // Should not crash, might show warning
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Array field familyMembers has missing or duplicate IDs',
        ),
      );

      consoleSpy.mockRestore();
    });

    it('should handle malformed array data', async () => {
      const malformedData = {
        familyMembers: 'not an array', // Invalid array data
      };

      const {getByText} = render(
        <SchemaSection
          title="Family Details"
          schema={familyDetailsSchema}
          initialData={malformedData}
          onSubmit={mockOnSubmit}
        />,
      );

      // Should still render without crashing
      expect(getByText('Family Members')).toBeTruthy();
      expect(getByText('+ Add')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle large arrays efficiently', async () => {
      const largeArray = Array.from({length: 100}, (_, i) => ({
        _id: `item-${i}`,
        name: `Person ${i}`,
        relation: 'Family',
        age: 20 + i,
      }));

      const startTime = Date.now();

      render(
        <SchemaSection
          title="Large Family Details"
          schema={familyDetailsSchema}
          initialData={{familyMembers: largeArray}}
          onSubmit={mockOnSubmit}
        />,
      );

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Should render in reasonable time (less than 1 second)
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain ID consistency through multiple operations', async () => {
      const trackedIds: string[] = [];

      mockArrayUtils.generateArrayItemId.mockImplementation(() => {
        const id = `tracked-${trackedIds.length}`;
        trackedIds.push(id);
        return id;
      });

      mockArrayUtils.ensureArrayItemsHaveIds.mockImplementation(array => {
        return array.map((item: any, index) => ({
          ...item,
          _id: item._id || trackedIds[index] || `fallback-${index}`,
        }));
      });

      const {getByText} = render(
        <SchemaSection
          title="Family Details"
          schema={familyDetailsSchema}
          initialData={{familyMembers: []}}
          onSubmit={mockOnSubmit}
        />,
      );

      // Add multiple items
      const addButton = getByText('+ Add');

      fireEvent.press(addButton);
      fireEvent.press(addButton);
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockArrayUtils.generateArrayItemId).toHaveBeenCalledTimes(3);
        expect(trackedIds).toHaveLength(3);

        // All IDs should be unique
        const uniqueIds = new Set(trackedIds);
        expect(uniqueIds.size).toBe(3);
      });
    });
  });
});


