import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Popover,
  Radio,
  Space,
  Tag,
  DatePicker,
  Select,
} from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface FilterOption {
  key: string;
  label: string;
  type: "status" | "applicationNumber" | "assignee" | "dateRange" | "text" | "select" | "businessStatus";
}

const filterOptions: FilterOption[] = [
  { key: "status", label: "Status", type: "status" },
  {
    key: "applicationNumber",
    label: "Application Number",
    type: "applicationNumber",
  },
  { key: "assignee", label: "Assignee", type: "assignee" },
  { key: "dateRange", label: "Date Range", type: "dateRange" },
];

// PD-specific filter options
const pdFilterOptions: FilterOption[] = [
  { key: "status", label: "Status", type: "status" },
  {
    key: "applicationNumber",
    label: "Application Number",
    type: "applicationNumber",
  },
  { key: "applicantName", label: "Applicant Name", type: "text" },
  { key: "applicantMobile", label: "Mobile", type: "text" },
  { key: "bankName", label: "Bank Name", type: "select" },
  { key: "templateName", label: "Template Name", type: "select" },
  { key: "assignee", label: "Assignee", type: "assignee" },
  { key: "businessStatus", label: "Business Status", type: "businessStatus" },
  { key: "dateRange", label: "Date Range", type: "dateRange" },
];

const statusOptions = [
  { label: "Unassigned", value: "Unassigned" },
  { label: "Assigned", value: "Assigned" },
  // { label: 'UnderFV', value: 'UnderFV' },
  { label: "FVCompleted", value: "FVCompleted" },
  { label: "Appointment Postponed", value: "Appointment Postponed" },
  // { label: 'Approved', value: 'Approved' },
  // { label: 'Rejected', value: 'Rejected' },
];

export interface FilterValue {
  status?: string;
  applicationNumber?: string;
  fieldExecutiveEmployeeCode?: string;
  fieldExecutiveName?: string;
  startDate?: string;
  endDate?: string;
  // PD-specific filters
  applicantName?: string;
  applicantMobile?: string;
  bankName?: string;
  templateName?: string;
  businessStatus?: string;
  postponed?: boolean;
}

interface FilterOverlayProps {
  filters: FilterValue;
  onFilterChange: (newFilters: FilterValue) => void;
  currentDepartment?: string;
  pdBankOptions?: Array<{ label: string; value: string }>;
  templateOptions?: Array<{ label: string; value: string }>;
}

const businessStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Postponed", value: "Postponed" },
];

