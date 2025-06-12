import React, { useState } from 'react';
import { Button, Checkbox, Input, Popover, Radio, Select, Space, Tag } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { UserFilters } from '@/services/users.services';

interface FilterOption {
  key: string;
  label: string;
  type: 'employeeCode' | 'name' | 'role';
}

const filterOptions: FilterOption[] = [
  { key: 'employeeCode', label: 'Employee Code', type: 'employeeCode' },
  { key: 'name', label: 'Name', type: 'name' },
  { key: 'role', label: 'Role', type: 'role' },
];

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Operations Executive', value: 'OperationsExecutive' },
  { label: 'Field Executive', value: 'FieldExecutive' },
  { label: 'Verifier', value: 'Verifier' },
];

interface FilterOverlayProps {
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
}

const FilterOverlay: React.FC<FilterOverlayProps> = ({ filters, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    Object.keys(filters).filter(key => filters[key as keyof UserFilters] !== undefined)
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSelect = (filterKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters(prev => [...prev, filterKey]);
    } else {
      setSelectedFilters(prev => prev.filter(key => key !== filterKey));
      // Clear the filter values when unchecking
      onFilterChange({
        ...filters,
        [filterKey]: undefined
      });
    }
  };

  const handleFilterValueChange = (key: keyof UserFilters, value: string | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilter = (key: keyof UserFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
    setSelectedFilters(prev => prev.filter(k => k !== key));
  };

  const handleClearAll = () => {
    onFilterChange({});
    setSelectedFilters([]);
    setIsOpen(false);
  };

  const renderFilterInput = (option: FilterOption) => {
    switch (option.type) {
      case 'employeeCode':
        return (
          <Input
            placeholder="Search employee code"
            value={filters.employeeCode}
            onChange={(e) => handleFilterValueChange('employeeCode', e.target.value)}
            style={{ width: 200 }}
          />
        );
      case 'name':
        return (
          <Input
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => handleFilterValueChange('name', e.target.value)}
            style={{ width: 200 }}
          />
        );
      case 'role':
        return (
          <Space direction="vertical">
            {/* {roleOptions.map(role => (
              <Radio
                key={role.value}
                checked={filters.role === role.value}
                onChange={(e) => handleFilterValueChange('role', e.target.checked ? role.value : undefined)}
              >
                {role.label}
              </Radio>
            ))} */}
            <Select style={{minWidth:200}} options={roleOptions} value={filters.role} onSelect={(value:string) => handleFilterValueChange('role', value)} placeholder="Select Role" />
          </Space>
        );
      default:
        return null;
    }
  };

  const content = (
    <div style={{ width: 300 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {filterOptions.map(option => (
          <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Checkbox
              checked={selectedFilters.includes(option.key)}
              onChange={(e) => handleFilterSelect(option.key, e.target.checked)}
            >
              {option.label}
            </Checkbox>
            {selectedFilters.includes(option.key) && <div style={{marginLeft: 20}}>{renderFilterInput(option)}</div>}
          </div>
        ))}
      </Space>
    </div>
  );

  const renderActiveFilters = () => {
    const activeFilters = [];

    if (filters.employeeCode) {
      activeFilters.push(
        <Tag 
          key="employeeCode" 
          closable 
          onClose={() => handleClearFilter('employeeCode')}
        >
          Employee Code: {filters.employeeCode}
        </Tag>
      );
    }

    if (filters.name) {
      activeFilters.push(
        <Tag 
          key="name" 
          closable 
          onClose={() => handleClearFilter('name')}
        >
          Name: {filters.name}
        </Tag>
      );
    }

    if (filters.role) {
      activeFilters.push(
        <Tag 
          key="role" 
          closable 
          onClose={() => handleClearFilter('role')}
        >
          Role: {filters.role}
        </Tag>
      );
    }

    return activeFilters;
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Popover
          content={content}
          title="Select Filters"
          trigger="click"
          open={isOpen}
          onOpenChange={setIsOpen}
          placement="bottomLeft"
        >
          <Button icon={<FilterOutlined />}>Filters</Button>
        </Popover>
        <Space size={[0, 8]} wrap>
          {renderActiveFilters()}
        </Space>
        {Object.keys(selectedFilters).length > 0 && (
          <Button size="small" onClick={handleClearAll}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterOverlay; 