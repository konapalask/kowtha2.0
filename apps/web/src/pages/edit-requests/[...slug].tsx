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
  // const [currentData, setCurrentData] = useState<any>({});

  useEffect(() => {
    if (id && loanid) {
      getEditRequestsById(id as string)
        .then((res) => {
          // console.log(res?.data)
          setEditRequestData(res?.data)
          // setEditRequestData({
          //   ...res.data?.changes,
          //   verificationType: res?.data?.verificationType || "PermanentAddress",
          // });
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
        currentData={editRequestData?.verification?.verificationData}
        changedData={editRequestData?.changes}
        fetchEditRequests={()=>{}}
        disabled={false}
        admin={true}
        verificationId={id as string}
      />
    </div>
  );
};

export default EditRequestDetails;
