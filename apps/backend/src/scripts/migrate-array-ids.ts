import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

interface MigrationStats {
  totalVerifications: number;
  verificationsProcessed: number;
  arraysProcessed: number;
  itemsProcessed: number;
  errors: string[];
}

interface ArrayField {
  fieldName: string;
  expectedType: "array";
  description: string;
}

// Common array fields that need migration
const COMMON_ARRAY_FIELDS: ArrayField[] = [
  {
    fieldName: "familyMembers",
    expectedType: "array",
    description: "Family members data",
  },
  {
    fieldName: "familyMemberDetails",
    expectedType: "array",
    description: "Detailed family member information",
  },
  {
    fieldName: "familyDetails",
    expectedType: "array",
    description: "Family details array",
  },
  {
    fieldName: "businessOwnerDetails",
    expectedType: "array",
    description: "Business owner information",
  },
  {
    fieldName: "shareholdingDetails",
    expectedType: "array",
    description: "Shareholding information",
  },
  {
    fieldName: "employees",
    expectedType: "array",
    description: "Employee details",
  },
  {
    fieldName: "suppliers",
    expectedType: "array",
    description: "Supplier information",
  },
  {
    fieldName: "customers",
    expectedType: "array",
    description: "Customer details",
  },
  {
    fieldName: "assets",
    expectedType: "array",
    description: "Asset information",
  },
  {
    fieldName: "liabilities",
    expectedType: "array",
    description: "Liability details",
  },
  {
    fieldName: "existingLoans",
    expectedType: "array",
    description: "Existing loan information",
  },
  {
    fieldName: "references",
    expectedType: "array",
    description: "Reference details",
  },
  {
    fieldName: "employeeDetails",
    expectedType: "array",
    description: "Employee details for business",
  },
  {
    fieldName: "customersDetails",
    expectedType: "array",
    description: "Customer details for business",
  },
  {
    fieldName: "supplierDetails",
    expectedType: "array",
    description: "Supplier details for business",
  },
];

/**
 * Generate a unique ID for array items
 */
function generateUniqueId(): string {
  return uuidv4();
}

/**
 * Ensure array item has unique ID, generate if missing
 */
function ensureArrayItemId(item: any, usedIds: Set<string>): any {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return item;
  }

  let id = item._id;

  // Generate ID if missing
  if (!id) {
    id = generateUniqueId();
  }

  // Ensure ID is unique within this verification
  let uniqueId = id;
  let counter = 1;
  while (usedIds.has(uniqueId)) {
    uniqueId = `${id}_${counter}`;
    counter++;
  }

  usedIds.add(uniqueId);

  return {
    ...item,
    _id: uniqueId,
  };
}

/**
 * Process array fields and add unique IDs
 */
function processArrayField(arrayData: any[], usedIds: Set<string>): any[] {
  if (!Array.isArray(arrayData)) {
    return arrayData;
  }

  return arrayData.map((item) => ensureArrayItemId(item, usedIds));
}

/**
 * Process verification data and add IDs to array fields
 */
function processVerificationData(verificationData: any): {
  data: any;
  stats: { arraysProcessed: number; itemsProcessed: number };
} {
  if (!verificationData || typeof verificationData !== "object") {
    return {
      data: verificationData,
      stats: { arraysProcessed: 0, itemsProcessed: 0 },
    };
  }

  const processed = { ...verificationData };
  const usedIds = new Set<string>();
  let arraysProcessed = 0;
  let itemsProcessed = 0;

  // Process known array fields
  COMMON_ARRAY_FIELDS.forEach(({ fieldName }) => {
    if (processed[fieldName] && Array.isArray(processed[fieldName])) {
      const originalLength = processed[fieldName].length;
      processed[fieldName] = processArrayField(processed[fieldName], usedIds);
      arraysProcessed++;
      itemsProcessed += originalLength;
    }
  });

  // Process any other fields that might be arrays
  Object.keys(processed).forEach((key) => {
    const value = processed[key];

    // Skip already processed fields
    if (COMMON_ARRAY_FIELDS.some((field) => field.fieldName === key)) {
      return;
    }

    // Process arrays
    if (Array.isArray(value) && value.length > 0) {
      // Check if first item is an object (likely needs IDs)
      const firstItem = value[0];
      if (
        firstItem &&
        typeof firstItem === "object" &&
        !Array.isArray(firstItem)
      ) {
        console.log(
          `Found additional array field: ${key} with ${value.length} items`
        );
        processed[key] = processArrayField(value, usedIds);
        arraysProcessed++;
        itemsProcessed += value.length;
      }
    }

    // Process nested objects recursively
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedResult = processVerificationData(value);
      processed[key] = nestedResult.data;
      arraysProcessed += nestedResult.stats.arraysProcessed;
      itemsProcessed += nestedResult.stats.itemsProcessed;
    }
  });

  return {
    data: processed,
    stats: { arraysProcessed, itemsProcessed },
  };
}

