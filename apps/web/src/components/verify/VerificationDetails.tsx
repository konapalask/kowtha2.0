import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Image } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";

export const VerificationDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [editorContent, setEditorContent] = useState(verificationData?.finalObservations?.remarks || '');

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (verificationData?.uploadedItems) {
        const urls: {[key: string]: string} = {};
        for (const item of verificationData.uploadedItems) {
          try {
            const response = await getS3ImageUrl(item.s3ImageUrl);
            urls[item.id] = response;
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        }
        setImageUrls(urls);
      }
    };

    fetchImageUrls();
  }, [verificationData?.uploadedItems]);

  if (!verificationData) return null;

  const data = verificationData || {};

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onEdit("finalObservations");
  };

  return (
    <>
      {/* Basic Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title={"Basic Details"}
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("basicDetails")}
              />
            }
          >
            <Descriptions.Item label="Verification Type">
              {data?.basicDetails?.verificationType}
            </Descriptions.Item>
            <Descriptions.Item label="Application Number">
              {data?.basicDetails?.applicationNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Applicant Name">
              {data?.basicDetails?.applicantName}
            </Descriptions.Item>
            <Descriptions.Item label="Marital Status">
              {data?.basicDetails?.applicantMaritalStatus}
              {data?.basicDetails?.applicantMaritalStatus === 'Others' && 
                ` - ${data?.basicDetails?.applicantMaritalStatusOther}`}
            </Descriptions.Item>
            <Descriptions.Item label="Education Qualification">
              {data?.basicDetails?.educationQualification}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {data?.basicDetails?.category}
              {data?.basicDetails?.category === 'Others' && 
                ` - ${data?.basicDetails?.categoryOther}`}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Address Verification Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Address Verification"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("addressVerification")}
              />
            }
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
            {data?.addressVerification?.numberOfYearsAtCurrentResidence === '<=1year' && (
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
            {data?.addressVerification?.numberOfYearsAtCurrentCity === '<=3 years' && (
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

      {/* Residence Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Residence Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("residenceDetails")}
              />
            }
          >
            <Descriptions.Item label="Residence Status">
              {data?.residenceDetails?.residenceStatus}
            </Descriptions.Item>
            {data?.residenceDetails?.residenceStatus === 'Rented' && (
              <Descriptions.Item label="Rent Details">
                {data?.residenceDetails?.rentDetails}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Type of Residence">
              {data?.residenceDetails?.residenceType}
            </Descriptions.Item>
            <Descriptions.Item label="Construction Quality">
              {data?.residenceDetails?.constructionQuality}
            </Descriptions.Item>
            <Descriptions.Item label="Standard of Living">
              {data?.residenceDetails?.standardOfLiving}
            </Descriptions.Item>
            <Descriptions.Item label="Location Category">
              {data?.residenceDetails?.locationCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Locality Type">
              {data?.residenceDetails?.localityType}
            </Descriptions.Item>
            <Descriptions.Item label="Accessibility">
              {data?.residenceDetails?.accessibility}
            </Descriptions.Item>
            <Descriptions.Item label="House Area">
              {data?.residenceDetails?.houseArea}
            </Descriptions.Item>
            <Descriptions.Item label="Years at Current Address">
              {data?.residenceDetails?.yearsAtCurrentAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Nameplate Visible">
              {data?.residenceDetails?.nameplateVisible}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Family & Employment Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Family & Employment Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("familyEmploymentDetails")}
              />
            }
          >
            <Descriptions.Item label="Total Family Members">
              {data?.familyEmploymentDetails?.totalFamilyMembers}
            </Descriptions.Item>
            <Descriptions.Item label="No. of Earning Members">
              {data?.familyEmploymentDetails?.earningMembers}
            </Descriptions.Item>
            <Descriptions.Item label="No. of Dependents">
              {data?.familyEmploymentDetails?.dependents}
            </Descriptions.Item>
            <Descriptions.Item label="Is Spouse Working">
              {data?.familyEmploymentDetails?.isSpouseWorking}
            </Descriptions.Item>
            <Descriptions.Item label="Spouse's Employment Details">
              {data?.familyEmploymentDetails?.spouseEmploymentDetails}
            </Descriptions.Item>
            <Descriptions.Item label="Assets Observed">
              {data?.familyEmploymentDetails?.assetsObserved}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Third Party Check Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Third Party Check"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("thirdPartyCheck")}
              />
            }
          >
            <Descriptions.Item label="TPC Name">
              {data?.thirdPartyCheck?.tpcName}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {data?.thirdPartyCheck?.mobileNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {data?.thirdPartyCheck?.relationship}
            </Descriptions.Item>
            <Descriptions.Item label="Feedback Status">
              {data?.thirdPartyCheck?.feedbackStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Comments">
              {data?.thirdPartyCheck?.comments}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Photo Capture Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Photo Capture">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {data?.uploadedItems?.map((item: any, idx: number) => {
              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  <Image
                    src={imageUrls[item.id] || ''}
                    alt={`Photo ${idx + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    preview={false}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<CloseCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%',
                      padding: 4
                    }}
                    onClick={() => {
                      // Handle photo removal
                      const updatedItems = data.uploadedItems.filter((i: any) => i.id !== item.id);
                      onEdit("photoCapture");
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px'
                  }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Photo {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section style={{ marginBottom: 24 }}>
        <EditRequestLogs currentData={verificationData} editRequestData={verificationData?.editRequestData} />
      </section>

      {/* Final Observations Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Final Observations">
          <div style={{ height: '400px', marginBottom: '20px' }}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              style={{ height: '300px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
          </div>
        </Card>
      </section>
    </>
  );
};
