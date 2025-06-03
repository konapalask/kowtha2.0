import { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Typography, Form, message, Card } from "antd";
import { EditOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
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
interface FieldExecutive {
  id: number;
  name: string;
  value: number;
  label: string;
}

export interface Verifiers {
  [key: string]: any;
}

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
            label: item.name,
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

  const columns: ColumnsType<Loan> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 200,
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
    },
    {
      title: "Mobile",
      dataIndex: "applicantMobile",
      key: "applicantMobile",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).fromNow(),
    },

    {
      title: <Typography.Text>Address 1</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "pavAssignee",
          render: (_, record: Loan) => {
            const pav = record?.verifications?.find(
              (v: any) => v.type === "AddressOne"
            );
            return pav ? pav?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
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
        },
      ],
    },
    {
      title: <Typography.Text>Address 2</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "cavAssignee",
          render: (_, record: Loan) => {
            const cav = record?.verifications?.find(
              (v: any) => v.type === "AddressTwo"
            );
            return cav ? cav?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
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
        },
      ],
    },
    {
      title: <Typography.Text>Work</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "wvAssignee",
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Work"
            );
            return wv ? wv?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
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
        },
      ],
    },
    {
      title: <Typography.Text>Business</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "wvAssignee",
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Business"
            );
            return wv ? wv?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
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
