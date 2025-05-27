import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import {
  Button,
  Typography,
  Space,
  Modal,
  message,
  Tabs,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getVerificationData, generateFinalReport, getEditRequestsApi } from "@/services/verifier.services";
import { VerificationDetails } from "@/components/verify/VerificationDetails";
import { WorkVerificationDetails } from "@/components/verify/WorkVerificationDetails";
import { FinalObservationsDetails } from "@/components/verify/FinalObservationDetails";
import { EditFormModal } from "@/components/verify/EditFormModal";
import { TabContextType } from "@/utils/verifierInterface";
import Footer from "@/components/verify/Footer";

const { Title } = Typography;
const { TabPane } = Tabs;

// Create Tab Context
const TabContext = createContext<TabContextType>({
  activeTab: 'PermanentAddress',
  setActiveTab: () => {},
});
export const useTabContext = () => useContext(TabContext);

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [verificationData, setVerificationData] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentFormKey, setCurrentFormKey] = useState("");
  const [activeTab, setActiveTab] = useState("PermanentAddress");

  const fetchVerificationData = async () => {
    getVerificationData(id as string).then((res) => {
      setVerificationData(res?.data);
    }).catch((err) => {
      console.error(err);
      message.error('Failed to fetch verification data');
    });
  }
  
  useEffect(()=>{
    getEditRequestsApi("pending", id as string).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.error(err);
      // message.error('Failed to fetch edit requests');
    })
  },[id])

  useEffect(() => {
    if (id) {
     fetchVerificationData();
    }
  }, [id]);

  const handleEdit = (formKey: string) => {
    setCurrentFormKey(formKey);
    setEditModalVisible(true);
  };

  const getVerificationByType = (type: string) => {
    // Map tab keys to verification types
    const typeMapping: { [key: string]: string } = {
      PermanentAddress: 'PermanentAddress',
      CurrentAddress: 'CurrentAddress',
      Work: 'Work',
      Final: 'Work' // Using Work verification for final observations
    };

    // Get the verification type based on the current tab
    const verificationType = typeMapping[activeTab];
    
    // Find the verification data for the current type
    const verification = verificationData?.verifications?.find((v: any) => v.type === verificationType);
    
    // Return the verification data with the correct structure
    return verification?.verificationData || {};
  }; 

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <DashboardLayout>
        <div style={{ paddingBottom: "20px"}}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}>
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
            <TabPane tab="Permanent Address" key="PermanentAddress">
              <VerificationDetails 
                verificationData={getVerificationByType('PermanentAddress')} 
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Current Address" key="CurrentAddress">
              <VerificationDetails 
                verificationData={getVerificationByType('CurrentAddress')} 
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Work Verification" key="Work">
              <WorkVerificationDetails 
                verificationData={getVerificationByType('Work')} 
                onEdit={handleEdit}
              />
            </TabPane>
            {/* <TabPane tab="Final Observations" key="Final">
              <FinalObservationsDetails 
                verificationData={getVerificationByType('Work')} 
                onEdit={handleEdit}
              />
            </TabPane> */}
          </Tabs>
          <Footer />
        </div>

        <EditFormModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          formKey={currentFormKey}
          initialValues={verificationData}
          currentTab={activeTab}
          fetchVerificationData={fetchVerificationData}
        />
      </DashboardLayout>
    </TabContext.Provider>
  );
}
