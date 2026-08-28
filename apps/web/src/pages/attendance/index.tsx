import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Attendance from "@/components/attendance/Attendance";
import dayjs from "dayjs";

export default function AttendancePage() {
  const [dateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  return (
    <DashboardLayout>
      <Attendance dateRange={dateRange} />
    </DashboardLayout>
  );
}