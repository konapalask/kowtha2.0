import React, { useContext } from "react";
import { Card, Typography, Row, Col, Button, message, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { UserContext } from "../layout/UserContextProvider";
import { updateEditRequestApi } from "@/services/verifier.services";
import BasicDetailsDescription from "./Descriptions/BasicDetailsDescription";
import AddressVerificationDescription from "./Descriptions/AddressVerificationDescription";
import FamilyEmploymentDescription from "./Descriptions/FamilyEmploymentDescription";
import ResidenceDetailsDescription from "./Descriptions/ResidenceDetailsDescription";
import ThirdPartyCheckDescription from "./Descriptions/ThirdPartyCheckDescription";
import { useRouter } from "next/router";

const { Text } = Typography;

const getLabels = {
  basicDetails: "Basic Details",
  addressVerification: "Address Verification",
  familyEmploymentDetails: "Family & Employment Details",
  residenceDetails: "Residence Details",
  thirdPartyCheck: "Third Party Check",
};

const getDescriptions = {
  basicDetails: BasicDetailsDescription,
  addressVerification: AddressVerificationDescription,
  familyEmploymentDetails: FamilyEmploymentDescription,
  residenceDetails: ResidenceDetailsDescription,
  thirdPartyCheck: ThirdPartyCheckDescription,
};

interface EditRequestLogsProps {
  currentData: any;
  editRequestData: any;
}

// Helper to get changed keys for a section
const getChangedKeys = (currentSection: any, editSection: any) => {
  if (!currentSection || !editSection) return [];
  return Object.keys({ ...currentSection, ...editSection }).filter(
    (key) =>
      JSON.stringify(currentSection?.[key]) !==
      JSON.stringify(editSection?.[key])
  );
};

const EditRequestLogs: React.FC<EditRequestLogsProps> = (_props) => {
  const router: any = useRouter();
  const id = router?.query?.slug?.[0] || null;
  const { userDetails } = useContext(UserContext);
  const { currentData, editRequestData } = _props;

  if (!editRequestData) {
    return (
      <Card
        title={
          <Typography style={{ fontSize: 16, fontWeight: 600 }}>
            Request Logs
          </Typography>
        }
      >
        <Text type="secondary">No request logs found</Text>
      </Card>
    );
  }

  const handleApprove = async () => {
    try {
      await updateEditRequestApi(id, {
        status: "Approved",
      });
      message.success("Response saved successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to save response");
    }
  };

  const handleRequest = () => {
    // postEditRequestApi(editRequestData) //need verification type
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          {userDetails?.role === "Admin" && (
            <LeftOutlined
              style={{ cursor: "pointer", marginRight: 8 }}
              onClick={() => window.history.back()}
            />
          )}
          <Typography style={{ fontSize: 16, fontWeight: 600 }}>
            Request Logs
          </Typography>
        </div>
      }
      extra={
        <>
          {userDetails?.role !== "Admin" && (
            <Button
              type="primary"
              onClick={handleRequest}
              style={{ marginLeft: "auto" }}
            >
              Request Approval
            </Button>
          )}
        </>
      }
    >
      {Object.keys(editRequestData)
        .filter((sectionKey) => getLabels[sectionKey as keyof typeof getLabels])
        .map((sectionKey) => {
          const SectionDescription =
            getDescriptions[sectionKey as keyof typeof getDescriptions];
          const currentSection = currentData?.[sectionKey];
          const editSection = editRequestData?.[sectionKey];
          if (!SectionDescription) return null;
          const changedKeys = getChangedKeys(currentSection, editSection);
          return (
            <Row gutter={24} key={sectionKey} style={{ marginBottom: 32 }}>
              <Col span={12}>
                <SectionDescription
                  data={{ [sectionKey]: currentSection }}
                  extra={null}
                  logs={true}
                />
                {changedKeys.length > 0 && (
                  <div style={{ color: "#faad14", fontSize: 12, marginTop: 4 }}>
                    Changed fields: {changedKeys.join(", ")}
                  </div>
                )}
              </Col>
              <Col span={12}>
                <SectionDescription
                  data={{ [sectionKey]: editSection }}
                  extra={
                    userDetails?.role === "Admin" && (
                      <Space>
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
                      </Space>
                    )
                  }
                  logs={true}
                />
                {changedKeys.length > 0 && (
                  <div style={{ color: "#52c41a", fontSize: 12, marginTop: 4 }}>
                    Changed fields: {changedKeys.join(", ")}
                  </div>
                )}
              </Col>
            </Row>
          );
        })}
    </Card>
  );
};

export default EditRequestLogs;