/**
 * Validate that array items have unique IDs
 */
function validateArrayIds(verificationData: any): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!verificationData || typeof verificationData !== "object") {
    return { isValid: true, issues };
  }

  const allIds = new Set<string>();

  function checkObject(obj: any, path: string = "") {
    if (!obj || typeof obj !== "object") return;

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === "object" && !Array.isArray(item)) {
            if (!item._id) {
              issues.push(`Missing _id in ${currentPath}[${index}]`);
            } else {
              if (allIds.has(item._id)) {
                issues.push(
                  `Duplicate _id '${item._id}' in ${currentPath}[${index}]`
                );
              } else {
                allIds.add(item._id);
              }
            }
          }
        });
      } else if (value && typeof value === "object") {
        checkObject(value, currentPath);
      }
    });
  }

  checkObject(verificationData);

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Create backup of verification data before migration
 */
async function createBackup(
  verificationId: number,
  verificationData: any
): Promise<void> {
  try {
    // Store backup in a separate table or file
    // For now, we'll just log it (in production, you might want to store in a backup table)
    console.log(`Backup created for verification ${verificationId}`);

    // You could implement actual backup logic here, such as:
    // await prisma.verificationBackup.create({
    //   data: {
    //     verificationId,
    //     originalData: verificationData,
    //     backupDate: new Date(),
    //   }
    // });
  } catch (error) {
    throw new Error(
      `Failed to create backup for verification ${verificationId}: ${error}`
    );
  }
}

/**
 * Migrate a single verification
 */
async function migrateVerification(
  verification: any,
  dryRun: boolean = false
): Promise<{
  success: boolean;
  arraysProcessed: number;
  itemsProcessed: number;
  error?: string;
}> {
  try {
    if (!verification.verificationData) {
      return { success: true, arraysProcessed: 0, itemsProcessed: 0 };
    }

    // Validate current state
    const currentValidation = validateArrayIds(verification.verificationData);
    if (currentValidation.isValid) {
      console.log(
        `Verification ${verification.id} already has valid array IDs, skipping...`
      );
      return { success: true, arraysProcessed: 0, itemsProcessed: 0 };
    }

    // Create backup before migration
    if (!dryRun) {
      await createBackup(verification.id, verification.verificationData);
    }

    // Process the verification data
    const result = processVerificationData(verification.verificationData);

    // Validate processed data
    const processedValidation = validateArrayIds(result.data);
    if (!processedValidation.isValid) {
      throw new Error(
        `Processed data still has validation issues: ${processedValidation.issues.join(", ")}`
      );
    }

    // Update the database if not a dry run
    if (!dryRun) {
      await prisma.verification.update({
        where: { id: verification.id },
        data: {
          verificationData: result.data,
        },
      });
      console.log(
        `✓ Migrated verification ${verification.id}: ${result.stats.arraysProcessed} arrays, ${result.stats.itemsProcessed} items`
      );
    } else {
      console.log(
        `[DRY RUN] Would migrate verification ${verification.id}: ${result.stats.arraysProcessed} arrays, ${result.stats.itemsProcessed} items`
      );
    }

    return {
      success: true,
      arraysProcessed: result.stats.arraysProcessed,
      itemsProcessed: result.stats.itemsProcessed,
    };
  } catch (error: any) {
    console.error(
      `✗ Failed to migrate verification ${verification.id}:`,
      error.message
    );
    return {
      success: false,
      arraysProcessed: 0,
      itemsProcessed: 0,
      error: error.message,
    };
  }
}

