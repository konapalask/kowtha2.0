import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Function to generate a secure, readable random password
function generateSecureRandomPassword(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const smallLetters = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '@#$%=';

  const getRandomChar = (str: string) => str[crypto.randomInt(0, str.length)];

  // Pattern: Kwt + Symbol + 2 Small + 2 Numbers + 2 Capital
  const part1 = 'Kwt';
  const part2 = getRandomChar(symbols);
  const part3 = getRandomChar(smallLetters) + getRandomChar(smallLetters);
  const part4 = getRandomChar(numbers) + getRandomChar(numbers);
  const part5 = getRandomChar(letters) + getRandomChar(letters);

  return `${part1}${part2}${part3}${part4}${part5}`;
}

async function main() {
  console.log('🚀 Starting Comprehensive Random Password Generation & Excel Export...\n');

  let userList: Array<{
    id?: number | string;
    name: string;
    mobile: string;
    email?: string;
    employeeCode?: string;
    roles?: string;
    status?: string;
  }> = [];

  let dbConnected = false;

  try {
    const dbUsers = await prisma.user.findMany({
      include: {
        departmentRoles: {
          include: {
            office: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (dbUsers.length > 0) {
      dbConnected = true;
      userList = dbUsers.map((u) => ({
        id: u.id,
        name: u.name || 'N/A',
        mobile: u.mobile,
        email: u.email || 'N/A',
        employeeCode: u.employeeCode || 'N/A',
        roles:
          u.departmentRoles && u.departmentRoles.length > 0
            ? u.departmentRoles
                .map(
                  (dr) =>
                    `${dr.department} (${dr.role}${dr.office?.name ? ` - ${dr.office.name}` : ''})`
                )
                .join('; ')
            : 'None Assigned',
        status: u.status,
      }));
      console.log(`📋 Found ${userList.length} users in active database.`);
    }
  } catch (dbError) {
    console.warn('⚠️ Could not connect to local DB directly. Merging ALL data sources (User.json, output.json, pd_users_new.json)...');
    
    const userMap = new Map<string, any>();

    // 1. Load Main User table dump from deployment data
    const userDumpPath = path.resolve(__dirname, 'deployment/data/User.json');
    if (fs.existsSync(userDumpPath)) {
      const raw = fs.readFileSync(userDumpPath, 'utf8');
      const parsed = JSON.parse(raw);
      const rows = parsed.rows || [];
      rows.forEach((u: any) => {
        const mob = String(u.mobile || '').trim();
        if (mob) {
          userMap.set(mob, {
            name: u.name || 'N/A',
            mobile: mob,
            email: u.email || 'N/A',
            employeeCode: u.employeeCode || 'N/A',
            roles: `${u.role || 'Staff'}${u.locality ? ` - ${u.locality}` : ''}`,
            status: u.status || 'Active',
          });
        }
      });
      console.log(`  Loaded ${userMap.size} users from User.json dump.`);
    }

    // 2. Load FI & General Staff from output.json
    const outputJsonPath = path.resolve(__dirname, 'output.json');
    if (fs.existsSync(outputJsonPath)) {
      const raw = fs.readFileSync(outputJsonPath, 'utf8');
      const list = JSON.parse(raw);
      list.forEach((u: any) => {
        const mob = String(u['Mobile Number'] || '').trim();
        if (mob) {
          const existing = userMap.get(mob);
          const fiRole = `FI (${u['Designation'] || 'Field Executive'} - ${u['Location'] || ''})`;
          if (existing) {
            if (!existing.roles.includes('FI')) {
              existing.roles = `${existing.roles}; ${fiRole}`;
            }
            if (existing.email === 'N/A' && u['Mail ID']) existing.email = u['Mail ID'];
            if (existing.employeeCode === 'N/A' && u['Employee ID NO']) existing.employeeCode = u['Employee ID NO'];
          } else {
            userMap.set(mob, {
              name: u['Name of the Employee'] || 'N/A',
              mobile: mob,
              email: u['Mail ID'] || 'N/A',
              employeeCode: u['Employee ID NO'] || 'N/A',
              roles: fiRole,
              status: 'Active',
            });
          }
        }
      });
      console.log(`  Total users after merging output.json: ${userMap.size}`);
    }

    // 3. Load PD Staff from pd_users_new.json
    const pdJsonPath = path.resolve(__dirname, 'pd_users_new.json');
    if (fs.existsSync(pdJsonPath)) {
      const raw = fs.readFileSync(pdJsonPath, 'utf8');
      const list = JSON.parse(raw);
      list.forEach((u: any) => {
        const mob = String(u['Mobile Number'] || '').trim();
        if (mob) {
          const existing = userMap.get(mob);
          const pdRole = `PD (${u['Role'] || 'Staff'} - ${u['Location'] || ''})`;
          if (existing) {
            if (!existing.roles.includes('PD')) {
              existing.roles = `${existing.roles}; ${pdRole}`;
            }
            if (existing.email === 'N/A' && u['Mail ID']) existing.email = u['Mail ID'];
            if (existing.employeeCode === 'N/A' && u['Employee ID NO']) existing.employeeCode = u['Employee ID NO'];
          } else {
            userMap.set(mob, {
              name: u['Name of the Employee'] || 'N/A',
              mobile: mob,
              email: u['Mail ID'] || 'N/A',
              employeeCode: u['Employee ID NO'] || 'N/A',
              roles: pdRole,
              status: 'Active',
            });
          }
        }
      });
      console.log(`  Total users after merging pd_users_new.json: ${userMap.size}`);
    }

    // 4. Load from pd_users_list.csv if present
    const pdCsvPath = path.resolve(__dirname, 'pd_users_list.csv');
    if (fs.existsSync(pdCsvPath)) {
      const content = fs.readFileSync(pdCsvPath, 'utf8');
      const lines = content.split('\n');
      lines.slice(1).forEach((line) => {
        const parts = line.split(',');
        if (parts.length >= 4) {
          const mob = parts[3]?.trim();
          if (mob && /^\d{10}$/.test(mob)) {
            if (!userMap.has(mob)) {
              userMap.set(mob, {
                name: parts[1]?.trim() || 'N/A',
                mobile: mob,
                email: parts[4]?.trim() || 'N/A',
                employeeCode: parts[0]?.trim() || 'N/A',
                roles: `PD (${parts[6]?.trim() || 'Staff'} - ${parts[2]?.trim() || ''})`,
                status: 'Active',
              });
            }
          }
        }
      });
    }

    let idCounter = 1;
    userList = Array.from(userMap.values()).map((u) => ({
      id: idCounter++,
      ...u,
    }));

    console.log(`📋 Total unique organization users consolidated: ${userList.length}`);
  }

  if (userList.length === 0) {
    console.error('❌ No user data found to generate passwords for.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kowtha Loan Verification Platform';
  workbook.lastModifiedBy = 'Kowtha Admin';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('All User Credentials', {
    views: [{ showGridLines: true }],
  });

  // Define Columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Employee Name', key: 'name', width: 28 },
    { header: 'Mobile (Primary Login ID)', key: 'mobile', width: 24 },
    { header: 'Email (Alternative Login)', key: 'email', width: 30 },
    { header: 'Employee Code', key: 'employeeCode', width: 18 },
    { header: 'Department & Role', key: 'roles', width: 44 },
    { header: 'Generated Initial Password', key: 'password', width: 26 },
    { header: 'Password Status', key: 'passwordStatus', width: 30 },
    { header: 'Account Status', key: 'accountStatus', width: 16 },
  ];

  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  headerRow.font = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' },
  };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00396E' }, // Brand navy
  };
  headerRow.alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };

  const sqlStatements: string[] = [];

  for (let i = 0; i < userList.length; i++) {
    const user = userList[i];
    const randomPassword = generateSecureRandomPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    if (dbConnected && typeof user.id === 'number') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          isPasswordChanged: false,
        },
      });
    }

    sqlStatements.push(
      `UPDATE "User" SET "password" = '${hashedPassword}', "isPasswordChanged" = false WHERE "mobile" = '${user.mobile}';`
    );

    const row = worksheet.addRow({
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      employeeCode: user.employeeCode,
      roles: user.roles,
      password: randomPassword,
      passwordStatus: 'Temporary (Change on 1st Login)',
      accountStatus: user.status || 'Active',
    });

    row.height = 22;
    row.alignment = { vertical: 'middle' };

    // Highlight password column with amber badge style
    const passwordCell = row.getCell('password');
    passwordCell.font = {
      name: 'Courier New',
      size: 11,
      bold: true,
      color: { argb: 'FFB45309' },
    };
    passwordCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFEF3C7' },
    };
    passwordCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    // Alternating zebra row striping
    if (i % 2 === 1) {
      row.eachCell((cell, colNumber) => {
        if (colNumber !== 7) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' },
          };
        }
      });
    }

    // Cell Borders
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  }

  const rootPath = path.resolve(__dirname, '../../../../kowtha_user_passwords.xlsx');
  const backendPath = path.resolve(__dirname, '../../kowtha_user_passwords.xlsx');
  const sqlPath = path.resolve(__dirname, '../../set_passwords.sql');

  await workbook.xlsx.writeFile(rootPath);
  await workbook.xlsx.writeFile(backendPath);
  fs.writeFileSync(sqlPath, sqlStatements.join('\n'), 'utf8');

  console.log(`\n🎉 SUCCESS! Generated random passwords for ALL ${userList.length} organization users.`);
  console.log(`📁 Files generated:`);
  console.log(`   1. Excel File: ${rootPath}`);
  console.log(`   2. Excel File: ${backendPath}`);
  console.log(`   3. SQL Updates: ${sqlPath}\n`);

  if (dbConnected) {
    console.log('✅ Database updated directly with password hashes!');
  } else {
    console.log(`ℹ️ Generated Excel & SQL migration file for all ${userList.length} users.`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in script:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
