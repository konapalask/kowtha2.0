import psycopg2
from datetime import datetime, timedelta

# Database connection parameters
db_params = {
    "dbname": "loan_verification",
    "user": "devuser",
    "password": "devpass",
    "host": "localhost",
    "port": 5432
}

# Connect to the database
conn = psycopg2.connect(**db_params)
cursor = conn.cursor()

now = datetime.now()

# Insert an Organization
cursor.execute("""
    INSERT INTO "Organization" ("name", "description")
    VALUES (%s, %s)
    RETURNING "id"
""", ('Loan Verification Organization', 'Default organization for dummy data'))
organization_id = cursor.fetchone()[0]

# Insert an Office linked to Organization
cursor.execute("""
    INSERT INTO "Office" ("name", "location", "address", "createdAt", "updatedAt", "organizationId")
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING "id"
""", ('Main Office', 'Hyderabad', 'Address Line 1', now, now, organization_id))
office_id = cursor.fetchone()[0]

# Insert Admin User
cursor.execute("""
    INSERT INTO "User" ("mobile", "role", "name", "officeId", "createdAt", "updatedAt")
    VALUES (%s, %s, %s, %s, %s, %s)
""", ('9000000001', 'Admin', 'Admin User', office_id, now, now))

# Insert Operations Executive
cursor.execute("""
    INSERT INTO "User" ("mobile", "role", "name", "officeId", "createdAt", "updatedAt")
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING "id"
""", ('9000000002', 'OperationsExecutive', 'Operations Executive', office_id, now, now))
operations_exec_id = cursor.fetchone()[0]

# Insert Field Executive
cursor.execute("""
    INSERT INTO "User" ("mobile", "role", "name", "officeId", "createdAt", "updatedAt")
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING "id"
""", ('9000000003', 'FieldExecutive', 'Field Executive', office_id, now, now))
field_exec_id = cursor.fetchone()[0]

# Insert Verifier
cursor.execute("""
    INSERT INTO "User" ("mobile", "role", "name", "officeId", "createdAt", "updatedAt")
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING "id"
""", ('9000000004', 'Verifier', 'Verifier User', office_id, now, now))
verifier_id = cursor.fetchone()[0]

# Insert 3 Loans assigned to Operations Executive
loan_ids = []
for i in range(3):
    application_number = f"APP1000{i+1}"
    applicant_name = f"Applicant {i+1}"
    applicant_mobile = f"98765000{i+1}"
    applicant_address = f"Address {i+1}"
    loan_type = "Home Loan"
    bank_name = "State Bank"
    loan_amount = 500000.0 + (i * 50000)

    cursor.execute("""
        INSERT INTO "Loan" ("applicationNumber", "applicantName", "applicantMobile", "applicantAddress", "loanType", "bankName", "loanAmount", "status", "officeId", "operationsExecutiveId", "verifierId", "createdAt", "updatedAt")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING "id"
    """, (
        application_number,
        applicant_name,
        applicant_mobile,
        applicant_address,
        loan_type,
        bank_name,
        loan_amount,
        'Assigned',
        office_id,
        operations_exec_id,
        verifier_id,
        now,
        now
    ))
    loan_id = cursor.fetchone()[0]
    loan_ids.append(loan_id)

# Insert Verifications for each Loan assigned to Field Executive
for loan_id in loan_ids:
    for vtype in ['PermanentAddress', 'CurrentAddress', 'Work']:
        cursor.execute("""
            INSERT INTO "Verification" ("loanId", "type", "fieldExecutiveId", "status", "createdAt", "updatedAt")
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            loan_id,
            vtype,
            field_exec_id,
            'Pending',
            now,
            now
        ))

# Commit and close
conn.commit()
cursor.close()
conn.close()

print("Dummy Organization, Office, Users, Loans, and Verifications inserted successfully!")
