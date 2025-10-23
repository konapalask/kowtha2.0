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
    recent: (opts = {}) => {
      const days = typeof opts.days === "number" ? opts.days : 7;
      const offset = faker.number.int({ min: 0, max: Math.max(1, days) });
      return new Date(Date.now() - offset * 24 * 60 * 60 * 1000);
    },
  },
  helpers: {
    arrayElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
    arrayElements: (arr, opts = {}) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      const min =
        typeof opts.min === "number" && opts.min >= 0 ? opts.min : 1;
      const max =
        typeof opts.max === "number" && opts.max >= min
          ? Math.min(opts.max, arr.length)
          : arr.length;
      const count = Math.min(
        arr.length,
        Math.max(min, faker.number.int({ min, max }))
      );
      const source = [...arr];
      const chosen = [];
      while (chosen.length < count && source.length > 0) {
        const index = Math.floor(Math.random() * source.length);
        chosen.push(source.splice(index, 1)[0]);
      }
      return chosen;
    },
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

    // Hero Fincorp specific data population
    if (schema.bankName === "Hero Fincorp") {
      switch (section.id) {
        case "basicDetails": {
          sectionData = {
            applicantName: faker.person.fullName(),
            concernName: faker.company.name(),
            officeAddress: faker.location.streetAddress({ useFullAddress: true }),
            phoneNumber: generateIndianPhone(),
            appointmentFixed: faker.helpers.arrayElement([
              "10:30 AM",
              "02:00 PM",
              "04:45 PM",
            ]),
            dateOfVisit: faker.date
              .past({ years: 1 })
              .toISOString()
              .split("T")[0],
            structureOfLoan: faker.helpers.arrayElement([
              "Term Loan",
              "Working Capital",
              "Equipment Finance",
            ]),
            loanAmount: faker.number.int({ min: 500000, max: 5000000 }),
            numberOfVisits: faker.helpers.arrayElement(["First", "Second"]),
            personMet: faker.person.fullName(),
            verifierNotes:
              "The following data and explanation are based on the verbal information provided to us during the visit.",
          };
          break;
        }
        case "applicantProfile": {
          sectionData.applicantSummary = `Applicant ${faker.person.fullName()} aged ${faker.number.int({
            min: 30,
            max: 55,
          })} years resides with family at ${faker.location.city()}.`;
          sectionData.familyMembers = [
            {
              name: faker.person.fullName(),
              relation: "Spouse",
              age: faker.number.int({ min: 28, max: 50 }),
              qualification: "Graduate",
              occupation: "Homemaker",
              income: "Dependent",
            },
            {
              name: faker.person.fullName(),
              relation: "Son",
              age: faker.number.int({ min: 8, max: 16 }),
              qualification: "School",
              occupation: "Student",
              income: "Dependent",
            },
            {
              name: faker.person.fullName(),
              relation: "Daughter",
              age: faker.number.int({ min: 6, max: 14 }),
              qualification: "School",
              occupation: "Student",
              income: "Dependent",
            },
          ];
          break;
        }
        case "businessProfile": {
          sectionData = [
            {
              detail: `Business operates under the name ${faker.company.name()} engaged in ${faker.helpers.arrayElement([
                "retail",
                "wholesale",
                "manufacturing",
                "service",
              ])} trading since ${faker.date
                .past({ years: 8 })
                .getFullYear()}.`,
            },
            {
              detail: `Average monthly turnover reported around Rs. ${faker.number
                .int({ min: 300000, max: 900000 })
                .toLocaleString("en-IN")}.` ,
            },
          ];
          break;
        }
        case "financialSummary": {
          sectionData.assessmentYear = `AY ${faker.date
            .past({ years: 2 })
            .getFullYear()}-${faker.date.past({ years: 1 }).getFullYear()}`;
          sectionData.turnover = faker.number.int({ min: 1500000, max: 8000000 });
          sectionData.netProfit = faker.number.int({ min: 200000, max: 1200000 });
          sectionData.netMarginPercent = `${faker.number.int({ min: 8, max: 25 })}%`;
          sectionData.documentsObserved = [
            "GST Certificate",
            "ITR Statement",
            "Bank Statement",
          ];
          sectionData.automationLevel =
            "POS billing with digital inventory tracking observed at site.";
          break;
        }
        case "relationships": {
          sectionData.customers = [
            {
              name: faker.company.name(),
              contactNumber: generateIndianPhone(),
            },
            {
              name: faker.company.name(),
              contactNumber: generateIndianPhone(),
            },
          ];
          sectionData.purchaseReferences = [
            {
              name: faker.company.name(),
              contactNumber: generateIndianPhone(),
            },
            {
              name: faker.company.name(),
              contactNumber: generateIndianPhone(),
            },
          ];
          sectionData.margins = `Applicant reports net margins around ${faker.number.int({
            min: 12,
            max: 22,
          })}% after expenses.`;
          sectionData.employeesCount = `${faker.number.int({
            min: 8,
            max: 20,
          })} workers on payroll and contract.`;
          sectionData.assets = "Owns commercial premises and delivery vehicle fleet.";
          break;
        }
        case "existingLoanDetails": {
          sectionData = [
            {
              financialInstitution: "HDFC Bank",
              loanAmount: faker.number.int({ min: 500000, max: 2000000 }),
              natureOfLoan: "Business Loan",
              emi: faker.number.int({ min: 12000, max: 35000 }),
            },
            {
              financialInstitution: "Axis Bank",
              loanAmount: faker.number.int({ min: 200000, max: 800000 }),
              natureOfLoan: "Vehicle Loan",
              emi: faker.number.int({ min: 8000, max: 20000 }),
            },
          ];
          break;
        }
        case "loanAnalysis": {
          sectionData.endUse = [
            "Expansion of manufacturing capacity",
            "Purchase of automated packaging line",
          ];
          sectionData.securityOffered = [
            "Equitable mortgage of residential property",
            "Hypothecation of machinery",
          ];
          sectionData.address = faker.location.streetAddress({ useFullAddress: true });
          sectionData.observations = [
            "Business premises observed to be active with staff present.",
            "Inventory levels adequate for current order book.",
          ];
          sectionData.concerns = [
            "Needs to strengthen bookkeeping practices.",
            "Recommend maintaining higher cash reserves.",
          ];
          sectionData.otherBusinessIncome = [
            "Rental income from commercial property: Rs. 25,000/- per month",
          ];
          sectionData.status = faker.helpers.arrayElement([
            "Positive",
            "Credit Refer",
            "Negative",
          ]);
          sectionData.place = faker.location.city();
          break;
        }
      }
    }

    if (schema.bankName === "IDFC PL") {
      switch (section.id) {
        case "general": {
          const coords = generateIndianCoordinates();
          sectionData = {
            nameOfTheApplicant: faker.person.fullName(),
            sdfcId: faker.string.numeric(12),
            personContacted: faker.person.fullName(),
            visitedAddress: generateIndianAddress(coords.cityName),
            dateOfVisitTimeOfVisit: `${faker.date
              .past({ years: 1 })
              .toLocaleDateString("en-GB")} / ${faker.helpers.arrayElement([
              "10:30 AM",
              "01:15 PM",
              "04:45 PM",
            ])}`,
            alternateContactNumberOfTheCustomerMobileLandline:
              generateIndianPhone(),
            maritalStatusMarriedDivorcedBachelor: faker.helpers.arrayElement([
              "Married",
              "Bachelor",
              "Divorced",
            ]),
            branch: `${coords.cityName} Branch`,
            location: coords.cityName,
            region: faker.helpers.arrayElement([
              "South",
              "North",
              "East",
              "West",
            ]),
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          break;
        }
        case "employmentDetails": {
          sectionData = {
            nameOfTheEmployer: faker.company.name(),
            typeOfFirmProprietorPartnershipPvtLtdGovtPsuMnc:
              faker.helpers.arrayElement([
                "Private Limited",
                "Partnership",
                "Proprietorship",
                "MNC",
              ]),
            numberOfEmployees: faker.helpers.arrayElement(["45", "120", "250"]),
            department: faker.helpers.arrayElement([
              "Technology",
              "Operations",
              "Finance",
            ]),
            designation: faker.helpers.arrayElement([
              "Associate Manager",
              "Senior Consultant",
              "Lead Engineer",
            ]),
            yearsInCurrentCompany: `${faker.number.int({
              min: 1,
              max: 8,
            })} years`,
            previousJobDetailsWorkExperienceTotalYearsOfExperience:
              `Overall experience of ${faker.number.int({
                min: 5,
                max: 12,
              })} years in IT services, including ${faker.helpers.arrayElement([
                "project management",
                "consulting",
                "software development",
              ])}.`,
            levelOfActivityStocksAlongWithObservations: "Not applicable",
            companyProfileServiceManufacturingSmallScaleFinanceOtherPleaseSpecify:
              faker.helpers.arrayElement([
                "IT Services",
                "Manufacturing Support",
                "Shared Services",
              ]),
            thirdPartyCheck: faker.helpers.arrayElement([
              "Positive",
              "Neutral",
            ]),
          };
          break;
        }
        case "incomeDetails": {
          sectionData.grossSalary = faker.number.int({
            min: 120000,
            max: 300000,
          });
          sectionData.netSalary = Math.round(sectionData.grossSalary * 0.82);
          sectionData.overtimeDetailsIfAny =
            "Occasional weekend shifts compensated as overtime.";
          sectionData.monthlyExpenses = faker.number.int({
            min: 60000,
            max: 90000,
          });
          sectionData.monthlyNetIncome =
            sectionData.netSalary - sectionData.monthlyExpenses / 2;
          sectionData.totalNoOfFamilyMembers = faker.number.int({
            min: 3,
            max: 5,
          });
          sectionData.earningFamilyMembersIncomeDetails = faker.number.int({
            min: 40000,
            max: 90000,
          });
          sectionData.noOfDependents = faker.number.int({ min: 1, max: 2 });
          sectionData.anyOtherSourceOfIncomeMonthlyAnnual = faker.number.int({
            min: 20000,
            max: 50000,
          });
          sectionData.salaryAccountBank = faker.helpers.arrayElement([
            "HDFC Bank",
            "ICICI Bank",
            "Axis Bank",
          ]);
          sectionData.salaryAccountNumber = faker.string.numeric(12);
          sectionData.salaryCreditMode = faker.helpers.arrayElement([
            "Bank Transfer",
            "Cheque",
          ]);
          sectionData.incomeObservation =
            "Salary slips and bank credits tally with declared earnings.";
          sectionData.familyMembers = [
            {
              name: faker.person.fullName(),
              relationshipWithApplicant: "Spouse",
              age: faker.number.int({ min: 28, max: 40 }),
              qualification: "Graduate",
              occupation: "Homemaker",
              incomeDetailsDependent: "Dependent",
            },
            {
              name: faker.person.fullName(),
              relationshipWithApplicant: "Child",
              age: faker.number.int({ min: 5, max: 12 }),
              qualification: "School",
              occupation: "Student",
              incomeDetailsDependent: "Dependent",
            },
          ];
          break;
        }
        case "documentsObserved": {
          sectionData.residenceDocuments = [
            "Electricity bill - August 2025",
            "Society maintenance receipt",
          ];
          sectionData.officeDocuments = [
            "Employee ID card",
            "Latest salary slip",
            "HR confirmation email",
          ];
          break;
        }
        case "bankingDetails": {
          sectionData = {
            bankingRelationshipWith: faker.helpers.arrayElement([
              "IDFC FIRST Bank",
              "HDFC Bank",
              "ICICI Bank",
            ]),
            cashCreditLimit: faker.number.int({ min: 100000, max: 400000 }),
            overdraftLimit: faker.number.int({ min: 50000, max: 200000 }),
          };
          break;
        }
        case "obligationsLoans": {
          sectionData.loans = [
            {
              institutionBankNbfcName: "HDFC Bank",
              typeOfLoan: "Home Loan",
              monthlyPrincipalEmi: faker.number.int({
                min: 18000,
                max: 32000,
              }),
              loanAmount: faker.number.int({ min: 1500000, max: 3500000 }),
            },
            {
              institutionBankNbfcName: "Axis Bank",
              typeOfLoan: "Car Loan",
              monthlyPrincipalEmi: faker.number.int({
                min: 8000,
                max: 15000,
              }),
              loanAmount: faker.number.int({ min: 500000, max: 900000 }),
            },
          ];
          sectionData.totalMonthlyCommitment = sectionData.loans.reduce(
            (sum, loan) => sum + (loan.monthlyPrincipalEmi || 0),
            0
          );
          break;
        }
        case "residenceDetails": {
          sectionData = {
            currentResidenceOwnedRentedParentsHouseRelativesHouseCompanyProvided:
              faker.helpers.arrayElement([
                "Owned",
                "Company Provided",
                "Rented",
              ]),
            yearsAtCurrentResidence: faker.number.int({ min: 2, max: 8 }),
            residenceObservation:
              "Well maintained gated community apartment with adequate furnishing.",
            assetsOwnedList: [
              "2 BHK Apartment at city outskirts",
              "Sedan vehicle - 2023 model",
              "Two-wheeler for commute",
            ],
            fourWheelerMakeModel: faker.helpers.arrayElement([
              "Hyundai Creta 2023",
              "Maruti Grand Vitara 2024",
              "Honda City 2022",
            ]),
            twoWheelerMakeModel: faker.helpers.arrayElement([
              "Honda Activa 6G",
              "TVS Jupiter",
              "Suzuki Access",
            ]),
          };
          break;
        }
        case "loanDetailsBil": {
          sectionData = {
            loanAmountApplied: faker.number.int({ min: 500000, max: 1500000 }),
            endUse: faker.helpers.arrayElement([
              "Home renovation",
              "Higher education expenses",
              "Family function",
              "Medical contingency buffer",
            ]),
            interviewDetails:
              "Applicant cooperated during PD visit and provided all supporting documents.",
            nameOfInterviewer: faker.person.fullName(),
            designationSignature: faker.helpers.arrayElement([
              "Senior PD Officer",
              "Associate Verification Executive",
            ]),
            statusOfThisCasePositiveNegativeCreditRefer: faker.helpers.arrayElement(
              ["Positive", "Credit Refer"]
            ),
            interviewerSRemarks:
              "Income and banking pattern corroborates declared profile. Recommend approval subject to policy checks.",
          };
          break;
        }
      }
    }

    if (schema.bankName === "India Shelter Salaried") {
      switch (section.id) {
        case "generalInfo": {
          const coords = generateIndianCoordinates();
          sectionData = {
            loanNumber: `IS${faker.string.numeric(6)}`,
            branch: `${coords.cityName} Branch`,
            region: faker.helpers.arrayElement(["North", "South", "East", "West"]),
            location: coords.cityName,
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          break;
        }
        case "basicDetails": {
          sectionData = {
            loanProduct: faker.helpers.arrayElement(["HL", "LAP", "HL/LAP"]),
            meetingPerson: faker.person.fullName(),
            applicantName: faker.person.fullName(),
            applicantDob: faker.date.past({ years: 30 }).toISOString(),
            maritalStatus: faker.helpers.arrayElement([
              "Single",
              "Married",
              "Divorced",
              "Other",
            ]),
            spouseName: faker.person.fullName(),
            spouseDob: faker.date.past({ years: 25 }).toISOString(),
            spouseWorkDetails:
              "Spouse manages a boutique and contributes part-time to household income.",
            qualification: faker.helpers.arrayElement([
              "Graduate",
              "PG",
              "Professional Certification",
            ]),
            category: faker.helpers.arrayElement(["General", "OBC"]),
            totalFamilyMembers: faker.number.int({ min: 3, max: 6 }),
            nonEarningMembers: faker.number.int({ min: 0, max: 2 }),
            dependentsChildren: faker.number.int({ min: 1, max: 3 }),
            dependentsAdults: faker.number.int({ min: 0, max: 2 }),
            dependentsOthers: faker.number.int({ min: 0, max: 1 }),
          };
          break;
        }
        case "residenceDetails": {
          sectionData = {
            residenceAddress: generateIndianAddress(faker.location.city()),
            yearsAtCurrentResidence: faker.number.int({ min: 1, max: 12 }),
            areaSqft: `${faker.number.int({ min: 600, max: 1500 })} sq.ft`,
            monthlyRentDeposit: faker.number.int({ min: 15000, max: 45000 }),
            purchasePriceMv: faker.number.int({ min: 2000000, max: 6500000 }),
            yearsInCurrentCity: faker.helpers.arrayElement([
              "<=3 Years",
              ">3 Years",
            ]),
          };
          break;
        }
        case "financialProfile": {
          sectionData = {
            otherIncome:
              "Rental income from parental property and quarterly incentives from employer.",
            netWorth:
              "Own car valued at Rs. 6.5 Lakhs and mutual fund investments worth Rs. 4 Lakhs.",
            existingRelationshipWithIndiashelter: faker.helpers.arrayElement([
              "Existing HL customer since 2022",
              "Fresh relationship",
              "Worked with branch for earlier LAP enquiry",
            ]),
            creditCardDetails:
              "Uses HDFC Diners Club and SBI Signature cards with disciplined repayments.",
            monthlyHouseholdExpenses: faker.number.int({
              min: 45000,
              max: 85000,
            }),
          };
          break;
        }
        case "loanPurpose": {
          sectionData = {
            purposes: faker.helpers.arrayElements(
              [
                "Flat Purchase",
                "House Purchase",
                "Plot Purchase",
                "Construction of Residential House Property",
                "Business Development",
                "Improvement / Extension",
                "Balance Transfer",
                "Plot + Construction",
              ],
              { min: 1, max: 3 }
            ),
            otherPurpose:
              "Consolidate existing small debts and upgrade residential interiors.",
            minimumLoanAmount: faker.number.int({ min: 1500000, max: 3500000 }),
            tenureRequired: `${faker.number.int({ min: 5, max: 15 })} years`,
            comfortableEmi: faker.number.int({ min: 25000, max: 45000 }),
          };
          break;
        }
        case "collateralDetails": {
          sectionData = {
            propertyStatus: faker.helpers.arrayElement([
              "Ready to Move",
              "Under Construction",
              "Construction Yet to Start",
            ]),
            usageAfterPurchase: faker.helpers.arrayElements(
              ["Self-Occupancy", "Investment", "Renting Purpose", "Others"],
              { min: 1, max: 2 }
            ),
            usageOtherNotes: "Will lease top floor to cover part of EMI.",
            propertyAddress: generateIndianAddress(faker.location.city()),
            propertyAreaSqft: `${faker.number.int({ min: 900, max: 1800 })} sq.ft`,
            ownershipDuration: `${faker.number.int({ min: 0, max: 5 })} years`,
            agreementValue: faker.number.int({ min: 2500000, max: 5500000 }),
            ownContribution: faker.number.int({ min: 500000, max: 1500000 }),
          };
          break;
        }
        case "references": {
          sectionData.references = [
            {
              name: faker.person.fullName(),
              address: generateIndianAddress(faker.location.city()),
              relationship: "Colleague",
              contactNumber: generateIndianPhone(),
              email: faker.internet.email().toLowerCase(),
              yearsKnown: faker.number.int({ min: 2, max: 8 }),
            },
            {
              name: faker.person.fullName(),
              address: generateIndianAddress(faker.location.city()),
              relationship: "Neighbour",
              contactNumber: generateIndianPhone(),
              email: faker.internet.email().toLowerCase(),
              yearsKnown: faker.number.int({ min: 5, max: 12 }),
            },
          ];
          break;
        }
        case "employerDetails": {
          sectionData = {
            existingRelationshipWithIndiashelter:
              "Visited branch for prior LAP enquiry in 2023.",
            employerName: `${faker.company.name()} Pvt Ltd`,
            employerAddress: `${faker.location.streetAddress({
              useFullAddress: true,
            })}`,
            designation: faker.helpers.arrayElement([
              "Senior Analyst",
              "Team Lead",
              "Project Manager",
            ]),
            salaryGross: faker.number.int({ min: 180000, max: 320000 }),
            salaryNet: faker.number.int({ min: 120000, max: 220000 }),
            yearsInPresentEmployment: faker.number.int({ min: 2, max: 10 }),
            jobProfile:
              "Responsible for managing regional sales operations and corporate client onboarding.",
            companyOverview:
              "Company specialises in housing finance support services with pan-India presence.",
            officeGeoTag: `${faker.helpers.arrayElement([
              "17.4435° N, 78.3772° E",
              "12.9716° N, 77.5946° E",
              "19.0760° N, 72.8777° E",
            ])}`,
            previousEmployment:
              "Worked with ABC Finserve as Relationship Manager from 2018 to 2021.",
          };
          break;
        }
        case "familyMembers": {
          sectionData.familyMembers = faker.datatype.boolean()
            ? [
                {
                  name: faker.person.fullName(),
                  relationWithApplicant: "Spouse",
                  age: faker.number.int({ min: 28, max: 40 }),
                  occupation: "Homemaker",
                  educationalQualification: "Graduate",
                  contactNumber: generateIndianPhone(),
                  stayingWithApplicant: "Yes",
                },
                {
                  name: faker.person.fullName(),
                  relationWithApplicant: "Father",
                  age: faker.number.int({ min: 55, max: 68 }),
                  occupation: "Retired Govt Employee",
                  educationalQualification: "B.Sc",
                  contactNumber: generateIndianPhone(),
                  stayingWithApplicant: "No",
                },
              ]
            : [];
          break;
        }
        case "currentLoanDetails": {
          sectionData.currentLoans = [
            {
              bankName: "HDFC Bank",
              loanType: "Auto Loan",
              sanctionAmount: faker.number.int({ min: 600000, max: 1200000 }),
              emi: faker.number.int({ min: 12000, max: 22000 }),
              emisPaid: faker.number.int({ min: 6, max: 30 }),
              balanceTenor: `${faker.number.int({ min: 12, max: 36 })} months`,
            },
            {
              bankName: "Bajaj Finance",
              loanType: "Personal Loan",
              sanctionAmount: faker.number.int({ min: 200000, max: 500000 }),
              emi: faker.number.int({ min: 6000, max: 15000 }),
              emisPaid: faker.number.int({ min: 4, max: 18 }),
              balanceTenor: `${faker.number.int({ min: 10, max: 24 })} months`,
            },
          ];
          break;
        }
        case "bankingDetails": {
          sectionData.bankingAccounts = [
            {
              bankName: "ICICI Bank",
              accountNumber: faker.finance.accountNumber(),
              accountType: "Savings",
              branchName: `${faker.location.city()} Main`,
              operatingSinceYears: `${faker.number.int({ min: 3, max: 12 })} yrs`,
            },
            {
              bankName: "Axis Bank",
              accountNumber: faker.finance.accountNumber(),
              accountType: "Current",
              branchName: `${faker.location.city()} Commercial`,
              operatingSinceYears: `${faker.number.int({ min: 1, max: 5 })} yrs`,
            },
          ];
          break;
        }
        case "tpcDetails": {
          sectionData.officeReferences = [
            {
              name: faker.person.fullName(),
              mobileNumber: generateIndianPhone(),
              knowingSince: `${faker.number.int({ min: 2, max: 7 })} years`,
              feedback: faker.helpers.arrayElement([
                "Positive",
                "Neutral",
                "Negative",
              ]),
              comments:
                "Confirms punctuality and satisfactory conduct at workplace.",
            },
            {
              name: faker.person.fullName(),
              mobileNumber: generateIndianPhone(),
              knowingSince: `${faker.number.int({ min: 1, max: 5 })} years`,
              feedback: faker.helpers.arrayElement([
                "Positive",
                "Neutral",
              ]),
              comments: "Maintains cordial relationship with colleagues.",
            },
          ];
          break;
        }
        case "documentVerification": {
          sectionData.documents = [
            {
              documentType: "Salary Slip",
              documentStatus: "Original",
              crossChecked: "Yes",
              comments: "Verified with HR issued pay slip.",
            },
            {
              documentType: "Bank Statement",
              documentStatus: "Copy",
              crossChecked: "Yes",
              comments: "Matches declared salary credits.",
            },
            {
              documentType: "Residence Proof",
              documentStatus: "Original",
              crossChecked: "Yes",
              comments: "Electricity bill provided.",
            },
          ];
          break;
        }
        case "pdOfficerReview": {
          sectionData = {
            majorObservations:
              "Residence is well maintained. Applicant demonstrated clear repayment plan.",
            caseStrengths:
              "Stable employment history, clean banking relationship, supportive family structure.",
            caseWeakness:
              "High dependency on single income; advise monitoring for additional liabilities.",
            pdStatus: faker.helpers.arrayElement([
              "Positive",
              "Negative",
              "Referred",
            ]),
            pdOfficerName: faker.person.fullName(),
            visitDate: faker.date.recent({ days: 15 }).toISOString(),
            visitTime: faker.helpers.arrayElement([
              "10:15 AM",
              "02:45 PM",
              "05:30 PM",
            ]),
            officerSignature: "Digitally signed by Kowtha & Co.",
          };
          break;
        }
      }
    }

    if (schema.bankName === "India Shelter SENP") {
      const coords = generateIndianCoordinates();
      switch (section.id) {
        case "generalInfo": {
          sectionData = {
            loanNumber: `SENP${faker.string.numeric(6)}`,
            branch: `${coords.cityName} Branch`,
            region: faker.helpers.arrayElement(["North", "South", "East", "West"]),
            location: coords.cityName,
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          break;
        }
        case "basicDetails": {
          sectionData = {
            personMet: faker.person.fullName(),
            loanProduct: faker.helpers.arrayElement(["HL", "LAP", "HL/LAP"]),
            applicantName: faker.person.fullName(),
            maritalStatus: faker.helpers.arrayElement([
              "Single",
              "Married",
              "Divorced",
              "Other",
            ]),
            educationalQualification: faker.helpers.arrayElement([
              "Graduate",
              "PG",
              "Professional Certification",
            ]),
            category: faker.helpers.arrayElement(["General", "OBC", "SC"]),
            totalFamilyMembers: faker.number.int({ min: 3, max: 6 }),
            dependentsChildren: faker.number.int({ min: 1, max: 3 }),
            dependentsAdults: faker.number.int({ min: 0, max: 2 }),
            dependentsOthers: faker.number.int({ min: 0, max: 1 }),
          };
          break;
        }
        case "residenceDetails": {
          sectionData = {
            residenceAddress: generateIndianAddress(coords.cityName),
            yearsAtCurrentResidence: faker.number.int({ min: 1, max: 15 }),
            areaSqft: `${faker.number.int({ min: 800, max: 1800 })} sq.ft`,
            monthlyRentDeposit: faker.number.int({ min: 12000, max: 40000 }),
            purchasePriceMv: faker.number.int({ min: 1800000, max: 5200000 }),
            yearsInCurrentCity: faker.helpers.arrayElement(["<=3 Years", ">3 Years"]),
            parentsStayingWith: faker.helpers.arrayElement(["Self", "Separate", "Expired"]),
            nativePlace: faker.location.city(),
            electricityBillInCustomerName: faker.helpers.arrayElement(["Yes", "No"]),
          };
          break;
        }
        case "assetChecklist": {
          const yesNo = () => faker.helpers.arrayElement(["Yes", "No"]);
          sectionData = {
            assetsOwned:
              "Owns residential house and small commercial shop used for business operations.",
            smartphone: yesNo(),
            washingMachine: yesNo(),
            car: yesNo(),
            twoWheeler: "Yes",
            computerLaptop: yesNo(),
            ac: yesNo(),
            fridge: "Yes",
            induction: yesNo(),
          };
          break;
        }
        case "financialAssets": {
          sectionData = {
            fixedDeposits: `Rs. ${faker.number.int({ min: 50000, max: 200000 }).toLocaleString("en-IN")} maturing in 2027`,
            mutualFunds: `${faker.helpers.arrayElement(["Equity", "Hybrid"])} fund worth Rs. ${faker.number
              .int({ min: 75000, max: 250000 })
              .toLocaleString("en-IN")}`,
            sharesStocks: `${faker.company.name()} - ${faker.number
              .int({ min: 10, max: 120 })
              .toLocaleString("en-IN")} shares`,
            insurance: `Term plan / Rs. ${faker.number
              .int({ min: 1500000, max: 3500000 })
              .toLocaleString("en-IN")}`,
            otherInvestments: "Recurring deposits and gold bonds maintained jointly with spouse.",
            postOfficeSavings: faker.helpers.arrayElement(["Yes", "No"]),
            recurringDeposit: faker.helpers.arrayElement(["Yes", "No"]),
          };
          break;
        }
        case "landAssets": {
          sectionData.plots = [
            {
              totalArea: `${faker.number.int({ min: 2, max: 6 })} guntas`,
              location: generateIndianAddress(faker.location.city()),
              landType: faker.helpers.arrayElement([
                "Agricultural",
                "Commercial",
                "Residential",
              ]),
              marketValue: faker.number.int({ min: 450000, max: 1600000 }),
            },
          ];
          break;
        }
        case "houseAssets": {
          sectionData.houses = [
            {
              builtUpArea: `${faker.number.int({ min: 900, max: 1600 })} sq.ft`,
              location: generateIndianAddress(faker.location.city()),
              occupancyStatus: faker.helpers.arrayElement(["Self-occupied", "Rented"]),
              monthlyIncomeIfRented: faker.number.int({ min: 8000, max: 25000 }),
              marketValue: faker.number.int({ min: 1800000, max: 4200000 }),
            },
          ];
          break;
        }
        case "shopAssets": {
          sectionData.shops = faker.datatype.boolean()
            ? [
                {
                  area: `${faker.number.int({ min: 250, max: 600 })} sq.ft`,
                  location: generateIndianAddress(faker.location.city()),
                  occupancyStatus: "Self-occupied",
                  monthlyIncomeIfRented: 0,
                  marketValue: faker.number.int({ min: 900000, max: 2400000 }),
                },
              ]
            : [];
          break;
        }
        case "vehicleAssets": {
          sectionData.vehicles = [
            {
              makeModel: faker.helpers.arrayElement([
                "Mahindra Bolero 2022",
                "Tata Ace 2023",
                "Maruti Eeco 2021",
              ]),
              purpose: faker.helpers.arrayElement(["Commercial", "Personal"]),
              marketValue: faker.number.int({ min: 350000, max: 850000 }),
            },
          ];
          break;
        }
        case "preciousMetals": {
          sectionData.holdings = [
            {
              totalQuantity: `${faker.number.int({ min: 50, max: 180 })} gms`,
              form: faker.helpers.arrayElement(["Jewellery", "Coins"]),
              marketValue: faker.number.int({ min: 250000, max: 600000 }),
            },
          ];
          break;
        }
        case "livestockAssets": {
          sectionData.livestock = faker.datatype.boolean()
            ? [
                {
                  typeOfAnimals: "Dairy cattle",
                  quantity: "3",
                  purpose: "Dairy",
                  totalValue: faker.number.int({ min: 120000, max: 240000 }),
                  monthlyIncome: faker.number.int({ min: 15000, max: 28000 }),
                  maintenanceCosts: faker.number.int({ min: 6000, max: 12000 }),
                },
              ]
            : [];
          break;
        }
        case "businessDetails": {
          sectionData = {
            businessName: `${faker.person.lastName()} Enterprises`,
            businessFirmType: faker.helpers.arrayElement([
              "Proprietorship",
              "Partnership",
              "PVT LTD",
            ]),
            shareholding: "Partner holds 60% with spouse holding 40%",
            partners: [faker.person.fullName(), faker.person.fullName()],
            commencementDate: "12/06/2018",
            placeOfIncorporation: generateIndianAddress(faker.location.city()),
            pdAddress: generateIndianAddress(coords.cityName),
            totalWorkExperienceYears: faker.number.int({ min: 5, max: 18 }),
            mobileNumber: generateIndianPhone(),
            natureOfBusiness:
              "Wholesale distribution of agricultural equipment and micro-irrigation spares.",
            industryType: faker.helpers.arrayElement([
              "Trading",
              "Manufacturer",
              "Services",
            ]),
            businessProfile:
              "Operates through owned retail outlet supplying to neighbourhood farmers with seasonal demand spikes during monsoon.",
            premisesOwnership: faker.helpers.arrayElement([
              "Self-Owned",
              "Family-Owned",
              "Rented",
            ]),
            stocksAssetsSeen: "Power tillers, drip kits and diesel pumps displayed at store.",
            businessLocality: faker.helpers.arrayElement([
              "Commercial",
              "Residential",
              "Industrial",
            ]),
            annualTurnover: faker.number.int({ min: 2500000, max: 6500000 }),
            netProfitMargin: `${faker.number.int({ min: 8, max: 18 })}%`,
            businessSeasonal: faker.helpers.arrayElement(["Yes", "No"]),
            numberOfEmployees: faker.number.int({ min: 2, max: 8 }),
            yearsAtCurrentPremises: faker.number.int({ min: 1, max: 10 }),
            competitorsNearby: faker.number.int({ min: 2, max: 6 }),
            businessStartedBy: faker.helpers.arrayElement([
              "Self",
              "Father",
              "Other Family Members",
            ]),
            initialFundingSource: faker.helpers.arrayElement([
              "Own Funding",
              "Borrowed from Family",
              "Loan",
            ]),
            customerGeoTag: `${coords.latitude}, ${coords.longitude}`,
          };
          break;
        }
        case "businessIncome": {
          const sales = faker.number.int({ min: 350000, max: 700000 });
          const receipts = faker.number.int({ min: 200000, max: 500000 });
          const purchases = faker.number.int({ min: 180000, max: 360000 });
          const rent = faker.number.int({ min: 8000, max: 20000 });
          const electricity = faker.number.int({ min: 5000, max: 12000 });
          const transportation = faker.number.int({ min: 9000, max: 22000 });
          const otherExpenses = faker.number.int({ min: 15000, max: 30000 });
          const totalRevenue = sales + receipts;
          const totalExpenses = purchases + rent + electricity + transportation + otherExpenses;
          sectionData = {
            sales,
            receipts,
            purchases,
            rent,
            electricity,
            transportation,
            otherExpenses,
            totalMonthlyRevenue: totalRevenue,
            totalMonthlyExpenses: totalExpenses,
            netMonthlyProfit: totalRevenue - totalExpenses,
          };
          break;
        }
        case "otherMonthlyIncome": {
          sectionData = {
            rentalIncomeCash: faker.number.int({ min: 5000, max: 15000 }),
            rentalIncomeCheque: faker.number.int({ min: 4000, max: 12000 }),
            incentivesCash: faker.number.int({ min: 2000, max: 7000 }),
            incentivesCheque: faker.number.int({ min: 2000, max: 6000 }),
            monthlyBonusCash: faker.number.int({ min: 1000, max: 4000 }),
            monthlyBonusCheque: faker.number.int({ min: 1000, max: 4000 }),
            otherIncomeCash: faker.number.int({ min: 1500, max: 5000 }),
            otherIncomeCheque: faker.number.int({ min: 1000, max: 4000 }),
          };
          break;
        }
        case "loanPurpose": {
          sectionData = {
            purposes: faker.helpers.arrayElements(
              [
                "Flat Purchase",
                "House Purchase",
                "Plot Purchase",
                "Construction of Residential House Property",
                "Business development",
                "Improvement/Extension",
                "Balance Transfer",
                "Plot + Construction",
              ],
              { min: 1, max: 3 }
            ),
            minimumLoanAmount: faker.number.int({ min: 1000000, max: 3000000 }),
            tenureRequired: `${faker.number.int({ min: 5, max: 15 })} years`,
            monthlyHouseholdExpenses: faker.number.int({ min: 35000, max: 70000 }),
            comfortableEmi: faker.number.int({ min: 22000, max: 42000 }),
          };
          break;
        }
        case "collateralDetails": {
          sectionData = {
            propertyStatus: faker.helpers.arrayElement([
              "Ready to move",
              "Under Construction",
              "Construction Yet to Start",
            ]),
            usageAfterPurchase: faker.helpers.arrayElements(
              ["Self-Occupancy", "Investment", "Renting Purpose"],
              { min: 1, max: 2 }
            ),
            usageOtherNotes: "Will lease part of property for warehouse operations.",
            propertyAddress: generateIndianAddress(faker.location.city()),
            propertyArea: `${faker.number.int({ min: 900, max: 1800 })} sq.ft`,
            ownershipDuration: `${faker.number.int({ min: 0, max: 6 })} years`,
            agreementValue: faker.number.int({ min: 2000000, max: 4500000 }),
            ownContribution: faker.number.int({ min: 400000, max: 1200000 }),
          };
          break;
        }
        case "currentLoanDetails": {
          sectionData.currentLoans = [
            {
              bankName: "HDFC Bank",
              loanType: "Business Loan",
              sanctionAmount: faker.number.int({ min: 700000, max: 1500000 }),
              emi: faker.number.int({ min: 15000, max: 28000 }),
              emisPaid: faker.number.int({ min: 6, max: 24 }),
              balanceTenor: `${faker.number.int({ min: 12, max: 36 })} months`,
            },
            {
              bankName: "Bajaj Finance",
              loanType: "Vehicle Loan",
              sanctionAmount: faker.number.int({ min: 300000, max: 600000 }),
              emi: faker.number.int({ min: 7000, max: 15000 }),
              emisPaid: faker.number.int({ min: 4, max: 18 }),
              balanceTenor: `${faker.number.int({ min: 10, max: 24 })} months`,
            },
          ];
          break;
        }
        case "costAndFunds": {
          sectionData = {
            fundsRequired: faker.number.int({ min: 1500000, max: 3500000 }),
            ownFundsSource: "Own savings, chit funds and family support.",
            purchaseCost: faker.number.int({ min: 1200000, max: 2200000 }),
            savings: faker.number.int({ min: 300000, max: 800000 }),
            constructionEstimate: faker.number.int({ min: 400000, max: 900000 }),
            totalTransactionCost: faker.number.int({ min: 2200000, max: 4200000 }),
          };
          break;
        }
        case "bankingDetails": {
          sectionData.bankingAccounts = [
            {
              bankName: "ICICI Bank",
              accountNumber: faker.finance.accountNumber(),
              branch: `${faker.location.city()} Main`,
              accountType: "Savings",
              operatingSinceYears: `${faker.number.int({ min: 3, max: 12 })} yrs`,
            },
            {
              bankName: "State Bank of India",
              accountNumber: faker.finance.accountNumber(),
              branch: `${faker.location.city()} Bazaar`,
              accountType: "Current",
              operatingSinceYears: `${faker.number.int({ min: 1, max: 5 })} yrs`,
            },
          ];
          break;
        }
        case "otherFamilyMembers": {
          sectionData.familyMembers = faker.datatype.boolean()
            ? [
                {
                  name: faker.person.fullName(),
                  relationWithApplicant: "Spouse",
                  age: faker.number.int({ min: 28, max: 40 }),
                  occupation: "Handles accounts for the business",
                  educationalQualification: "B.Com",
                  contactNumber: generateIndianPhone(),
                  stayingWithApplicant: "Yes",
                },
                {
                  name: faker.person.fullName(),
                  relationWithApplicant: "Brother",
                  age: faker.number.int({ min: 24, max: 32 }),
                  occupation: "Logistics support",
                  educationalQualification: "Diploma",
                  contactNumber: generateIndianPhone(),
                  stayingWithApplicant: "No",
                },
              ]
            : [];
          break;
        }
        case "references": {
          sectionData.references = [
            {
              referenceName: faker.person.fullName(),
              address: generateIndianAddress(faker.location.city()),
              relationship: "Supplier",
              contactNumber: generateIndianPhone(),
              email: faker.internet.email().toLowerCase(),
              yearsKnown: faker.number.int({ min: 3, max: 10 }),
              photoWithApplicant: "Yes",
            },
            {
              referenceName: faker.person.fullName(),
              address: generateIndianAddress(faker.location.city()),
              relationship: "Major customer",
              contactNumber: generateIndianPhone(),
              email: faker.internet.email().toLowerCase(),
              yearsKnown: faker.number.int({ min: 2, max: 8 }),
              photoWithApplicant: "Pending",
            },
          ];
          break;
        }
        case "tpcDetails": {
          sectionData.businessReferences = [
            {
              name: faker.person.fullName(),
              address: generateIndianAddress(faker.location.city()),
              mobileNumber: generateIndianPhone(),
              knowingSince: `${faker.number.int({ min: 2, max: 7 })} years`,
              feedback: faker.helpers.arrayElement([
                "Positive",
                "Neutral",
                "Negative",
              ]),
            },
            {
              name: faker.person.fullName(),
              address: generateIndianAddress(faker.location.city()),
              mobileNumber: generateIndianPhone(),
              knowingSince: `${faker.number.int({ min: 1, max: 5 })} years`,
              feedback: faker.helpers.arrayElement(["Positive", "Neutral"]),
            },
          ];
          break;
        }
        case "pdOfficerReview": {
          sectionData = {
            majorObservations:
              "Business premises active with inventory turnover; maintains ledger of daily sales.",
            caseStrengths:
              "Long-standing clientele, diversified revenue sources, adequate collateral coverage.",
            caseWeakness:
              "Working capital heavily dependent on seasonal demand; new competitor nearby.",
            pdStatus: faker.helpers.arrayElement(["Positive", "Referred"]),
            pdOfficerName: faker.person.fullName(),
            visitDate: faker.date.recent({ days: 20 }).toISOString(),
            visitTime: faker.helpers.arrayElement(["11:45 AM", "03:30 PM", "06:10 PM"]),
            officerSignature: "Digitally signed by Kowtha & Co.",
          };
          break;
        }
      }
    }

    if (schema.bankName === "Axis Agri") {
      switch (section.id) {
        case "generalInfo": {
          sectionData = {
            referenceNumber: faker.string.numeric(8),
            nameOfFirm: `${faker.person.lastName()} Agro Traders`,
            constitution: faker.helpers.arrayElement([
              "Proprietorship",
              "Partnership",
              "Private Limited",
            ]),
            incorporationDate: faker.date
              .past({ years: 10 })
              .toISOString()
              .split("T")[0],
            latitude: generateIndianCoordinates().latitude,
            longitude: generateIndianCoordinates().longitude,
            region: faker.helpers.arrayElement(["West", "North", "South", "East"]),
            location: faker.location.city(),
            branch: `${faker.location.city()} Branch`,
          };
          break;
        }
        case "pdVisitDetails": {
          sectionData = {
            addressOfFirm: generateIndianAddress(faker.location.city()),
            dateAndTimeOfPd: `${faker.date.recent({ days: 20 }).toISOString().split("T")[0]} / ${faker.helpers.arrayElement([
              "10:30 AM",
              "02:15 PM",
              "05:45 PM",
            ])}`,
            placeOfPd: faker.location.city(),
            nameOfPersonMet: faker.person.fullName(),
            designation: faker.helpers.arrayElement([
              "Proprietor",
              "Partner",
              "Operations Head",
            ]),
            nameOfPdOfficial: faker.person.fullName(),
          };
          break;
        }
        case "businessProfile": {
          sectionData = {
            typeOfIndustry: "Agriculture",
            natureOfBusiness: faker.helpers.arrayElement([
              "Manufacturing",
              "Trading",
              "Service",
            ]),
            managementDetails:
              "Managed by promoter family with clear division of procurement and sales responsibilities.",
            totalExperience: `${faker.number.int({ min: 5, max: 18 })} years in agri input trade`,
            shareholdingDetails:
              "Mr. Rao holds 60% stake while Mrs. Rao holds the balance.",
            businessLocality: faker.helpers.arrayElement([
              "Commercial",
              "Industrial",
              "Agricultural Hub",
            ]),
            premiseSetup:
              "Own premises with visible name board, godown at backyard and three staff members.",
            financialBrief:
              "Business clocked steady growth with average margin of 14% over last 3 years.",
            financeTurnover: faker.number.int({ min: 3000000, max: 9000000 }),
            collateralSecurityDetails:
              "Residential house at Vijayawada and godown property offered as collateral.",
            currentAccountIfAny: "Axis Bank - Vijayawada Main (since 2018)",
            existingBankingRelationsWithAxisIfAny:
              "Maintains current account and tractor loan with Axis since 2019.",
          };
          break;
        }
        case "bankingAndWorkingCapital": {
          sectionData.facilities = [
            {
              bankName: "State Bank of India",
              limitType: "Cash Credit",
              limitAmount: faker.number.int({ min: 800000, max: 1500000 }),
            },
            {
              bankName: "Axis Bank",
              limitType: "Term Loan",
              limitAmount: faker.number.int({ min: 500000, max: 900000 }),
            },
          ];
          sectionData.additionalDetails =
            "Banking conduct satisfactory; TOD of Rs. 2 Lakhs availed during kharif season and regularised on time.";
          sectionData.takeoverRemarks = faker.helpers.arrayElement([
            "Fresh proposal",
            "Takeover from SBI",
          ]);
          sectionData.otherLoanObligations =
            "Separate tractor loan outstanding of Rs. 3.2 Lakhs with 22 EMIs pending.";
          break;
        }
        case "suppliersClients": {
          sectionData.suppliersClients = [
            {
              suppliers: "IFFCO, Coromandel Fertilisers, Jain Irrigation",
              clients: "Local farmers of Krishna district, two agri cooperatives",
            },
            {
              suppliers: "Mahindra Agro",
              clients: "Retail agri store network in Guntur",
            },
          ];
          break;
        }
        case "observations": {
          sectionData = {
            stocksRawMaterialObservations:
              "Fertilisers and irrigation equipment neatly stacked; inventory records maintained manually.",
            covidImpact:
              "Demand dipped during lockdown but recovered quickly with government subsidy programmes.",
            familyBackgroundNetWorth:
              "Promoter family owns two residential properties and farmland measuring 3 acres.",
            businessSuccessionPlan:
              "Son undergoing agri-management course to join business within a year.",
            qualificationOfPromoters:
              "Promoter is B.Sc Agriculture; spouse manages finances with M.Com background.",
            thirdPartyChecks:
              "Neighbouring businesses confirmed good repayment behaviour and reputation.",
            leaseLandVerification:
              "Lease agreement for additional storage land verified with local panchayat records.",
            remarksObservations:
              "Business enjoys seasonal peaks; recommend monitoring utilisation of limits to avoid overstocking.",
            pdFinalStatus: faker.helpers.arrayElement([
              "Positive",
              "Referred",
            ]),
            pdVendorDetails: "Kowtha & Co., Vijayawada",
            pdVendorStamp: "Digitally signed",
          };
          break;
        }
      }
    }

    if (schema.bankName === "SMFG SME") {
      switch (section.id) {
        case "generalInfo": {
          sectionData = {
            branchName: faker.location.city().toUpperCase(),
            applicationReferenceNo: faker.string.numeric(7),
            applicantName: `Mr. ${faker.person.lastName().toUpperCase()}`,
            applicantOfficeAddress: generateIndianAddress(faker.location.city()),
            personMetName: faker.person.fullName(),
            personMetDesignation: faker.helpers.arrayElement([
              "Proprietor",
              "Partner",
              "Manager",
            ]),
            personMetMobileNo: generateIndianPhone(),
          };
          break;
        }
        case "personalInformation": {
          sectionData.familyMembers = [
            {
              name: faker.person.fullName(),
              age: faker.number.int({ min: 28, max: 55 }),
              occupation: "Housewife",
              isDependent: "Yes",
            },
            {
              name: faker.person.fullName(),
              age: faker.number.int({ min: 18, max: 28 }),
              occupation: "Student",
              isDependent: "Yes",
            },
          ];
          sectionData.residenceAddress = generateIndianAddress(faker.location.city());
          sectionData.ownershipStatus = faker.helpers.arrayElement([
            "Self Owned",
            "Parental",
            "Rented",
          ]);
          sectionData.houseArea = `${faker.number.int({ min: 900, max: 1600 })} sq.ft`;
          sectionData.houseMarketValue = faker.number.int({ min: 2500000, max: 6000000 });
          sectionData.yearsAtResidence = faker.helpers.arrayElement([
            "By Birth",
            "10 Years",
            "6 Years",
          ]);
          sectionData.yearsInCity = faker.helpers.arrayElement([
            "By Birth",
            "8 Years",
            "12 Years",
          ]);
          sectionData.permanentAddress = generateIndianAddress(faker.location.city());
          sectionData.otherOwnedProperty = "Industrial plot at outskirts";
          sectionData.otherIncomeSources =
            "Rental income from residential property Rs. 12,000 per month.";
          break;
        }
        case "businessInformation": {
          sectionData = {
            businessName: `${faker.person.lastName()} Enterprises`,
            natureOfBusiness: faker.helpers.arrayElement([
              "Manufacturing of silk sarees",
              "Wholesale grocery trading",
              "Handicraft export",
            ]),
            constitution: faker.helpers.arrayElement([
              "Proprietorship",
              "Partnership",
            ]),
            partners: "Applicant (60%), Spouse (40%)",
            customerType: "General public, retail and wholesale shops",
            businessStartDate: "2000",
            promoterExperience: "25 years",
            stabilityYears: faker.number.int({ min: 8, max: 25 }),
            stabilityVerifiedBy: "GST, Trade license displayed",
            familyInvolved: "Spouse manages accounts",
            premisesOwnership: faker.helpers.arrayElement(["Owned", "Rented"]),
            premiseType: faker.helpers.arrayElement([
              "Market area",
              "High street",
              "Commercial complex",
            ]),
            isResidenceCumOffice: faker.helpers.arrayElement(["Yes", "No"]),
            nameBoardSeen: "Prominent LED signage with business name",
          };
          break;
        }
        case "financials": {
          sectionData = {
            monthlySales: faker.number.int({ min: 2000000, max: 3500000 }),
            percentSalesOnCredit: faker.number.int({ min: 0, max: 40 }),
            manufacturingProcess:
              "Procures raw silk from Karnataka, dyes and weaves sarees using power looms and distributes to wholesale buyers.",
            salesConcentration: "No single customer above 20% of total sales",
            businessCycleDebtors:
              "Average credit of 30 days; debtors outstanding approx Rs. 12 Lakhs.",
            businessCycleCreditors:
              "Creditors allowed 20 days by suppliers; outstanding Rs. 6 Lakhs.",
            stockValuation: "Stock at premises approx Rs. 18 Lakhs",
            grossMargin: "Gross margin ~18%, net margin ~8%",
            netSavings: faker.number.int({ min: 150000, max: 300000 }),
            numberOfEmployees: faker.number.int({ min: 2, max: 8 }),
            majorSuppliers: [
              "ABC Silks - Bangalore",
              "Sri Traders - Siddlaghatta",
            ],
            majorCustomers: [
              "Metro Saree House - Hyderabad",
              "Retail shoppers via showroom",
            ],
            registrationCertifications: "GST registered in 2017; Trade license renewed FY25",
            taxApplicability: "GST applicable @5%",
            latestTaxReturn: "GST return filed for Q2 FY25",
          };
          break;
        }
        case "essChecklist": {
          sectionData.essResponses = [
            {
              question:
                "Is the entity involved in hazardous chemicals or commercial pest control?",
              response: "No",
            },
            {
              question: "Does the entity involve child or forced labour?",
              response: "No",
            },
            {
              question: "Is consent required from pollution control authorities?",
              response: "No",
            },
            {
              question: "Does the entity have waste treatment mechanism?",
              response: "Yes",
            },
            {
              question: "Does the entity comply with ESS guidelines?",
              response: "Yes",
            },
          ];
          sectionData.essOthers = "Complies with local municipal waste disposal norms.";
          break;
        }
        case "existingLoans": {
          sectionData.existingLoans = [
            {
              loanType: "BL",
              bankName: "City Union Bank",
              loanAmount: faker.number.int({ min: 600000, max: 1200000 }),
              emi: faker.number.int({ min: 18000, max: 32000 }),
              tenureRemaining: "24 months",
            },
          ];
          break;
        }
        case "bankingBehaviour": {
          sectionData.bankingAccounts = [
            {
              bankName: "City Union Bank",
              accountNumber: faker.finance.accountNumber(),
              accountType: "Current",
              operatingSince: "Since 2016",
              vintage: "9 years",
              minBalance: "NA",
              customerBehaviour: "Good",
            },
          ];
          break;
        }
        case "loanPurposeAndUse": {
          sectionData = {
            detailedPurpose:
              "Applied for Rs. 30,00,000 towards business expansion and additional power looms.",
            appliedLoanAmount: 3000000,
          };
          break;
        }
        case "observations": {
          sectionData = {
            positiveObservations:
              "Business established since 2000 with stable clientele across southern states. Inventory and books maintained properly. Cash and digital transactions tracked.",
            concerns: "Dependence on seasonal wedding demand; recommend monitoring stock turnover.",
            pdStatus: faker.helpers.arrayElement(["Positive", "Referred"]),
            pdConductedBy: `${faker.person.fullName()} - PD Executive`,
          };
          break;
        }
      }
    }

    if (schema.bankName === "Yes Bank") {
      switch (section.id) {
        case "generalInfo": {
          sectionData = {
            mainApplicantName: `Mr. ${faker.person.lastName().toUpperCase()}`,
            relationWithApplicant: "Applicant",
            addressVisited: generateIndianAddress(faker.location.city()),
            casId: faker.string.numeric(7),
            product: faker.helpers.arrayElement(["AFHL", "MLAP"]),
            pdVisitDate: faker.date.recent({ days: 20 }).toISOString().split("T")[0],
            pdVisitTime: faker.helpers.arrayElement(["09:45 AM", "02:30 PM", "06:10 PM"]),
            contactNumber: generateIndianPhone(),
            loanAppliedAmount: faker.number.int({ min: 1000000, max: 4000000 }),
            tenorRequired: `${faker.number.int({ min: 5, max: 15 })} years`,
            addressVisitedType: faker.helpers.arrayElement(["Residence", "Business"]),
          };
          break;
        }
        case "basicApplicantDetails": {
          sectionData = {
            applicantBackground:
              "Applicant manages plumbing contracts since 2020 and holds diploma in mechanical services.",
            coApplicantBackground: "Co-applicant not part of business operations.",
            parentsBackground: "Parents retired from state government service.",
            childrenDetails: "Son – 26 yrs – pursuing MS; Daughter – 23 yrs – MBA final year.",
            siblingsBackground: "Siblings employed outside the city; not part of business.",
          };
          break;
        }
        case "businessProfile": {
          sectionData = {
            businessName: `M/S. ${faker.person.lastName()} Enterprises`,
            businessConstitution: "Proprietorship",
            proprietorShareDetails: "Mr. Rao – 100%",
            yearsInBusiness: "3",
            businessNarrative:
              "Undertakes plumbing and minor civil contracts for residential societies across Hyderabad. Demand peaks during summer renovation season.",
            gstRegistration: "GST registered since 2018",
            proofOfBusinessStability: "Lease agreement and utility bills verified.",
            averageMonthlySales: faker.number.int({ min: 1500000, max: 2500000 }),
            averageMonthlyPurchase: faker.number.int({ min: 600000, max: 1200000 }),
            grossMargin: "Approx 35%",
            indirectExpenses: "Labour wages, transport, rent and utilities",
            netMonthlyProfit: "~Rs. 2.4 Lakhs",
            stockLevel: "Limited plumbing tools observed",
            majorCustomers: "Apartment associations and small developers with 30 day credit cycle.",
            majorSuppliers: "Local hardware wholesalers extending 20 day credit.",
            businessSetupDetails: "Operates from rented shop with signage and dedicated store room.",
            infrastructureManpower: "Employs 8 plumbers on rotation with pickup van for logistics.",
            otherAssetsInvestments: "Own house at Miyapur and commercial plot.",
            otherIncomeSources: "Rental from commercial plot ~Rs. 25,000 per month",
            householdExpenses: "Approx Rs. 65,000 per month",
            collateralDetails: "Residential property offered; self-occupied, purchased 2016.",
            mlapEndUse: "Funds to purchase additional power tools and clear high cost unsecured borrowings.",
          };
          break;
        }
        case "addressDetails": {
          sectionData = {
            residencePremiseAddress: generateIndianAddress("Hyderabad"),
            residenceOwnershipStatus: "Owned",
            residenceDuration: "10 years",
            residenceProof: "Property tax receipt and electricity bill",
            residenceRent: "NA",
            residenceLocality: "Middle class residential colony",
            residenceMortgage: "No existing mortgage",
            residenceQrCheck: "Positive",
            residenceVisitComment: "Visited and photographed living room and entrance",
            businessPremiseAddress: generateIndianAddress("Hyderabad"),
            businessOwnershipStatus: "Rented",
            businessDuration: "3 years",
            businessProof: "Registered rental agreement",
            businessRent: "Rs. 25,000",
            businessLocality: "Commercial market lane",
            businessMortgage: "NA",
            businessQrCheck: "Positive",
            businessVisitComment: "Tools observed; staff present during visit",
            earlierPremiseDetails: "Previously operated from home office before 2021.",
          };
          break;
        }
        case "businessReferences": {
          sectionData.references = [
            {
              referenceType: "Neighbouring hardware supplier",
              businessName: "Sri Hardware",
              contactPerson: "Mr. Anand",
              feedback: "Confirms regular orders and timely payments over past 2 years.",
              otherFeedback: "Shares market updates with applicant.",
              status: "Positive",
            },
            {
              referenceType: "Apartment association",
              businessName: "Green Meadows",
              contactPerson: "Facility Manager",
              feedback: "Completed recent plumbing overhaul satisfactorily.",
              otherFeedback: "Recommended for future projects.",
              status: "Positive",
            },
          ];
          break;
        }
        case "residenceReferences": {
          sectionData.references = [
            {
              referenceType: "Neighbour",
              personMet: "Mr. Sharma – Grocery store",
              feedback: "Family residing since 10 years, cordial behaviour, no negative activity.",
              otherFeedback: "",
              status: "Positive",
            },
          ];
          break;
        }
        case "finalComment": {
          sectionData = {
            interviewerComment:
              "Applicant cooperative during PD. However business documents limited. Income primarily derived from oral confirmations.",
            activityAndStocks: "Minimal inventory due to project-based procurement.",
            pdStatus: faker.helpers.arrayElement(["Positive", "Negative", "Referred"]),
            remarks: "Recommend monitoring cash flows due to absence of invoices.",
            yblEmployeeName: faker.person.fullName(),
            yblDesignation: "PD Executive",
            yblEmpId: faker.string.numeric(6),
            yblSignature: faker.person.fullName(),
            pdAgencyInterviewer: faker.person.fullName(),
            reportProcessedBy: faker.person.fullName(),
          };
          break;
        }
        case "annexureAfhl": {
          sectionData = {
            propertyIdentifiedThrough: "Broker referral",
            builderDetails: "ABC Developers – Sunrise Residency",
            transactionType: "Purchase",
            propertyType: "3 BHK Apartment",
            propertyDetails:
              "Flat 502, Sunrise Residency, Kondapur – 1500 sq.ft – finishing stage",
            totalPropertyCost: faker.number.int({ min: 5000000, max: 8000000 }),
            ocrSource: "Savings and FD maturity",
            downPaymentDone: "Token advance paid",
            downPaymentAmount: faker.number.int({ min: 300000, max: 600000 }),
            downPaymentSource: "Personal savings",
            purposeOfPurchase: "Self Occupation",
            distanceFromWork: "8 km from business premises",
            commutePlan: "Own car and metro connectivity",
          };
          break;
        }
        case "annexureSalaried": {
          sectionData = {
            companyName: "XYZ Services Pvt Ltd",
            companyConstitution: "Private Limited",
            hrAndReportingContact: "hr@xyzservices.com | reporting@xyzservices.com",
            employerContact: "Ms. Priya – HR Manager – ${generateIndianPhone()}",
            employerDetails:
              "IT services firm operating since 2005 with ~500 employees across India.",
            employmentStatus: "Regular",
            currentDesignation: "Senior Analyst – Operations",
            employeeId: faker.string.numeric(5),
            salaryMode: "Salary credited to Yes Bank A/c ****1234",
            grossMonthlySalary: faker.number.int({ min: 120000, max: 180000 }),
            netMonthlySalary: faker.number.int({ min: 90000, max: 130000 }),
            employerLoanDetails: "No",
            employmentTerms: "Permanent employee with standard benefits",
            currentEmployerVintage: "4 years",
            previousExperienceDetails: "Previously with ABC Tech for 3 years",
            previousExperienceYears: "3",
            otherIncome: "Rental income Rs. 12,000 per month",
            residenceStatus: "Self-owned apartment",
            rentExpenses: "NA",
            familyExpenses: "Rs. 55,000",
            employmentTPC: "Neighbour confirms employment and behaviour",
            employmentDocuments: [
              "HR employment confirmation email",
              "Latest salary slip (Sep 2025)",
            ],
          };
          break;
        }
      }
    }

    if (schema.bankName === "HeroHousing-Salaried") {
      switch (section.id) {
        case "generalInfo": {
          sectionData = {
            loanAccountNo: faker.string.numeric(10),
            nameOfCustomer: faker.person.fullName(),
            personMet: `${faker.person.fullName()} – Spouse`,
            reasonIfCustomerNotAvailable: "Customer on site visit",
            pdVisitDate: faker.date.recent({ days: 15 }).toISOString().split("T")[0],
            pdVisitTime: faker.helpers.arrayElement(["11:45 AM", "04:00 PM"]),
            pdAddress: generateIndianAddress(faker.location.city()),
            latLongOfOfficeAddress: "17.4401, 78.3920",
            requestedLoanAmount: faker.number.int({ min: 1500000, max: 3000000 }),
          };
          break;
        }
        case "borrowerProfile": {
          sectionData.borrowerDetails =
            "Graduate in commerce with 8 years of experience in a reputed IT services firm. Previously worked with ABC Tech for 3 years.";
          break;
        }
        case "familyDetails": {
          sectionData.members = [
            {
              name: faker.person.fullName(),
              relationship: "Spouse",
              age: 32,
              qualification: "MBA",
              occupation: "Homemaker",
              incomeDetails: "Dependent",
            },
            {
              name: faker.person.fullName(),
              relationship: "Son",
              age: 4,
              qualification: "Nursery",
              occupation: "Student",
              incomeDetails: "Dependent",
            },
          ];
          break;
        }
        case "employmentProfile": {
          sectionData = {
            nameOfEmployer: "XYZ Services Pvt Ltd",
            workingSince: "Apr 2021",
            typeOfEmployment: "Permanent",
            designation: "Senior Analyst",
            jobProfile:
              "Handles process automation projects and manages team of 5 associates.",
            reportingTo: "Mr. Ravi Kumar, Delivery Manager",
          };
          break;
        }
        case "employerDetails": {
          sectionData = {
            businessName: "XYZ Services Pvt Ltd",
            constitution: "Private Limited",
            natureOfBusiness: "IT/ITES provider serving banking clients across India",
            runningSince: "2005",
            partnersDetails: "Promoted by ABC Group",
            setupDetails: "Approx 500 employees with offices in Hyderabad & Pune",
            stockQuantum: "NA",
            machineryAssets: "IT infrastructure and leased servers",
            localityFeedback: "Office located in prime commercial area with good connectivity",
          };
          break;
        }
        case "propertyAndInvestments": {
          sectionData = {
            investmentNotes:
              "Owns 2BHK flat in Miyapur and maintains mutual funds worth Rs. 4 Lakhs.",
            endUseNotes:
              "Funds to renovate residence and consolidate existing personal loan.",
          };
          break;
        }
        case "loanDetails": {
          sectionData = {
            loanNotes:
              "Servicing one personal loan and one credit card. EMI payments routed through salary account.",
            bankingNotes:
              "Salary credited to Yes Bank A/c ****1284. Maintains savings account with HDFC Bank.",
            documentVerificationNotes:
              "Payslips and HR confirmation verified. Neighbour and HR reference positive.",
          };
          break;
        }
        case "existingLoans": {
          sectionData.existingLoans = [
            {
              bankName: "HDFC Bank",
              loanType: "Personal Loan",
              sanctionAmount: faker.number.int({ min: 400000, max: 800000 }),
              emi: faker.number.int({ min: 12000, max: 20000 }),
              tenureRemaining: "18 months",
            },
          ];
          break;
        }
        case "bankingDetails": {
          sectionData.accounts = [
            {
              bankName: "Yes Bank",
              accountNumber: faker.finance.accountNumber(),
              accountType: "Salary",
              branchName: "Hyderabad Main",
              operatingSince: "2018",
            },
            {
              bankName: "HDFC Bank",
              accountNumber: faker.finance.accountNumber(),
              accountType: "Savings",
              branchName: "Miyapur",
              operatingSince: "2015",
            },
          ];
          break;
        }
        case "loanPurpose": {
          sectionData = {
            detailedPurpose: "Home renovation and clearing high cost debt",
            appliedLoanAmount: 2500000,
          };
          break;
        }
        case "essChecklist": {
          sectionData.essResponses = [
            {
              question:
                "Is the entity involved in commercial pest control or hazardous activities?",
              response: "No",
            },
            {
              question:
                "Does the entity involve in child or forced labour or displacement?",
              response: "No",
            },
            {
              question:
                "Does the entity require consent from pollution control authorities?",
              response: "No",
            },
            {
              question:
                "Does the entity have proper mechanism for waste disposal?",
              response: "Yes",
            },
            {
              question: "Does the entity comply with ESS guidelines?",
              response: "Yes",
            },
          ];
          break;
        }
        case "observations": {
          sectionData = {
            detailedObservations:
              "Applicant cooperative during visit. Residence maintained neatly. Employment verified with HR and colleague.",
            concerns: "Moderate leverage due to existing personal loan.",
            pdStatus: faker.helpers.arrayElement(["Positive", "Referred"]),
            pdConductedBy: `${faker.person.fullName()} – PD Executive`,
          };
          break;
        }
      }
    }

    if (schema.bankName === "Aditya Birla") {
      switch (section.id) {
        case "proposalInfo": {
          sectionData = {
            proposalNumber: faker.string.numeric(8),
            dateOfVisit: faker.date.recent({ days: 25 }).toISOString().split("T")[0],
            timeOfVisit: faker.helpers.arrayElement(["10:15 AM", "03:20 PM"]),
          };
          break;
        }
        case "applicantDetails": {
          sectionData = {
            nameOfApplicant: faker.person.fullName(),
            nameOfCoApplicant: faker.person.fullName(),
            nameOfBusiness: `${faker.person.lastName()} Enterprises`,
            businessAddress: generateIndianAddress(faker.location.city()),
            yearsInCurrentAddress: "12 Years",
            constitutionOfBusiness: faker.helpers.arrayElement([
              "Proprietorship",
              "Partnership",
              "Private Limited",
            ]),
          };
          break;
        }
        case "partnersManagement": {
          sectionData = {
            otherPartners: "Mrs. Rao (40%)",
            management: "Handled by family members",
            contactNumber: generateIndianPhone(),
            tin: faker.string.numeric(10),
            pan: faker.string.numeric(10),
            certificateOfIncorporation: "Incorporated in 2016",
          };
          break;
        }
        case "businessOverview": {
          sectionData = {
            aboutBusiness:
              "Applicant manufactures packaged snacks supplied to local supermarkets. Operations from 2,000 sq.ft industrial shed.",
            vendorsSuppliers: "Raw material sourced from wholesale mandi",
            businessTransaction: "Daily cash and digital sales",
            stockObserved: "Moderate finished stock",
            reasonForNoStock: "NA",
            businessActivityObserved: "Workers seen packing finished goods",
          };
          break;
        }
        case "salesFinancials": {
          sectionData = {
            mainProduct: "Packaged snacks",
            mainRawMaterial: "Flour, oil, spices",
            vendors: "ABC Suppliers, Mandi Traders",
            businessPremiseOwnership: "Owned",
            actualMonthlySales: "Rs. 30,00,000",
            percentageSalesOnCredit: "15%",
            manufacturingDetails: "Semi-automatic production with daily dispatch",
            salesConcentration: "No",
            debtorsCycle: "25 day credit to distributors",
            creditorsCycle: "20 day credit from suppliers",
            stockValuation: "Rs. 18 Lakhs",
            netMargins: "Gross 22%, Net 9%",
            monthlyNetSavings: "Rs. 2.5 Lakhs",
            majorCustomers: "City supermarkets and franchise retail outlets",
            salesPaymentTerms: "Weekly payments from distributors",
            gstRegistration: "GST active",
            itrsFiling: "ITR filed up to FY24",
          };
          break;
        }
        case "employeesInfrastructure": {
          sectionData = {
            numberOfEmployees: "18 workers",
            salaries: "Approx Rs. 1.2 Lakhs monthly",
            godownAddress: generateIndianAddress(faker.location.city()),
            otherBusinessDetails: "Uses leased mini-truck for deliveries",
          };
          break;
        }
        case "observations": {
          sectionData = {
            detailedObservations:
              "Business operational since 2016 with steady clientele. Inventory maintained; hygiene levels acceptable.",
            concerns: "Dependence on few bulk buyers",
            statusOfPd: faker.helpers.arrayElement(["Positive", "Referred"]),
            pdConductedBy: `${faker.person.fullName()} – PD Executive`,
          };
          break;
        }
      }
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
