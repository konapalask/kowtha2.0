export const ambitMsmeSchema = {
    id: 27,
    bankName: "Ambit-MSME",
    sections: [
        {
            id: "general",
            label: "General",
            schema: {
                type: "object",
                properties: {
                    nameOfApplicant: {
                        type: "string",
                        title: "Name of Applicant",
                        readOnly: true,
                    },
                    nameOfCoApplicant: {
                        type: "string",
                        title: "Name of Co-Applicant",
                    },
                    dateOfReport: {
                        type: "string",
                        title: "Date of Report",
                        format: "date",
                    },
                    applicationNo: {
                        type: "string",
                        title: "Ambit Application ID",
                        readOnly: true,
                    },
                    loanAmount: {
                        type: "number",
                        title: "Requested Loan Amount",
                        formatter: {
                            useIndianFormat: true,
                            locale: "en-IN",
                            maxDecimalPlaces: 2,
                        },
                    },
                    emi: {
                        type: "number",
                        title: "Maximum Comfortable EMI",
                        formatter: {
                            useIndianFormat: true,
                            locale: "en-IN",
                            maxDecimalPlaces: 2,
                        },
                    },
                    businessName: {
                        type: "string",
                        title: "Business Name",
                    },
                    nameOfTheProprietor: {
                        type: "string",
                        title: "Name of the proprietor as per Business license",
                    },
                    initiatedAddress: {
                        type: "object",
                        properties: {
                            address: {
                                type: "string",
                                title: "Address",
                                ui: {
                                    widget: "textarea",
                                    rows: 2,
                                },
                            },
                            latitude: {
                                type: "number",
                                title: "Latitude",
                            },
                            longitude: {
                                type: "number",
                                title: "Longitude",
                            },
                        },
                    },
                    visitedAddress: {
                        type: "object",
                        properties: {
                            address: {
                                type: "string",
                                title: "Address",
                                ui: {
                                    widget: "textarea",
                                    rows: 2,
                                },
                            },
                            latitude: {
                                type: "number",
                                title: "Latitude",
                            },
                            longitude: {
                                type: "number",
                                title: "Longitude",
                            },
                        },
                    },
                    businessLicenseAddress: {
                        type: "object",
                        properties: {
                            address: {
                                type: "string",
                                title: "Address",
                                ui: {
                                    widget: "textarea",
                                    rows: 2,
                                },
                            },
                            latitude: {
                                type: "number",
                                title: "Latitude",
                            },
                            longitude: {
                                type: "number",
                                title: "Longitude",
                            },
                        },
                    },
                },
            },
            required: true,
        },
        {
            id: "residentialDetails",
            label: "Residential Details",
            schema: {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        title: "Address",
                        ui: {
                            widget: "textarea",
                            rows: 2,
                        },
                    },
                    latitude: {
                        type: "number",
                        title: "Latitude",
                    },
                    longitude: {
                        type: "number",
                        title: "Longitude",
                    },
                    rentedOrOwned: {
                        type: "string",
                        title: "Rented/Owned",
                        enum: ["Rented", "Owned"],
                    },
                    ownedBy: {
                        type: "string",
                        title: "Owned by",
                    },
                    areaInSqFt: {
                        type: "number",
                        title: "Area (In Sq. Ft.)",
                    },
                    occupiedSinceYears: {
                        type: "number",
                        title: "Occupied since (years)",
                    },
                },
            },
        },
        {
            id: "propertyDetails",
            label: "Property Details",
            schema: {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        title: "Address",
                        ui: {
                            widget: "textarea",
                            rows: 2,
                        },
                    },
                    latitude: {
                        type: "number",
                        title: "Latitude",
                    },
                    longitude: {
                        type: "number",
                        title: "Longitude",
                    },
                    typeOfProperty: {
                        type: "string",
                        title: "Type of Property",
                        enum: ["Residential", "Commercial", "Industrial"],
                    },
                    ownerName: {
                        type: "string",
                        title: "Property owner name",
                    },
                    areaInSqFt: {
                        type: "number",
                        title: "Nature of uses",
                        enum: ["Self-Occupied", "Rented", "Vacant", "Others"],
                    },
                    marketValue: {
                        type: "number",
                        title: "Market Value",
                        formatter: {
                            useIndianFormat: true,
                            locale: "en-IN",
                            maxDecimalPlaces: 2,
                        },
                    },
                    areaInSqft: {
                        type: "number",
                        title: "Area (In Sq. Ft.)",
                    },
                    occupiedSinceYears: {
                        type: "number",
                        title: "Occupied since (years)",
                    },
                },
            },
        },
        {
            id: "generalinfo",
            label: "General Info",
            schema: {
                type: "object",
                properties: {
                    phoneNumber: {
                        type: "string",
                        title: "Mob no. of App and Co app",
                    },
                    kycDetails: {
                        type: "string",
                        title: "App & Co app KYC details and Utility bills/license",
                    },
                    pdDoneDateAndTime: {
                        type: "string",
                        title: "PD done date and time",
                        format: "datetime",
                    },
                    typeOfLoan: {
                        type: "string",
                        title: "Type of Loan",
                    },
                    noOfVisit: {
                        type: "number",
                        title: "No. of Visit",
                    },
                    personMet: {
                        type: "string",
                        title: "Person Met (with name and Relation",
                    },
                    pdDoneBy: {
                        type: "string",
                        title: "PD done Person name",
                    },
                },
            },
        },
        {
            id: "applicantDetails",
            label: "Applicant Details",
            schema: {
                type: "object",
                properties: {
                    applicantProfile: {
                        type: "string",
                        title: "Applicant Profile",
                        ui: {
                            widget: "textarea",
                            rows: 3,
                        },
                    },
                    detailsOfCoApplicant: {
                        type: "string",
                        title: "Details of all Co-Applicant",
                        ui: {
                            widget: "textarea",
                            rows: 3,
                        },
                    },
                },
            },
        },
        {
            id: "familyDetails",
            label: "Family Details",
            schema: {
                type: "array",
                title: "Family Details",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            title: "Name",
                        },
                        relation: {
                            type: "string",
                            title: "Relation with Applicant",
                        },
                        age: {
                            type: "number",
                            title: "Age (Yrs)",
                        },
                        qualification: {
                            type: "string",
                            title: "Qualification",
                        },
                        occupation: {
                            type: "string",
                            title: "Occupation",
                        },
                        incomePerMonth: {
                            type: "number",
                            title: "Income per month (approx.)",
                        },
                        dependent: {
                            type: "string",
                            title: "Dependent",
                        },
                    },
                },
            },
        },
        {
            id: "businessDetails",
            label: "Business Details",
            schema: {
                type: "object",
                properties: {
                    businessDetails: {
                        type: "string",
                        title: "Business/Employment Details",
                        ui: {
                            widget: "textarea",
                            rows: 3,
                        },
                    },
                },
            },
        },
        {
            id: "incomeAssessment",
            label: "Income Assessment",
            schema: {
                type: "object",
                properties: {
                    incomeAssessment: {
                        type: "string",
                        title: "Income Assessment",
                        ui: {
                            widget: "textarea",
                            rows: 3,
                        },
                    },
                },
            },
        },
        {
            id: "suplliersDetails",
            label: "Suplliers Details",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            title: "Name",
                        },
                    },
                    contactNumber: {
                        type: "string",
                        title: "Mob Number",
                    },
                    location: {
                        type: "string",
                        title: "Location",
                    },
                    feedback: {
                        type: "string",
                        title: "Feedback",
                    },
                },
            },
        },
        {
            id: "customersDetails",
            label: "Customers Details",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            title: "Name",
                        },
                        contactNumber: {
                            type: "string",
                            title: "Mob Number",
                        },
                        location: {
                            type: "string",
                            title: "Location",
                        },
                        feedback: {
                            type: "string",
                            title: "Feedback",
                        },
                    },
                },
            },
        },
        {
            id:"NeighbourChecks",
            label: "Neighbour Check (TPC)",
            schema: {
                type: "array",
                properties: {
                        items: {
                            type: "object",
                            properties: {
                            neighbourName: {
                                type: "string",
                                title: "Neighbour, Resi/Business & Collateral Name",
                            },
                            contactNumber: {
                                type: "string",
                                title: "Mob Number",
                            },
                            location: {
                                type: "string",
                                title: "Location",
                            },
                            feedback: {
                                type: "string",
                                title: "Feedback",
                            },
                        },
                    },
                    },
                },
            },
            {
                id: "otherChecks",
                label: "Other Checks from Neighbour",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            otherChecks: {
                                type: "string",
                                title: "Other Checks from Neighbour",
                            },
                            remarks: {
                                type: "string",
                                title: "RemJarks",
                            },
                        },
                    },
                },
            },

            {
                id: "averageStockMaintained",
                label: "Average Stock Maintained",
                schema: {
                    type: "object",
                    properties: {
                        averageStockMaintained: {
                            type: "number",
                            title: "Average Stock Maintained",
                            formatter: {
                                useIndianFormat: true,
                                locale: "en-IN",
                                maxDecimalPlaces: 2,
                            },
                        },
                    },
                },
            },

            {
                id: "businessOrIncomeDetails",
                label: "Business or Income Details",
                schema: {
                    type: "object",
                    properties: {
                        details: {
                            type: "string",
                            title: "Details",
                            ui: {
                                widget: "textarea",
                                rows: 3,
                            },
                        },
                    },
                },
            },

            {
                id: "assetsDetails",
                label: "Assets Details",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            assetType: {
                                type: "string",
                                title: "Asset Type",
                            },
                            ownerName: {
                                type: "string",
                                title: "Ownership Hold By",
                            },
                            valueOfAsset: {
                                type: "string",
                                title: "Vallue of Asset",
                            },
                            currentSratus: {
                                type: "string",
                                title: "Current Status",
                                enum: ["Vacant", "Rental"],
                            },
                            pledgeOrFree:{
                                type: "string",
                                title: "Pledge/Free",
                            }
                        },
                    },
                },
            },

            {
                id: "endUseOfLoan",
                label: "End Use of Loan",
                schema: {
                    type: "object",
                    properties: {
                        endUse: {
                            type: "string",
                            title: "End Use of Loan Purppose",
                            ui: {
                                widget: "textarea",
                                rows: 3,
                            },
                        },
                    },
                },
            },
            {
                id: "loanDetails",
                label: "Loan Details",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            bankName: {
                                type: "string",
                                title: "Name of Bank / NBFC",
                            },
                            type: {
                                type: "string",
                                title: "Type of Loan",
                            },
                            sanctionedAmount: {
                                type: "number",
                                title: "Sanctioned Amount",
                                formatter: {
                                    useIndianFormat: true,
                                    locale: "en-IN",
                                    maxDecimalPlaces: 2,
                                },
                            },
                            osBalance: {
                                type: "number",
                                title: "O/S Balance (in Lakhs)",
                                formatter: {
                                    useIndianFormat: true,
                                    locale: "en-IN",
                                    maxDecimalPlaces: 2,
                                },
                           },
                           emi: {
                                type: "number",
                                title: "EMI Amount",
                                formatter: {
                                    useIndianFormat: true,
                                    locale: "en-IN",
                                    maxDecimalPlaces: 2,
                                },
                           },
                           tenure: {
                                type: "number",
                                title: "Tenure (in Months)",
                                formatter: {
                                    useIndianFormat: true,
                                    locale: "en-IN",
                                    maxDecimalPlaces: 2,
                                },
                           },
                           emiClearanceBankName: {
                                type: "string",
                                title: "EMI Clearance Bank Name",
                           },
                    },
                },
                },
            },
            
            {
                id: "strenghtsAndWeaknesses",
                label: "Strengths and Weaknesses",
                schema: {
                    type: "object",
                    properties: {
                        strengths: {
                            type: "string",
                            title: "Strengths",
                            ui: {
                                widget: "textarea",
                                rows: 3,
                            },
                        },
                        weaknesses: {
                            type: "string",
                            title: "Weaknesses",
                            ui: {
                                widget: "textarea",
                                rows: 3,
                            },
                        },
                    },
                },
            },
            {
                id: "documentsSeen",
                label: "Documents Seen",
                schema: {
                    type: "object",
                    properties: {
                        documents: {
                            type: "string",
                            title: "Documents Seen",
                        },
                    },
                },
            },
            {
                id: "bankingDetails",
                label: "Banking Details",
                schema: {
                    type: "object",
                    properties: {
                        bankName: {
                            type: "string",
                            title: "Bank Name",
                        },
                        accountType: {
                            type: "string",
                            title: "Account Type",
                        },
                        openSinceYear: {
                            type: "number",
                            title: "Open Since (Year)",
                        },
                        odOrCcLimit: {
                            type: "number",
                            title: "OD/CC Limit",
                        },
                    },
                },
                
            },

            {
                id:  "otherObservations",
                label: "Other Observations",
                schema: {
                    type: "object",
                    properties: {
                        observations: {
                            type: "string",
                            title: "Other Observations",
                            ui: {
                                widget: "textarea",
                                rows: 3,
                            },
                        },
                        pdStatus: {
                            type: "string",
                            title: "Overall PD Status",
                            enum: ["Positive", "Negative", "Credit Refer", "Fraud"],
                        },
                    },
                },
            }
  ],
} as const;

export default ambitMsmeSchema;
