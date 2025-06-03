import { Card, Descriptions } from "antd";
import React from "react";

const ThirdPartyCheckDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Third Party Check"
            bordered
            column={logs ? 1 : 3}
            extra={extra || null}
          >
            <Descriptions.Item label="TPC Name">
              {data?.thirdPartyCheck?.tpcName}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {data?.thirdPartyCheck?.mobileNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {data?.thirdPartyCheck?.relationship}
            </Descriptions.Item>
            <Descriptions.Item label="Feedback Status">
              {data?.thirdPartyCheck?.feedbackStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Comments">
              {data?.thirdPartyCheck?.comments}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default ThirdPartyCheckDescription;
