import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../layout/UserContextProvider";
import { createLoanApi } from "@/services/loans.services";
import { bankOptions, loanTypeOptions, applicantTypeOptions } from "@/utils/options";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllFieldExecutivesApi } from "@/services/users.services";

interface BulkImportProps {
  isBulkImportDrawerVisible: boolean;
  setIsBulkImportDrawerVisible: (visible: boolean) => void;
  bulkImportForm: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  verifiers?: any[];
}

const BulkImportDrawer: React.FC<BulkImportProps> = ({
  isBulkImportDrawerVisible,
  setIsBulkImportDrawerVisible,
  bulkImportForm,
  loading,
  setLoading,
  setRefresh,
  verifiers = [],
}) => {
  const { userDetails } = useContext(UserContext);
  const [fieldExecutives, setFieldExecutives] = useState<any[]>([]);

  useEffect(() => {
    const fetchFieldExecutives = async () => {
    try{
      const response = await getAllFieldExecutivesApi();
      console.log(response.data.data);
      const options = response?.data?.data?.map((user: any) => ({
        label: <Typography.Text>{user.name} <Tag color="blue">{user.employeeCode}</Tag></Typography.Text>,
        value: user.id,
        searchValue: `${user.name} ${user.employeeCode}`.toLowerCase()
      }))||[];
      setFieldExecutives(options);
    }catch(error){
      console.log(error)
    }
    };
    fetchFieldExecutives();
  }, []);

  useEffect(() => {
    if (isBulkImportDrawerVisible) {
      // Initialize with one empty form
      bulkImportForm.setFieldsValue({
        loans: [{}],
      });
    }
  }, [isBulkImportDrawerVisible, bulkImportForm]);

  const handleBulkImport = async (values: any) => {
    console.log(values);
    try {
      setLoading(true);
      // Transform the form values into the required format
      const loansData = values.loans.map((loan: any) => ({
        ...loan,
        officeId: userDetails?.officeId,
        operationsExecutiveId: userDetails?.sub,
      }));
      console.log(loansData);

      const result = await createLoanApi(loansData);
      if (
        result.data.data.successful &&
        result.data.data.successful.length > 0
      ) {
        message.success(
          `Successfully created ${result.data.data.successfulCount} loans`
        );
        setIsBulkImportDrawerVisible(false);
        bulkImportForm.resetFields();
        setRefresh((prev: boolean) => !prev);
      } else {
        message.error("Failed to create loans");
      }
    } catch (error) {
      message.error("Failed to create loans");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Drawer
        title="Bulk Import Loans"
        placement="right"
        width={"100%"}
        onClose={() => {
          setIsBulkImportDrawerVisible(false);
          bulkImportForm.resetFields();
        }}
        bodyStyle={{ padding: "16px" }}
        open={isBulkImportDrawerVisible}
        maskClosable={false}
        destroyOnClose
        footer={
          <div style={{ textAlign: "right", padding: "10px" }}>
            <Space>
              <Button
                type="primary"
                loading={loading}
                onClick={() => bulkImportForm.submit()}
              >
                Create Loans
              </Button>
              <Button
                onClick={() => {
                  setIsBulkImportDrawerVisible(false);
                  bulkImportForm.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={bulkImportForm}
          onFinish={handleBulkImport}
          layout="vertical"
        >
          <Form.List name="loans">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <Row gutter={[8, 8]} align="middle" wrap={false}>
                      <Col xs={24} md={4} lg={4} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicationNumber"]}
                          label="Application Number"
                          rules={[
                            { required: true, message: "Required" },
                            { whitespace: true, message: "Cannot be empty" },
                            { max: 20, message: "Cannot be more than 20 characters" },
                          ]}
                        >
                          <Input style={{ height: "32px" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={5} lg={3} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicantName"]}
                          label="Applicant Name"
                          rules={[
                            { required: true, message: "Required" },
                            { whitespace: true, message: "Cannot be empty" },
                          ]}
                        >
                          <Input style={{ height: "32px" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4} lg={3} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicantType"]}
                          label="Applicant Type"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            placeholder="Select Applicant Type"
                            options={applicantTypeOptions}
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4} lg={4} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicantMobile"]}
                          label="Mobile Number"
                          rules={[
                            { required: true, message: "Required" },
                            {
                              pattern: /^[0-9]{10}$/,
                              message:
                                "Please enter a valid 10-digit mobile number",
                            },
                          ]}
                        >
                          <Input
                            maxLength={10}
                            style={{ height: "32px" }}
                            addonBefore={"+91"}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={7} lg={6} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "address1"]}
                          label="Address 1"
                        >
                          <Input style={{ height: "32px" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={7} lg={6} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "address2"]}
                          label="Address 2"
                        >
                          <Input style={{ height: "32px" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4} lg={3} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "loanType"]}
                          label="Loan Type"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            placeholder="Select loan type"
                            options={loanTypeOptions}
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6} lg={5} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "bankName"]}
                          label="Bank Name"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select bank"
                            options={bankOptions}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={3} lg={3} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "loanAmount"]}
                          label="Loan Amount"
                          rules={[
                            { required: true, message: "Required" },
                            {
                              type: "number",
                              message: "Please enter a valid amount",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%", height: "32px" }}
                            addonAfter={"₹"}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6} lg={5} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "fieldExecutiveId"]}
                          label="Field Executive"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select field executive"
                            options={fieldExecutives}
                            filterOption={(input, option) =>
                              option?.searchValue?.includes(input.toLowerCase())
                            }
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6} lg={5} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "verifierId"]}
                          label="Verifier"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select verifier"
                            options={verifiers}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        md={3}
                        lg={2}
                        xl={2}
                        style={{
                          padding: "0 4px 0 4px",
                          display: "flex",
                          alignContent: "end",
                        }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    style={{ maxWidth: 500 }}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Loan
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </div>
  );
};

export default BulkImportDrawer;