const FilterOverlay: React.FC<FilterOverlayProps> = ({
  filters,
  onFilterChange,
  currentDepartment,
  pdBankOptions = [],
  templateOptions = [],
}) => {
  // Use PD-specific filters if department is PD
  const availableFilterOptions = currentDepartment === "PD" ? pdFilterOptions : filterOptions;
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    Object.keys(filters).filter(
      (key) => {
        const value = filters[key as keyof FilterValue];
        return value !== undefined && value !== "";
      }
    ).map(key => key === "postponed" ? "status" : key)
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSelect = (filterKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters((prev) => [...prev, filterKey]);
    } else {
      setSelectedFilters((prev) => prev.filter((key) => key !== filterKey));
      // Clear the filter values when unchecking
      switch (filterKey) {
        case "status":
          onFilterChange({
            ...filters,
            status: undefined,
            postponed: undefined,
          });
          break;
        case "applicationNumber":
          onFilterChange({
            ...filters,
            applicationNumber: undefined,
          });
          break;
        case "assignee":
          onFilterChange({
            ...filters,
            fieldExecutiveEmployeeCode: undefined,
            fieldExecutiveName: undefined,
          });
          break;
        case "applicantName":
          onFilterChange({
            ...filters,
            applicantName: undefined,
          });
          break;
        case "applicantMobile":
          onFilterChange({
            ...filters,
            applicantMobile: undefined,
          });
          break;
        case "bankName":
          onFilterChange({
            ...filters,
            bankName: undefined,
          });
          break;
        case "templateName":
          onFilterChange({
            ...filters,
            templateName: undefined,
          });
          break;
        case "businessStatus":
          onFilterChange({
            ...filters,
            businessStatus: undefined,
          });
          break;
        case "dateRange":
          const newFilters = { ...filters };
          delete newFilters.startDate;
          delete newFilters.endDate;
          onFilterChange(newFilters);
          break;
      }
    }
  };

  const handleFilterValueChange = (
    key: keyof FilterValue,
    value: string | undefined
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilter = (key: keyof FilterValue) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    // If clearing status, also clear postponed
    if (key === "status") {
      delete newFilters.postponed;
    }
    onFilterChange(newFilters);
    setSelectedFilters((prev) => prev.filter((k) => k !== key));
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
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
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
      case "dateRange":
        return (
          <RangePicker
            value={
              filters.startDate && filters.endDate
                ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                : null
            }
            onChange={handleDateRangeChange}
            style={{ width: "100%" }}
          />
        );
      case "status":
        return (
          <Space direction="vertical">
            <Select
              style={{ minWidth: 200 }}
              options={statusOptions}
              value={filters.status || (filters.postponed ? "Appointment Postponed" : undefined)}
              onChange={(value: string | null) => {
                if (value === "Appointment Postponed") {
                  // When Appointment Postponed is selected, set postponed=true and clear status
                  onFilterChange({
                    ...filters,
                    postponed: true,
                    status: undefined,
                  });
                } else {
                  // When any other status is selected or cleared, clear postponed and set status
                  onFilterChange({
                    ...filters,
                    postponed: undefined,
                    status: value || undefined,
                  });
                }
              }}
              placeholder="Select Status"
              allowClear
            />
          </Space>
        );
      case "applicationNumber":
        return (
          <Input
            placeholder="Search application number"
            value={filters.applicationNumber}
            onChange={(e) =>
              handleFilterValueChange("applicationNumber", e.target.value)
            }
            style={{ width: 200 }}
          />
        );
      case "text":
        if (option.key === "applicantName") {
          return (
            <Input
              placeholder="Search applicant name"
              value={filters.applicantName}
              onChange={(e) =>
                handleFilterValueChange("applicantName", e.target.value)
              }
              style={{ width: 200 }}
            />
          );
        }
        if (option.key === "applicantMobile") {
          return (
            <Input
              placeholder="Search mobile number"
              value={filters.applicantMobile}
              onChange={(e) =>
                handleFilterValueChange("applicantMobile", e.target.value)
              }
              style={{ width: 200 }}
            />
          );
        }
        return null;
      case "select":
        if (option.key === "bankName") {
          return (
            <Select
              style={{ minWidth: 200 }}
              options={pdBankOptions}
              value={filters.bankName}
              onChange={(value: string) =>
                handleFilterValueChange("bankName", value || undefined)
              }
              placeholder="Select Bank Name"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
          );
        }
        if (option.key === "templateName") {
          return (
            <Select
              style={{ minWidth: 200 }}
              options={templateOptions}
              value={filters.templateName}
              onChange={(value: string) =>
                handleFilterValueChange("templateName", value || undefined)
              }
              placeholder="Select Template Name"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
          );
        }
        return null;
      case "businessStatus":
        return (
          <Select
            style={{ minWidth: 200 }}
            options={businessStatusOptions}
            value={filters.businessStatus}
            onChange={(value: string) =>
              handleFilterValueChange("businessStatus", value || undefined)
            }
            placeholder="Select Business Status"
            allowClear
          />
        );
      case "assignee":
        return (
          <Space direction="vertical">
            <Input
              placeholder="Search by Employee Code"
              value={filters.fieldExecutiveEmployeeCode}
              onChange={(e) =>
                handleFilterValueChange(
                  "fieldExecutiveEmployeeCode",
                  e.target.value
                )
              }
              style={{ width: 200 }}
              disabled={!!filters.fieldExecutiveName}
            />
            <Input
              placeholder="Search by Employee Name"
              value={filters.fieldExecutiveName}
              onChange={(e) =>
                handleFilterValueChange("fieldExecutiveName", e.target.value)
              }
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
      <Space direction="vertical" style={{ width: "100%" }}>
        {availableFilterOptions.map((option) => (
          <div
            key={option.key}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <Checkbox
              checked={selectedFilters.includes(option.key)}
              onChange={(e) => handleFilterSelect(option.key, e.target.checked)}
            >
              {option.label}
            </Checkbox>
            {selectedFilters.includes(option.key) && (
              <div style={{ marginLeft: 20 }}>{renderFilterInput(option)}</div>
            )}
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
            setSelectedFilters((prev) => prev.filter((k) => k !== "dateRange"));
          }}
        >
          Date: {dayjs(filters.startDate).format("DD/MM/YYYY")} -{" "}
          {dayjs(filters.endDate).format("DD/MM/YYYY")}
        </Tag>
      );
    }

    if (filters.postponed) {
      activeFilters.push(
        <Tag key="postponed" closable onClose={() => {
          onFilterChange({
            ...filters,
            postponed: undefined,
          });
          setSelectedFilters((prev) => prev.filter((k) => k !== "status"));
        }}>
          Status: Appointment Postponed
        </Tag>
      );
    } else if (filters.status) {
      activeFilters.push(
        <Tag key="status" closable onClose={() => handleClearFilter("status")}>
          Status: {filters.status}
        </Tag>
      );
    }

    if (filters.applicationNumber) {
      activeFilters.push(
        <Tag
          key="applicationNumber"
          closable
          onClose={() => handleClearFilter("applicationNumber")}
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
          onClose={() => handleClearFilter("fieldExecutiveEmployeeCode")}
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
          onClose={() => handleClearFilter("fieldExecutiveName")}
        >
          Employee Name: {filters.fieldExecutiveName}
        </Tag>
      );
    }

    if (filters.applicantName) {
      activeFilters.push(
        <Tag
          key="applicantName"
          closable
          onClose={() => handleClearFilter("applicantName")}
        >
          Applicant Name: {filters.applicantName}
        </Tag>
      );
    }

    if (filters.applicantMobile) {
      activeFilters.push(
        <Tag
          key="applicantMobile"
          closable
          onClose={() => handleClearFilter("applicantMobile")}
        >
          Mobile: {filters.applicantMobile}
        </Tag>
      );
    }

    if (filters.bankName) {
      activeFilters.push(
        <Tag
          key="bankName"
          closable
          onClose={() => handleClearFilter("bankName")}
        >
          Bank: {filters.bankName}
        </Tag>
      );
    }

    if (filters.templateName) {
      activeFilters.push(
        <Tag
          key="templateName"
          closable
          onClose={() => handleClearFilter("templateName")}
        >
          Template: {filters.templateName}
        </Tag>
      );
    }

    if (filters.businessStatus) {
      activeFilters.push(
        <Tag
          key="businessStatus"
          closable
          onClose={() => handleClearFilter("businessStatus")}
        >
          Business Status: {filters.businessStatus}
        </Tag>
      );
    }

    return activeFilters;
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
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
        {/* {Object.keys(selectedFilters).length > 0 && (
          <Button size="small" onClick={handleClearAll}>
            Clear All
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default FilterOverlay;
