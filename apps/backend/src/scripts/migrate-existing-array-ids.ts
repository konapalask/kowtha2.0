#!/usr/bin/env ts-node

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

/**
 * Add UUIDs to existing array items in verificationData
 * This script migrates existing data to include _id fields for array items
 */
async function migrateExistingArrayIds() {
  console.log("🚀 Starting migration to add UUIDs to existing array items...");

  try {
    // Get all verifications with verificationData
    const verifications = await prisma.verification.findMany({
      where: {
        verificationData: {
          not: null,
        },
      },
    });

    console.log(
      `📊 Found ${verifications.length} verifications with data to process`
    );

    let processedCount = 0;
    let updatedCount = 0;

    for (const verification of verifications) {
      try {
        const verificationData = verification.verificationData as any;

        if (!verificationData || typeof verificationData !== "object") {
          continue;
        }

        let hasChanges = false;
        const updatedData = { ...verificationData };

        // Process each section in verificationData
        for (const sectionId in updatedData) {
          const sectionData = updatedData[sectionId];

          if (sectionData && typeof sectionData === "object") {
            // Process each field in the section
            for (const fieldId in sectionData) {
              const fieldValue = sectionData[fieldId];

              if (Array.isArray(fieldValue)) {
                // Check if any array item is missing _id
                const needsUpdate = fieldValue.some(
                  (item: any) => item && typeof item === "object" && !item._id
                );

                if (needsUpdate) {
                  // Add _id to items that don't have it
                  sectionData[fieldId] = fieldValue.map((item: any) => {
                    if (item && typeof item === "object" && !item._id) {
                      hasChanges = true;
                      return {
                        ...item,
                        _id: uuidv4(),
                      };
                    }
                    return item;
                  });
                }
              }
            }
          }
        }

        if (hasChanges) {
          // Update the verification with the new data
          await prisma.verification.update({
            where: { id: verification.id },
            data: { verificationData: updatedData },
          });

          updatedCount++;
          console.log(
            `✅ Updated verification ${verification.id} (loan ${verification.loanId})`
          );
        }

        processedCount++;

        // Log progress every 10 items
        if (processedCount % 10 === 0) {
          console.log(
            `📈 Progress: ${processedCount}/${verifications.length} processed, ${updatedCount} updated`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error processing verification ${verification.id}:`,
          error
        );
      }
    }

    console.log(`🎉 Migration completed!`);
    console.log(`📊 Processed: ${processedCount} verifications`);
    console.log(`🔄 Updated: ${updatedCount} verifications`);
    console.log(
      `⏭️  Skipped: ${processedCount - updatedCount} verifications (no changes needed)`
    );
  } catch (error) {
    console.error("💥 Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateExistingArrayIds()
    .then(() => {
      console.log("✅ Migration script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateExistingArrayIds };
