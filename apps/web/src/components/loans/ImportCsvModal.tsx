import { Modal, Upload, Typography, message } from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import React from "react";

const { Text } = Typography;

interface ImportCsvProps {
  isImportModalVisible: boolean;
  setIsImportModalVisible: (visible: boolean) => void;
  handleImport: (file: File) => void;
}

const ImportCsvModal: React.FC<ImportCsvProps> = ({
  isImportModalVisible,
  setIsImportModalVisible,
  handleImport,
}) => {
  return (
    <div>
      <Modal
        title="Import Loans"
        open={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            <InfoCircleOutlined /> The .csv/.xls/.xlsx file should contain the
            following columns:
          </Text>
          <ul>
            <li>applicationNumber (required)</li>
            <li>applicantName (required)</li>
            <li>applicantAddress (required)</li>
            <li>loanType (required)</li>
            <li>bankName (required)</li>
            <li>loanAmount (required)</li>
          </ul>
          <Text type="secondary">
            Maximum file size: 10MB
            <br />
            Maximum records: 5000
          </Text>
        </div>

        <Upload.Dragger
          accept=".csv,.xls,.xlsx"
          maxCount={1}
          beforeUpload={(file) => {
            if (file.size > 10 * 1024 * 1024) {
              // 10MB
              message.error("File size should not exceed 10MB");
              return false;
            }
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (ext === "csv" || ext === "xls" || ext === "xlsx") {
              handleImport(file);
            } else {
              message.error("Unsupported file format");
            }
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default ImportCsvModal;
