import { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Typography, Form, message, Card, DatePicker, Input, Select } from "antd";
import { EditOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import type { ColumnFilterItem } from 'antd/es/table/interface';
import type { Key } from 'react';
import { UserContext } from "@/components/layout/UserContextProvider";
// import type { UploadFile } from "antd/es/upload/interface";
// import * as XLSX from "xlsx";
import {
  getLoansApi,
  updateLoanApi,
  importLoansApi,
  type Loan,
} from "@/services/loans.services";
import { getOfficesApi, Office } from "@/services/settings.services";
import {
  getFieldExecutivesByOfficeIdApi,
  getVerifiersApi,
} from "@/services/users.services";
import { colors } from "@/styles/colors";
import LoanEditDrawer from "@/components/loans/LoanEditDrawer";
import { bankOptions, loanTypeOptions } from "@/utils/options";
import BulkImportDrawer from "@/components/loans/BulkImportDrawer";
import ImportCsvModal from "@/components/loans/ImportCsvModal";

dayjs.extend(relativeTime);

const { RangePicker } = DatePicker;

interface FieldExecutive {
  id: number;
  name: string;
  value: number;
  label: string;
}

export interface Verifiers {
  [key: string]: any;
}

// Add status options
const statusOptions: ColumnFilterItem[] = [
  { text: 'Unassigned', value: 'Unassigned' },
  { text: 'Assigned', value: 'Assigned' },
  // { text: 'UnderFV', value: 'UnderFV' },
  // { text: 'FVCompleted', value: 'FVCompleted' },
  { text: 'Approved', value: 'Approved' },
  { text: 'Rejected', value: 'Rejected' },
];

export default function Loans() {
  const [loading, setLoading] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [isBulkImportDrawerVisible, setIsBulkImportDrawerVisible] =
    useState(false);
  const [bulkImportForm] = Form.useForm();
  const [currentOffice, setCurrentOffice] = useState<string>(
    userDetails?.officeId || ""
  );
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [editLoanInfo, setEditLoanInfo] = useState(false);
  const [verifiers, setVerifiers] = useState<Verifiers[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // Reset form when selected loan changes
  useEffect(() => {
    if (selectedLoan) {
      // Find the matching loan type option
      const matchingLoanType = loanTypeOptions.find(
        (option) =>
          option.value.toLowerCase() === selectedLoan.loanType?.toLowerCase()
      );

      // Find the matching bank option
      const matchingBank = bankOptions.find((option) =>
        option.value
          .toLowerCase()
          .includes(selectedLoan.bankName?.toLowerCase() || "")
      );

      form.setFieldsValue({
        applicationNumber: selectedLoan.applicationNumber,
        applicantName: selectedLoan.applicantName,
        applicantMobile: selectedLoan.applicantMobile,
        loanAmount: selectedLoan.loanAmount,
        applicantAddress: selectedLoan.applicantAddress,
        loanType: matchingLoanType?.value || selectedLoan.loanType,
        bankName: matchingBank?.value || selectedLoan.bankName,
      });
    }
  }, [selectedLoan, form]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const result = await getLoansApi();
      setLoans(result.data.data ?? []);
    } catch (error) {
      message.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    fetchLoans();
  }, [refresh]);

  useEffect(() => {
    getOfficesApi()
      .then((res) => {
        const options =
          res?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) ?? [];
        setOffices(options);
      })
      .catch((err) => {
        // message.error("Failed to fetch offices");
        console.log(err);
      });
    getVerifiersApi()
      .then((res) => {
        const options =
          res?.data?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) ?? [];
        setVerifiers(options);
      })
      .catch((err) => {
        console.log(err);
        // message.error("Failed to fetch verifiers");
      });
  }, []);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const result = await getFieldExecutivesByOfficeIdApi(currentOffice);
        const options =
          result?.data?.data?.map((item: any) => ({
            label: <Typography.Text>{item.name} <Tag color="blue">{item.employeeCode}</Tag></Typography.Text>,
            value: item.id,
          })) ?? [];
        setFieldExecutives(options);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExecutives();
  }, [currentOffice]);

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      await importLoansApi(file);
      message.success("Loans imported successfully");
      setIsImportModalVisible(false);
      setRefresh(!refresh);
    } catch (error) {
      message.error("Failed to import loans");
    } finally {
      setLoading(false);
    }
  };

  const handleLoanInfoSave = async (values: any) => {
    try {
      setLoading(true);
      if (!selectedLoan) return;

      const result = await updateLoanApi(selectedLoan.id, values);
      setLoans(
        loans.map((loan) => (loan.id === selectedLoan.id ? result.data : loan))
      );
      setEditLoanInfo(false);
      message.success("Loan information updated");
    } catch (error) {
      message.error("Failed to update loan information");
    } finally {
      setLoading(false);
    }
  };

  // Add handler for table change
  const handleTableChange = (pagination: any, filters: any) => {
    setFilteredInfo(filters);
  };

  // Get unique assignees for filter options
  const getUniqueAssignees = (loans: Loan[], verificationType: string): ColumnFilterItem[] => {
    const uniqueAssignees = new Set<string>();
    loans.forEach(loan => {
      const verification = loan?.verifications?.find((v: any) => v.type === verificationType);
      if (verification?.fieldExecutive?.employeeCode) {
        uniqueAssignees.add(verification.fieldExecutive.employeeCode);
      }
    });
    return Array.from(uniqueAssignees).map(code => ({
      text: code,
      value: code,
    }));
  };

  const columns: ColumnsType<Loan> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 200,
      filteredValue: filteredInfo.applicationNumber || null,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search application number"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value: boolean | Key, record) =>
        record.applicationNumber
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
      width: 150,
    },
    {
      title: "Mobile",
      dataIndex: "applicantMobile",
      key: "applicantMobile",
      width: 100,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusOptions,
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const color =
          status === "Pending"
            ? "orange"
            : status === "Approved"
              ? "green"
              : status === "Rejected"
                ? "red"
                : "blue";
        return <Tag color={color}>{status}</Tag>;
      },
      width: 100,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
              const startTime = dates?.[0]?.valueOf();
              const endTime = dates?.[1]?.valueOf();
              setSelectedKeys(startTime && endTime ? [startTime, endTime] : []);
            }}
            style={{ marginBottom: 8 }}
          />
          <div>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => {
                clearFilters?.();
                setDateRange([null, null]);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      onFilter: (value: boolean | Key, record) => {
        if (!dateRange[0] || !dateRange[1]) return true;
        const createdAt = dayjs(record.createdAt);
        return createdAt.isAfter(dateRange[0]) && createdAt.isBefore(dateRange[1]);
      },
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
      width: 120,
    },

    {
      title: <Typography.Text>Address 1</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "pavAssignee",
          filters: getUniqueAssignees(loans, "AddressOne"),
          filteredValue: filteredInfo.pavAssignee || null,
          onFilter: (value: boolean | Key, record: Loan) => {
            const pav = record?.verifications?.find((v: any) => v.type === "AddressOne");
            return pav?.fieldExecutive?.employeeCode === value.toString();
          },
          render: (_, record: Loan) => {
            const pav = record?.verifications?.find(
              (v: any) => v.type === "AddressOne"
            );
            return pav ? pav?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "pavStatus",
          render: (_, record: Loan) => {
            const pav = record?.verifications?.find(
              (v: any) => v.type === "AddressOne"
            );
            return pav ? (
              <Tag color={pav.status === "Completed" ? "green" : "orange"}>
                {pav.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
        },
      ],
    },
    {
      title: <Typography.Text>Address 2</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "cavAssignee",
          filters: getUniqueAssignees(loans, "AddressTwo"),
          filteredValue: filteredInfo.cavAssignee || null,
          onFilter: (value: boolean | Key, record: Loan) => {
            const cav = record?.verifications?.find((v: any) => v.type === "AddressTwo");
            return cav?.fieldExecutive?.employeeCode === value.toString();
          },
          render: (_, record: Loan) => {
            const cav = record?.verifications?.find(
              (v: any) => v.type === "AddressTwo"
            );
            return cav ? cav?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "cavStatus",
          render: (_, record: Loan) => {
            const cav = record?.verifications?.find(
              (v: any) => v.type === "AddressTwo"
            );
            return cav ? (
              <Tag color={cav.status === "Completed" ? "green" : "orange"}>
                {cav.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
        },
      ],
    },
    {
      title: <Typography.Text>Work</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "wvAssignee",
          filters: getUniqueAssignees(loans, "Work"),
          filteredValue: filteredInfo.wvAssignee || null,
          onFilter: (value: boolean | Key, record: Loan) => {
            const wv = record?.verifications?.find((v: any) => v.type === "Work");
            return wv?.fieldExecutive?.employeeCode === value.toString();
          },
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Work"
            );
            return wv ? wv?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "wvStatus",
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Work"
            );
            return wv ? (
              <Tag color={wv.status === "Completed" ? "green" : "orange"}>
                {wv.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
        },
      ],
    },
    {
      title: <Typography.Text>Business</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "businessAssignee",
          filters: getUniqueAssignees(loans, "Business"),
          filteredValue: filteredInfo.businessAssignee || null,
          onFilter: (value: boolean | Key, record: Loan) => {
            const business = record?.verifications?.find((v: any) => v.type === "Business");
            return business?.fieldExecutive?.employeeCode === value.toString();
          },
          render: (_, record: Loan) => {
            const business = record?.verifications?.find(
              (v: any) => v.type === "Business"
            );
            return business ? business?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "wvStatus",
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Business"
            );
            return wv ? (
              <Tag color={wv.status === "Completed" ? "green" : "orange"}>
                {wv.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
        },
      ],
    },

    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedLoan(record);
            setIsDrawerVisible(true);
          }}
        >
          Edit
        </Button>
      ),
      width: 100,
    },
  ];
  return (
    <DashboardLayout>
      <Card>
        <div
          className="flex-end"
          style={{ marginBottom: 16, display: "flex", gap: "8px" }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: 16 }} />}
            onClick={() => {
              setSelectedLoan({} as Loan);
              setIsDrawerVisible(true);
            }}
          >
            New Loan
          </Button>
          <Button
            style={{
              color: colors.secondary.main,
              borderColor: colors.secondary.main,
            }}
            onClick={() => setIsBulkImportDrawerVisible(true)}
          >
            Bulk Add
          </Button>
          <Button
            type="link"
            icon={<UploadOutlined style={{ fontSize: 16 }} />}
            onClick={() => setIsImportModalVisible(true)}
          >
            CSV/Excel Import
          </Button>
        </div>

        <Table
          className="loans-table"
          columns={columns}
          dataSource={loans}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            position: ["bottomCenter"],
          }}
          size="small"
          scroll={{ x: 1500 }}
          sticky
        />
      </Card>

      <ImportCsvModal
        isImportModalVisible={isImportModalVisible}
        setIsImportModalVisible={setIsImportModalVisible}
        handleImport={handleImport}
      />

      <LoanEditDrawer
        selectedLoan={selectedLoan}
        setSelectedLoan={setSelectedLoan}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        editLoanInfo={editLoanInfo}
        setEditLoanInfo={setEditLoanInfo}
        form={form}
        loading={loading}
        setLoading={setLoading}
        setLoans={setLoans}
        loans={loans}
        fieldExecutives={fieldExecutives}
        setCurrentOffice={setCurrentOffice}
        offices={offices}
        verifiers={verifiers}
        fetchLoans={fetchLoans}
        setRefresh={setRefresh}
      />

      <BulkImportDrawer
        isBulkImportDrawerVisible={isBulkImportDrawerVisible}
        setIsBulkImportDrawerVisible={setIsBulkImportDrawerVisible}
        bulkImportForm={bulkImportForm}
        loading={loading}
        setLoading={setLoading}
        setRefresh={setRefresh}
        verifiers={verifiers}
      />

      <style jsx global>{`
      .ant-form-item {
        margin-bottom: 12px !important;
      }
    `}</style>
    </DashboardLayout>
  );
}