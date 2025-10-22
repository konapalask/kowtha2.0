"use client";
import EditRequestLogs from "@/components/verify/EditRequestLogs";
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

  useEffect(() => {
    if (id && loanid) {
      getEditRequestsById(id as string)
        .then((res) => {
          setEditRequestData(res?.data);
          if (res?.data?.verification?.verificationData) {
            setCurrentData(res?.data?.verification?.verificationData);
          }

          if (res?.data?.changes) {
            setChangedData(res?.data?.changes);
          }

          if (res?.data?.verification?.verificationData?.department) {
            setCurrentDepartment(
              res?.data?.verification?.verificationData?.department
            );
          } else if (res?.data?.loan?.department) {
            setCurrentDepartment(res?.data?.loan?.department);
          } else {
            const changes = res?.data?.changes;
            if (changes?.basicDetails?.applicationNumber) {
              setCurrentDepartment("PD");
            } else {
              setCurrentDepartment("FI");
            }
          }

          const bankName =
            res?.data?.verification?.bankName ||
            res?.data?.loan?.bankName ||
            "";
          if (bankName) {
            const schema = getSchemaFromBackend(bankName);
            if (schema) setDynamicSchema(schema);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [id, loanid]);

  return (
    <div>
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
    </div>
  );
};

export default EditRequestDetails;
