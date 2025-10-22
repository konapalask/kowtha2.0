-- Setup PD Test Data for Array Tracking Testing
-- This script sets up PD loans with verifications that can be tested by admin

-- Step 1: Find or verify the admin user (mobile: 8985545588)
SELECT id, mobile, name, email 
FROM "User" 
WHERE mobile = '8985545588';

-- Step 2: Find PD verifiers
SELECT id, mobile, name, email 
FROM "User" u
JOIN "DepartmentRole" dr ON u.id = dr."userId"
WHERE dr.department = 'PD' AND dr.role IN ('Verifier', 'VerificationExecutive')
LIMIT 5;

-- Step 3: Find PD field executives
SELECT id, mobile, name, email 
FROM "User" u
JOIN "DepartmentRole" dr ON u.id = dr."userId"
WHERE dr.department = 'PD' AND dr.role = 'FieldExecutive'
LIMIT 5;

-- Step 4: Find recent PD loans with Business verification type
SELECT 
  l.id as loan_id,
  l."applicationNumber",
  l."applicantName",
  l."bankName",
  l.department,
  v.id as verification_id,
  v.type as verification_type,
  v.status,
  v."verifierId",
  v."fieldExecutiveId"
FROM "Loan" l
LEFT JOIN "Verification" v ON l.id = v."loanId" AND v.type = 'Business'
WHERE l.department = 'PD'
ORDER BY l."createdAt" DESC
LIMIT 10;

-- Step 5: Sample update query to set verification to Completed status
-- Replace {verification_id} and {verifier_id} with actual values from Step 2 and Step 4
/*
UPDATE "Verification"
SET 
  status = 'Completed',
  "verifierId" = {verifier_id},
  "verificationData" = jsonb_set(
    COALESCE("verificationData", '{}'::jsonb),
    '{familyMemberDetails}',
    '[
      {
        "_id": "test-family-1",
        "name": "John Doe",
        "relation": "Spouse",
        "age": 30,
        "occupation": "Teacher",
        "mobileNumber": "9876543210",
        "stayingWithApplicant": "Yes",
        "educationalQualification": "Graduate"
      },
      {
        "_id": "test-family-2",
        "name": "Jane Doe",
        "relation": "Child",
        "age": 8,
        "occupation": "Student",
        "mobileNumber": "",
        "stayingWithApplicant": "Yes",
        "educationalQualification": "Primary"
      }
    ]'::jsonb
  ),
  "verificationData" = jsonb_set(
    "verificationData",
    '{basicDetails}',
    '{
      "applicationNumber": "TEST-APP-001",
      "applicantName": "Test Applicant",
      "phoneNo": "9876543210"
    }'::jsonb
  )
WHERE id = {verification_id};
*/

-- Step 6: Grant admin access to view verifications
-- Admins can view all verifications, no specific setup needed

-- Step 7: Verify the setup
SELECT 
  l.id as loan_id,
  l."applicationNumber",
  l."applicantName",
  l."bankName",
  v.id as verification_id,
  v.status,
  v."verificationData"->>'basicDetails' as basic_details,
  v."verificationData"->>'familyMemberDetails' as family_members,
  u_verifier.name as verifier_name,
  u_fe.name as field_executive_name
FROM "Loan" l
JOIN "Verification" v ON l.id = v."loanId"
LEFT JOIN "User" u_verifier ON v."verifierId" = u_verifier.id
JOIN "User" u_fe ON v."fieldExecutiveId" = u_fe.id
WHERE 
  l.department = 'PD' 
  AND v.type = 'Business'
  AND v.status = 'Completed'
  AND v."verificationData" IS NOT NULL
ORDER BY l."createdAt" DESC
LIMIT 5;




