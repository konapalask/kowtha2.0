import React, { useContext } from "react";
import { Card, Typography, Row, Col, Descriptions, Button, message, Space } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LeftOutlined } from "@ant-design/icons";
import { UserContext } from "../layout/UserContextProvider";

const { Text } = Typography;

interface EditRequestLogsProps {
  currentData: any;
  editRequestData: any;
}

const EditRequestLogs: React.FC<EditRequestLogsProps> = (_props) => {
  const {userDetails} = useContext(UserContext);
  const currentData = {
    name: "John Doe",
    age: 30,
    status: "Active",
    email: "john@example.com",
    city: "New York",
  };
  const editRequestData = {
    name: "John Doe",
    age: 31,
    status: "Pending",
    email: "john.doe@newmail.com",
    city: "New York",
  };

  // Find changed keys (fix TS error by using type assertion)
  const changedKeys = Object.keys(currentData).filter(
    (key) => JSON.stringify(currentData[key as keyof typeof currentData]) !== JSON.stringify(editRequestData[key as keyof typeof editRequestData])
  );

  if (!editRequestData) {
    return (
      <Card title="Request Logs">
        <Text type="secondary">No request logs found</Text>
      </Card>
    );
  }

  const handleApprove = () => {
    message.success("Response saved successfully");
  }

  // const handleReject = () => {
  //   message.error("Request rejected");
  // };

  return (
    <Card title={<div style={{ display: "flex", alignItems: "center" }}>
    <LeftOutlined style={{ cursor: "pointer", marginRight: 8 }} onClick={() => window.history.back()} />
    <Typography>Request Logs</Typography>
    </div>}>
      <Row gutter={24}>
        <Col span={12}>
          <Descriptions title="Current Data" bordered column={1} size="small">
            {Object.entries(currentData || {})
              .slice(0, 5)
              .map(([key, value]) => (
                <Descriptions.Item
                  key={key}
                  label={key}
                  labelStyle={changedKeys.includes(key) ? { color: "red" } : undefined}
                  contentStyle={changedKeys.includes(key) ? { color: "red" } : undefined}
                >
                  {String(value)}
                </Descriptions.Item>
              ))}
          </Descriptions>
        </Col>
        <Col span={12}>
          <Descriptions title="Edit Request Data" bordered column={1} size="small" extra={userDetails?.role === "Admin" && <Space>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleApprove}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                </Space>}>
            {Object.entries(editRequestData || {})
              .slice(0, 5)
              .map(([key, value]) => (
                <Descriptions.Item
                  key={key}
                  label={key}
                  labelStyle={changedKeys.includes(key) ? { color: "green" } : undefined}
                  contentStyle={changedKeys.includes(key) ? { color: "green" } : undefined}
                >
                  {String(value)}
                </Descriptions.Item>
              ))}
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default EditRequestLogs;