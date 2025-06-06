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

      const request = indexedDB.open("editLogs", 1);

      request.onerror = (event) => {
        console.error("Database error:", request.error);
        message.error("Failed to save changes: Database error");
      };

      request.onsuccess = (event: any) => {
        const db = request.result;
        
        try {
          const transaction = db.transaction("logs", "readwrite");
          const store = transaction.objectStore("logs");

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
              onCancel();
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
              onCancel();
            };
          };

          transaction.oncomplete = () => {
            db.close();
          };

          transaction.onerror = () => {
            console.error("Transaction error:", transaction.error);
            message.error("Failed to save changes: Transaction error");
            db.close();
          };
        } catch (error) {
          console.error("Error in database operation:", error);
          message.error("Failed to save changes: Operation error");
          db.close();
        }
      };
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
