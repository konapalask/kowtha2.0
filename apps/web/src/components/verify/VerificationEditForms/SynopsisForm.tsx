import React from "react";
import { Form, Input, Row, Col } from "antd";

const { TextArea } = Input;

export type SynopsisFormData = {
  synopsis: string;
};

interface SynopsisFormProps {
  form: any;
}

const SynopsisForm: React.FC<SynopsisFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="synopsis"
            label="Synopsis"
            rules={[{ required: true, message: "Please enter synopsis" }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Enter detailed synopsis..."
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default SynopsisForm; 