import { postEditRequestApi, verifierEditApi } from "@/services/verifier.services";
import { getFormFields } from "@/utils/constants";
import { EditFormModalProps, FormField } from "@/utils/verifierInterface";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



export const EditFormModal: React.FC<EditFormModalProps> = ({
  visible,
  onCancel,
//   onSave,
  formKey,
  initialValues,
  currentTab,
  fetchVerificationData,
}) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (visible && initialValues) {
      const currentVerification = initialValues?.verifications?.find((v: any) => v.type === currentTab);
      form.setFieldsValue(currentVerification?.verificationData || {});
      if (formKey === 'finalObservations') {
        setEditorContent(currentVerification?.verificationData?.remarks || '');
      }
    }
  }, [visible, initialValues, form, formKey, currentTab]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (formKey === 'finalObservations') {
        values.remarks = editorContent;
      }

      // Find current verification data
      const currentVerification = initialValues?.verifications?.find((v: any) => v.type === currentTab);
      const currentVerificationData = currentVerification?.verificationData || {};
      const currentFieldData = currentVerificationData?.[formKey] || {};

      const changes: Record<string, { old: any; new: any }> = {};
    
    // Check changed fields
    Object.keys(values).forEach(key => {
      if (JSON.stringify(currentFieldData[key]) !== JSON.stringify(values[key])) {
        changes[key] = {
          old: currentFieldData[key],
          new: values[key]
        };
      }
    });

    // Check removed fields
    Object.keys(currentFieldData).forEach(key => {
      if (!(key in values)) {
        changes[key] = {
          old: currentFieldData[key],
          new: undefined
        };
      }
    });

    console.log('CHANGES:', changes);


      // Create payload with updated data
      const payload = {
        loanId: id ? parseInt(Array.isArray(id) ? id[0] : id) : undefined,
        changes: {
          // ...currentVerificationData,
          [formKey]: values
        }
      };

      // Call API to update verification data
      // await verifierEditApi(id as string, currentTab, payload);
      console.log(payload)
      await postEditRequestApi(payload)
      
      message.success('Changes saved successfully');
      form.resetFields();
      // onCancel();
      // Refresh verification data
      fetchVerificationData();
    } catch (error) {
      console.error('Error saving form:', error);
      message.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field: FormField) => {
    const formValues = form.getFieldsValue();
    
    // Check if field should be shown
    if (field.showWhen && !field.showWhen(formValues)) {
      return null;
    }

    switch (field.type) {
      case "input":
        return <Input disabled={field.readOnly} />;
      case "textarea":
        return <Input.TextArea rows={4} />;
      case "select":
        return (
          <Select
            allowClear
            placeholder={`Select ${field.label}`}
            notFoundContent="No options available"
          >
            {field.options?.map((option: string) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input />;
    }
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
        initialValues={initialValues?.verifications?.find((v: any) => v.type === currentTab)?.verificationData?.[formKey]}
        preserve={false}
      >
        <Row gutter={[16, 16]}>
          {getFormFields(formKey, currentTab).map((field:any) => (
            <Col span={ 8} key={field.name}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `Please ${field.type === 'select' ? 'select' : 'enter'} ${field.label.toLowerCase()}` }]}
              >
                {renderFormField(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};
