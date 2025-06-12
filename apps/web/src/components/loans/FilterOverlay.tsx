import React, { useState } from 'react';
import { Button, Checkbox, Input, Popover, Radio, Space, Tag, DatePicker, Select } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface FilterOption {
  key: string;
  label: string;
  type: 'status' | 'applicationNumber' | 'assignee' | 'dateRange';
}

const filterOptions: FilterOption[] = [
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'applicationNumber', label: 'Application Number', type: 'applicationNumber' },
  { key: 'assignee', label: 'Assignee', type: 'assignee' },
  { key: 'dateRange', label: 'Date Range', type: 'dateRange' },
];

const statusOptions = [
  { label: 'Unassigned', value: 'Unassigned' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'UnderFV', value: 'UnderFV' },
  { label: 'FVCompleted', value: 'FVCompleted' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

export interface FilterValue {
  status?: string;
  applicationNumber?: string;
  fieldExecutiveEmployeeCode?: string;
  fieldExecutiveName?: string;
  startDate?: string;
  endDate?: string;
}

interface FilterOverlayProps {
  filters: FilterValue;
  onFilterChange: (newFilters: FilterValue) => void;
}

const FilterOverlay: React.FC<FilterOverlayProps> = ({ filters, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    Object.keys(filters).filter(key => filters[key as keyof FilterValue] !== undefined)
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSelect = (filterKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters(prev => [...prev, filterKey]);
    } else {
      setSelectedFilters(prev => prev.filter(key => key !== filterKey));
      // Clear the filter values when unchecking
      switch (filterKey) {
        case 'status':
          onFilterChange({
            ...filters,
            status: undefined
          });
          break;
        case 'applicationNumber':
          onFilterChange({
            ...filters,
            applicationNumber: undefined
          });
          break;
        case 'assignee':
          onFilterChange({
            ...filters,
            fieldExecutiveEmployeeCode: undefined,
            fieldExecutiveName: undefined
          });
          break;
      }
    }
  };

  const handleFilterValueChange = (key: keyof FilterValue, value: string | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilter = (key: keyof FilterValue) => {
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

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      onFilterChange({
        ...filters,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      const newFilters = { ...filters };
      delete newFilters.startDate;
      delete newFilters.endDate;
      onFilterChange(newFilters);
    }
  };

  const renderFilterInput = (option: FilterOption) => {
    switch (option.type) {
      case 'dateRange':
        return (
          <RangePicker
            value={filters.startDate && filters.endDate ? [
              dayjs(filters.startDate),
              dayjs(filters.endDate)
            ] : null}
            onChange={handleDateRangeChange}
            style={{ width: '100%' }}
          />
        );
      case 'status':
        return (
          <Space direction="vertical">
            {/* {statusOptions.map(status => (
              <Radio
                key={status.value}
                checked={filters.status === status.value}
                onChange={(e) => handleFilterValueChange('status', e.target.checked ? status.value : undefined)}
              >
                {status.label}
              </Radio>
            ))} */}
            <Select style={{minWidth:200}} options={statusOptions} value={filters.status} onSelect={(value:string) => handleFilterValueChange('status', value)} placeholder="Select Status" />
          </Space>
        );
      case 'applicationNumber':
        return (
          <Input
            placeholder="Search application number"
            value={filters.applicationNumber}
            onChange={(e) => handleFilterValueChange('applicationNumber', e.target.value)}
            style={{ width: 200 }}
          />
        );
      case 'assignee':
        return (
          <Space direction="vertical">
            <Input
              placeholder="Search by Employee Code"
              value={filters.fieldExecutiveEmployeeCode}
              onChange={(e) => handleFilterValueChange('fieldExecutiveEmployeeCode', e.target.value)}
              style={{ width: 200 }}
              disabled={!!filters.fieldExecutiveName}
            />
            <Input
              placeholder="Search by Employee Name"
              value={filters.fieldExecutiveName}
              onChange={(e) => handleFilterValueChange('fieldExecutiveName', e.target.value)}
              style={{ width: 200 }}
              disabled={!!filters.fieldExecutiveEmployeeCode}
            />
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

    if (filters.startDate && filters.endDate) {
      activeFilters.push(
        <Tag
          key="dateRange"
          closable
          onClose={() => {
            const newFilters = { ...filters };
            delete newFilters.startDate;
            delete newFilters.endDate;
            onFilterChange(newFilters);
            setSelectedFilters(prev => prev.filter(k => k !== 'dateRange'));
          }}
        >
          Date: {dayjs(filters.startDate).format('DD/MM/YYYY')} - {dayjs(filters.endDate).format('DD/MM/YYYY')}
        </Tag>
      );
    }

    if (filters.status) {
      activeFilters.push(
        <Tag 
          key="status" 
          closable 
          onClose={() => handleClearFilter('status')}
        >
          Status: {filters.status}
        </Tag>
      );
    }

    if (filters.applicationNumber) {
      activeFilters.push(
        <Tag 
          key="applicationNumber" 
          closable 
          onClose={() => handleClearFilter('applicationNumber')}
        >
          Application: {filters.applicationNumber}
        </Tag>
      );
    }

    if (filters.fieldExecutiveEmployeeCode) {
      activeFilters.push(
        <Tag 
          key="employeeCode" 
          closable 
          onClose={() => handleClearFilter('fieldExecutiveEmployeeCode')}
        >
          Employee Code: {filters.fieldExecutiveEmployeeCode}
        </Tag>
      );
    }

    if (filters.fieldExecutiveName) {
      activeFilters.push(
        <Tag 
          key="employeeName" 
          closable 
          onClose={() => handleClearFilter('fieldExecutiveName')}
        >
          Employee Name: {filters.fieldExecutiveName}
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