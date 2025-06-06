import { useTabContext } from "@/pages/verify/[id]";
import { EditFormModalProps } from "@/utils/verifierInterface";
import { Form, message, Modal, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormSelector } from "./VerificationEditForms";

const formKeyMapping: Record<string, string> = {
  businessBasicDetails: 'basicDetails',
  workBasicDetails: 'basicDetails'
};

interface ExtendedEditFormModalProps extends EditFormModalProps {
  onEditSuccess?: () => void;
}

export const EditFormModal: React.FC<ExtendedEditFormModalProps> = ({
  visible,
  onCancel,
  formKey,
  initialValues,
  currentTab,
  fetchVerificationData,
  onEditSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();

  useEffect(() => {
    if (visible && initialValues) {
      const currentVerification = initialValues?.verifications?.find(
        (v: any) => v.type === currentTab
      );
      form.setFieldsValue(currentVerification?.verificationData || {});
    }
  }, [visible, initialValues, form, formKey, currentTab]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const mappedKey = formKeyMapping[formKey] || formKey;
      const finalData = {
        [mappedKey]: values,
      };

      // IndexedDB operation
      const request = indexedDB.open("editLogs", 1);

      request.onerror = (event) => {
        console.error("Database error:", request.error);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("logs")) {
          db.createObjectStore("logs", { keyPath: "id" });
          console.log("Object store 'logs' created with keyPath 'id'");
        }
      };

      request.onsuccess = (event) => {
        const db = request.result;
        const transaction = db.transaction("logs", "readwrite");

        transaction.oncomplete = () => {
          db.close();
          console.log("Connection closed");
        };
        transaction.onerror = () => {
          db.close();
          console.error("Transaction failed");
        };

        const store = transaction.objectStore("logs");

        console.log(`${id}_${activeTab}`);

        const getRequest = store.get(`${id}_${activeTab}`);

        getRequest.onsuccess = () => {
          const existingData = getRequest.result || {};

          const logEntry = {
            id: `${id}_${activeTab}`,
            ...existingData,
            ...finalData,
            timestamp: new Date().toISOString(),
          };

          const putRequest = store.put(logEntry);

          putRequest.onsuccess = () => {
            message.success("Changes saved to edit logs successfully");
            form.resetFields();
            fetchVerificationData();
            onEditSuccess?.();
          };

          putRequest.onerror = () => {
            console.error("Error saving log:", putRequest.error);
            message.error("Failed to save edit log");
          };
        };

        getRequest.onerror = () => {
          console.error("Error fetching existing log:", getRequest.error);
          // If we can't read existing data, just save the new data
          const logEntry = {
            id: `${id}_${activeTab}`,
            ...finalData,
            timestamp: new Date().toISOString(),
          };

          const putRequest = store.put(logEntry);
          putRequest.onsuccess = () => {
            message.success("Changes saved to edit logs successfully");
            form.resetFields();
            fetchVerificationData();
            onEditSuccess?.();
          };

          putRequest.onerror = () => {
            console.error("Error saving log:", putRequest.error);
            message.error("Failed to save edit log");
          };
        };
      };
      onCancel();
    } catch (error) {
      console.error("Error saving form:", error);
      message.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const getMaritalStatus = () => {
    return initialValues?.verifications?.find((v: any) => v.addressType === currentTab)?.verificationData?.basicDetails?.maritalStatus;
  };

  return (
    <Modal
      title={`Edit ${formKey.replace(/([A-Z])/g, " $1").trim()}`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={1000}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          initialValues?.verifications?.find((v: any) => v.addressType === currentTab)
            ?.verificationData?.[formKeyMapping[formKey] || formKey]
        }
        preserve={false}
      >
        <Row gutter={[16, 16]}>
          <FormSelector form={form} formKey={formKey} currentTab={currentTab} getMaritalStatus={getMaritalStatus} />
        </Row>
      </Form>
    </Modal>
  );
};
