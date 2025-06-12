"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import { Typography, message, Tabs } from "antd";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getVerificationData,
  getEditRequestsApi,
} from "@/services/verifier.services";
// import { VerificationDetails } from "@/components/verify/VerificationDetails";
// import { WorkVerificationDetails } from "@/components/verify/WorkVerificationDetails";
// import { EditFormModal } from "@/components/verify/EditFormModal";
import { TabContextType } from "@/utils/verifierInterface";
// import { BusinessVerificationDetails } from "@/components/verify/BusinessVerificationDetails";

const { Title } = Typography;
const { TabPane } = Tabs;

// Create Tab Context
const TabContext = createContext<TabContextType>({
  activeTab: "PermanentAddress",
  setActiveTab: () => {},
});
export const useTabContext = () => useContext(TabContext);

const DashboardLayout = dynamic(() => import("@/components/layout/DashboardLayout"), { ssr: false });
const VerificationDetails = dynamic(() => import("@/components/verify/VerificationDetails"), { ssr: false });
const WorkVerificationDetails = dynamic(() => import("@/components/verify/WorkVerificationDetails"), { ssr: false });
const EditFormModal = dynamic(() => import("@/components/verify/EditFormModal"), { ssr: false });
const BusinessVerificationDetails = dynamic(() => import("@/components/verify/BusinessVerificationDetails"), { ssr: false });

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [verificationData, setVerificationData] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentFormKey, setCurrentFormKey] = useState("");
  const [activeTab, setActiveTab] = useState<string>("");
  const [editLogsUpdated, setEditLogsUpdated] = useState(0);
  const [editRequests, setEditRequests] = useState<any>([]);

  const fetchVerificationData = async () => {
    getVerificationData(id as string)
      .then((res) => {
        setVerificationData(res?.data);
        // Set the first available tab as active
        if (res?.data?.verifications?.length > 0) {
          const verificationOrder = ["PermanentAddress", "CurrentAddress", "Work", "Business"];
          const firstAvailableTab = verificationOrder.find(type => 
            res.data.verifications.some((v: any) => v.addressType === type)
          );
          if (firstAvailableTab && activeTab === "") {
            setActiveTab(firstAvailableTab);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch verification data");
      });
  };


  const fetchEditRequests = async () => {
    getEditRequestsApi("Pending", id as string)
      .then((res) => {
        // console.log(res.data);
        setEditRequests(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (id) {
      fetchEditRequests();

      fetchVerificationData();
    }
  }, [id]);

  // Add this useEffect for IndexedDB initialization
  useEffect(() => {
    // Initialize IndexedDB
    const request = indexedDB.open("editLogs", 1);

    request.onerror = (event) => {
      console.error("Database error:", request.error);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      // Create the logs store if it doesn't exist
      if (!db.objectStoreNames.contains("logs")) {
        db.createObjectStore("logs", { keyPath: "id" });
        // console.log("Object store 'logs' created successfully");
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      // console.log("Database opened successfully");
      db.close();
    };
  }, []); // Run only once when component mounts

  const handleEdit = (formKey: string) => {
    setCurrentFormKey(formKey);
    setEditModalVisible(true);
  };

  const getVerificationByType = (type: string) => {
    // Map tab keys to verification types
    const typeMapping: { [key: string]: string } = {
      PermanentAddress: "PermanentAddress",
      CurrentAddress: "CurrentAddress",
      Work: "Work",
      Business: "Business",
    };

    // Get the verification type based on the current tab
    const verificationType = typeMapping[activeTab];

    // Find the verification data for the current type
    const verification = verificationData?.verifications?.find(
      (v: any) => v.addressType === verificationType
    );

    // Return the verification data with the correct structure
    return verification?.verificationData || {};
  };

  // console.log(verificationData);

  const getLabel = (type: string) => {
    switch (type) {
      case "PermanentAddress":
        return "Permanent Address";
      case "CurrentAddress":
        return "Current Address";
      case "Work":
        return "Work Verification";
      case "Business":
        return "Business Verification";
    }
  };

  const getVerificationId = (type: string) => {
    return verificationData?.verifications?.find(
      (v: any) => v.addressType === type
    )?.id;
  };

  const hasEditRequest = (type: string) => {
    return editRequests?.some((request: any) => request.verificationId === getVerificationId(type));
  };

  const getComponentByType = (type: string) => {
    switch (type) {
      case "PermanentAddress":
        return  <VerificationDetails
          verificationData={getVerificationByType("PermanentAddress")}
          onEdit={handleEdit}
          editLogsUpdated={editLogsUpdated}
          verificationId={getVerificationId("PermanentAddress")}
          fetchEditRequests={fetchEditRequests}
          hasEditRequest={hasEditRequest("PermanentAddress")}
        />
      case "CurrentAddress":
        return <VerificationDetails
          verificationData={getVerificationByType("CurrentAddress")}
          onEdit={handleEdit}
          editLogsUpdated={editLogsUpdated}
          verificationId={getVerificationId("CurrentAddress")}
          fetchEditRequests={fetchEditRequests}
          hasEditRequest={hasEditRequest("CurrentAddress")}
        />
      case "Work":
        return <WorkVerificationDetails 
          verificationData={getVerificationByType("Work")} 
          onEdit={handleEdit}
          editLogsUpdated={editLogsUpdated}
          verificationId={getVerificationId("Work")}
          fetchEditRequests={fetchEditRequests}
          hasEditRequest={hasEditRequest("Work")}
        />;
      case "Business":
        return <BusinessVerificationDetails 
          verificationData={getVerificationByType("Business")} 
          onEdit={handleEdit}
          editLogsUpdated={editLogsUpdated}
          verificationId={getVerificationId("Business")}
          fetchEditRequests={fetchEditRequests}
          hasEditRequest={hasEditRequest("Business")}
        />;
    }
  };

  // Define the desired order of verification types
  const verificationOrder = ["PermanentAddress", "CurrentAddress", "Work", "Business"];
  
  // Sort and filter tabItems based on the defined order
  const tabItems = verificationOrder
    .map(orderType => {
      const verification = verificationData?.verifications?.find(
        (v: any) => v.addressType === orderType
      );
      return verification ? {
        key: verification.addressType,
        label: getLabel(verification.addressType),
        children: getComponentByType(verification.addressType),
      } : null;
    })
    .filter(Boolean);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <DashboardLayout>
        <div style={{ paddingBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Loan Verification - {verificationData?.applicationNumber}
            </Title>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            // style={{justifyContent:"center"}}
            className="tabs-center"
          >
            {tabItems?.map((item: any) => (
              <TabPane tab={item.label} key={item.key}>
                {item.children}
              </TabPane>
            ))}
            {/* <TabPane tab="Permanent Address" key="PermanentAddress">
              <VerificationDetails
                verificationData={getVerificationByType("PermanentAddress")}
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Current Address" key="CurrentAddress">
              <VerificationDetails
                verificationData={getVerificationByType("CurrentAddress")}
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Work Verification" key="Work">
              <WorkVerificationDetails
                verificationData={getVerificationByType("Work")}
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Business Verification" key="Business">
              <BusinessVerificationDetails 
                verificationData={getVerificationByType('Business')} 
                onEdit={handleEdit}
              />
            </TabPane> */}
          </Tabs>
        </div>

        <EditFormModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          formKey={currentFormKey}
          initialValues={verificationData}
          currentTab={activeTab}
          fetchVerificationData={fetchVerificationData}
          onEditSuccess={() => setEditLogsUpdated(prev => prev + 1)}
        />
      </DashboardLayout>
    </TabContext.Provider>
  );
}
