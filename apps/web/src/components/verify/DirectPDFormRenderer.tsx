import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  DatePicker,
  Switch,
  message,
  Tag,
} from "antd";
import {
  SaveOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import {
  formatNumberForInput,
  parseFormattedNumber,
} from "../../utils/numberFormatting";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Array Edit Form Component
const ArrayEditForm: React.FC<{
  field: any;
  itemData: any;
  onDataChange: (data: any) => void;
}> = ({ field, itemData, onDataChange }) => {
  const [editForm] = Form.useForm();

  useEffect(() => {
    editForm.setFieldsValue(itemData);
  }, [itemData, editForm]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    const newData = { ...itemData, [fieldKey]: value };
    onDataChange(newData);
    editForm.setFieldsValue(newData);
  };

  const renderEditField = (fieldKey: string, fieldDef: any) => {
    const value = itemData[fieldKey];

    const commonProps = {
      value,
      onChange: (e: any) =>
        handleFieldChange(fieldKey, e.target ? e.target.value : e),
      placeholder: `Enter ${fieldDef.label || fieldKey}`,
    };

    switch (fieldDef.type) {
      case "text":
        return <Input {...commonProps} />;
      case "number":
        return (
          <InputNumber
            {...commonProps}
            style={{ width: "100%" }}
            formatter={
              fieldDef.formatter
                ? (val) =>
                    val === undefined || val === null
                      ? ""
                      : formatNumberForInput(val, fieldDef.formatter)
                : undefined
            }
            parser={
              fieldDef.formatter
                ? (val) => {
                    const parsed = parseFormattedNumber(val ?? "");
                    return parsed === "" ? undefined : Number(parsed);
                  }
                : undefined
            }
          />
        );
      case "textarea":
        return <TextArea {...commonProps} rows={3} />;
      case "select":
        return (
          <Select {...commonProps} style={{ width: "100%" }}>
            {(fieldDef.options || fieldDef.enum || []).map(
              (option: string) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
              )
            )}
          </Select>
        );
      case "boolean":
        return (
          <Switch
            checked={value}
            onChange={(checked) => handleFieldChange(fieldKey, checked)}
          />
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <Form form={editForm} layout="vertical">
      <Row gutter={[16, 16]}>
        {field.items?.properties &&
          Object.entries(field.items.properties).map(
            ([key, fieldDef]: [string, any]) => (
              <Col key={key} span={fieldDef.span || 12}>
                <Form.Item
                  label={fieldDef.label || key}
                  required={fieldDef.required}
                >
                  {renderEditField(key, fieldDef)}
                </Form.Item>
              </Col>
            )
          )}
      </Row>
    </Form>
  );
};

// Helper function to convert date strings to dayjs objects
const convertDateStringsToDayjs = (data: any, schema: any): any => {
  if (!data || !schema?.sections) return data;

  const processedData = { ...data };

  schema.sections.forEach((section: any) => {
    if (section.fields && processedData[section.id]) {
      section.fields.forEach((field: any) => {
        if (field.type === "date" && processedData[section.id][field.id]) {
          const dateValue = processedData[section.id][field.id];
          if (typeof dateValue === "string") {
            processedData[section.id][field.id] = dayjs(dateValue);
          }
        }
      });
    }
  });

  return processedData;
};

// Helper function to add UUIDs to array items
const addUuidsToArrayItems = (data: any, schema: any): any => {
  if (!data || !schema?.sections) return data;

  const processedData = { ...data };

  schema.sections.forEach((section: any) => {
    if (section.fields && processedData[section.id]) {
      section.fields.forEach((field: any) => {
        if (field.type === "array" && processedData[section.id][field.id]) {
          const existingValue = processedData[section.id][field.id];

          const normalizeWithIds = (items: any[]) =>
            items.map((item: any) => ({
              ...item,
              _id: item._id || uuidv4(),
            }));

          if (Array.isArray(existingValue)) {
            processedData[section.id][field.id] =
              normalizeWithIds(existingValue);
          } else if (
            existingValue &&
            typeof existingValue === "object" &&
            Array.isArray(existingValue[field.id])
          ) {
            processedData[section.id][field.id] = {
              ...existingValue,
              [field.id]: normalizeWithIds(existingValue[field.id]),
            };
          }
        }
      });
    }
  });

  return processedData;
};

const isEmptyValue = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

const resolveDependencyValue = (
  formValues: Record<string, any>,
  currentSectionId: string,
  dependencyPath: string
) => {
  if (!formValues) return undefined;

  const pathSegments = dependencyPath.split(".");
  let sectionKey = currentSectionId;
  let fieldPath = pathSegments;

  if (pathSegments.length > 1 && formValues[pathSegments[0]] !== undefined) {
    sectionKey = pathSegments[0];
    fieldPath = pathSegments.slice(1);
  }

  let value = formValues?.[sectionKey];
  for (const segment of fieldPath) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[segment];
  }

  return value;
};

const evaluateDependencies = (
  dependencies: Record<string, any> | undefined,
  sectionId: string,
  formValues: Record<string, any>
): boolean => {
  if (!dependencies) return true;

  return Object.entries(dependencies).every(([dependencyKey, expected]) => {
    const actual = resolveDependencyValue(formValues, sectionId, dependencyKey);

    if (Array.isArray(expected)) {
      return expected.includes(actual);
    }

    return actual === expected;
  });
};

const shouldFieldBeVisible = (
  field: any,
  sectionId: string,
  formValues: Record<string, any>
): boolean => {
  if (!field?.dependencies?.show) {
    return true;
  }

  return evaluateDependencies(field.dependencies.show, sectionId, formValues);
};

const shouldFieldBeRequired = (
  field: any,
  sectionId: string,
  formValues: Record<string, any>
): boolean => {
  if (field?.dependencies?.required) {
    return evaluateDependencies(field.dependencies.required, sectionId, formValues);
  }

  return !!field?.required;
};

const buildFieldValidationRules = (
  field: any,
  sectionId: string,
  formValues: Record<string, any>
) => {
  const rules: any[] = [];
  const hasConditionalRequired = !!field?.dependencies?.required;

  if (field?.required && !hasConditionalRequired) {
    rules.push({
      required: true,
      message: `${field.label || field.id} is required`,
    });
  }

  if (hasConditionalRequired) {
    rules.push({
      validator: (_: any, value: any) => {
        const shouldRequire = evaluateDependencies(
          field.dependencies.required,
          sectionId,
          formValues
        );

        if (!shouldRequire) {
          return Promise.resolve();
        }

        if (isEmptyValue(value)) {
          return Promise.reject(
            new Error(`${field.label || field.id} is required`)
          );
        }

        return Promise.resolve();
      },
    });
  }

  return rules;
};

interface DirectPDFormRendererProps {
  schema: any;
  initialData?: any;
  onSave?: (data: any) => void;
  readOnly?: boolean;
}

export const DirectPDFormRenderer: React.FC<DirectPDFormRendererProps> = ({
  schema,
  initialData = {},
  onSave,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(!readOnly);
  const [saving, setSaving] = useState(false);
  const [arrayEditModal, setArrayEditModal] = useState<{
    visible: boolean;
    sectionId: string;
    fieldId: string;
    itemIndex: number | null;
    itemData: any;
  }>({
    visible: false,
    sectionId: "",
    fieldId: "",
    itemIndex: null,
    itemData: null,
  });

  // Set initial form values
  useEffect(() => {
    if (initialData) {
      // Convert date strings to dayjs objects for DatePicker fields
      const processedData = convertDateStringsToDayjs(initialData, schema);

      // Add UUIDs to array items that don't have them
      const dataWithUuids = addUuidsToArrayItems(processedData, schema);

      form.setFieldsValue(dataWithUuids);
    }
  }, [initialData, form, schema]);

  // Render field based on type
  const renderFieldControl = (field: any, sectionId?: string) => {
    const commonProps = {
      placeholder: `Enter ${field.label}`,
      disabled: field.readOnly || !editMode,
    };

    switch (field.type) {
      case "text":
        return <Input {...commonProps} />;

      case "number":
        return (
          <InputNumber
            {...commonProps}
            style={{ width: "100%" }}
            formatter={
              field.formatter
                ? (value) =>
                    value === undefined || value === null
                      ? ""
                      : formatNumberForInput(value, field.formatter)
                : undefined
            }
            parser={
              field.formatter
                ? (value) => {
                    const parsed = parseFormattedNumber(value ?? "");
                    return parsed === "" ? undefined : Number(parsed);
                  }
                : undefined
            }
          />
        );

      case "textarea":
        return <TextArea {...commonProps} rows={3} />;

      case "select":
        return (
          <Select {...commonProps} style={{ width: "100%" }}>
            {(field.options || field.enum || []).map((option: string) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );

      case "date":
        return (
          <DatePicker
            {...commonProps}
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          />
        );

      case "boolean":
        return (
          <Switch disabled={field.readOnly || !editMode} />
        );

      case "array":
        return renderArrayField(field, sectionId || "");

      default:
        return <Input {...commonProps} />;
    }
  };

  // Render inline field for array items
  const renderInlineField = (
    field: any,
    value: any,
    onChange: (value: any) => void
  ) => {
    let normalizedValue = value;

    if (field.type === "number" && typeof value === "string" && value !== "") {
      const parsed = Number(value);
      normalizedValue = Number.isNaN(parsed) ? value : parsed;
    }

    if (field.type === "date" && typeof value === "string" && value) {
      normalizedValue = dayjs(value);
    }

    const commonProps = {
      value: normalizedValue,
      placeholder: `Enter ${field.label}`,
      disabled: field.readOnly || !editMode,
    };

    switch (field.type) {
      case "text":
        return (
          <Input
            {...commonProps}
            onChange={(e) => onChange(e.target.value)}
            size="small"
          />
        );

      case "number":
        return (
          <InputNumber
            {...commonProps}
            style={{ width: "100%" }}
            size="small"
            formatter={
              field.formatter
                ? (val) =>
                    val === undefined || val === null
                      ? ""
                      : formatNumberForInput(val, field.formatter)
                : undefined
            }
            parser={
              field.formatter
                ? (val) => {
                    const parsed = parseFormattedNumber(val ?? "");
                    return parsed === "" ? undefined : Number(parsed);
                  }
                : undefined
            }
            onChange={(val) => onChange(val)}
          />
        );

      case "textarea":
        return (
          <TextArea
            {...commonProps}
            rows={2}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            style={{ width: "100%" }}
            size="small"
            onChange={(val) => onChange(val)}
          >
            {(field.options || field.enum || []).map((option: string) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );

      case "date":
        return (
          <DatePicker
            {...commonProps}
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            size="small"
            onChange={(_, dateString) => onChange(dateString)}
          />
        );

      case "boolean":
        return (
          <Switch
            checked={!!value}
            onChange={onChange}
            size="small"
            disabled={field.readOnly || !editMode}
          />
        );

      default:
        return <Input {...commonProps} size="small" />;
    }
  };

  const getArrayItemFields = (field: any) => {
    if (Array.isArray(field.arrayItemFields) && field.arrayItemFields.length) {
      return field.arrayItemFields;
    }

    if (field.items?.properties) {
      return Object.entries(field.items.properties).map(
        ([key, itemField]: [string, any]) => {
          const inferredType = (() => {
            if (itemField.enum) return "select";
            if (itemField.format === "date") return "date";
            if (itemField.type === "boolean") return "boolean";
            if (itemField.type === "array") return "array";
            if (itemField.type === "object") return "object";
            if (
              itemField.type === "number" ||
              itemField.type === "integer"
            ) {
              return "number";
            }
            const title = (itemField.title || itemField.label || key)
              .toLowerCase()
              .trim();
            if (
              title.includes("address") ||
              title.includes("description") ||
              title.includes("about") ||
              title.includes("remark") ||
              title.includes("details") ||
              title.includes("synopsis")
            ) {
              return "textarea";
            }
            return "text";
          })();

          return {
            id: key,
            label: itemField.label || itemField.title || key,
            type: inferredType,
            enum: itemField.enum,
            options: itemField.enum,
            required: itemField.required,
            readOnly: itemField.readOnly,
            span: itemField.span || 8,
            formatter: itemField.formatter,
            dependencies: itemField.dependencies,
          };
        }
      );
    }

    return [];
  };

  // Render array field with direct inline editing
  const renderArrayField = (field: any, sectionId: string) => {
    // Get array data from form values (which should have UUIDs now)
    const sectionData = form.getFieldValue(sectionId) || {};
    const fieldValue = form.getFieldValue([sectionId, field.id]);
    const itemFields = getArrayItemFields(field);

    const checkItemDependencies = (
      dependencies: Record<string, any> | undefined,
      itemData: any
    ) => {
      if (!dependencies) return true;

      return Object.entries(dependencies).every(([dependencyKey, expected]) => {
        const actual = itemData?.[dependencyKey];

        if (Array.isArray(expected)) {
          return expected.includes(actual);
        }

        return actual === expected;
      });
    };

    // Access the nested structure: sectionData[field.id][field.id] for arrays
    let arrayData: any[] = [];

    if (Array.isArray(fieldValue)) {
      arrayData = fieldValue;
    } else if (
      fieldValue &&
      typeof fieldValue === "object" &&
      Array.isArray(fieldValue[field.id])
    ) {
      arrayData = fieldValue[field.id];
    } else if (sectionData[field.id] && Array.isArray(sectionData[field.id])) {
      // Direct array case stored at section level
      arrayData = sectionData[field.id];
    } else if (
      sectionData[field.id] &&
      typeof sectionData[field.id] === "object" &&
      Array.isArray(sectionData[field.id][field.id])
    ) {
      // Nested array case: section.field.field (e.g., businessOwnerDetails.businessOwnerDetails)
      arrayData = sectionData[field.id][field.id];
    }

    // Debug logging
    // Ensure each item has a UUID and debug the structure
    const arrayWithIds = arrayData.map((item: any, index: number) => {
      const itemWithId = {
        ...item,
        _id: item._id || uuidv4(),
      };
      return itemWithId;
    });

    const handleDeleteItem = (index: number) => {
      if (!editMode || field.readOnly) {
        return;
      }
      const newArray = arrayWithIds.filter((_: any, i: number) => i !== index);
      updateArrayData(sectionId, field.id, newArray);
    };

    const handleAddItem = () => {
      if (!editMode || field.readOnly) {
        return;
      }
      const newItem = { _id: uuidv4() };
      itemFields.forEach((itemField: any) => {
        const key = itemField.id || itemField.key;
        if (!key) return;
        if (itemField.type === "boolean") {
          newItem[key] = false;
        } else if (itemField.type === "number") {
          newItem[key] = undefined;
        } else {
          newItem[key] = "";
        }
      });

      const newArray = [...arrayWithIds, newItem];
      updateArrayData(sectionId, field.id, newArray);
    };

    const handleFieldChange = (index: number, fieldKey: string, value: any) => {
      const newArray = arrayWithIds.map((item: any, i: number) =>
        i === index ? { ...item, [fieldKey]: value } : item
      );
      updateArrayData(sectionId, field.id, newArray);
    };

    return (
      <div>
        <Row gutter={[16, 16]}>
          {arrayWithIds.map((item: any, index: number) => (
            <Col
              key={item._id || index}
              xs={24}
              md={12}
              style={{ display: "flex", alignItems: "stretch" }}
            >
              <Card
                size="small"
                style={{
                  width: "100%",
                  border: "1px solid #e8e8e8",
                  marginBottom: 0,
                }}
                title={`${field.label} #${index + 1}`}
                extra={
                  editMode && !field.readOnly ? (
                    <Button
                      type="link"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteItem(index)}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Tag color="blue">View Only</Tag>
                  )
                }
              >
                <Row gutter={[16, 16]}>
                  {itemFields.map((itemField: any) => {
                    const key = itemField.id || itemField.key;
                    const value = item[key] ?? "";
                    if (!checkItemDependencies(itemField.dependencies?.show, item)) {
                      return null;
                    }

                    return (
                      <Col key={key} span={itemField.span || 12}>
                        <div style={{ marginBottom: 8 }}>
                          <Text
                            strong
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: 4,
                              display: "block",
                            }}
                          >
                            {itemField.label || key}:
                          </Text>
                          {renderInlineField(itemField, value, (newValue) =>
                            handleFieldChange(index, key, newValue)
                          )}
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {editMode && !field.readOnly && (
          <Button
            type="dashed"
            onClick={handleAddItem}
            style={{ width: "100%", marginTop: 8 }}
            icon={<PlusOutlined />}
          >
            Add {field.label}
          </Button>
        )}
      </div>
    );
  };

  // Update array data in form
  const updateArrayData = (
    sectionId: string,
    fieldId: string,
    newArray: any[]
  ) => {
    const sectionData = form.getFieldValue(sectionId) || {};

    const currentValue = sectionData[fieldId];

    let updatedFieldValue: any;
    if (Array.isArray(currentValue)) {
      updatedFieldValue = newArray;
    } else if (
      currentValue &&
      typeof currentValue === "object" &&
      Array.isArray(currentValue[fieldId])
    ) {
      updatedFieldValue = {
        ...currentValue,
        [fieldId]: newArray,
      };
    } else {
      updatedFieldValue = newArray;
    }

    const updatedSectionData = {
      ...sectionData,
      [fieldId]: updatedFieldValue,
    };

    form.setFieldsValue({
      [sectionId]: updatedSectionData,
    });
  };

  // Handle saving array item
  const handleSaveArrayItem = () => {
    const { sectionId, fieldId, itemIndex, itemData } = arrayEditModal;
    const sectionData = form.getFieldValue(sectionId) || {};
    const currentArray = sectionData[fieldId] || [];

    if (itemIndex !== null) {
      // Update existing item
      currentArray[itemIndex] = itemData;
    } else {
      // Add new item
      currentArray.push(itemData);
    }

    updateArrayData(sectionId, fieldId, currentArray);
    setArrayEditModal({ ...arrayEditModal, visible: false });
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      const values = form.getFieldsValue();

      if (onSave) {
        await onSave(values);
      }

      message.success("Data saved successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error saving:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save data";
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!schema || !schema.sections) {
    return <div>No schema available</div>;
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {schema.title || "PD Form"}
          </Title>
          <Text type="secondary">
            Direct form editing - like mobile PD forms
          </Text>
        </div>

        {!readOnly && (
          <Space>
            {editMode ? (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </Space>
        )}
      </div>

      {/* Direct Form */}
      <Form form={form} layout="vertical">
        {schema.sections.map((section: any) => (
          <Card
            key={section.id}
            title={section.label || section.title}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              {section.fields?.map((field: any) => (
                <Form.Item
                  key={`${section.id}-${field.id}`}
                  noStyle
                  shouldUpdate={() => true}
                >
                  {() => {
                    const formValues = form.getFieldsValue(true);
                    if (!shouldFieldBeVisible(field, section.id, formValues)) {
                      return null;
                    }

                    const isArrayField = field.type === "array";
                    const baseSpan = field.span || 8;
                    const colSpan = isArrayField ? 24 : baseSpan;
                    const colMd = isArrayField ? 24 : baseSpan;
                    const colLg = isArrayField ? 24 : field.span || 6;
                    const required = shouldFieldBeRequired(
                      field,
                      section.id,
                      formValues
                    );
                    const valuePropName =
                      !isArrayField && field.type === "boolean"
                        ? "checked"
                        : undefined;
                    const validationRules = buildFieldValidationRules(
                      field,
                      section.id,
                      formValues
                    );

                    return (
                      <Col
                        span={colSpan}
                        xs={24}
                        sm={isArrayField ? 24 : 12}
                        md={colMd}
                        lg={colLg}
                      >
                        {isArrayField ? (
                          <Form.Item
                            label={field.label}
                            required={required}
                            style={{ marginBottom: 0 }}
                          >
                            {renderArrayField(field, section.id)}
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name={[section.id, field.id]}
                            label={field.label}
                            valuePropName={valuePropName}
                            required={required}
                            rules={validationRules}
                          >
                            {renderFieldControl(field, section.id)}
                          </Form.Item>
                        )}
                      </Col>
                    );
                  }}
                </Form.Item>
              ))}
            </Row>
          </Card>
        ))}
      </Form>
    </div>
  );
};

export default DirectPDFormRenderer;
