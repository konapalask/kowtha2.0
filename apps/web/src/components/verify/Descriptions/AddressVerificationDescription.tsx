import { Card, Descriptions } from "antd";
import React from "react";

const AddressVerificationDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
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
            <Descriptions.Item label="Address Type">
              {data?.addressVerification?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Address Category">
              {data?.addressVerification?.addressCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Address Details">
              {data?.addressVerification?.addressDetails}
            </Descriptions.Item>
            <Descriptions.Item label="Years at Current Residence">
              {data?.addressVerification?.numberOfYearsAtCurrentResidence}
            </Descriptions.Item>
            {data?.addressVerification?.numberOfYearsAtCurrentResidence ===
              "<=1year" && (
              <>
                <Descriptions.Item label="Previous Address">
                  {data?.addressVerification?.previousAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Years at Previous Address">
                  {data?.addressVerification?.previousAddressYears}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Years in Current City">
              {data?.addressVerification?.numberOfYearsAtCurrentCity}
            </Descriptions.Item>
            {data?.addressVerification?.numberOfYearsAtCurrentCity ===
              "<=3 years" && (
              <>
                <Descriptions.Item label="Previous City">
                  {data?.addressVerification?.previousCity}
                </Descriptions.Item>
                <Descriptions.Item label="Years in Previous City">
                  {data?.addressVerification?.numberOfYearsAtPreviousCity}
                </Descriptions.Item>
                <Descriptions.Item label="Reason for Change">
                  {data?.addressVerification?.reasonForChange}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Geo Tag">
              {data?.addressVerification?.geoTag}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default AddressVerificationDescription;