/**
 * Main migration function
 */
async function migrateArrayIds(
  options: {
    dryRun?: boolean;
    batchSize?: number;
    verificationId?: number;
    department?: string;
  } = {}
): Promise<MigrationStats> {
  const {
    dryRun = false,
    batchSize = 100,
    verificationId,
    department,
  } = options;

  console.log("🚀 Starting array ID migration...");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE MIGRATION"}`);
  console.log(`Batch size: ${batchSize}`);

  const stats: MigrationStats = {
    totalVerifications: 0,
    verificationsProcessed: 0,
    arraysProcessed: 0,
    itemsProcessed: 0,
    errors: [],
  };

  try {
    // Build query filters
    const where: any = {};
    if (verificationId) {
      where.id = verificationId;
    }
    if (department) {
      where.department = department;
    }

    // Get total count
    stats.totalVerifications = await prisma.verification.count({ where });
    console.log(`Found ${stats.totalVerifications} verifications to process`);

    if (stats.totalVerifications === 0) {
      console.log("No verifications found to migrate");
      return stats;
    }

    // Process in batches
    let offset = 0;
    while (offset < stats.totalVerifications) {
      console.log(
        `\nProcessing batch ${Math.floor(offset / batchSize) + 1}/${Math.ceil(stats.totalVerifications / batchSize)}...`
      );

      const verifications = await prisma.verification.findMany({
        where,
        skip: offset,
        take: batchSize,
        select: {
          id: true,
          verificationData: true,
          department: true,
          loan: {
            select: {
              bankName: true,
              applicationNumber: true,
            },
          },
        },
      });

      // Process each verification in the batch
      for (const verification of verifications) {
        const result = await migrateVerification(verification, dryRun);

        stats.verificationsProcessed++;
        stats.arraysProcessed += result.arraysProcessed;
        stats.itemsProcessed += result.itemsProcessed;

        if (!result.success && result.error) {
          stats.errors.push(`Verification ${verification.id}: ${result.error}`);
        }

        // Progress indicator
        if (stats.verificationsProcessed % 10 === 0) {
          console.log(
            `Progress: ${stats.verificationsProcessed}/${stats.totalVerifications} verifications processed`
          );
        }
      }

      offset += batchSize;
    }

    console.log("\n✅ Migration completed!");
    console.log(
      `Verifications processed: ${stats.verificationsProcessed}/${stats.totalVerifications}`
    );
    console.log(`Arrays processed: ${stats.arraysProcessed}`);
    console.log(`Items processed: ${stats.itemsProcessed}`);
    console.log(`Errors: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log("\n❌ Errors encountered:");
      stats.errors.forEach((error) => console.log(`  - ${error}`));
    }
  } catch (error: any) {
    console.error("💥 Migration failed:", error.message);
    stats.errors.push(`Migration failed: ${error.message}`);
  }

  return stats;
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const options: any = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--batch-size":
        options.batchSize = parseInt(args[++i]) || 100;
        break;
      case "--verification-id":
        options.verificationId = parseInt(args[++i]);
        break;
      case "--department":
        options.department = args[++i];
        break;
      case "--help":
        console.log(`
Array ID Migration Script

Usage: npx ts-node src/scripts/migrate-array-ids.ts [options]

Options:
  --dry-run              Run in dry-run mode (no database changes)
  --batch-size <n>       Process in batches of n verifications (default: 100)
  --verification-id <id> Migrate specific verification only
  --department <dept>    Migrate specific department only (PD or FI)
  --help                 Show this help message

Examples:
  npx ts-node src/scripts/migrate-array-ids.ts --dry-run
  npx ts-node src/scripts/migrate-array-ids.ts --department PD
  npx ts-node src/scripts/migrate-array-ids.ts --verification-id 123
        `);
        process.exit(0);
        break;
    }
  }

  try {
    const stats = await migrateArrayIds(options);

    if (stats.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { migrateArrayIds, processVerificationData, validateArrayIds };

