import React from "react";
import { Modal, Radio, Button } from "antd";

interface SelectTypeModalProps {
  visible: boolean;
  onSelect: (type: "pd" | "fi") => void;
  onCancel: () => void;
}

const SelectTypeModal: React.FC<SelectTypeModalProps> = ({
  visible,
  onSelect,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = React.useState<"pd" | "fi" | null>(null);

  const handleOk = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <Modal
      title="Select Type"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{ disabled: !selectedType }}
      cancelButtonProps={{ disabled: false }}
      okText="Confirm"
    >
      <Radio.Group
        onChange={(e) => setSelectedType(e.target.value)}
        value={selectedType}
      >
        <Radio value="pd">PD</Radio>
        <Radio value="fi">FI</Radio>
      </Radio.Group>
    </Modal>
  );
};

export default SelectTypeModal;
