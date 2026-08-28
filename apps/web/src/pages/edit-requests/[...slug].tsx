"use client";
import EditRequestLogs from "@/components/verify/EditRequestLogs";
import PDRequestLogs from "@/components/verify/PDRequestLogs";
import { 
  getSchemaFromBackend,
  convertBackendSchemaToWebFormat 
} from "@/services/schema.service";
import {
  getEditRequestsById,
  getVerificationData,
} from "@/services/verifier.services";
import { message, Typography } from "antd";
import { useRouter } from "@/utils/router";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const EditRequestDetails = () => {
  const router: { query: any } = useRouter();
  const id = router?.query?.slug?.[0];
  const loanid = router?.query?.slug?.[2];
  const [editRequestData, setEditRequestData] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [changedData, setChangedData] = useState<any>({});
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [dynamicSchema, setDynamicSchema] = useState<any>(null);
  const [schemaLoading, setSchemaLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id && loanid) {
        try {
          const res = await getEditRequestsById(id as string);
          setEditRequestData(res?.data);

          if (res?.data?.verification?.verificationData) {
            setCurrentData(res?.data?.verification?.verificationData);
          }

          const changes = res?.data?.changes;
          if (changes) setChangedData(changes);

          let department = "";
          if (res?.data?.verification?.verificationData?.department) {
            department = res?.data?.verification?.verificationData?.department;
          } else if (res?.data?.loan?.department) {
            department = res?.data?.loan?.department;
          } else {
            const changes = res?.data?.changes;
            if (changes?.basicDetails?.applicationNumber) {
              department = "PD";
            } else {
              department = "FI";
            }
          }
          setCurrentDepartment(department);

          const bankName =
            res?.data?.verification?.bankName ||
            res?.data?.loan?.bankName ||
            "";
          const templateName = res?.data?.loan?.templateName || "";
          
          if (bankName) {
            try {
              setSchemaLoading(true);
              const backendResponse = await getSchemaFromBackend(
                bankName, 
                department,
                templateName || undefined
              );
              
              if (backendResponse?.schema) {
                const convertedSchema = convertBackendSchemaToWebFormat(
                  backendResponse.schema
                );
                if (convertedSchema) {
                  setDynamicSchema(convertedSchema);
                }
              }
            } catch (schemaError) {
              console.error("Error loading schema:", schemaError);
            } finally {
              setSchemaLoading(false);
            }
          } else {
            setSchemaLoading(false);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [id, loanid]);

  useEffect(() => {
    if (!dynamicSchema || !editRequestData?.changes) return;

    const verificationData = editRequestData?.verification?.verificationData || {};
    const changes = editRequestData?.changes;

    const alreadyWrappedSection = Object.keys(changes).find((key) =>
      dynamicSchema.sections?.some((s: any) => s.id === key)
    );
    if (alreadyWrappedSection) {
      setChangedData(changes);
      setCurrentData(verificationData);
      return;
    }

    const changeKeys = Object.keys(changes || {});
    let bestMatchSection: any = null;
    let bestMatchCount = 0;

    dynamicSchema.sections?.forEach((section: any) => {
      const fieldIds = (section.fields || []).map((f: any) => f.id);
      const matchCount = changeKeys.filter((k) => fieldIds.includes(k)).length;
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestMatchSection = section;
      }
    });

    if (!bestMatchSection || bestMatchCount === 0) {
      setChangedData(changes);
      setCurrentData(verificationData);
      return;
    }

    const sectionId = bestMatchSection.id;

    const sectionFieldIds = (bestMatchSection.fields || []).map((f: any) => f.id);
    const currentSectionData: any = {};
    sectionFieldIds.forEach((fid: string) => {
      if (verificationData?.[fid] !== undefined) {
        currentSectionData[fid] = verificationData[fid];
      } else if (verificationData?.[sectionId]?.[fid] !== undefined) {
        currentSectionData[fid] = verificationData[sectionId][fid];
      }
    });

    setChangedData({ [sectionId]: changes });
    setCurrentData({
      ...verificationData,
      [sectionId]: currentSectionData,
    });
  }, [dynamicSchema, editRequestData]);

  if (schemaLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Text>Loading schema...</Text>
      </div>
    );
  }

  return (
    <div>
      {currentDepartment === "PD" ? (
        <PDRequestLogs
          verificationType={editRequestData?.verification?.addressType}
          currentData={currentData}
          changedData={changedData}
          fetchEditRequests={() => {}}
          disabled={false}
          admin={true}
          verificationId={id as string}
          currentDepartment={currentDepartment}
          dynamicSchema={dynamicSchema}
        />
      ) : (
        <EditRequestLogs
          verificationType={editRequestData?.verification?.addressType}
          currentData={currentData}
          changedData={changedData}
          fetchEditRequests={() => {}}
          disabled={false}
          admin={true}
          verificationId={id as string}
          currentDepartment={currentDepartment}
          dynamicSchema={dynamicSchema}
        />
      )}
    </div>
  );
};

export default EditRequestDetails;
