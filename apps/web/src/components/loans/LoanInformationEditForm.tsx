import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  Space,
  message,
} from "antd";
import { createLoanApi, updateLoanApi } from "@/services/loans.services";
import {
  applicantTypeOptions,
  bankOptions,
  loanTypeOptions,
} from "@/utils/options";
import { getUserDetails, isEmpty, getCurrentDepartment } from "@/utils/utility";
import { isMobileVerificationCompleted } from "@/utils/loanCompletionChecker";
// import { useWatch } from "antd/es/form/Form";
interface LoanInfoFormProps {
  form: any;
  selectedLoan: any;
  setSelectedLoan: (loan: any) => void;
  setEditLoanInfo: (val: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchLoanDetails: () => void;
  pdBankOptions: any;
  templateOptions: any[];
}

const LoanInformationEditForm: React.FC<LoanInfoFormProps> = ({
  form,
  selectedLoan,
  setSelectedLoan,
  setEditLoanInfo,
  loading,
  setLoading,
  fetchLoanDetails,
  pdBankOptions,
  templateOptions,
}) => {
  const userDetails = getUserDetails();
  const currentDepartment = getCurrentDepartment();
  // console.log(selectedLoan);
  // console.log(form.getFieldsValue());

  const loanType = Form.useWatch("loanType", form);
  const bankName = Form.useWatch("bankName", form);

  // Check if mobile verification is completed to disable bank name field
  const isVerificationCompleted = isMobileVerificationCompleted(selectedLoan);

  // Filter template options based on selected bank name
  const filteredTemplateOptions = React.useMemo(() => {
    if (!bankName || !templateOptions || templateOptions.length === 0) {
      return templateOptions || [];
    }

    // Map bank names to their template names (matching backend index.ts structure)
    const bankToTemplatesMap: Record<string, string[]> = {
      "Aditya Birla": ["ADITYA BIRLA-HL", "ADITYA BIRLA-ML", "ADITYA BIRLA-STSL"],
      "Ambit": ["AMBIT-HL"],
      "Ambit-MSME": ["AMBIT-MSME"],
      "Axis Finance": ["AXIS FINANCE-HL"],
      "Axis Finance UBL Above 10L": ["AXIS FINANCE-UBL"],
      "Axis Finance UBL Below 10L": ["AXIS FINANCE-UBL"],
      "Axis Bank": ["AXIS BANK"],
      "Axis Agri": ["AXIS AGRI", "AXIS BUSINESS AGRI"],
      "Chola": ["CHOLA-HL", "CHOLA-ML"],
      "DCB": ["DCB BANK"],
      "Arka Fincap": [
        "ARKA FINCAP",
        "CENTRUM",
        "CENT BANK",
        "CLIX CAPITAL-HL",
        "CLIX CAPITAL-UBL",
        "EASY HL",
        "FED BANK (PD&LIP)",
        "GODREJ-HL",
        "GODREJ-UBL",
        "INDUSIND",
        "KOTAK",
        "MUTHOOT-HL",
        "MUTHOOT FINCORP (PD & LIP)",
        "NIDO HOME FINANCE",
        "NORTHERN ARC",
        "NIPUN",
        "PIRAMAL (PD, AIP, LIP)",
        "PNB",
        "SAMMAAN",
        "SMFG-ML (MICRO & MASS)",
        "SMFG-HL",
        "TATA CAPITAL-FSL",
        "TATA CAPITAL-HFL",
        "TRUHOME (PD & LIP)",
        "VERITAS",
      ],
      "Hero Fincorp": ["HERO FINCORP"],
      "HeroHousing-Salaried": ["HERO HOUSING SALARIED"],
      "HeroHousing-Self": ["HERO HOUSING SELF"],
      "ICICI": ["ICICI"],
      "IDFC HL & ML": ["IDFC FIRST-HL", "IDFC FIRST-ML"],
      "IDFC PL": ["IDFC FIRST-PL"],
      "IIFL": ["IIFL"],
      "India Shelter SENP": ["INDIA SHELTER SENP"],
      "India Shelter Salaried": ["INDIA SHELTER"],
      "INCRED": ["INCRED/KKR India Financial Services Limited"],
      "Jana Salaried": ["JANA SMALL FINANCE BANK LIMITED"],
      "Jana Senp Above 50l": ["JANA SMALL FINANCE BANK LIMITED"],
      "Jana Senp Below 50l": ["JANA SMALL FINANCE BANK LIMITED"],
      "Niwas Salaried": ["NIWAS"],
      "Niwas Senp": ["NIWAS"],
      "RBL": ["RBL BANK (PD & LIP)"],
      "SMFG SME": ["SMFG-SME"],
      "Tata Ubl": ["TATA CAPITAL-UBL"],
      "Yes Bank": ["YES BANK-HL"],
    };

    const templatesForBank = bankToTemplatesMap[bankName] || [];
    
    if (templatesForBank.length === 0) {
      // If bank not found in map, return all templates
      return templateOptions;
    }

    // Filter template options to only include templates for selected bank
    return templateOptions.filter((option) =>
      templatesForBank.includes(option.value)
    );
  }, [bankName, templateOptions]);

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        initialValues={
          isEmpty(selectedLoan)
            ? undefined
            : {
                applicationNumber: selectedLoan?.applicationNumber,
                applicantName: selectedLoan?.applicantName,
                applicantMobile: selectedLoan?.applicantMobile,
                loanAmount: selectedLoan?.loanAmount,
                applicantAddress: selectedLoan?.applicantAddress,
                loanType: loanTypeOptions.some(
                  (option) =>
                    option.value.toLowerCase() ===
                    selectedLoan?.loanType?.toLowerCase()
                )
                  ? selectedLoan?.loanType
                  : "Others",

                specifyLoanType: selectedLoan?.loanType,
                bankName: selectedLoan?.bankName,
                applicantType: selectedLoan?.applicantType,
                ...(currentDepartment === "PD" && {
                  templateName: selectedLoan?.templateName,
                }),
              }
        }
        onFinish={async (values) => {
          try {
            setLoading(true);

            const loanTypeFinal =
              values.loanType === "Others"
                ? values?.specifyLoanType
                : values.loanType;

            const normalizedLoanData = {
              ...values,
              applicationNumber: values.applicationNumber?.trim(),
              applicantName: values.applicantName?.trim(),
              applicantMobile: values.applicantMobile?.trim(),
              applicantAddress: values.applicantAddress?.trim(),
              loanType: loanTypeFinal,
              bankName: values.bankName,
              ...(currentDepartment === "PD" && {
                templateName: values.templateName,
              }),
              loanAmount: Number(values.loanAmount),
            };

            delete normalizedLoanData.specifyLoanType;

            if (!selectedLoan?.id) {
              const loanData = {
                ...normalizedLoanData,
                operationsExecutiveId: userDetails?.sub,
              };

              const response = await createLoanApi([loanData]);
              const data = response?.data;

              if (data?.status === 201 && data?.data?.failedCount > 0) {
                message.error(
                  "Loan with this Application number and Applicant type exists"
                );
              } else {
                setSelectedLoan(data?.data?.successful?.[0]?.id);
                message.success("Loan created successfully");
              }
            } else {
              const { applicationNumber, ...rest } = normalizedLoanData;

              await updateLoanApi(selectedLoan?.id, rest);
              message.success("Loan information updated");
            }

            fetchLoanDetails();
            setEditLoanInfo(false);
          } catch (error) {
            message.error(
              selectedLoan?.id
                ? "Failed to update loan information"
                : "Failed to create loan"
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        <Row gutter={8}>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Application Number"
              name="applicationNumber"
              rules={[
                { required: true, message: "Required" },
                { whitespace: true, message: "Cannot be empty" },
              ]}
            >
              <Input readOnly={selectedLoan?.applicationNumber} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Applicant Name"
              name="applicantName"
              rules={[
                { required: true, message: "Required" },
                { whitespace: true, message: "Cannot be empty" },
                {
                  validator: (_, value) => {
                    if (value && value.startsWith(" ")) {
                      return Promise.reject("Cannot start with a space.");
                    }
                    if (value && /[^A-Za-z0-9 ]/.test(value)) {
                      return Promise.reject(
                        "Special characters are not allowed."
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Mobile Number"
              name="applicantMobile"
              rules={[
                { required: true, message: "Required" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Loan Amount"
              name="loanAmount"
              rules={[
                {
                  validator: (_, value) => {
                    // Allow empty values - field is not required
                    if (
                      value === undefined ||
                      value === null ||
                      value === "" ||
                      value === 0
                    ) {
                      return Promise.resolve();
                    }

                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                      return Promise.reject("Please enter a valid amount");
                    }

                    if (numValue < 100 || numValue > 9999999999) {
                      return Promise.reject(
                        "Please enter min of 3 digits and max of 10 digits"
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                maxLength={10}
                style={{ width: "100%" }}
                onKeyDown={(e) => {
                  // Allow only numbers, backspace, delete, tab, arrows, home, end
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                  ];

                  const isNumber = /^[0-9]$/.test(e.key);

                  if (!isNumber && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  // Remove any non-numeric characters that might have been pasted
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  if (numericValue !== e.target.value) {
                    e.target.value = numericValue;
                  }

                  form.setFieldValue(
                    "loanAmount",
                    numericValue ? Number(numericValue) : undefined
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Loan Type"
              name="loanType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select loan type"
                options={loanTypeOptions}
                onSelect={(e) => {
                  if (e === "Others") {
                    form.setFieldValue("specifyLoanType", null);
                  }
                }}
              />
            </Form.Item>
          </Col>
          {loanType === "Others" && (
            <Col xs={24} sm={6} style={{ padding: 4 }}>
              <Form.Item
                labelCol={{ span: 24, style: { marginBottom: 0 } }}
                label="Specify Loan Type"
                name="specifyLoanType"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input maxLength={25} />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Bank Name"
              name="bankName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                showSearch
                placeholder="Select bank"
                options={
                  currentDepartment === "PD" ? pdBankOptions : bankOptions
                }
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
                disabled={isVerificationCompleted}
                onChange={(value) => {
                  // Clear template name when bank changes
                  if (currentDepartment === "PD") {
                    form.setFieldValue("templateName", undefined);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Applicant Type"
              name="applicantType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                // showSearch
                placeholder="Select Applicant Type"
                options={applicantTypeOptions}
                // filterOption={(input, option) =>
                //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                // }
              />
            </Form.Item>
          </Col>
          {currentDepartment === "PD" && (
            <Col xs={24} sm={6} style={{ padding: 4 }}>
              <Form.Item
                labelCol={{ span: 24, style: { marginBottom: 0 } }}
                label="Template Name"
                name="templateName"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Template Name"
                  options={filteredTemplateOptions}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  disabled={!bankName}
                  notFoundContent={
                    bankName
                      ? "No templates available for selected bank"
                      : "Please select a bank first"
                  }
                  onChange={(value) => {
                    // Clear template if bank changes and template is not valid for new bank
                    if (value && !filteredTemplateOptions.some((opt) => opt.value === value)) {
                      form.setFieldValue("templateName", undefined);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {selectedLoan?.id ? "Save" : "Create Loan"}
            </Button>
            {selectedLoan?.id && (
              <Button onClick={() => setEditLoanInfo(false)}>Cancel</Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoanInformationEditForm;
