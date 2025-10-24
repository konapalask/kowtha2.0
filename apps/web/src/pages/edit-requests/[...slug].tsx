"use client";
import EditRequestLogs from "@/components/verify/EditRequestLogs";
import PDRequestLogs from "@/components/verify/PDRequestLogs";
import { getSchemaFromBackend } from "@/services/schema.service";
import {
  getEditRequestsById,
  getVerificationData,
} from "@/services/verifier.services";
import { message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditRequestDetails = () => {
  const router: { query: any } = useRouter();
  const id = router?.query?.slug?.[0];
  const loanid = router?.query?.slug?.[2];
  const [editRequestData, setEditRequestData] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [changedData, setChangedData] = useState<any>({});
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [dynamicSchema, setDynamicSchema] = useState<any>(null);
  console.log(dynamicSchema);
  console.log(editRequestData);

  useEffect(() => {
    const fetchData = async () => {
      if (id && loanid) {
        try {
          const res = await getEditRequestsById(id as string);
          setEditRequestData(res?.data);

          if (res?.data?.verification?.verificationData) {
            setCurrentData(res?.data?.verification?.verificationData);
          }

          if (res?.data?.changes) {
            setChangedData(res?.data?.changes);
          }

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
          if (bankName) {
            try {
              const schema = await getSchemaFromBackend(bankName, department);
              if (schema?.schema) setDynamicSchema(schema?.schema);
            } catch (schemaError) {
              console.error("Error loading schema:", schemaError);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [id, loanid]);

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
