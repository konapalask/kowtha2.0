import { useTabContext } from "@/pages/verify/[id]";
import { EditFormModalProps } from "@/utils/verifierInterface";
import { Form, message, Modal, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormSelector } from "./VerificationEditForms";
import _ from "lodash";

const formKeyMapping: Record<string, string> = {
  businessBasicDetails: "basicDetails",
  workBasicDetails: "basicDetails",
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
  // const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      const currentVerification = initialValues?.verifications?.find(
        (v: any) => v.type === currentTab
      );
      form.setFieldsValue(currentVerification?.verificationData || {});
    }
  }, [visible, initialValues, form, formKey, currentTab]);

  const getInitialValues = async () => {
    return await initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab
    )?.verificationData?.[formKeyMapping[formKey] || formKey];
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validate form first. If invalid, this will throw and skip the rest.
      const values = await form.validateFields();
      // Only proceed if validation passes
      const formValues = values;
      const initialValues = await getInitialValues();
      const cleanedInitialValues = Object.fromEntries(
        Object.entries(initialValues).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );
      const isChanged =
        JSON.stringify(_.sortBy(Object.entries(formValues))) !==
        JSON.stringify(_.sortBy(Object.entries(cleanedInitialValues)));

      if (isChanged) {
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
      } else {
        // If not changed, check if a log exists and update it by removing the data related to formKey
        const request = indexedDB.open("editLogs", 1);
        request.onerror = (event) => {
          console.error("Database error:", request.error);
        };
        request.onsuccess = (event: any) => {
          const db = request.result;
          try {
            const transaction = db.transaction("logs", "readwrite");
            const store = transaction.objectStore("logs");
            const key = `${id}_${activeTab}`;
            const getRequest = store.get(key);
            getRequest.onsuccess = () => {
              const existingData = getRequest.result;
              if (existingData) {
                const mappedKey = formKeyMapping[formKey] || formKey;
                // Remove the data related to formKey
                const updatedData = { ...existingData };
                delete updatedData[mappedKey];
                // Optionally, check if only id and timestamp remain
                // If so, you could delete the log, but per instruction, just update it
                const putRequest = store.put(updatedData);
                putRequest.onsuccess = () => {
                  message.success("Removed stale form data from edit log");
                  // console.log("Removed stale form data from edit log");
                  onEditSuccess?.();
                };
                putRequest.onerror = () => {
                  console.error("Error updating log:", putRequest.error);
                };
              }
            };
            getRequest.onerror = () => {
              console.error(
                "Error checking for existing log:",
                getRequest.error
              );
            };
            transaction.oncomplete = () => {
              db.close();
            };
            transaction.onerror = () => {
              console.error("Transaction error:", transaction.error);
              db.close();
            };
          } catch (error) {
            console.error("Error in database operation:", error);
            db.close();
          }
        };
      }
      onCancel();
    } catch (error) {
      // If validation fails, AntD will show errors on the form fields automatically
      // Only show a message if you want a global error
      // message.error("Please fill all required fields correctly.");
      setLoading(false);
    }
  };

  const getMaritalStatus = () => {
    return initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab
    )?.verificationData?.basicDetails?.maritalStatus;
  };

  // console.log(initialValues);

  // console.log(
  //   initialValues?.verifications?.find((v: any) => v.addressType === currentTab)
  //     ?.verificationData?.[formKeyMapping[formKey] || formKey]
  // );

  return (
    <Modal
      title={`Edit ${formKey.replace(/([A-Z])/g, " $1").trim()}`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={"100%"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          initialValues?.verifications?.find(
            (v: any) => v.addressType === currentTab
          )?.verificationData?.[formKeyMapping[formKey] || formKey]
        }
        // onValuesChange={() => setDirty(true)}
        // preserve={false}
      >
        <Row gutter={[12, 0]}>
          <FormSelector
            form={form}
            formKey={formKey}
            currentTab={currentTab}
            getMaritalStatus={getMaritalStatus}
          />
        </Row>
      </Form>
    </Modal>
  );
};
