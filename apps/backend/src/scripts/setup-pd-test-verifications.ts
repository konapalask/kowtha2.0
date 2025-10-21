import {
  PrismaClient,
  Department,
  VerificationType,
  VerificationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function setupPDTestVerifications() {
  console.log("🚀 Setting up PD test verifications...\n");

  try {
    // Step 1: Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { mobile: "8985545588" },
      include: {
        departmentRoles: true,
      },
    });

    if (!adminUser) {
      console.error("❌ Admin user with mobile 8985545588 not found");
      return;
    }

    console.log(`✅ Found admin user: ${adminUser.name} (ID: ${adminUser.id})`);

    // Step 2: Find a PD verifier
    const pdVerifier = await prisma.departmentRole.findFirst({
      where: {
        department: Department.PD,
        role: { in: ["Verifier", "VerificationExecutive"] },
      },
      include: {
        user: true,
      },
    });

    if (!pdVerifier) {
      console.error(
        "❌ No PD verifier found. Please create a verifier user first."
      );
      return;
    }

    console.log(
      `✅ Found PD verifier: ${pdVerifier.user.name} (ID: ${pdVerifier.userId})`
    );

    // Step 3: Find a PD field executive
    const pdFieldExecutive = await prisma.departmentRole.findFirst({
      where: {
        department: Department.PD,
        role: "FieldExecutive",
      },
      include: {
        user: true,
      },
    });

    if (!pdFieldExecutive) {
      console.error(
        "❌ No PD field executive found. Please create a field executive first."
      );
      return;
    }

    console.log(
      `✅ Found PD field executive: ${pdFieldExecutive.user.name} (ID: ${pdFieldExecutive.userId})`
    );

    // Step 4: Find recent PD loans without completed business verifications
    const pdLoans = await prisma.loan.findMany({
      where: {
        department: Department.PD,
      },
      include: {
        verifications: {
          where: {
            type: VerificationType.Business,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    if (pdLoans.length === 0) {
      console.error("❌ No PD loans found. Please create some PD loans first.");
      return;
    }

    console.log(`\n✅ Found ${pdLoans.length} PD loans to setup\n`);

    // Step 5: Setup verifications with test data including array fields
    let setupCount = 0;

    for (const loan of pdLoans) {
      const existingVerification = loan.verifications.find(
        (v) => v.type === VerificationType.Business
      );

      const testVerificationData = {
        basicDetails: {
          applicationNumber: loan.applicationNumber,
          applicantName: loan.applicantName,
          phoneNo: loan.applicantMobile || "9876543210",
          bankName: loan.bankName,
        },
        familyMemberDetails: [
          {
            _id: `family-${loan.id}-1`,
            name: "John Smith",
            relation: "Spouse",
            age: 35,
            occupation: "Teacher",
            mobileNumber: "9876543210",
            stayingWithApplicant: "Yes",
            educationalQualification: "Graduate",
          },
          {
            _id: `family-${loan.id}-2`,
            name: "Jane Smith",
            relation: "Child",
            age: 10,
            occupation: "Student",
            mobileNumber: "",
            stayingWithApplicant: "Yes",
            educationalQualification: "Primary School",
          },
          {
            _id: `family-${loan.id}-3`,
            name: "Bob Smith",
            relation: "Child",
            age: 5,
            occupation: "Student",
            mobileNumber: "",
            stayingWithApplicant: "Yes",
            educationalQualification: "Pre-School",
          },
        ],
        applicantDetails: {
          nameOfApplicant: loan.applicantName,
          contactNo: loan.applicantMobile || "9876543210",
          currentAddress:
            loan.applicantAddress || "Test Address, City - 123456",
        },
        businessDetails: {
          businessName: "Test Business Pvt Ltd",
          natureOfBusiness: "Trading",
          yearsInBusiness: 5,
          businessType: "Proprietorship",
        },
      };

      if (existingVerification) {
        // Update existing verification
        await prisma.verification.update({
          where: { id: existingVerification.id },
          data: {
            status: VerificationStatus.Completed,
            verifierId: pdVerifier.userId,
            fieldExecutiveId: pdFieldExecutive.userId,
            verificationData: testVerificationData,
            department: Department.PD,
          },
        });

        console.log(
          `✅ Updated verification for loan ${loan.applicationNumber} (Verification ID: ${existingVerification.id})`
        );
      } else {
        // Create new verification
        const newVerification = await prisma.verification.create({
          data: {
            loanId: loan.id,
            type: VerificationType.Business,
            status: VerificationStatus.Completed,
            verifierId: pdVerifier.userId,
            fieldExecutiveId: pdFieldExecutive.userId,
            department: Department.PD,
            verificationData: testVerificationData,
            businessName: "Test Business Pvt Ltd",
          },
        });

        console.log(
          `✅ Created new verification for loan ${loan.applicationNumber} (Verification ID: ${newVerification.id})`
        );
      }

      setupCount++;
    }

    console.log(`\n✅ Successfully setup ${setupCount} PD verifications`);
    console.log("\n📋 Test Data Summary:");
    console.log("- Each verification has 3 family members with unique IDs");
    console.log("- Status: Completed (ready for verifier/admin editing)");
    console.log("- Assigned to verifier:", pdVerifier.user.name);
    console.log("\n🧪 Testing Instructions:");
    console.log("1. Login to web app as admin (8985545588)");
    console.log("2. Navigate to /verify page");
    console.log("3. Open any of the setup loans");
    console.log("4. Edit Family Details section");
    console.log("5. Add/modify/remove family members");
    console.log("6. Submit edit request");
    console.log("7. Check /edit-requests to see ArrayDiffDisplay in action!");

    // Show the loans that were setup
    console.log("\n📝 Setup Loans:");
    const setupLoans = await prisma.loan.findMany({
      where: {
        id: { in: pdLoans.map((l) => l.id) },
      },
      include: {
        verifications: {
          where: { type: VerificationType.Business },
          select: {
            id: true,
            status: true,
            verifier: { select: { name: true } },
          },
        },
      },
    });

    setupLoans.forEach((loan, index) => {
      const verification = loan.verifications[0];
      console.log(`\n${index + 1}. Application: ${loan.applicationNumber}`);
      console.log(`   Applicant: ${loan.applicantName}`);
      console.log(`   Bank: ${loan.bankName}`);
      console.log(`   Verification ID: ${verification?.id}`);
      console.log(`   Status: ${verification?.status}`);
      console.log(`   Verifier: ${verification?.verifier?.name}`);
      console.log(`   → Access at: /verify?id=${loan.id}`);
    });
  } catch (error) {
    console.error("❌ Error setting up test data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
setupPDTestVerifications()
  .then(() => {
    console.log(
      "\n✅ Setup complete! You can now test the array tracking features."
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Setup failed:", error);
    process.exit(1);
  });


