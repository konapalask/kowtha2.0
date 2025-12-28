import { PrismaClient, Department, UserRole } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

/**
 * Very simple deployment data loader.
 *
 * Reads JSON files from: src/scripts/deployment/data/
 * Loads:
 * - Organization
 * - Office
 * - User (+ ensures DepartmentRole for FI and sets defaultDepartment = FI)
 * - Loan
 * - Verification
 * - VerificationRetries
 * - Session
 * - Attendance
 * - EditRequest
 * - AppDeployment
 *
 * Run:
 *   npx ts-node src/scripts/deployment/load_data.ts
 */

const prisma = new PrismaClient();

function readRows<T = any>(fileName: string): T[] {
  const filePath = path.join(__dirname, "data", fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed?.rows) ? parsed.rows : [];
}

function toDate(value: any): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function resetSequence(tableName: string, columnName: string = "id") {
  // Works for PostgreSQL SERIAL / IDENTITY sequences.
  // Sets sequence to max(id) so next insert won't collide.
  const sql = `
    SELECT setval(
      pg_get_serial_sequence('"${tableName}"', '${columnName}'),
      COALESCE((SELECT MAX("${columnName}") FROM "${tableName}"), 0),
      true
    )
  `;
  await prisma.$executeRawUnsafe(sql);
}

