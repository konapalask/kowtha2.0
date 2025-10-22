/**
 * QA Data Generator for PDF Template Testing
 * Ported from mobile app's dummyPDData.ts and mockDataGenerator.ts
 */

// Simple mock faker implementation for the script
// We'll use a mock implementation to avoid dependency issues
const firstNames = ["Raj", "Priya", "Amit", "Sunita", "Vikram", "Kavya"];
const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Agarwal"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana"];
const businessTypes = ["Solutions", "Enterprises", "Corp", "Ltd"];
const businessPrefixes = ["Tech", "Global", "Smart", "Modern", "Elite"];

const faker = {
  person: {
    firstName: () => firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: () => lastNames[Math.floor(Math.random() * lastNames.length)],
    fullName: () => {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${first} ${last}`;
    },
    jobTitle: () =>
      ["Engineer", "Manager", "Director", "Consultant"][
        Math.floor(Math.random() * 4)
      ],
  },
  company: {
    name: () => {
      const prefix =
        businessPrefixes[Math.floor(Math.random() * businessPrefixes.length)];
      const type =
        businessTypes[Math.floor(Math.random() * businessTypes.length)];
      return `${prefix} ${type}`;
    },
  },
  location: {
    city: () => cities[Math.floor(Math.random() * cities.length)],
    state: () => states[Math.floor(Math.random() * states.length)],
    streetAddress: (opts) => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const street = ["MG Road", "Main Road", "Park Street"][
        Math.floor(Math.random() * 3)
      ];
      const pincode = Math.floor(Math.random() * 399999) + 400001;
      return `${Math.floor(Math.random() * 999) + 1}, ${street}, ${city} - ${pincode}`;
    },
  },
  internet: {
    email: () => `test${Math.floor(Math.random() * 999)}@example.com`,
  },
  finance: {
    accountNumber: () => Math.floor(Math.random() * 999999999999).toString(),
  },
  number: {
    int: (opts = {}) => {
      const min = opts.min || 0;
      const max = opts.max || 1000;
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
  string: {
    numeric: (length) =>
      Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, "0"),
  },
  datatype: { boolean: () => Math.random() > 0.5 },
  lorem: {
    words: (count) =>
      "test data generation for QA purposes"
        .split(" ")
        .slice(0, count)
        .join(" "),
    word: () =>
      faker.helpers.arrayElement(
        "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega".split(
          " "
        )
      ),
  },
  date: {
    past: (opts) =>
      new Date(
        Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
      ),
  },
  helpers: {
    arrayElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
  },
};

/**
 * Generate realistic Indian coordinates (mocking GPS location)
 * Covers major Indian cities for testing
 */
const generateIndianCoordinates = () => {
  // Major Indian cities coordinates for realistic testing
  const indianCities = [
    { name: "Mumbai", lat: 19.076, lng: 72.8777 },
    { name: "Delhi", lat: 28.7041, lng: 77.1025 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Vijayawada", lat: 16.5062, lng: 80.648 },
  ];

  const city = faker.helpers.arrayElement(indianCities);
  // Add small random offset (0.01 to 0.05 degrees) for variation
  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;

  return {
    latitude: (city.lat + latOffset).toFixed(6),
    longitude: (city.lng + lngOffset).toFixed(6),
    cityName: city.name,
  };
};

/**
 * Generate realistic Indian address
 */
const generateIndianAddress = (cityName) => {
  const streetNumber = faker.number.int({ min: 1, max: 999 });
  const streetName = faker.helpers.arrayElement([
    "MG Road",
    "Main Road",
    "Park Street",
    "Gandhi Road",
    "Nehru Street",
    "Station Road",
    "Market Road",
    "Temple Street",
  ]);
  const area = faker.helpers.arrayElement([
    "Sector",
    "Colony",
    "Nagar",
    "Puram",
    "Layout",
    "Extension",
  ]);
  const areaNumber = faker.number.int({ min: 1, max: 50 });
  const pincode = faker.number.int({ min: 400001, max: 799999 });

  return `${streetNumber}, ${streetName}, ${area} ${areaNumber}, ${cityName} - ${pincode}`;
};

/**
 * Generate realistic Indian phone number
 */
const generateIndianPhone = () => {
  const prefix = faker.helpers.arrayElement([
    "98",
    "99",
    "97",
    "96",
    "95",
    "94",
    "93",
    "92",
    "91",
    "90",
  ]);
  const remaining = faker.number.int({ min: 10000000, max: 99999999 });
  return `${prefix}${remaining}`;
};

/**
 * Generate realistic business name
 */
const generateBusinessName = () => {
  const types = [
    "Enterprises",
    "Industries",
    "Trading Co.",
    "Pvt Ltd",
    "Solutions",
    "Services",
    "Corporation",
  ];
  const prefix = faker.helpers.arrayElement([
    faker.person.lastName(),
    faker.company.name().split(" ")[0],
    faker.location.city().split(" ")[0],
  ]);
  const type = faker.helpers.arrayElement(types);
  return `${prefix} ${type}`;
};

/**
 * Generate base user data similar to mobile app's generateDummyUserData
 */
export const generateBaseUserData = (bankName) => {
  const timestamp = Date.now();
  const coordinates = generateIndianCoordinates();
  const cityName = coordinates.cityName;

  // Generate realistic Indian names
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const coApplicantName = `${faker.person.firstName()} ${faker.person.lastName()}`;

  const address = generateIndianAddress(cityName);
  const phone = generateIndianPhone();
  const businessName = generateBusinessName();
  const applicationNumber = `${bankName.substring(0, 3).toUpperCase()}${faker.number.int({ min: 100000, max: 999999 })}`;

  // Mock userData object (matches the structure expected by PD screen)
  const userData = {
    id: 1,
    type: "Business",
    status: "Pending",
    loanId: 1,
    applicantAddress: address,
    businessName: businessName,
    contactNumber: phone,
    coordinates: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
    loan: {
      applicationId: applicationNumber,
      applicationNumber: applicationNumber,
      applicantName: fullName,
      applicantMobile: phone,
      applicantAddress: address,
      bankName: bankName,
      loanAmount: faker.number.int({ min: 500000, max: 10000000 }),
      loanPurpose: faker.helpers.arrayElement([
        "business development",
        "working capital",
        "business expansion",
        "purchase of machinery",
        "inventory purchase",
        "rental payment",
        "salary payment",
      ]),
      loanType: faker.helpers.arrayElement([
        "Business Loan",
        "Home Loan",
        "LAP",
        "Working Capital",
      ]),
      product: faker.helpers.arrayElement(["LAP", "BL", "HL", "WC"]),
      tenure: `${faker.number.int({ min: 12, max: 240 })} months`,
      accountType: faker.helpers.arrayElement(["Savings", "Current"]),
      accountNo: faker.finance.accountNumber(10),
    },
    applicantName: fullName,
    coApplicantName: coApplicantName,
  };

  return { userData, coordinates };
};

/**
 * Generate a single field value based on schema and field name
 */
const generateFieldValue = (fieldId, fieldSchema) => {
  // Handle enum (dropdown) - pick random option instead of first
  if (fieldSchema.enum && fieldSchema.enum.length > 0) {
    return faker.helpers.arrayElement(fieldSchema.enum);
  }

  // Handle arrays
  if (fieldSchema.type === "array" && fieldSchema.items) {
    const itemCount = faker.number.int({ min: 1, max: 3 });

    // Special handling for concerns field
    if (fieldId.includes("concern")) {
      const concernTemplates = [
        "We have verified his savings account where no business transactions were seen.",
        "We have verified his CC account where the internal transactions were like observed but doesn't looks like business transactions.",
        "No business activity was seen in the premises.",
        "No records, bills, receipts none were provided.",
        "Business premises appears to be temporary setup.",
        "Applicant was not available during the visit.",
        "Documents provided were not clear or legible.",
        "Address mismatch between initiated and visited premises.",
        "Business activity level was very low during visit.",
        "No proper business records maintained.",
      ];
      return Array.from({ length: itemCount }, () =>
        faker.helpers.arrayElement(concernTemplates)
      );
    }

    return Array.from({ length: itemCount }, () =>
      generateObjectValue(fieldSchema.items)
    );
  }

  // Handle objects
  if (fieldSchema.type === "object" && fieldSchema.properties) {
    return generateObjectValue(fieldSchema);
  }

  // Handle read-only fields - return empty or default values
  if (fieldSchema.readOnly) {
    switch (fieldSchema.type) {
      case "string":
        return fieldId.toLowerCase().includes("name")
          ? faker.person.fullName()
          : "";
      case "number":
      case "integer":
        return fieldId.toLowerCase().includes("amount")
          ? faker.number.int({ min: 100000, max: 5000000 })
          : 0;
      default:
        return "";
    }
  }

  // Handle pattern-based validation (like phone numbers)
  if (fieldSchema.pattern) {
    if (fieldSchema.pattern.includes("^[0-9]{10}$")) {
      // Indian mobile number pattern
      return "9" + faker.string.numeric(9);
    }
    if (fieldSchema.pattern.includes("[0-9]")) {
      return faker.string.numeric(10);
    }
  }

  // Generate based on field name (smart generation)
  const fieldName = (fieldSchema.title || fieldId).toLowerCase();

  // Business/Company/Firm/Entity name (check first before general name)
  if (
    fieldName.includes("business") ||
    fieldName.includes("company") ||
    fieldName.includes("concern") ||
    fieldName.includes("firm") ||
    fieldName.includes("entity")
  ) {
    return faker.company.name();
  }

  if (fieldName.includes("total family")) {
    return faker.number.int({ min: 2, max: 6 });
  }

  if (fieldName.includes("earning members")) {
    return faker.number.int({ min: 1, max: 4 });
  }

  // Bank Name (check before general name)
  if (fieldName.includes("bank") && fieldName.includes("name")) {
    return faker.helpers.arrayElement([
      "HDFC Bank",
      "ICICI Bank",
      "State Bank of India",
      "Axis Bank",
      "Kotak Mahindra Bank",
      "Punjab National Bank",
    ]);
  }

  // Name fields (person names)
  if (fieldName.includes("name")) {
    return faker.person.fullName();
  }

  // Phone/Mobile fields
  if (fieldName.includes("phone") || fieldName.includes("mobile")) {
    return "9" + faker.string.numeric(9);
  }

  if (fieldName.includes("purpose of loan")) {
    return "Working capital requirements";
  }

  // Person met fields
  if (fieldName.includes("person") && fieldName.includes("met")) {
    return faker.person.fullName();
  }

  // Premises/Address fields
  if (fieldName.includes("premises") || fieldName.includes("address")) {
    return faker.location.streetAddress({ useFullAddress: true });
  }

  // Concern/Business name fields
  if (fieldName.includes("concern") || fieldName.includes("business")) {
    return faker.company.name();
  }

  // Email fields
  if (fieldName.includes("email")) {
    return faker.internet.email();
  }

  // Address fields
  if (fieldName.includes("address") || fieldName.includes("location")) {
    return faker.location.streetAddress({ useFullAddress: true });
  }

  // Date fields
  if (fieldSchema.format === "date" || fieldName.includes("date")) {
    return faker.date.past({ years: 5 }).toISOString().split("T")[0];
  }

  // Year fields (business started, etc.)
  if (fieldName.includes("year") && !fieldName.includes("years")) {
    return faker.number.int({ min: 2000, max: 2020 });
  }

  // Years/Experience fields
  if (fieldName.includes("years") || fieldName.includes("experience")) {
    return faker.number.int({ min: 2, max: 20 });
  }

  // Amount/Salary/Income/Rent/EMI/Value fields
  if (
    fieldName.includes("amount") ||
    fieldName.includes("salary") ||
    fieldName.includes("income") ||
    fieldName.includes("rent") ||
    fieldName.includes("emi") ||
    fieldName.includes("value") ||
    fieldName.includes("margin") ||
    fieldName.includes("profit") ||
    fieldName.includes("tenure")
  ) {
    const numValue = faker.number.int({ min: 10000, max: 1000000 });
    // Return as string if field type is string, otherwise return number
    return fieldSchema.type === "string" ? numValue.toString() : numValue;
  }

  // Employee/Footfall count fields
  if (fieldName.includes("employee") || fieldName.includes("number")) {
    return faker.number.int({ min: 1, max: 20 });
  }

  // Age fields
  if (fieldName.includes("age")) {
    return faker.number.int({ min: 18, max: 65 });
  }

  // City/Town fields
  if (fieldName.includes("city") || fieldName.includes("town")) {
    return faker.location.city();
  }

  // State/Region fields
  if (fieldName.includes("state") || fieldName.includes("region")) {
    return faker.location.state();
  }

  // Branch fields
  if (fieldName.includes("branch")) {
    return faker.location.city() + " Branch";
  }

  // Pincode fields
  if (fieldName.includes("pincode") || fieldName.includes("pin")) {
    return faker.string.numeric(6);
  }

  // PAN fields
  if (fieldName.includes("pan")) {
    return "ABCDE1234F";
  }

  // Aadhaar fields
  if (fieldName.includes("aadhaar") || fieldName.includes("aadhar")) {
    return faker.string.numeric(12);
  }

  // GST fields
  if (fieldName.includes("gst") || fieldName.includes("gstin")) {
    return faker.string.numeric(15);
  }

  // Nature/Type of business
  if (fieldName.includes("nature") || fieldName.includes("type of business")) {
    return faker.helpers.arrayElement([
      "Retail Trading",
      "Manufacturing",
      "Wholesale Trading",
      "Services",
      "Distribution",
    ]);
  }

  // Occupation
  if (fieldName.includes("occupation") || fieldName.includes("profession")) {
    return faker.person.jobTitle();
  }

  // Qualification/Education
  if (fieldName.includes("qualification") || fieldName.includes("education")) {
    return faker.helpers.arrayElement([
      "Graduate",
      "Post Graduate",
      "Under Graduate",
      "12th",
      "10th",
    ]);
  }

  // Relation
  if (fieldName.includes("relation")) {
    return faker.helpers.arrayElement([
      "Father",
      "Mother",
      "Spouse",
      "Son",
      "Daughter",
      "Brother",
      "Sister",
    ]);
  }

  // Constitution/Ownership
  if (fieldName.includes("constitution") || fieldName.includes("ownership")) {
    return faker.helpers.arrayElement([
      "Proprietorship",
      "Partnership",
      "Private Limited",
      "LLP",
      "Owned",
      "Rented",
    ]);
  }

  // Account Type
  if (fieldName.includes("account type")) {
    return faker.helpers.arrayElement(["Savings", "Current", "CC/OD"]);
  }

  // Account Number
  if (fieldName.includes("account") && fieldName.includes("no")) {
    return faker.string.numeric(12);
  }

  // Type of Loan
  if (
    fieldName.includes("type") &&
    (fieldName.includes("loan") || fieldName.includes("product"))
  ) {
    return faker.helpers.arrayElement([
      "Business Loan",
      "Home Loan",
      "Vehicle Loan",
      "Personal Loan",
      "Working Capital",
    ]);
  }

  // Asset Type
  if (fieldName.includes("asset") && fieldName.includes("type")) {
    return faker.helpers.arrayElement([
      "Residential Property",
      "Commercial Property",
      "Plot",
      "2 Wheeler",
      "4 Wheeler",
    ]);
  }

  // Default handling based on type
  switch (fieldSchema.type) {
    case "string":
      return faker.lorem.words(3);
    case "number":
    case "integer":
      return faker.number.int({ min: 0, max: 1000000 });
    case "boolean":
      return faker.datatype.boolean();
    default:
      return faker.lorem.word();
  }
};

/**
 * Generate object value recursively
 */
const generateObjectValue = (schema) => {
  if (!schema.properties) {
    return {};
  }

  const obj = {};
  Object.entries(schema.properties).forEach(([key, fieldSchema]) => {
    obj[key] = generateFieldValue(key, fieldSchema);
  });

  return obj;
};

/**
 * Generate mock data from a JSON schema section (ported from mobile app)
 */
export const generateMockDataFromSchema = (schema) => {
  console.log(
    "Starting mock data generation for schema sections:",
    schema.sections.map((s) => s.id)
  );
  if (!schema || !schema.sections) {
    throw new Error("Invalid schema: sections not found");
  }

  const mockData = {};

  schema.sections.forEach((section) => {
    console.log("Processing section:", section.id);
    let sectionData = {};

    // Handle different section types
    if (section.schema?.type === "array") {
      // Handle array sections
      const itemCount = faker.number.int({ min: 1, max: 3 });
      const itemSchema = section.schema.items || { type: "string" };

      sectionData = Array.from({ length: itemCount }, () => {
        if (itemSchema?.properties) {
          const itemData = {};
          Object.entries(itemSchema.properties).forEach(
            ([fieldId, fieldSchema]) => {
              itemData[fieldId] = generateFieldValue(fieldId, fieldSchema);
            }
          );
          return itemData;
        }
        const normalizedSchema =
          itemSchema && Object.keys(itemSchema).length > 0
            ? itemSchema
            : { type: "string", title: section.schema?.title || section.id };

        return generateFieldValue(`${section.id}Item`, normalizedSchema);
      });
    } else if (section.schema?.properties) {
      // Handle object sections
      Object.entries(section.schema.properties).forEach(
        ([fieldId, fieldSchema]) => {
          sectionData[fieldId] = generateFieldValue(fieldId, fieldSchema);
        }
      );
    }

    // Add special case for familyBackground section
    if (section.id === "familyBackground") {
      console.log("Special case triggered for familyBackground");
      const familyMembers = [
        {
          name: faker.person.fullName(),
          relationToApplicant: "Mother",
          age: faker.number.int({ min: 50, max: 60 }),
          qualification: "Graduate",
          occupation: "Housewife",
          incomePerMonth: 0,
          dependent: "Yes",
        },
        {
          name: faker.person.fullName(),
          relationToApplicant: "Father",
          age: faker.number.int({ min: 55, max: 65 }),
          qualification: "Graduate",
          occupation: "Business Owner", // Earning
          incomePerMonth: 50000, // Positive income
          dependent: "No",
        },
      ];
      sectionData.familyMembers = familyMembers;
      sectionData.totalFamilyMembers = 2;
      sectionData.noOfEarningMembers = 1; // Only Father earning
      console.log(
        "Generated family members for familyBackground:",
        familyMembers
      );
      console.log(
        "Set totalFamilyMembers:",
        sectionData.totalFamilyMembers,
        "noOfEarningMembers:",
        sectionData.noOfEarningMembers
      );
    }

    // Add special case for familyDetails section after the familyBackground case
    if (section.id === "familyDetails") {
      console.log("Special case triggered for familyDetails");
      const familyMembers = [
        {
          name: faker.person.fullName(),
          age: 35,
          qualification: "Degree",
          profession: "Housewife",
          relation: "Wife",
          monthlyIncome: 0,
        },
        {
          name: faker.person.fullName(),
          age: 15,
          qualification: "10th Class",
          profession: "Student",
          relation: "Daughter",
          monthlyIncome: 0,
        },
        {
          name: faker.person.fullName(),
          age: 15,
          qualification: "10th Class",
          profession: "Student",
          relation: "Daughter",
          monthlyIncome: 0,
        },
        {
          name: faker.person.fullName(),
          age: 10,
          qualification: "6th Class",
          profession: "Student",
          relation: "Son",
          monthlyIncome: 0,
        },
      ];
      sectionData.familyDetails = familyMembers;
      console.log("Generated family members for familyDetails:", familyMembers);
    }

    // Special case for otherDetails section to add liabilities
    if (section.id === "otherDetails") {
      console.log(
        "Special case triggered for otherDetails - adding liabilities"
      );
      const liabilities = [
        {
          bank: "HDFC Bank",
          natureOfLoan: "Business Loan",
          amount: faker.number.int({ min: 100000, max: 500000 }),
          emi: faker.number.int({ min: 10000, max: 25000 }),
          tenure: "36 months",
          outstandingBalance: faker.number.int({ min: 50000, max: 200000 }),
        },
        {
          bank: "ICICI Bank",
          natureOfLoan: "Personal Loan",
          amount: faker.number.int({ min: 50000, max: 200000 }),
          emi: faker.number.int({ min: 5000, max: 15000 }),
          tenure: "24 months",
          outstandingBalance: faker.number.int({ min: 20000, max: 100000 }),
        },
      ];
      sectionData.liabilities = liabilities;
      console.log("Generated liabilities:", liabilities);
    }

    // Special case for supplierDetails section to add suppliers
    if (section.id === "supplierDetails") {
      console.log(
        "Special case triggered for supplierDetails - adding suppliers"
      );
      const suppliers = [
        {
          nameOfSupplier: faker.company.name(),
          percentageOfTotalPurchases: faker.number.int({ min: 20, max: 60 }),
          creditorDays: faker.number.int({ min: 15, max: 45 }),
          relationshipSinceYears: faker.number.int({ min: 2, max: 10 }),
        },
        {
          nameOfSupplier: faker.company.name(),
          percentageOfTotalPurchases: faker.number.int({ min: 10, max: 30 }),
          creditorDays: faker.number.int({ min: 20, max: 60 }),
          relationshipSinceYears: faker.number.int({ min: 1, max: 8 }),
        },
      ];
      sectionData.suppliers = suppliers;
      sectionData.totalCreditorsAsOnDate = faker.number.int({
        min: 50000,
        max: 200000,
      });
      sectionData.totalSuppliersNo = suppliers.length;
      console.log("Generated suppliers:", suppliers);
    }

    // Special case for customerDetails section to add customers
    if (section.id === "customerDetails") {
      console.log(
        "Special case triggered for customerDetails - adding customers"
      );
      const customers = [
        {
          nameOfCustomer: faker.company.name(),
          percentageOfTotalSales: faker.number.int({ min: 25, max: 70 }),
          debtorDays: faker.number.int({ min: 10, max: 30 }),
          relationshipSinceYears: faker.number.int({ min: 3, max: 12 }),
        },
        {
          nameOfCustomer: faker.company.name(),
          percentageOfTotalSales: faker.number.int({ min: 15, max: 40 }),
          debtorDays: faker.number.int({ min: 15, max: 45 }),
          relationshipSinceYears: faker.number.int({ min: 2, max: 9 }),
        },
      ];
      sectionData.customers = customers;
      sectionData.totalDebtorsAsOnDate = faker.number.int({
        min: 75000,
        max: 300000,
      });
      sectionData.totalCustomersNo = customers.length;
      console.log("Generated customers:", customers);
    }

    // Special case for Chola bank sections
    if (section.id === "basicInformation") {
      console.log("Special case triggered for Chola basicInformation");
      sectionData.nameOfTheApplicant = faker.person.fullName();
      sectionData.nameOfTheCoApplicant = faker.person.fullName();
      sectionData.businessName = faker.company.name();
      sectionData.constitution = faker.helpers.arrayElement([
        "Proprietorship",
        "Partnership",
        "Private Limited",
      ]);
      sectionData.visitedAddress = faker.location.streetAddress({
        useFullAddress: true,
      });
      sectionData.loanRequested = faker.number.int({
        min: 500000,
        max: 5000000,
      });
      sectionData.purposeOfLoan = faker.helpers.arrayElement([
        "Flat purchase",
        "Business expansion",
        "Working capital",
        "Equipment purchase",
      ]);
      sectionData.dateOfVisit = faker.date
        .past({ years: 1 })
        .toISOString()
        .split("T")[0];
      sectionData.personMet = faker.person.fullName();
      console.log("Generated Chola basicInformation:", sectionData);
    }

    if (section.id === "aboutTheApplicantAndItsBusiness") {
      console.log(
        "Special case triggered for Chola aboutTheApplicantAndItsBusiness"
      );
      sectionData = [
        {
          aboutTheApplicant: `MR. ${faker.person.fullName()} is applicant aged ${faker.number.int({ min: 25, max: 50 })} years, ${faker.helpers.arrayElement(["graduate", "post graduate", "under graduate"])} and native is ${faker.location.city()}.`,
        },
        {
          aboutTheApplicant: `Applicant started business under the name of ${faker.company.name()} since ${faker.number.int({ min: 2015, max: 2020 })}.`,
        },
        {
          aboutTheApplicant:
            "It is a sole proprietorship business concern, applicant is proprietor of the business and applicant manages all the business activities.",
        },
      ];
      console.log(
        "Generated Chola aboutTheApplicantAndItsBusiness:",
        sectionData
      );
    }

    if (section.id === "applicantsFamilyDetails") {
      console.log("Special case triggered for Chola applicantsFamilyDetails");
      const familyMembers = [
        {
          name: faker.person.fullName(),
          relation: "Wife",
          age: faker.number.int({ min: 25, max: 40 }),
        },
        {
          name: faker.person.fullName(),
          relation: "Son",
          age: faker.number.int({ min: 5, max: 15 }),
        },
        {
          name: faker.person.fullName(),
          relation: "Daughter",
          age: faker.number.int({ min: 3, max: 12 }),
        },
      ];
      sectionData.familyMembers = familyMembers;
      console.log("Generated Chola family members:", familyMembers);
    }

    if (section.id === "assets") {
      console.log("Special case triggered for Chola assets");
      sectionData.assets = [
        {
          description: "Residential Property",
          area: `${faker.number.int({ min: 800, max: 2500 })} sq.ft`,
          marketValue: faker.number.int({ min: 1500000, max: 4500000 }),
          nameOfAssetHolder: faker.person.fullName(),
        },
        {
          description: "Commercial Vehicle",
          area: "NA",
          marketValue: faker.number.int({ min: 600000, max: 1500000 }),
          nameOfAssetHolder: faker.person.fullName(),
        },
      ];
      console.log("Generated Chola assets:", sectionData.assets);
    }

    if (section.id === "customersReferenceNumbers") {
      console.log("Special case triggered for Chola customersReferenceNumbers");
      sectionData = [
        {
          customerReferenceNumber: `CUST${faker.string.numeric(6)}`,
        },
        {
          customerReferenceNumber: `REF${faker.string.numeric(5)}`,
        },
      ];
      console.log("Generated Chola customer reference numbers:", sectionData);
    }

    if (section.id === "otherIncomes") {
      console.log("Special case triggered for Chola otherIncomes");
      sectionData = [
        {
          otherIncome: "Rental income from property: Rs. 15,000/- per month",
        },
        {
          otherIncome: "Interest from fixed deposits: Rs. 5,000/- per month",
        },
      ];
      console.log("Generated Chola other incomes:", sectionData);
    }

    if (section.id === "existingLoanDetails") {
      console.log("Special case triggered for Chola existingLoanDetails");
      sectionData = [
        {
          bankName: "HDFC Bank",
          typeOfLoan: "Home Loan",
          loanAmount: faker.number.int({ min: 2000000, max: 5000000 }),
          emiInterest: faker.number.int({ min: 25000, max: 50000 }),
          tenureTotalCompleted: "240 months",
        },
        {
          bankName: "ICICI Bank",
          typeOfLoan: "Personal Loan",
          loanAmount: faker.number.int({ min: 300000, max: 800000 }),
          emiInterest: faker.number.int({ min: 8000, max: 20000 }),
          tenureTotalCompleted: "36 months",
        },
      ];
      console.log("Generated Chola existing loans:", sectionData);
    }

    if (section.id === "bankingDetails") {
      console.log("Special case triggered for Chola bankingDetails");
      sectionData.bankingDetails = [
        {
          bankName: "State Bank of India",
          accountNo: faker.string.numeric(12),
          accountType: "Current",
        },
        {
          bankName: "HDFC Bank",
          accountNo: faker.string.numeric(10),
          accountType: "Savings",
        },
      ];
      console.log("Generated Chola banking details:", sectionData);
    }

    if (section.id === "itrFinancialDetails") {
      console.log("Special case triggered for Chola itrFinancialDetails");
      sectionData.itr = "ITR filed for last 3 years";
      sectionData.receipts = "Sales receipts maintained properly";
      sectionData.verification = "Bank statements verified";
      sectionData.gpMarginAndExpenses = "GP margin around 15-20%";
      console.log("Generated Chola ITR financial details:", sectionData);
    }

    if (section.id === "comfortFactor") {
      console.log("Special case triggered for Chola comfortFactor");
      sectionData = [
        {
          comfortFactor: "Business name board seen.",
        },
        {
          comfortFactor:
            "Verified Rental agreement, trade license, Bank statements, kacha records.",
        },
        {
          comfortFactor: `He has ${faker.number.int({ min: 3, max: 10 })} years of experience in this field.`,
        },
      ];
      console.log("Generated Chola comfort factors:", sectionData);
    }

    if (section.id === "discomfortFactor") {
      console.log("Special case triggered for Chola discomfortFactor");
      sectionData = [
        {
          discomfortFactor: "Not provided IT, Bank Statement and Bills.",
        },
        {
          discomfortFactor:
            "During the observation, UPI scanner was in the name of different person.",
        },
      ];
      console.log("Generated Chola discomfort factors:", sectionData);
    }

    if (section.id === "Recommendations") {
      console.log("Special case triggered for Chola Recommendations");
      sectionData = [
        {
          recommendations: faker.helpers.arrayElement([
            "Recommended for approval",
            "Recommended with conditions",
            "Not recommended",
          ]),
        },
      ];
      console.log("Generated Chola recommendations:", sectionData);
    }

    if (section.id === "financialStatement") {
      console.log("Special case triggered for Chola financialStatement");
      sectionData.expenditure = {
        toPurchaseOfMaterial: faker.number.int({ min: 200000, max: 800000 }),
        toElectricity: faker.number.int({ min: 15000, max: 50000 }),
        toRent: faker.number.int({ min: 25000, max: 80000 }),
        toSalaries: faker.number.int({ min: 60000, max: 200000 }),
        toTransportation: faker.number.int({ min: 20000, max: 60000 }),
        toOtherExpenses: faker.number.int({ min: 30000, max: 100000 }),
        toNetProfit: faker.number.int({ min: 100000, max: 400000 }),
        totalExpenditure: faker.number.int({ min: 400000, max: 1200000 }),
      };
      sectionData.income = {
        byGrossReceipts: faker.number.int({ min: 600000, max: 1500000 }),
        totalIncome: faker.number.int({ min: 600000, max: 1500000 }),
      };
      console.log("Generated Chola financial statement:", sectionData);
    }

    if (section.id === "financialAnalysis") {
      console.log("Special case triggered for Chola financialAnalysis");
      sectionData.totalGrossDisposableIncome = faker.number.int({
        min: 200000,
        max: 400000,
      });
      sectionData.totalObligations = faker.number.int({
        min: 100000,
        max: 250000,
      });
      sectionData.netDisposableIncome =
        sectionData.totalGrossDisposableIncome - sectionData.totalObligations;
      console.log("Generated Chola financial analysis:", sectionData);
    }

    if (section.id === "documentsObserved") {
      sectionData.documentsObserved = [
        "GST Certificate",
        "ITR Statement",
        "Bank Statement",
      ].join(", ");
    }

    if (section.id === "gstRegistration") {
      sectionData.gstRegistered = faker.datatype.boolean();
    }

    if (section.id === "concerns") {
      sectionData.concernsSummary = "<p>Need to improve cash flow monitoring and maintain updated ledgers.</p><p>Recommend closer supervision on inventory cycles.</p>";
    }

    if (section.id === "neighborCheck") {
      sectionData.neighbors = [
        {
          name: faker.person.fullName(),
          feedback: "Knows the applicant for 5 years, business runs regularly.",
        },
        {
          name: faker.person.fullName(),
          feedback: "No negative observations from the locality.",
        },
      ];
    }

    mockData[section.id] = sectionData;
    console.log(
      "Final sectionData for",
      section.id,
      ": familyMembers length:",
      (sectionData.familyMembers || []).length
    );
  });

  // Add mock uploaded items for photo testing
  const mockUploadedItems = [
    {
      id: "photo_1",
      uri: "mock://photo1.jpg",
      s3ImageUrl: "verification/mock/photo1.jpg",
      type: "photo",
      timestamp: new Date().toISOString(),
      documentType: "GST CERTIFICATE",
      latitude: 12.9716,
      longitude: 77.5946,
      locality: "Bangalore",
      pincode: "560001",
      isOverlayNeeded: true,
      isCamera: true,
    },
    {
      id: "photo_2",
      uri: "mock://photo2.jpg",
      s3ImageUrl: "verification/mock/photo2.jpg",
      type: "photo",
      timestamp: new Date().toISOString(),
      documentType: "GST CERTIFICATE",
      latitude: 12.9716,
      longitude: 77.5946,
      locality: "Bangalore",
      pincode: "560001",
      isOverlayNeeded: true,
      isCamera: false,
    },
    {
      id: "photo_3",
      uri: "mock://photo3.jpg",
      s3ImageUrl: "verification/mock/photo3.jpg",
      type: "photo",
      timestamp: new Date().toISOString(),
      documentType: "ITRS",
      latitude: 12.9716,
      longitude: 77.5946,
      locality: "Bangalore",
      pincode: "560001",
      isOverlayNeeded: false,
      isCamera: true,
    },
  ];

  mockData.uploadedItems = mockUploadedItems;
  console.log("Generated mock uploaded items:", mockUploadedItems);

  return mockData;
};

/**
 * Populate verification data that combines base user data with schema-driven mock data
 */
export const populateVerificationData = (schema, baseData, coordinates) => {
  const { userData } = baseData;

  // Generate comprehensive mock data for all sections
  const mockData = generateMockDataFromSchema(schema);

  // Common data mapping (similar to mobile app's populateInitialDataFromSchema)
  const commonData = {
    applicantName:
      userData?.loan?.applicantName || userData?.applicantName || "",
    businessName: userData?.businessName || userData?.loan?.businessName || "",
    phoneNo: userData?.loan?.applicantMobile || userData?.contactNumber || "",
    applicationNumber:
      userData?.loan?.applicationNumber || userData?.loan?.loanId || "",
    loanAmount: userData?.loan?.loanAmount || "",
    loanPurpose: userData?.loan?.loanPurpose || "",
    address:
      userData?.loan?.applicantAddress || userData?.applicantAddress || "",
  };

  // Map common data to schema fields and merge with mock data
  const verificationData = { ...mockData };

  schema.sections.forEach((section) => {
    if (!section.schema?.properties) return;

    // Ensure section exists in verification data
    if (!verificationData[section.id]) {
      verificationData[section.id] = {};
    }

    Object.entries(section.schema.properties).forEach(
      ([fieldId, fieldSchema]) => {
        // Map common data to schema fields
        switch (fieldId) {
          case "nameOfTheApplicant":
          case "nameOfApplicant":
            verificationData[section.id][fieldId] = commonData.applicantName;
            break;
          case "businessName":
          case "nameOfConcern":
            verificationData[section.id][fieldId] = commonData.businessName;
            break;
          case "phoneNo":
          case "contactNo":
            verificationData[section.id][fieldId] = commonData.phoneNo;
            break;
          case "applicationNumber":
          case "applicationNo":
            verificationData[section.id][fieldId] =
              commonData.applicationNumber;
            break;
          case "visitedAddress":
          case "currentAddress":
          case "initiatedAddress":
            verificationData[section.id][fieldId] = commonData.address;
            break;
          case "loanRequested":
          case "loanAmount":
            verificationData[section.id][fieldId] = commonData.loanAmount;
            break;
          case "loanPurpose":
          case "purposeOfLoan":
            verificationData[section.id][fieldId] = commonData.loanPurpose;
            break;
          case "bankName":
            verificationData[section.id][fieldId] =
              userData?.loan?.bankName || "";
            break;
        }
      }
    );

    // Inject coordinates for bank-specific fields
    const bankNameLower = (userData?.loan?.bankName || "").toLowerCase();

    // RBL bank coordinates
    if (bankNameLower.includes("rbl") && section.id === "particulars") {
      if (!verificationData[section.id]) verificationData[section.id] = {};
      verificationData[section.id].coordinates =
        `${coordinates.latitude}, ${coordinates.longitude}`;
    }

    // Axis Finance UBL coordinates
    if (
      bankNameLower.includes("axis finance ubl") &&
      section.id === "thirdPartyCheck"
    ) {
      if (!verificationData[section.id]) verificationData[section.id] = {};
      verificationData[section.id].siteCoordinates =
        `${coordinates.latitude}, ${coordinates.longitude}`;
    }

    // Tata UBL coordinates
    if (bankNameLower.includes("tata ubl") && section.id === "finalStatus") {
      if (!verificationData[section.id]) verificationData[section.id] = {};
      verificationData[section.id].latitudeLongitude =
        `${coordinates.latitude}, ${coordinates.longitude}`;
    }
  });

  // Provide basicInformation alias when only applicantDetails is available
  if (!verificationData.basicInformation && verificationData.applicantDetails) {
    verificationData.basicInformation = verificationData.applicantDetails;
  }

  // Normalize family details structure for templates expecting familyDetails
  const familySection =
    verificationData.familyDetails || verificationData.familyMembers;
  const familyMembersArray =
    (Array.isArray(familySection?.familyMembers) &&
    familySection.familyMembers.length > 0
      ? familySection.familyMembers
      : Array.isArray(verificationData.familyMembers?.familyMembers)
        ? verificationData.familyMembers.familyMembers
        : []) || [];

  if (familyMembersArray.length > 0) {
    const computeEarningMembers = (members) =>
      members.filter((member) => {
        const occupation = (
          member.occupation ||
          member.employmentType ||
          member.workType ||
          ""
        )
          .toString()
          .toLowerCase();

        if (!occupation) {
          return false;
        }

        const nonEarningKeywords = [
          "student",
          "dependent",
          "unemployed",
          "home",
          "house",
          "homemaker",
          "housewife",
          "house wife",
          "home maker",
        ];

        return !nonEarningKeywords.some((keyword) =>
          occupation.includes(keyword)
        );
      }).length;

    const totalMembers =
      familySection?.totalFamilyMembers ??
      verificationData.familyMembers?.totalFamilyMembers ??
      familyMembersArray.length;

    const earningMembers =
      familySection?.earningMembers ??
      verificationData.familyMembers?.earningMembers ??
      computeEarningMembers(familyMembersArray);

    verificationData.familyDetails = {
      ...(verificationData.familyDetails || {}),
      familyMembers: familyMembersArray,
      totalFamilyMembers: totalMembers,
      earningMembers,
    };

    verificationData.familyMembers = {
      ...(verificationData.familyMembers || {}),
      familyMembers: familyMembersArray,
      totalFamilyMembers: totalMembers,
      earningMembers,
    };
  }

  if (!verificationData.applicantDetails) {
    verificationData.applicantDetails = {};
  }

  const applicantDetails = verificationData.applicantDetails;
  applicantDetails.applicationNo =
    applicantDetails.applicationNo || commonData.applicationNumber;
  applicantDetails.nameOfApplicant =
    applicantDetails.nameOfApplicant || commonData.applicantName;
  applicantDetails.phoneNumber =
    applicantDetails.phoneNumber || commonData.phoneNo;
  applicantDetails.initiatedPremises =
    applicantDetails.initiatedPremises || commonData.address;
  applicantDetails.nameOfConcern =
    applicantDetails.nameOfConcern || commonData.businessName || "Kowtha Enterprises";
  applicantDetails.amountAndPurposeOfLoan =
    applicantDetails.amountAndPurposeOfLoan ||
    `Working capital requirements for ${commonData.businessName || "operations"}`;
  applicantDetails.typeOfCollateral =
    applicantDetails.typeOfCollateral || "Residential Property";
  applicantDetails.marketValueOfCollateral =
    applicantDetails.marketValueOfCollateral ||
    faker.number.int({ min: 500000, max: 2500000 }).toString();
  applicantDetails.collateralPropertyAddress =
    applicantDetails.collateralPropertyAddress ||
    faker.location.streetAddress({ useFullAddress: true });

  return verificationData;
};

/**
 * Generate realistic financial analysis data
 */
export const generateFinancialAnalysis = () => {
  return {
    openingStock: faker.number.int({ min: 100000, max: 500000 }),
    purchase: faker.number.int({ min: 200000, max: 800000 }),
    costOfServices: faker.number.int({ min: 50000, max: 300000 }),
    wages: faker.number.int({ min: 30000, max: 150000 }),
    hamaliCharges: faker.number.int({ min: 5000, max: 25000 }),
    manufacturingExpenses: faker.number.int({ min: 40000, max: 200000 }),
    packingCharges: faker.number.int({ min: 10000, max: 50000 }),
    sales: faker.number.int({ min: 500000, max: 1200000 }),
    services: faker.number.int({ min: 100000, max: 400000 }),
    closingStock: faker.number.int({ min: 80000, max: 400000 }),
    salaries: faker.number.int({ min: 50000, max: 200000 }),
    rent: faker.number.int({ min: 20000, max: 80000 }),
    electricityCharges: faker.number.int({ min: 8000, max: 30000 }),
    printingStationery: faker.number.int({ min: 2000, max: 10000 }),
    telephoneCharges: faker.number.int({ min: 3000, max: 15000 }),
    postageTelegram: faker.number.int({ min: 500, max: 3000 }),
    officeMaintenance: faker.number.int({ min: 5000, max: 20000 }),
    repairsMaintenance: faker.number.int({ min: 8000, max: 35000 }),
    sadarExpenses: faker.number.int({ min: 10000, max: 40000 }),
    auditFee: faker.number.int({ min: 15000, max: 50000 }),
    advertisement: faker.number.int({ min: 5000, max: 25000 }),
    bankCharges: faker.number.int({ min: 2000, max: 8000 }),
    insurance: faker.number.int({ min: 10000, max: 30000 }),
    depreciation: faker.number.int({ min: 20000, max: 60000 }),
    interestOnLoan: faker.number.int({ min: 15000, max: 50000 }),
    rentReceived: faker.number.int({ min: 0, max: 20000 }),
    commissionReceived: faker.number.int({ min: 5000, max: 25000 }),
    netProfit: faker.number.int({ min: 50000, max: 300000 }),
    grossProfit: faker.number.int({ min: 100000, max: 500000 }),
  };
};
