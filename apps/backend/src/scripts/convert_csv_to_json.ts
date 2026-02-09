import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');

/**
 * Converts a CSV file to a JSON file.
 * 
 * Usage: npx ts-node apps/backend/src/scripts/convert_csv_to_json.ts <path-to-csv> [path-to-json]
 */
async function convertCsvToJson(csvFilePath: string, jsonFilePath?: string) {
  const results: any[] = [];

  console.log(csvFilePath);
  
  const absoluteCsvPath = path.isAbsolute(csvFilePath) 
    ? csvFilePath 
    : path.join(process.cwd(), csvFilePath);

  if (!fs.existsSync(absoluteCsvPath)) {
    console.error(`Error: File not found at ${absoluteCsvPath}`);
    process.exit(1);
  }

  const finalJsonPath = jsonFilePath 
    ? (path.isAbsolute(jsonFilePath) ? jsonFilePath : path.join(process.cwd(), jsonFilePath))
    : absoluteCsvPath.replace(/\.csv$/, '.json');

  console.log(`Reading CSV from: ${absoluteCsvPath}`);

  return new Promise((resolve, reject) => {
    fs.createReadStream(absoluteCsvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        try {
          fs.writeFileSync(finalJsonPath, JSON.stringify(results, null, 2));
          console.log(`Successfully converted CSV to JSON!`);
          console.log(`Output saved to: ${finalJsonPath}`);
          console.log(`Total records: ${results.length}`);
          resolve(results);
        } catch (writeError) {
          console.error(`Error writing JSON file:`, writeError);
          reject(writeError);
        }
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file:`, error);
        reject(error);
      });
  });
}

// Configuration - Set your file paths here
const CSV_FILE_PATH = 'src/scripts/pd_users_new.csv';
const JSON_FILE_PATH = 'src/scripts/pd_users_new.json'; // Set to undefined to auto-generate from CSV path

convertCsvToJson(CSV_FILE_PATH, JSON_FILE_PATH).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