async function main() {
  // 1) Load Organization + Office first (users reference officeId)
  const organizations = readRows<any>("Organization.json");
  for (const o of organizations) {
    await prisma.organization.upsert({
      where: { id: o.id },
      create: {
        id: o.id,
        name: o.name,
        description: o.description ?? null,
      },
      update: {
        name: o.name,
        description: o.description ?? null,
      },
    });
  }

  const offices = readRows<any>("Office.json");
  for (const o of offices) {
    await prisma.office.upsert({
      where: { id: o.id },
      create: {
        id: o.id,
        name: o.name,
        location: o.location,
        address: o.address,
        archived: Boolean(o.archived),
        organizationId: o.organizationId ?? 1,
        department: Department.FI,
        createdAt: toDate(o.createdAt) ?? undefined,
      },
      update: {
        name: o.name,
        location: o.location,
        address: o.address,
        archived: Boolean(o.archived),
        organizationId: o.organizationId ?? 1,
        department: Department.FI,
      },
    });
  }

  // 2) Load Users and ensure DepartmentRole for FI + defaultDepartment=FI
  const users = readRows<any>("User.json");
  let usersProcessed = 0;

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        mobile: u.mobile,
        name: u.name,
        email: u.email ?? null,
        employeeCode: u.employeeCode ?? null,
        status: u.status ?? undefined,
        deviceId: u.deviceId ?? null,
        locality: u.locality ?? null,
        defaultDepartment: Department.FI,
        createdAt: toDate(u.createdAt) ?? undefined,
      },
      update: {
        mobile: u.mobile,
        name: u.name,
        email: u.email ?? null,
        employeeCode: u.employeeCode ?? null,
        status: u.status ?? undefined,
        deviceId: u.deviceId ?? null,
        locality: u.locality ?? null,
        defaultDepartment: Department.FI,
      },
      select: { id: true },
    });

    // Create/ensure FI department role (userdepartment)
    const role: UserRole = Object.values(UserRole).includes(u.role)
      ? (u.role as UserRole)
      : UserRole.FieldExecutive;

    await prisma.departmentRole.upsert({
      where: {
        userId_department: {
          userId: user.id,
          department: Department.FI,
        },
      },
      create: {
        userId: user.id,
        department: Department.FI,
        role,
        officeId: typeof u.officeId === "number" ? u.officeId : null,
      },
      update: {
        role,
        officeId: typeof u.officeId === "number" ? u.officeId : null,
      },
    });

    usersProcessed++;
  }

  // 3) Load Loans
  const loans = readRows<any>("Loan.json");
  for (const l of loans) {
    await prisma.loan.upsert({
      where: { id: l.id },
      create: {
        id: l.id,
        applicationNumber: l.applicationNumber,
        applicantName: l.applicantName,
        applicantMobile: l.applicantMobile,
        applicantAddress: l.applicantAddress ?? null,
        applicantAddress1: l.applicantAddress1 ?? null,
        applicantAddress2: l.applicantAddress2 ?? null,
        isAddressSame: Boolean(l.isAddressSame),
        department: Department.FI,
        loanType: l.loanType,
        bankName: l.bankName,
        loanAmount: l.loanAmount ?? null,
        status: l.status,
        officeId: l.officeId,
        operationsExecutiveId: l.operationsExecutiveId ?? null,
        createdAt: toDate(l.createdAt) ?? undefined,
        closedAt: toDate(l.closedAt),
        closedById: l.closedById ?? null,
        applicantType: l.applicantType ?? null,
        reassignCount: l.reassignCount ?? 0,
        templateName: l.templateName ?? null,
      },
      update: {
        applicationNumber: l.applicationNumber,
        applicantName: l.applicantName,
        applicantMobile: l.applicantMobile,
        applicantAddress: l.applicantAddress ?? null,
        applicantAddress1: l.applicantAddress1 ?? null,
        applicantAddress2: l.applicantAddress2 ?? null,
        isAddressSame: Boolean(l.isAddressSame),
        department: Department.FI,
        loanType: l.loanType,
        bankName: l.bankName,
        loanAmount: l.loanAmount ?? null,
        status: l.status,
        officeId: l.officeId,
        operationsExecutiveId: l.operationsExecutiveId ?? null,
        closedAt: toDate(l.closedAt),
        closedById: l.closedById ?? null,
        applicantType: l.applicantType ?? null,
        reassignCount: l.reassignCount ?? 0,
        templateName: l.templateName ?? null,
      },
    });
  }

  // 4) Load Verifications
  const verifications = readRows<any>("Verification.json");
  for (const v of verifications) {
    await prisma.verification.upsert({
      where: { id: v.id },
      create: {
        id: v.id,
        loanId: v.loanId,
        type: v.type,
        fieldExecutiveId: v.fieldExecutiveId,
        status: v.status,
        applicantAddress: v.applicantAddress ?? null,
        verificationData: v.verificationData ?? null,
        pictureSource: v.pictureSource ?? null,
        createdAt: toDate(v.createdAt) ?? undefined,
        addressType: v.addressType ?? null,
        path: v.path ?? null,
        approvedStatus: v.approvedStatus ?? null,
        finalReportPath: v.finalReportPath ?? null,
        locationType: v.locationType ?? null,
        verifierId: v.verifierId ?? null,
        businessName: v.businessName ?? null,
        isPostponed: v.isPostponed ?? null,
        initialSubmitted: v.initialSubmitted ?? null,
        postponedDate: toDate(v.postponedDate),
        postponedReason: v.postponedReason ?? null,
        currentOfficeName: v.currentOfficeName ?? null,
        department: Department.FI,
        financialAnalysis: v.financialAnalysis ?? null,
        synopsis: v.synopsis ?? null,
        templateName: v.templateName ?? null,
      },
      update: {
        loanId: v.loanId,
        type: v.type,
        fieldExecutiveId: v.fieldExecutiveId,
        status: v.status,
        applicantAddress: v.applicantAddress ?? null,
        verificationData: v.verificationData ?? null,
        pictureSource: v.pictureSource ?? null,
        addressType: v.addressType ?? null,
        path: v.path ?? null,
        approvedStatus: v.approvedStatus ?? null,
        finalReportPath: v.finalReportPath ?? null,
        locationType: v.locationType ?? null,
        verifierId: v.verifierId ?? null,
        businessName: v.businessName ?? null,
        isPostponed: v.isPostponed ?? null,
        initialSubmitted: v.initialSubmitted ?? null,
        postponedDate: toDate(v.postponedDate),
        postponedReason: v.postponedReason ?? null,
        currentOfficeName: v.currentOfficeName ?? null,
        department: Department.FI,
        financialAnalysis: v.financialAnalysis ?? null,
        synopsis: v.synopsis ?? null,
        templateName: v.templateName ?? null,
      },
    });
  }

  // 5) Load VerificationRetries
  const verificationRetries = readRows<any>("VerificationRetries.json");
  for (const r of verificationRetries) {
    await prisma.verificationRetries.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        verificationId: r.verificationId,
        date: toDate(r.date) ?? undefined,
        geotag: r.geotag ?? null,
        address: r.address ?? null,
        reason: r.reason ?? null,
        fieldExecutiveId: r.fieldExecutiveId,
        createdAt: toDate(r.createdAt) ?? undefined,
      },
      update: {
        verificationId: r.verificationId,
        date: toDate(r.date) ?? undefined,
        geotag: r.geotag ?? null,
        address: r.address ?? null,
        reason: r.reason ?? null,
        fieldExecutiveId: r.fieldExecutiveId,
      },
    });
  }

  // 6) Load Sessions
  const sessions = readRows<any>("Session.json");
  for (const s of sessions) {
    await prisma.session.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        userId: s.userId,
        otp: s.otp ?? null,
        otpExpires: toDate(s.otpExpires),
        createdAt: toDate(s.createdAt) ?? undefined,
        lastLoginAt: toDate(s.lastLoginAt),
        isActive: Boolean(s.isActive),
      },
      update: {
        userId: s.userId,
        otp: s.otp ?? null,
        otpExpires: toDate(s.otpExpires),
        lastLoginAt: toDate(s.lastLoginAt),
        isActive: Boolean(s.isActive),
      },
    });
  }

  // 7) Load Attendance
  const attendance = readRows<any>("Attendance.json");
  for (const a of attendance) {
    await prisma.attendance.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        userId: a.userId,
        date: toDate(a.date) ?? undefined,
        status: a.status,
        department: Department.FI,
        createdAt: toDate(a.createdAt) ?? undefined,
      },
      update: {
        userId: a.userId,
        date: toDate(a.date) ?? undefined,
        status: a.status,
        department: Department.FI,
      },
    });
  }

  // 8) Load EditRequests
  const editRequests = readRows<any>("EditRequest.json");
  for (const e of editRequests) {
    if (!e.requestedBy) continue; // required in schema
    await prisma.editRequest.upsert({
      where: { id: e.id },
      create: {
        id: e.id,
        loanId: e.loanId ?? null,
        verificationId: e.verificationId ?? null,
        requestedBy: e.requestedBy,
        approvedBy: e.approvedBy ?? null,
        status: e.status,
        changes: e.changes ?? {},
        remarks: e.remarks ?? null,
        createdAt: toDate(e.createdAt) ?? undefined,
        type: e.type ?? null,
        department: Department.FI,
      },
      update: {
        loanId: e.loanId ?? null,
        verificationId: e.verificationId ?? null,
        requestedBy: e.requestedBy,
        approvedBy: e.approvedBy ?? null,
        status: e.status,
        changes: e.changes ?? {},
        remarks: e.remarks ?? null,
        type: e.type ?? null,
        department: Department.FI,
      },
    });
  }

  // 9) Load AppDeployments
  const appDeployments = readRows<any>("AppDeployment.json");
  for (const d of appDeployments) {
    await prisma.appDeployment.upsert({
      where: { id: d.id },
      create: {
        id: d.id,
        version: d.version,
        isActive: Boolean(d.isActive),
        source: d.source,
        forceUpdate: Boolean(d.forceUpdate),
        appStoreUrl: d.appStoreUrl ?? null,
        playStoreUrl: d.playStoreUrl ?? null,
        description: d.description ?? null,
        createdAt: toDate(d.createdAt) ?? undefined,
      },
      update: {
        version: d.version,
        isActive: Boolean(d.isActive),
        source: d.source,
        forceUpdate: Boolean(d.forceUpdate),
        appStoreUrl: d.appStoreUrl ?? null,
        playStoreUrl: d.playStoreUrl ?? null,
        description: d.description ?? null,
      },
    });
  }

  // 10) Reset sequences (prevents "duplicate key value violates unique constraint" on id)
  await resetSequence("Organization");
  await resetSequence("Office");
  await resetSequence("User");
  await resetSequence("DepartmentRole");
  await resetSequence("Loan");
  await resetSequence("Verification");
  await resetSequence("VerificationRetries");
  await resetSequence("Session");
  await resetSequence("Attendance");
  await resetSequence("EditRequest");
  await resetSequence("AppDeployment");

  // eslint-disable-next-line no-console
  console.log(
    `Loaded: organizations=${organizations.length}, offices=${offices.length}, users=${usersProcessed}, loans=${loans.length}, verifications=${verifications.length}, verificationRetries=${verificationRetries.length}, sessions=${sessions.length}, attendance=${attendance.length}, editRequests=${editRequests.length}, appDeployments=${appDeployments.length}`
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("load_data failed:", e?.message || e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

