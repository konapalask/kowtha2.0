import { Card, Table } from "antd";
import React from "react";

const columns = [
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    render: (text: any, record: any) => record.renderedBankName,
  },
  {
    title: "Purpose",
    dataIndex: "purpose",
    key: "purpose",
    render: (text: any, record: any) => record.renderedPurpose,
  },
  {
    title: "Loan Amount",
    dataIndex: "loanAmount",
    key: "loanAmount",
    render: (text: any, record: any) => record.renderedLoanAmount,
  },
  {
    title: "EMI",
    dataIndex: "emi",
    key: "emi",
    render: (text: any, record: any) => record.renderedEmi,
  },
  {
    title: "Tenure (months)",
    dataIndex: "tenure",
    key: "tenure",
    render: (text: any, record: any) => record.renderedTenure,
  },
];

const ExistingLoansDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  changedData?: any;
}> = ({ data, extra, logs = false, changedFields = [], changedData = {} }) => {
  const loans = data?.loans?.loans || [];
  const prevLoans = changedData?.loans?.loans || [];

  function renderCell(field: string, idx: number, value: any) {
    if (
      prevLoans[idx] &&
      prevLoans[idx][field] !== undefined &&
      prevLoans[idx][field] !== value
    ) {
      return (
        <span>
          <span style={{ textDecoration: "line-through", color: "#888" }}>
            {prevLoans[idx][field]}
          </span>
          <span style={{ marginLeft: 8, color: "#d4380d", fontWeight: 600 }}>
            {value}
          </span>
        </span>
      );
    }
    return value;
  }

  function isRowChanged(idx: number, loan: any) {
    if (!prevLoans[idx]) return false;
    return ["bankName", "purpose", "loanAmount", "emi", "tenure"].some(
      (field) =>
        prevLoans[idx][field] !== undefined &&
        prevLoans[idx][field] !== loan[field]
    );
  }

  const tableData = loans.map((loan: any, idx: number) => ({
    key: idx,
    renderedBankName: renderCell("bankName", idx, loan.bankName),
    renderedPurpose: renderCell("purpose", idx, loan.purpose),
    renderedLoanAmount: renderCell("loanAmount", idx, loan.loanAmount),
    renderedEmi: renderCell("emi", idx, loan.emi),
    renderedTenure: renderCell("tenure", idx, loan.tenure),
    isChanged: isRowChanged(idx, loan),
    ...loan,
  }));

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Existing Loans</span>
            {extra || null}
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            rowClassName={(_record, idx) =>
              tableData[idx]?.isChanged ? "changed-row" : ""
            }
          />
        </Card>
      </section>
      <style>{`
        .changed-row td {
          background: #f6ffed !important;
        }
      `}</style>
    </div>
  );
};

export default ExistingLoansDescription;
