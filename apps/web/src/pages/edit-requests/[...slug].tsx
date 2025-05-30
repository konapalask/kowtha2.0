import EditRequestLogs from "@/components/verify/EditRequestLogs";
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

  useEffect(() => {
    if (id && loanid) {
      getEditRequestsById(id as string)
        .then((res) => {
          setEditRequestData({
            ...res.data?.changes,
            verificationType: res?.data?.verificationType || "PermanentAddress",
          });
        })
        .catch((err) => {
          console.error(err);
        });

      getVerificationData(loanid as string)
        .then((res) => {
          setCurrentData(
            res.data?.verifications?.find(
              (v: any) => v.type === "PermanentAddress"
            )?.verificationData || {}
          );
        })
        .catch((err) => {
          console.error(err);
          message.error("Failed to fetch verification data");
        });
    }
  }, [id, loanid]);

  return (
    <div>
      <EditRequestLogs
        currentData={currentData}
        editRequestData={editRequestData}
      />
    </div>
  );
};

export default EditRequestDetails;
