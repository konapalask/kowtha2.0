import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { PrismaService } from "../../src/prisma.service";
import { EditRequestService } from "../../src/modules/edit-request/edit-request.service";
import { ArrayValidationService } from "../../src/modules/loan/services/array-validation.service";
import { LoggingService } from "../../src/modules/common/logging/logging.service";
import { EditRequestStatus, EditRequestType, Department } from "@prisma/client";

describe("Array Change Workflow Integration", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let editRequestService: EditRequestService;
  let arrayValidationService: ArrayValidationService;
  let testLoanId: number;
  let testVerificationId: number;
  let testUserId: number;

  const mockLoggingService = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        EditRequestService,
        ArrayValidationService,
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    editRequestService =
      moduleFixture.get<EditRequestService>(EditRequestService);
    arrayValidationService = moduleFixture.get<ArrayValidationService>(
      ArrayValidationService
    );

    // Create test data
    await setupTestData();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
    await app.close();
  });

  async function setupTestData() {
    // Create test user
    const user = await prismaService.user.create({
      data: {
        mobile: "9999999999",
        name: "Test User",
        email: "test@example.com",
      },
    });
    testUserId = user.id;

    // Create test office
    const office = await prismaService.office.create({
      data: {
        name: "Test Office",
        location: "Test Location",
        address: "Test Address",
        department: Department.PD,
      },
    });

    // Create test loan
    const loan = await prismaService.loan.create({
      data: {
        applicationNumber: "TEST-APP-001",
        applicantName: "Test Applicant",
        applicantMobile: "9999999998",
        loanType: "Personal",
        bankName: "Test Bank",
        loanAmount: 100000,
        status: "Assigned",
        department: Department.PD,
        officeId: office.id,
      },
    });
    testLoanId = loan.id;

    // Create test verification with array data
    const verification = await prismaService.verification.create({
      data: {
        loanId: testLoanId,
        type: "Business",
        department: Department.PD,
        fieldExecutiveId: testUserId,
        status: "Completed",
        verificationData: {
          familyMemberDetails: [
            {
              _id: "family-1",
              name: "John Doe",
              relation: "Spouse",
              age: 30,
              occupation: "Teacher",
            },
            {
              _id: "family-2",
              name: "Jane Doe",
              relation: "Child",
              age: 8,
              occupation: "Student",
            },
          ],
          businessOwnerDetails: [
            {
              _id: "owner-1",
              name: "Test Owner",
              role: "Primary Owner",
              percentage: 100,
            },
          ],
          basicDetails: {
            applicationNumber: "TEST-APP-001",
            applicantName: "Test Applicant",
          },
        },
      },
    });
    testVerificationId = verification.id;
  }

  async function cleanupTestData() {
    // Delete in reverse order of creation
    await prismaService.editRequest.deleteMany({
      where: { loanId: testLoanId },
    });
    await prismaService.verification.deleteMany({
      where: { loanId: testLoanId },
    });
    await prismaService.loan.deleteMany({
      where: { id: testLoanId },
    });
    await prismaService.office.deleteMany({
      where: { name: "Test Office" },
    });
    await prismaService.user.deleteMany({
      where: { id: testUserId },
    });
  }

  describe("End-to-End Array Change Workflow", () => {
    it("should handle complete array edit workflow", async () => {
      // Step 1: Verifier makes changes to array data
      const changedData = {
        familyMemberDetails: [
          {
            _id: "family-1",
            name: "John Smith", // Changed name
            relation: "Spouse",
            age: 31, // Changed age
            occupation: "Teacher",
          },
          {
            _id: "family-2",
            name: "Jane Doe",
            relation: "Child",
            age: 8,
            occupation: "Student",
          },
          {
            _id: "family-3", // New family member
            name: "Bob Doe",
            relation: "Child",
            age: 5,
            occupation: "Student",
          },
        ],
        // Remove businessOwnerDetails (should be detected as removed)
        basicDetails: {
          applicationNumber: "TEST-APP-001",
          applicantName: "Test Applicant Modified", // Changed
        },
      };

      // Step 2: Create edit request
      const editRequest = await editRequestService.createEditRequest(
        testUserId,
        {
          loanId: testLoanId,
          verificationId: testVerificationId,
          changes: changedData,
          type: EditRequestType.LoanData,
          remarks: "Test edit request with array changes",
        }
      );

      expect(editRequest).toBeDefined();
      expect(editRequest.status).toBe(EditRequestStatus.Pending);

      // Check that array changes metadata was generated
      const storedChanges = editRequest.changes as any;
      expect(storedChanges._arrayChangesMetadata).toBeDefined();

      const metadata = storedChanges._arrayChangesMetadata;
      expect(metadata.familyMemberDetails).toBeDefined();
      expect(metadata.familyMemberDetails.summary.added).toBe(1); // New family member
      expect(metadata.familyMemberDetails.summary.modified).toBe(1); // John's changes

      // Step 3: Admin approves the edit request
      const approvedRequest = await editRequestService.updateEditRequest(
        editRequest.id,
        testUserId,
        {
          status: EditRequestStatus.Approved,
          remarks: "Approved array changes",
        }
      );

      expect(approvedRequest.status).toBe(EditRequestStatus.Approved);

      // Step 4: Verify that changes were applied to verification data
      const updatedVerification = await prismaService.verification.findUnique({
        where: { id: testVerificationId },
      });

      expect(updatedVerification).toBeDefined();
      const verificationData = updatedVerification!.verificationData as any;

      // Check family member changes
      expect(verificationData.familyMemberDetails).toHaveLength(3);
      const johnRecord = verificationData.familyMemberDetails.find(
        (f: any) => f._id === "family-1"
      );
      expect(johnRecord.name).toBe("John Smith");
      expect(johnRecord.age).toBe(31);

      const newMember = verificationData.familyMemberDetails.find(
        (f: any) => f._id === "family-3"
      );
      expect(newMember).toBeDefined();
      expect(newMember.name).toBe("Bob Doe");

      // Check that basic details were updated
      expect(verificationData.basicDetails.applicantName).toBe(
        "Test Applicant Modified"
      );

      // Check that array validation passes
      const validationResult =
        arrayValidationService.validateVerificationArrays(verificationData);
      expect(validationResult.isValid).toBe(true);
    });

    it("should reject edit request with invalid array data", async () => {
      const invalidChangedData = {
        familyMemberDetails: [
          {
            // Missing _id - should cause validation error
            name: "Invalid Member",
            relation: "Child",
          },
          {
            _id: "duplicate-id",
            name: "Member 1",
          },
          {
            _id: "duplicate-id", // Duplicate ID
            name: "Member 2",
          },
        ],
      };

      // Should throw validation error
      await expect(
        editRequestService.createEditRequest(testUserId, {
          loanId: testLoanId,
          verificationId: testVerificationId,
          changes: invalidChangedData,
          type: EditRequestType.LoanData,
        })
      ).rejects.toThrow("Invalid array data");
    });

    it("should handle array data auto-fixing during edit request creation", async () => {
      const dataWithMissingIds = {
        familyMemberDetails: [
          {
            // Missing _id - should be auto-generated
            name: "New Member",
            relation: "Child",
            age: 10,
          },
        ],
      };

      const editRequest = await editRequestService.createEditRequest(
        testUserId,
        {
          loanId: testLoanId,
          verificationId: testVerificationId,
          changes: dataWithMissingIds,
          type: EditRequestType.LoanData,
        }
      );

      expect(editRequest).toBeDefined();

      // Check that IDs were auto-generated
      const storedChanges = editRequest.changes as any;
      expect(storedChanges.familyMemberDetails[0]).toHaveProperty("_id");
      expect(typeof storedChanges.familyMemberDetails[0]._id).toBe("string");
    });

    it("should preserve data integrity during approval process", async () => {
      // Get current verification data
      const originalVerification = await prismaService.verification.findUnique({
        where: { id: testVerificationId },
      });
      const originalData = originalVerification!.verificationData as any;

      // Create edit request with minimal changes
      const minimalChanges = {
        basicDetails: {
          ...originalData.basicDetails,
          applicantName: "Minimally Modified Name",
        },
      };

      const editRequest = await editRequestService.createEditRequest(
        testUserId,
        {
          loanId: testLoanId,
          verificationId: testVerificationId,
          changes: minimalChanges,
          type: EditRequestType.LoanData,
        }
      );

      // Approve the request
      await editRequestService.updateEditRequest(editRequest.id, testUserId, {
        status: EditRequestStatus.Approved,
      });

      // Verify that only intended changes were applied
      const updatedVerification = await prismaService.verification.findUnique({
        where: { id: testVerificationId },
      });
      const updatedData = updatedVerification!.verificationData as any;

      // Basic details should be updated
      expect(updatedData.basicDetails.applicantName).toBe(
        "Minimally Modified Name"
      );

      // Array data should be preserved
      expect(updatedData.familyMemberDetails).toEqual(
        originalData.familyMemberDetails
      );
    });

    it("should handle rejection of edit requests without data modification", async () => {
      const testChanges = {
        basicDetails: {
          applicantName: "Should Not Be Applied",
        },
      };

      const editRequest = await editRequestService.createEditRequest(
        testUserId,
        {
          loanId: testLoanId,
          verificationId: testVerificationId,
          changes: testChanges,
          type: EditRequestType.LoanData,
        }
      );

      // Get verification data before rejection
      const beforeRejection = await prismaService.verification.findUnique({
        where: { id: testVerificationId },
      });

      // Reject the request
      await editRequestService.updateEditRequest(editRequest.id, testUserId, {
        status: EditRequestStatus.Rejected,
        remarks: "Changes not approved",
      });

      // Verify that data remains unchanged
      const afterRejection = await prismaService.verification.findUnique({
        where: { id: testVerificationId },
      });

      expect(afterRejection!.verificationData).toEqual(
        beforeRejection!.verificationData
      );
    });
  });

  describe("Array Validation Integration", () => {
    it("should validate complex nested array structures", async () => {
      const complexData = {
        familyMemberDetails: [
          {
            _id: "family-1",
            name: "John Doe",
            relation: "Spouse",
            details: {
              employment: [
                {
                  _id: "emp-1",
                  company: "ABC Corp",
                  position: "Manager",
                },
              ],
            },
          },
        ],
        businessDetails: {
          branches: [
            {
              _id: "branch-1",
              name: "Main Branch",
              employees: [
                {
                  _id: "emp-2",
                  name: "Employee 1",
                  role: "Staff",
                },
              ],
            },
          ],
        },
      };

      const validationResult =
        arrayValidationService.validateVerificationArrays(complexData);
      expect(validationResult.isValid).toBe(true);

      // Test the same data with missing IDs
      const invalidData = JSON.parse(JSON.stringify(complexData));
      delete invalidData.familyMemberDetails[0].details.employment[0]._id;

      const invalidResult =
        arrayValidationService.validateVerificationArrays(invalidData);
      expect(invalidResult.isValid).toBe(false);
    });

    it("should fix complex nested structures", async () => {
      const dataWithMissingIds = {
        familyMemberDetails: [
          {
            name: "John Doe", // Missing _id
            details: {
              employment: [
                {
                  company: "ABC Corp", // Missing _id
                },
              ],
            },
          },
        ],
      };

      const fixedData = arrayValidationService.fixArrayData(dataWithMissingIds);

      expect(fixedData.familyMemberDetails[0]).toHaveProperty("_id");
      expect(
        fixedData.familyMemberDetails[0].details.employment[0]
      ).toHaveProperty("_id");

      // Verify validation passes after fixing
      const validationResult =
        arrayValidationService.validateVerificationArrays(fixedData);
      expect(validationResult.isValid).toBe(true);
    });
  });

  describe("Performance Tests", () => {
    it("should handle large arrays efficiently", async () => {
      // Create large array with 1000 items
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        _id: `item-${i}`,
        name: `Item ${i}`,
        value: i,
      }));

      const startTime = Date.now();

      const validationResult = arrayValidationService.validateArrayData(
        largeArray,
        "largeArray"
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(validationResult.isValid).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it("should handle array changes detection efficiently", async () => {
      const baseArray = Array.from({ length: 500 }, (_, i) => ({
        _id: `item-${i}`,
        name: `Item ${i}`,
        value: i,
      }));

      // Modify some items
      const modifiedArray = baseArray.map((item, index) => {
        if (index % 10 === 0) {
          return { ...item, value: item.value + 1000 };
        }
        return item;
      });

      const startTime = Date.now();

      const changes = arrayValidationService.detectArrayChanges(
        baseArray,
        modifiedArray
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(changes.modified.length).toBe(50); // Every 10th item was modified
      expect(duration).toBeLessThan(500); // Should complete in less than 500ms
    });
  });
});


