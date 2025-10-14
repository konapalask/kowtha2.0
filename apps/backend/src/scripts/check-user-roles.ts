import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUserRoles() {
  console.log("🔍 Checking user roles and permissions...\n");

  try {
    // Check user ID 1 (currently logged in based on JWT)
    const user1 = await prisma.user.findUnique({
      where: { id: 1 },
      include: {
        departmentRoles: {
          include: {
            office: true,
          },
        },
      },
    });

    if (user1) {
      console.log("User ID 1 (Currently Logged In):");
      console.log(`  Name: ${user1.name}`);
      console.log(`  Mobile: ${user1.mobile}`);
      console.log(`  Email: ${user1.email || "N/A"}`);
      console.log(`  Status: ${user1.status}`);
      console.log("  Roles:");
      user1.departmentRoles.forEach((role) => {
        console.log(
          `    - ${role.department}: ${role.role} (Office: ${role.office?.name || "N/A"})`
        );
      });
      console.log("");
    }

    // Check user with mobile 8985545588 (intended admin)
    const adminUser = await prisma.user.findUnique({
      where: { mobile: "8985545588" },
      include: {
        departmentRoles: {
          include: {
            office: true,
          },
        },
      },
    });

    if (adminUser) {
      console.log("Admin User (Mobile: 8985545588):");
      console.log(`  ID: ${adminUser.id}`);
      console.log(`  Name: ${adminUser.name}`);
      console.log(`  Email: ${adminUser.email || "N/A"}`);
      console.log(`  Status: ${adminUser.status}`);
      console.log("  Roles:");
      adminUser.departmentRoles.forEach((role) => {
        console.log(
          `    - ${role.department}: ${role.role} (Office: ${role.office?.name || "N/A"})`
        );
      });
      console.log("");
    }

    // Check if the endpoint requires specific roles
    console.log("📋 Required Permissions for /loans/get-bank-forms:");
    console.log("  - Decorator: @Roles(All)");
    console.log("  - This means: All authenticated users should have access");
    console.log("");

    // Check if user 1 has any roles
    if (user1 && user1.departmentRoles.length === 0) {
      console.log("⚠️  WARNING: User ID 1 has NO department roles!");
      console.log(
        '   This might cause 403 errors even though endpoint allows "All"'
      );
      console.log("   The RolesGuard might be checking for at least one role.");
      console.log("");
    }

    // Provide solution
    if (user1 && adminUser && user1.id !== adminUser.id) {
      console.log("💡 SOLUTION:");
      console.log("");
      console.log("Option 1: Logout and login again with mobile: 8985545588");
      console.log(
        "  This will give you the correct admin user with proper roles."
      );
      console.log("");
      console.log("Option 2: Add roles to current user (ID: 1)");
      console.log("  Run this SQL:");
      console.log(`  
  INSERT INTO "DepartmentRole" ("userId", department, role, "officeId")
  VALUES 
    (1, 'PD', 'Admin', (SELECT id FROM "Office" WHERE department = 'PD' LIMIT 1)),
    (1, 'FI', 'Admin', (SELECT id FROM "Office" WHERE department = 'FI' LIMIT 1))
  ON CONFLICT ("userId", department) DO UPDATE SET role = EXCLUDED.role;
      `);
      console.log("");
    }

    // Check all admins
    const allAdmins = await prisma.departmentRole.findMany({
      where: {
        role: "Admin",
      },
      include: {
        user: true,
        office: true,
      },
    });

    console.log(`📊 All Admin Users (${allAdmins.length}):`);
    allAdmins.forEach((admin, index) => {
      console.log(
        `  ${index + 1}. ${admin.user.name} (Mobile: ${admin.user.mobile}, ID: ${admin.userId})`
      );
      console.log(
        `     Department: ${admin.department}, Office: ${admin.office?.name || "N/A"}`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRoles();


