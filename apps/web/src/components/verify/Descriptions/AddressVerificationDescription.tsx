import { Card, Descriptions } from "antd";
import React from "react";

const AddressVerificationDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  isCurrentVersion?: boolean;
}> = ({ data, extra, logs = false, changedFields = [], isCurrentVersion = false }) => {
  const getItemStyle = (fieldName: string) => {
    if (!changedFields.includes(fieldName)) return {};
    
    return {
      backgroundColor: isCurrentVersion ? '#fff1f0' : '#f6ffed'  // Red for current version, green for new version
    };
  };

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Address Verification"
            bordered
            column={logs ? 1 : 3}
            extra={extra}
          >
            <Descriptions.Item 
              label="Address Category"
              contentStyle={getItemStyle('addressCategory')}
            >
              {data?.addressVerification?.addressCategory}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Address Details"
              contentStyle={getItemStyle('addressDetails')}
            >
              {data?.addressVerification?.addressDetails}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Address Mismatch?"
              contentStyle={getItemStyle('addressMismatch')}
            >
              {data?.addressVerification?.addressMismatch}
            </Descriptions.Item>
            {data?.addressVerification?.addressMismatch==="Yes"&&<>
            <Descriptions.Item 
              label="Corrected Address"
              contentStyle={getItemStyle('addressCorrectionDetails')}
            >
              {data?.addressVerification?.addressCorrectionDetails}
            </Descriptions.Item>
            </>}
            <Descriptions.Item 
              label="Years at Current Residence"
              contentStyle={getItemStyle('numberOfYearsAtCurrentResidence')}
            >
              {data?.addressVerification?.numberOfYearsAtCurrentResidence}
            </Descriptions.Item>
            {data?.addressVerification?.numberOfYearsAtCurrentResidence ===
              "<=1year" && (
              <>
                <Descriptions.Item 
                  label="Previous Address"
                  contentStyle={getItemStyle('previousAddress')}
                >
                  {data?.addressVerification?.previousAddress}
                </Descriptions.Item>
                <Descriptions.Item 
                  label="Years at Previous Address"
                  contentStyle={getItemStyle('previousAddressYears')}
                >
                  {data?.addressVerification?.previousAddressYears}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item 
              label="Years in Current City"
              contentStyle={getItemStyle('numberOfYearsAtCurrentCity')}
            >
              {data?.addressVerification?.numberOfYearsAtCurrentCity}
            </Descriptions.Item>
            {data?.addressVerification?.numberOfYearsAtCurrentCity ===
              "<=3 years" && (
              <>
                <Descriptions.Item 
                  label="Previous City"
                  contentStyle={getItemStyle('previousCity')}
                >
                  {data?.addressVerification?.previousCity}
                </Descriptions.Item>
                <Descriptions.Item 
                  label="Years in Previous City"
                  contentStyle={getItemStyle('numberOfYearsAtPreviousCity')}
                >
                  {data?.addressVerification?.numberOfYearsAtPreviousCity}
                </Descriptions.Item>
                <Descriptions.Item 
                  label="Reason for Change"
                  contentStyle={getItemStyle('reasonForChange')}
                >
                  {data?.addressVerification?.reasonForChange}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item 
              label="Geo Tag"
              contentStyle={getItemStyle('geoTag')}
            >
              {data?.addressVerification?.geoTag}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default AddressVerificationDescription;
