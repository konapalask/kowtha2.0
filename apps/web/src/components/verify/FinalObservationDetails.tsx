import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions } from "antd";
import { createContext, useContext } from "react";


interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const TabContext = createContext<TabContextType>({
  activeTab: 'PermanentAddress',
  setActiveTab: () => {},
});
const useTabContext = () =>useContext(TabContext)

export const FinalObservationsDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  const { activeTab } = useTabContext();
  if (!verificationData) return null;

  const data = verificationData?.verificationData?.verificationData || {};

  return (
    <>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Financial Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("financialDetails")}
              />
            }
          >
            <Descriptions.Item label="Funds Required">
              {data?.financialDetails?.fundsRequired}
            </Descriptions.Item>
            <Descriptions.Item label="Source of Own Funds">
              {data?.financialDetails?.sourceOfOwnFunds}
            </Descriptions.Item>
            <Descriptions.Item label="Purchase Cost">
              {data?.financialDetails?.purchaseCost}
            </Descriptions.Item>
            <Descriptions.Item label="Savings">
              {data?.financialDetails?.savings}
            </Descriptions.Item>
            <Descriptions.Item label="Construction Estimate">
              {data?.financialDetails?.constructionEstimate}
            </Descriptions.Item>
            <Descriptions.Item label="Family/Friends">
              {data?.financialDetails?.familyFriends}
            </Descriptions.Item>
            <Descriptions.Item label="Registration/Stamp Duty Charges">
              {data?.financialDetails?.registrationCharges}
            </Descriptions.Item>
            <Descriptions.Item label="Other Loan Amount Taken">
              {data?.financialDetails?.otherLoanAmount}
            </Descriptions.Item>
            <Descriptions.Item label="Other Expenses">
              {data?.financialDetails?.otherExpenses}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount Spent">
              {data?.financialDetails?.totalAmountSpent}
            </Descriptions.Item>
            <Descriptions.Item label="Total Transaction Cost">
              {data?.financialDetails?.totalTransactionCost}
            </Descriptions.Item>
            <Descriptions.Item label="Mode of Payment to Seller (Cash)">
              {data?.financialDetails?.paymentModeCash}
            </Descriptions.Item>
            <Descriptions.Item label="Mode of Payment to Seller (Cheque)">
              {data?.financialDetails?.paymentModeCheque}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </>
  );
};
