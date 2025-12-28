--
-- PostgreSQL database dump
--


-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: kowtha
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO kowtha;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: kowtha
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."AddressType" AS ENUM (
    'PermanentAddress',
    'CurrentAddress',
    'Work',
    'Business'
);


ALTER TYPE public."AddressType" OWNER TO kowtha;

--
-- Name: ApprovedStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."ApprovedStatus" AS ENUM (
    'Positive',
    'Negative'
);


ALTER TYPE public."ApprovedStatus" OWNER TO kowtha;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'Available',
    'Unavailable'
);


ALTER TYPE public."AttendanceStatus" OWNER TO kowtha;

--
-- Name: Department; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."Department" AS ENUM (
    'FI',
    'PD'
);


ALTER TYPE public."Department" OWNER TO kowtha;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."DocumentType" AS ENUM (
    'ID',
    'Address',
    'Income',
    'Other'
);


ALTER TYPE public."DocumentType" OWNER TO kowtha;

--
-- Name: EditRequestStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."EditRequestStatus" AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


ALTER TYPE public."EditRequestStatus" OWNER TO kowtha;

--
-- Name: EditRequestType; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."EditRequestType" AS ENUM (
    'Login',
    'LoanData',
    'Other'
);


ALTER TYPE public."EditRequestType" OWNER TO kowtha;

--
-- Name: FieldExecutiveStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."FieldExecutiveStatus" AS ENUM (
    'Pending',
    'InProgress',
    'Completed'
);


ALTER TYPE public."FieldExecutiveStatus" OWNER TO kowtha;

--
-- Name: LoanStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."LoanStatus" AS ENUM (
    'Unassigned',
    'Assigned',
    'UnderFV',
    'FVCompleted',
    'Approved',
    'Rejected'
);


ALTER TYPE public."LoanStatus" OWNER TO kowtha;

--
-- Name: LocationType; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."LocationType" AS ENUM (
    'Local',
    'Remote'
);


ALTER TYPE public."LocationType" OWNER TO kowtha;

--
-- Name: PictureSource; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."PictureSource" AS ENUM (
    'Camera',
    'Gallery'
);


ALTER TYPE public."PictureSource" OWNER TO kowtha;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."UserRole" AS ENUM (
    'Admin',
    'Verifier',
    'FieldExecutive',
    'SupportExecutive',
    'OperationsExecutive',
    'VerificationExecutive'
);


ALTER TYPE public."UserRole" OWNER TO kowtha;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."UserStatus" AS ENUM (
    'Active',
    'Inactive'
);


ALTER TYPE public."UserStatus" OWNER TO kowtha;

--
-- Name: VerificationStatus; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."VerificationStatus" AS ENUM (
    'Pending',
    'InProgress',
    'Completed'
);


ALTER TYPE public."VerificationStatus" OWNER TO kowtha;

--
-- Name: VerificationType; Type: TYPE; Schema: public; Owner: kowtha
--

CREATE TYPE public."VerificationType" AS ENUM (
    'AddressOne',
    'AddressTwo',
    'Work',
    'Business'
);


ALTER TYPE public."VerificationType" OWNER TO kowtha;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AppDeployment; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."AppDeployment" (
    id integer NOT NULL,
    version text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    source text NOT NULL,
    "forceUpdate" boolean DEFAULT false NOT NULL,
    "appStoreUrl" text,
    "playStoreUrl" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AppDeployment" OWNER TO kowtha;

--
-- Name: AppDeployment_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."AppDeployment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AppDeployment_id_seq" OWNER TO kowtha;

--
-- Name: AppDeployment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."AppDeployment_id_seq" OWNED BY public."AppDeployment".id;


--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Attendance" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    department public."Department"
);


ALTER TABLE public."Attendance" OWNER TO kowtha;

--
-- Name: Attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Attendance_id_seq" OWNER TO kowtha;

--
-- Name: Attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Attendance_id_seq" OWNED BY public."Attendance".id;


--
-- Name: Bank; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Bank" (
    id integer NOT NULL,
    name text NOT NULL,
    logo text,
    parent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Bank" OWNER TO kowtha;

--
-- Name: Bank_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Bank_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Bank_id_seq" OWNER TO kowtha;

--
-- Name: Bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Bank_id_seq" OWNED BY public."Bank".id;


--
-- Name: DepartmentRole; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."DepartmentRole" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    department public."Department" NOT NULL,
    role public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "officeId" integer
);


ALTER TABLE public."DepartmentRole" OWNER TO kowtha;

--
-- Name: DepartmentRole_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."DepartmentRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DepartmentRole_id_seq" OWNER TO kowtha;

--
-- Name: DepartmentRole_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."DepartmentRole_id_seq" OWNED BY public."DepartmentRole".id;


--
-- Name: EditRequest; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."EditRequest" (
    id integer NOT NULL,
    "loanId" integer,
    "verificationId" integer,
    "requestedBy" integer NOT NULL,
    "approvedBy" integer,
    status public."EditRequestStatus" NOT NULL,
    changes jsonb NOT NULL,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    type public."EditRequestType",
    department public."Department"
);


ALTER TABLE public."EditRequest" OWNER TO kowtha;

--
-- Name: EditRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."EditRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EditRequest_id_seq" OWNER TO kowtha;

--
-- Name: EditRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."EditRequest_id_seq" OWNED BY public."EditRequest".id;


--
-- Name: Loan; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Loan" (
    id integer NOT NULL,
    "applicationNumber" text NOT NULL,
    "applicantName" text NOT NULL,
    "applicantMobile" text NOT NULL,
    "applicantAddress" text,
    "applicantAddress1" text,
    "applicantAddress2" text,
    "isAddressSame" boolean DEFAULT false NOT NULL,
    "loanType" text NOT NULL,
    "bankName" text NOT NULL,
    "loanAmount" double precision,
    status public."LoanStatus" NOT NULL,
    "officeId" integer NOT NULL,
    "operationsExecutiveId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "applicantType" text,
    department public."Department",
    "reassignCount" integer DEFAULT 0 NOT NULL,
    "templateName" text
);


ALTER TABLE public."Loan" OWNER TO kowtha;

--
-- Name: Loan_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Loan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Loan_id_seq" OWNER TO kowtha;

--
-- Name: Loan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Loan_id_seq" OWNED BY public."Loan".id;


--
-- Name: Office; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Office" (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    address text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    archived boolean DEFAULT false NOT NULL,
    "organizationId" integer DEFAULT 1 NOT NULL,
    department public."Department"
);


ALTER TABLE public."Office" OWNER TO kowtha;

--
-- Name: Office_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Office_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Office_id_seq" OWNER TO kowtha;

--
-- Name: Office_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Office_id_seq" OWNED BY public."Office".id;


--
-- Name: Organization; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Organization" (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."Organization" OWNER TO kowtha;

--
-- Name: Organization_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Organization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Organization_id_seq" OWNER TO kowtha;

--
-- Name: Organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Organization_id_seq" OWNED BY public."Organization".id;


--
-- Name: PDEmailLog; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."PDEmailLog" (
    id integer NOT NULL,
    "messageID" text NOT NULL,
    "fromEmail" text[],
    "toEmail" text[],
    "ccEmail" text[],
    "bccEmail" text[],
    subject text NOT NULL,
    body text NOT NULL,
    attachments text[],
    "receivedAt" timestamp(3) without time zone,
    "parsedData" jsonb,
    "s3Path" text,
    "loanId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PDEmailLog" OWNER TO kowtha;

--
-- Name: PDEmailLog_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."PDEmailLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PDEmailLog_id_seq" OWNER TO kowtha;

--
-- Name: PDEmailLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."PDEmailLog_id_seq" OWNED BY public."PDEmailLog".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Session" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    otp text,
    "otpExpires" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Session" OWNER TO kowtha;

--
-- Name: Session_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_id_seq" OWNER TO kowtha;

--
-- Name: Session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Session".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    mobile text NOT NULL,
    name text NOT NULL,
    email text,
    "employeeCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."UserStatus" DEFAULT 'Active'::public."UserStatus" NOT NULL,
    "deviceId" text,
    locality text,
    "defaultDepartment" public."Department"
);


ALTER TABLE public."User" OWNER TO kowtha;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO kowtha;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Verification; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."Verification" (
    id integer NOT NULL,
    "loanId" integer NOT NULL,
    type public."VerificationType" NOT NULL,
    "fieldExecutiveId" integer NOT NULL,
    status public."VerificationStatus" NOT NULL,
    "applicantAddress" text,
    "verificationData" jsonb,
    "pictureSource" public."PictureSource",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "addressType" public."AddressType",
    path text,
    "approvedStatus" public."ApprovedStatus",
    "finalReportPath" text,
    "locationType" public."LocationType",
    "verifierId" integer,
    "businessName" text,
    "isPostponed" boolean,
    "postponedDate" timestamp(3) without time zone,
    "postponedReason" text,
    "currentOfficeName" text,
    department public."Department",
    "financialAnalysis" jsonb,
    synopsis text,
    "templateName" text
);


ALTER TABLE public."Verification" OWNER TO kowtha;

--
-- Name: VerificationRetries; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public."VerificationRetries" (
    id integer NOT NULL,
    "verificationId" integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    geotag text,
    address text,
    reason text,
    "fieldExecutiveId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationRetries" OWNER TO kowtha;

--
-- Name: VerificationRetries_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."VerificationRetries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VerificationRetries_id_seq" OWNER TO kowtha;

--
-- Name: VerificationRetries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."VerificationRetries_id_seq" OWNED BY public."VerificationRetries".id;


--
-- Name: Verification_id_seq; Type: SEQUENCE; Schema: public; Owner: kowtha
--

CREATE SEQUENCE public."Verification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Verification_id_seq" OWNER TO kowtha;

--
-- Name: Verification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kowtha
--

ALTER SEQUENCE public."Verification_id_seq" OWNED BY public."Verification".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: kowtha
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO kowtha;

--
-- Name: AppDeployment id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."AppDeployment" ALTER COLUMN id SET DEFAULT nextval('public."AppDeployment_id_seq"'::regclass);


--
-- Name: Attendance id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Attendance" ALTER COLUMN id SET DEFAULT nextval('public."Attendance_id_seq"'::regclass);


--
-- Name: Bank id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Bank" ALTER COLUMN id SET DEFAULT nextval('public."Bank_id_seq"'::regclass);


--
-- Name: DepartmentRole id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."DepartmentRole" ALTER COLUMN id SET DEFAULT nextval('public."DepartmentRole_id_seq"'::regclass);


--
-- Name: EditRequest id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."EditRequest" ALTER COLUMN id SET DEFAULT nextval('public."EditRequest_id_seq"'::regclass);


--
-- Name: Loan id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Loan" ALTER COLUMN id SET DEFAULT nextval('public."Loan_id_seq"'::regclass);


--
-- Name: Office id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Office" ALTER COLUMN id SET DEFAULT nextval('public."Office_id_seq"'::regclass);


--
-- Name: Organization id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Organization" ALTER COLUMN id SET DEFAULT nextval('public."Organization_id_seq"'::regclass);


--
-- Name: PDEmailLog id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."PDEmailLog" ALTER COLUMN id SET DEFAULT nextval('public."PDEmailLog_id_seq"'::regclass);


--
-- Name: Session id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Session" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Verification id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Verification" ALTER COLUMN id SET DEFAULT nextval('public."Verification_id_seq"'::regclass);


--
-- Name: VerificationRetries id; Type: DEFAULT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."VerificationRetries" ALTER COLUMN id SET DEFAULT nextval('public."VerificationRetries_id_seq"'::regclass);


--
-- Data for Name: AppDeployment; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."AppDeployment" (id, version, "isActive", source, "forceUpdate", "appStoreUrl", "playStoreUrl", description, "createdAt", "updatedAt") FROM stdin;
1	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 10:29:01.2	2025-07-10 10:29:01.2
2	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 10:30:02.731	2025-07-10 10:30:02.731
3	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 10:30:07.501	2025-07-10 10:30:07.501
4	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 10:35:01.878	2025-07-10 10:35:01.878
5	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 11:37:29.528	2025-07-10 11:37:29.528
6	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 11:48:06.129	2025-07-10 11:48:06.129
7	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 11:55:08.702	2025-07-10 11:55:08.702
8	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 12:01:49.598	2025-07-10 12:01:49.598
9	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 12:19:15.561	2025-07-10 12:19:15.561
10	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 12:31:20.781	2025-07-10 12:31:20.781
11	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 12:32:20.489	2025-07-10 12:32:20.489
12	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 13:33:29.304	2025-07-10 13:33:29.304
13	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 13:35:50.34	2025-07-10 13:35:50.34
14	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 14:05:50.633	2025-07-10 14:05:50.633
15	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 15:08:42.332	2025-07-10 15:08:42.332
16	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 16:08:11.596	2025-07-10 16:08:11.596
17	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-10 16:25:41.462	2025-07-10 16:25:41.462
18	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 04:31:58.412	2025-07-11 04:31:58.412
19	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 05:12:45.511	2025-07-11 05:12:45.511
20	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 05:16:33.817	2025-07-11 05:16:33.817
21	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 05:20:59.119	2025-07-11 05:20:59.119
22	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 05:43:51.467	2025-07-11 05:43:51.467
23	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 09:19:45.55	2025-07-11 09:19:45.55
24	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 10:08:14.026	2025-07-11 10:08:14.026
25	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 10:09:04.362	2025-07-11 10:09:04.362
26	1.0.9	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-11 12:57:43.91	2025-07-11 12:57:43.91
27	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 09:40:41.488	2025-07-14 09:40:41.488
28	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 09:56:52.756	2025-07-14 09:56:52.756
29	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 10:43:04.97	2025-07-14 10:43:04.97
30	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 11:31:23.459	2025-07-14 11:31:23.459
31	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 11:40:24.884	2025-07-14 11:40:24.884
32	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 12:23:19.171	2025-07-14 12:23:19.171
33	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 12:36:14.869	2025-07-14 12:36:14.869
34	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 12:39:23.291	2025-07-14 12:39:23.291
35	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-14 15:00:43.075	2025-07-14 15:00:43.075
36	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 01:35:09.763	2025-07-15 01:35:09.763
37	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 04:28:55.643	2025-07-15 04:28:55.643
38	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 04:45:11.15	2025-07-15 04:45:11.15
39	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 05:05:49.518	2025-07-15 05:05:49.518
40	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 05:11:11.399	2025-07-15 05:11:11.399
41	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 05:16:55.191	2025-07-15 05:16:55.191
42	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 05:17:59.461	2025-07-15 05:17:59.461
43	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 05:21:16.592	2025-07-15 05:21:16.592
44	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 06:01:06.514	2025-07-15 06:01:06.514
45	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 07:36:35.296	2025-07-15 07:36:35.296
46	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 07:39:14.009	2025-07-15 07:39:14.009
47	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 08:55:55.062	2025-07-15 08:55:55.062
48	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 10:38:04.69	2025-07-15 10:38:04.69
49	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 11:57:04.681	2025-07-15 11:57:04.681
50	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-15 12:07:26.201	2025-07-15 12:07:26.201
51	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 05:04:34.886	2025-07-16 05:04:34.886
52	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 05:37:40.604	2025-07-16 05:37:40.604
53	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 05:38:08.749	2025-07-16 05:38:08.749
54	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 06:21:16.66	2025-07-16 06:21:16.66
55	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 06:33:56.333	2025-07-16 06:33:56.333
56	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 09:01:42.469	2025-07-16 09:01:42.469
57	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 09:04:07.44	2025-07-16 09:04:07.44
58	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 09:15:34.799	2025-07-16 09:15:34.799
59	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 10:26:32.898	2025-07-16 10:26:32.898
60	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 10:27:56.509	2025-07-16 10:27:56.509
61	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 11:47:22.591	2025-07-16 11:47:22.591
62	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 13:31:23.897	2025-07-16 13:31:23.897
63	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 13:43:28.799	2025-07-16 13:43:28.799
64	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-16 15:47:17.445	2025-07-16 15:47:17.445
65	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 04:43:11.686	2025-07-17 04:43:11.686
66	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 04:56:56.398	2025-07-17 04:56:56.398
67	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 05:29:52.298	2025-07-17 05:29:52.298
68	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 06:05:30.159	2025-07-17 06:05:30.159
69	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 06:20:34.142	2025-07-17 06:20:34.142
70	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 06:32:15.508	2025-07-17 06:32:15.508
71	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 06:41:51.066	2025-07-17 06:41:51.066
72	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 06:53:42.116	2025-07-17 06:53:42.116
73	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 07:00:16.309	2025-07-17 07:00:16.309
74	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 08:40:28.403	2025-07-17 08:40:28.403
75	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 11:27:32.773	2025-07-17 11:27:32.773
76	1.0.10	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-17 12:00:38.024	2025-07-17 12:00:38.024
77	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 05:30:42.654	2025-07-18 05:30:42.654
78	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 05:37:42.184	2025-07-18 05:37:42.184
79	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 06:11:57.535	2025-07-18 06:11:57.535
80	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 06:42:39.633	2025-07-18 06:42:39.633
81	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 07:11:56.063	2025-07-18 07:11:56.063
82	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 08:17:15.664	2025-07-18 08:17:15.664
83	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 08:35:33.727	2025-07-18 08:35:33.727
84	1.0.11	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-18 10:22:11.566	2025-07-18 10:22:11.566
85	1.0.17	t	Google Play	t	\N	https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi&hl=en&gl=us	\N	2025-07-22 14:27:08.169	2025-07-22 14:27:08.169
\.


--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Attendance" (id, "userId", date, status, "createdAt", "updatedAt", department) FROM stdin;
1	41	2025-08-26 00:00:00	Available	2025-08-26 07:17:37.571	2025-08-26 07:17:37.571	\N
2	41	2025-08-28 00:00:00	Available	2025-08-28 04:49:38.551	2025-08-28 04:49:38.551	PD
3	41	2025-08-29 00:00:00	Available	2025-08-29 05:05:18.577	2025-08-29 05:05:18.577	PD
4	41	2025-09-01 00:00:00	Available	2025-09-01 05:55:18.567	2025-09-01 05:55:18.567	PD
5	41	2025-09-02 00:00:00	Available	2025-09-02 05:47:05.183	2025-09-02 05:47:05.183	PD
6	7	2025-09-02 00:00:00	Available	2025-09-02 09:52:35.363	2025-09-02 09:52:35.363	FI
7	14	2025-09-02 00:00:00	Available	2025-09-02 10:07:11.087	2025-09-02 10:07:11.087	FI
8	44	2025-09-02 00:00:00	Available	2025-09-02 10:38:51.606	2025-09-02 10:38:51.606	PD
9	44	2025-09-03 00:00:00	Available	2025-09-03 05:00:40.694	2025-09-03 05:00:40.694	PD
10	7	2025-09-03 00:00:00	Available	2025-09-03 09:54:29.751	2025-09-03 09:54:29.751	FI
11	41	2025-09-03 00:00:00	Available	2025-09-03 10:02:09.583	2025-09-03 10:02:09.583	FI
12	44	2025-09-04 00:00:00	Available	2025-09-04 04:30:19.925	2025-09-04 04:30:19.925	PD
13	45	2025-09-04 00:00:00	Available	2025-09-04 09:03:50.883	2025-09-04 09:03:50.883	PD
14	47	2025-09-04 00:00:00	Available	2025-09-04 11:22:04.478	2025-09-04 11:22:04.478	PD
15	47	2025-09-05 00:00:00	Available	2025-09-05 05:57:10.98	2025-09-05 05:57:10.98	PD
16	44	2025-09-09 00:00:00	Available	2025-09-09 05:07:56.244	2025-09-09 05:07:56.244	PD
17	44	2025-09-15 00:00:00	Available	2025-09-15 05:47:16.425	2025-09-15 05:47:16.425	PD
18	41	2025-09-18 00:00:00	Available	2025-09-18 09:34:46.373	2025-09-18 09:34:46.373	PD
19	41	2025-09-22 00:00:00	Available	2025-09-21 19:54:17.094	2025-09-21 19:54:17.094	PD
20	44	2025-09-22 00:00:00	Available	2025-09-22 09:00:34.34	2025-09-22 09:00:34.34	PD
21	44	2025-09-23 00:00:00	Available	2025-09-23 05:11:14.064	2025-09-23 05:11:14.064	PD
22	41	2025-09-23 00:00:00	Available	2025-09-23 07:25:33.309	2025-09-23 07:25:33.309	PD
23	47	2025-09-23 00:00:00	Available	2025-09-23 08:59:01.035	2025-09-23 08:59:01.035	FI
24	44	2025-09-24 00:00:00	Available	2025-09-24 05:50:11.35	2025-09-24 05:50:11.35	PD
25	47	2025-09-24 00:00:00	Available	2025-09-24 06:00:31.091	2025-09-24 06:00:31.091	FI
26	41	2025-09-24 00:00:00	Available	2025-09-24 06:26:44.598	2025-09-24 06:26:44.598	PD
27	7	2025-09-24 00:00:00	Available	2025-09-24 09:09:04.576	2025-09-24 09:09:04.576	FI
28	44	2025-09-25 00:00:00	Available	2025-09-25 04:34:31.42	2025-09-25 04:34:31.42	PD
29	47	2025-09-25 00:00:00	Available	2025-09-25 04:45:52.512	2025-09-25 04:45:52.512	PD
30	41	2025-09-25 00:00:00	Available	2025-09-25 05:34:18.585	2025-09-25 05:34:18.585	PD
31	41	2025-09-26 00:00:00	Available	2025-09-26 05:38:42.435	2025-09-26 05:38:42.435	PD
32	47	2025-09-26 00:00:00	Available	2025-09-26 06:23:37.929	2025-09-26 06:23:37.929	PD
33	44	2025-09-26 00:00:00	Available	2025-09-26 07:20:06.903	2025-09-26 07:20:06.903	PD
34	47	2025-09-27 00:00:00	Available	2025-09-27 14:18:29.283	2025-09-27 14:18:29.283	PD
35	47	2025-09-27 00:00:00	Available	2025-09-27 14:18:29.283	2025-09-27 14:18:29.283	PD
36	44	2025-09-29 00:00:00	Available	2025-09-29 04:53:30.925	2025-09-29 04:53:30.925	PD
37	47	2025-09-29 00:00:00	Available	2025-09-29 05:17:54.709	2025-09-29 05:17:54.709	PD
38	41	2025-09-29 00:00:00	Available	2025-09-29 05:49:55.655	2025-09-29 05:49:55.655	PD
39	41	2025-09-30 00:00:00	Available	2025-09-30 05:24:10.728	2025-09-30 05:24:10.728	PD
40	41	2025-10-03 00:00:00	Available	2025-10-03 00:07:58.531	2025-10-03 00:07:58.531	PD
41	47	2025-10-03 00:00:00	Available	2025-10-03 05:25:19.492	2025-10-03 05:25:19.492	PD
42	44	2025-10-03 00:00:00	Available	2025-10-03 06:00:15.739	2025-10-03 06:00:15.739	PD
43	11	2025-10-06 00:00:00	Available	2025-10-06 05:48:45.717	2025-10-06 05:48:45.717	FI
44	47	2025-10-06 00:00:00	Available	2025-10-06 09:16:49.849	2025-10-06 09:16:49.849	PD
45	44	2025-10-07 00:00:00	Available	2025-10-07 06:32:52.052	2025-10-07 06:32:52.052	PD
46	47	2025-10-07 00:00:00	Available	2025-10-07 06:35:46.059	2025-10-07 06:35:46.059	FI
47	44	2025-10-08 00:00:00	Available	2025-10-08 04:51:01.103	2025-10-08 04:51:01.103	PD
48	41	2025-10-08 00:00:00	Available	2025-10-08 08:11:59.091	2025-10-08 08:11:59.091	PD
49	47	2025-10-08 00:00:00	Available	2025-10-08 09:45:11.936	2025-10-08 09:45:11.936	FI
50	44	2025-10-09 00:00:00	Available	2025-10-09 04:23:26.356	2025-10-09 04:23:26.356	PD
51	41	2025-10-09 00:00:00	Available	2025-10-09 08:12:09.243	2025-10-09 08:12:09.243	PD
\.


--
-- Data for Name: Bank; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Bank" (id, name, logo, parent, "createdAt", "updatedAt") FROM stdin;
2	CitiBank India	\N	CITI Group	2025-09-01 06:08:56.861	2025-09-01 06:09:46.148
3	Citibank India1	https://example.com/citi-logo.png	Citigroup	2025-09-01 06:39:00.646	2025-09-01 06:39:00.646
6	indian	\N	\N	2025-09-02 05:23:14.991	2025-09-02 05:23:14.991
13	AXIS BANK	\N	india	2025-09-02 09:28:45.549	2025-09-15 10:28:14.43
\.


--
-- Data for Name: DepartmentRole; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."DepartmentRole" (id, "userId", department, role, "createdAt", "updatedAt", "officeId") FROM stdin;
576	12	FI	OperationsExecutive	2025-10-06 05:03:58.406	2025-10-06 05:03:58.406	8
577	2	FI	Admin	2025-10-06 05:04:09.131	2025-10-06 05:04:09.131	8
469	5	FI	Admin	2025-08-26 10:31:15.486	2025-08-26 10:31:15.486	1
470	5	PD	Verifier	2025-08-26 10:31:15.486	2025-08-26 10:31:15.486	16
94	15	FI	Admin	2025-08-13 07:46:47.257	2025-08-13 07:46:47.257	\N
170	29	FI	FieldExecutive	2025-08-18 06:27:03.28	2025-08-18 06:27:03.28	8
418	38	FI	Verifier	2025-08-22 09:53:17.373	2025-08-22 09:53:17.373	1
419	38	PD	OperationsExecutive	2025-08-22 09:53:17.373	2025-08-22 09:53:17.373	16
175	32	FI	FieldExecutive	2025-08-18 07:16:26.246	2025-08-18 07:16:26.246	12
104	19	FI	Admin	2025-08-13 11:00:46.581	2025-08-13 11:00:46.581	1
105	19	PD	Verifier	2025-08-13 11:00:46.581	2025-08-13 11:00:46.581	16
106	20	PD	Verifier	2025-08-13 11:15:48.232	2025-08-13 11:15:48.232	16
107	20	FI	Verifier	2025-08-13 11:15:48.232	2025-08-13 11:15:48.232	1
108	21	FI	Admin	2025-08-13 11:19:47.662	2025-08-13 11:19:47.662	1
109	21	PD	OperationsExecutive	2025-08-13 11:19:47.662	2025-08-13 11:19:47.662	16
110	22	FI	Admin	2025-08-13 11:20:33.501	2025-08-13 11:20:33.501	12
111	22	PD	OperationsExecutive	2025-08-13 11:20:33.501	2025-08-13 11:20:33.501	16
178	28	FI	Admin	2025-08-18 08:12:11.249	2025-08-18 08:12:11.249	1
179	28	PD	FieldExecutive	2025-08-18 08:12:11.249	2025-08-18 08:12:11.249	16
366	27	FI	OperationsExecutive	2025-08-22 07:26:55.871	2025-08-22 07:26:55.871	1
367	27	PD	FieldExecutive	2025-08-22 07:26:55.871	2025-08-22 07:26:55.871	16
186	13	FI	FieldExecutive	2025-08-19 06:07:01.264	2025-08-19 06:07:01.264	1
304	6	FI	OperationsExecutive	2025-08-22 05:17:14.541	2025-08-22 05:17:14.541	1
305	6	PD	OperationsExecutive	2025-08-22 05:17:14.541	2025-08-22 05:17:14.541	16
189	14	FI	FieldExecutive	2025-08-19 06:39:31.659	2025-08-19 06:39:31.659	1
129	18	FI	Admin	2025-08-13 12:34:08.89	2025-08-13 12:34:08.89	\N
493	39	PD	FieldExecutive	2025-08-29 06:51:39.656	2025-08-29 06:51:39.656	16
494	39	FI	Admin	2025-08-29 06:51:39.656	2025-08-29 06:51:39.656	8
315	37	PD	FieldExecutive	2025-08-22 06:12:06.225	2025-08-22 06:12:06.225	16
198	33	FI	Verifier	2025-08-21 05:06:27.581	2025-08-21 05:06:27.581	1
199	33	PD	FieldExecutive	2025-08-21 05:06:27.581	2025-08-21 05:06:27.581	16
503	17	FI	Admin	2025-09-01 05:25:42.854	2025-09-01 05:25:42.854	8
384	36	FI	OperationsExecutive	2025-08-22 09:18:18.101	2025-08-22 09:18:18.101	8
385	36	PD	OperationsExecutive	2025-08-22 09:18:18.101	2025-08-22 09:18:18.101	16
504	3	FI	OperationsExecutive	2025-09-01 05:26:46.606	2025-09-01 05:26:46.606	1
206	34	FI	FieldExecutive	2025-08-21 05:18:34.244	2025-08-21 05:18:34.244	1
207	34	PD	FieldExecutive	2025-08-21 05:18:34.244	2025-08-21 05:18:34.244	16
505	3	PD	OperationsExecutive	2025-09-01 05:26:46.606	2025-09-01 05:26:46.606	21
146	26	FI	Admin	2025-08-14 08:01:48.888	2025-08-14 08:01:48.888	8
216	24	FI	Admin	2025-08-21 06:28:21.602	2025-08-21 06:28:21.602	18
217	24	PD	FieldExecutive	2025-08-21 06:28:21.602	2025-08-21 06:28:21.602	16
218	23	PD	FieldExecutive	2025-08-21 06:28:33.231	2025-08-21 06:28:33.231	16
219	25	PD	FieldExecutive	2025-08-21 06:28:44.719	2025-08-21 06:28:44.719	20
222	31	FI	FieldExecutive	2025-08-21 06:53:03.16	2025-08-21 06:53:03.16	1
223	30	FI	FieldExecutive	2025-08-21 06:53:51.066	2025-08-21 06:53:51.066	1
462	15	PD	FieldExecutive	2025-08-26 08:35:18.664	2025-08-26 08:35:18.664	19
463	42	FI	FieldExecutive	2025-08-26 09:02:02.829	2025-08-26 09:02:02.829	1
464	42	PD	FieldExecutive	2025-08-26 09:02:02.829	2025-08-26 09:02:02.829	19
529	46	FI	FieldExecutive	2025-09-01 10:42:23.556	2025-09-01 10:42:23.556	8
530	46	PD	OperationsExecutive	2025-09-01 10:42:23.556	2025-09-01 10:42:23.556	21
531	8	PD	OperationsExecutive	2025-09-02 09:00:02.669	2025-09-02 09:00:02.669	21
544	16	FI	Admin	2025-09-02 09:04:23.101	2025-09-02 09:04:23.101	1
545	16	PD	OperationsExecutive	2025-09-02 09:04:23.101	2025-09-02 09:04:23.101	16
546	9	FI	Admin	2025-09-02 09:04:29.395	2025-09-02 09:04:29.395	1
547	9	PD	OperationsExecutive	2025-09-02 09:04:29.395	2025-09-02 09:04:29.395	16
552	1	FI	Admin	2025-09-02 09:06:32.314	2025-09-02 09:06:32.314	1
553	1	PD	Admin	2025-09-02 09:06:32.314	2025-09-02 09:06:32.314	16
556	43	FI	Admin	2025-09-02 10:00:10.469	2025-09-02 10:00:10.469	1
557	43	PD	Admin	2025-09-02 10:00:10.469	2025-09-02 10:00:10.469	16
558	35	FI	Admin	2025-09-02 10:00:32.462	2025-09-02 10:00:32.462	1
559	35	PD	Admin	2025-09-02 10:00:32.462	2025-09-02 10:00:32.462	16
560	4	FI	Admin	2025-09-02 10:16:42.755	2025-09-02 10:16:42.755	1
561	4	PD	Admin	2025-09-02 10:16:42.755	2025-09-02 10:16:42.755	16
562	44	PD	FieldExecutive	2025-09-02 10:24:45.092	2025-09-02 10:24:45.092	16
563	41	FI	FieldExecutive	2025-09-03 07:08:05.073	2025-09-03 07:08:05.073	8
564	41	PD	FieldExecutive	2025-09-03 07:08:05.073	2025-09-03 07:08:05.073	19
565	45	PD	FieldExecutive	2025-09-04 09:02:49.675	2025-09-04 09:02:49.675	21
566	47	FI	FieldExecutive	2025-09-04 11:14:13.263	2025-09-04 11:14:13.263	1
567	47	PD	FieldExecutive	2025-09-04 11:14:13.263	2025-09-04 11:14:13.263	16
568	37	FI	Admin	2025-09-09 04:40:40.349	2025-09-09 04:40:40.349	1
569	40	FI	Admin	2025-09-18 09:48:43.328	2025-09-18 09:48:43.328	1
570	40	PD	Admin	2025-09-18 09:48:43.328	2025-09-18 09:48:43.328	16
571	7	FI	FieldExecutive	2025-09-22 08:58:18.978	2025-09-22 08:58:18.978	1
572	7	PD	FieldExecutive	2025-09-22 08:58:18.978	2025-09-22 08:58:18.978	16
573	11	FI	FieldExecutive	2025-10-06 05:03:21.809	2025-10-06 05:03:21.809	8
574	10	FI	Verifier	2025-10-06 05:03:37.542	2025-10-06 05:03:37.542	8
\.


--
-- Data for Name: EditRequest; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."EditRequest" (id, "loanId", "verificationId", "requestedBy", "approvedBy", status, changes, remarks, "createdAt", "updatedAt", type, department) FROM stdin;
1	\N	\N	41	1	Approved	{"mobile": "9000000011", "officeId": 8, "userName": "Field I", "newDeviceId": "e918f6a1cd220788", "oldDeviceId": "56eca19920b29cf4", "employeeCode": "80"}	\N	2025-08-26 08:33:57.753	2025-08-26 09:27:16.48	Login	\N
2	\N	\N	41	40	Approved	{"mobile": "9000000011", "officeId": 8, "userName": "Field I", "newDeviceId": "56eca19920b29cf4", "oldDeviceId": "e918f6a1cd220788", "employeeCode": "80"}	\N	2025-08-28 04:49:02.415	2025-08-28 04:49:31.142	Login	\N
4	52	42	43	43	Approved	{"businessDetails": {"geoTag": "17.4504,78.3911", "constitution": "Proprietorship", "nameBoardSeen": "Yes", "totalExperience": "5", "nameBoardMatched": "Yes", "businessStartYear": "2019", "isAddressTraceable": "Yes", "isBusinessSeasonal": "No"}}	\N	2025-08-28 05:25:04.23	2025-08-28 05:25:28.513	LoanData	\N
5	52	42	43	43	Approved	{"basicDetails": {"aadhar": "451242351426", "panNumber": "ABCDE5678F", "businessName": "Prem Enterprises", "applicantName": "Prem", "isAddressSame": "No", "businessAddress": "Plot No. 12, Main Road, Kukatpally, Hyderabad, Telangana", "businessProfile": "Retail business selling home appliances", "addressCorrection": "Corrected to: Plot No. 12, Kukatpally Main Roaddsd", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}}	\N	2025-08-28 05:47:46.05	2025-08-28 05:48:12.476	LoanData	\N
12	65	48	43	43	Approved	{"basicDetails": {"aadhar": "232355555554", "panNumber": "HAJPP4839Q", "businessName": "dhana sree ", "applicantName": "mohan reddy", "isAddressSame": "Yes", "businessAddress": "ayyapa society", "businessProfile": "Retail ", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}, "businessDetails": {"geoTag": "17.4642849,78.3679664", "constitution": "Trust", "nameBoardSeen": "Yes", "totalExperience": "3", "nameBoardMatched": "Yes", "businessStartYear": "2012", "isAddressTraceable": "Yes", "isBusinessSeasonal": "Yes"}}	\N	2025-09-03 11:06:13.989	2025-09-03 11:06:27.68	LoanData	\N
51	198	83	43	43	Rejected	{"basicDetails": {"address": "DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526\\n", "bankName": "TATA CAPITAL LIMITED", "loanAmount": "2500000", "businessName": "SAI KUMAR POULTRY FARM\\n", "mobileNumber": "9912994740", "applicantName": "Mokshit kumar", "applicationNumber": "11oo11"}, "businessDetails": {"netMargin": "25000", "occupiedSince": "15", "stockObserved": "100000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:32:02.511	2025-09-15 07:39:00.533	LoanData	\N
52	65	48	43	43	Rejected	{"basicDetails": {"aadhar": "232355555554", "panNumber": "HAJPP4839L", "businessName": "dhana sree ", "applicantName": "mohan reddy", "isAddressSame": "Yes", "businessAddress": "ayyapa society", "businessProfile": "Retail ", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}, "miscellaneous": {"stockSeen": "Yes", "employeesSeen": "55", "areaOfPremises": "250 to 400 Sq.ft", "localityOfBusiness": "Commercial", "otherSetupObserved": "Ccv", "ownershipOfPremises": "Owned", "politicallyConnected": "Yes", "yearsInCurrentPremises": "55", "employeesUnderApplicant": "88"}, "businessDetails": {"geoTag": "17.4642849,78.3679664", "constitution": "Trust", "nameBoardSeen": "Yes", "totalExperience": "4", "nameBoardMatched": "Yes", "businessStartYear": "2012", "isAddressTraceable": "Yes", "isBusinessSeasonal": "Yes"}}	\N	2025-09-15 07:40:38.442	2025-09-15 07:41:05.771	LoanData	\N
19	65	48	43	43	Rejected	{"basicDetails": {"aadhar": "232355555554", "panNumber": "HAJPP4839Q", "businessName": "dhana sree ", "applicantName": "mohan reddy", "isAddressSame": "Yes", "businessAddress": "ayyapa society", "businessProfile": "Retails", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}}	\N	2025-09-04 04:58:09.374	2025-09-04 04:58:29.859	LoanData	\N
21	65	48	43	43	Rejected	{"basicDetails": {"aadhar": "232355555554", "panNumber": "HAJPP4839Q", "businessName": "dhana sree ", "applicantName": "mohan reddy", "isAddressSame": "Yes", "businessAddress": "ayyapa society", "businessProfile": "Retailas", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}, "miscellaneous": {"stockSeen": "Yes", "employeesSeen": "55", "areaOfPremises": "250 to 400 Sq.ft", "localityOfBusiness": "Commercial", "otherSetupObserved": "Ccvhv", "ownershipOfPremises": "Owned", "politicallyConnected": "Yes", "yearsInCurrentPremises": "555", "employeesUnderApplicant": "88"}, "businessDetails": {"geoTag": "17.4642849,78.3679664", "constitution": "Trust", "nameBoardSeen": "Yes", "totalExperience": "3", "nameBoardMatched": "Yes", "businessStartYear": "2013", "isAddressTraceable": "Yes", "isBusinessSeasonal": "Yes"}}	\N	2025-09-04 04:59:31.913	2025-09-04 05:01:26.741	LoanData	\N
53	198	83	43	4	Approved	{"basicDetails": {"address": "DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526\\n", "bankName": "TATA CAPITAL LIMITED", "loanAmount": "2500000", "businessName": "SAI KUMAR POULTRY FARM\\n", "mobileNumber": "9912994741", "applicantName": "Mokshit kumar", "applicationNumber": "11oo11"}, "businessDetails": {"netMargin": "25000", "occupiedSince": "20", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}, "applicantDetails": {"assets": "Bike,car, auto , cycle ", "purchase": "5500000", "houseSize": "500-1000 sq.ft", "personMet": "Others", "incomeDetails": "Test20000", "maritalStatus": "Married", "purposeOfLoan": "200000", "workExperience": "10", "nameOfCoApplicant": "Mohan ", "relationshipDuration": "More than 10 years", "educationalQualification": "Others", "currentResidentialAddress": "Madhapur "}}	\N	2025-09-15 07:42:35.477	2025-09-15 07:47:47.53	LoanData	\N
54	100	79	4	4	Approved	{"businessDetails": {"netMargin": "2525555555633658888555985598888888888888855555555555555", "businessType": "test type ", "occupiedSince": "2525555555633658888555985598888888888888855555555555555", "stockObserved": "52525555555633658888555985598888888888888855555555555555", "natureOfBusiness": "Service Provider", "businessStartYear": "2525555555633658888555985598888888888888855555555555555", "employeesDeclared": "2525555555633658888555985598888888888888855555555555555", "employeesObserved": "765", "rawMaterialSupplier": "2525555555633658888555985598888888888888855555555555555", "businessPremisesSize": "100-500 sq.ft", "constitutionOfBusiness": "Partnership", "businessActivityObserved": "Wholesale"}}	\N	2025-09-15 07:48:11.769	2025-09-15 07:49:26.241	LoanData	\N
55	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "20", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "31208", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:48:34.96	2025-09-15 07:49:29.074	LoanData	\N
56	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "20", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "31208", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:48:35.052	2025-09-15 07:49:31.547	LoanData	\N
57	198	83	4	4	Approved	{"applicantDetails": {"assets": "Bike,car, auto , cycle ", "purchase": "5500000", "houseSize": "500-1000 sq.ft", "personMet": "Others", "incomeDetails": "Test20000", "maritalStatus": "Married", "purposeOfLoan": "200000tt", "workExperience": "10", "nameOfCoApplicant": "Mohan ", "relationshipDuration": "More than 10 years", "educationalQualification": "Others", "currentResidentialAddress": "Madhapur "}}	\N	2025-09-15 07:49:56.462	2025-09-15 07:50:37.62	LoanData	\N
49	100	79	4	43	Rejected	{"businessDetails": {"netMargin": "2525555555633658888555985598888888888888855555555555555", "businessType": "tyg", "occupiedSince": "2525555555633658888555985598888888888888855555555555555", "stockObserved": "52525555555633658888555985598888888888888855555555555555", "natureOfBusiness": "Service Provider", "businessStartYear": "2525555555633658888555985598888888888888855555555555555", "employeesDeclared": "2525555555633658888555985598888888888888855555555555555", "employeesObserved": "tfy", "rawMaterialSupplier": "2525555555633658888555985598888888888888855555555555555", "businessPremisesSize": "100-500 sq.ft", "constitutionOfBusiness": "Partnership", "businessActivityObserved": "Wholesale"}}	\N	2025-09-15 07:26:38.148	2025-09-15 07:28:55.425	LoanData	\N
80	884	147	4	4	Approved	{"proposedLoanDetails": {"amount": "1000", "tenure": "6", "product": "Apply ", "bankName": "Indian ", "accountNo": "Qyhdh536677777777", "repaymentFrom": "2025hnmkjmujhjjuujhju", "typeSAAccount": "Saving "}}	\N	2025-10-07 09:03:58.171	2025-10-07 09:04:08.147	LoanData	\N
82	886	148	4	4	Approved	{"tradeReferences": {"customers": [{"contactDetails": "4565456545464545", "nameOfCustomer": "34rty"}], "suppliers": [{"contactDetails": "Hh", "nameOfSuppliers": "Vb"}]}}	\N	2025-10-07 09:32:58.412	2025-10-07 09:33:10.025	LoanData	\N
38	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "gyhb ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "312", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 06:55:32.569	2025-09-15 06:55:50.74	LoanData	\N
42	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "312", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:04:31.526	2025-09-15 07:04:54.801	LoanData	\N
41	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "312", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:04:31.412	2025-09-15 07:05:16.729	LoanData	\N
36	\N	\N	41	43	Rejected	{"mobile": "9000000011", "officeId": 8, "userName": "Field I", "newDeviceId": "e918f6a1cd220788", "oldDeviceId": "56eca19920b29cf4", "employeeCode": "804444444444444"}	\N	2025-09-04 11:12:37.752	2025-09-05 06:34:06.071	Login	\N
37	198	83	4	4	Approved	{"familyMemberDetails": [{"age": "25", "name": "Happi", "relation": "Other", "mobileNumber": "9912994741", "otherRelation": "+919912994741", "employmentType": "Unemployed", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}, {"age": "56567", "name": "tfcv ", "relation": "Mother", "mobileNumber": "7867656566", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}]}	\N	2025-09-15 06:13:32.385	2025-09-15 06:13:43.416	LoanData	\N
40	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "gyhb ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "312", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 06:55:32.771	2025-09-15 06:55:43.341	LoanData	\N
39	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "gyhb ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "312", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 06:55:32.731	2025-09-15 06:55:47.289	LoanData	\N
44	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:06:17.137	2025-09-15 07:07:14.961	LoanData	\N
43	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "LLP", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:06:17.122	2025-09-15 07:07:17.568	LoanData	\N
46	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:07:49.431	2025-09-15 07:24:08.098	LoanData	\N
45	198	83	4	4	Approved	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "15", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:07:49.429	2025-09-15 07:24:11.219	LoanData	\N
48	100	79	4	43	Rejected	{"businessDetails": {"netMargin": "2525555555633658888555985598888888888888855555555555555", "businessType": "tyg", "occupiedSince": "2525555555633658888555985598888888888888855555555555555", "stockObserved": "52525555555633658888555985598888888888888855555555555555", "natureOfBusiness": "Service Provider", "businessStartYear": "2525555555633658888555985598888888888888855555555555555", "employeesDeclared": "2525555555633658888555985598888888888888855555555555555", "employeesObserved": "tfy", "rawMaterialSupplier": "2525555555633658888555985598888888888888855555555555555", "businessPremisesSize": "100-500 sq.ft", "constitutionOfBusiness": "Partnership", "businessActivityObserved": "Wholesale"}}	\N	2025-09-15 07:26:38.127	2025-09-15 07:29:00.148	LoanData	\N
47	198	83	4	43	Rejected	{"businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "150", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "3120", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}}	\N	2025-09-15 07:24:31.052	2025-09-15 07:29:03.663	LoanData	\N
50	198	83	43	43	Rejected	{"basicDetails": {"address": "DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526\\n", "bankName": "TATA CAPITAL LIMITED", "loanAmount": "2500000", "businessName": "SAI KUMAR POULTRY FARM\\n", "mobileNumber": "9912994741", "applicantName": "Mokshit kumar", "applicationNumber": "11oo11"}}	\N	2025-09-15 07:29:45.115	2025-09-15 07:30:38.479	LoanData	\N
58	100	79	4	4	Approved	{"businessDetails": {"netMargin": "2525555555633658888555985598888888888888855555555555555", "businessType": "test type ", "occupiedSince": "2525555555633658888555985598888888888888855555555555555", "stockObserved": "52525555555633658888555985598888888888888855555555555555", "natureOfBusiness": "Service Provider", "businessStartYear": "2525555555633658888555985598888888888888855555555555555", "employeesDeclared": "2525555555633658888555985598888888888888855555555555555", "employeesObserved": "765", "rawMaterialSupplier": "2525555555633658888555985598888888888888855555555555555", "businessPremisesSize": "100-500 sq.ft", "constitutionOfBusiness": "Partnership", "businessActivityObserved": "Wholesaletxgfv"}}	\N	2025-09-15 07:50:22.203	2025-09-15 07:50:34.601	LoanData	\N
59	198	83	4	4	Approved	{"applicantDetails": {"assets": "Bike,car, auto , cycle ", "purchase": "5500000", "houseSize": "500-1000 sq.ft", "personMet": "Others", "incomeDetails": "Test20000", "maritalStatus": "Married", "purposeOfLoan": "200000tt", "workExperience": "rfcrfv", "nameOfCoApplicant": "Mohan ", "relationshipDuration": "More than 10 years", "educationalQualification": "Others", "currentResidentialAddress": "Madhapur "}}	\N	2025-09-15 07:50:50.664	2025-09-15 09:40:25.085	LoanData	\N
61	714	99	43	43	Approved	{"clientsDebtors": {"clientsDebtors": {"turnover": "64656", "netMargins": "64", "creditPeriod": "6868", "customer1Name": "Gdhhd", "customer2Name": "Shdh", "customer3Name": "", "customer1Phone": "64656", "customer2Phone": "65656", "customer3Phone": "", "customer1Review": "positive", "customer2Review": "positive", "customer3Review": "", "customer1Location": "Hhdhd", "customer2Location": "Hdhdh", "customer3Location": "", "cashChequeProportions": "Hdhdh", "numberOfFixedCustomers": "3565", "averageStockMaintenance": "65656"}}}	\N	2025-09-24 10:06:13.627	2025-09-24 10:06:44.828	LoanData	\N
62	714	99	43	43	Approved	{"salariesWages": {"salariesWages": {"remarks": "Hdhd", "statusOfLabour": "permanent", "numberOfLabours": "6465", "workingHoursEnd": "17:10", "statusOfEmployee": "permanent", "numberOfEmployees": "65", "workingHoursStart": "09:10", "wagesPerMonthPerDay": "6461", "otherMajorExpenditure": "Hshs", "salaryPerMonthPerEmployee": "65665"}}}	\N	2025-09-24 10:12:11.048	2025-09-24 10:12:24.635	LoanData	\N
63	721	100	43	43	Approved	{"familyMemberDetails": [{"age": "34", "name": "afe", "relation": "Mother", "mobileNumber": "2825555554", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}]}	\N	2025-09-24 12:15:24.484	2025-09-24 12:15:40.959	LoanData	\N
64	721	100	43	43	Approved	{"familyMemberDetails": [{"age": "34", "name": "afe", "relation": "Mother", "mobileNumber": "2825555554", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}, {"age": "45", "name": "Vvv", "relation": "Sister", "mobileNumber": "2353457433", "employmentType": "Housewife", "stayingWithApplicant": "Yes", "educationalQualification": "Professional"}]}	\N	2025-09-24 12:26:44.206	2025-09-24 12:27:30.957	LoanData	\N
60	100	79	4	43	Rejected	{"businessDetails": {"netMargin": "2525555555633658888555985598888888888888855555555555555", "businessType": "test type ", "occupiedSince": "2525555555633658888555985598888888888888855555555555555", "stockObserved": "52525555555633658888555985598888888888888855555555555555", "natureOfBusiness": "Service Provider", "businessStartYear": "2525555555633658888555985598888888888888855555555555555", "employeesDeclared": "2525555555633658888555985598888888888888855555555555555", "employeesObserved": "765", "rawMaterialSupplier": "2525555555633658888555985598888888888888855555555555555", "businessPremisesSize": "100-500 sq.ft", "constitutionOfBusiness": "Private Limited", "businessActivityObserved": "Wholesaletxgfv"}}	\N	2025-09-15 07:51:22.924	2025-09-24 12:27:34.977	LoanData	\N
65	721	100	43	43	Approved	{"suppliersCreditors": {"suppliersCreditors": {"creditPeriod": "6465", "cashChequeProportions": "Hdh", "numberOfFixedSuppliers": "5665"}}, "familyMemberDetails": [{"age": "326", "name": "Namme", "relation": "Father", "mobileNumber": "6565668686", "otherRelation": "", "employmentType": "Farmer/Agriculturist", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}, {"age": "656", "name": "Hdhh", "relation": "Son", "mobileNumber": "6565665665", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}, {"age": "456", "name": "DSFD", "relation": "Mother", "mobileNumber": "7558654323", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}]}	\N	2025-09-25 04:30:02.782	2025-09-25 04:30:10.885	LoanData	\N
66	714	99	43	43	Approved	{"basicDetails": {"phoneNo": "4456765465", "applicantName": "efsdgs", "nameOfConcern": "wegrsd", "initiatedAddress": "gWREHT"}}	\N	2025-09-25 04:55:03.886	2025-09-25 04:55:16.921	LoanData	\N
76	879	144	43	43	Rejected	{"familyDetails": {"aboutApplicant": "About app", "aboutCoApplicant": "About co00", "andTheirFamilyDetails": "Ab fam"}, "businessDetails": {"margins": "Mar", "gstNumber": "73737388", "legalName": "Le nameww", "tradeName": "Td name", "shopAddress": "Hydd kond", "businessName": "Bus name", "typeOfEntity": "Typ en", "establishment": "Hydd", "godownAddress": "God add", "lastGSTReturn": "25000", "shopOwnership": "Owned", "productDetails": "Prod de", "businessProcess": "Bus pro", "godownOwnership": "Rented", "activityObserved": "Ac ob", "natureOfBusiness": "Nat", "documentsObserved": "Obse"}}	\N	2025-10-06 12:04:39.108	2025-10-06 12:04:51.134	LoanData	\N
79	884	147	4	4	Approved	{"proposedLoanDetails": {"amount": "1000", "tenure": "6", "product": "Apply ", "bankName": "Indian ", "accountNo": "Qyhdh536677777777", "repaymentFrom": "2025hnmkjmujhjjuujhju", "typeSAAccount": "Saving "}}	\N	2025-10-07 09:03:58.051	2025-10-07 09:04:13.329	LoanData	\N
91	907	163	43	43	Rejected	{"caseDetails": {"contactNo": "6787654567", "personMet": "", "coApplicant": "Gg", "addressVisited": "bnmn", "typeOfBorrower": "Partnership Firm", "nameOfApplicant": "test12", "referenceNumber": "test12"}, "outputsSupply": {"creditTerms": "Hf4r", "marketForOutput": "nnG", "modeOfMarketing": "J", "typeOfCustomers": "H", "stockOfFinishedGoods": "H"}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "66", "name": "Gh", "remarks": "G", "relation": "Ty", "occupation": "Gg", "qualification": "Under graduate"}, {"age": 56, "name": "c", "remarks": "Hshe", "relation": "Rel2", "occupation": "Occ2", "qualification": "Below 10th"}]}}	\N	2025-10-09 06:39:16.116	2025-10-09 06:40:09.059	LoanData	\N
67	732	104	43	43	Approved	{"basicDetails": {"phoneNo": "9494525451", "noOfVisit": "2", "personMet": "applicant", "constitution": "private_limited", "applicantName": "KATEVADA KAVITHA", "nameOfConcern": "dhana sree reddy ", "aboutApplicant": "Well mannered", "visitedAddress": "Madhapur", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "madhapur", "coApplicantDetails": "Good co applicant", "residentialDetails": "Good house"}, "salariesWages": {"salariesWages": {"remarks": "None", "statusOfLabour": "contractual", "numberOfLabours": "0", "workingHoursEnd": "07:00", "statusOfEmployee": "permanent", "numberOfEmployees": "200", "workingHoursStart": "10:00", "wagesPerMonthPerDay": "0", "otherMajorExpenditure": "None", "salaryPerMonthPerEmployee": "30000"}}, "clientsDebtors": {"clientsDebtors": {"turnover": "400", "netMargins": "6000", "creditPeriod": "24", "customer1Name": "RTYY", "customer1Phone": "2453564685", "customer1Review": "positive", "customer1Location": "DG", "cashChequeProportions": "30/37", "numberOfFixedCustomers": "20", "averageStockMaintenance": "200"}}, "suppliersCreditors": {"suppliersCreditors": {"suppliers": [{"name": "Arvind", "phone": "9999999998", "review": "positive", "location": "Hyderabad "}, {"name": "SSSD", "phone": "4356354657", "review": "positive", "location": "SDG"}], "creditPeriod": "25", "cashChequeProportions": "12/30", "numberOfFixedSuppliers": "20"}}, "familyMemberDetails": [{"age": "20", "name": "Raj", "relation": "Son", "mobileNumber": "8989898989", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}, {"age": "25", "name": "Vvv", "relation": "Father", "mobileNumber": "2353457457", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "shareholdingDetails": {"shareholders": [{"name": "Shanmukh", "designation": "Manager", "shareholdingPercentage": "51", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Function"}, {"name": "vinay", "designation": "yt", "shareholdingPercentage": "28", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Fucntion"}]}}	\N	2025-09-25 07:05:57.019	2025-09-25 07:06:12.193	LoanData	\N
68	767	113	43	43	Approved	{"familyMemberDetails": [{"age": "60", "name": "Narshimha ", "relation": "Father", "mobileNumber": "9949006271", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}, {"age": "45", "name": "Vvv", "relation": "Son", "mobileNumber": "2353457433", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}]}	\N	2025-09-26 05:10:44.265	2025-09-26 05:11:21.341	LoanData	\N
69	767	113	43	43	Rejected	{"existingLoans": {"loans": [{"emi": "55", "tenure": "556", "purpose": "Business development ", "bankName": " Indian ", "loanAmount": "39959855"}]}, "salariesWages": {"salariesWages": {"remarks": "Ark", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "17:59", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "17:59", "wagesPerMonthPerDay": "400", "otherMajorExpenditure": "Fvv", "salaryPerMonthPerEmployee": "40"}}}	\N	2025-09-26 05:29:03.425	2025-09-26 05:29:23.579	LoanData	\N
70	767	113	43	43	Rejected	{"assetDetails": {"assetDetails": {"assets": [{"address": "C vh", "mortgaged": "yes", "ownerName": "Gh", "marketValue": "88", "areaMeasured": "26", "purchaseCost": "88", "purchaseYear": "88"}], "status": "positive", "remarks": "Vbb", "vehicles": "car", "otherIncome": "Vv", "observations": "Vbb", "siteCoordinates": "Ghh", "lifeInsuranceMediclaim": "Vvvb", "capitalInvestedBusiness": "Vbb", "liquidMoveableMonetaryItems": "Cvvvgg"}}, "basicDetails": {"phoneNo": "9912994741", "noOfVisit": "2", "personMet": "other", "constitution": "other", "applicantName": "dhana reddy", "nameOfConcern": "dhana sree", "aboutApplicant": "Good ", "visitedAddress": "Shaikpet ", "structureOfLoan": "other", "appointmentFixed": "yes", "initiatedAddress": "suraj residency", "coApplicantDetails": "Good co applicant ", "residentialDetails": "Owner of the house "}, "existingLoans": {"loans": [{"emi": "55", "tenure": "556", "purpose": "Business development ", "bankName": " Indian ", "loanAmount": "39959856"}, {"emi": "5", "tenure": "44", "purpose": "wrfe", "bankName": "wffe", "loanAmount": "3422"}]}, "suppliersCreditors": {"suppliersCreditors": {"suppliers": [{"name": "Mokshith ", "phone": "9490080005", "review": "positive", "location": "Sha"}, {"name": "fasae", "phone": "4235754213", "review": "positive", "location": "szgfsh"}], "creditPeriod": "400", "cashChequeProportions": "300", "numberOfFixedSuppliers": "500"}}, "shareholdingDetails": {"shareholders": [{"name": "Eshwarammaaaa", "designation": "House wife ", "shareholdingPercentage": "20", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "other", "functionalOfPartnerDirector": "Qa"}]}}	\N	2025-09-26 06:03:03.346	2025-09-26 06:03:20.844	LoanData	\N
71	879	144	43	43	Approved	{"caseDetails": {"contactNo": "676866895", "personMet": "Person", "coApplicant": "Co", "dateOfVisit": "11-12-2025", "addressVisited": "Address", "meetingDetails": "Meetung", "typeOfBorrower": "Type22", "nameOfApplicant": "Name", "referenceNumber": "Losid"}, "outputsSupply": {"creditTerms": "Cred terrrr", "marketForOutput": "Mar", "modeOfMarketing": "Mode", "typeOfCustomers": "Ty cust", "stockOfFinishedGoods": "Stoc finish good"}}	\N	2025-10-06 10:19:24.908	2025-10-06 10:19:40.909	LoanData	\N
72	879	144	43	43	Approved	{"caseDetails": {"contactNo": "676866895", "personMet": "Person", "coApplicant": "Co", "dateOfVisit": "11-12-2025", "addressVisited": "Address", "meetingDetails": "Meetung", "typeOfBorrower": "Type2233", "nameOfApplicant": "Name", "referenceNumber": "Losid"}}	\N	2025-10-06 10:21:00.821	2025-10-06 10:21:14.23	LoanData	\N
73	879	144	43	43	Approved	{"caseDetails": {"contactNo": "676866895", "personMet": "Person", "coApplicant": "Co", "dateOfVisit": "11-12-2025", "addressVisited": "Address1233", "meetingDetails": "Meetung", "typeOfBorrower": "Type2233", "nameOfApplicant": "Name", "referenceNumber": "Losid"}, "employeeDetails": {"pfEsiApplied": "Yes pf", "noOfEmployees": "25", "salaryDetails": "Sal detaisl"}}	\N	2025-10-06 10:32:47.903	2025-10-06 10:33:03.731	LoanData	\N
74	879	144	43	43	Approved	{"tradeReferences": {"customers": [{"contactDetails": "737373773", "nameOfCustomer": "Vust2"}, {"contactDetails": "73773737", "nameOfCustomer": "Vust2"}], "suppliers": [{"contactDetails": "Cont1", "nameOfSuppliers": "Supp 1"}, {"contactDetails": "Cont2-7838", "nameOfSuppliers": "Sup2"}, {"contactDetails": "8776667887", "nameOfSuppliers": "sup3"}]}}	\N	2025-10-06 10:33:54.884	2025-10-06 10:34:18.071	LoanData	\N
75	65	48	43	43	Approved	{"businessDetails": {"geoTag": "17.4642849,78.3679664", "constitution": "Trust", "nameBoardSeen": "Yes", "totalExperience": "4", "nameBoardMatched": "Yes", "businessStartYear": "2012", "isAddressTraceable": "Yes", "isBusinessSeasonal": "Yes"}, "thirdPartyCheck": {"checks": [{"tpcName": "Testing man", "comments": "Moon", "mobileNumber": "9912994741", "relationship": "Neighbor", "feedbackStatus": "Positive"}, {"tpcName": "te", "comments": "sddd", "mobileNumber": "4642456543", "relationship": "Neighbor", "feedbackStatus": "Positive"}]}}	\N	2025-10-06 10:59:05.741	2025-10-06 10:59:21.974	LoanData	\N
77	879	144	43	43	Approved	{"netWorth": {"netWorth": [{"ownerName": "Rajh", "typeOfProperty": "Lic fc", "yearsOfOwnership": "Solo", "approxMarketValue": "250009"}, {"ownerName": "Rahh2", "typeOfProperty": "Lic fc2", "yearsOfOwnership": "2050", "approxMarketValue": "293939"}, {"ownerName": "acaaqad", "typeOfProperty": "ddwd", "yearsOfOwnership": "4555", "approxMarketValue": "876876"}]}, "caseDetails": {"contactNo": "676866895", "personMet": "Person", "coApplicant": "Co", "dateOfVisit": "11-12-2025", "addressVisited": "Address1233", "meetingDetails": "Meetung", "typeOfBorrower": "Type2233", "nameOfApplicant": "Nameee", "referenceNumber": "Losid"}, "loansDetails": {"loansDetails": [{"os": "5", "emi": "5", "product": "Prod1", "remarks": "Good", "loanAmount": "636367", "nameOfBankInstitution": "Acis"}, {"os": "5", "emi": 5, "product": "qdwd", "remarks": "ggg", "loanAmount": 35533, "nameOfBankInstitution": "sdd"}]}, "familyDetails": {"aboutApplicant": "About app", "aboutCoApplicant": "About cooo", "andTheirFamilyDetails": "Ab fam"}, "outputsSupply": {"creditTerms": "Cred terrrr", "marketForOutput": "Mar", "modeOfMarketing": "Modeeee", "typeOfCustomers": "Ty cust", "stockOfFinishedGoods": "Stoc finish good"}, "businessDetails": {"margins": "Mar", "gstNumber": "73737388", "legalName": "Le name", "tradeName": "Td name", "shopAddress": "Hydd kond", "businessName": "Bus name", "typeOfEntity": "Typ ennnn", "establishment": "Hydd", "godownAddress": "God add", "lastGSTReturn": "25000", "shopOwnership": "Owned", "productDetails": "Prod de", "businessProcess": "Bus pro", "godownOwnership": "Rented", "activityObserved": "Ac ob", "natureOfBusiness": "Nat", "documentsObserved": "Obse"}, "employeeDetails": {"pfEsiApplied": "Yes pf", "noOfEmployees": "25", "salaryDetails": "Sal detaislsss"}, "inputsPurchases": {"orderCycle": "Ord cyc", "creditTerms": "25", "avgOrderQnty": "255", "otherRemarks": "Othe rem", "detailsOfInputs": "Deti", "purchaseDetails": "Pur"}, "tradeReferences": {"customers": [{"contactDetails": "737373773", "nameOfCustomer": "Vust2"}, {"contactDetails": "73773737", "nameOfCustomer": "Vust2"}, {"contactDetails": "454323456", "nameOfCustomer": "vust3"}], "suppliers": [{"contactDetails": "Cont1", "nameOfSuppliers": "Supp 1"}, {"contactDetails": "Cont2-7838", "nameOfSuppliers": "Sup2"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "Age1", "name": "Name1", "remarks": "Rem", "relation": "Rel", "occupation": "Icc", "qualification": "Qua"}, {"age": "Age", "name": "Name2", "remarks": "Hshe", "relation": "Rel2", "occupation": "Occ2", "qualification": "Qu2"}, {"age": 24, "name": "name2", "remarks": "ac", "relation": "d", "occupation": "ddd", "qualification": "10th pass"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Secert", "sourceOfIncome": "Other in"}, {"details": "Secerey2", "sourceOfIncome": "Other in2"}, {"details": "2edd", "sourceOfIncome": "trddd"}]}}	\N	2025-10-07 07:01:57.087	2025-10-07 07:02:22.41	LoanData	\N
78	886	148	4	4	Approved	{"caseDetails": {"contactNo": "88895", "personMet": "Tvvb", "coApplicant": "Cvv", "dateOfVisit": "", "addressVisited": "Bcvg", "meetingDetails": "Vvvb", "typeOfBorrower": "Cgg", "nameOfApplicant": "Ccvvv", "referenceNumber": "Ett234"}}	\N	2025-10-07 07:31:27.815	2025-10-07 07:31:39.8	LoanData	\N
81	889	151	43	43	Rejected	{"commonPoints": {"concerns": "Hdhz", "employees": "Zhdh", "netMargin": "Hddh", "netProfit": "Hdhs", "otherIncomes": "Xhzh", "majorExpenses": "Zysy", "monthlyExpenses": "Dhdh", "otherObservation": "Hdhxhd", "numberOfEmployees": "Dhdh", "monthlyGrossReceipts": "Ydhd", "neighborCheckThirdParty": "Hdhdh", "monthlyHouseholdExpenses": "Zhzhasc"}, "businessDetails": {"income": "Tggbh", "itrFiled": "No", "gstNumber": "Ghhhh", "salesVolume": "Fdhbk", "stockSource": "Yyy", "businessName": "Gg", "wageExpenses": "556", "profitPerUnit": "566", "stockHandling": "Tyh", "typeOfBusiness": "Private Limited", "gstRegistration": "Yes", "numberOfWorkers": "456", "aboutTheBusiness": "Udj", "natureOfBusiness": "Ty", "regularCustomers": [{"nameOfRegularCustomers": "Yh", "contactNumberOfRegularCustomers": "Tyy"}, {"nameOfRegularCustomers": "Yvb", "contactNumberOfRegularCustomers": "6678"}], "regularSuppliers": [{"nameOfRegularSuppliers": "Bhh", "contactNumberOfRegularSuppliers": "Ghh"}, {"nameOfRegularSuppliers": "Th", "contactNumberOfRegularSuppliers": "Ggg"}], "documentsObserved": "Ghh", "stockLevelObserved": "Ggg", "yearBusinessStarted": "656", "majorTransactionMode": "667", "businessActivityObserved": "Ghh", "businessPremisesOwnership": "Tyh"}, "applicantDetails": {"pdDate": "Shshdh", "product": "LAP", "pdAddress": "Office", "personMet": "Dhhdxh", "loanAmount": "2727", "customerName": "Gdhs", "applicationId": "Hdhssds", "applicationNo": "Gsh", "contactNumber": "Hdhdhdh", "relationshipWithBorrower": "Guarantor"}, "familyBackground": {"familyMembers": [{"age": "45", "name": "Name1", "dependent": "Yes", "occupation": "Off", "qualification": "Qua", "incomePerMonth": "2500", "relationToApplicant": "Atta"}, {"age": "Gshs", "name": "Hsh", "dependent": "Ysh", "occupation": "Yeh", "qualification": "Ysh", "incomePerMonth": "Hdhs", "relationToApplicant": "Gshw"}, {"age": 5, "name": "asc", "occupation": "wef", "qualification": "wef", "incomePerMonth": 8, "relationToApplicant": "sc"}], "noOfEarningMembers": "25", "totalFamilyMembers": "25"}, "businessPlaceVintage": {"nameOfFirm": "Name of firm", "constitution": "Company", "isResiCumOffice": "Yes", "previousEmployment": "Udhdh", "whoStartedBusiness": "acquired", "yearsInCurrentCity": "25", "yearsInCurrentOffice": "25", "yearsInCurrentBusiness": "25", "ownershipOfBusinessPlace": "owned"}, "otherDetailsObserved": {"stockSeen": "Yes", "noOfMachinesSeen": "55", "noOfEmployeesSeen": 251, "businessActivitySeen": "Yes", "top3ClientsCustomers": [{"name": "Th", "location": "Ggh", "contactDetails": "Ggh"}, {"name": "Tg", "location": "Hdhd", "contactDetails": "Gsh"}], "top3ClientsSuppliers": [{"name": "Hdbx", "location": "Hdh", "contactDetails": "Hdh"}, {"name": "das", "location": "SDC", "contactDetails": "a"}, {"name": "ad", "location": "dw", "contactDetails": "wwd"}], "businessNameBoardSeen": "Yes", "neighborCheckThirdParty": "Hhd", "otherObservationsRemarks": "Hdhd", "otherBusinessIncomeSource": "Yh"}, "businessFinancialProfile": {"natureOfBusiness": "Services", "productServicesOffered": "Jdjdj", "businessModelBackground": "Dj"}}	\N	2025-10-07 09:31:51.569	2025-10-07 09:32:10.334	LoanData	\N
83	889	151	43	43	Rejected	{"businessDetails": {"income": "Tggbh", "itrFiled": "Yes", "gstNumber": "Ghhhh", "salesVolume": "Fdhbk", "stockSource": "Yyy", "businessName": "Ggddd", "wageExpenses": "556", "profitPerUnit": "566", "stockHandling": "Tyh", "typeOfBusiness": "Private Limited", "gstRegistration": "Yes", "numberOfWorkers": "456", "aboutTheBusiness": "Udj", "natureOfBusiness": "Ty", "regularCustomers": [{"nameOfRegularCustomers": "Yh", "contactNumberOfRegularCustomers": "Tyy"}, {"nameOfRegularCustomers": "Yvb", "contactNumberOfRegularCustomers": "6678"}], "regularSuppliers": [{"nameOfRegularSuppliers": "Bhh", "contactNumberOfRegularSuppliers": "Ghh"}, {"nameOfRegularSuppliers": "Th", "contactNumberOfRegularSuppliers": "Ggg"}], "documentsObserved": "Ghh", "stockLevelObserved": "Ggg", "yearBusinessStarted": 65, "majorTransactionMode": "667", "businessActivityObserved": "Ghh", "businessPremisesOwnership": "Tyh"}, "applicantDetails": {"pdDate": "Shshdh", "product": "LAP", "pdAddress": "Office", "personMet": "Dhhdxh", "loanAmount": "2727", "customerName": "Gdhs", "applicationId": "Hdhsasdsa", "applicationNo": "Gsh", "contactNumber": "Hdhdhdh", "relationshipWithBorrower": "Guarantor"}, "familyBackground": {"familyMembers": [{"age": "45", "name": "Name1", "dependent": "Yes", "occupation": "Off", "qualification": "Qua", "incomePerMonth": "2500", "relationToApplicant": "Atta"}, {"age": "Gshs", "name": "Hsh", "dependent": "Ysh", "occupation": "Yeh", "qualification": "Ysh", "incomePerMonth": "Hdhs", "relationToApplicant": "Gshw"}, {"name": "asc", "dependent": "qwdqwd", "occupation": "qwd", "qualification": "wqd", "relationToApplicant": "wqd"}], "noOfEarningMembers": "25", "totalFamilyMembers": 2}, "businessPlaceVintage": {"nameOfFirm": "Name of firm", "constitution": "Company", "isResiCumOffice": "Yes", "previousEmployment": "Udhdh", "whoStartedBusiness": "acquired", "yearsInCurrentCity": "25", "yearsInCurrentOffice": "25", "yearsInCurrentBusiness": "25", "ownershipOfBusinessPlace": "owned"}}	\N	2025-10-07 09:39:32.489	2025-10-07 09:40:19.861	LoanData	\N
84	889	151	43	43	Approved	{"businessDetails": {"income": "Tggbh", "itrFiled": "Yes", "gstNumber": "Ghhhh", "salesVolume": "Fdhbk", "stockSource": "YyyADXAD", "businessName": "Gg", "wageExpenses": "556", "profitPerUnit": "566", "stockHandling": "Tyh", "typeOfBusiness": "Private Limited", "gstRegistration": "No", "numberOfWorkers": "456", "aboutTheBusiness": "Udj", "natureOfBusiness": "Ty", "regularCustomers": [{"nameOfRegularCustomers": "Yh", "contactNumberOfRegularCustomers": "Tyy"}, {"nameOfRegularCustomers": "Yvb", "contactNumberOfRegularCustomers": "6678"}], "regularSuppliers": [{"nameOfRegularSuppliers": "Bhh", "contactNumberOfRegularSuppliers": "Ghh"}, {"nameOfRegularSuppliers": "Th", "contactNumberOfRegularSuppliers": "Ggg"}], "documentsObserved": "Ghh", "stockLevelObserved": "Ggg", "yearBusinessStarted": "656", "majorTransactionMode": "667", "businessActivityObserved": "Ghh", "businessPremisesOwnership": "Tyh"}, "applicantDetails": {"pdDate": "Shshdh", "product": "LAP", "pdAddress": "Office", "personMet": "Dhhdxh", "loanAmount": "2727", "customerName": "Gdhs", "applicationId": "HdhsadaD", "applicationNo": "Gsh", "contactNumber": "Hdhdhdh", "relationshipWithBorrower": "Guarantor"}, "familyBackground": {"familyMembers": [{"age": "45", "name": "Name1", "dependent": "Yes", "occupation": "Off", "qualification": "Qua", "incomePerMonth": "2500", "relationToApplicant": "Atta"}, {"age": "Gshs", "name": "Hsh", "dependent": "Ysh", "occupation": "Yeh", "qualification": "Ysh", "incomePerMonth": "Hdhs", "relationToApplicant": "Gshw"}, {}], "noOfEarningMembers": "25", "totalFamilyMembers": 28}}	\N	2025-10-07 09:42:31.555	2025-10-07 09:45:26.99	LoanData	\N
85	892	154	43	43	Approved	{"bankDetails": {"avgBal": "Dydyax", "primaryBanker": "F", "natureOfAccount": "Hdhd"}, "basicDetails": {"nameOfEntity": "Dhhdzsv", "nameOfApplicant": "Gd", "nameOfCoApplicants": "Td"}, "otherDetails": {"assets": "Dydyd", "liabilities": [{"emi": "Sydy", "bank": "Dhx", "amount": "Sydy", "tenure": "Ydg", "natureOfLoan": "Sydy", "outstandingBalance": "Ydy"}], "anyCourtCases": "Yes", "businessIndustry": "YdydAX", "politicalConnection": "no", "endUseOfProposedLoan": "Ydydy", "otherBusinessIncomeDetails": "Dhx"}, "familyDetails": {"familyDetails": [{"age": "Dydy", "name": "Dhd", "relation": "Dydy", "profession": "Dydy", "monthlyIncome": "Eye y", "qualification": "Dydy"}]}, "officeAddress": {"add": "Dydysy", "ownedBy": "Ydyd", "areaSqFt": "Dydy", "rentedOwned": "Owned", "cmvRentPerMonth": "5353", "occupiedSinceYears": "353"}, "businessDetails": {"stockAsOnDate": "Dydyscc", "currentBusinessDetails": "Yd"}, "customerDetails": {"customers": [{"debtorDays": "Hdh", "nameOfCustomer": "Ydhd", "percentageOfTotalSales": "Shdy", "relationshipSinceYears": "Ydhd"}, {"debtorDays": "A", "nameOfCustomer": "AX", "percentageOfTotalSales": "AX"}], "totalCustomersNo": "5353", "totalDebtorsAsOnDate": "6565"}, "employeesDetails": {"salaryRange": "Dhdhax", "keyEmployeeName": "Dhdy", "currentEmployees": "Ydh"}, "residentialAddress": {"add": "Ehddh", "ownedBy": "Td y", "areaSqFt": "Hdhd", "rentedOwned": "Rented", "cmvRentPerMonth": 5336, "occupiedSinceYears": "655", "addressOfPDAndPersonMet": "Dyd"}, "документы": {"panCard": "Ydhd", "otherDocumentSeen": "Dhdyac"}, "proposedLoanDetails": {"amount": "Yef", "tenure": "Dhdh", "product": "Or", "bankName": "Hdy", "accountNo": "Dhdy", "repaymentFrom": "DhdhC", "typeSAAccount": "Hdyd"}, "salesAndProfitDetails": {"profitMargin": "Dydy", "netMonthlyIncome": "Dydy", "turnoverFY202425": "Dhd", "cashSalesPercentage": "5353", "expTurnoverFY202526": "YdyaX", "monthlyTurnoverSales": "Dydy", "covidEffectOnTurnover": "Dydy", "postLockdownBusinessSpeed": "Ydyd"}, "siteVisitObservations": {"landmark": "Ydydddy", "neighborhood": "Yfyd", "stockSeenDuringPD": "Yes", "officeWellFurnished": "Yes", "businessActivitySeen": "no", "anyDecreaseInNetWorth": "Yes", "thirdPartyConfirmation": "Tttt", "noOfCustomersSeenDuringPD": "222", "noOfEmployeesSeenDuringPD": "333", "difficultyInLocatingPremises": "Yes", "abnormalIncreaseDecreaseInTurnover": "Yes"}, "valueAddedInformation": {"strengths": "Dydy", "weaknesses": "Dydy", "customerBehavior": "Good", "digitalWalletUsed": "Ydyd", "utilityBillDetails": "Ddydy", "customerShopLocality": "Main Road", "nearbyTransportStand": "Hdydydy", "lossSufferedInBusiness": "Gd d", "neighborhoodShopsNature": "Tere ydAX", "salariesPaidDuringCovid": "Partial", "salaryDeductionPercentage": "25"}}	\N	2025-10-07 10:18:00.758	2025-10-07 10:18:43.776	LoanData	\N
86	905	162	4	4	Approved	{"tradeReferences": {"customers": [{"contactDetails": "99800876555", "nameOfCustomer": "Narshimha "}], "suppliers": [{"contactDetails": "00110099777777888", "nameOfSuppliers": "Eshwaramma "}, {"contactDetails": "eret5rf", "nameOfSuppliers": "amma"}]}}	\N	2025-10-08 09:41:41.404	2025-10-08 09:42:00.846	LoanData	\N
87	907	163	43	43	Approved	{"caseDetails": {"contactNo": "6787654567", "personMet": "test12", "coApplicant": "Gg", "addressVisited": "bnmn", "typeOfBorrower": "Partnership Firm", "nameOfApplicant": "test12", "referenceNumber": "test12"}, "loansDetails": {"loansDetails": [{"emi": "6", "pos": "H", "product": "G", "remarks": "G", "loanAmount": "6", "nameOfBankInstitution": "Y"}, {"emi": "3", "pos": "G", "product": "G", "remarks": "G", "loanAmount": "6", "nameOfBankInstitution": "Y"}, {"emi": 3, "pos": "s", "product": "C", "remarks": "se", "loanAmount": 32, "nameOfBankInstitution": "C"}]}, "familyDetails": {"aboutApplicant": "Gg", "aboutCoApplicant": "Gg", "andTheirFamilyDetails": "Yy"}, "outputsSupply": {"creditTerms": "H", "marketForOutput": "nnG", "modeOfMarketing": "J", "typeOfCustomers": "H", "stockOfFinishedGoods": "H"}, "businessDetails": {"margins": "Yy", "gstNumber": "Gh", "legalName": "Ghhh", "tradeName": "Gh", "shopAddress": "bnmn", "businessName": "bvnmnm", "typeOfEntity": "Gh", "establishment": "Yh", "godownAddress": "Gh", "lastGSTReturn": "Hh", "shopOwnership": "Owned", "productDetails": "Gg", "businessProcess": "Gg", "godownOwnership": "Rented", "activityObserved": "Gh", "natureOfBusiness": "Gh", "documentsObserved": "Hh"}, "employeeDetails": {"pfEsiApplied": "Yes", "noOfEmployees": "6", "salaryDetails": "Hb"}, "inputsPurchases": {"orderCycle": "Y", "creditTerms": "H", "avgOrderQnty": "G", "otherRemarks": "Hh", "detailsOfInputs": "Y", "purchaseDetails": "Gg"}, "ownContributions": {"ownContributions": [{"remarks": "Hu", "particulars": "Yh"}, {"remarks": "Gh", "particulars": "Yh"}, {"remarks": "b", "particulars": "nmnm"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "66", "name": "Gh", "remarks": "G", "relation": "Ty", "occupation": "Gg", "qualification": "Under graduate"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Gh", "sourceOfIncome": "Gg"}]}, "tradeReferencesSuppliers": {"suppliers": [{"contactDetails": "G", "nameOfSuppliers": "G"}, {"contactDetails": "Y", "nameOfSuppliers": "Y"}, {"contactDetails": "sc", "nameOfSuppliers": "sac"}]}, "applicantsMainBankingDetails": {"endUse": "Ghnn", "bankingDetails": [{"remarks": "Y", "bankName": "Y", "noOfYear": "3", "accountType": "Cash Credit", "limitOfCCOD": "G", "accountHolderName": "G"}]}}	\N	2025-10-08 10:53:21.056	2025-10-08 10:53:50.049	LoanData	\N
88	909	166	4	4	Approved	{"particulars": {"coordinates": "17.4478524,78.386272111"}}	\N	2025-10-08 14:39:12.97	2025-10-08 14:39:26.787	LoanData	\N
89	909	166	4	4	Rejected	{"caseDetails": {"contactNo": "9912990098", "personMet": "kalpana reddy", "coApplicant": "Mohan ", "addressVisited": "kondapur", "typeOfBorrower": "Proprietorship", "nameOfApplicant": "  ", "referenceNumber": "kalpana1100"}}	\N	2025-10-08 14:51:18.383	2025-10-08 14:51:35.603	LoanData	\N
90	909	166	4	4	Approved	{"familyDetails": {"aboutApplicant": "kalpanabelureAge 30She is graduate Location Hyderabad  Telangana  NUMBERS: NAMES AND RELATION  AND MOBILE NO SIRTOTAL JOB EXPIRENCE:3year DATE OF JOINING :2022 nov 21yDESIGNATION : Associate QA Engineer TWO REFERENECE NUMBERS:  NO SIR: 9949006271", "aboutCoApplicant": "NUMBERS: NAMES AND RELATION  AND MOBILE NO SIR\\nTOTAL JOB EXPIRENCE:3year \\nDATE OF JOINING :2022 nov 21y\\nDESIGNATION : Associate QA Engineer \\nTWO REFERENECE\\n NUMBERS:  NO SIR: 9949006271", "andTheirFamilyDetails": "Son name happy age 7"}}	\N	2025-10-08 15:12:41.787	2025-10-08 15:12:55.548	LoanData	\N
92	907	163	43	43	Rejected	{"caseDetails": {"contactNo": "6787654567", "coApplicant": "Gg", "addressVisited": "bnmn", "typeOfBorrower": "Partnership Firm", "nameOfApplicant": "test12", "referenceNumber": "test12"}}	\N	2025-10-09 06:46:15.455	2025-10-09 06:48:36.242	LoanData	\N
93	903	161	4	4	Approved	{"otherDetails": {"assets": "Car bike gold 🪙", "liabilities": [{"emi": "5", "bank": "India ", "amount": "299999", "tenure": "5", "natureOfLoan": "Individual ", "outstandingBalance": "400000"}, {"emi": 5, "bank": "axices", "amount": 57654, "tenure": "5", "natureOfLoan": "gtrfcv", "outstandingBalance": 5555555}], "anyCourtCases": "Yes", "businessIndustry": "Ygags", "politicalConnection": "Yes", "endUseOfProposedLoan": "Good ", "otherBusinessIncomeDetails": "Business development "}, "customerDetails": {"customers": [{"debtorDays": "6666", "nameOfCustomer": "Narshimha ", "percentageOfTotalSales": "5trgf666666666666666", "relationshipSinceYears": 6666}], "totalCustomersNo": "23588", "totalDebtorsAsOnDate": "200"}, "supplierDetails": {"suppliers": [{"creditorDays": "5", "nameOfSupplier": "Dhana ", "relationshipSinceYears": "2019", "percentageOfTotalPurchases": "50"}, {"creditorDays": "5", "nameOfSupplier": "happi", "relationshipSinceYears": 8, "percentageOfTotalPurchases": "60"}], "totalSuppliersNo": "26398", "totalCreditorsAsOnDate": "25000"}}	\N	2025-10-09 08:10:50.064	2025-10-09 08:11:21.523	LoanData	\N
\.


--
-- Data for Name: Loan; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Loan" (id, "applicationNumber", "applicantName", "applicantMobile", "applicantAddress", "applicantAddress1", "applicantAddress2", "isAddressSame", "loanType", "bankName", "loanAmount", status, "officeId", "operationsExecutiveId", "createdAt", "updatedAt", "applicantType", department, "reassignCount", "templateName") FROM stdin;
100	mohan110077	mohan reddy	9949007272	\N	\N	\N	f	Personal Loan	TATA CAPITAL LIMITED	2000	FVCompleted	1	\N	2025-09-09 04:44:18.046	2025-09-09 05:10:19.266	Primary Applicant	PD	0	\N
224	LA-556618	VARIKUPPALA RAJESHWARI	8125968851	Nizamabad	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-15 12:58:53.995	2025-09-15 12:58:53.995	Primary Applicant	PD	0	\N
228	708802	Mr. Ramineni Tirupataiah	9346292339	Door No:6-60-26/1/A Sramikanagar Gajuwaka beside IDBI Bank  FEDESTAL CYCLE MART  4 Shops Ground Floor, Visakhapatnam-530026.	\N	\N	f	Business		10000000	Unassigned	19	\N	2025-09-16 05:48:25.188	2025-09-16 05:48:25.188	Primary Applicant	PD	0	\N
297	test5567876543456789	BANDI SWETHA	9948676919	17-1-382/V/1/1/AVyshali Nagar Main road ,ChampapetSaidabad, Ranga Reddy Dist.Hyderabad: 500079	\N	\N	f	Business	ADITYA BIRLA HOUSING FINANCE LIMITED	0	Unassigned	19	\N	2025-09-17 07:24:27.773	2025-09-17 07:24:27.773	Primary Applicant	PD	0	\N
357	LA-557214	NADIGETLA TRINADHA RAO	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-18 11:30:12.595	2025-09-18 11:30:12.595	Primary Applicant	PD	0	\N
106	10000054242	DONEPALLI TULASI	7780737941	SRI PARVATI PARAMESWARA OIL AGENCY, 3-148, MAIN  ROAD, KORUKONDA,Rajahmundry	\N	\N	f	Business	RBL BANK LIMITED	\N	Unassigned	19	\N	2025-09-10 06:33:10.899	2025-09-10 06:33:10.899	Primary Applicant	PD	0	\N
446	LA-555979	GAJULAPALLI LAKSHMI DEVI	9494525451	Nandyala Branch	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 11:11:02.667	2025-09-19 11:11:02.667	Primary Applicant	PD	0	\N
675	SCUBL00D5D43	SHAIK RESHMA	9246579517	FLAT NO 203 , ROAD NO 1, DHANVI RESIDENCY , NEAR RAJADANI SCHOOL, NIZAMPET, NEAR RAJADANI SCHOOL, HYDERABAD, HYDERABAD, TELANGANA, INDIA, 500071	\N	\N	f	Business	YES BANK LTD	70000	Unassigned	19	\N	2025-09-23 10:21:46.476	2025-09-23 10:21:46.476	Primary Applicant	PD	0	\N
134	462BZ8602672	KATAMREDDY VENKATA SATYANARAYAN	9346294609	12- 2- 8 SRIRAMAPETA PALAKOL OPP SBI BANK, West Godavari, Andhra Pradesh, 534265	\N	\N	f	Business	TATA CAPITAL LIMITED	45000	Unassigned	19	\N	2025-09-11 05:24:13.106	2025-09-11 10:32:46.769	Primary Applicant	PD	0	\N
146	2025301	ROUTHUSAIKUMAR	9963080712	DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526	\N	\N	f	Business	Not Found	2500000	Unassigned	19	\N	2025-09-11 06:32:02.007	2025-09-11 10:28:44.613	Primary Applicant	PD	0	\N
95	qerethy	mohan reddy	9949007272	\N	\N	\N	f	Personal Loan	TATA CAPITAL LIMITED	2000	Assigned	1	\N	2025-09-03 06:53:22.287	2025-09-11 10:29:16.976	Primary Applicant	FI	0	\N
784	LA-558532/TPV-00136934	NEERATI PARUSHARAMULU	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-27 13:01:00.201	2025-09-27 13:01:00.201	Primary Applicant	PD	0	\N
371	LA-557293	GANGISHETTI MAHESH	9494525451	KARIMNAGAR	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 04:01:00.786	2025-09-19 04:01:00.786	Primary Applicant	PD	0	\N
74	testing111	mohan reddy	9949007272	\N	\N	\N	f	Personal Loan	TATA CAPITAL LIMITED	2000	Assigned	8	\N	2025-09-01 05:01:35.323	2025-09-01 05:02:25.674	Primary Applicant	FI	0	\N
776	rewqq	sdgsg	5476453546	\N	\N	\N	f	Busienss Loan	Axis Bank	34657524	Assigned	1	\N	2025-09-26 11:17:48.761	2025-09-26 11:34:42.778	Primary Applicant	PD	0	\N
116	NHL/VSKP/0124/1205246	TVR MURTHY&TVNS CHAKRAVARTHY	9440190013	29/6/22, SRI VENKATESWARA BOOK DEPOTVIZAG, LALITHA COLONY, HOTEL AMARAVATHI LANE, DABAGARDENS, Visakhapatnam, Andhra Pradesh-530020, Visakhapatnam, India	\N	\N	f	Business	Not Found	\N	Unassigned	19	\N	2025-09-10 08:54:14.958	2025-09-10 08:54:14.958	Primary Applicant	PD	0	\N
184	137810000000233		9490008968	26-22-21, Mudunurivari Street, Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-12 10:15:11.152	2025-09-12 10:15:11.152	Primary Applicant	PD	0	\N
595	LA-557173/TPV-00134119	MOHAMMAD HABEEB NAWAS	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-22 11:00:11.547	2025-09-22 11:00:11.547	Primary Applicant	PD	0	\N
580	8736528	M/s SRI LAKSHMI VENKATESWARA TRANSPORT	9676450606		\N	\N	f	Business	INDUSIND BANK LIMITED	0	FVCompleted	19	\N	2025-09-22 08:49:52.76	2025-09-22 10:01:09.149	Primary Applicant	PD	0	\N
190		ROUTHU SAI KUMAR	9963080712	DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526	\N	\N	f	Business		2500000	Unassigned	19	\N	2025-09-15 05:08:03.027	2025-09-15 05:08:03.027	Primary Applicant	PD	0	\N
109	VGA25VK049710	KINTHALI KUSUMA KUMARIw	9348200000	D No:1-91-3/1/2,Mig-72,GF Sector -5,MVP Colony,Visakhapatnam,Andhrapradesh 530017D:1-102-14,17Th Day School,Beside Laddu Gopal,Sector 5,MVP Colony,Visakhapatnam,Andhrapradesh 530017	\N	\N	f	Business	TATA CAPITAL LIMITED	0	FVCompleted	19	\N	2025-09-10 06:37:02.557	2025-09-22 10:05:35.157	Primary Applicant	PD	0	\N
196	Raj kumar123456	Raj kumar	9912994741	DO NO : 3 11, RAMALAYAMVEEDHI , GAVARAMPETA, VIZIANAGARAMDISTRICT, , Gavarampeta , Vizianagaram ,Andhra Pradesh , 535526	\N	\N	f	Business		25000	Unassigned	19	\N	2025-09-15 05:39:01.027	2025-09-15 05:39:01.027	Primary Applicant	PD	0	\N
82	raj200	raj kumar200	9949007272	\N	\N	\N	f	Busienss Loan	TATA CAPITAL HOUSING FINANCE LIMITED	20000	Assigned	1	\N	2025-09-02 05:20:19.215	2025-09-02 05:21:54.395	Primary Applicant	FI	0	\N
879	test8	test8	4567987867	\N	\N	\N	f	Busienss Loan	Rbl	34554	FVCompleted	1	\N	2025-10-06 09:50:46.789	2025-10-06 09:57:37.343	Primary Applicant	PD	0	\N
200	Raj kumar123456	Raj kumar	9912994741	DO NO : 3 11, RAMALAYAMVEEDHI , GAVARAMPETA, VIZIANAGARAMDISTRICT, , Gavarampeta , Vizianagaram ,Andhra Pradesh , 535526	\N	\N	f	Business		25000	Unassigned	19	\N	2025-09-15 05:51:11.398	2025-09-15 05:51:11.398	Primary Applicant	PD	1	\N
216	043	SHAIK CHAN BASHA	9989879008	DOOR NO SHOP NO 2 , KG ROAD , NANDIKOTKUR , KURNOOL , Andhra Pradesh , 518401	\N	\N	f	Business	Tata Ubl	1000000	Assigned	19	\N	2025-09-15 10:48:26.802	2025-10-09 08:12:44.426	Primary Applicant	PD	0	\N
10	mohan1100	mohan reddy	9912994741	\N	\N	\N	f	Personal Loan	TATA CAPITAL LIMITED	2000	Assigned	1	\N	2025-08-21 06:09:05.293	2025-08-21 07:03:43.696	Primary Applicant	FI	0	\N
624	1347455	Dipo Mohammed Rasuilla	7989737770	D No 15/185,Gugudu Road,Narapala-515425	\N	\N	f	Business	TATA CAPITAL LIMITED	15000000	Unassigned	19	\N	2025-09-23 06:31:03.798	2025-09-23 06:31:03.798	Primary Applicant	PD	0	\N
143	Not Found	Mr. ROUTHU SAI KUMAR	9963080712	DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526	\N	\N	f	Business	Not Found	\N	Unassigned	19	\N	2025-09-11 06:12:48.98	2025-09-11 06:12:48.98	Primary Applicant	PD	0	\N
144	2025300	ROUTHU SAI KUMAR	9963080712	DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526	\N	\N	f	Business	Not Found	2500000	Unassigned	19	\N	2025-09-11 06:28:45.512	2025-09-11 06:28:45.512	Primary Applicant	PD	0	\N
52	ABHF00001	Prem	9999999999	\N	\N	\N	f	Top-up Loan	ADITYA BIRLA HOUSING FINANCE LIMITED	\N	Assigned	1	\N	2025-08-26 06:56:37.863	2025-08-26 07:01:08.695	Primary Applicant	FI	0	\N
65	mohan001	mohan reddy	9912994741	\N	\N	\N	f	Personal Loan	TATA CAPITAL LIMITED	2000	Assigned	1	\N	2025-08-29 06:34:44.772	2025-08-29 06:37:09.09	Primary Applicant	FI	0	\N
361	LA-557219	KASTHURI SURYA CHANDRA RAO	9494525451		\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-18 11:34:33.941	2025-09-18 11:34:33.941	Primary Applicant	PD	0	\N
439	HL2410111345303	Babireddy Sudhaker Reddy	7032517120	2/2/C, Shop No.6, Jayalaxmi Nagar, Bheeramguda, Circle -22, Beside Vinayak Temple, Hyderabad-  502032	\N	\N	f	Business	ADITYA BIRLA HOUSING FINANCE LIMITED	354567	Unassigned	19	\N	2025-09-19 10:51:47.613	2025-09-19 10:51:47.613	Primary Applicant	PD	0	\N
227	LA-556026	MUDHAM VAMSI KUMAR	9121887140	Hyderabad	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-15 13:10:38.69	2025-09-15 13:10:38.69	Primary Applicant	PD	0	\N
231	711478	Mr. Gadey Lakshmi Kota Sathyanand Diwakar	9885461211	DOOR NO.52-1-2 BESIDE CMR CENTRAL RESAPUVANIPALEM,MADDILAPALEM,VISAKHAPATNAM-530013	\N	\N	f	Business	TATA CAPITAL LIMITED	15000000	Unassigned	19	\N	2025-09-16 05:59:33.501	2025-09-16 05:59:33.501	Primary Applicant	PD	0	\N
183	dfg	szdv sfe wefwef	9963080721	\N	\N	\N	f	Personal Loan	TATA CAPITAL LIMITED	24245	Assigned	1	\N	2025-09-11 10:29:44.688	2025-09-12 04:40:55.724	Primary Applicant	FI	0	\N
363	LA-557203	SHAIK HANEEF	8125968851	Nizamabad branch	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-18 11:37:38.443	2025-09-18 11:37:38.443	Primary Applicant	PD	0	\N
448	LA-557526	MOTEVAR RAMESH	8125968851	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 11:16:39.26	2025-09-19 11:16:39.26	Primary Applicant	PD	0	\N
303	3000088650	Mr .NALLAKUKKALA GIRIBABU	9703994365		\N	\N	f	Business		0	Unassigned	19	\N	2025-09-17 08:51:35.51	2025-09-17 08:51:35.51	Primary Applicant	PD	0	\N
449	LA-557266	PAIDYPAMULA CHIRANJIVI	9000462373	Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-19 11:21:23.468	2025-09-19 11:21:23.468	Primary Applicant	PD	0	\N
313	DB20250623665519	RUCHI CURRIES	9246213050	RUCHI CURRIES -PLOT NO 127 ,BHAGYANAGAR CO-OP SOCIETY,KPHB COLONY KUKATPALLY SHOP NO 6 HYDERABAD,TS-500072	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-17 10:01:11.993	2025-09-17 10:01:11.993	Primary Applicant	PD	0	\N
317	MMA00061717	Mr. ELURU DURGA SAI Kumar	6281873741	D NO.16/410-B,VALANDAPALEM,MACHILIPATNAM,AP -521002.	\N	\N	f	Business	IDFC FIRST FINANCIAL SERVICES LIMITED	0	Unassigned	19	\N	2025-09-17 10:20:05.457	2025-09-17 10:20:05.457	Primary Applicant	PD	0	\N
243	721098	Siva Kumar Jami	9701564555	Door No: 2-30-19 Sector-7, MVP Colony, Ward-07 Village, Visakhapatnam(Mandal), AP-530017	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-16 06:45:18.027	2025-09-16 06:45:18.027	Primary Applicant	PD	0	\N
677	BLSA00074BC2	Voggu Mahesh	9948603694	H NO 3-94, BrahmanapallE , H NO 3-94, BrahmanapallE , BRAHMANAPALLE,NALGONDA, BrahmanapallE , BrahmanapallE , YADADRI BHUVANAGIRI, Nalgonda, TELANGANA, INDIA, 508126	\N	\N	f	Business	STATE BANK OF INDIA –IT VERIFICATION AGENCY	0	Unassigned	19	\N	2025-09-23 10:30:54.463	2025-09-23 10:30:54.463	Primary Applicant	PD	0	\N
375	LA-556942	CHINTHA RAJITHA	9494525451	WARANGAL	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 04:03:10.069	2025-09-19 04:03:10.069	Primary Applicant	PD	0	\N
584	78925604	Sri Lakshmi General Stores	9290391919	Sri Lakshmi General Stors -11/25/135/136, MAIN BAZAR, ONTOWN/ VIJAYAWADA,  520001URGA GIFTS & TOYS-FIRST FLOOR, 11-25-135/136, MAIN BAZAR, VIJAYAWADA	\N	\N	f	Business	CENTRUM HOUSING FINANCE LTD	4000000	FVCompleted	19	\N	2025-09-22 08:53:16.611	2025-09-22 09:03:12.899	Primary Applicant	PD	0	\N
198	11oo11	Mokshit kumar	9912994741	DO NO : 3 11, RAMALAYAMVEEDHI , GAVARAMPETA, VIZIANAGARAMDISTRICT, , Gavarampeta , Vizianagaram ,Andhra Pradesh , 535526	\N	\N	f	Business	TATA CAPITAL LIMITED	25000	FVCompleted	19	\N	2025-09-15 05:44:22.016	2025-09-15 06:10:42.377	Primary Applicant	PD	0	\N
202	LA-556157	SANUGULA GOPALACHARY	9490008968	502,AB Heights, Premnagar colonyRoad no.1, Banjara Hills,Hyderabad.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-15 06:18:09.857	2025-09-15 06:18:09.857	Primary Applicant	PD	0	\N
608	LA-557944	Mr. GODUGU SEENAIAH		Nellore Branch	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-22 16:04:18.412	2025-09-22 16:04:18.412	Primary Applicant	PD	0	\N
385	1000117632	THOTA BRAHMASWAMULU	9963669653	D NO- 35-70, GOVINDU VARI STREET PURUSHOTTAMA PATNAM CHILAKALURIPETA GUNTUR-522616	\N	\N	f	Business	PIRAMAL HOUSING FINANCE LTD	200000	Unassigned	19	\N	2025-09-19 06:29:18.13	2025-09-19 06:29:18.13	Primary Applicant	PD	0	\N
323	BLA00045382	RAVI CHITTIBOYINA	7997208618	ass no 338, main road, Balram puram, Vizianagaram, Andhra Pradesh, 535214	\N	\N	f	Business	AXIS FINANCE LTD	2000000	Unassigned	19	\N	2025-09-17 10:34:18.809	2025-09-17 10:35:16.758	Primary Applicant	PD	0	\N
329	LA-555438	DUMBARI PRABHAKAR RAO	9494525451	VISAKHAPATNAM	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-17 12:00:50.123	2025-09-17 12:00:50.123	Primary Applicant	PD	0	\N
777	akraaaaaa	akraaaa	3564345647	\N	\N	\N	f	Busienss Loan	Arka Fincap	\N	FVCompleted	1	\N	2025-09-26 11:53:46.538	2025-09-26 11:53:46.538	Primary Applicant	PD	1	\N
684	LACR09232512356	KOWTHA VENKATASUBBA RAO			\N	\N	f	Business		0	FVCompleted	19	\N	2025-09-23 11:09:59.542	2025-09-24 06:42:56.833	Primary Applicant	PD	0	\N
692	LA-557881/TPV-00134720	MALIKEDI LAXMAN	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 07:31:46.244	2025-09-24 07:31:46.244	Primary Applicant	PD	0	\N
335	10000055110	RAPARTHI DURGAPRASAD	9494841724	SRI VENKATA KARTHIK CHICKEN CENTER, D No 3-56,YSR Market Main Road,D Polavaram Village,Tuni Mandal	\N	\N	f	Business	ADITYA BIRLA HOUSING FINANCE LIMITED	0	Unassigned	19	\N	2025-09-18 07:09:30.518	2025-09-18 07:09:30.518	Primary Applicant	PD	0	\N
257	81626528	M/s.  kalpana reddy		NEAR MAHANTHI FISH MARKET, SHOP NO 8, GOVINDARAJULU COMPLEX, BESANT ROAD, VIJAYAWADA-520002	\N	\N	f	Business		7000000	Unassigned	19	\N	2025-09-16 09:04:34.475	2025-09-16 09:04:34.475	Primary Applicant	PD	0	\N
393	6108167199	SANE SREENIVAS RAO	9951418972	GANGOTRI TURBO TECH ENGINEERING SERVICES PVT LTD23/a/1/2 phase-1 PATANCHERUVU SANGAREDDYCITY : HYDERABADSTATE: TELANGANAPINCODE: 502319	\N	\N	f	Business	INDOSTAR HOME FINANCE PRIVATE LIMITED	1000000	Unassigned	19	\N	2025-09-19 07:05:53.452	2025-09-19 07:05:53.452	Primary Applicant	PD	0	\N
341	MMA00062783	Mr. BODIGE PRABHAKAR GOUD	9494916969	2-100,WARD NO 4,PARVATHAPUR, GHATKESAR,MEDCHAL - 500098	\N	\N	f	Business	YES BANK LTD	0	Unassigned	19	\N	2025-09-18 09:45:18.891	2025-09-18 09:45:18.891	Primary Applicant	PD	0	\N
260	80528075	Mr. Mande Sudarshan	9000535293	Plot No.9,10, Chandanagar, Rangareddy, Telangana- 500050	\N	\N	f	Business		7200000	Unassigned	19	\N	2025-09-16 09:11:09.975	2025-09-16 09:11:09.975	Primary Applicant	PD	0	\N
399	27417978//27424501	AJAY SONI	8209131784	HARI KRISHNA GOLD AND JEWELLERS5-958/15 BABU KHAN ESTATES BASHEERBAGH HYDERABAD 500029	\N	\N	f	Business	NEOGROWTH CREDIT PRIVATE LIMITED	35000000	Unassigned	19	\N	2025-09-19 07:20:11.406	2025-09-19 07:20:11.406	Primary Applicant	PD	0	\N
630	DLNRY0HL-05250103813	ROYYALI BALRAJ	VENKATAMMAL	Door No:1-5-39&40,1st Floor,\nOpp.District Court ,Citizen Club Road.\nNarayanpet,Telangana-509210	\N	\N	f	Business	TATA CAPITAL LIMITED	15	Unassigned	19	\N	2025-09-23 06:55:01.034	2025-09-23 06:55:01.034	Primary Applicant	PD	0	\N
403	27482743	KUDUPUDI SATYA SRINU	8989898999	PLOT NO 9 FLAT NO 202 SRI SAI NAGAR COLONYMADEENAGUDA MIYAPURCITY: HYDERABADSTATE: TELANGANAPINCODE: 500049	\N	\N	f	Business	INDUSIND BANK LIMITED	300400	Unassigned	19	\N	2025-09-19 07:27:38.08	2025-09-19 07:27:38.08	Primary Applicant	PD	0	\N
652	APPL00077502	Mr.ASHOKKUMAR PATRA	8143742207	7-52/5/27, GIRIGADDA, NARSINGH, HYDERABAD - 500075	\N	\N	f	Business	AMBIT FINVEST PVT.LTD	500900	Unassigned	19	\N	2025-09-23 09:01:17.79	2025-09-23 09:01:17.79	Primary Applicant	PD	0	\N
305	APPL00056758	AHMED ABDUL RUB MATEEN	9848575821	23-1-592 BIBI NAGAR CHARMINAR HYDERABAD 500002	\N	\N	f	Business	INDIABULLS HOUSING FINANCE LTD	50000000	Unassigned	19	\N	2025-09-17 09:36:19.447	2025-09-17 09:36:19.447	Primary Applicant	PD	0	\N
440	LA-556854	MALOTHU RAJU	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-19 10:54:54.416	2025-09-19 10:54:54.416	Primary Applicant	PD	0	\N
345	AF00001	Conduit	9999999999	\N	\N	\N	f	Top-up Loan	AXIS FINANCE LTD	\N	FVCompleted	1	\N	2025-09-18 10:03:23.909	2025-09-22 08:46:56.749	Primary Applicant	PD	0	\N
679	HOU/NEL/0625/1406991	KOTA HARI PRASAD			\N	\N	f	Business		2200000	Unassigned	19	\N	2025-09-23 10:40:28.632	2025-09-23 10:40:28.632	Primary Applicant	PD	0	\N
377	LA-557356	MANDALA UMA	9502077619	H.No:-15-9-29,1 st floor,Opposite District Court ,Kaviraj Nagar, Khammam-TelanganaPin code-507002	\N	\N	f	Business	HERO HOUSING FINANCE LTD	0	Unassigned	19	\N	2025-09-19 04:11:27.045	2025-09-19 04:11:27.045	Primary Applicant	PD	0	\N
601	LA-557747/TPV-00134130	SUDHAGANI RAJITHA	9494525451	WARANGAL	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-22 11:55:52.197	2025-09-22 11:55:52.197	Primary Applicant	PD	0	\N
631	05250103813	ROYYALI BALRAJ	VENKATAMMAL	Door No:1-5-39&40,1st Floor,\nOpp.District Court ,Citizen Club Road.\nNarayanpet,Telangana-509210	\N	\N	f	Business	TATA CAPITAL LIMITED	15	Unassigned	19	\N	2025-09-23 06:55:01.41	2025-09-23 06:55:01.41	Primary Applicant	PD	0	\N
538	LA-557832	YALLANGARI SAI		Nellore Branch	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-22 05:13:19.556	2025-09-22 05:13:19.556	Primary Applicant	PD	0	\N
271	HL00052952	Bomburi Suresh	9966524333	Door No 4-317 Kolla Raithula Kalyana Mandapam,Anaparthi Anaparthi Mandalam,Rajahmundry, AP – 533342	\N	\N	f	Business		1500000	Unassigned	19	\N	2025-09-16 09:50:19.283	2025-09-16 09:50:19.283	Primary Applicant	PD	0	\N
272	4814125	MAVULURI SUBHASHINI	9866747116	Sy no. 88 A NH 44, Beside Jawa showroom, Sai nagar kompally, Beside jawa showroom, HYDERABAD, TELANGANA, 500100, INDIA	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-16 09:57:06.471	2025-09-16 09:57:06.471	Primary Applicant	PD	0	\N
880	test8	test8	4567987867	\N	\N	\N	f	Busienss Loan	Rbl	34554	FVCompleted	1	\N	2025-10-06 09:57:53.011	2025-10-06 09:57:53.011	Primary Applicant	PD	1	\N
387	27366183	MADDULURU VENKATA BHARADHWAJ	8919617539		\N	\N	f	Business	INCRED HOUSING FINANCE LTD	0	Unassigned	19	\N	2025-09-19 06:49:32.95	2025-09-19 06:49:32.95	Primary Applicant	PD	0	\N
325	BLA00047043	PRANATHI INFRATECH	9398760658	Near Bommak Balaiah Function Hall8-7-215/20, Tirumala Meadows Colony, heamanagar road num 11Boduppal,Ranagareddy, Telangana,500092	\N	\N	f	Business	IIFL HOUSING FINANCE LIMITED	10000	Unassigned	19	\N	2025-09-17 10:45:41.299	2025-09-17 10:46:49.242	Primary Applicant	PD	0	\N
391	6108271471	RAMESH BANDACO	9515540206	H NO 9-114/12 CHENNAREDDY THOTA PEERZADIGUDA KEESARA MEDCHAL MALKAJGIRI, HYDERABAD, 500098	\N	\N	f	Business	AMBIT FINVEST PVT.LTD	100000	Unassigned	19	\N	2025-09-19 06:58:20.464	2025-09-19 06:58:20.464	Primary Applicant	PD	0	\N
886	kalpana12344333	kalpanabelure	9949007272	\N	\N	\N	f	Personal Loan	Rbl	9981	FVCompleted	1	\N	2025-10-07 07:05:09.905	2025-10-07 07:17:18.311	Primary Applicant	PD	0	\N
279	4893515	BANDI SATHISH KUMAR	9989905455	SRM JUNIOR COLLEGE, ADDRESS: 5 11 548 NAIMNAGAR HANAMKONDA WARANGAL URBAN , LANDMARK: NEAR TO ROAD, CITY:WARANGAL, TELANGANA, PINCODE:506001	\N	\N	f	Business	AHAM HOUSING FINANCE LTD	0	Unassigned	19	\N	2025-09-16 10:15:10.565	2025-09-16 10:15:10.565	Primary Applicant	PD	0	\N
394	9091994151	VADITHY LAXMI	9951374793	H NO 17-1-391/S/J-4/26  E 1010 SINGARENI COLONY SAIDABAD HYDERABAD 500059	\N	\N	f	Business	BANK OF INDIA - DUE DILIGENCE	200000	Unassigned	19	\N	2025-09-19 07:11:01.19	2025-09-19 07:11:01.19	Primary Applicant	PD	0	\N
281	HL596086	ADLLA RAMADEVI	9908335796	Hyderabad Branch	\N	\N	f	Business		5000000	Unassigned	19	\N	2025-09-16 10:23:15.68	2025-09-16 10:23:15.68	Primary Applicant	PD	0	\N
282	LA-556909	MANYAM PALLI SHIVAIAH	9494525451	Kurnool	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-16 11:20:34.516	2025-09-16 11:20:34.516	Primary Applicant	PD	0	\N
337	11223344	MR GOLI SAIPUNDARIKAKSHUDU	9640834434	HOUSE NUMBER 4-63/1, GARUVU,.,,At PO: Bhuvanapalli,District: WEST GODAVARI,State: ANDHRA PRADESH,Pincode: 534198,India	\N	\N	f	Business	PUNJAB NATIONAL BANK HOUSING FINANCE LIMITED	6000000	Unassigned	19	\N	2025-09-18 07:28:15.068	2025-09-18 07:28:15.068	Primary Applicant	PD	0	\N
551	7790543	MEDISETTI UMASRI VEERA VIJAYA LAKSHMI		HYDERABAD KUKATPALLY BRANCH-6162	\N	\N	f	Business	AMBIT FINVEST PVT.LTD	6000000	Unassigned	19	\N	2025-09-22 06:25:03.586	2025-09-22 06:25:03.586	Primary Applicant	PD	0	\N
557	100012805	NALLAMILLI VENKATA RAMAKRISHNA REDDY	9542280222		\N	\N	f	Business	CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LTD	3500000	Unassigned	19	\N	2025-09-22 07:01:28.909	2025-09-22 07:01:28.909	Primary Applicant	PD	0	\N
802	LA-558730/TPV-00137928	TAMMALI RAVI	9494525451		\N	\N	f	Business		0	Unassigned	19	\N	2025-09-28 13:06:09.383	2025-09-28 13:06:09.383	Primary Applicant	PD	0	\N
288	LA-556681	JANNU SUNDER	9160802893	Hyderabad	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-16 11:26:43.765	2025-09-16 11:26:43.765	Primary Applicant	PD	0	\N
678	seg	afeg	3423534535	\N	\N	\N	f	Busienss Loan	Axis finance UBL	\N	FVCompleted	1	\N	2025-09-23 10:37:33.074	2025-09-23 12:01:05.107	Co-applicant 1	PD	0	\N
566	DSA4BL43232025	Mr. AGARWAL NARESH KUMAR	9000001735	PHASE I, 90M, IDA JEEDIMETLA, PHASE-I, IDA JEEDIMETLA, Ranga Reddy, Telangana, 500055	\N	\N	f	Business	AXIS BANK LTD	1000000	Unassigned	19	\N	2025-09-22 07:24:58.494	2025-09-22 07:24:58.494	Primary Applicant	PD	0	\N
401	27401903	Kaladi Chandra Shekhar	9390619191	3 72 SARDAR NAGAR VTC KAKLOOR PO SARDARNAGAR SUB DISTRICT SHABAD CITY SHABAD PINCODE 509217 K V RANGAREDDY TELANGANA 500019	\N	\N	f	Business	CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LTD	200100	Unassigned	19	\N	2025-09-19 07:24:43.798	2025-09-19 07:24:43.798	Primary Applicant	PD	0	\N
890	test9	test9	3464545545	\N	\N	\N	f	Busienss Loan	Axis Bank	3254334	FVCompleted	1	\N	2025-10-07 08:12:03.226	2025-10-07 08:12:03.226	Primary Applicant	PD	2	\N
293	STSL00000065362	SAGAR MANDALA	9966683129	MAINROAD, DOOR NO 2-94, OPP MAHATHI SCHOOL,  PURUSHOTHAPURAM, VISAKHAPATNAM – 530051	\N	\N	f	Business	TATA CAPITAL LIMITED	0	Unassigned	19	\N	2025-09-17 07:12:49.458	2025-09-17 07:12:49.458	Primary Applicant	PD	0	\N
893	test10	test10	2435465753	\N	\N	\N	f	Busienss Loan	Tata Ubl	0	FVCompleted	1	\N	2025-10-07 10:12:24.682	2025-10-07 10:12:24.682	Co-applicant 1	PD	2	\N
478	LA-557362	VENKAGALLA RAVI	9160802893		\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 12:03:42.418	2025-09-19 12:03:42.418	Primary Applicant	PD	0	\N
639	A60236112	Mr. Dharavath Raju	9550460051	M/S Shiva Revathi Automobiles ,Near Canal, Mada MR Gudem,Huzurnagar, Suryapet District,Telanagna - 508204	\N	\N	f	Business	KOTAK MAHINDRA BANK LIMITED	200000	Unassigned	19	\N	2025-09-23 07:19:00.636	2025-09-23 07:19:00.636	Primary Applicant	PD	0	\N
644	LAP0123619	MERIKINAPALLI NAGARAJU	9885237187	D.NO– 2-6-31, STAMBALA GARUVU, NEAR MOULALI KIRANA SHOP, GUNTUR, AP-522006	\N	\N	f	Business	INCRED HOUSING FINANCE LTD	522006	Unassigned	19	\N	2025-09-23 07:40:58.042	2025-09-23 07:40:58.042	Primary Applicant	PD	0	\N
655	APPL00075102	MALLU VENKATESWARA REDDY	9542041367	Plot No.203,2nd floor,A-Block,Sagarika Apartment,KGK Kalyanamandapam Opp.line,Dhanalakshmi puram,Gundlapalem,Nellore-524002.	\N	\N	f	Business	CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LTD	200200200	Unassigned	19	\N	2025-09-23 09:23:07.251	2025-09-23 09:23:07.251	Primary Applicant	PD	0	\N
660	APPL00077096	Mr. Gudlavalleti Naga Babu	8886235051	D No 6-94, Near Arya Vysya Kalyanamandapam, Srikakulam Main Road, Srikakulam, Ghantasala Mandal, Krishna Dist Pin 521132	\N	\N	f	Business	INDUSIND BANK LIMITED	100000	Unassigned	19	\N	2025-09-23 09:32:24.855	2025-09-23 09:32:24.855	Primary Applicant	PD	0	\N
680	HOU/VSKP/0625/1402225	JAGUPILLA SRIKANTH	9848672912	Herballife nutrition,39 33 60 HIG 15 1st floor Madhavadhara,Marripalem,Visakhapatnam,Andhra Pradesh-530018, Visakhapatnam,India.	\N	\N	f	Business	YES BANK LTD	4000000	Unassigned	19	\N	2025-09-23 10:49:48.314	2025-09-23 10:49:48.314	Primary Applicant	PD	0	\N
405	998800099	Mr. PUNNA KARTHIK	8374940219	78/31 BLOCK, RAJIV GRUHA KALPA, TELUGU THALLI ARTS, PRAGATHI NAGAR, NIZAMPET, MEDCHAL- MALKAJGIRI, TELANGANA. -500090.	\N	\N	f	Business	CENT BANK	22008800	Unassigned	19	\N	2025-09-19 07:43:42.039	2025-09-19 07:43:42.039	Primary Applicant	PD	0	\N
444	LA-557255	GURAJARAPU MANIKUMARI	9381652120	RAJAHMUNDRY	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 11:09:36.01	2025-09-19 11:09:36.01	Primary Applicant	PD	0	\N
408	VGA25VK050864	NALAM KIRAN	7993779828	D No:1-49/4,Main Road,Beside Vishal Mart,Chinamushidivada,Pendurthi Mandal,Visakhapatnam,Andhra pradesh 530051	\N	\N	f	Business	CENTRUM HOUSING FINANCE LTD	3000000	Unassigned	19	\N	2025-09-19 07:49:15.795	2025-09-19 07:49:15.795	Primary Applicant	PD	0	\N
453	LA-556479	Patan Raziya	9494525451	26-22-21, Mudunurivari Street,\nGandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-19 11:49:25.36	2025-09-19 11:49:25.36	Primary Applicant	PD	0	\N
410	61181500	SINGAREDDY PRATHAP REDDY	9553349119	SY NO : 27 ,BALNAGAR ,VEMULAWADA , NEAR COURT , RAJANNA SIRCILLA - 505302	\N	\N	f	Business	STATE BANK OF INDIA –IT VERIFICATION AGENCY	87896	Unassigned	19	\N	2025-09-19 07:55:08.53	2025-09-19 07:55:08.53	Primary Applicant	PD	0	\N
682	HOU/VSKP/0525/1391143	CHALAPAKULA RAMU	8341499600	M/S SRI SAI MEDICALS, DR NO 45- 35- 12, AKKAYYAPALEM, OPP TO GVMC PRIMARY SCHOOL,Visakhapatnam,Andhra Pradesh-530016, Visakhapatnam, India.	\N	\N	f	Business	INDOSTAR HOME FINANCE PRIVATE LIMITED	0	Unassigned	19	\N	2025-09-23 10:54:32.563	2025-09-23 10:54:32.563	Primary Applicant	PD	0	\N
785	LA-558495/TPV-00136357	GADDAM KHAJA HUSSAIN	9182285079		\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-27 13:07:39.826	2025-09-27 13:07:39.826	Primary Applicant	PD	0	\N
688	rtyuuu	dgbdfh	2354364756	\N	\N	\N	f	Busienss Loan	Axis Finance UBL	\N	FVCompleted	1	\N	2025-09-24 05:53:04.153	2025-09-24 07:05:52.329	Primary Applicant	PD	0	\N
415	61092358	KANUMURI SRINIVASA RAO	9701027163	Visakhapatnam-HL	\N	\N	f	Business	AXIS FINANCE LTD	0	Unassigned	19	\N	2025-09-19 09:14:57.56	2025-09-19 09:14:57.56	Primary Applicant	PD	0	\N
124	VGA25VK049710	KINTHALI KUSUMA KUMARIw	9348200000	D No:1-91-3/1/2,Mig-72,GF Sector -5,MVP Colony,Visakhapatnam,Andhrapradesh 530017D:1-102-14,17Th Day School,Beside Laddu Gopal,Sector 5,MVP Colony,Visakhapatnam,Andhrapradesh 530017	\N	\N	f	Business	TATA CAPITAL LIMITED	0	FVCompleted	19	\N	2025-09-10 11:13:51.06	2025-09-22 09:15:52.352	Primary Applicant	PD	1	\N
417	CXVJWLP0425802878	Mr Chennu Janardhan	9849344099	Hanuman Aqua Feeds, 77-643, Ganapavaram Road, Karlapalem, Bapatla Dist-522111	\N	\N	f	Business	FULLERTON HOUSING FINANCE LTD	0	Unassigned	19	\N	2025-09-19 09:20:14.935	2025-09-19 09:20:14.935	Primary Applicant	PD	0	\N
603	LA-557402/TPV-00134298	KUMMARI SHIVA GANGA	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-22 13:12:47.274	2025-09-22 13:12:47.274	Primary Applicant	PD	0	\N
419	DSA4BL43335125	Mr. NITIN KUAMR JAIN	7989121958	15-8-343/B AND C,OPP CHAWALA BUILDING,BEGUMBAZAR,HYDERABAD,500012	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-19 09:25:28.769	2025-09-19 09:25:28.769	Primary Applicant	PD	0	\N
615	80241749	M/s.PYDEMAMBA INDUSTRIES	9704309831	H NO.1-579, MALKAPURAM, MALKAPURAM, NEAR ASHRAM HOSPITAL, MALKAPURAM, ELURU, WEST GODAVARI, ANDHRA PRADESH, 534005.	\N	\N	f	Business	HERO FINCORP	10000000	Unassigned	19	\N	2025-09-23 05:18:46.401	2025-09-23 05:18:46.401	Primary Applicant	PD	0	\N
421	DSA4BL4335125	Mr. NITIN KUAMR JAIN	7989121958	15-8-343/B AND C, OPP CHAWALA BUILDING, BEGUMBAZAR, HYDERABAD, 500012	\N	\N	f	Business	AHAM HOUSING FINANCE LTD	8009900	Unassigned	19	\N	2025-09-19 09:58:27.182	2025-09-19 09:58:27.182	Primary Applicant	PD	0	\N
696	LA-558039/TPV-00134615	MARRIPELLI SWAPNA	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 07:32:53.271	2025-09-24 07:32:53.271	Primary Applicant	PD	0	\N
702	LA-557992/TPV-00134527	MD SHABBIR	9182285079	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 07:48:38.741	2025-09-24 07:48:38.741	Primary Applicant	PD	0	\N
618	LA-519035	Gangadevula Gopi	7729934392	Gopi Transportation works, Hno 3-32, Astnagurthy Vi,  Wyra Mon, Khammam-507304	\N	\N	f	Business	KOTAK MAHINDRA BANK LIMITED	2000000	Unassigned	19	\N	2025-09-23 05:20:08.799	2025-09-23 05:20:08.799	Primary Applicant	PD	0	\N
425	APPL01723576	Mr. DASARI RAJU	9866092596		\N	\N	f	Business	ICICI HOME FINANCE LTD	0	Unassigned	19	\N	2025-09-19 10:13:10.928	2025-09-19 10:13:10.928	Primary Applicant	PD	0	\N
627	400437914144	Dondapati Kiran		Ground floor ward no 3 no 16/1/19,vajjulavari  street peddapuram Andhra Pradesh -533437	\N	\N	f	Business	PUNJAB NATIONAL BANK HOUSING FINANCE LIMITED	3000000	Unassigned	19	\N	2025-09-23 06:40:35.793	2025-09-23 06:40:35.793	Primary Applicant	PD	0	\N
428	GFL4103LP0089722	Meda srinivas	9542613999		\N	\N	f	Business	NIDO HOME FINANCE LIMITED	0	Unassigned	19	\N	2025-09-19 10:23:20.324	2025-09-19 10:23:20.324	Primary Applicant	PD	0	\N
705	LA- 556942	CHINTHA RAJITHA	9908066780	Warangal BRANCH	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 08:15:22.623	2025-09-24 08:15:22.623	Primary Applicant	PD	0	\N
493	LA-556854/TPV-00132076	MALOTHU RAJU	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-19 15:13:24.796	2025-09-19 15:13:24.796	Primary Applicant	PD	0	\N
640	AP-10414785	SEETA DEVI	9967786990	Troop Bazar, Jambagh, Hyderabad - 500095 (T.S.)	\N	\N	f	Business	PIRAMAL HOUSING FINANCE LTD	300000	Unassigned	19	\N	2025-09-23 07:27:41.005	2025-09-23 07:27:41.005	Primary Applicant	PD	0	\N
432	GFL3601BL0089787	P Jayachandraprasadyadav	9985234000	SAMRAKSHA MULTI SPECIALITY HOSPITAL, HNO 1-46-56,, BEISDE SBI OPP TRS PARTY OFFICE, NEW TOWN MAHABUBNAGAR, Mahabub Nagar, Telangana, 509001	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-19 10:32:21.874	2025-09-19 10:32:21.874	Primary Applicant	PD	0	\N
641	P-10414785	SEETA DEVI	9967786990	Troop Bazar, Jambagh, Hyderabad - 500095 (T.S.)	\N	\N	f	Business	PIRAMAL HOUSING FINANCE LTD	300000	Unassigned	19	\N	2025-09-23 07:27:41.496	2025-09-23 07:27:41.496	Primary Applicant	PD	0	\N
568	DSA4BL43184825	VENKATA RAMANA REDDY THAPPETA	9030010444	Flat no. 202, P no.3/part, Srinivasa Avenue, Venkataram Reddy Colony, near Shivaji Statue, Gowdavelly, Medchal - 501401	\N	\N	f	Business		1000000	Unassigned	19	\N	2025-09-22 07:27:07.794	2025-09-22 07:27:07.794	Primary Applicant	PD	0	\N
498	LA-557411/TPV-00132070	RAMAIAH KOLA	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-20 04:13:53.997	2025-09-20 04:13:53.997	Primary Applicant	PD	0	\N
578	LA-557845/TPV-00133728	VIPPALA HARIKRISHNA REDDY	9398052081	GUNTUR	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-22 08:31:19.935	2025-09-22 08:31:19.935	Primary Applicant	PD	0	\N
649	LAP0121113	Gouthama Venkata Madhuri	9849446390	Plot No 153/P, Bliss Fort View, Golconda Hills, Neknampur, Puppalaguda, K.V. Rangareddy, Telangana-500089	\N	\N	f	Business	INCRED HOUSING FINANCE LTD	300000	Unassigned	19	\N	2025-09-23 08:55:40.854	2025-09-23 08:55:40.854	Primary Applicant	PD	0	\N
502	LA-557598/TPV-00132351	RANJITH KUMAR KAMMARI	9494525451	Mahabubnagar	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-20 04:32:55.754	2025-09-20 04:32:55.754	Primary Applicant	PD	0	\N
524	LA-557502/TPV-00133040	BANOTHU MAHESH	9494525451		\N	\N	f	Business		0	Unassigned	19	\N	2025-09-20 13:08:19.865	2025-09-20 13:08:19.865	Primary Applicant	PD	0	\N
536	LA-557667	Gundeboina Saidulu			\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-22 04:43:58.001	2025-09-22 04:43:58.001	Primary Applicant	PD	0	\N
782	testing1	testing1	2134565432	\N	\N	\N	f	Busienss Loan	Axis finance UBL	50000	FVCompleted	1	\N	2025-09-26 14:56:44.524	2025-09-26 15:06:56.886	Primary Applicant	PD	0	\N
507	LA-556888/TPV-00132225	DUTA BHARATHAMMA	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO FINCORP	0	Unassigned	19	\N	2025-09-20 04:40:08.194	2025-09-20 04:40:08.194	Primary Applicant	PD	0	\N
542	3000147852	BANDI SWETHA		Pottipadu Gannavaram, Krishna Dist	\N	\N	f	Business	YES BANK LTD	30000	Unassigned	19	\N	2025-09-22 05:19:53.845	2025-09-22 05:19:53.845	Primary Applicant	PD	0	\N
604	LA-557994	Mala Gaini Nagaiah	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-22 14:39:36.879	2025-09-22 14:39:36.879	Primary Applicant	PD	0	\N
698	LA-558050/TPV-00134305	SAYYAD NIZAMUDDIN	9502077619	H.No:-15-9-29,1 st floor,Opposite District Court ,Kaviraj Nagar, Khammam-TelanganaPin code-507002	\N	\N	f	Business	HERO HOUSING FINANCE LTD	0	Unassigned	19	\N	2025-09-24 07:34:16.425	2025-09-24 07:34:16.425	Primary Applicant	PD	0	\N
790	LA-558724/TPV-00137542	PAMI SETTY SETTY SHANKARAIAH	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-27 14:33:32.055	2025-09-27 14:33:32.055	Primary Applicant	PD	0	\N
550	HL2506191718562	VIJAYANAGARAJU  VEGESNA	9948259993	1.SRI VENKATA SAI NURSERY,D NO 2-66,NTR NAGAR BYPASS ROAD,JANGAREDDIGUDEM VILLAGE,JANGAREDDIGUDEM MANDAL,ELRU DISTRICT,A.P-534447	\N	\N	f	Business	INCRED HOUSING FINANCE LTD	500000	Unassigned	19	\N	2025-09-22 06:20:53.226	2025-09-22 06:20:53.226	Primary Applicant	PD	0	\N
553	8657608	Sri Vasudev Traders	9985918611	H No 7-3-145/8/3, Sy No 79, Madhuban Colony, Kattedan, Rajendra Nagar, Ranga Reddy, Telangana-500077	\N	\N	f	Business	BANK OF INDIA - DUE DILIGENCE	700000	Unassigned	19	\N	2025-09-22 06:39:18.331	2025-09-22 06:39:18.331	Primary Applicant	PD	0	\N
622	0504777893	KADIMI SRINIVAS	9491691776	SRI VIJAYA BHARATHI CANTEEN, Dr No 3 21,DVB RAJU TOWN SHIP, DIWANCHERUVU,PALACHARLA VILLAGE , 533296	\N	\N	f	Business	IDFC FIRST FINANCIAL SERVICES LIMITED	300000	Unassigned	19	\N	2025-09-23 05:28:41.822	2025-09-23 05:28:41.822	Primary Applicant	PD	0	\N
555	8202496	KRISHNA HARDWARE	9440784659		\N	\N	f	Business	NEOGROWTH CREDIT PRIVATE LIMITED	200200	Unassigned	19	\N	2025-09-22 06:42:07.443	2025-09-22 06:42:07.443	Primary Applicant	PD	0	\N
700	LA-557025/TPV-00133063	MALKATHALLA RAMANAMMA	9396354779		\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 07:38:20.986	2025-09-24 07:38:20.986	Primary Applicant	PD	0	\N
629	1349329	M/s.Sowrya Traders	7009009876		\N	\N	f	Business	ICICI HOME FINANCE LTD	40000	Unassigned	19	\N	2025-09-23 06:50:36.171	2025-09-23 06:50:36.171	Primary Applicant	PD	0	\N
635	A60248034	Mrs. Naga Rani Mallampati &Mr. K Kashi Vishwanatham	9573134118	Hyderabad Branch.	\N	\N	f	Business	PUNJAB NATIONAL BANK HOUSING FINANCE LIMITED	0	Unassigned	19	\N	2025-09-23 07:06:39.731	2025-09-23 07:06:39.731	Primary Applicant	PD	0	\N
701	LA-555884/TPV-00134983	KUMMARI SHIVA GANGA	9396354779	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 07:38:21.245	2025-09-24 07:38:21.245	Primary Applicant	PD	0	\N
637	A60242226	Thatipamula Kumaraswamy	9963423835	H No. 6-2-106/C/1, Near Beeraiah Temple, Hanumanwada, Jagtial Town & Dist	\N	\N	f	Business	CENT BANK	100100	Unassigned	19	\N	2025-09-23 07:10:19.472	2025-09-23 07:10:19.472	Primary Applicant	PD	0	\N
642	AP-10418407	RAMAVATH SHOBA	9618298608	Amboth Thanda Village, Loyapally, Manchal Mandal, Rangareddy Dist, Telanagana - 501508	\N	\N	f	Business	YES BANK LTD	1500000	Unassigned	19	\N	2025-09-23 07:32:10.799	2025-09-23 07:32:10.799	Primary Applicant	PD	0	\N
651	ajscgc	abcde	5645354678	\N	\N	\N	f	Home Loan	AXIS FINANCE LTD	0	FVCompleted	1	\N	2025-09-23 08:58:00.657	2025-09-23 09:02:53.449	Primary Applicant	PD	0	\N
662	CHEB92108744	NARASIMHARAO BOTTA	9949312303	BNR CLOTH SHOWROOMDoor No 1-91,Survey No:78-2, Navuduru Village Panchayat, Veeravasaram Mandalam, West Godavari District, Andhra Pradesh- 534240.	\N	\N	f	Business	CENTRUM HOUSING FINANCE LTD	4000000	Unassigned	19	\N	2025-09-23 09:34:58.513	2025-09-23 09:34:58.513	Primary Applicant	PD	0	\N
654	QWERR	CVWDV	4567454653	\N	\N	\N	f	Busienss Loan	AXIS FINANCE LTD	\N	FVCompleted	1	\N	2025-09-23 09:05:29.334	2025-09-23 09:08:24.131	Primary Applicant	PD	0	\N
709	rwaeg	456744	4546576543	\N	\N	\N	f	Busienss Loan	Axis Finance UBL	\N	Assigned	1	\N	2025-09-24 08:48:00.387	2025-09-24 08:48:08.422	Primary Applicant	PD	0	\N
659	lasttestt	42675463423	5464345467	\N	\N	\N	f	Busienss Loan	AXIS FINANCE LTD	\N	FVCompleted	1	\N	2025-09-23 09:32:16.88	2025-09-23 09:36:49.243	Primary Applicant	PD	0	\N
664	EQBA92104685	SVEPARALA NOVAPRASANNA	9133557729		\N	\N	f	Business		3000000	Unassigned	19	\N	2025-09-23 09:46:01.829	2025-09-23 09:46:01.829	Primary Applicant	PD	0	\N
665	BLSA00074E84	BEJJENKI RAJESH	9010596960	PLOT NO 384, OPP FCI GODOWN, , OPP FCI GODOWN, , OPP FCI GODOWN, , MALLAPUR, Hyderabad, MEDCHAL MALKAJGIRI, TELANGANA, INDIA, 500076	\N	\N	f	Business	YES BANK LTD	70000	Unassigned	19	\N	2025-09-23 10:02:35.352	2025-09-23 10:02:35.352	Primary Applicant	PD	0	\N
722	srhdtj	srdtjf	4567658723	\N	\N	\N	f	Busienss Loan	Axis finance UBL	\N	Assigned	1	\N	2025-09-24 11:17:33.428	2025-09-24 11:17:40.604	Primary Applicant	PD	0	\N
714	vbfg	efsdgs	4456765465	\N	\N	\N	f	Busienss Loan	Axis Finance UBL	\N	FVCompleted	1	\N	2025-09-24 09:36:51.76	2025-09-24 09:43:08.266	Primary Applicant	PD	0	\N
721	qwertyu	qwertyuio	5546576556	\N	\N	\N	f	Busienss Loan	Axis finance UBL	\N	FVCompleted	1	\N	2025-09-24 11:09:32.762	2025-09-24 11:15:51.516	Primary Applicant	PD	0	\N
671	BLSA00075614	ALLAKONDA KUMAR	9948706554	10-14-1421/3 anand nagar, Anand nagar, Anand nagar, NEAR OIL mill, NIZAMABAD, OIL mill, Nizamabad, NIZAMABAD, TELANGANA, INDIA, 503001	\N	\N	f	Business	YES BANK LTD	70000	Unassigned	19	\N	2025-09-23 10:10:41.904	2025-09-23 10:10:41.904	Primary Applicant	PD	0	\N
673	BLSA0007543C	BOGA THILAK	8019533793	HN NO 2 3 226 , METPALLY , JAGITIAL, METPALLY , RAMALAYAM TAMPLE , RAMALAYAM TAMPLE , KARIM NAGAR, JAGITIAL, TELANGANA, INDIA, 505325	\N	\N	f	Business	YES BANK LTD	70000	Unassigned	19	\N	2025-09-23 10:18:43.498	2025-09-23 10:18:43.498	Primary Applicant	PD	0	\N
723	ALWA	aFEFaeg	9346294699	\N	\N	\N	f	Busienss Loan	Axis finance UBL	\N	Assigned	1	\N	2025-09-24 12:20:09.922	2025-09-24 12:20:17.156	Primary Applicant	PD	0	\N
753	zxcv	fdzfg	3245678345	\N	\N	\N	f	Busienss Loan	Axis finance UBL	1000000000	FVCompleted	1	\N	2025-09-25 10:23:49.483	2025-09-25 10:27:53.582	Primary Applicant	PD	1	\N
747	zxcv	fdzfg	3245678345	\N	\N	\N	f	Busienss Loan	Axis finance UBL	\N	FVCompleted	1	\N	2025-09-25 07:30:42.35	2025-09-25 07:40:50.662	Primary Applicant	PD	0	\N
769	kalpana	hjbjhb	9493344180	\N	\N	\N	f	Busienss Loan	Arka Fincap	800000	FVCompleted	1	\N	2025-09-26 07:18:59.221	2025-09-26 07:38:00.48	Co-applicant 1	PD	0	\N
772	akraaaaaa	akraaaa	3564345647	\N	\N	\N	f	Busienss Loan	Arka Fincap	\N	FVCompleted	1	\N	2025-09-26 10:34:34.964	2025-09-26 10:42:30.299	Primary Applicant	PD	0	\N
770	kowtha demo 123	kowtha	9912994741	Kowetha Telangana pin no:500085	\N	\N	f	Business	Axis finance UBL	10000000	Assigned	19	\N	2025-09-26 10:07:13.567	2025-09-26 11:25:26.469	Primary Applicant	PD	0	\N
783	testing1	testing1	2134565432	\N	\N	\N	f	Busienss Loan	Axis finance UBL	50000	FVCompleted	1	\N	2025-09-26 15:07:10.966	2025-09-26 15:07:10.966	Primary Applicant	PD	1	\N
787	LA-557223/TPV-00136642	BALU VENKATA RAMANAIAH	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-27 13:21:59.645	2025-09-27 13:21:59.645	Primary Applicant	PD	0	\N
715	A60232469	Shaik Abdul Rajak	9542325834		\N	\N	f	Business	INDUSIND BANK LIMITED	0	Unassigned	19	\N	2025-09-24 10:02:58.487	2025-09-24 10:02:58.487	Primary Applicant	PD	0	\N
793	LA-557650/TPV-00136661	SHEK RAJAN	9160802893	WARANGAL	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-28 04:03:07.773	2025-09-28 04:03:07.773	Primary Applicant	PD	0	\N
794	LA-557802/TPV-00136919	BOLLA NAVEEN	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-28 07:22:18.737	2025-09-28 07:22:18.737	Primary Applicant	PD	0	\N
206	Kowthatest1100	Kowtha test	8899009988	DOOR NO SHOP NO 2 , KG ROAD , NANDIKOTKUR , KURNOOL , Andhra Pradesh , 518401	\N	\N	f	Business		1000000	FVCompleted	19	\N	2025-09-15 10:31:10.719	2025-09-24 11:57:40.314	Primary Applicant	PD	0	\N
897	987654	mohan reddy	9912994741	\N	\N	\N	f	Home Loan	Tata Ubl	87654	FVCompleted	1	\N	2025-10-07 10:45:10.179	2025-10-07 10:46:55.521	Co-applicant 1	PD	0	\N
706	556942	CHINTHA RAJITHA	9908066780	WARANGAL BRANCH	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	FVCompleted	19	\N	2025-09-24 08:15:22.753	2025-09-24 12:26:57.716	Primary Applicant	PD	0	\N
724	LA-557766/TPV-00135669	KASALA SHAILAJA	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-24 14:13:01.115	2025-09-24 14:13:01.115	Primary Applicant	PD	0	\N
725	LA-558174/TPV-00135358	KALDARI SURYA	8074024293		\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-24 14:33:42.597	2025-09-24 14:33:42.597	Primary Applicant	PD	0	\N
900	jhnkhn	kalpana	9949006317	\N	\N	\N	f	Personal Loan	Tata Ubl	20000	Assigned	1	\N	2025-10-07 11:44:16.084	2025-10-07 11:44:30.803	Co-applicant 1	PD	0	\N
894	LA- 559518	Gundeboyina Malleshwari	9490008968		\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-10-07 10:25:31.096	2025-10-07 10:25:31.096	Primary Applicant	PD	0	\N
902	kalpana01	kalpana	9949007272	\N	\N	\N	f	Personal Loan	Axis Finance ubl	20000	Assigned	1	\N	2025-10-08 04:43:27.57	2025-10-08 04:44:22.133	Primary Applicant	PD	0	\N
807	LA-557477/TPV-00137754	TAMMALI RAVI	9493344180	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-29 05:00:20.985	2025-09-29 05:00:20.985	Primary Applicant	PD	0	\N
732	LA-558033/TPV-00135442	KATEVADA KAVITHA	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	FVCompleted	19	\N	2025-09-25 04:26:20.493	2025-09-25 05:46:27.645	Primary Applicant	PD	0	\N
907	test12	test12	6787654567	\N	\N	\N	f	Busienss Loan	Rbl	67890	FVCompleted	1	\N	2025-10-08 09:49:26.743	2025-10-08 10:45:06.617	Primary Applicant	PD	0	\N
903	kalpana02	kalpanareddy	9912994741	\N	\N	\N	f	Personal Loan	Tata Ubl	20000	FVCompleted	1	\N	2025-10-08 04:46:32.101	2025-10-09 06:43:43.85	Primary Applicant	PD	0	\N
743	LA-558153/TPV-00135953	PUTTI NARAYANAMURTHI	9381652120	Rajahmundry	\N	\N	f	Business	HERO FINCORP	0	Assigned	19	\N	2025-09-25 06:33:49.612	2025-09-25 07:27:52.254	Primary Applicant	PD	0	\N
748	LA-558210/TPV-00135168	LODAGALA LAKSHMANARAO	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-25 08:02:00.988	2025-09-25 08:02:00.988	Primary Applicant	PD	0	\N
911	kalpana1111111111	mohan reddy	5435646456	\N	\N	\N	f	Busienss Loan	Arka Fincap	200000	Assigned	1	\N	2025-10-09 08:55:14.999	2025-10-09 08:55:41.613	Primary Applicant	PD	0	\N
909	kalpana1100	kalpana reddy	9912990098	\N	\N	\N	f	Personal Loan	Rbl	200000	FVCompleted	1	\N	2025-10-08 14:15:08.908	2025-10-08 15:11:07.85	Primary Applicant	PD	0	\N
727	LA-558203/TPV-00135293	CHAKALI GANGA BHAVANI	9493344180	Anantapur	\N	\N	f	Business	HERO FINCORP	0	FVCompleted	19	\N	2025-09-24 14:38:32.048	2025-09-25 08:25:45.261	Primary Applicant	PD	0	\N
737	LA-558034/TPV-00135696	ANDE DHANALAKSHMI	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business		0	FVCompleted	19	\N	2025-09-25 05:23:53.863	2025-09-25 09:47:32.271	Primary Applicant	PD	0	\N
741	LA-558179/TPV-00136035	MOHAMMED FAROOQ	9494525451		\N	\N	f	Business		0	Assigned	19	\N	2025-09-25 06:31:35.037	2025-09-25 10:35:40.762	Primary Applicant	PD	0	\N
710	LA-555884	Kommuri Ramesh			\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	FVCompleted	19	\N	2025-09-24 08:54:34.996	2025-09-25 10:44:39.804	Primary Applicant	PD	0	\N
754	LA-558074/TPV-00136182	KAPARTHI SURESH	9494525451		\N	\N	f	Business		0	Unassigned	19	\N	2025-09-25 11:17:15.658	2025-09-25 11:17:15.658	Primary Applicant	PD	0	\N
758	LA-554627/TPV-00136165	Kommula Komala	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-25 11:29:06.555	2025-09-25 11:29:06.555	Primary Applicant	PD	0	\N
767	dhana104	dhana reddy	9912994741	suraj residency	\N	\N	f	Business	AXIS FINANCE LTD	200000	FVCompleted	19	\N	2025-09-25 12:22:00.427	2025-09-25 12:31:16.84	Primary Applicant	PD	0	\N
759	kalpana101	kalpana	9912994741	\N	\N	\N	f	Busienss Loan	Axis finance UBL	10000	FVCompleted	1	\N	2025-09-25 11:52:25.097	2025-09-25 12:05:00.938	Primary Applicant	PD	0	\N
750	LA-558024/TPV-00136111	BANALA PRAKASAM	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	f	Business	HERO FINCORP	0	Assigned	19	\N	2025-09-25 09:56:34.487	2025-09-26 07:06:47.32	Primary Applicant	PD	0	\N
768	LA-554084	N P GOVINDARAJULU	9493344180		\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Assigned	19	\N	2025-09-25 12:40:52.61	2025-09-26 07:14:22.115	Primary Applicant	PD	0	\N
773	kowtha demo 110	kowtha team	9912994741	Kowetha Telangana pin no:500085	\N	\N	f	Business	Axis finance UBL	10000000	FVCompleted	19	\N	2025-09-26 10:38:57.613	2025-09-26 11:04:26.531	Primary Applicant	PD	0	\N
765	mohan102	mohan	9912994741	suraj residency	\N	\N	f	Business	AXIS FINANCE LTD	200000	Assigned	19	\N	2025-09-25 12:13:44.516	2025-09-26 11:16:46.72	Primary Applicant	PD	0	\N
837	test5	test5	5346565653	\N	\N	\N	f	Busienss Loan	Tata Ubl	\N	FVCompleted	1	\N	2025-09-29 12:50:43.922	2025-09-29 12:50:43.922	Primary Applicant	PD	1	\N
811	kalpana 123	kalpana	9912994741	\N	\N	\N	f	Personal Loan	Axis finance UBL	100000	FVCompleted	1	\N	2025-09-29 05:02:17.561	2025-09-29 05:22:11.115	Primary Applicant	PD	0	\N
812	LA-558141	SAINATH GANGADHAR IBITDAR	8125968851		\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-29 05:25:58.233	2025-09-29 05:25:58.233	Primary Applicant	PD	0	\N
892	test10	test10	2435465753	\N	\N	\N	f	Busienss Loan	Tata Ubl	0	FVCompleted	1	\N	2025-10-07 10:06:41.032	2025-10-07 10:12:10.835	Co-applicant 1	PD	1	\N
868	LA-558957/TPV-00139106	CHAKALI BALAJI	9494525451	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Assigned	19	\N	2025-10-03 11:36:23.02	2025-10-07 06:29:46.182	Primary Applicant	PD	0	\N
816	test2	test2	4356342545	\N	\N	\N	f	Busienss Loan	Arka Fincap	4577777	FVCompleted	1	\N	2025-09-29 05:28:41.202	2025-09-29 05:46:12.708	Primary Applicant	PD	0	\N
817	test2	test2	4356342545	\N	\N	\N	f	Busienss Loan	Arka Fincap	4577777	FVCompleted	1	\N	2025-09-29 06:15:07.376	2025-09-29 06:15:07.376	Primary Applicant	PD	1	\N
818	LA-558896	SHAIK KHAJAVALI	8125968851	NIZAMABAD BRANCH	\N	\N	f	Business	HERO HOUSING FINANCIAL LTD	0	Unassigned	19	\N	2025-09-29 06:32:51.992	2025-09-29 06:32:51.992	Primary Applicant	PD	0	\N
901	test11	test11	2234632453	\N	\N	\N	f	Home Loan	Rbl	0	FVCompleted	1	\N	2025-10-07 12:01:43.116	2025-10-08 10:39:44.178	Primary Applicant	PD	0	\N
896	6754	gfcdc	5666666666	\N	\N	\N	f	Busienss Loan	Tata Ubl	2000	FVCompleted	1	\N	2025-10-07 10:30:18.18	2025-10-07 10:42:04.46	Primary Applicant	PD	0	\N
823	LA-558141/TPV-00135747	SAINATH GANGADHAR IBITDAR	9490008968		\N	\N	f	Business		0	Unassigned	19	\N	2025-09-29 07:05:50.737	2025-09-29 07:05:50.737	Primary Applicant	PD	0	\N
884	mohan1200	mohanreddy	9494525451	\N	\N	\N	f	Personal Loan	Tata Ubl	200000	FVCompleted	1	\N	2025-10-07 06:31:02.597	2025-10-07 06:45:43.307	Primary Applicant	PD	0	\N
840	LA-558436/TPV-00136507	GOLKONDA SANDHYA	9494525451	VIJAYAWADA	\N	\N	f	Business	Niwas Self employed	0	Unassigned	19	\N	2025-09-29 13:39:39.412	2025-10-07 07:15:46.449	Primary Applicant	PD	0	\N
828	test3	test3	3435565645	\N	\N	\N	f	Busienss Loan	Axis finance	\N	Assigned	1	\N	2025-09-29 07:30:50.45	2025-09-29 07:30:57.65	Primary Applicant	PD	0	\N
861	LA-557147/TPV-00138960	B ADHI LAKSHMI	9494525451		\N	\N	f	Business	Rbl	200000	Assigned	19	\N	2025-10-03 10:24:25.358	2025-10-07 07:23:06.183	Primary Applicant	PD	0	\N
829	kalpana111	kalpana	9949007272	\N	\N	\N	f	Personal Loan	Arka Fincap	200000	FVCompleted	1	\N	2025-09-29 08:53:59.491	2025-09-29 09:47:22.032	Primary Applicant	PD	0	\N
908	test12	test12	6787654567	\N	\N	\N	f	Busienss Loan	Rbl	67890	FVCompleted	1	\N	2025-10-08 10:46:04.932	2025-10-08 10:46:04.932	Primary Applicant	PD	1	\N
889	test9	test9	3464545545	\N	\N	\N	f	Busienss Loan	Axis Bank	3254334	FVCompleted	1	\N	2025-10-07 07:34:18.492	2025-10-07 08:11:55.011	Primary Applicant	PD	1	\N
831	test4	test4	3453647543	\N	\N	\N	f	Busienss Loan	Arka Fincap	\N	FVCompleted	1	\N	2025-09-29 09:39:38.934	2025-09-29 10:42:22.953	Primary Applicant	PD	0	\N
910	gfghjkl	dfgyj	9912994741	\N	\N	\N	f	Personal Loan	Tata Ubl	200000	Assigned	1	\N	2025-10-09 06:36:35.024	2025-10-09 06:36:52.866	Primary Applicant	PD	0	\N
843	afegs	zdbxf	3454654654	\N	\N	\N	f	Busienss Loan	Arka Fincap	\N	Assigned	1	\N	2025-09-29 13:47:41.538	2025-09-29 13:47:48.878	Primary Applicant	PD	0	\N
111	2025062800043	SHAIK CHAN BASHA	9989879008	DOOR NO SHOP NO 2 , KG ROAD , NANDIKOTKUR , KURNOOL , Andhra Pradesh , 518401	\N	\N	f	Business	Rbl	100	Assigned	19	\N	2025-09-10 07:01:39.295	2025-10-08 08:13:07.99	Primary Applicant	PD	0	\N
836	test5	test5	5346565653	\N	\N	\N	f	Busienss Loan	Tata Ubl	\N	FVCompleted	1	\N	2025-09-29 11:39:46.845	2025-09-29 12:47:06.403	Primary Applicant	PD	0	\N
905	kalpana03	kalpanareddy	9912994741	\N	\N	\N	f	Personal Loan	Rbl	20000	FVCompleted	1	\N	2025-10-08 04:49:48.563	2025-10-08 09:31:01.578	Primary Applicant	PD	0	\N
860	dhana123	dhanasree	9912994741	\N	\N	\N	f	Personal Loan	Axis Finance ubl	800000	Assigned	1	\N	2025-10-03 05:50:39.247	2025-10-03 05:51:07.171	Primary Applicant	PD	0	\N
845	test6	test6	3456764534	\N	\N	\N	f	Busienss Loan	Axis Bank	5345	FVCompleted	1	\N	2025-09-29 15:00:04.119	2025-09-29 15:20:54.132	Primary Applicant	PD	0	\N
846	test6	test6	3456764534	\N	\N	\N	f	Busienss Loan	Axis Bank	5345	FVCompleted	1	\N	2025-09-29 15:29:59.134	2025-09-29 15:29:59.134	Primary Applicant	PD	1	\N
854	LA-558510/TPV-00138453	S K RAHIMAN	9494525451	KURNOOL	\N	\N	f	Business		0	Unassigned	19	\N	2025-09-30 14:42:22.75	2025-09-30 14:42:22.75	Primary Applicant	PD	0	\N
867	test7	test7	2554322343	\N	\N	\N	f	Busienss Loan	Rbl	\N	FVCompleted	1	\N	2025-10-03 11:35:02.238	2025-10-03 11:42:46.813	Primary Applicant	PD	0	\N
873	test7	test7	2554322343	\N	\N	\N	f	Busienss Loan	Rbl	\N	FVCompleted	1	\N	2025-10-03 11:43:27.311	2025-10-03 11:43:27.311	Primary Applicant	PD	1	\N
874	AAAAA12133121	Ruthika Vadranam	8888888888	\N	\N	\N	f	Top-up Loan	CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LTD	5000000	Assigned	8	\N	2025-10-06 05:06:13.03	2025-10-06 05:08:42.423	Primary Applicant	FI	0	\N
\.


--
-- Data for Name: Office; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Office" (id, name, location, address, "createdAt", "updatedAt", archived, "organizationId", department) FROM stdin;
18	Karnatakaa	bidarr	Bidar City, Bidar District, Karnataka, PIN 585401, India	2025-08-13 05:49:37.552	2025-08-26 12:11:55.066	t	1	FI
9	vcs	Vizag6	\nB-9 Tirupati 500046	2025-07-11 10:03:01.772	2025-09-01 09:38:41.136	f	1	FI
8	AP	Vijayawad	26-22-21, Mudunurivari Street, Gandhi Nagar, Vijayawada  – 520003.	2025-07-04 11:25:28.477	2025-09-02 09:46:09.871	f	1	FI
22	test2345	asdf	asdfg	2025-09-02 09:46:42.212	2025-09-02 09:46:42.212	f	1	FI
11	test123	few	KOndapur, Hdyerabad	2025-07-23 06:30:44.227	2025-08-19 08:18:47.046	f	1	FI
12	maharastra	Solapur	Flat No. 12B, Green Park Apartments, Andheri West, Mumbai, Maharashtra – 400053, India	2025-07-23 06:30:48.349	2025-08-21 07:10:35.397	f	1	FI
13	kerala	Thiruvananthapuram	House No. 45, MG Road, Palayam, Thiruvananthapuram, Kerala – 695001, India	2025-07-23 06:30:52.903	2025-08-21 07:12:34.056	f	1	FI
15	Tamil Nadu	Chennai	No. 18, Anna Salai, T. Nagar, Chennai, Tamil Nadu – 600017, India	2025-07-23 06:31:02.657	2025-08-21 07:13:28.832	f	1	FI
19	Telangana	Hyderabad	kondapur	2025-08-14 04:40:37.91	2025-08-26 10:10:29.907	f	1	PD
21	Andhra Pradesh	Visakhapatnam	Seethammadhara	2025-08-21 05:20:39.649	2025-08-26 10:10:57.576	f	1	PD
10	ty	dcwe	wefwefwe	2025-07-23 06:30:38.012	2025-08-05 11:58:02.925	f	1	FI
20	Branch - 3	Nellore	Nellore Main Road	2025-08-19 07:42:36.871	2025-08-26 10:11:35.761	f	1	PD
16	Chola Pvt Ltd	Vijayawada	Benz Circle	2025-07-23 06:31:11.999	2025-08-26 10:11:44.279	f	1	PD
14	qfqwf	qwfqwefq	wewqfq	2025-07-23 06:30:58.583	2025-07-23 06:30:58.583	f	1	FI
2	TG	Hyderabad	Flat No: 502, AB Heights Apartment, Premnagar Colony, Khairtabad, Hyderabad, TG - 500004.	2025-05-12 09:57:45.359	2025-07-23 06:37:09.127	f	1	FI
1	Beyondscale	Hyderabad	CWS ONE, Kondapur, Hyderabad	2025-05-09 07:12:21.734	2025-08-05 11:53:56.12	f	1	FI
17	test	Vizag	sagar	2025-08-11 09:49:50.123	2025-08-11 09:49:50.123	f	1	FI
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Organization" (id, name, description) FROM stdin;
1	Kowtha CA & Co.vvvvv	Loan Verification Portal
\.


--
-- Data for Name: PDEmailLog; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."PDEmailLog" (id, "messageID", "fromEmail", "toEmail", "ccEmail", "bccEmail", subject, body, attachments, "receivedAt", "parsedData", "s3Path", "loanId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Session" (id, "userId", otp, "otpExpires", "createdAt", "lastLoginAt", "isActive") FROM stdin;
1	1	242853	2025-08-12 10:47:09.169	2025-08-12 10:37:09.17	\N	t
2	1	528700	2025-08-12 10:48:50.909	2025-08-12 10:38:50.91	\N	t
3	1	474834	2025-08-12 11:35:04.681	2025-08-12 11:25:04.682	\N	t
4	1	751695	2025-08-12 12:24:07.565	2025-08-12 12:14:07.566	\N	t
5	9	806068	2025-08-12 12:25:59.933	2025-08-12 12:15:59.934	\N	t
6	3	780981	2025-08-12 13:28:06.216	2025-08-12 13:18:06.217	\N	t
7	10	936558	2025-08-12 13:30:15.491	2025-08-12 13:20:15.494	\N	t
8	4	214835	2025-08-13 04:49:15.733	2025-08-13 04:39:15.736	\N	t
9	4	695271	2025-08-13 04:49:41.517	2025-08-13 04:39:41.518	\N	t
10	7	528785	2025-08-13 04:56:48.25	2025-08-13 04:46:48.251	\N	t
11	5	133063	2025-08-13 05:03:08.47	2025-08-13 04:53:08.471	\N	t
12	6	980300	2025-08-13 05:04:53.589	2025-08-13 04:54:53.59	\N	t
13	7	690469	2025-08-13 05:06:03.708	2025-08-13 04:56:03.709	\N	t
14	2	960530	2025-08-13 05:09:10.69	2025-08-13 04:59:10.691	\N	t
15	9	788299	2025-08-13 05:33:38.636	2025-08-13 05:23:38.638	\N	t
16	13	941462	2025-08-13 05:42:07.431	2025-08-13 05:32:07.432	\N	t
17	9	378406	2025-08-13 06:45:19.326	2025-08-13 06:35:19.327	\N	t
18	9	160335	2025-08-13 06:50:37.531	2025-08-13 06:40:37.533	\N	t
19	1	706603	2025-08-13 06:54:12.675	2025-08-13 06:44:12.676	\N	t
20	15	744356	2025-08-13 07:02:06.884	2025-08-13 06:52:06.886	\N	t
21	9	285594	2025-08-13 07:17:48.412	2025-08-13 07:07:48.413	\N	t
22	9	449377	2025-08-13 07:46:53.514	2025-08-13 07:36:53.515	\N	t
23	12	303832	2025-08-13 10:00:12.017	2025-08-13 09:50:12.018	\N	t
24	10	181476	2025-08-13 10:01:02.099	2025-08-13 09:51:02.1	\N	t
25	1	532638	2025-08-13 10:04:12.885	2025-08-13 09:54:12.886	\N	t
26	1	686338	2025-08-13 11:25:37.072	2025-08-13 11:15:37.073	\N	t
27	20	956824	2025-08-13 11:46:33.487	2025-08-13 11:36:33.489	\N	t
28	12	249971	2025-08-13 12:30:58.147	2025-08-13 12:20:58.148	\N	t
29	2	330399	2025-08-13 12:31:41.558	2025-08-13 12:21:41.559	\N	t
30	10	644984	2025-08-13 12:32:08.541	2025-08-13 12:22:08.542	\N	t
31	4	204545	2025-08-13 12:33:05.432	2025-08-13 12:23:05.433	\N	t
32	2	304210	2025-08-13 12:33:49.897	2025-08-13 12:23:49.898	\N	t
33	5	574127	2025-08-13 12:36:58.121	2025-08-13 12:26:58.122	\N	t
34	4	694621	2025-08-14 04:42:56.384	2025-08-14 04:32:56.386	\N	t
35	26	643075	2025-08-14 07:06:31.163	2025-08-14 06:56:31.164	\N	t
36	4	312316	2025-08-14 07:06:59.274	2025-08-14 06:56:59.275	\N	t
37	26	850206	2025-08-14 07:08:49.479	2025-08-14 06:58:49.48	\N	t
38	27	203697	2025-08-14 07:10:49.036	2025-08-14 07:00:49.037	\N	t
39	4	715508	2025-08-14 07:14:24.228	2025-08-14 07:04:24.229	\N	t
40	27	506115	2025-08-14 08:09:38.637	2025-08-14 07:59:38.638	\N	t
41	4	975571	2025-08-14 08:09:56.54	2025-08-14 07:59:56.541	\N	t
42	1	374887	2025-08-14 10:58:38.225	2025-08-14 10:48:38.226	\N	t
43	4	793232	2025-08-14 11:05:50.866	2025-08-14 10:55:50.866	\N	t
44	9	790663	2025-08-15 11:06:30.486	2025-08-15 10:56:30.488	\N	t
45	4	825925	2025-08-18 04:28:13.877	2025-08-18 04:18:13.879	\N	t
46	9	179568	2025-08-18 05:46:21.944	2025-08-18 05:36:21.945	\N	t
47	9	362056	2025-08-18 09:36:31.036	2025-08-18 09:26:31.037	\N	t
48	9	613879	2025-08-18 09:36:47.377	2025-08-18 09:26:47.378	\N	t
49	9	318682	2025-08-18 09:43:31.382	2025-08-18 09:33:31.383	\N	t
50	9	196978	2025-08-18 09:49:03.347	2025-08-18 09:39:03.348	\N	t
51	9	861015	2025-08-18 09:49:33.922	2025-08-18 09:39:33.924	\N	t
52	9	116136	2025-08-18 10:44:29.133	2025-08-18 10:34:29.134	\N	t
53	9	193594	2025-08-19 05:17:09.55	2025-08-19 05:07:09.552	\N	t
54	5	228239	2025-08-19 05:27:46.275	2025-08-19 05:17:46.276	\N	t
55	4	422656	2025-08-19 05:28:08.723	2025-08-19 05:18:08.724	\N	t
56	4	780742	2025-08-19 06:24:08.399	2025-08-19 06:14:08.4	\N	t
57	4	500344	2025-08-19 06:24:16.82	2025-08-19 06:14:16.82	\N	t
58	9	317291	2025-08-19 09:59:17.008	2025-08-19 09:49:17.009	\N	t
59	9	584069	2025-08-19 10:07:32.676	2025-08-19 09:57:32.677	\N	t
60	4	388194	2025-08-20 04:28:34.634	2025-08-20 04:18:34.637	\N	t
61	4	492621	2025-08-20 04:32:50.639	2025-08-20 04:22:50.64	\N	t
62	5	203683	2025-08-20 04:33:21.927	2025-08-20 04:23:21.928	\N	t
63	4	367264	2025-08-20 04:37:07.818	2025-08-20 04:27:07.819	\N	t
64	4	262121	2025-08-20 04:59:10.247	2025-08-20 04:49:10.248	\N	t
65	9	103529	2025-08-20 05:15:01.24	2025-08-20 05:05:01.242	\N	t
66	9	405241	2025-08-20 06:55:33.726	2025-08-20 06:45:33.727	\N	t
67	1	511506	2025-08-20 07:32:56.557	2025-08-20 07:22:56.558	\N	t
68	1	994787	2025-08-20 07:56:50.676	2025-08-20 07:46:50.677	\N	t
69	35	761277	2025-08-20 13:20:46.18	2025-08-20 13:10:46.181	\N	t
70	4	348749	2025-08-21 04:44:04.538	2025-08-21 04:34:04.54	\N	t
71	4	623315	2025-08-21 05:23:53.472	2025-08-21 05:13:53.473	\N	t
72	9	437727	2025-08-21 05:25:31.754	2025-08-21 05:15:31.755	\N	t
73	7	627077	2025-08-21 07:36:00.249	2025-08-21 07:26:00.25	\N	t
74	7	777173	2025-08-21 07:36:59.987	2025-08-21 07:26:59.988	\N	t
75	7	629765	2025-08-21 07:39:16.78	2025-08-21 07:29:16.781	\N	t
76	4	271049	2025-08-21 07:52:47.226	2025-08-21 07:42:47.227	\N	t
77	4	949538	2025-08-21 07:53:46.388	2025-08-21 07:43:46.389	\N	t
78	4	101772	2025-08-21 07:55:58.074	2025-08-21 07:45:58.076	\N	t
79	4	241817	2025-08-21 08:37:56.05	2025-08-21 08:27:56.051	\N	t
80	4	602649	2025-08-22 04:28:04.719	2025-08-22 04:18:04.721	\N	t
81	5	463589	2025-08-22 04:40:40.137	2025-08-22 04:30:40.138	\N	t
82	5	187510	2025-08-22 04:55:16.483	2025-08-22 04:45:16.484	\N	t
83	9	737169	2025-08-22 05:13:17.758	2025-08-22 05:03:17.759	\N	t
84	35	429780	2025-08-22 05:14:08.98	2025-08-22 05:04:08.981	\N	t
85	9	918272	2025-08-22 05:14:28.415	2025-08-22 05:04:28.416	\N	t
86	35	368915	2025-08-22 05:15:19.374	2025-08-22 05:05:19.375	\N	t
87	9	386761	2025-08-22 05:15:40.022	2025-08-22 05:05:40.023	\N	t
88	6	345806	2025-08-22 05:17:08.342	2025-08-22 05:07:08.343	\N	t
89	5	229200	2025-08-22 05:19:28.94	2025-08-22 05:09:28.941	\N	t
90	4	188897	2025-08-22 05:19:48.015	2025-08-22 05:09:48.016	\N	t
91	12	381065	2025-08-22 05:24:37.851	2025-08-22 05:14:37.852	\N	t
92	9	869426	2025-08-22 05:25:25.546	2025-08-22 05:15:25.547	\N	t
93	9	680640	2025-08-22 05:25:59.93	2025-08-22 05:15:59.931	\N	t
94	12	741118	2025-08-22 05:26:11.909	2025-08-22 05:16:11.91	\N	t
95	6	356709	2025-08-22 05:27:24.382	2025-08-22 05:17:24.383	\N	t
96	5	102327	2025-08-22 05:59:45.545	2025-08-22 05:49:45.546	\N	t
97	4	419182	2025-08-22 06:00:23.034	2025-08-22 05:50:23.035	\N	t
98	4	179473	2025-08-22 06:01:48.338	2025-08-22 05:51:48.339	\N	t
99	5	491889	2025-08-22 06:02:35.364	2025-08-22 05:52:35.365	\N	t
100	9	377806	2025-08-22 06:06:20.046	2025-08-22 05:56:20.047	\N	t
101	9	765807	2025-08-22 06:07:29.015	2025-08-22 05:57:29.016	\N	t
102	4	912540	2025-08-22 06:16:39.63	2025-08-22 06:06:39.631	\N	t
103	9	489664	2025-08-22 06:18:22.295	2025-08-22 06:08:22.296	\N	t
104	4	863872	2025-08-22 06:38:59.766	2025-08-22 06:28:59.767	\N	t
105	38	353042	2025-08-22 06:41:56.312	2025-08-22 06:31:56.313	\N	t
106	5	587045	2025-08-22 06:42:44.782	2025-08-22 06:32:44.783	\N	t
107	4	571724	2025-08-22 06:45:14.124	2025-08-22 06:35:14.125	\N	t
108	4	214135	2025-08-22 07:05:12.903	2025-08-22 06:55:12.904	\N	t
109	4	982882	2025-08-22 07:05:13.48	2025-08-22 06:55:13.48	\N	t
110	4	572883	2025-08-22 07:06:53.128	2025-08-22 06:56:53.129	\N	t
111	1	172147	2025-08-22 07:07:39.019	2025-08-22 06:57:39.02	\N	t
112	4	432662	2025-08-22 07:08:38.372	2025-08-22 06:58:38.373	\N	t
113	4	261282	2025-08-22 07:10:10.231	2025-08-22 07:00:10.233	\N	t
114	9	345979	2025-08-22 07:15:26.429	2025-08-22 07:05:26.43	\N	t
115	4	464064	2025-08-22 07:15:37.566	2025-08-22 07:05:37.567	\N	t
116	4	787675	2025-08-22 07:21:29.256	2025-08-22 07:11:29.257	\N	t
117	4	127674	2025-08-22 07:22:33.09	2025-08-22 07:12:33.091	\N	t
118	1	215627	2025-08-22 07:22:50.097	2025-08-22 07:12:50.098	\N	t
119	1	345089	2025-08-22 07:26:48.16	2025-08-22 07:16:48.161	\N	t
120	4	367472	2025-08-22 07:27:19.782	2025-08-22 07:17:19.783	\N	t
121	4	549621	2025-08-22 07:27:49.181	2025-08-22 07:17:49.182	\N	t
122	4	532972	2025-08-22 07:30:40.979	2025-08-22 07:20:40.98	\N	t
123	4	672119	2025-08-22 07:44:43.968	2025-08-22 07:34:43.972	\N	t
124	4	527509	2025-08-22 08:31:45.131	2025-08-22 08:21:45.132	\N	t
125	38	862587	2025-08-22 09:06:44.929	2025-08-22 08:56:44.93	\N	t
126	4	672925	2025-08-22 09:07:00.31	2025-08-22 08:57:00.311	\N	t
127	38	403837	2025-08-22 09:14:00.337	2025-08-22 09:04:00.338	\N	t
128	38	324425	2025-08-22 09:16:13.278	2025-08-22 09:06:13.279	\N	t
129	4	950671	2025-08-22 09:16:44.736	2025-08-22 09:06:44.737	\N	t
130	38	438694	2025-08-22 09:17:56.675	2025-08-22 09:07:56.676	\N	t
131	38	394046	2025-08-22 09:18:23.154	2025-08-22 09:08:23.156	\N	t
132	38	828449	2025-08-22 09:18:55.196	2025-08-22 09:08:55.197	\N	t
133	38	276785	2025-08-22 09:19:41.999	2025-08-22 09:09:42	\N	t
134	38	353385	2025-08-22 09:20:08.05	2025-08-22 09:10:08.051	\N	t
135	38	365514	2025-08-22 09:21:24.781	2025-08-22 09:11:24.782	\N	t
136	38	849797	2025-08-22 09:22:26.633	2025-08-22 09:12:26.633	\N	t
137	4	239529	2025-08-22 09:35:10.249	2025-08-22 09:25:10.25	\N	t
138	38	329108	2025-08-22 09:37:12.355	2025-08-22 09:27:12.356	\N	t
139	38	278065	2025-08-22 09:38:07.284	2025-08-22 09:28:07.285	\N	t
140	38	130527	2025-08-22 09:39:43.36	2025-08-22 09:29:43.361	\N	t
141	38	956620	2025-08-22 09:58:15.899	2025-08-22 09:48:15.9	\N	t
142	38	292390	2025-08-22 10:00:47.006	2025-08-22 09:50:47.007	\N	t
143	9	737249	2025-08-22 10:14:02.114	2025-08-22 10:04:02.115	\N	t
144	9	713723	2025-08-25 06:21:33.172	2025-08-25 06:11:33.174	\N	t
145	9	627917	2025-08-25 06:21:52.396	2025-08-25 06:11:52.397	\N	t
146	9	362600	2025-08-25 06:22:53.123	2025-08-25 06:12:53.124	\N	t
147	9	435649	2025-08-25 07:09:19.494	2025-08-25 06:59:19.495	\N	t
148	9	804954	2025-08-25 07:12:03.445	2025-08-25 07:02:03.446	\N	t
149	1	120161	2025-08-25 07:13:03.397	2025-08-25 07:03:03.398	\N	t
150	1	742417	2025-08-25 07:13:36.479	2025-08-25 07:03:36.48	\N	t
151	9	503380	2025-08-25 07:14:11.145	2025-08-25 07:04:11.146	\N	t
152	9	663827	2025-08-25 07:15:54.143	2025-08-25 07:05:54.145	\N	t
153	9	836952	2025-08-25 07:16:16.889	2025-08-25 07:06:16.89	\N	t
154	40	433082	2025-08-25 08:29:38.42	2025-08-25 08:19:38.421	\N	t
155	9	638884	2025-08-25 08:35:23.557	2025-08-25 08:25:23.558	\N	t
156	41	257948	2025-08-25 08:46:10.104	2025-08-25 08:36:10.104	\N	t
157	9	572128	2025-08-25 10:50:54.153	2025-08-25 10:40:54.154	\N	t
158	9	787637	2025-08-25 10:51:58.872	2025-08-25 10:41:58.873	\N	t
159	1	541033	2025-08-25 10:52:24.06	2025-08-25 10:42:24.061	\N	t
160	9	535678	2025-08-25 10:52:56.011	2025-08-25 10:42:56.012	\N	t
161	9	320696	2025-08-25 10:53:18.33	2025-08-25 10:43:18.331	\N	t
162	41	116301	2025-08-25 11:05:10.445	2025-08-25 10:55:10.447	\N	t
163	41	970327	2025-08-25 11:05:47.056	2025-08-25 10:55:47.058	\N	t
164	9	850468	2025-08-25 12:43:01.724	2025-08-25 12:33:01.725	\N	t
165	4	418094	2025-08-26 03:50:07.131	2025-08-26 03:40:07.134	\N	t
166	9	316557	2025-08-26 05:18:44.508	2025-08-26 05:08:44.509	\N	t
167	9	288141	2025-08-26 05:38:11.666	2025-08-26 05:28:11.667	\N	t
168	40	591658	2025-08-26 05:41:41.621	2025-08-26 05:31:41.622	\N	t
169	9	317674	2025-08-26 05:43:48.429	2025-08-26 05:33:48.43	\N	t
170	41	435922	2025-08-26 06:00:26.337	2025-08-26 05:50:26.338	\N	t
171	41	775319	2025-08-26 07:27:32.723	2025-08-26 07:17:32.724	\N	t
172	41	148591	2025-08-26 08:43:52.084	2025-08-26 08:33:52.085	\N	t
173	15	771448	2025-08-26 08:45:30.034	2025-08-26 08:35:30.035	\N	t
174	15	468622	2025-08-26 08:48:18.13	2025-08-26 08:38:18.131	\N	t
175	15	132811	2025-08-26 08:48:41.776	2025-08-26 08:38:41.777	\N	t
176	9	335783	2025-08-26 09:24:05.237	2025-08-26 09:14:05.238	\N	t
177	41	925254	2025-08-26 09:26:19.734	2025-08-26 09:16:19.735	\N	t
178	9	486973	2025-08-26 09:29:39.87	2025-08-26 09:19:39.871	\N	t
179	1	141889	2025-08-26 09:31:42.671	2025-08-26 09:21:42.672	\N	t
180	1	425429	2025-08-26 09:34:29.011	2025-08-26 09:24:29.013	\N	t
181	9	578021	2025-08-26 09:34:40.14	2025-08-26 09:24:40.141	\N	t
182	9	642621	2025-08-26 10:07:13.417	2025-08-26 09:57:13.418	\N	t
183	5	881254	2025-08-26 10:41:28.353	2025-08-26 10:31:28.354	\N	t
184	9	347762	2025-08-26 10:55:17.153	2025-08-26 10:45:17.154	\N	t
185	43	434292	2025-08-26 11:29:38.034	2025-08-26 11:19:38.034	\N	t
186	43	200902	2025-08-26 11:30:03.453	2025-08-26 11:20:03.454	\N	t
187	9	702987	2025-08-26 12:03:07.318	2025-08-26 11:53:07.319	\N	t
188	8	232941	2025-08-26 12:29:32.309	2025-08-26 12:19:32.31	\N	t
189	43	458014	2025-08-26 12:30:37.492	2025-08-26 12:20:37.493	\N	t
190	41	782673	2025-08-26 12:31:33.544	2025-08-26 12:21:33.545	\N	t
191	41	474627	2025-08-26 12:33:47.086	2025-08-26 12:23:47.087	\N	t
192	43	986558	2025-08-27 13:29:13.05	2025-08-27 13:19:13.052	\N	t
193	41	731492	2025-08-28 04:58:58.873	2025-08-28 04:48:58.875	\N	t
194	43	667118	2025-08-28 05:18:49.877	2025-08-28 05:08:49.878	\N	t
195	43	399458	2025-08-28 05:33:49.056	2025-08-28 05:23:49.057	\N	t
196	43	492217	2025-08-28 12:32:09.241	2025-08-28 12:22:09.242	\N	t
197	5	190438	2025-08-29 04:59:38.944	2025-08-29 04:49:38.947	\N	t
198	4	363082	2025-08-29 04:59:49.747	2025-08-29 04:49:49.748	\N	t
199	41	702667	2025-08-29 05:15:08.424	2025-08-29 05:05:08.424	\N	t
200	43	431413	2025-08-29 05:18:02.655	2025-08-29 05:08:02.656	\N	t
201	43	451240	2025-08-29 05:21:59.405	2025-08-29 05:11:59.406	\N	t
202	43	538456	2025-08-29 05:51:33.312	2025-08-29 05:41:33.313	\N	t
203	1	126944	2025-08-29 06:22:12.852	2025-08-29 06:12:12.853	\N	t
204	1	946079	2025-08-29 06:23:01.052	2025-08-29 06:13:01.053	\N	t
205	43	806134	2025-08-29 06:26:32.716	2025-08-29 06:16:32.717	\N	t
206	4	885732	2025-08-29 06:27:01.621	2025-08-29 06:17:01.627	\N	t
207	43	942393	2025-08-29 06:31:27.706	2025-08-29 06:21:27.707	\N	t
208	44	917689	2025-08-29 06:33:39.237	2025-08-29 06:23:39.237	\N	t
209	38	376813	2025-08-29 06:36:27.246	2025-08-29 06:26:27.247	\N	t
210	4	476832	2025-08-29 06:42:46.347	2025-08-29 06:32:46.348	\N	t
211	1	437263	2025-08-29 07:06:53.833	2025-08-29 06:56:53.835	\N	t
212	41	617213	2025-08-29 07:34:58.653	2025-08-29 07:24:58.654	\N	t
213	43	357951	2025-08-29 09:48:18.718	2025-08-29 09:38:18.719	\N	t
214	43	920351	2025-08-29 10:10:37.212	2025-08-29 10:00:37.213	\N	t
215	1	100713	2025-08-29 11:16:47.014	2025-08-29 11:06:47.015	\N	t
216	44	940552	2025-08-29 12:25:46.536	2025-08-29 12:15:46.537	\N	t
217	4	690886	2025-09-01 04:12:22.729	2025-09-01 04:02:22.731	\N	t
218	44	254987	2025-09-01 04:55:24.736	2025-09-01 04:45:24.737	\N	t
219	43	974212	2025-09-01 05:36:06.797	2025-09-01 05:26:06.797	\N	t
220	43	949185	2025-09-01 06:00:04.539	2025-09-01 05:50:04.54	\N	t
221	41	143207	2025-09-01 06:04:51.492	2025-09-01 05:54:51.492	\N	t
222	1	397062	2025-09-01 06:16:54.59	2025-09-01 06:06:54.591	\N	t
223	44	841362	2025-09-01 06:17:03.046	2025-09-01 06:07:03.047	\N	t
224	4	348033	2025-09-01 06:46:16.143	2025-09-01 06:36:16.144	\N	t
225	44	105124	2025-09-01 06:46:26.768	2025-09-01 06:36:26.769	\N	t
226	40	403993	2025-09-01 08:06:27.264	2025-09-01 07:56:27.265	\N	t
227	4	382350	2025-09-02 04:49:47.757	2025-09-02 04:39:47.759	\N	t
228	4	169825	2025-09-02 05:14:31.579	2025-09-02 05:04:31.58	\N	t
229	43	860299	2025-09-02 05:21:46.014	2025-09-02 05:11:46.015	\N	t
230	4	565009	2025-09-02 05:25:10.544	2025-09-02 05:15:10.545	\N	t
231	43	186028	2025-09-02 05:40:13.078	2025-09-02 05:30:13.079	\N	t
232	4	244113	2025-09-02 05:50:37.948	2025-09-02 05:40:37.949	\N	t
233	41	940087	2025-09-02 06:06:22.837	2025-09-02 05:56:22.838	\N	t
234	43	298367	2025-09-02 08:56:15.278	2025-09-02 08:46:15.279	\N	t
235	1	106921	2025-09-02 09:15:50.87	2025-09-02 09:05:50.871	\N	t
236	7	100643	2025-09-02 09:29:01.123	2025-09-02 09:19:01.124	\N	t
237	7	256458	2025-09-02 09:30:14.715	2025-09-02 09:20:14.716	\N	t
238	7	956094	2025-09-02 09:32:06.887	2025-09-02 09:22:06.888	\N	t
239	41	784402	2025-09-02 09:55:53.85	2025-09-02 09:45:53.851	\N	t
240	41	388038	2025-09-02 09:57:45.68	2025-09-02 09:47:45.682	\N	t
241	7	182925	2025-09-02 09:59:14.061	2025-09-02 09:49:14.062	\N	t
242	43	122863	2025-09-02 10:04:11.624	2025-09-02 09:54:11.625	\N	t
243	7	110679	2025-09-02 10:16:03.681	2025-09-02 10:06:03.682	\N	t
244	14	882044	2025-09-02 10:17:05.333	2025-09-02 10:07:05.334	\N	t
245	7	467965	2025-09-02 10:25:51.281	2025-09-02 10:15:51.282	\N	t
246	44	295364	2025-09-02 10:46:39.278	2025-09-02 10:36:39.279	\N	t
247	44	492643	2025-09-02 10:48:42.223	2025-09-02 10:38:42.224	\N	t
248	44	982620	2025-09-02 10:49:02.857	2025-09-02 10:39:02.858	\N	t
249	44	354955	2025-09-02 10:49:29.71	2025-09-02 10:39:29.711	\N	t
250	4	541526	2025-09-03 04:36:19.159	2025-09-03 04:26:19.161	\N	t
251	43	231734	2025-09-03 05:13:19.684	2025-09-03 05:03:19.685	\N	t
252	43	634798	2025-09-03 06:58:33.241	2025-09-03 06:48:33.242	\N	t
253	43	983463	2025-09-03 09:04:23.072	2025-09-03 08:54:23.073	\N	t
254	43	398519	2025-09-03 09:44:04.953	2025-09-03 09:34:04.955	\N	t
255	7	855630	2025-09-03 10:02:59.767	2025-09-03 09:52:59.768	\N	t
256	7	655264	2025-09-03 10:10:06.54	2025-09-03 10:00:06.541	\N	t
257	44	381652	2025-09-03 10:10:35.987	2025-09-03 10:00:35.988	\N	t
258	7	114967	2025-09-03 10:11:18.974	2025-09-03 10:01:18.975	\N	t
259	41	751653	2025-09-03 10:11:24.745	2025-09-03 10:01:24.746	\N	t
260	44	631019	2025-09-03 10:12:52.898	2025-09-03 10:02:52.9	\N	t
261	7	658660	2025-09-03 10:13:28.04	2025-09-03 10:03:28.041	\N	t
262	7	187593	2025-09-03 10:28:59.036	2025-09-03 10:18:59.037	\N	t
263	44	121781	2025-09-03 10:29:23.27	2025-09-03 10:19:23.271	\N	t
264	7	907231	2025-09-03 10:34:52.252	2025-09-03 10:24:52.253	\N	t
265	44	950282	2025-09-03 12:30:21.072	2025-09-03 12:20:21.073	\N	t
266	4	105563	2025-09-04 04:33:10.909	2025-09-04 04:23:10.911	\N	t
267	44	587322	2025-09-04 04:40:32.771	2025-09-04 04:30:32.772	\N	t
268	43	486720	2025-09-04 05:00:46.479	2025-09-04 04:50:46.48	\N	t
269	43	802663	2025-09-04 05:03:20.807	2025-09-04 04:53:20.808	\N	t
270	4	921246	2025-09-04 05:38:39.812	2025-09-04 05:28:39.813	\N	t
271	44	385301	2025-09-04 09:11:54.777	2025-09-04 09:01:54.778	\N	t
272	45	300562	2025-09-04 09:12:51.961	2025-09-04 09:02:51.962	\N	t
273	43	541543	2025-09-04 11:05:24.812	2025-09-04 10:55:24.813	\N	t
274	43	704012	2025-09-04 11:08:02.641	2025-09-04 10:58:02.641	\N	t
275	41	999239	2025-09-04 11:22:34.174	2025-09-04 11:12:34.175	\N	t
276	47	911316	2025-09-04 11:25:19.48	2025-09-04 11:15:19.481	\N	t
277	47	901957	2025-09-04 11:31:54.464	2025-09-04 11:21:54.464	\N	t
278	4	694748	2025-09-05 04:25:53.168	2025-09-05 04:15:53.17	\N	t
279	43	128383	2025-09-05 05:26:16.897	2025-09-05 05:16:16.898	\N	t
280	43	936654	2025-09-05 06:00:22.129	2025-09-05 05:50:22.13	\N	t
281	4	388141	2025-09-08 04:32:56.843	2025-09-08 04:22:56.845	\N	t
282	43	602221	2025-09-08 06:16:21.594	2025-09-08 06:06:21.595	\N	t
283	43	988473	2025-09-08 06:21:17.415	2025-09-08 06:11:17.416	\N	t
284	4	316622	2025-09-09 04:19:51.758	2025-09-09 04:09:51.76	\N	t
285	4	914658	2025-09-09 04:42:46.531	2025-09-09 04:32:46.532	\N	t
286	44	454039	2025-09-09 05:17:49.443	2025-09-09 05:07:49.444	\N	t
287	43	643335	2025-09-09 05:57:45.475	2025-09-09 05:47:45.476	\N	t
288	1	897497	2025-09-09 07:16:51.676	2025-09-09 07:06:51.677	\N	t
289	4	453256	2025-09-10 04:30:27.342	2025-09-10 04:20:27.344	\N	t
290	4	287931	2025-09-10 04:40:30.683	2025-09-10 04:30:30.684	\N	t
291	43	187215	2025-09-10 06:19:37.751	2025-09-10 06:09:37.753	\N	t
292	4	500517	2025-09-11 04:32:18.978	2025-09-11 04:22:18.98	\N	t
293	4	176973	2025-09-11 04:44:48.523	2025-09-11 04:34:48.523	\N	t
294	4	849807	2025-09-11 06:33:56.838	2025-09-11 06:23:56.839	\N	t
295	4	351593	2025-09-11 06:37:34.293	2025-09-11 06:27:34.295	\N	t
296	43	976509	2025-09-11 07:46:51.637	2025-09-11 07:36:51.638	\N	t
297	4	626297	2025-09-12 04:33:25.908	2025-09-12 04:23:25.91	\N	t
298	4	996371	2025-09-15 05:05:12.791	2025-09-15 04:55:12.793	\N	t
299	4	983846	2025-09-15 05:13:51.019	2025-09-15 05:03:51.02	\N	t
300	43	128519	2025-09-15 05:33:35.046	2025-09-15 05:23:35.047	\N	t
301	44	347958	2025-09-15 05:56:57.067	2025-09-15 05:46:57.068	\N	t
302	43	821208	2025-09-15 07:40:49.017	2025-09-15 07:30:49.019	\N	t
303	4	434379	2025-09-16 05:06:11.272	2025-09-16 04:56:11.275	\N	t
304	4	181505	2025-09-16 05:40:12.548	2025-09-16 05:30:12.55	\N	t
305	4	528994	2025-09-16 09:29:40.882	2025-09-16 09:19:40.883	\N	t
306	4	323935	2025-09-17 07:02:50.118	2025-09-17 06:52:50.122	\N	t
307	4	255250	2025-09-17 07:10:52.417	2025-09-17 07:00:52.419	\N	t
308	4	844476	2025-09-17 12:13:20.556	2025-09-17 12:03:20.564	\N	t
309	4	975231	2025-09-18 06:45:48.717	2025-09-18 06:35:48.719	\N	t
310	41	475811	2025-09-18 08:41:44.519	2025-09-18 08:31:44.522	\N	t
311	40	255239	2025-09-18 09:43:55.594	2025-09-18 09:33:55.596	\N	t
312	41	459851	2025-09-21 20:02:53.852	2025-09-21 19:52:53.854	\N	t
313	4	136959	2025-09-22 05:16:46.191	2025-09-22 05:06:46.193	\N	t
314	7	536780	2025-09-22 09:05:58.896	2025-09-22 08:55:58.897	\N	t
315	4	904608	2025-09-22 09:06:25.795	2025-09-22 08:56:25.795	\N	t
316	44	543269	2025-09-22 09:09:48.573	2025-09-22 08:59:48.574	\N	t
317	43	926285	2025-09-23 05:15:57.108	2025-09-23 05:05:57.109	\N	t
318	41	862694	2025-09-23 07:34:13.13	2025-09-23 07:24:13.131	\N	t
319	43	373613	2025-09-23 08:59:10.77	2025-09-23 08:49:10.771	\N	t
320	47	842702	2025-09-23 09:08:49.593	2025-09-23 08:58:49.594	\N	t
321	43	819659	2025-09-23 12:12:25.184	2025-09-23 12:02:25.185	\N	t
322	43	505989	2025-09-24 05:36:51.397	2025-09-24 05:26:51.399	\N	t
323	44	111529	2025-09-24 05:57:41.046	2025-09-24 05:47:41.048	\N	t
324	4	516921	2025-09-24 05:58:06.765	2025-09-24 05:48:06.766	\N	t
325	43	367985	2025-09-24 06:00:57.342	2025-09-24 05:50:57.343	\N	t
326	47	102269	2025-09-24 06:10:23.644	2025-09-24 06:00:23.645	\N	t
327	7	117122	2025-09-24 09:17:52.145	2025-09-24 09:07:52.146	\N	t
328	44	475680	2025-09-24 09:19:40.985	2025-09-24 09:09:40.986	\N	t
329	41	587442	2025-09-24 09:32:19.453	2025-09-24 09:22:19.454	\N	t
330	7	523672	2025-09-24 09:34:52.671	2025-09-24 09:24:52.672	\N	t
331	44	515497	2025-09-24 09:38:27.287	2025-09-24 09:28:27.287	\N	t
332	40	865584	2025-09-24 12:12:32.911	2025-09-24 12:02:32.912	\N	t
333	1	736679	2025-09-24 12:26:44.718	2025-09-24 12:16:44.72	\N	t
334	44	668436	2025-09-24 12:28:30.537	2025-09-24 12:18:30.539	\N	t
335	43	292551	2025-09-25 04:37:46.211	2025-09-25 04:27:46.212	\N	t
336	43	283462	2025-09-25 04:38:22.427	2025-09-25 04:28:22.428	\N	t
337	43	350748	2025-09-25 04:39:53.088	2025-09-25 04:29:53.089	\N	t
338	4	169421	2025-09-25 04:44:22.904	2025-09-25 04:34:22.905	\N	t
339	4	568596	2025-09-25 04:51:07.109	2025-09-25 04:41:07.11	\N	t
340	1	923837	2025-09-25 05:39:47.825	2025-09-25 05:29:47.826	\N	t
341	47	549230	2025-09-25 07:08:00.689	2025-09-25 06:58:00.69	\N	t
342	40	964060	2025-09-25 10:22:48.172	2025-09-25 10:12:48.173	\N	t
343	41	717662	2025-09-25 10:38:01.462	2025-09-25 10:28:01.463	\N	t
344	44	907558	2025-09-25 12:00:10.955	2025-09-25 11:50:10.956	\N	t
345	4	542404	2025-09-25 12:32:12.992	2025-09-25 12:22:12.993	\N	t
346	43	339909	2025-09-26 05:09:24.089	2025-09-26 04:59:24.092	\N	t
347	43	204852	2025-09-26 05:19:57.361	2025-09-26 05:09:57.362	\N	t
348	43	176357	2025-09-26 05:28:03.326	2025-09-26 05:18:03.328	\N	t
349	4	134516	2025-09-26 05:56:03.265	2025-09-26 05:46:03.266	\N	t
350	1	822509	2025-09-26 06:44:41.999	2025-09-26 06:34:42.001	\N	t
351	1	152106	2025-09-26 06:51:49.693	2025-09-26 06:41:49.694	\N	t
352	44	201454	2025-09-26 06:53:44.543	2025-09-26 06:43:44.544	\N	t
353	43	112986	2025-09-26 07:08:01.467	2025-09-26 06:58:01.469	\N	t
354	44	927001	2025-09-26 07:18:15.646	2025-09-26 07:08:15.647	\N	t
355	47	197268	2025-09-26 09:40:08.219	2025-09-26 09:30:08.22	\N	t
356	44	368518	2025-09-26 10:37:05.284	2025-09-26 10:27:05.285	\N	t
357	41	260506	2025-09-26 11:06:39.363	2025-09-26 10:56:39.364	\N	t
358	44	204403	2025-09-26 11:34:28.433	2025-09-26 11:24:28.434	\N	t
359	47	122585	2025-09-26 15:05:40.248	2025-09-26 14:55:40.252	\N	t
360	43	157331	2025-09-27 14:14:09.686	2025-09-27 14:04:09.687	\N	t
361	43	647276	2025-09-27 14:15:17.772	2025-09-27 14:05:17.773	\N	t
362	4	971404	2025-09-29 04:53:01.288	2025-09-29 04:43:01.289	\N	t
363	44	655069	2025-09-29 05:03:23.441	2025-09-29 04:53:23.442	\N	t
364	4	361455	2025-09-29 05:03:47.266	2025-09-29 04:53:47.267	\N	t
365	43	374353	2025-09-29 05:11:44.297	2025-09-29 05:01:44.298	\N	t
366	47	277783	2025-09-29 05:26:49.609	2025-09-29 05:16:49.609	\N	t
367	43	159982	2025-09-29 05:41:46.439	2025-09-29 05:31:46.44	\N	t
368	41	185978	2025-09-29 05:59:32.529	2025-09-29 05:49:32.531	\N	t
369	47	564629	2025-09-29 09:44:54.212	2025-09-29 09:34:54.213	\N	t
370	43	169310	2025-09-29 14:58:13.518	2025-09-29 14:48:13.519	\N	t
371	43	462291	2025-09-30 05:41:11.57	2025-09-30 05:31:11.571	\N	t
372	41	545958	2025-09-30 07:53:46.215	2025-09-30 07:43:46.216	\N	t
373	41	963158	2025-09-30 10:13:16.329	2025-09-30 10:03:16.33	\N	t
374	41	289573	2025-10-03 00:17:14.79	2025-10-03 00:07:14.792	\N	t
375	40	704383	2025-10-03 00:40:25.651	2025-10-03 00:30:25.652	\N	t
376	4	945720	2025-10-03 05:19:07.686	2025-10-03 05:09:07.688	\N	t
377	43	558675	2025-10-03 05:22:02.471	2025-10-03 05:12:02.472	\N	t
378	47	239020	2025-10-03 05:35:11.283	2025-10-03 05:25:11.284	\N	t
379	43	124080	2025-10-03 05:39:05.538	2025-10-03 05:29:05.539	\N	t
380	41	376469	2025-10-03 06:01:49.139	2025-10-03 05:51:49.141	\N	t
381	44	633767	2025-10-03 06:09:28.547	2025-10-03 05:59:28.548	\N	t
382	44	396358	2025-10-03 06:23:47.594	2025-10-03 06:13:47.595	\N	t
383	43	773621	2025-10-03 10:23:00.507	2025-10-03 10:13:00.509	\N	t
384	2	414565	2025-10-03 10:41:19.309	2025-10-03 10:31:19.31	\N	t
385	43	334866	2025-10-03 11:35:22.851	2025-10-03 11:25:22.852	\N	t
386	43	372362	2025-10-03 12:56:11.485	2025-10-03 12:46:11.486	\N	t
387	2	742515	2025-10-06 05:11:58.903	2025-10-06 05:01:58.905	\N	t
388	11	958924	2025-10-06 05:58:33.053	2025-10-06 05:48:33.053	\N	t
389	43	350473	2025-10-06 06:02:59.357	2025-10-06 05:52:59.358	\N	t
390	43	873263	2025-10-06 06:13:28.616	2025-10-06 06:03:28.617	\N	t
391	47	643732	2025-10-06 09:23:04.236	2025-10-06 09:13:04.237	\N	t
392	1	821089	2025-10-06 10:01:31.611	2025-10-06 09:51:31.612	\N	t
393	43	720493	2025-10-07 06:38:46.554	2025-10-07 06:28:46.556	\N	t
394	4	151001	2025-10-07 06:39:01.51	2025-10-07 06:29:01.511	\N	t
395	43	295991	2025-10-07 06:39:03.249	2025-10-07 06:29:03.25	\N	t
396	44	593268	2025-10-07 06:42:12.543	2025-10-07 06:32:12.545	\N	t
397	4	979496	2025-10-07 07:04:42.373	2025-10-07 06:54:42.374	\N	t
398	47	440742	2025-10-07 10:14:06.339	2025-10-07 10:04:06.34	\N	t
399	43	804487	2025-10-07 11:09:24.402	2025-10-07 10:59:24.403	\N	t
400	43	979950	2025-10-07 12:10:26.504	2025-10-07 12:00:26.505	\N	t
401	43	224654	2025-10-08 05:15:31.59	2025-10-08 05:05:31.591	\N	t
402	43	144973	2025-10-08 05:26:59.555	2025-10-08 05:16:59.559	\N	t
403	44	759596	2025-10-08 06:07:19.067	2025-10-08 05:57:19.068	\N	t
404	41	387940	2025-10-08 08:21:27.988	2025-10-08 08:11:27.989	\N	t
405	44	305434	2025-10-08 09:49:48.855	2025-10-08 09:39:48.856	\N	t
406	47	306799	2025-10-08 09:54:59.576	2025-10-08 09:44:59.577	\N	t
407	44	813449	2025-10-08 10:46:21.806	2025-10-08 10:36:21.807	\N	t
408	47	425635	2025-10-08 10:50:56.591	2025-10-08 10:40:56.592	\N	t
409	1	554537	2025-10-08 11:31:29.087	2025-10-08 11:21:29.088	\N	t
410	43	668674	2025-10-09 06:00:03.073	2025-10-09 05:50:03.075	\N	t
411	43	804189	2025-10-09 06:49:33.751	2025-10-09 06:39:33.753	\N	t
412	41	617599	2025-10-09 08:21:59.995	2025-10-09 08:11:59.996	\N	t
413	41	568261	2025-10-09 08:41:47.36	2025-10-09 08:31:47.361	\N	t
414	1	723553	2025-10-09 09:27:11.878	2025-10-09 09:17:11.879	\N	t
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."User" (id, mobile, name, email, "employeeCode", "createdAt", "updatedAt", status, "deviceId", locality, "defaultDepartment") FROM stdin;
27	9999999999	rfdvc	\N	HGFVCXZ	2025-08-14 07:00:25.308	2025-08-22 07:26:55.782	Active	\N	Kukatpally	FI
16	5645657575	sdvv	admiewecgregn@example.com	RDGDHQC	2025-08-13 09:04:26.494	2025-09-02 09:04:22.988	Active	\N	miyapurrr	\N
9	6304424151	shanmuk vinay	sv45@gmail.com	83	2025-08-12 12:15:52.243	2025-09-02 09:04:29.262	Active	\N	Kukatpally	FI
33	2465786787	ver	\N	ERQTHR	2025-08-19 05:55:16.834	2025-08-21 05:06:27.422	Active	\N	erqgre	\N
45	8464940779	raj kumar	raj@gmail.com	RAJ123	2025-09-01 06:40:16.259	2025-09-04 09:02:55.602	Active	92c553d5da14ed14	Kukatpally	\N
29	9912994742	happi	\N	00588	2025-08-18 06:06:01.816	2025-08-18 06:27:03.062	Inactive	\N	Kukatpally	\N
18	4565756750	test123	admin@beyondscale.techvjhv	RDGDHYUUY	2025-08-13 09:15:38.241	2025-08-13 12:34:08.709	Active	\N	swq	\N
6	9000782279	9000782279	kalpanareddyreddy0@gmail.com	0057	2025-08-12 11:33:02.833	2025-08-22 05:17:14.421	Active	\N	Kukatpally	FI
32	7665453677	q4tebawryn	wead@gmail.comqewgtbr	EQRHWYMYJ	2025-08-18 07:16:26.243	2025-08-18 07:16:26.243	Active	\N	bantgrsh	\N
1	8438208990	Jeevan	jeevan@beyondscale.tech	1012025	2025-08-12 10:35:32.209	2025-09-02 09:06:32.225	Active		Vijayawada	FI
28	4363475676	sgegrg	sv4665@gmail.com	VGER	2025-08-18 05:40:44.984	2025-08-18 08:12:10.561	Active	\N	Banjara Hills	\N
17	5645657565	weverg	\N	762E	2025-08-13 09:08:49.177	2025-09-01 05:25:42.752	Active	\N	miyapurrr	\N
34	5143654757	afff	\N	SDVGRQE	2025-08-19 06:36:05.001	2025-08-21 05:18:33.732	Active	\N	aef	\N
47	9900990099	i am fe	\N	4254	2025-09-04 11:14:13.26	2025-09-04 11:15:23.011	Active	e918f6a1cd220788	Banjara Hills	\N
38	9912994744	kalpana belure	\N	112233	2025-08-22 06:25:33.457	2025-08-22 09:53:16.781	Active	\N	Banjara Hills	FI
3	8919552507	Ruthika	ruthika@beyondscale.tech	FSHY1234456	2025-08-12 10:56:32.028	2025-09-01 05:26:46.491	Active	\N	Tenali	\N
37	9912994749	hgfhg	\N	ERGHUJ	2025-08-22 06:12:06.221	2025-08-22 06:12:06.221	Active	\N	erhj	\N
35	9848151976	rt	\N	E134T	2025-08-19 10:35:43.441	2025-09-02 10:00:32.097	Active	\N	wqg	\N
40	8985545588	JK	\N	79	2025-08-25 08:19:13.847	2025-09-18 09:48:43.218	Active	\N	Banjara Hills	FI
13	9604717458	Sunitha	\N	FSHY123	2025-08-12 12:54:18.268	2025-08-19 06:07:00.93	Inactive	22a8b727f5620fe6	Tenali	\N
36	9912994740	testing 123	kalpanabelure55f@gmail.com	0055FDSCXZ	2025-08-22 05:20:27.959	2025-08-22 09:18:17.847	Active	\N	Kukatpally	\N
19	4524645754	test123	\N	SCA	2025-08-13 11:00:46.577	2025-08-13 11:04:01.882	Active	\N	swq	\N
21	2353647657	efgsrg	\N	762	2025-08-13 11:19:47.659	2025-08-13 11:19:47.659	Active	\N	kondapur	\N
22	6304424157	weaf	aasfdmin@example.com	SDG	2025-08-13 11:20:33.497	2025-08-13 11:20:33.497	Active	\N	Tenali	\N
20	9376543902	John Doe	john233@example.com	EMP3111	2025-08-13 11:15:48.226	2025-08-13 11:36:41.989	Active	\N	\N	PD
26	9900333333	veeru	kuttireddy7053@gmail.com	0058H	2025-08-14 06:56:21.868	2025-08-14 08:01:48.795	Active	\N	Kukatpally	FI
24	9576567563	sggg	admin@example.comawf	762AWD	2025-08-13 11:42:08.728	2025-08-21 06:28:21.504	Active	\N	wfa	\N
23	6545646546	rt	\N	DGARSDH	2025-08-13 11:39:20.032	2025-08-21 06:28:33.092	Active	\N	Tenali	\N
46	5467754324	ram charan	rrr@gmail.com	100	2025-09-01 10:41:50.364	2025-09-01 10:42:23.064	Active	\N	Banjara Hills	\N
8	9000000001	Jeevan OPS	jbeyondscaleops@gmail.com	1022025	2025-08-12 11:55:44.113	2025-09-02 09:00:02.53	Active	\N	Vijayawada	PD
7	9490080005	dhana	kuttireddy705@gmail.com	0058	2025-08-12 11:34:53.762	2025-09-22 08:58:18.813	Active	92c553d5da14ed14	Kukatpally	\N
25	3434647567	dfdfh	\N	DHDH	2025-08-13 12:19:19.654	2025-08-21 06:28:44.557	Active	\N	kondapur	\N
31	3464573658	feeeeeee	sv45@gmail.comwe	FFFFFFFFFFFFFFF	2025-08-18 06:27:53.862	2025-08-21 06:53:02.95	Active	\N	wqef	\N
30	3534637784	FEEE	sv45@gmail.comee	235345324523ERR	2025-08-18 06:19:47.446	2025-08-21 06:53:50.757	Active	\N	sdv	\N
43	6304424150	Shanmuk	svv45@gmail.comc	836	2025-08-26 11:19:25.877	2025-09-25 04:28:13.454	Active	\N	Banjara Hills	PD
14	9908205471	sudarshan	kalpana11@gmail.com	YUHDJHE4RTYUIKU	2025-08-13 05:44:19.796	2025-09-02 10:07:08.66	Active	92c553d5da14ed14	Kukatpally	\N
15	1111111111	test	admiewgregn@example.com	RDGDH	2025-08-13 06:44:27.318	2025-08-26 08:35:34.276	Active	e918f6a1cd220788	vizag	FI
42	2222222222	sh	sh@ghvhgv.com	1052027	2025-08-26 09:02:02.825	2025-08-26 09:02:02.825	Active	\N	Hyderabad	\N
4	9912994741	kalpana belure	kalpanabelure55@gmail.com	0055	2025-08-12 11:28:13.506	2025-09-02 10:16:42.554	Active	\N	Kukatpally	FI
39	9912994743	field executive PD	\N	0066	2025-08-22 09:19:52.146	2025-08-29 06:51:39.601	Active	\N	Vijayawada	\N
5	9949006271	mohan	kalpanareddyreddy100@gmail.com	0056	2025-08-12 11:30:54.542	2025-08-26 10:31:15.412	Active	\N	Kukatpally	PD
10	7095895153	Aruna	aruna@gmail.com	FSHY12345	2025-08-12 12:37:42.725	2025-10-06 05:03:37.203	Active	\N	Tenali	FI
12	9866288711	Srinu	srinu@gmail.com	FSHY123455	2025-08-12 12:43:00.552	2025-10-06 05:03:58.1	Active	\N	Tenali	FI
44	1122334455	akhila reddy	y@gmail.com	1122334455	2025-08-29 06:23:25.953	2025-09-02 10:24:44.916	Active	92c553d5da14ed14	Kukatpally	FI
41	9000000011	Field I	\N	804444444444444	2025-08-25 08:35:56.537	2025-09-03 07:08:04.957	Active	56eca19920b29cf4	Hyderabad	FI
2	7989202606	Sai Pravallika	pravallikamullapudi31@gmail.com	FSHY1234	2025-08-12 10:47:08.979	2025-10-06 05:04:08.972	Active	\N	Hyderabad	FI
11	7989892901	Gopi	gopi@beyondscale.tech	125789479888888	2025-08-12 12:39:15.861	2025-10-06 05:48:37.735	Active	22a8b727f5620fe6	Tenali	\N
\.


--
-- Data for Name: Verification; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."Verification" (id, "loanId", type, "fieldExecutiveId", status, "applicantAddress", "verificationData", "pictureSource", "createdAt", "updatedAt", "addressType", path, "approvedStatus", "finalReportPath", "locationType", "verifierId", "businessName", "isPostponed", "postponedDate", "postponedReason", "currentOfficeName", department, "financialAnalysis", synopsis, "templateName") FROM stdin;
89	580	Business	44	Completed	madhapur	{"familyDetails": [{"age": "32", "name": "Mohan reddy", "relation": "Other", "mobileNumber": "919912994", "otherRelation": "Husband ", "employmentType": "Farmer/Agriculturist", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "suppliersCreditors": {"creditPeriod": "993366", "supplier1Name": "Padama", "supplier2Name": "Eshwaramma ", "supplier3Name": "Anuradha", "supplier1Phone": "+919912994741", "supplier2Phone": "+919912994741", "supplier3Phone": "+919912994741", "supplier1Review": "negative", "supplier2Review": "positive", "supplier3Review": "positive", "supplier1Location": "Namilemate ", "supplier2Location": "Shaikpet nala", "supplier3Location": "Madhapur", "cashChequeProportions": "Trffg", "numberOfFixedSuppliers": "200"}, "shareholdingDetails": {"shareholders": [{"name": "Mohan", "designation": "Testing", "shareholdingPercentage": "80", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "other", "functionalOfPartnerDirector": "Amma"}]}}	\N	2025-09-22 09:21:14.847	2025-09-22 10:01:09.14	Business	\N	\N	\N	\N	5	testing 	\N	\N	\N	\N	PD	\N	\N	\N
113	767	Business	44	Completed	suraj residency	{"timestamp": "2025-09-25T12:26:08.618Z", "sectionData": {"basicDetails": {"phoneNo": "9912994741", "noOfVisit": "3", "personMet": "other", "constitution": "other", "applicantName": "dhana reddy", "nameOfConcern": "dhana sree", "aboutApplicant": "Good ", "visitedAddress": "Shaikpet ", "nameOfPersonMet": "Happy ", "structureOfLoan": "other", "appointmentFixed": "yes", "initiatedAddress": "suraj residency", "coApplicantDetails": "Good co applicant ", "residentialDetails": "Owner of the house "}, "familyDetails": [{"age": "60", "name": "Narshimha ", "relation": "Father", "mobileNumber": "9949006271", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}]}, "assetDetails": {"assets": [{"address": "C vh", "mortgaged": "yes", "ownerName": "Gh", "marketValue": "88", "areaMeasured": "26", "purchaseCost": "88", "purchaseYear": "88"}], "status": "positive", "remarks": "Vbb", "vehicles": "Vbn", "otherIncome": "Vv", "observations": "Vbb", "siteCoordinates": "Ghh", "lifeInsuranceMediclaim": "Vvvb", "capitalInvestedBusiness": "Vbb", "liquidMoveableMonetaryItems": "Cvvvgg"}, "basicDetails": {"phoneNo": "9912994741", "noOfVisit": "3", "personMet": "other", "constitution": "other", "applicantName": "dhana reddy", "nameOfConcern": "dhana sree", "aboutApplicant": "Good ", "visitedAddress": "Shaikpet ", "nameOfPersonMet": "Happy ", "structureOfLoan": "other", "appointmentFixed": "yes", "initiatedAddress": "suraj residency", "coApplicantDetails": "Good co applicant ", "residentialDetails": "Owner of the house "}, "investigable": true, "existingLoans": {"loans": [{"emi": "55", "tenure": "556", "purpose": "Business development ", "bankName": " Indian ", "loanAmount": "39959856"}]}, "familyDetails": [{"age": "60", "name": "Narshimha ", "relation": "Father", "mobileNumber": "9949006271", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "salariesWages": {"remarks": "Ark", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "17:59", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "17:59", "wagesPerMonthPerDay": "400", "otherMajorExpenditure": "Fvv", "salaryPerMonthPerEmployee": "400"}, "clientsDebtors": {"turnover": "400", "customers": [{"name": "Magi", "phone": "9966332255", "review": "positive", "location": "Sha"}], "netMargins": "300", "creditPeriod": "400", "cashChequeProportions": "300", "numberOfFixedCustomers": "500", "averageStockMaintenance": "500"}, "thirdPartyCheck": {"checks": [{"tpcName": "Raj", "comments": "Cv b", "mobileNumber": "9632509966", "relationship": "Other", "otherRelation": "Son", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": " Vvbh"}, {"value": "Chhn"}, {"value": "Vbhbb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Mokshith ", "phone": "9490080005", "review": "positive", "location": "Sha"}], "creditPeriod": "400", "cashChequeProportions": "300", "numberOfFixedSuppliers": "500"}, "familyMemberDetails": [{"age": "60", "name": "Narshimha ", "relation": "Father", "mobileNumber": "9949006271", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}, {"age": "45", "name": "Vvv", "relation": "Son", "mobileNumber": "2353457433", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}], "shareholdingDetails": {"shareholders": [{"name": "Eshwaramma ", "designation": "House wife ", "shareholdingPercentage": "10", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "other", "functionalOfPartnerDirector": "Qa"}]}}	\N	2025-09-25 12:23:21.471	2025-09-26 10:06:17.594	Business	<ul><li>msjcbkj</li><li>kajsbfkaejbf</li><li>kjbsfkajb</li></ul>	Positive	\N	\N	5	dhana sree	\N	\N	\N	\N	PD	{"rent": 0, "sales": 0, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 0, "insurance": 0, "netProfit": 0, "bankCharges": 0, "grossProfit": 0, "closingStock": 0, "depreciation": 0, "openingStock": 0, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	<ul><li>mlakcnwekn</li><li>ljkcnqwcn</li><li>kajcb</li></ul>	\N
95	684	Business	44	Completed	kondapur	{"timestamp": "2025-09-24T06:42:22.414Z", "sectionData": {"timestamp": "2025-09-24T06:41:51.398Z", "sectionData": {"timestamp": "2025-09-24T06:10:40.936Z", "sectionData": {"timestamp": "2025-09-24T06:09:59.983Z", "sectionData": {"timestamp": "2025-09-24T06:03:20.903Z", "sectionData": {"timestamp": "2025-09-24T05:56:15.342Z", "sectionData": {"basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}]}, "basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "investigable": true, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "uploadedItems": [], "suppliersCreditors": {"suppliers": [{"name": "Raj", "phone": "99126633558888899669999", "review": "positive", "location": "Ggvbbb"}], "creditPeriod": "+919912994741", "cashChequeProportions": "Ttfgg", "numberOfFixedSuppliers": "+919912994741"}}, "assetDetails": {"assets": [{"address": "Amihh", "mortgaged": "yes", "ownerName": "F", "marketValue": "5", "areaMeasured": "5566", "purchaseCost": "55", "purchaseYear": "55"}, {"address": "Vvb", "mortgaged": "yes", "ownerName": "Ft", "marketValue": "555", "areaMeasured": "666", "purchaseCost": "55", "purchaseYear": "856"}], "status": "positive", "remarks": "Ghh", "vehicles": "Vvh", "otherIncome": "Vbh", "observations": "Vv", "siteCoordinates": "Vvh", "lifeInsuranceMediclaim": "Ghh", "capitalInvestedBusiness": "Ghh", "liquidMoveableMonetaryItems": "Vvb"}, "basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "investigable": true, "existingLoans": {"loans": [{"emi": "5566", "tenure": "235", "purpose": "Test", "bankName": "Indian", "loanAmount": "25633"}]}, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "2", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "25566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5"}, "uploadedItems": [], "clientsDebtors": {"turnover": "2", "netMargins": "5", "creditPeriod": "+919912994741", "customer1Name": "Hvvv", "customer2Name": "   Ghvv", "customer3Name": "  Bb", "customer1Phone": "8999", "customer2Phone": "3698", "customer3Phone": "999", "customer1Review": "negative", "customer2Review": "positive", "customer3Review": "negative", "customer1Location": "Vvv", "customer2Location": "Hbb", "customer3Location": "V", "cashChequeProportions": "Vvv", "numberOfFixedCustomers": "+919912994741", "averageStockMaintenance": "88"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vvv", "comments": " Vb", "mobileNumber": "3666", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Vbebebeb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raj", "phone": "99126633558888899669999", "review": "positive", "location": "Ggvbbb"}], "creditPeriod": "+919912994741", "cashChequeProportions": "Ttfgg", "numberOfFixedSuppliers": "+919912994741"}}, "assetDetails": {"assets": [{"address": "Amihh", "mortgaged": "yes", "ownerName": "F", "marketValue": "5", "areaMeasured": "5566", "purchaseCost": "55", "purchaseYear": "55"}, {"address": "Vvb", "mortgaged": "yes", "ownerName": "Ft", "marketValue": "555", "areaMeasured": "666", "purchaseCost": "55", "purchaseYear": "856"}], "status": "positive", "remarks": "Ghh", "vehicles": "Vvh", "otherIncome": "Vbh", "observations": "Vv", "siteCoordinates": "Vvh", "lifeInsuranceMediclaim": "Ghh", "capitalInvestedBusiness": "Ghh", "liquidMoveableMonetaryItems": "Vvb"}, "basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "investigable": true, "existingLoans": {"loans": [{"emi": "5566", "tenure": "235", "purpose": "Test", "bankName": "Indian", "loanAmount": "25633"}]}, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "2", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "25566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5"}, "uploadedItems": [], "clientsDebtors": {"turnover": "2", "netMargins": "5", "creditPeriod": "+919912994741", "customer1Name": "Hvvv", "customer2Name": "   Ghvv", "customer3Name": "  Bb", "customer1Phone": "8999", "customer2Phone": "3698", "customer3Phone": "999", "customer1Review": "negative", "customer2Review": "positive", "customer3Review": "negative", "customer1Location": "Vvv", "customer2Location": "Hbb", "customer3Location": "V", "cashChequeProportions": "Vvv", "numberOfFixedCustomers": "+919912994741", "averageStockMaintenance": "88"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vvv", "comments": " Vb", "mobileNumber": "3666", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Vbebebeb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raj", "phone": "99126633558888899669999", "review": "positive", "location": "Ggvbbb"}], "creditPeriod": "+919912994741", "cashChequeProportions": "Ttfgg", "numberOfFixedSuppliers": "+919912994741"}}, "assetDetails": {"assets": [{"address": "Amihh", "mortgaged": "yes", "ownerName": "F", "marketValue": "5", "areaMeasured": "5566", "purchaseCost": "55", "purchaseYear": "55"}, {"address": "Vvb", "mortgaged": "yes", "ownerName": "Ft", "marketValue": "555", "areaMeasured": "666", "purchaseCost": "55", "purchaseYear": "856"}], "status": "positive", "remarks": "Ghh", "vehicles": "Vvh", "otherIncome": "Vbh", "observations": "Vv", "siteCoordinates": "Vvh", "lifeInsuranceMediclaim": "Ghh", "capitalInvestedBusiness": "Ghh", "liquidMoveableMonetaryItems": "Vvb"}, "basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "investigable": true, "existingLoans": {"loans": [{"emi": "5566", "tenure": "235", "purpose": "Test", "bankName": "Indian", "loanAmount": "25633"}]}, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "2", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "25566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5"}, "uploadedItems": [], "clientsDebtors": {"turnover": "2", "netMargins": "5", "creditPeriod": "+919912994741", "customer1Name": "Hvvv", "customer2Name": "   Ghvv", "customer3Name": "  Bb", "customer1Phone": "8999", "customer2Phone": "3698", "customer3Phone": "999", "customer1Review": "negative", "customer2Review": "positive", "customer3Review": "negative", "customer1Location": "Vvv", "customer2Location": "Hbb", "customer3Location": "V", "cashChequeProportions": "Vvv", "numberOfFixedCustomers": "+919912994741", "averageStockMaintenance": "88"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vvv", "comments": " Vb", "mobileNumber": "3666", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Vbebebeb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raj", "phone": "99126633558888899669999", "review": "positive", "location": "Ggvbbb"}], "creditPeriod": "+919912994741", "cashChequeProportions": "Ttfgg", "numberOfFixedSuppliers": "+919912994741"}, "shareholdingDetails": {"shareholders": [{"name": "Gv", "designation": "Gg", "shareholdingPercentage": "22", "comingIntoLoanStructure": "no", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": " V"}]}}, "assetDetails": {"assets": [{"address": "Amihh", "mortgaged": "yes", "ownerName": "F", "marketValue": "5", "areaMeasured": "5566", "purchaseCost": "55", "purchaseYear": "55"}, {"address": "Vvb", "mortgaged": "yes", "ownerName": "Ft", "marketValue": "555", "areaMeasured": "666", "purchaseCost": "55", "purchaseYear": "856"}], "status": "positive", "remarks": "Ghh", "vehicles": "Vvh", "otherIncome": "Vbh", "observations": "Vv", "siteCoordinates": "Vvh", "lifeInsuranceMediclaim": "Ghh", "capitalInvestedBusiness": "Ghh", "liquidMoveableMonetaryItems": "Vvb"}, "basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "investigable": true, "existingLoans": {"loans": [{"emi": "5566", "tenure": "235", "purpose": "Test", "bankName": "Indian", "loanAmount": "25633"}]}, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "2", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "25566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5"}, "uploadedItems": [], "clientsDebtors": {"turnover": "2", "netMargins": "5", "creditPeriod": "+919912994741", "customer1Name": "Hvvv", "customer2Name": "   Ghvv", "customer3Name": "  Bb", "customer1Phone": "8999", "customer2Phone": "3698", "customer3Phone": "999", "customer1Review": "negative", "customer2Review": "positive", "customer3Review": "negative", "customer1Location": "Vvv", "customer2Location": "Hbb", "customer3Location": "V", "cashChequeProportions": "Vvv", "numberOfFixedCustomers": "+919912994741", "averageStockMaintenance": "88"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vvv", "comments": " Vb", "mobileNumber": "3666", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Vbebebeb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raj", "phone": "99126633558888899669999", "review": "positive", "location": "Ggvbbb"}], "creditPeriod": "+919912994741", "cashChequeProportions": "Ttfgg", "numberOfFixedSuppliers": "+919912994741"}, "shareholdingDetails": {"shareholders": [{"name": "Gv", "designation": "Gg", "shareholdingPercentage": "22", "comingIntoLoanStructure": "no", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": " V"}]}}, "assetDetails": {"assets": [{"address": "Amihh", "mortgaged": "yes", "ownerName": "F", "marketValue": "5", "areaMeasured": "5566", "purchaseCost": "55", "purchaseYear": "55"}, {"address": "Vvb", "mortgaged": "yes", "ownerName": "Ft", "marketValue": "555", "areaMeasured": "666", "purchaseCost": "55", "purchaseYear": "856"}], "status": "positive", "remarks": "Ghh", "vehicles": "Vvh", "otherIncome": "Vbh", "observations": "Vv", "siteCoordinates": "Vvh", "lifeInsuranceMediclaim": "Ghh", "capitalInvestedBusiness": "Ghh", "liquidMoveableMonetaryItems": "Vvb"}, "basicDetails": {"phoneNo": "", "applicantName": "KOWTHA VENKATASUBBA RAO", "nameOfConcern": "beyondscale", "initiatedAddress": "kondapur"}, "investigable": true, "existingLoans": {"loans": [{"emi": "5566", "tenure": "235", "purpose": "Test", "bankName": "Indian", "loanAmount": "25633"}]}, "familyDetails": [{"age": "34", "name": "Mohan", "relation": "Other", "mobileNumber": "9922336685", "otherRelation": "Husband ", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "2", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "25566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5"}, "uploadedItems": [], "clientsDebtors": {"turnover": "2", "netMargins": "5", "creditPeriod": "+919912994741", "customer1Name": "Hvvv", "customer2Name": "   Ghvv", "customer3Name": "  Bb", "customer1Phone": "8999", "customer2Phone": "3698", "customer3Phone": "999", "customer1Review": "negative", "customer2Review": "positive", "customer3Review": "negative", "customer1Location": "Vvv", "customer2Location": "Hbb", "customer3Location": "V", "cashChequeProportions": "Vvv", "numberOfFixedCustomers": "+919912994741", "averageStockMaintenance": "88"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vvv", "comments": " Vb", "mobileNumber": "3666", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Vbebebeb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raj", "phone": "99126633558888899669999", "review": "positive", "location": "Ggvbbb"}], "creditPeriod": "+919912994741", "cashChequeProportions": "Ttfgg", "numberOfFixedSuppliers": "+919912994741"}, "shareholdingDetails": {"shareholders": [{"name": "Gv", "designation": "Gg", "shareholdingPercentage": "22", "comingIntoLoanStructure": "no", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": " V"}]}}	\N	2025-09-24 05:48:57.475	2025-09-24 06:42:56.817	Business	\N	\N	\N	\N	5	beyondscale	\N	\N	\N	\N	PD	\N	\N	\N
101	722	Business	47	Pending	srdtjfy	\N	\N	2025-09-24 11:17:40.597	2025-09-24 11:17:40.597	\N	\N	\N	\N	\N	20	zdghf	\N	\N	\N	\N	PD	\N	\N	\N
41	52	Work	41	Pending	fatettw	\N	\N	2025-08-26 07:00:53.47	2025-08-26 07:00:53.47	\N	\N	\N	\N	\N	20	\N	\N	\N	\N	hkkbkbkbh	FI	\N	\N	\N
107	747	Business	47	Completed	df	{"assetDetails": {"assets": [{"address": "Machine1", "mortgaged": "yes", "ownerName": "Ramma", "marketValue": "763", "areaMeasured": "25000", "purchaseCost": "150", "purchaseYear": "2000"}, {"address": "Kondapur", "mortgaged": "yes", "ownerName": "Lingaa", "marketValue": "25", "areaMeasured": "2005", "purchaseCost": "19", "purchaseYear": "1980"}], "status": "positive", "remarks": "Good", "vehicles": "Avenger", "otherIncome": "Good", "observations": "Good ", "siteCoordinates": "1899-678", "lifeInsuranceMediclaim": "Lic", "capitalInvestedBusiness": "Chicken business ", "liquidMoveableMonetaryItems": "Liquid "}, "basicDetails": {"phoneNo": "3245678345", "noOfVisit": "2", "personMet": "partner", "constitution": "partnership", "applicantName": "fdzfg", "nameOfConcern": "sdf", "aboutApplicant": "Good", "visitedAddress": "Hills", "nameOfPersonMet": "Ramana", "structureOfLoan": "cash_credit", "appointmentFixed": "yes", "initiatedAddress": "df", "coApplicantDetails": "Hsh", "residentialDetails": "Vish"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "5", "purpose": "Perosnal", "bankName": "Azis", "loanAmount": "15"}]}, "familyDetails": [{"age": "56", "name": "Rama", "relation": "Father", "mobileNumber": "6565656566", "otherRelation": "", "employmentType": "Farmer/Agriculturist", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}, {"age": "45", "name": "Pad", "relation": "Mother", "mobileNumber": "6434353353", "otherRelation": "", "employmentType": "Unemployed", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}], "salariesWages": {"remarks": "Good", "statusOfLabour": "permanent", "numberOfLabours": "35", "workingHoursEnd": "13:07", "statusOfEmployee": "permanent", "numberOfEmployees": "200", "workingHoursStart": "09:07", "wagesPerMonthPerDay": "200", "otherMajorExpenditure": "No", "salaryPerMonthPerEmployee": "300088"}, "clientsDebtors": {"turnover": "25", "netMargins": "25", "creditPeriod": "6", "customer1Name": "Ramamaa", "customer2Name": "Ghh", "customer3Name": "", "customer1Phone": "66000088", "customer2Phone": "66665686666", "customer3Phone": "", "customer1Review": "positive", "customer2Review": "positive", "customer3Review": "", "customer1Location": "Hills", "customer2Location": "Jubli", "customer3Location": "", "cashChequeProportions": "6", "numberOfFixedCustomers": "6", "averageStockMaintenance": "25"}, "thirdPartyCheck": {"checks": [{"tpcName": "Tyu", "comments": "Good", "mobileNumber": "6465626626", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}, {"tpcName": "Friends 2", "comments": "Avg", "mobileNumber": "6364665335", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Neutral"}]}, "additionalDetails": {"details": [{"value": "Can can"}, {"value": "Good good"}, {"value": "Fine fine"}]}, "suppliersCreditors": {"suppliers": [{"name": "Qwe", "phone": "3465666565", "review": "positive", "location": "Hdhdh"}, {"name": "Hdhj", "phone": "656566656", "review": "positive", "location": "Hdh"}, {"name": "Tuui", "phone": "65666566566", "review": "positive", "location": "Hdhdh"}], "creditPeriod": "60", "cashChequeProportions": "11/20", "numberOfFixedSuppliers": "25"}, "shareholdingDetails": {"shareholders": [{"name": "Qwe", "designation": "Gm", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Paterner"}, {"name": "Rammm", "designation": "Manager", "shareholdingPercentage": "60", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Director"}]}}	\N	2025-09-25 07:30:51.412	2025-09-25 07:40:50.647	Business	\N	\N	\N	\N	20	sdf	\N	\N	\N	\N	PD	\N	\N	\N
119	765	Business	47	Pending	suraj residency	\N	\N	2025-09-26 11:16:46.709	2025-09-26 11:16:46.709	\N	\N	\N	\N	\N	12	dsg	\N	\N	\N	\N	PD	\N	\N	\N
24	10	AddressOne	41	Completed	test	{"basicDetails": {"aadhar": "2345-6789-1234", "category": "Personal", "panNumber": "ABCDE5678F", "applicantName": "mohan reddy", "categoryOther": "", "verificationType": "Residence Verification", "applicationNumber": "mohan1100", "availablePersonName": "mohan reddy", "isApplicantAvailable": "Yes", "availablePersonMobile": "9912994741", "applicantMaritalStatus": "Married", "educationQualification": "Graduate", "availablePersonRelation": "Self", "applicantMaritalStatusOther": "", "availablePersonRelationOther": ""}, "uploadedItems": [{"id": "img001", "uri": "file://localpath/residence_front.jpg", "type": "ResidenceFront", "pincode": "500072", "isCamera": "Yes", "latitude": "17.4126", "locality": "Kukatpally", "longitude": "78.4500", "timestamp": "2025-08-26T10:30:00Z", "s3ImageUrl": "https://s3.amazonaws.com/bucket/mohan/residence_front.jpg", "isOverlayNeeded": "Yes"}, {"id": "img002", "uri": "file://localpath/address_proof.jpg", "type": "AddressProof", "pincode": "500072", "isCamera": "Yes", "latitude": "17.4126", "locality": "Kukatpally", "longitude": "78.4500", "timestamp": "2025-08-26T10:40:00Z", "s3ImageUrl": "https://s3.amazonaws.com/bucket/mohan/address_proof.jpg", "isOverlayNeeded": "No"}], "thirdPartyCheck": {"checks": [{"tpcName": "Ramesh", "comments": "Family has been living here for more than 4 years, no issues reported.", "mobileNumber": "9876543210", "relationship": "Neighbor", "feedbackStatus": "Positive"}, {"tpcName": "Suresh", "comments": "Known the applicant for years, good character.", "mobileNumber": "9876500000", "relationship": "Shop Owner Nearby", "feedbackStatus": "Positive"}]}, "residenceDetails": {"houseArea": "900 sq ft", "leaseAmount": "₹50,000", "rentDetails": "₹10,000/month", "accessibility": "Easily accessible by 2-wheeler and 4-wheeler", "residenceType": "Apartment", "residenceStatus": "Rented", "standardOfLiving": "Above Average", "specifyResidenceType": "", "yearsAtCurrentAddress": "4 years", "politicalSymbolVisible": "No"}, "addressVerification": {"geoTag": "17.4126,78.4500", "address": "Flat No. 202, Green Residency, Kukatpally, Hyderabad, Telangana", "addressProof": "Electricity Bill", "previousCity": "Warangal", "addressDetails": "Current residence is a 2BHK flat in a gated community", "addressCategory": "Urban", "addressMismatch": "No", "previousAddress": "House No. 45, XYZ Colony, Warangal", "reasonForChange": "Job relocation", "previousAddressYears": "5", "addressCorrectionDetails": "", "numberOfYearsAtCurrentCity": "6", "numberOfYearsAtPreviousCity": "5", "numberOfYearsAtCurrentResidence": "4"}, "familyMemberDetails": [{"age": "32", "name": "mohan reddy", "relation": "Self", "mobileNumber": "9912994741", "otherRelation": "", "employmentType": "Private Job", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}, {"age": "30", "name": "Lakshmi", "relation": "Spouse", "mobileNumber": "9912000000", "otherRelation": "", "employmentType": "Homemaker", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}, {"age": "8", "name": "Rohit", "relation": "Son", "mobileNumber": "", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "Yes", "educationalQualification": "Primary School"}], "familyEmploymentDetails": {"dependents": "2", "assetsObserved": "TV, Refrigerator, Bike, Laptop", "earningMembers": "1", "isSpouseWorking": "No", "totalFamilyMembers": "4", "spouseEmploymentDetails": ""}}	\N	2025-08-21 07:03:43.687	2025-08-26 10:30:11.382	PermanentAddress	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	FI	\N	\N	\N
83	198	Business	44	Completed	DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526\n	{"basicDetails": {"address": "DO NO : 3 11, RAMALAYAM VEEDHI , GAVARAMPETA, VIZIANAGARAM DISTRICT, , Gavarampeta , Vizianagaram , Andhra Pradesh , 535526\\n", "bankName": "TATA CAPITAL LIMITED", "loanAmount": "2500000", "businessName": "SAI KUMAR POULTRY FARM\\n", "mobileNumber": "9912994741", "applicantName": "Mokshit kumar", "applicationNumber": "11oo11"}, "existingLoans": {"loans": [{"emi": "4450", "tenure": "5", "purpose": "Business development ", "bankName": "Indian bank", "loanAmount": "200000"}]}, "uploadedItems": [{"id": "1757916636301fmxyb6kwx7", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/bf95ca47-483f-4ac1-b05a-71809a2dd399.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.464195, "locality": "Hyderabad", "longitude": 78.3678496, "timestamp": "2025-09-15T06:10:36.301Z", "s3ImageUrl": "verification/undefined/1757916635507-7ec13i.jpg", "isOverlayNeeded": true}], "businessDetails": {"netMargin": "25000", "businessType": "test type ", "occupiedSince": "20", "stockObserved": "10000", "natureOfBusiness": "Manufacturer", "businessStartYear": "2010", "employeesDeclared": "213", "employeesObserved": "31208", "rawMaterialSupplier": "Plastic ", "businessPremisesSize": "500-1000 sq.ft", "constitutionOfBusiness": "Trust", "businessActivityObserved": "Retail"}, "thirdPartyCheck": {"checks": [{"tpcName": "Test", "comments": "Test", "mobileNumber": "9912994741", "relationship": "Other", "otherRelation": "Husband ", "feedbackStatus": "Positive"}]}, "applicantDetails": {"assets": "Bike,car, auto , cycle ", "purchase": "5500000", "houseSize": "500-1000 sq.ft", "personMet": "Others", "incomeDetails": "Test20000", "maritalStatus": "Married", "purposeOfLoan": "200000tt", "workExperience": "rfcrfv", "nameOfCoApplicant": "Mohan ", "relationshipDuration": "More than 10 years", "educationalQualification": "Others", "currentResidentialAddress": "Madhapur "}, "additionalDetails": {"details": [{"value": "Amount payed by phonepay"}]}, "familyMemberDetails": [{"age": "25", "name": "Happi", "relation": "Other", "mobileNumber": "9912994741", "otherRelation": "+919912994741", "employmentType": "Unemployed", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}, {"age": "56567", "name": "tfcv ", "relation": "Mother", "mobileNumber": "7867656566", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}]}	\N	2025-09-15 05:46:21.292	2025-09-15 10:02:12.671	Business	<ul><li>good</li></ul>	Positive	\N	\N	5	SAI KUMAR POULTRY FARM\n	\N	\N	\N	\N	PD	{"rent": 0, "sales": 0, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 0, "insurance": 0, "netProfit": 0, "bankCharges": 0, "grossProfit": 0, "closingStock": 0, "depreciation": 0, "openingStock": 0, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	good	\N
145	880	Business	47	Pending	asdf	{"netWorth": {"netWorth": [{"ownerName": "Rajh", "typeOfProperty": "Lic fc", "yearsOfOwnership": "Solo", "approxMarketValue": "250009"}, {"ownerName": "Rahh2", "typeOfProperty": "Lic fc2", "yearsOfOwnership": "2050", "approxMarketValue": "293939"}]}, "caseDetails": {"contactNo": "676866895", "personMet": "Person", "coApplicant": "Co", "dateOfVisit": "11-12-2025", "addressVisited": "Address", "meetingDetails": "Meetung", "typeOfBorrower": "Type", "nameOfApplicant": "Name", "referenceNumber": "Losid"}, "particulars": {"coordinates": "24_6828&6662_672"}, "basicDetails": {"phoneNo": "4567987867", "applicantName": "test8", "nameOfConcern": "sdfgfds", "initiatedAddress": "asdf"}, "loansDetails": {"loansDetails": [{"os": "5", "emi": "5", "product": "Prod1", "remarks": "Good", "loanAmount": "636367", "nameOfBankInstitution": "Acis"}, {"os": "66", "emi": "6", "product": "Peod2", "remarks": "Rema", "loanAmount": "20000", "nameOfBankInstitution": "Aciidi"}]}, "familyDetails": {"aboutApplicant": "About app", "aboutCoApplicant": "About co", "andTheirFamilyDetails": "Ab fam"}, "outputsSupply": {"creditTerms": "Cred ter", "marketForOutput": "Mar", "modeOfMarketing": "Mode", "typeOfCustomers": "Ty cust", "stockOfFinishedGoods": "Stoc finish good"}, "businessDetails": {"margins": "Mar", "gstNumber": "73737388", "legalName": "Le name", "tradeName": "Td name", "shopAddress": "Hydd kond", "businessName": "Bus name", "typeOfEntity": "Typ en", "establishment": "Hydd", "godownAddress": "God add", "lastGSTReturn": "25000", "shopOwnership": "Owned", "productDetails": "Prod de", "businessProcess": "Bus pro", "godownOwnership": "Rented", "activityObserved": "Ac ob", "natureOfBusiness": "Nat", "documentsObserved": "Obse"}, "employeeDetails": {"pfEsiApplied": "Yes pf", "noOfEmployees": "25", "salaryDetails": "Sal deta"}, "inputsPurchases": {"orderCycle": "Ord cyc", "creditTerms": "25", "avgOrderQnty": "25", "otherRemarks": "Othe rem", "detailsOfInputs": "Deti", "purchaseDetails": "Pur"}, "tradeReferences": {"customers": [{"contactDetails": "737373773", "nameOfCustomer": "Vust2"}, {"contactDetails": "73773737", "nameOfCustomer": "Vust2"}], "suppliers": [{"contactDetails": "Cont1", "nameOfSuppliers": "Supp 1"}, {"contactDetails": "Cont2-7838", "nameOfSuppliers": "Sup2"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "Age1", "name": "Name1", "remarks": "Rem", "relation": "Rel", "occupation": "Icc", "qualification": "Qua"}, {"age": "Age", "name": "Name2", "remarks": "Hshe", "relation": "Rel2", "occupation": "Occ2", "qualification": "Qu2"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Secert", "sourceOfIncome": "Other in"}, {"details": "Secerey2", "sourceOfIncome": "Other in2"}]}, "applicantsMainBankingDetails": {"endUse": "20205", "remarks": "Remarks again", "bankName": "Acis", "noOfYear": "25", "accountType": "Acc type", "limitOfCCOD": "Limit cc", "particulars": "Partuc", "ownContribution": "Yes own cont", "accountHolderName": "Rajj", "remarksAdditional": "Remarks3"}}	\N	2025-10-06 09:57:53.017	2025-10-06 09:57:53.017	Business	\N	\N	\N	\N	20	sdfgfds	f	\N	\N	\N	PD	\N	\N	\N
85	584	Business	44	Completed	kondapur	{}	\N	2025-09-22 08:59:30.465	2025-09-22 09:03:12.892	Business	\N	\N	\N	\N	5	beyondscale.tech	\N	\N	\N	\N	PD	\N	\N	\N
125	811	Business	44	Completed	madhapur	{"timestamp": "2025-09-29T05:20:14.619Z", "sectionData": {"assetDetails": {"assets": [{"address": "Namilemate ", "mortgaged": "yes", "ownerName": "Narshimha ", "marketValue": "200", "areaMeasured": "2000", "purchaseCost": "150", "purchaseYear": "2019"}], "status": "positive", "remarks": "", "vehicles": "", "otherIncome": "", "observations": "", "siteCoordinates": "", "lifeInsuranceMediclaim": "", "capitalInvestedBusiness": "", "liquidMoveableMonetaryItems": ""}, "basicDetails": {"phoneNo": "9912994741", "applicantName": "kalpana", "nameOfConcern": "dhana sree", "initiatedAddress": "madhapur"}, "existingLoans": {"loans": [{"emi": "65000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian ", "loanAmount": "10000000"}]}, "familyDetails": [{"age": "62", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law ", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "", "wagesPerMonthPerDay": "25000", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "35000"}, "bankingDetails": {"bankAccounts": [{"bankName": "Axis ", "openSince": "2019", "branchName": "Madhapur ", "accountType": "Saving ", "endUseOfLoan": "2024"}]}, "clientsDebtors": {"turnover": "1000", "customers": [{"name": "Happy ", "phone": "9949006271", "review": "positive", "location": "Shaikpet "}], "netMargins": "150", "creditPeriod": "7", "cashChequeProportions": "100000", "numberOfFixedCustomers": "500", "averageStockMaintenance": "500"}, "thirdPartyCheck": {"checks": [{"tpcName": "Maggi", "comments": "Good ", "mobileNumber": "9490080005", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Good "}, {"value": "Bad"}, {"value": "Very good "}, {"value": "Avarage "}]}, "documentsObserved": {"documents": [{"remarks": "Good ", "documentName": "Mohan ", "documentType": "Aadhar passport driving licence voter id", "documentCategory": "Identity proof "}]}, "suppliersCreditors": {"suppliers": [{"name": "Dhana ", "phone": "9000782279", "review": "positive", "location": "Madhapur "}], "creditPeriod": "30", "cashChequeProportions": "60000", "numberOfFixedSuppliers": "100000"}, "shareholdingDetails": {"shareholders": [{"name": "Padma ", "designation": "House wife ", "shareholdingPercentage": "10", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Testing "}], "aboutTheBusiness": "Wholesale "}}, "assetDetails": {"assets": [{"address": "Namilemate ", "mortgaged": "yes", "ownerName": "Narshimha ", "marketValue": "200", "areaMeasured": "2000", "purchaseCost": "150", "purchaseYear": "2019"}], "status": "positive", "remarks": "", "vehicles": "", "otherIncome": "", "observations": "", "siteCoordinates": "", "lifeInsuranceMediclaim": "", "capitalInvestedBusiness": "", "liquidMoveableMonetaryItems": ""}, "basicDetails": {"phoneNo": "9912994741", "noOfVisit": "3", "personMet": "other", "constitution": "partnership", "applicantName": "kalpana", "nameOfConcern": "dhana sree", "aboutApplicant": "Good ", "visitedAddress": "Kondapur ", "nameOfPersonMet": "Family ", "structureOfLoan": "cash_credit", "appointmentFixed": "yes", "initiatedAddress": "madhapur", "coApplicantDetails": "", "residentialDetails": "Owner of the house "}, "investigable": true, "existingLoans": {"loans": [{"emi": "65000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian ", "loanAmount": "10000000"}]}, "familyDetails": [{"age": "62", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law ", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "", "wagesPerMonthPerDay": "25000", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "35000"}, "uploadedItems": [{"id": "1759123214261xxhfhw8b98n", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/300b38a2-ca3a-476d-b011-da977e1a04db.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.4642752, "locality": "Hyderabad", "longitude": 78.3679465, "timestamp": "2025-09-29T05:20:14.261Z", "s3ImageUrl": "verification/125/1759123213348-iph8un.jpg", "isOverlayNeeded": true}], "bankingDetails": {"bankAccounts": [{"bankName": "Axis ", "openSince": "2019", "branchName": "Madhapur ", "accountType": "Saving ", "endUseOfLoan": "2024"}]}, "clientsDebtors": {"turnover": "1000", "customers": [{"name": "Happy ", "phone": "9949006271", "review": "positive", "location": "Shaikpet "}], "netMargins": "150", "creditPeriod": "7", "cashChequeProportions": "100000", "numberOfFixedCustomers": "500", "averageStockMaintenance": "500"}, "thirdPartyCheck": {"checks": [{"tpcName": "Maggi", "comments": "Good ", "mobileNumber": "9490080005", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Good "}, {"value": "Bad"}, {"value": "Very good "}, {"value": "Avarage "}]}, "documentsObserved": {"documents": [{"remarks": "Good ", "documentName": "Mohan ", "documentType": "Aadhar passport driving licence voter id", "documentCategory": "Identity proof "}]}, "suppliersCreditors": {"suppliers": [{"name": "Dhana ", "phone": "9000782279", "review": "positive", "location": "Madhapur "}], "creditPeriod": "30", "cashChequeProportions": "60000", "numberOfFixedSuppliers": "100000"}, "shareholdingDetails": {"shareholders": [{"name": "Padma ", "designation": "House wife ", "shareholdingPercentage": "10", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Testing "}], "aboutTheBusiness": "Wholesale "}}	\N	2025-09-29 05:02:47.641	2025-09-29 05:22:11.1	Business	\N	\N	\N	\N	5	dhana sree	\N	\N	\N	\N	PD	\N	\N	\N
167	910	Business	44	Pending	tyuiop	\N	\N	2025-10-09 06:36:52.854	2025-10-09 06:36:52.854	\N	\N	\N	\N	\N	5	dfrtyuio	\N	\N	\N	\N	PD	\N	\N	\N
46	65	AddressTwo	7	Pending	shaikpet nala	\N	\N	2025-08-29 06:35:36.988	2025-08-29 06:35:36.988	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
47	65	Work	7	Pending	kondapur	\N	\N	2025-08-29 06:36:19.738	2025-08-29 06:36:19.738	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	beyondscale 	FI	\N	\N	\N
45	65	AddressOne	41	Pending	madhapur image garden testing 	\N	\N	2025-08-29 06:35:11.687	2025-08-29 12:21:15.105	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
158	900	Business	44	Pending	hjghbjy	\N	\N	2025-10-07 11:44:30.794	2025-10-07 11:44:30.794	\N	\N	\N	\N	\N	5	ghv c	\N	\N	\N	\N	PD	\N	\N	\N
164	216	Business	41	Pending	DOOR NO SHOP NO 2 , KG ROAD , NANDIKOTKUR , KURNOOL , Andhra Pradesh , 518401	\N	\N	2025-10-08 10:16:43.792	2025-10-08 10:16:43.792	\N	\N	\N	\N	\N	20	Medical Store	\N	\N	\N	\N	PD	\N	\N	\N
131	836	Business	47	Completed	wrqegerht	{"bankDetails": {"avgBalance": "500000", "primaryBanker": "Bankerr", "natureOfAccount": "Saving"}, "basicDetails": {"phoneNo": "5346565653", "applicantName": "test5", "nameOfConcern": "1r32t4w", "initiatedAddress": "wrqegerht"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "6", "purpose": "Hhdjj", "bankName": "Bank 1", "loanAmount": "25000", "outstandingBalance": "25000"}, {"emi": "6", "tenure": "2", "purpose": "Purpose 2", "bankName": "Axiss2", "loanAmount": "350000", "outstandingBalance": "25000"}]}, "familyDetails": [{"age": "45", "name": "Ramamma", "relation": "Mother", "mobileNumber": "3465698986", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "officeAddress": {"address": "Adddress123", "ownedBy": "1980", "areaInSqFt": "19808", "cmvRentPerMonth": "654", "occupiedSinceYears": "1980", "ownershipOfPremises": "rented"}, "businessDetails": {"stockAsOnDate": "11-20-2026", "currentBusinessDetails": "Current business detilas"}, "employeeDetails": {"salaryRange": "25000", "keyEmployeeName": "Ram", "currentEmployees": "25"}, "supplierDetails": {"suppliers": [{"creditorDays": "63", "supplierName": "Supp1", "percentageOfTotalSales": "23", "relationshipSinceYears": "6"}, {"creditorDays": "39", "supplierName": "Supp2", "percentageOfTotalSales": "39", "relationshipSinceYears": "5"}], "totalSuppliers": "36", "totalCreditorsAsOnDate": "25"}, "thirdPartyCheck": {"checks": [{"tpcName": "Hood", "comments": "Good better", "mobileNumber": "2558064664", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "customersDetails": {"customers": [{"debtorDays": "5", "customerName": "Cust1", "percentageOfTotalSales": "25", "relationshipSinceYears": "5"}, {"debtorDays": "30", "customerName": "Cust2", "percentageOfTotalSales": "28", "relationshipSinceYears": "6"}], "totalCustomers": "6", "totalDebtorsAsOnDate": "5"}, "siteVisitDetails": {"landmark": "Opposte to pvr", "neighborhood": "Neighbour ", "stockSeenDuringPD": "yes", "nameplateDisplayed": "yes", "officeWellFurnished": "yes", "businessActivitySeen": "yes", "anyDecreaseInNetworth": "yes", "noOfCustomersSeenDuringPD": "500", "noOfEmployeesSeenDuringPD": "5008", "difficultyInLocatingPremises": "no", "abnormalIncreaseDecreaseInTurnover": "2000 incresse"}, "additionalDetails": {"details": [{"value": "Gdty"}, {"value": "Ghj"}]}, "documentsObserved": {"documents": [{"remarks": "Good", "documentName": "Name1", "documentType": "Type2", "documentCategory": "Cat1"}]}, "valueAddedDetails": {"strengths": "Hardwork,passion", "lossReason": "Loss", "weaknesses": "Weakness,health", "customerBehaviour": "Good", "digitalWalletUsed": "yes", "nearbyTransportStand": "Bustop near me", "lossSufferedInBusiness": "yes", "salariesPaidDuringCovid": "yes", "natureOfNeighborhoodShops": "Pan", "customerShopOfficeLocality": "market_road", "utilityBillUnitsConsumption": "yes"}, "residentialAddress": {"address": "Address2", "ownedBy": "Ramm", "personMet": "Mother", "areaInSqFt": "132564", "addressOfPD": "Pd adresss", "cmvRentPerMonth": "2566", "occupiedSinceValues": "1986", "ownershipOfPremises": "rented"}, "proposedLoanDetails": {"type": "Type SA", "accNo": "646569499", "tenure": "5", "product": "My prod", "repaymentFrom": "11-20-2222"}, "miscelleanousDetails": {"anyCourtCases": "No cort cases", "endUseOfProposedLoan": "End use ", "politicalConnections": "Yes mla", "businessBelongsToWhichIndustry": "Usa"}, "salesAndProfitDetails": {"profitMargin": "2500", "netMonthlyIncome": "56999", "cashSalesPercentage": "25", "monthlyTurnoverSales": "50000", "covidEffectOnTurnover": "yes", "turnoverPrevFiscalYear": "5000000", "expectedTurnoverCurrentFiscalYear": "5000", "businessRunningSameSpeedAfterLockdown": "yes"}, "additionalBusinessDetails": {"assets": "Assteee1", "liabilities": "Libalities", "otherBusinessIncomeDetails": "Other business "}}	\N	2025-09-29 11:39:55.873	2025-09-29 12:47:06.395	Business	\N	\N	\N	\N	20	1r32t4w	\N	\N	\N	\N	PD	\N	\N	\N
19	10	AddressTwo	30	Pending	tfghj	\N	\N	2025-08-21 06:09:41.246	2025-08-21 06:09:41.246	\N	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	FI	\N	\N	\N
56	74	Business	14	Pending	534er	\N	\N	2025-09-01 05:02:25.664	2025-09-02 10:08:45.052	\N	\N	\N	\N	\N	38	45r	\N	\N	\N	\N	FI	\N	\N	\N
40	52	AddressOne	41	Pending	fhd	\N	\N	2025-08-26 06:58:08.689	2025-09-03 06:52:41.856	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
90	206	Business	41	Completed	Hyderabad, Telangana	{"timestamp": "2025-09-24T11:23:52.705Z", "sectionData": {"timestamp": "2025-09-24T09:51:05.288Z", "sectionData": {"timestamp": "2025-09-23T12:18:55.098Z", "sectionData": {"timestamp": "2025-09-23T11:06:22.616Z", "sectionData": {"timestamp": "2025-09-23T10:54:43.503Z", "sectionData": {"timestamp": "2025-09-23T10:48:49.799Z", "sectionData": {"timestamp": "2025-09-23T10:47:30.492Z", "sectionData": {"basicDetails": {"phoneNo": "8899009988", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "initiatedAddress": "Hyderabad, Telangana"}}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "64949", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Ushsbs", "visitedAddress": "Jsbsbs", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Ysgsvs", "residentialDetails": "Ysgsg"}, "investigable": true, "uploadedItems": []}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "64949", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Ushsbs", "visitedAddress": "Jsbsbs", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Ysgsvs", "residentialDetails": "Ysgsg"}, "investigable": true, "uploadedItems": []}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "64949", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Ushsbs", "visitedAddress": "Jsbsbs", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Ysgsvs", "residentialDetails": "Ysgsg"}, "investigable": true, "familyDetails": [{"age": "5454", "name": "Yegwhw", "relation": "Spouse", "mobileNumber": "6464648484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}], "uploadedItems": []}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "64949", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Ushsbs", "visitedAddress": "Jsbsbs", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Ysgsvs", "residentialDetails": "Ysgsg"}, "investigable": true, "familyDetails": [{"age": "5454", "name": "Yegwhw", "relation": "Spouse", "mobileNumber": "6464648484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Jshsbs", "statusOfLabour": "permanent", "numberOfLabours": "5484", "workingHoursEnd": "15:47", "statusOfEmployee": "permanent", "numberOfEmployees": "24", "workingHoursStart": "13:47", "wagesPerMonthPerDay": "67848", "otherMajorExpenditure": "Ishsgsb", "salaryPerMonthPerEmployee": "28000"}, "uploadedItems": [], "suppliersCreditors": {"suppliers": [{"name": "Ysgava", "phone": "1234567890", "review": "positive", "location": "Ywgwvw"}], "creditPeriod": "24", "supplier1Review": "", "supplier2Review": "", "supplier3Review": "", "cashChequeProportions": "12/20", "numberOfFixedSuppliers": "20"}, "shareholdingDetails": {"shareholders": [{"name": "Hsbssv", "designation": "Usbsb", "shareholdingPercentage": "80", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Hsbsvs"}]}}, "assetDetails": {"assets": [{"address": "Usgava", "mortgaged": "yes", "ownerName": "Yavabab", "marketValue": "5484040", "areaMeasured": "248404", "purchaseCost": "24548", "purchaseYear": "64848"}], "status": "positive", "remarks": "Yagavavw a", "vehicles": "Usgavsv", "otherIncome": "Jsvsvsvsbs", "observations": "Yagavavw", "siteCoordinates": "Hsvsvs sbs", "lifeInsuranceMediclaim": "Usgavavw", "capitalInvestedBusiness": "Sushwvwv", "liquidMoveableMonetaryItems": "Sushwvwv"}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "64949", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Ushsbs", "visitedAddress": "Jsbsbs", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Ysgsvs", "residentialDetails": "Ysgsg"}, "investigable": true, "familyDetails": [{"age": "5454", "name": "Yegwhw", "relation": "Spouse", "mobileNumber": "6464648484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Jshsbs", "statusOfLabour": "permanent", "numberOfLabours": "5484", "workingHoursEnd": "15:47", "statusOfEmployee": "permanent", "numberOfEmployees": "24", "workingHoursStart": "13:47", "wagesPerMonthPerDay": "67848", "otherMajorExpenditure": "Ishsgsb", "salaryPerMonthPerEmployee": "28000"}, "uploadedItems": [], "suppliersCreditors": {"suppliers": [{"name": "Ysgava", "phone": "1234567890", "review": "positive", "location": "Ywgwvw"}], "creditPeriod": "24", "supplier1Review": "", "supplier2Review": "", "supplier3Review": "", "cashChequeProportions": "12/20", "numberOfFixedSuppliers": "20"}, "shareholdingDetails": {"shareholders": [{"name": "Hsbssv", "designation": "Usbsb", "shareholdingPercentage": "80", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Hsbsvs"}]}}, "assetDetails": {"assets": [{"address": "Usgava", "mortgaged": "yes", "ownerName": "Yavabab", "marketValue": "5484040", "areaMeasured": "248404", "purchaseCost": "24548", "purchaseYear": "64848"}], "status": "positive", "remarks": "Yagavavw a", "vehicles": "Usgavsv", "otherIncome": "Jsvsvsvsbs", "observations": "Yagavavw", "siteCoordinates": "Hsvsvs sbs", "lifeInsuranceMediclaim": "Usgavavw", "capitalInvestedBusiness": "Sushwvwv", "liquidMoveableMonetaryItems": "Sushwvwv"}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "64949", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Ushsbs", "visitedAddress": "Jsbsbs", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Ysgsvs", "residentialDetails": "Ysgsg"}, "investigable": true, "familyDetails": [{"age": "5454", "name": "Yegwhw", "relation": "Spouse", "mobileNumber": "6464648484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Jshsbs", "statusOfLabour": "permanent", "numberOfLabours": "5484", "workingHoursEnd": "15:47", "statusOfEmployee": "permanent", "numberOfEmployees": "24", "workingHoursStart": "13:47", "wagesPerMonthPerDay": "67848", "otherMajorExpenditure": "Ishsgsb", "salaryPerMonthPerEmployee": "28000"}, "uploadedItems": [], "clientsDebtors": {"turnover": "459", "customers": [{"name": "Ddbdddg", "phone": "5545955565", "review": "positive", "location": "Sdggy"}], "netMargins": "488", "creditPeriod": "2444", "cashChequeProportions": "1289", "numberOfFixedCustomers": "255", "averageStockMaintenance": "458"}, "suppliersCreditors": {"suppliers": [{"name": "Ysgava", "phone": "1234567890", "review": "positive", "location": "Ywgwvw"}], "creditPeriod": "24", "supplier1Review": "", "supplier2Review": "", "supplier3Review": "", "cashChequeProportions": "12/20", "numberOfFixedSuppliers": "20"}, "shareholdingDetails": {"shareholders": [{"name": "Hsbssv", "designation": "Usbsb", "shareholdingPercentage": "80", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Hsbsvs"}]}}, "assetDetails": {"assets": [{"address": "Hyderabad ", "mortgaged": "yes", "ownerName": "Rahul", "marketValue": "5484040", "areaMeasured": "2500", "purchaseCost": "24548", "purchaseYear": "64848"}], "status": "positive", "remarks": "Good", "vehicles": "Honda- Unicorn", "otherIncome": "Cocaine", "observations": "Good", "siteCoordinates": "Nearby Baba general store", "lifeInsuranceMediclaim": "Yes", "capitalInvestedBusiness": "Yes", "liquidMoveableMonetaryItems": "Sus"}, "basicDetails": {"phoneNo": "8899009988", "noOfVisit": "1", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kowtha test", "nameOfConcern": "Logitech", "aboutApplicant": "Good boy", "visitedAddress": "Hyderabad ", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Hyderabad, Telangana", "coApplicantDetails": "Good co applicant", "residentialDetails": "Good place"}, "investigable": true, "existingLoans": {"loans": [{"emi": "1000", "tenure": "12", "purpose": "Home", "bankName": "Axis", "loanAmount": "20000"}]}, "familyDetails": [{"age": "3000", "name": "Martis", "relation": "Spouse", "mobileNumber": "6464648482", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Good", "statusOfLabour": "permanent", "numberOfLabours": "5484", "workingHoursEnd": "15:47", "statusOfEmployee": "permanent", "numberOfEmployees": "24", "workingHoursStart": "13:47", "wagesPerMonthPerDay": "67848", "otherMajorExpenditure": "Nothing", "salaryPerMonthPerEmployee": "28000"}, "uploadedItems": [], "clientsDebtors": {"turnover": "459", "customers": [{"name": "Dasavanth", "phone": "5545955565", "review": "positive", "location": "Hyderabad "}], "netMargins": "488", "creditPeriod": "2444", "cashChequeProportions": "1289", "numberOfFixedCustomers": "255", "averageStockMaintenance": "458"}, "thirdPartyCheck": {"checks": [{"tpcName": "Mukesh", "comments": "Sold his 2 bangles", "mobileNumber": "9999999999", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Additional details #1"}, {"value": "Additional details #2"}]}, "suppliersCreditors": {"suppliers": [{"name": "Yagna", "phone": "1234567890", "review": "positive", "location": "Hyderabad "}], "creditPeriod": "24", "cashChequeProportions": "12/20", "numberOfFixedSuppliers": "20"}, "shareholdingDetails": {"shareholders": [{"name": "Hsbssv", "designation": "Usbsb", "shareholdingPercentage": "80", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Hsbsvs"}]}}	\N	2025-09-22 10:36:34.825	2025-09-24 11:57:40.3	Business	\N	\N	\N	\N	20	Logitech	\N	\N	\N	\N	PD	\N	\N	\N
108	727	Business	44	Completed	madhapur	{"assetDetails": {"assets": [{"address": "Kondapur ", "mortgaged": "yes", "ownerName": "Dhanu", "marketValue": "900", "areaMeasured": "600", "purchaseCost": "700", "purchaseYear": "800"}], "status": "positive", "remarks": "Akh", "vehicles": "Company beyondscale", "otherIncome": "Bey", "observations": "Abcd", "siteCoordinates": "Testing", "lifeInsuranceMediclaim": "Bike ", "capitalInvestedBusiness": "Gold", "liquidMoveableMonetaryItems": "Car"}, "basicDetails": {"phoneNo": "9493344180", "noOfVisit": "2", "personMet": "other", "constitution": "partnership", "applicantName": "CHAKALI GANGA BHAVANI", "nameOfConcern": "jai bhavani", "aboutApplicant": "Good ", "visitedAddress": "Kondapur ", "nameOfPersonMet": "Mohan", "structureOfLoan": "other", "appointmentFixed": "yes", "initiatedAddress": "madhapur", "coApplicantDetails": "", "residentialDetails": "Own house "}, "existingLoans": {"loans": [{"emi": "55000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian ", "loanAmount": "1000000"}]}, "familyDetails": [{"age": "55", "name": "Padma", "relation": "Other", "mobileNumber": "9912994741", "otherRelation": "Mother in law ", "employmentType": "Homemaker", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "salariesWages": {"remarks": "Remarks 1", "statusOfLabour": "permanent", "numberOfLabours": "300", "workingHoursEnd": "22:01", "statusOfEmployee": "permanent", "numberOfEmployees": "200", "workingHoursStart": "13:00", "wagesPerMonthPerDay": "200", "otherMajorExpenditure": "Rent school fees trasport ", "salaryPerMonthPerEmployee": "35000"}, "clientsDebtors": {"turnover": "200", "customers": [{"name": "Eshwaramma ", "phone": "9000782279", "review": "positive", "location": "Shaikpet "}], "netMargins": "100", "creditPeriod": "5", "cashChequeProportions": "Test", "numberOfFixedCustomers": "200", "averageStockMaintenance": "300"}, "thirdPartyCheck": {"checks": [{"tpcName": "Raj", "comments": "Test", "mobileNumber": "8464940779", "relationship": "Other", "otherRelation": "Brother ", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Namilemate telangana "}]}, "suppliersCreditors": {"suppliers": [{"name": "400", "phone": "9966332255", "review": "positive", "location": "Namilemate "}], "creditPeriod": "200", "cashChequeProportions": "300", "numberOfFixedSuppliers": "100"}, "shareholdingDetails": {"shareholders": [{"name": "Sudarshan reddy", "designation": "Rental business ", "shareholdingPercentage": "10", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "other", "functionalOfPartnerDirector": "Test"}]}}	\N	2025-09-25 08:13:22.266	2025-09-25 08:25:45.232	Business	\N	\N	\N	\N	5	jai bhavani	\N	\N	\N	\N	PD	\N	\N	\N
96	688	Business	47	Completed	 ng	{"assetDetails": {"assets": [{"address": "Hshdjdj", "mortgaged": "yes", "ownerName": "Hzhd", "marketValue": "6266", "areaMeasured": "65656", "purchaseCost": "65665", "purchaseYear": "65656"}], "status": "positive", "remarks": "Hehjd", "vehicles": "Hhdhdhj", "otherIncome": "Jdjdj", "observations": "Hehdh", "siteCoordinates": "Jdjjd", "lifeInsuranceMediclaim": "Uehdjjd", "capitalInvestedBusiness": "Hdhdhj", "liquidMoveableMonetaryItems": "Cash"}, "basicDetails": {"phoneNo": "2354364756", "applicantName": "dgbdfh", "nameOfConcern": "jvj", "initiatedAddress": " ng"}, "existingLoans": {"loans": [{"emi": "65665", "tenure": "656", "purpose": "Jdj", "bankName": "Jdj", "loanAmount": "6566"}]}, "familyDetails": [{"age": "956", "name": "Hdh", "relation": "Daughter", "mobileNumber": "6565665665", "otherRelation": "", "employmentType": "Retired", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "salariesWages": {"remarks": "Hdh", "statusOfLabour": "permanent", "numberOfLabours": "65656", "workingHoursEnd": "06:36", "statusOfEmployee": "permanent", "numberOfEmployees": "6466", "workingHoursStart": "11:36", "wagesPerMonthPerDay": "6565", "otherMajorExpenditure": "Hdhd", "salaryPerMonthPerEmployee": "65656"}, "clientsDebtors": {"turnover": "656", "netMargins": "65656", "creditPeriod": "65656", "customer1Name": "Hdhdh", "customer2Name": "", "customer3Name": "", "customer1Phone": "6565656686", "customer2Phone": "", "customer3Phone": "", "customer1Review": "positive", "customer2Review": "", "customer3Review": "", "customer1Location": "Hdhdh", "customer2Location": "", "customer3Location": "", "cashChequeProportions": "Hdhdh", "numberOfFixedCustomers": "35656", "averageStockMaintenance": "646"}, "thirdPartyCheck": {"checks": [{"tpcName": "Hdh", "comments": "Hdh", "mobileNumber": "656", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Hdjdj"}, {"value": "Jdjjj"}]}, "suppliersCreditors": {"suppliers": [{"name": "Hdhdh", "phone": "6656565665", "review": "positive", "location": "Hdhd"}], "creditPeriod": "65665", "cashChequeProportions": "Hdhdh", "numberOfFixedSuppliers": "65656665"}, "shareholdingDetails": {"shareholders": [{"name": "Hdh", "designation": "Hdhdh", "shareholdingPercentage": "65", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "father", "functionalOfPartnerDirector": "Vh"}]}}	\N	2025-09-24 06:00:54.344	2025-09-24 08:49:33.567	Business	\N	\N	\N	\N	20	jvj	\N	\N	\N	\N	PD	{"rent": 0, "sales": 100, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 1100, "insurance": 0, "netProfit": 1200, "bankCharges": 0, "grossProfit": 1200, "closingStock": 0, "depreciation": 0, "openingStock": 0, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	aefgwr	\N
102	710	Business	41	Completed	Ameerpet	{"timestamp": "2025-09-25T10:43:21.276Z", "sectionData": {"timestamp": "2025-09-25T10:40:07.218Z", "sectionData": {"timestamp": "2025-09-25T10:31:39.865Z", "sectionData": {"timestamp": "2025-09-25T10:31:17.220Z", "sectionData": {"timestamp": "2025-09-25T10:29:58.349Z", "sectionData": {"basicDetails": {"phoneNo": "", "applicantName": "Kommuri Ramesh", "nameOfConcern": "Baba pharmacy store", "initiatedAddress": "Ameerpet"}}, "basicDetails": {"phoneNo": "", "applicantName": "Kommuri Ramesh", "nameOfConcern": "Baba pharmacy store", "initiatedAddress": "Ameerpet"}, "investigable": true, "uploadedItems": [{"id": "1758796198343ubcf26x8n5", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/f0f8619d-f777-4a5f-9d0d-107a98bfb295.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:29:58.343Z", "s3ImageUrl": "verification/102/1758796196526-0i3njt.jpg", "isOverlayNeeded": false}]}, "basicDetails": {"phoneNo": "", "applicantName": "Kommuri Ramesh", "nameOfConcern": "Baba pharmacy store", "initiatedAddress": "Ameerpet"}, "investigable": true, "uploadedItems": [{"id": "1758796198343ubcf26x8n5", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/f0f8619d-f777-4a5f-9d0d-107a98bfb295.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:29:58.343Z", "s3ImageUrl": "verification/102/1758796196526-0i3njt.jpg", "isOverlayNeeded": false}, {"id": "1758796277209qpar0a1z1qi", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/3b124a68-3bd6-4f46-853a-657184d9ec58.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:17.209Z", "s3ImageUrl": "verification/102/1758796275643-tvjm8o.jpg", "isOverlayNeeded": false}]}, "assetDetails": {"assets": [{"address": "Uswbbwe", "mortgaged": "yes", "ownerName": "Twgwvehe", "marketValue": "51818", "areaMeasured": "244000", "purchaseCost": "2440", "purchaseYear": "2407"}], "status": "positive", "remarks": "Me dbdjd", "vehicles": "Gavshsheh", "otherIncome": "Hsbbsbe", "observations": "Ysbsbs", "siteCoordinates": "6xxydhdhd", "lifeInsuranceMediclaim": "Hehbwwh", "capitalInvestedBusiness": "Yaghseb", "liquidMoveableMonetaryItems": "Gsvshs"}, "basicDetails": {"phoneNo": "", "noOfVisit": "1", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kommuri Ramesh", "nameOfConcern": "Baba pharmacy store", "aboutApplicant": "Usvsvs", "visitedAddress": "Ameerpet", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Ameerpet", "coApplicantDetails": "Hvavs", "residentialDetails": "Usgvw"}, "investigable": true, "existingLoans": {"loans": [{"emi": "54845", "tenure": "54", "purpose": "Yshsbsh", "bankName": "Ysgsbs", "loanAmount": "248484"}]}, "familyDetails": [{"age": "318", "name": "Jsvvws", "relation": "Daughter", "mobileNumber": "6484846484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "salariesWages": {"remarks": "Usbss", "statusOfLabour": "contractual", "numberOfLabours": "24", "workingHoursEnd": "02:08", "statusOfEmployee": "permanent", "numberOfEmployees": "38", "workingHoursStart": "12:08", "wagesPerMonthPerDay": "24", "otherMajorExpenditure": "Hebeb3", "salaryPerMonthPerEmployee": "24"}, "uploadedItems": [{"id": "1758796198343ubcf26x8n5", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/f0f8619d-f777-4a5f-9d0d-107a98bfb295.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:29:58.343Z", "s3ImageUrl": "verification/102/1758796196526-0i3njt.jpg", "isOverlayNeeded": false}, {"id": "1758796277209qpar0a1z1qi", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/3b124a68-3bd6-4f46-853a-657184d9ec58.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:17.209Z", "s3ImageUrl": "verification/102/1758796275643-tvjm8o.jpg", "isOverlayNeeded": false}, {"id": "17587962998490jy2de1b9cjq", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/b951c5ab-e6f4-47df-8276-4094804439a6.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:39.849Z", "s3ImageUrl": "verification/102/1758796298858-b019ah.jpg", "isOverlayNeeded": false}], "clientsDebtors": {"turnover": "24", "customers": [{"name": "Uavavwh", "phone": "6484848484", "review": "positive", "location": "Hyderabad "}], "netMargins": "35", "creditPeriod": "248", "cashChequeProportions": "12/30", "numberOfFixedCustomers": "24", "averageStockMaintenance": "12"}, "thirdPartyCheck": {"checks": [{"tpcName": "Ysgsgsh", "comments": "Ushsehe", "mobileNumber": "6484848494", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "suppliersCreditors": {"suppliers": [{"name": "Uwvvww", "phone": "6181849465", "review": "positive", "location": "Jagavs"}], "creditPeriod": "5481", "cashChequeProportions": "12/30", "numberOfFixedSuppliers": "24840"}, "shareholdingDetails": {"shareholders": [{"name": "Uwgwvwv", "designation": "Uwvwbw", "shareholdingPercentage": "24", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "sister", "functionalOfPartnerDirector": "Vgwuwve"}]}}, "assetDetails": {"assets": [{"address": "Uswbbwe", "mortgaged": "yes", "ownerName": "Twgwvehe", "marketValue": "51818", "areaMeasured": "244000", "purchaseCost": "2440", "purchaseYear": "2407"}], "status": "positive", "remarks": "Me dbdjd", "vehicles": "Gavshsheh", "otherIncome": "Hsbbsbe", "observations": "Ysbsbs", "siteCoordinates": "6xxydhdhd", "lifeInsuranceMediclaim": "Hehbwwh", "capitalInvestedBusiness": "Yaghseb", "liquidMoveableMonetaryItems": "Gsvshs"}, "basicDetails": {"phoneNo": "", "noOfVisit": "1", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kommuri Ramesh", "nameOfConcern": "Baba pharmacy store", "aboutApplicant": "Usvsvs", "visitedAddress": "Ameerpet", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Ameerpet", "coApplicantDetails": "Hvavs", "residentialDetails": "Usgvw"}, "investigable": true, "existingLoans": {"loans": [{"emi": "54845", "tenure": "54", "purpose": "Yshsbsh", "bankName": "Ysgsbs", "loanAmount": "248484"}]}, "familyDetails": [{"age": "318", "name": "Jsvvws", "relation": "Daughter", "mobileNumber": "6484846484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "salariesWages": {"remarks": "Usbss", "statusOfLabour": "contractual", "numberOfLabours": "24", "workingHoursEnd": "02:08", "statusOfEmployee": "permanent", "numberOfEmployees": "38", "workingHoursStart": "12:08", "wagesPerMonthPerDay": "24", "otherMajorExpenditure": "Hebeb3", "salaryPerMonthPerEmployee": "24"}, "uploadedItems": [{"id": "1758796198343ubcf26x8n5", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/f0f8619d-f777-4a5f-9d0d-107a98bfb295.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:29:58.343Z", "s3ImageUrl": "verification/102/1758796196526-0i3njt.jpg", "isOverlayNeeded": false}, {"id": "1758796277209qpar0a1z1qi", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/3b124a68-3bd6-4f46-853a-657184d9ec58.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:17.209Z", "s3ImageUrl": "verification/102/1758796275643-tvjm8o.jpg", "isOverlayNeeded": false}, {"id": "17587962998490jy2de1b9cjq", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/b951c5ab-e6f4-47df-8276-4094804439a6.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:39.849Z", "s3ImageUrl": "verification/102/1758796298858-b019ah.jpg", "isOverlayNeeded": false}], "clientsDebtors": {"turnover": "24", "customers": [{"name": "Uavavwh", "phone": "6484848484", "review": "positive", "location": "Hyderabad "}], "netMargins": "35", "creditPeriod": "248", "cashChequeProportions": "12/30", "numberOfFixedCustomers": "24", "averageStockMaintenance": "12"}, "thirdPartyCheck": {"checks": [{"tpcName": "Ysgsgsh", "comments": "Ushsehe", "mobileNumber": "6484848494", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Sushehe"}, {"value": "Uwgwhege"}, {"value": "Ihbddjf"}]}, "suppliersCreditors": {"suppliers": [{"name": "Uwvvww", "phone": "6181849465", "review": "positive", "location": "Jagavs"}], "creditPeriod": "5481", "cashChequeProportions": "12/30", "numberOfFixedSuppliers": "24840"}, "shareholdingDetails": {"shareholders": [{"name": "Uwgwvwv", "designation": "Uwvwbw", "shareholdingPercentage": "24", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "sister", "functionalOfPartnerDirector": "Vgwuwve"}]}}, "assetDetails": {"assets": [{"address": "Uswbbwe", "mortgaged": "yes", "ownerName": "Twgwvehe", "marketValue": "51818", "areaMeasured": "244000", "purchaseCost": "2440", "purchaseYear": "2407"}], "status": "positive", "remarks": "Me dbdjd", "vehicles": "Gavshsheh", "otherIncome": "Hsbbsbe", "observations": "Ysbsbs", "siteCoordinates": "6xxydhdhd", "lifeInsuranceMediclaim": "Hehbwwh", "capitalInvestedBusiness": "Yaghseb", "liquidMoveableMonetaryItems": "Gsvshs"}, "basicDetails": {"phoneNo": "", "noOfVisit": "1", "personMet": "applicant", "constitution": "partnership", "applicantName": "Kommuri Ramesh", "nameOfConcern": "Baba pharmacy store", "aboutApplicant": "Usvsvs", "visitedAddress": "Ameerpet", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "Ameerpet", "coApplicantDetails": "Hvavs", "residentialDetails": "Usgvw"}, "investigable": true, "existingLoans": {"loans": [{"emi": "54845", "tenure": "54", "purpose": "Yshsbsh", "bankName": "Ysgsbs", "loanAmount": "248484"}]}, "familyDetails": [{"age": "318", "name": "Jsvvws", "relation": "Daughter", "mobileNumber": "6484846484", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "salariesWages": {"remarks": "Usbss", "statusOfLabour": "contractual", "numberOfLabours": "24", "workingHoursEnd": "02:08", "statusOfEmployee": "permanent", "numberOfEmployees": "38", "workingHoursStart": "12:08", "wagesPerMonthPerDay": "24", "otherMajorExpenditure": "Hebeb3", "salaryPerMonthPerEmployee": "24"}, "uploadedItems": [{"id": "1758796198343ubcf26x8n5", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/f0f8619d-f777-4a5f-9d0d-107a98bfb295.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:29:58.343Z", "s3ImageUrl": "verification/102/1758796196526-0i3njt.jpg", "isOverlayNeeded": false}, {"id": "1758796277209qpar0a1z1qi", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/3b124a68-3bd6-4f46-853a-657184d9ec58.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:17.209Z", "s3ImageUrl": "verification/102/1758796275643-tvjm8o.jpg", "isOverlayNeeded": false}, {"id": "17587962998490jy2de1b9cjq", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/b951c5ab-e6f4-47df-8276-4094804439a6.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:31:39.849Z", "s3ImageUrl": "verification/102/1758796298858-b019ah.jpg", "isOverlayNeeded": false}, {"id": "1758797001264cxocflnx2w", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/6d798af6-e76e-4fef-b5d3-b7e42b417f9f.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-09-25T10:43:21.264Z", "s3ImageUrl": "verification/102/1758797000270-1or0vs.jpg", "isOverlayNeeded": false}], "clientsDebtors": {"turnover": "24", "customers": [{"name": "Uavavwh", "phone": "6484848484", "review": "positive", "location": "Hyderabad "}], "netMargins": "35", "creditPeriod": "248", "cashChequeProportions": "12/30", "numberOfFixedCustomers": "24", "averageStockMaintenance": "12"}, "thirdPartyCheck": {"checks": [{"tpcName": "Ysgsgsh", "comments": "Ushsehe", "mobileNumber": "6484848494", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Sushehe"}, {"value": "Uwgwhege"}, {"value": "Ihbddjf"}]}, "suppliersCreditors": {"suppliers": [{"name": "Uwvvww", "phone": "6181849465", "review": "positive", "location": "Jagavs"}], "creditPeriod": "5481", "cashChequeProportions": "12/30", "numberOfFixedSuppliers": "24840"}, "shareholdingDetails": {"shareholders": [{"name": "Uwgwvwv", "designation": "Uwvwbw", "shareholdingPercentage": "24", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "sister", "functionalOfPartnerDirector": "Vgwuwve"}]}}	\N	2025-09-24 12:03:31.249	2025-09-25 10:44:39.788	Business	\N	\N	\N	\N	20	Baba pharmacy store	\N	\N	\N	\N	PD	\N	\N	\N
114	750	Business	44	Pending	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	\N	\N	2025-09-26 07:06:47.307	2025-09-26 07:06:47.307	\N	\N	\N	\N	\N	5	dhana	\N	\N	\N	\N	PD	\N	\N	\N
55	74	Work	46	Pending	43er	\N	\N	2025-09-01 05:02:14.764	2025-09-02 05:49:38.464	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	43er	FI	\N	\N	\N
62	82	AddressOne	41	Pending	madhapur	\N	\N	2025-09-02 05:20:39.523	2025-09-03 06:52:57.744	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
54	74	AddressTwo	47	Pending	5rd	\N	\N	2025-09-01 05:01:57.836	2025-09-05 05:57:43.43	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
120	776	Business	44	Pending	qtewre	\N	\N	2025-09-26 11:17:57.163	2025-09-26 11:34:40.477	\N	\N	\N	\N	\N	12	rqetwre	\N	\N	\N	\N	PD	\N	\N	\N
126	816	Business	47	Completed	wergges	{"basicDetails": {"phoneNo": "4356342545", "applicantName": "test2", "nameOfConcern": "fish", "initiatedAddress": "wergges"}, "existingLoans": {"loans": [{"emi": "50", "tenure": "5", "purpose": "Farm", "bankName": "Axiss", "loanAmount": "50000"}, {"emi": "55", "tenure": "50", "purpose": "Business ", "bankName": "Axis1", "loanAmount": "500000"}]}, "familyDetails": [{"age": "55", "name": "Ramama", "relation": "Father", "mobileNumber": "6666665888", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}, {"age": "50", "name": "Sirasa ", "relation": "Mother", "mobileNumber": "8966575555", "otherRelation": "", "employmentType": "Homemaker", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Goodd", "statusOfLabour": "permanent", "numberOfLabours": "60", "workingHoursEnd": "04:25", "statusOfEmployee": "permanent", "numberOfEmployees": "55", "workingHoursStart": "09:11", "wagesPerMonthPerDay": "60", "otherMajorExpenditure": "No other expenses ", "salaryPerMonthPerEmployee": "600000"}, "bankingDetails": {"assets": "Assests1", "bankAccounts": [{"type": "Personal ", "account": "28658955", "bankName": "Axissddg", "averageBalance": "500000", "numberOfYearsMaintained": "55"}, {"type": "Personal", "account": "6466592956", "bankName": "Finnn", "averageBalance": "500000", "numberOfYearsMaintained": "50"}], "licMutualFunds": "Lic/mutual funds"}, "financeDetails": {"shareholders": [{"name": "Share1", "designation": "Headd", "shareholdingPercentage": "45", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Partner"}, {"name": "Name2", "designation": "Head2", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Director "}]}, "businessDetails": {"salesVolume": "55000", "stockSource": "suppliers", "wageExpenses": "60", "profitPerUnit": "5580", "stockHandling": "premises", "typeOfBusiness": "partnership", "numberOfWorkers": "50", "natureOfBusiness": "trader", "yearBusinessStarted": "1999", "majorTransactionMode": "cash", "businessPremisesOwnership": "rented"}, "thirdPartyCheck": {"checks": [{"tpcName": "Neigh", "comments": "Good better", "mobileNumber": "6765656566", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}, {"tpcName": "Neig2", "comments": "Ok bttette", "mobileNumber": "6868656266", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Neutral"}]}, "additionalDetails": {"details": [{"value": "Bsnd"}, {"value": "Jdjdj"}]}, "documentsObserved": {"documents": [{"remarks": "Good ok", "documentName": "Name1", "documentType": "Type1", "documentCategory": "Cat 1"}, {"remarks": "Ok better best", "documentName": "Doc name2", "documentType": "Type2", "documentCategory": "Doc cat2"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raju", "phone": "6565665656", "review": "positive", "location": "Loc1"}, {"name": "Raj2", "phone": "6565665656", "review": "positive", "location": "Loc2"}], "creditPeriod": "5", "cashChequeProportions": "11/20", "numberOfFixedSuppliers": "20"}}	\N	2025-09-29 05:28:57.376	2025-09-29 05:46:12.697	Business	\N	\N	\N	\N	19	fish	\N	\N	\N	\N	PD	\N	\N	\N
132	837	Business	47	Pending	wrqegerht	{"bankDetails": {"avgBalance": "500000", "primaryBanker": "Bankerr", "natureOfAccount": "Saving"}, "basicDetails": {"phoneNo": "5346565653", "applicantName": "test5", "nameOfConcern": "1r32t4w", "initiatedAddress": "wrqegerht"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "6", "purpose": "Hhdjj", "bankName": "Bank 1", "loanAmount": "25000", "outstandingBalance": "25000"}, {"emi": "6", "tenure": "2", "purpose": "Purpose 2", "bankName": "Axiss2", "loanAmount": "350000", "outstandingBalance": "25000"}]}, "familyDetails": [{"age": "45", "name": "Ramamma", "relation": "Mother", "mobileNumber": "3465698986", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "officeAddress": {"address": "Adddress123", "ownedBy": "1980", "areaInSqFt": "19808", "cmvRentPerMonth": "654", "occupiedSinceYears": "1980", "ownershipOfPremises": "rented"}, "businessDetails": {"stockAsOnDate": "11-20-2026", "currentBusinessDetails": "Current business detilas"}, "employeeDetails": {"salaryRange": "25000", "keyEmployeeName": "Ram", "currentEmployees": "25"}, "supplierDetails": {"suppliers": [{"creditorDays": "63", "supplierName": "Supp1", "percentageOfTotalSales": "23", "relationshipSinceYears": "6"}, {"creditorDays": "39", "supplierName": "Supp2", "percentageOfTotalSales": "39", "relationshipSinceYears": "5"}], "totalSuppliers": "36", "totalCreditorsAsOnDate": "25"}, "thirdPartyCheck": {"checks": [{"tpcName": "Hood", "comments": "Good better", "mobileNumber": "2558064664", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "customersDetails": {"customers": [{"debtorDays": "5", "customerName": "Cust1", "percentageOfTotalSales": "25", "relationshipSinceYears": "5"}, {"debtorDays": "30", "customerName": "Cust2", "percentageOfTotalSales": "28", "relationshipSinceYears": "6"}], "totalCustomers": "6", "totalDebtorsAsOnDate": "5"}, "siteVisitDetails": {"landmark": "Opposte to pvr", "neighborhood": "Neighbour ", "stockSeenDuringPD": "yes", "nameplateDisplayed": "yes", "officeWellFurnished": "yes", "businessActivitySeen": "yes", "anyDecreaseInNetworth": "yes", "noOfCustomersSeenDuringPD": "500", "noOfEmployeesSeenDuringPD": "5008", "difficultyInLocatingPremises": "no", "abnormalIncreaseDecreaseInTurnover": "2000 incresse"}, "additionalDetails": {"details": [{"value": "Gdty"}, {"value": "Ghj"}]}, "documentsObserved": {"documents": [{"remarks": "Good", "documentName": "Name1", "documentType": "Type2", "documentCategory": "Cat1"}]}, "valueAddedDetails": {"strengths": "Hardwork,passion", "lossReason": "Loss", "weaknesses": "Weakness,health", "customerBehaviour": "Good", "digitalWalletUsed": "yes", "nearbyTransportStand": "Bustop near me", "lossSufferedInBusiness": "yes", "salariesPaidDuringCovid": "yes", "natureOfNeighborhoodShops": "Pan", "customerShopOfficeLocality": "market_road", "utilityBillUnitsConsumption": "yes"}, "residentialAddress": {"address": "Address2", "ownedBy": "Ramm", "personMet": "Mother", "areaInSqFt": "132564", "addressOfPD": "Pd adresss", "cmvRentPerMonth": "2566", "occupiedSinceValues": "1986", "ownershipOfPremises": "rented"}, "proposedLoanDetails": {"type": "Type SA", "accNo": "646569499", "tenure": "5", "product": "My prod", "repaymentFrom": "11-20-2222"}, "miscelleanousDetails": {"anyCourtCases": "No cort cases", "endUseOfProposedLoan": "End use ", "politicalConnections": "Yes mla", "businessBelongsToWhichIndustry": "Usa"}, "salesAndProfitDetails": {"profitMargin": "2500", "netMonthlyIncome": "56999", "cashSalesPercentage": "25", "monthlyTurnoverSales": "50000", "covidEffectOnTurnover": "yes", "turnoverPrevFiscalYear": "5000000", "expectedTurnoverCurrentFiscalYear": "5000", "businessRunningSameSpeedAfterLockdown": "yes"}, "additionalBusinessDetails": {"assets": "Assteee1", "liabilities": "Libalities", "otherBusinessIncomeDetails": "Other business "}}	\N	2025-09-29 12:50:43.932	2025-09-29 12:50:43.932	Business	\N	\N	\N	\N	20	1r32t4w	f	\N	\N	\N	PD	\N	\N	\N
137	867	Business	47	Completed	wfef	{"netWorth": {"netWorth": [{"ownerName": "Hdhd", "typeOfProperty": "Yzh", "yearsOfOwnership": "Udh", "approxMarketValue": "Ydy"}, {}]}, "caseDetails": {"contactNo": "888880815", "personMet": "Per met", "coApplicant": "Co-app", "dateOfVisit": "11-20-2024", "addressVisited": "Add vus", "meetingDetails": "Meet details", "typeOfBorrower": "Typ bor", "nameOfApplicant": "Name", "referenceNumber": "Refernce"}, "particulars": {"coordinates": "Yshdh"}, "basicDetails": {"phoneNo": "2554322343", "applicantName": "test7", "nameOfConcern": "adsfd", "initiatedAddress": "wfef"}, "loansDetails": {"loansDetails": [{"os": "Y+\\"+", "emi": "5", "product": "Shdh", "remarks": "Hdhdh", "loanAmount": "2000", "nameOfBankInstitution": "Dhd"}, {}]}, "familyDetails": {"aboutApplicant": "Ydhd", "aboutCoApplicant": "Shdh", "andTheirFamilyDetails": "Hdhd"}, "outputsSupply": {"creditTerms": "Hdh", "marketForOutput": "Udh", "modeOfMarketing": "Hhd", "typeOfCustomers": "Dhdh", "stockOfFinishedGoods": "Dhdh"}, "businessDetails": {"margins": "Ydyd", "gstNumber": "Dhdh", "legalName": "Dhhd", "tradeName": "Dhdh", "shopAddress": "Ydhdhdy", "businessName": "Ydhdh", "typeOfEntity": "Shdh", "establishment": "Hdhd", "godownAddress": "Hdhdhdh", "lastGSTReturn": "Dhdhd", "shopOwnership": "Owned", "productDetails": "Hdhd", "businessProcess": "Dhhd", "godownOwnership": "", "activityObserved": "Duud", "natureOfBusiness": "Gshd", "documentsObserved": "Zhzh"}, "employeeDetails": {"pfEsiApplied": "Hdh", "noOfEmployees": "56", "salaryDetails": "Hdh"}, "inputsPurchases": {"orderCycle": "Dhdh", "creditTerms": "Udud", "avgOrderQnty": "Dhdh", "detailsOfInputs": "Dh", "purchaseDetails": "Dhhd"}, "tradeReferences": {"suppliers": [{"contactDetails": "6637373777", "nameOfSuppliers": "Udhd"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "Hshd", "name": "Gg", "remarks": "Hdjd", "relation": "Hdjd", "occupation": "Hdjd", "qualification": "Yy"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Shsh", "sourceOfIncome": "Sh"}]}, "applicantsMainBankingDetails": {"endUse": "Shdy", "remarks": "Sghd", "bankName": "Ydh", "noOfYear": "68", "accountType": "Hdhdh", "limitOfCCOD": "Dhxh", "particulars": "Dhhd", "ownContribution": "Shdh", "accountHolderName": "Shdhdh", "remarksAdditional": "Dhdh"}}	\N	2025-10-03 11:35:09.942	2025-10-06 12:02:41.635	Business	\N	\N	\N	\N	10	adsfd	\N	\N	\N	\N	PD	{"rent": 0, "sales": 20000, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 200, "insurance": 0, "netProfit": 24421, "bankCharges": 0, "grossProfit": 24421, "closingStock": 5221, "depreciation": 0, "openingStock": 1000, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	\N	\N
146	868	Business	44	Pending	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003	\N	\N	2025-10-07 06:29:46.173	2025-10-07 06:29:46.173	\N	\N	\N	\N	\N	5	dhana reddy	\N	\N	\N	\N	PD	\N	\N	\N
65	82	Business	14	Pending	ayyapa society	\N	\N	2025-09-02 05:21:54.381	2025-09-02 10:08:25.492	\N	\N	\N	\N	\N	38	dhana sree	\N	\N	\N	\N	FI	\N	\N	\N
53	74	AddressOne	14	Pending	111111111111	\N	\N	2025-09-01 05:01:43.82	2025-09-02 10:08:37.889	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
64	82	Work	7	Completed	kondapur	{"basicDetails": {"aadhar": "225555558889", "tenure": "", "bankName": "TATA CAPITAL HOUSING FINANCE LIMITED", "panNumber": "TESTW1234E", "loanAmount": "20000", "applicantName": "raj kumar200", "purposeOfLoan": "Busienss Loan", "qualification": "Below 10th", "prospectNumber": "raj200", "availablePersonName": "", "isApplicantAvailable": "Yes"}, "existingLoans": {"loans": [{"emi": "5600000", "tenure": "5", "purpose": "Home loan ", "bankName": "Indian", "loanAmount": "2000000000000"}]}, "uploadedItems": [{"id": "1756794542707uuha9zaoe8", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/e264e2c7-1e18-479e-a5aa-b045d00cf9ab.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.4642469, "locality": "Hyderabad", "longitude": 78.3679123, "timestamp": "2025-09-02T06:29:02.707Z", "s3ImageUrl": "verification/82/1756794541974-0ropur.jpg", "isOverlayNeeded": true}, {"id": "1756794634747s2ienk6jvd", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/bd7294f1-d314-41d1-9948-58886a1fad00.jpg", "type": "photo", "isCamera": false, "timestamp": "2025-09-02T06:30:34.747Z", "s3ImageUrl": "verification/82/1756794634250-iqi7kk.jpg", "isOverlayNeeded": false}, {"id": "175679463502315i5nab00be", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/6c9d24e8-ea1d-4429-bd4a-8e387781f80f.jpg", "type": "photo", "isCamera": false, "timestamp": "2025-09-02T06:30:35.023Z", "s3ImageUrl": "verification/82/1756794634802-w1mhrf.jpg", "isOverlayNeeded": false}, {"id": "175679463523880bwrdye57w", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/d18e9e32-f25b-47d7-9a8f-0605d55ade3c.jpg", "type": "photo", "isCamera": false, "timestamp": "2025-09-02T06:30:35.238Z", "s3ImageUrl": "verification/82/1756794635062-g2mf5m.jpg", "isOverlayNeeded": false}, {"id": "17567946355159sfrg5rylid", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/70f9bb1a-fac1-4cad-9a0c-b7e22c394adb.jpg", "type": "photo", "isCamera": false, "timestamp": "2025-09-02T06:30:35.515Z", "s3ImageUrl": "verification/82/1756794635275-a3f73q.jpg", "isOverlayNeeded": false}], "pastEmployment": {"employments": [{"toDate": "02/09/2025", "fromDate": "01/09/2025", "designation": "T", "employerName": "Beautiful ", "contactPersonName": "T", "reasonForMovement": "G", "contactPersonNumber": "5869989888"}]}, "employmentDetails": {"netSalary": "2", "salaryMode": "Online", "companySize": "200", "designation": "T", "grossSalary": "20000", "employerType": "MNC/Listed Pvt. Ltd", "idCardNumber": "T", "isAddressSame": "No", "officeAddress": "kondapur", "officeLocality": "Residential", "natureOfService": "Travel & Tourism & Hotel", "isOfficeNameSame": "No", "addressCorrection": "Hi-tech city 🏙️", "currentOfficeName": "beyondscale", "yearsInCurrentJob": "2", "correctedOfficeName": "Tcs", "totalWorkExperience": "5"}, "colleagueReferences": {"references": [{"name": "Raj", "address": "Kondapur ", "yearsKnown": "5", "designation": "Developer ", "emailAddress": "", "contactNumber": "2323562356"}]}}	\N	2025-09-02 05:21:26.674	2025-09-02 10:30:46.745	Work	\N	\N	\N	\N	38	\N	\N	\N	\N	beyondscale	FI	\N	\N	\N
63	82	AddressTwo	7	Completed	kondapur	{"basicDetails": {"aadhar": "555569899699", "tenure": "8698", "category": "OBC", "panNumber": "FGGCV3556V", "loanAmount": "20000", "applicantName": "raj kumar200", "categoryOther": "", "purposeOfLoan": "Busienss Loan", "verificationType": "AddressTwo", "applicationNumber": "raj200", "availablePersonName": "F", "isApplicantAvailable": "No", "availablePersonMobile": "8", "applicantMaritalStatus": "Married", "educationQualification": "Diploma/ITI certification", "availablePersonRelation": "Family", "applicantMaritalStatusOther": "", "availablePersonRelationOther": ""}, "uploadedItems": [{"id": "1756794885353ucsb835ov1h", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/846302c8-77da-4b60-8312-f2c6c7e03283.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.4643359, "locality": "Kothaguda", "longitude": 78.3679589, "timestamp": "2025-09-02T06:34:45.353Z", "s3ImageUrl": "verification/82/1756794884859-5o4qr8.jpg", "isOverlayNeeded": true}], "thirdPartyCheck": {"checks": [{"tpcName": "Vvbb", "comments": "Vvvb", "mobileNumber": "9912994741", "relationship": "Neighbor", "feedbackStatus": "Positive"}]}, "residenceDetails": {"houseArea": "", "rentDetails": "25000", "accessibility": "Moderate", "residenceType": "Others", "residenceStatus": "Rented", "standardOfLiving": "Excellent", "specifyResidenceType": "", "yearsAtCurrentAddress": "888888888888", "politicalSymbolVisible": "Yes"}, "addressVerification": {"geoTag": "17.4642429,78.3678923", "address": "PermanentAddress", "addressProof": "Rental Agreement", "previousCity": "C", "addressDetails": "kondapur", "addressCategory": "Rural", "addressMismatch": "Yes", "previousAddress": " F", "reasonForChange": "Fg", "previousAddressYears": "5", "addressCorrectionDetails": "  V", "numberOfYearsAtCurrentCity": "<=3 years", "numberOfYearsAtPreviousCity": "9", "numberOfYearsAtCurrentResidence": "<=2years"}, "familyMemberDetails": [{"age": "8", "name": "G", "relation": "Father", "mobileNumber": "2555555555", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}], "familyEmploymentDetails": {"dependents": "3", "assetsObserved": "Vvb", "earningMembers": "2", "isSpouseWorking": "Yes", "totalFamilyMembers": "5", "spouseEmploymentDetails": "C. V"}}	\N	2025-09-02 05:20:51.349	2025-09-02 10:34:56.823	PermanentAddress	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
151	889	Business	47	Completed	kjb	{"basicDetails": {"phoneNo": "3464545545", "applicantName": "test9", "nameOfConcern": "hjhhk", "initiatedAddress": "kjb"}, "commonPoints": {"concerns": "Hdhz", "employees": "Zhdh", "netMargin": "Hddh", "netProfit": "Hdhs", "otherIncomes": "Xhzh", "majorExpenses": "Zysy", "monthlyExpenses": "Dhdh", "otherObservation": "Hdhxhd", "numberOfEmployees": "Dhdh", "monthlyGrossReceipts": "Ydhd", "neighborCheckThirdParty": "Hdhdh", "monthlyHouseholdExpenses": "Zhzh"}, "businessDetails": {"income": "Tggbh", "itrFiled": "Yes", "gstNumber": "Ghhhh", "salesVolume": "Fdhbk", "stockSource": "YyyADXAD", "businessName": "Gg", "wageExpenses": "556", "profitPerUnit": "566", "stockHandling": "Tyh", "typeOfBusiness": "Private Limited", "gstRegistration": "No", "numberOfWorkers": "456", "aboutTheBusiness": "Udj", "natureOfBusiness": "Ty", "regularCustomers": [{"nameOfRegularCustomers": "Yh", "contactNumberOfRegularCustomers": "Tyy"}, {"nameOfRegularCustomers": "Yvb", "contactNumberOfRegularCustomers": "6678"}], "regularSuppliers": [{"nameOfRegularSuppliers": "Bhh", "contactNumberOfRegularSuppliers": "Ghh"}, {"nameOfRegularSuppliers": "Th", "contactNumberOfRegularSuppliers": "Ggg"}], "documentsObserved": "Ghh", "stockLevelObserved": "Ggg", "yearBusinessStarted": "656", "majorTransactionMode": "667", "businessActivityObserved": "Ghh", "businessPremisesOwnership": "Tyh"}, "applicantDetails": {"pdDate": "Shshdh", "product": "LAP", "pdAddress": "Office", "personMet": "Dhhdxh", "loanAmount": "2727", "customerName": "Gdhs", "applicationId": "HdhsadaD", "applicationNo": "Gsh", "contactNumber": "Hdhdhdh", "relationshipWithBorrower": "Guarantor"}, "familyBackground": {"familyMembers": [{"age": "45", "name": "Name1", "dependent": "Yes", "occupation": "Off", "qualification": "Qua", "incomePerMonth": "2500", "relationToApplicant": "Atta"}, {"age": "Gshs", "name": "Hsh", "dependent": "Ysh", "occupation": "Yeh", "qualification": "Ysh", "incomePerMonth": "Hdhs", "relationToApplicant": "Gshw"}, {}], "noOfEarningMembers": "25", "totalFamilyMembers": 28}, "businessPlaceVintage": {"nameOfFirm": "Name of firm", "constitution": "Proprietorship", "isResiCumOffice": "Yes", "previousEmployment": "Udhdh", "whoStartedBusiness": "acquired", "yearsInCurrentCity": "25", "yearsInCurrentOffice": "25", "yearsInCurrentBusiness": "25", "ownershipOfBusinessPlace": "owned"}, "otherDetailsObserved": {"stockSeen": "Yes", "noOfMachinesSeen": "55", "noOfEmployeesSeen": "252", "businessActivitySeen": "Yes", "top3ClientsCustomers": [{"name": "Th", "location": "Ggh", "contactDetails": "Ggh"}, {"name": "Tg", "location": "Hdhd", "contactDetails": "Gsh"}, {"name": "Ydh", "location": "Ydy", "contactDetails": "Hdh"}], "top3ClientsSuppliers": [{"name": "Hdbx", "location": "Hdh", "contactDetails": "Hdh"}], "businessNameBoardSeen": "Yes", "neighborCheckThirdParty": "Hhd", "otherObservationsRemarks": "Hdhd", "otherBusinessIncomeSource": "Yh"}, "businessFinancialProfile": {"natureOfBusiness": "Trading", "productServicesOffered": "Jdjdj", "businessModelBackground": "Dj"}}	\N	2025-10-07 07:34:18.499	2025-10-07 09:55:19.585	Business	\N	\N	\N	\N	19	hjhhk	f	\N	\N	\N	PD	{"rent": 0, "sales": 1999, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 0, "insurance": 0, "netProfit": 1999, "bankCharges": 0, "grossProfit": 1999, "closingStock": 0, "depreciation": 0, "openingStock": 0, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	<ul><li>kgb</li><li>kj</li><li>mj</li></ul>	\N
154	892	Business	47	Completed	ascf	{"bankDetails": {"avgBal": "Dydyax", "primaryBanker": "F", "natureOfAccount": "Hdhd"}, "basicDetails": {"nameOfEntity": "Dhhdzsv", "nameOfApplicant": "Gd", "nameOfCoApplicants": "Td"}, "otherDetails": {"assets": "Dydyd", "liabilities": [{"emi": "Sydy", "bank": "Dhx", "amount": "Sydy", "tenure": "Ydg", "natureOfLoan": "Sydy", "outstandingBalance": "Ydy"}], "anyCourtCases": "Yes", "businessIndustry": "YdydAX", "politicalConnection": "no", "endUseOfProposedLoan": "Ydydy", "otherBusinessIncomeDetails": "Dhx"}, "familyDetails": {"familyDetails": [{"age": "Dydy", "name": "Dhd", "relation": "Dydy", "profession": "Dydy", "monthlyIncome": "Eye y", "qualification": "Dydy"}]}, "officeAddress": {"add": "Dydysy", "ownedBy": "Ydyd", "areaSqFt": "Dydy", "rentedOwned": "Owned", "cmvRentPerMonth": "5353", "occupiedSinceYears": "353"}, "businessDetails": {"stockAsOnDate": "Dydyscc", "currentBusinessDetails": "Yd"}, "customerDetails": {"customers": [{"debtorDays": "Hdh", "nameOfCustomer": "Ydhd", "percentageOfTotalSales": "Shdy", "relationshipSinceYears": "Ydhd"}, {"debtorDays": "A", "nameOfCustomer": "AX", "percentageOfTotalSales": "AX"}], "totalCustomersNo": "5353", "totalDebtorsAsOnDate": "6565"}, "supplierDetails": {"suppliers": [{"creditorDays": "Hdyd", "nameOfSupplier": "Dyd", "relationshipSinceYears": "Ydyd", "percentageOfTotalPurchases": "Dydy"}, {"creditorDays": "St dy", "nameOfSupplier": "Dhd", "relationshipSinceYears": "Dydy", "percentageOfTotalPurchases": "DD y"}], "totalSuppliersNo": "553", "totalCreditorsAsOnDate": "35"}, "employeesDetails": {"salaryRange": "Dhdhax", "keyEmployeeName": "Dhdy", "currentEmployees": "Ydh"}, "residentialAddress": {"add": "Ehddh", "ownedBy": "Td y", "areaSqFt": "Hdhd", "rentedOwned": "Rented", "cmvRentPerMonth": 5336, "occupiedSinceYears": "655", "addressOfPDAndPersonMet": "Dyd"}, "документы": {"panCard": "Ydhd", "otherDocumentSeen": "Dhdyac"}, "proposedLoanDetails": {"amount": "Yef", "tenure": "Dhdh", "product": "Or", "bankName": "Hdy", "accountNo": "Dhdy", "repaymentFrom": "DhdhC", "typeSAAccount": "Hdyd"}, "salesAndProfitDetails": {"profitMargin": "Dydy", "netMonthlyIncome": "Dydy", "turnoverFY202425": "Dhd", "cashSalesPercentage": "5353", "expTurnoverFY202526": "YdyaX", "monthlyTurnoverSales": "Dydy", "covidEffectOnTurnover": "Dydy", "postLockdownBusinessSpeed": "Ydyd"}, "siteVisitObservations": {"landmark": "Ydydddy", "neighborhood": "Yfyd", "stockSeenDuringPD": "Yes", "officeWellFurnished": "Yes", "businessActivitySeen": "no", "anyDecreaseInNetWorth": "Yes", "thirdPartyConfirmation": "Tttt", "noOfCustomersSeenDuringPD": "222", "noOfEmployeesSeenDuringPD": "333", "difficultyInLocatingPremises": "Yes", "abnormalIncreaseDecreaseInTurnover": "Yes"}, "valueAddedInformation": {"strengths": "Dydy", "weaknesses": "Dydy", "customerBehavior": "Good", "digitalWalletUsed": "Ydyd", "utilityBillDetails": "Ddydy", "customerShopLocality": "Main Road", "nearbyTransportStand": "Hdydydy", "lossSufferedInBusiness": "Gd d", "neighborhoodShopsNature": "Tere ydAX", "salariesPaidDuringCovid": "Partial", "salaryDeductionPercentage": "25"}}	\N	2025-10-07 10:06:41.039	2025-10-07 10:18:43.77	Business	\N	\N	\N	\N	19	scas	f	\N	\N	\N	PD	{"rent": 0, "sales": 2000, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 199999, "insurance": 0, "netProfit": 174215, "bankCharges": 0, "grossProfit": 171757, "closingStock": 2200, "depreciation": 0, "openingStock": 32442, "rentReceived": 2002, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 456, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	\N	\N
168	911	Business	44	Pending	bondapur	\N	\N	2025-10-09 08:55:41.6	2025-10-09 08:55:41.6	\N	\N	\N	\N	\N	5	beyondscale	\N	\N	\N	\N	PD	\N	\N	\N
42	52	Business	41	Completed	gddhd	{"basicDetails": {"aadhar": "451242351426", "panNumber": "ABCDE5678F", "businessName": "Prem Enterprises", "applicantName": "Prem", "isAddressSame": "No", "businessAddress": "Plot No. 12, Main Road, Kukatpally, Hyderabad, Telangana", "businessProfile": "Retail business selling home appliances", "addressCorrection": "Corrected to: Plot No. 12, Kukatpally Main Roaddsd", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}, "existingLoans": {"loans": [{"emi": "₹10,000", "tenure": "24 months", "purpose": "Working Capital", "bankName": "ICICI Bank", "loanAmount": "₹2,00,000"}]}, "miscellaneous": {"stockSeen": "Home appliances worth approx ₹5,00,000", "leaseAmount": "₹3,00,000 (Deposit)", "rentalAmount": "₹25,000/month", "employeesSeen": "4", "areaOfPremises": "600 sq ft", "businessActivity": "Retail Shop", "localityOfBusiness": "Commercial area", "otherSetupObserved": "Small warehouse attached", "ownershipOfPremises": "Rented", "illegalSetupObserved": "No", "politicallyConnected": "No", "businessActivityOther": "", "privateFinanceOrChits": "Yes, participates in local chit fund", "yearsInCurrentPremises": "3", "employeesUnderApplicant": "4"}, "uploadedItems": [{"id": "img001", "uri": "file://localpath/shop_front.jpg", "type": "ShopFrontPhoto", "timestamp": "2025-08-26T09:45:00Z", "s3ImageUrl": "https://s3.amazonaws.com/bucket/prem/shop_front.jpg"}, {"id": "img002", "uri": "file://localpath/business_board.jpg", "type": "BusinessNameBoard", "timestamp": "2025-08-26T09:50:00Z", "s3ImageUrl": "https://s3.amazonaws.com/bucket/prem/business_board.jpg"}], "businessDetails": {"geoTag": "17.4504,78.3911", "constitution": "Proprietorship", "nameBoardSeen": "Yes", "totalExperience": "5", "nameBoardMatched": "Yes", "businessStartYear": "2019", "isAddressTraceable": "Yes", "isBusinessSeasonal": "No"}, "thirdPartyCheck": {"checks": [{"tpcName": "Ramesh", "comments": "Business is running well for the last 3 years", "mobileNumber": "9876543210", "relationship": "Neighbor Shop Owner", "feedbackStatus": "Positive"}, {"tpcName": "Suresh", "comments": "Pays on time, good reputation", "mobileNumber": "9876500000", "relationship": "Supplier", "feedbackStatus": "Positive"}]}}	\N	2025-08-26 07:01:08.69	2025-09-01 07:57:52.567	Business	<ul><li>sdklc</li><li>asslkcn</li><li>aslkfcn</li><li>lllglgl</li></ul>	Positive	\N	\N	5	tuurur	\N	\N	\N	\N	FI	\N	\N	\N
80	109	Business	44	Completed	Kondapur	{}	\N	2025-09-10 07:08:27.479	2025-09-22 10:05:35.15	Business	\N	\N	\N	\N	5	beyondscale	\N	\N	\N	\N	PD	\N	\N	\N
91	651	Business	47	Completed	CSSC	{}	\N	2025-09-23 08:59:10.944	2025-09-23 09:02:53.44	Business	\N	\N	\N	\N	19	AAX	\N	\N	\N	\N	PD	\N	\N	\N
74	95	AddressOne	41	Pending	3ertyhj	\N	\N	2025-09-03 06:53:31.713	2025-09-03 07:08:54.926	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
103	723	Business	47	Pending	WFAEGS	\N	\N	2025-09-24 12:20:17.146	2025-09-24 12:20:17.146	\N	\N	\N	\N	\N	20	afg	\N	\N	\N	\N	PD	\N	\N	\N
97	706	Business	44	Completed	shaikpet nala	{"timestamp": "2025-09-24T12:25:55.366Z", "sectionData": {"assetDetails": {"assets": [{"address": "V b", "mortgaged": "no", "ownerName": "F", "marketValue": "5", "areaMeasured": "22", "purchaseCost": "2", "purchaseYear": "5"}], "status": "positive", "remarks": "Hhh", "vehicles": "Bhh", "otherIncome": "Hhh", "observations": "Bhh", "siteCoordinates": "Hjh", "lifeInsuranceMediclaim": "Ggg", "capitalInvestedBusiness": "Gggh", "liquidMoveableMonetaryItems": "Vv"}, "basicDetails": {"phoneNo": "9908066780", "applicantName": "CHINTHA RAJITHA", "nameOfConcern": "dhana sree reddy", "initiatedAddress": "shaikpet nala"}, "existingLoans": {"loans": [{"emi": "58", "tenure": "25", "purpose": "Hbh", "bankName": "Hhh", "loanAmount": "333333"}]}, "salariesWages": {"remarks": "", "statusOfLabour": "contractual", "numberOfLabours": "5", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "5566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5666"}, "clientsDebtors": {"turnover": "5", "customers": [{"name": "C", "phone": "5699999888", "review": "positive", "location": "G"}], "netMargins": "8", "creditPeriod": "5", "cashChequeProportions": "F", "numberOfFixedCustomers": "566", "averageStockMaintenance": "3"}, "thirdPartyCheck": {"checks": [{"tpcName": "Ccv", "comments": "C. ", "mobileNumber": "888", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "  Ggv"}]}, "suppliersCreditors": {"suppliers": [{"name": "Gh", "phone": "5566666666", "review": "positive", "location": "G"}], "creditPeriod": "2", "cashChequeProportions": "F", "numberOfFixedSuppliers": "2"}, "shareholdingDetails": {"shareholders": [{"name": "Test", "designation": "G", "shareholdingPercentage": "23", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "C"}]}}, "assetDetails": {"assets": [{"address": "V b", "mortgaged": "no", "ownerName": "F", "marketValue": "5", "areaMeasured": "22", "purchaseCost": "2", "purchaseYear": "5"}], "status": "positive", "remarks": "Hhh", "vehicles": "Bhh", "otherIncome": "Hhh", "observations": "Bhh", "siteCoordinates": "Hjh", "lifeInsuranceMediclaim": "Ggg", "capitalInvestedBusiness": "Gggh", "liquidMoveableMonetaryItems": "Vv"}, "basicDetails": {"phoneNo": "9908066780", "applicantName": "CHINTHA RAJITHA", "nameOfConcern": "dhana sree reddy", "initiatedAddress": "shaikpet nala"}, "investigable": true, "existingLoans": {"loans": [{"emi": "58", "tenure": "25", "purpose": "Hbh", "bankName": "Hhh", "loanAmount": "333333"}]}, "familyDetails": [{"age": "5", "name": "Vv ", "relation": "Brother", "mobileNumber": "8999669966", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "No", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "contractual", "numberOfLabours": "5", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "5566", "workingHoursStart": "", "wagesPerMonthPerDay": "5", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "5666"}, "uploadedItems": [{"id": "1758716754909wiy6b8vrk2", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/d92e3d5f-1c4f-4d80-a981-92e653bdab19.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.4642981, "locality": "Hyderabad", "longitude": 78.3679557, "timestamp": "2025-09-24T12:25:54.910Z", "s3ImageUrl": "verification/97/1758716753852-yo105.jpg", "isOverlayNeeded": true}], "clientsDebtors": {"turnover": "5", "customers": [{"name": "C", "phone": "5699999888", "review": "positive", "location": "G"}], "netMargins": "8", "creditPeriod": "5", "cashChequeProportions": "F", "numberOfFixedCustomers": "566", "averageStockMaintenance": "3"}, "thirdPartyCheck": {"checks": [{"tpcName": "Ccv", "comments": "C. ", "mobileNumber": "888", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "  Ggv"}]}, "suppliersCreditors": {"suppliers": [{"name": "Gh", "phone": "5566666666", "review": "positive", "location": "G"}], "creditPeriod": "2", "cashChequeProportions": "F", "numberOfFixedSuppliers": "2"}, "shareholdingDetails": {"shareholders": [{"name": "Test", "designation": "G", "shareholdingPercentage": "23", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "C"}]}}	\N	2025-09-24 08:25:35.595	2025-09-24 12:26:57.708	Business	\N	\N	\N	\N	5	dhana sree reddy	\N	\N	\N	\N	PD	\N	\N	\N
109	753	Business	47	Completed	df	{"assetDetails": {"assets": [{"address": "Hdj", "mortgaged": "yes", "ownerName": "Hdjdj", "marketValue": "66", "areaMeasured": "25", "purchaseCost": "25", "purchaseYear": "1980"}], "status": "positive", "remarks": "Good", "vehicles": "Car", "otherIncome": "Bithjkk", "observations": "Not joking", "siteCoordinates": "Hdjdjdioo", "lifeInsuranceMediclaim": "Life", "capitalInvestedBusiness": "Cap", "liquidMoveableMonetaryItems": "Hdj"}, "basicDetails": {"phoneNo": "3245678345", "applicantName": "fdzfg", "nameOfConcern": "sdf", "initiatedAddress": "df"}, "existingLoans": {"loans": [{"emi": "55", "tenure": "55", "purpose": "Ff", "bankName": "Ff", "loanAmount": "55"}]}, "familyDetails": [{"age": "656", "name": "H", "relation": "Sister", "mobileNumber": "6665686868", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Uus", "statusOfLabour": "permanent", "numberOfLabours": "25", "workingHoursEnd": "05:56", "statusOfEmployee": "permanent", "numberOfEmployees": "356", "workingHoursStart": "09:56", "wagesPerMonthPerDay": "36", "otherMajorExpenditure": "Jo", "salaryPerMonthPerEmployee": "236"}, "clientsDebtors": {"turnover": "6", "netMargins": "6", "creditPeriod": "656", "customer1Name": "Jdj", "customer2Name": "", "customer3Name": "", "customer1Phone": "65665686686", "customer2Phone": "", "customer3Phone": "", "customer1Review": "positive", "customer2Review": "", "customer3Review": "", "customer1Location": "Jdj", "customer2Location": "", "customer3Location": "", "cashChequeProportions": "Ui", "numberOfFixedCustomers": "656", "averageStockMaintenance": "6"}, "thirdPartyCheck": {"checks": [{"tpcName": "Hdj", "comments": "Hdj", "mobileNumber": "3568668664", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Hdh"}, {"value": "Hdj"}]}, "suppliersCreditors": {"suppliers": [{"name": "G", "phone": "364646566566", "review": "positive", "location": "Hdh"}], "creditPeriod": "2", "cashChequeProportions": "T", "numberOfFixedSuppliers": "2"}, "shareholdingDetails": {"shareholders": [{"name": "Hdj", "designation": "Hdh", "shareholdingPercentage": "56", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "mother", "functionalOfPartnerDirector": "Hdh"}]}}	\N	2025-09-25 10:23:49.489	2025-09-25 10:27:53.573	Business	\N	\N	\N	\N	20	sdf	f	\N	\N	\N	PD	\N	\N	\N
115	768	Business	44	Pending	madhapur\n	\N	\N	2025-09-26 07:14:22.104	2025-09-26 07:14:22.104	\N	\N	\N	\N	\N	5	dhana	\N	\N	\N	\N	PD	\N	\N	\N
121	770	Business	44	Pending	Kowetha Telangana pin no:500085	\N	\N	2025-09-26 11:25:26.46	2025-09-26 11:25:26.46	\N	\N	\N	\N	\N	5	dhana	\N	\N	\N	\N	PD	\N	\N	\N
127	817	Business	47	Pending	wergges	{"basicDetails": {"phoneNo": "4356342545", "applicantName": "test2", "nameOfConcern": "fish", "initiatedAddress": "wergges"}, "existingLoans": {"loans": [{"emi": "50", "tenure": "5", "purpose": "Farm", "bankName": "Axiss", "loanAmount": "50000"}, {"emi": "55", "tenure": "50", "purpose": "Business ", "bankName": "Axis1", "loanAmount": "500000"}]}, "familyDetails": [{"age": "55", "name": "Ramama", "relation": "Father", "mobileNumber": "6666665888", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}, {"age": "50", "name": "Sirasa ", "relation": "Mother", "mobileNumber": "8966575555", "otherRelation": "", "employmentType": "Homemaker", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "Goodd", "statusOfLabour": "permanent", "numberOfLabours": "60", "workingHoursEnd": "04:25", "statusOfEmployee": "permanent", "numberOfEmployees": "55", "workingHoursStart": "09:11", "wagesPerMonthPerDay": "60", "otherMajorExpenditure": "No other expenses ", "salaryPerMonthPerEmployee": "600000"}, "bankingDetails": {"assets": "Assests1", "bankAccounts": [{"type": "Personal ", "account": "28658955", "bankName": "Axissddg", "averageBalance": "500000", "numberOfYearsMaintained": "55"}, {"type": "Personal", "account": "6466592956", "bankName": "Finnn", "averageBalance": "500000", "numberOfYearsMaintained": "50"}], "licMutualFunds": "Lic/mutual funds"}, "financeDetails": {"shareholders": [{"name": "Share1", "designation": "Headd", "shareholdingPercentage": "45", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Partner"}, {"name": "Name2", "designation": "Head2", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Director "}]}, "businessDetails": {"salesVolume": "55000", "stockSource": "suppliers", "wageExpenses": "60", "profitPerUnit": "5580", "stockHandling": "premises", "typeOfBusiness": "partnership", "numberOfWorkers": "50", "natureOfBusiness": "trader", "yearBusinessStarted": "1999", "majorTransactionMode": "cash", "businessPremisesOwnership": "rented"}, "thirdPartyCheck": {"checks": [{"tpcName": "Neigh", "comments": "Good better", "mobileNumber": "6765656566", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}, {"tpcName": "Neig2", "comments": "Ok bttette", "mobileNumber": "6868656266", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Neutral"}]}, "additionalDetails": {"details": [{"value": "Bsnd"}, {"value": "Jdjdj"}]}, "documentsObserved": {"documents": [{"remarks": "Good ok", "documentName": "Name1", "documentType": "Type1", "documentCategory": "Cat 1"}, {"remarks": "Ok better best", "documentName": "Doc name2", "documentType": "Type2", "documentCategory": "Doc cat2"}]}, "suppliersCreditors": {"suppliers": [{"name": "Raju", "phone": "6565665656", "review": "positive", "location": "Loc1"}, {"name": "Raj2", "phone": "6565665656", "review": "positive", "location": "Loc2"}], "creditPeriod": "5", "cashChequeProportions": "11/20", "numberOfFixedSuppliers": "20"}}	\N	2025-09-29 06:15:07.384	2025-09-29 06:15:07.384	Business	\N	\N	\N	\N	19	fish	f	\N	\N	\N	PD	\N	\N	\N
133	843	Business	47	Pending	sfzgdxf	\N	\N	2025-09-29 13:47:48.869	2025-09-29 13:47:48.869	\N	\N	\N	\N	\N	19	sgdh	\N	\N	\N	\N	PD	\N	\N	\N
138	873	Business	47	Pending	wfef	{"netWorth": {"netWorth": [{"ownerName": "Hdhd", "typeOfProperty": "Yzh", "yearsOfOwnership": "Udh", "approxMarketValue": "Ydy"}, {}]}, "caseDetails": {"contactNo": "888880815", "personMet": "Per met", "coApplicant": "Co-app", "dateOfVisit": "11-20-2024", "addressVisited": "Add vus", "meetingDetails": "Meet details", "typeOfBorrower": "Typ bor", "nameOfApplicant": "Name", "referenceNumber": "Refernce"}, "particulars": {"coordinates": "Yshdh"}, "basicDetails": {"phoneNo": "2554322343", "applicantName": "test7", "nameOfConcern": "adsfd", "initiatedAddress": "wfef"}, "loansDetails": {"loansDetails": [{"os": "Y+\\"+", "emi": "5", "product": "Shdh", "remarks": "Hdhdh", "loanAmount": "2000", "nameOfBankInstitution": "Dhd"}, {}]}, "familyDetails": {"aboutApplicant": "Ydhd", "aboutCoApplicant": "Shdh", "andTheirFamilyDetails": "Hdhd"}, "outputsSupply": {"creditTerms": "Hdh", "marketForOutput": "Udh", "modeOfMarketing": "Hhd", "typeOfCustomers": "Dhdh", "stockOfFinishedGoods": "Dhdh"}, "businessDetails": {"margins": "Ydyd", "gstNumber": "Dhdh", "legalName": "Dhhd", "tradeName": "Dhdh", "shopAddress": "Ydhdhdy", "businessName": "Ydhdh", "typeOfEntity": "Shdh", "establishment": "Hdhd", "godownAddress": "Hdhdhdh", "lastGSTReturn": "Dhdhd", "shopOwnership": "Owned", "productDetails": "Hdhd", "businessProcess": "Dhhd", "godownOwnership": "", "activityObserved": "Duud", "natureOfBusiness": "Gshd", "documentsObserved": "Zhzh"}, "employeeDetails": {"pfEsiApplied": "Hdh", "noOfEmployees": "56", "salaryDetails": "Hdh"}, "inputsPurchases": {"orderCycle": "Dhdh", "creditTerms": "Udud", "avgOrderQnty": "Dhdh", "detailsOfInputs": "Dh", "purchaseDetails": "Dhhd"}, "tradeReferences": {"suppliers": [{"contactDetails": "6637373777", "nameOfSuppliers": "Udhd"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "Hshd", "name": "Gg", "remarks": "Hdjd", "relation": "Hdjd", "occupation": "Hdjd", "qualification": "Yy"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Shsh", "sourceOfIncome": "Sh"}]}, "applicantsMainBankingDetails": {"endUse": "Shdy", "remarks": "Sghd", "bankName": "Ydh", "noOfYear": "68", "accountType": "Hdhdh", "limitOfCCOD": "Dhxh", "particulars": "Dhhd", "ownContribution": "Shdh", "accountHolderName": "Shdhdh", "remarksAdditional": "Dhdh"}}	\N	2025-10-03 11:43:27.316	2025-10-03 11:43:27.316	Business	\N	\N	\N	\N	10	adsfd	f	\N	\N	\N	PD	\N	\N	\N
81	124	Business	44	Completed	Kondapur	{}	\N	2025-09-10 11:13:51.067	2025-09-22 09:15:52.346	Business	\N	\N	\N	\N	5	beyondscale	f	\N	\N	\N	PD	\N	\N	\N
92	654	Business	47	Completed	EFEWF	{"familyDetails": [{"age": "656", "name": "Jdj", "relation": "Father", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "shareholdingDetails": {"shareholders": [{"name": "Yy", "designation": "Hsh", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Bdh"}]}}	\N	2025-09-23 09:05:37.805	2025-09-23 09:08:24.124	Business	\N	\N	\N	\N	20	ADS	\N	\N	\N	\N	PD	\N	\N	\N
98	709	Business	47	Pending	ega	\N	\N	2025-09-24 08:48:08.413	2025-09-24 08:48:08.413	\N	\N	\N	\N	\N	19	qtge	\N	\N	\N	\N	PD	\N	\N	\N
152	890	Business	47	Pending	kjb	{"basicDetails": {"phoneNo": "3464545545", "applicantName": "test9", "nameOfConcern": "hjhhk", "initiatedAddress": "kjb"}, "commonPoints": {"concerns": "Hdhz", "employees": "Zhdh", "netMargin": "Hddh", "netProfit": "Hdhs", "otherIncomes": "Xhzh", "majorExpenses": "Zysy", "monthlyExpenses": "Dhdh", "otherObservation": "Hdhxhd", "numberOfEmployees": "Dhdh", "monthlyGrossReceipts": "Ydhd", "neighborCheckThirdParty": "Hdhdh", "monthlyHouseholdExpenses": "Zhzh"}, "businessDetails": {"income": "Tggbh", "itrFiled": "Yes", "gstNumber": "Ghhhh", "salesVolume": "Fdhbk", "stockSource": "Yyy", "businessName": "Gg", "wageExpenses": "556", "profitPerUnit": "566", "stockHandling": "Tyh", "typeOfBusiness": "Private Limited", "gstRegistration": "Yes", "numberOfWorkers": "456", "aboutTheBusiness": "Udj", "natureOfBusiness": "Ty", "regularCustomers": [{"nameOfRegularCustomers": "Yh", "contactNumberOfRegularCustomers": "Tyy"}, {"nameOfRegularCustomers": "Yvb", "contactNumberOfRegularCustomers": "6678"}], "regularSuppliers": [{"nameOfRegularSuppliers": "Bhh", "contactNumberOfRegularSuppliers": "Ghh"}, {"nameOfRegularSuppliers": "Th", "contactNumberOfRegularSuppliers": "Ggg"}], "documentsObserved": "Ghh", "stockLevelObserved": "Ggg", "yearBusinessStarted": "656", "majorTransactionMode": "667", "businessActivityObserved": "Ghh", "businessPremisesOwnership": "Tyh"}, "applicantDetails": {"pdDate": "Shshdh", "product": "LAP", "pdAddress": "Office", "personMet": "Dhhdxh", "loanAmount": "2727", "customerName": "Gdhs", "applicationId": "Hdhs", "applicationNo": "Gsh", "contactNumber": "Hdhdhdh", "relationshipWithBorrower": "Guarantor"}, "familyBackground": {"familyMembers": [{"age": "45", "name": "Name1", "dependent": "Yes", "occupation": "Off", "qualification": "Qua", "incomePerMonth": "2500", "relationToApplicant": "Atta"}, {"age": "Gshs", "name": "Hsh", "dependent": "Ysh", "occupation": "Yeh", "qualification": "Ysh", "incomePerMonth": "Hdhs", "relationToApplicant": "Gshw"}], "noOfEarningMembers": "25", "totalFamilyMembers": "25"}, "businessPlaceVintage": {"nameOfFirm": "Name of firm", "constitution": "Proprietorship", "isResiCumOffice": "Yes", "previousEmployment": "Udhdh", "whoStartedBusiness": "acquired", "yearsInCurrentCity": "25", "yearsInCurrentOffice": "25", "yearsInCurrentBusiness": "25", "ownershipOfBusinessPlace": "owned"}, "otherDetailsObserved": {"stockSeen": "Yes", "noOfMachinesSeen": "55", "noOfEmployeesSeen": "252", "businessActivitySeen": "Yes", "top3ClientsCustomers": [{"name": "Th", "location": "Ggh", "contactDetails": "Ggh"}, {"name": "Tg", "location": "Hdhd", "contactDetails": "Gsh"}, {"name": "Ydh", "location": "Ydy", "contactDetails": "Hdh"}], "top3ClientsSuppliers": [{"name": "Hdbx", "location": "Hdh", "contactDetails": "Hdh"}], "businessNameBoardSeen": "Yes", "neighborCheckThirdParty": "Hhd", "otherObservationsRemarks": "Hdhd", "otherBusinessIncomeSource": "Yh"}, "businessFinancialProfile": {"natureOfBusiness": "Trading", "productServicesOffered": "Jdjdj", "businessModelBackground": "Dj"}}	\N	2025-10-07 08:12:03.234	2025-10-07 08:12:03.234	Business	\N	\N	\N	\N	19	hjhhk	f	\N	\N	\N	PD	\N	\N	\N
155	893	Business	47	Pending	ascf	{"bankDetails": {"avgBal": "Dydy", "primaryBanker": "F", "natureOfAccount": "Hdhd"}, "basicDetails": {"phoneNo": "2435465753", "nameOfEntity": "Dhhd", "applicantName": "test10", "nameOfConcern": "scas", "nameOfApplicant": "Gd", "initiatedAddress": "ascf", "nameOfCoApplicants": "Td"}, "otherDetails": {"assets": "Dydyd", "liabilities": [{"emi": "Sydy", "bank": "Dhx", "amount": "Sydy", "tenure": "Ydg", "natureOfLoan": "Sydy", "outstandingBalance": "Ydy"}, {"emi": "Dd", "bank": "Yxh", "amount": "Dydyd", "tenure": "Dtdy", "natureOfLoan": "Dydy", "outstandingBalance": "Ddy"}], "anyCourtCases": "no", "businessIndustry": "Ydyd", "politicalConnection": "Yes", "endUseOfProposedLoan": "Ydydy", "otherBusinessIncomeDetails": "Dhx"}, "familyDetails": {"familyDetails": [{"age": "Dydy", "name": "Dhd", "relation": "Dydy", "profession": "Dydy", "monthlyIncome": "Eye y", "qualification": "Dydy"}, {"age": "Dydy", "name": "Udu", "relation": "Ydyd", "profession": "Dydy", "monthlyIncome": "Dyd", "qualification": "Dydy"}]}, "officeAddress": {"add": "Dydysy", "ownedBy": "Ydyd", "areaSqFt": "Dydy", "rentedOwned": "Rented", "cmvRentPerMonth": "5353", "occupiedSinceYears": "353"}, "businessDetails": {"stockAsOnDate": "Dydyd", "currentBusinessDetails": "Yd"}, "customerDetails": {"customers": [{"debtorDays": "Hdh", "nameOfCustomer": "Ydhd", "percentageOfTotalSales": "Shdy", "relationshipSinceYears": "Ydhd"}, {"debtorDays": "Ydy", "nameOfCustomer": "Ydh", "percentageOfTotalSales": "Ydyyd", "relationshipSinceYears": "Ydyd"}], "totalCustomersNo": "5353", "totalDebtorsAsOnDate": "6565"}, "supplierDetails": {"suppliers": [{"creditorDays": "Hdyd", "nameOfSupplier": "Dyd", "relationshipSinceYears": "Ydyd", "percentageOfTotalPurchases": "Dydy"}, {"creditorDays": "St dy", "nameOfSupplier": "Dhd", "relationshipSinceYears": "Dydy", "percentageOfTotalPurchases": "DD y"}], "totalSuppliersNo": "553", "totalCreditorsAsOnDate": "35"}, "employeesDetails": {"salaryRange": "Dhdh", "keyEmployeeName": "Dhdy", "currentEmployees": "Ydh"}, "residentialAddress": {"add": "Ehddh", "ownedBy": "Td y", "areaSqFt": "Hdhd", "rentedOwned": "Rented", "cmvRentPerMonth": "5335", "occupiedSinceYears": "655", "addressOfPDAndPersonMet": "Dyd"}, "документы": {"panCard": "Ydhd", "otherDocumentSeen": "Dhdy"}, "proposedLoanDetails": {"amount": "Yef", "tenure": "Dhdh", "product": "Or", "bankName": "Hdy", "accountNo": "Dhdy", "repaymentFrom": "Dhdh", "typeSAAccount": "Hdyd"}, "salesAndProfitDetails": {"profitMargin": "Dydy", "netMonthlyIncome": "Dydy", "turnoverFY202425": "Dhd", "cashSalesPercentage": "5353", "expTurnoverFY202526": "Ydy", "monthlyTurnoverSales": "Dydy", "covidEffectOnTurnover": "Dydy", "postLockdownBusinessSpeed": "Ydyd"}, "siteVisitObservations": {"landmark": "Ydydddy", "neighborhood": "Yfyd", "stockSeenDuringPD": "Yes", "officeWellFurnished": "Yes", "businessActivitySeen": "Yes", "anyDecreaseInNetWorth": "Yes", "thirdPartyConfirmation": "Tttt", "noOfCustomersSeenDuringPD": "222", "noOfEmployeesSeenDuringPD": "333", "difficultyInLocatingPremises": "no", "abnormalIncreaseDecreaseInTurnover": "Yes"}, "valueAddedInformation": {"strengths": "Dydy", "weaknesses": "Dydy", "customerBehavior": "Good", "digitalWalletUsed": "Ydyd", "utilityBillDetails": "Ddydy", "customerShopLocality": "Main Road", "nearbyTransportStand": "Hdydydy", "lossSufferedInBusiness": "Gd d", "neighborhoodShopsNature": "Tere yd", "salariesPaidDuringCovid": "Partial", "salaryDeductionPercentage": "25"}}	\N	2025-10-07 10:12:24.688	2025-10-07 10:12:24.688	Business	\N	\N	\N	\N	19	scas	f	\N	\N	\N	PD	\N	\N	\N
160	902	Business	44	Pending	kodapur	\N	\N	2025-10-08 04:44:22.122	2025-10-08 04:44:22.122	\N	\N	\N	\N	\N	5	dhana sree	\N	\N	\N	\N	PD	\N	\N	\N
110	741	Business	44	Pending	fggb	\N	\N	2025-09-25 10:35:40.751	2025-09-25 10:35:40.751	\N	\N	\N	\N	\N	5	egn	\N	\N	\N	\N	PD	\N	\N	\N
104	732	Business	41	Completed	madhapur	{"assetDetails": {"assets": [{"address": "Banjara hills", "mortgaged": "yes", "ownerName": "Raju", "marketValue": "300", "areaMeasured": "1000", "purchaseCost": "200", "purchaseYear": "1980"}], "status": "positive", "remarks": "None", "vehicles": "Honda- Unicorn ", "otherIncome": "None", "observations": "None", "siteCoordinates": "1960", "lifeInsuranceMediclaim": "Yes", "capitalInvestedBusiness": "Yes", "liquidMoveableMonetaryItems": "Yes"}, "basicDetails": {"phoneNo": "9494525451", "noOfVisit": "2", "personMet": "applicant", "constitution": "private_limited", "applicantName": "KATEVADA KAVITHA", "nameOfConcern": "dhana sree reddy ", "aboutApplicant": "Well mannered", "visitedAddress": "Madhapur", "structureOfLoan": "term_loan", "appointmentFixed": "yes", "initiatedAddress": "madhapur", "coApplicantDetails": "Good co applicant", "residentialDetails": "Good house"}, "existingLoans": {"loans": [{"emi": "20", "tenure": "10", "purpose": "Home", "bankName": "Axis", "loanAmount": "20000"}]}, "familyDetails": [{"age": "20", "name": "Raj", "relation": "Son", "mobileNumber": "8989898989", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}], "salariesWages": {"salariesWages": {"remarks": "None", "statusOfLabour": "contractual", "numberOfLabours": "0", "workingHoursEnd": "07:00", "statusOfEmployee": "permanent", "numberOfEmployees": "200", "workingHoursStart": "10:00", "wagesPerMonthPerDay": "0", "otherMajorExpenditure": "None", "salaryPerMonthPerEmployee": "30000"}}, "clientsDebtors": {"clientsDebtors": {"turnover": "400", "netMargins": "6000", "creditPeriod": "24", "customer1Name": "RTYY", "customer1Phone": "2453564685", "customer1Review": "positive", "customer1Location": "DG", "cashChequeProportions": "30/37", "numberOfFixedCustomers": "20", "averageStockMaintenance": "200"}}, "thirdPartyCheck": {"checks": [{"tpcName": "Mukesh", "comments": "Sold his 2 golden bangles", "mobileNumber": "8888888888", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Remarks 1"}, {"value": "Remarks 2"}, {"value": "Remarks 3"}]}, "suppliersCreditors": {"suppliersCreditors": {"suppliers": [{"name": "Arvind", "phone": "9999999998", "review": "positive", "location": "Hyderabad "}, {"name": "SSSD", "phone": "4356354657", "review": "positive", "location": "SDG"}], "creditPeriod": "25", "cashChequeProportions": "12/30", "numberOfFixedSuppliers": "20"}}, "familyMemberDetails": [{"age": "20", "name": "Raj", "relation": "Son", "mobileNumber": "8989898989", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "No", "educationalQualification": "12th Pass"}, {"age": "25", "name": "Vvv", "relation": "Father", "mobileNumber": "2353457457", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "shareholdingDetails": {"shareholders": [{"name": "Shanmukh", "designation": "Manager", "shareholdingPercentage": "51", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Function"}, {"name": "vinay", "designation": "yt", "shareholdingPercentage": "28", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Fucntion"}]}}	\N	2025-09-25 04:35:37.992	2025-09-26 07:09:08.057	Business	<ul><li><br></li></ul>	Positive	\N	\N	5	dhana sree reddy 	\N	\N	\N	\N	PD	{"rent": 0, "sales": 0, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 0, "insurance": 0, "netProfit": 0, "bankCharges": 0, "grossProfit": 0, "closingStock": 0, "depreciation": 0, "openingStock": 0, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	test 1. test 2	\N
116	769	Business	44	Completed	hbhbj	{"timestamp": "2025-09-26T06:29:43.732Z", "sectionData": {"timestamp": "2025-09-26T06:25:26.559Z", "sectionData": {"basicDetails": {"phoneNo": "9493344180", "applicantName": "hjbjhb", "nameOfConcern": "v h ", "initiatedAddress": "hbhbj"}, "familyDetails": [{"age": "60", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law ", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "bankingDetails": {"assets": "Car", "bankAccounts": [{"type": "Cvv", "account": "96369632588666988888", "bankName": "Indian ", "averageBalance": "36", "numberOfYearsMaintained": "15"}], "licMutualFunds": "Mut"}}, "basicDetails": {"phoneNo": "9493344180", "applicantName": "hjbjhb", "nameOfConcern": "v h ", "initiatedAddress": "hbhbj"}, "investigable": true, "existingLoans": {"loans": [{"emi": "60000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian 1", "loanAmount": "39006900"}]}, "familyDetails": [{"age": "60", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law ", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "bankingDetails": {"assets": "Car", "bankAccounts": [{"type": "Cvv", "account": "96369632588666988888", "bankName": "Indian ", "averageBalance": "36", "numberOfYearsMaintained": "15"}], "licMutualFunds": "Mut"}}, "basicDetails": {"phoneNo": "9493344180", "applicantName": "hjbjhb", "nameOfConcern": "v h ", "initiatedAddress": "hbhbj"}, "investigable": true, "existingLoans": {"loans": [{"emi": "60000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian 1", "loanAmount": "39006900"}]}, "familyDetails": [{"age": "60", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law ", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "Remarks 1 ", "statusOfLabour": "permanent", "numberOfLabours": "400", "workingHoursEnd": "12:04", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "11:00", "wagesPerMonthPerDay": "500", "otherMajorExpenditure": "Remarks 2", "salaryPerMonthPerEmployee": "300"}, "bankingDetails": {"assets": "Car", "bankAccounts": [{"type": "Cvv", "account": "96369632588666988888", "bankName": "Indian ", "averageBalance": "36", "numberOfYearsMaintained": "15"}], "licMutualFunds": "Mut"}, "financeDetails": {"shareholders": [{"name": "Fgg", "designation": "Fcg", "shareholdingPercentage": "55", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "mother", "functionalOfPartnerDirector": "Ggg"}]}, "businessDetails": {"salesVolume": "68", "stockSource": "Suppliers", "wageExpenses": "500", "profitPerUnit": "50", "stockHandling": "Premises", "typeOfBusiness": "Private Limited", "numberOfWorkers": "300", "natureOfBusiness": "Service Provider", "yearBusinessStarted": "2019", "majorTransactionMode": "Cash", "businessPremisesOwnership": "Owned"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vhb", "comments": "Vvb", "mobileNumber": "5699089999", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "V b "}, {"value": " Bb"}]}, "documentsObserved": {"shareholders": [{"name": "Hghh", "designation": "Fff", "shareholdingPercentage": "88", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Rf"}]}, "suppliersCreditors": {"suppliers": [{"name": "Mohan ", "phone": "9966336699", "review": "positive", "location": "Jjj"}], "creditPeriod": "400", "cashChequeProportions": "300", "numberOfFixedSuppliers": "500"}}	\N	2025-09-26 07:19:32.07	2025-09-26 07:38:00.464	Business	\N	\N	\N	\N	5	vgbvghvhb	\N	\N	\N	\N	PD	\N	\N	\N
122	777	Business	47	Pending	svdzbf	{"basicDetails": {"phoneNo": "3564345647", "applicantName": "akraaaa", "nameOfConcern": "cdvf", "initiatedAddress": "svdzbf"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "5", "purpose": "Shop", "bankName": "Axis", "loanAmount": "100000"}]}, "familyDetails": [{"age": "55", "name": "Ramm", "relation": "Father", "mobileNumber": "3868668666", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}, {"age": "54", "name": "Hdhd", "relation": "Mother", "mobileNumber": "6468338386", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "Good", "statusOfLabour": "permanent", "numberOfLabours": "646", "workingHoursEnd": "05:07", "statusOfEmployee": "permanent", "numberOfEmployees": "255", "workingHoursStart": "10:07", "wagesPerMonthPerDay": "555", "otherMajorExpenditure": "Noi", "salaryPerMonthPerEmployee": "20000"}, "bankingDetails": {"assets": "Yes assests", "bankAccounts": [{"type": "Hdhdh", "account": "64665656", "bankName": "Axis", "averageBalance": "55000", "numberOfYearsMaintained": "50"}, {"type": "Gshdj", "account": "64664665", "bankName": "Dhamsn", "averageBalance": "555000", "numberOfYearsMaintained": "50"}], "licMutualFunds": "Lic"}, "financeDetails": {"shareholders": [{"name": "Ghkll", "designation": "Gh", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Xcg"}]}, "businessDetails": {"salesVolume": "188", "stockSource": "Suppliers", "wageExpenses": "100000", "profitPerUnit": "20", "stockHandling": "Premises", "typeOfBusiness": "Partnership", "numberOfWorkers": "255", "natureOfBusiness": "Trader", "yearBusinessStarted": "1999", "majorTransactionMode": "Cash", "businessPremisesOwnership": "Rented"}, "thirdPartyCheck": {"checks": [{"tpcName": "Rd", "comments": "Edd", "mobileNumber": "555", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Ee"}, {"value": "Fff"}]}, "documentsObserved": {"shareholders": [{"name": "Randy", "designation": "Head", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Director"}, {"name": "Ghj", "designation": "Head 2", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Director "}]}, "suppliersCreditors": {"suppliers": [{"name": "Hsh", "phone": "9596465656", "review": "positive", "location": "Hyd"}, {"name": "Hsj", "phone": "6656566565", "review": "positive", "location": "Hytfg"}], "creditPeriod": "20", "cashChequeProportions": "10/20", "numberOfFixedSuppliers": "20"}}	\N	2025-09-26 11:53:46.545	2025-09-26 11:53:46.545	Business	\N	\N	\N	\N	19	cdvf	f	\N	\N	\N	PD	\N	\N	\N
128	828	Business	47	Pending	esrhf	\N	\N	2025-09-29 07:30:57.642	2025-09-29 07:30:57.642	\N	\N	\N	\N	\N	20	ddfgfh	\N	\N	\N	\N	PD	\N	\N	\N
134	845	Business	47	Completed	scvada	{"performance": {"anyChequeBounces": "yes", "detailsOfCollateral": "Details are collateral"}, "basicDetails": {"phoneNo": "3456764534", "personMet": "co_applicant", "applicantName": "test6", "contactNumber": "6768686688", "nameOfConcern": "dwafvd", "initiatedAddress": "scvada", "relationshipWithBorrower": "Friends "}, "commonPoints": {"salesFluctuations": "No fluctuations ", "turnoverAndMargin": "45009 and 6lak", "charteredAcDetails": "Av details", "customerIdentityEstablishedDuringPD": "Identify card", "loansTakenFromFamilyFriendsBusinessAssociates": "Not taken"}, "existingLoans": {"loans": [{"emi": "6", "tenure": "5", "purpose": "Farm", "bankName": "Indian", "loanAmount": "50"}]}, "familyDetails": [{"age": "55", "name": "Raj", "relation": "Father", "mobileNumber": "6566656566", "otherRelation": "", "employmentType": "NRI", "stayingWithApplicant": "Yes", "educationalQualification": "PG/Professional Certification"}], "bankingDetails": {"assets": "Asset1,23", "bankAccounts": [{"type": "Saving", "account": "686866868", "bankName": "Bank1", "averageBalance": "5000000", "numberOfYearsMaintained": "5"}], "licMutualFunds": "Lic present"}, "clientsDebtors": {"customers": [{"name": "Rahhh", "phone": "6468668668", "review": "positive", "location": "Loc1"}]}, "businessDetails": {"constitution": "sole_proprietorship", "prevEmployment": "Yes - rah", "whoStartedBusiness": "acquired", "yearsInCurrentCity": "15", "isResidenceCumOffice": "yes", "yearsInCurrentOffice": "19", "ownershipOfBusinessPlace": "self_owned"}, "businessProfile": {"natureOfBusiness": "manufacturing", "productServicesOffered": "Many servic", "businessModelAndBackground": "Fishing mart"}, "thirdPartyCheck": {"checks": [{"tpcName": "Rajj", "comments": "Good better", "mobileNumber": "6656876868", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Tety"}, {"value": "Hehhd"}]}, "suppliersCreditors": {"suppliers": [{"name": "Hsjs", "phone": "6165656656", "review": "positive", "location": "Raksm"}]}, "miscelleanousDetails": {"stockSeen": "yes", "noOfMachinesSeen": "25", "noOfEmployeesSeen": "25", "businessActivitySeen": "yes", "businessNameBoardSeen": "yes", "anyOtherObservationsOrRemarksDuringVisit": "Yes reamaks", "anyOtherBusinessOrAlternativeIncomeSource": "Yes alternative present"}, "workingCapitalDetails": {"limit": "5", "bankName": "Indian limited", "collateral": "Collateral ", "utilization": "Utilizes ", "linkedLoansIfAny": "No linked", "endOfProposedLoans": "1980 end of proposed loan"}}	\N	2025-09-29 15:00:11.639	2025-09-29 15:20:54.121	Business	\N	\N	\N	\N	12	dwafvd	\N	\N	\N	\N	PD	\N	\N	\N
139	874	AddressOne	11	Pending	Vijayawada	\N	\N	2025-10-06 05:06:44.09	2025-10-06 05:06:44.09	\N	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	FI	\N	\N	\N
140	874	AddressTwo	11	Pending	Vijayawada	\N	\N	2025-10-06 05:07:06.402	2025-10-06 05:07:06.402	\N	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	FI	\N	\N	\N
48	65	Business	7	Completed	ayyapa society	{"basicDetails": {"aadhar": "232355555554", "panNumber": "HAJPP4839Q", "businessName": "dhana sree ", "applicantName": "mohan reddy", "isAddressSame": "Yes", "businessAddress": "ayyapa society", "businessProfile": "Retail ", "isBusinessNameSame": "Yes", "isApplicantAvailable": "Yes"}, "existingLoans": {"loans": [{"emi": "963", "tenure": "2", "purpose": "Laptop 💻", "bankName": "Test bank", "loanAmount": "20000"}]}, "miscellaneous": {"stockSeen": "Yes", "rentalAmount": "", "employeesSeen": "55", "areaOfPremises": "250 to 400 Sq.ft", "businessActivity": "", "localityOfBusiness": "Commercial", "otherSetupObserved": "Ccv", "ownershipOfPremises": "Owned", "illegalSetupObserved": "", "politicallyConnected": "Yes", "businessActivityOther": "", "privateFinanceOrChits": "", "yearsInCurrentPremises": "555", "employeesUnderApplicant": "88"}, "uploadedItems": [{"id": "1756879146448ybrkimh6xy", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/05d9e54a-f542-43f7-b029-dc909194e880.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.4642426, "locality": "Hyderabad", "longitude": 78.3679227, "timestamp": "2025-09-03T05:59:06.448Z", "s3ImageUrl": "verification/65/1756879145803-540qi9.jpg", "isOverlayNeeded": true}], "businessDetails": {"geoTag": "17.4642849,78.3679664", "constitution": "Trust", "nameBoardSeen": "Yes", "totalExperience": "4", "nameBoardMatched": "Yes", "businessStartYear": "2012", "isAddressTraceable": "Yes", "isBusinessSeasonal": "Yes"}, "thirdPartyCheck": {"checks": [{"tpcName": "Testing man", "comments": "Moon", "mobileNumber": "9912994741", "relationship": "Neighbor", "feedbackStatus": "Positive"}, {"tpcName": "te", "comments": "sddd", "mobileNumber": "4642456543", "relationship": "Neighbor", "feedbackStatus": "Positive"}]}}	\N	2025-08-29 06:37:09.086	2025-10-06 10:59:21.97	Business	<ul><li>gjoidajuihd</li></ul>	Positive	\N	\N	38	dhana sree 	\N	\N	\N	\N	FI	\N	\N	\N
93	659	Business	47	Completed	er	{"clientsDebtors": {"turnover": "64656", "netMargins": "6768686", "creditPeriod": "646", "customer1Name": "Gsh", "customer2Name": "Gsh", "customer3Name": "Gdh", "customer1Phone": "64665", "customer2Phone": "6766868", "customer3Phone": "6766", "customer1Review": "positive", "customer2Review": "positive", "customer3Review": "positive", "customer1Location": "Hshd", "customer2Location": "Hdhhd", "customer3Location": "Hdhdh", "cashChequeProportions": "Ghs", "numberOfFixedCustomers": "6656", "averageStockMaintenance": "67686"}, "suppliersCreditors": {"creditPeriod": "665", "supplier1Name": "Ggs", "supplier2Name": "Hhs", "supplier3Name": "Gdg", "supplier1Phone": "667", "supplier2Phone": "3766763436", "supplier3Phone": "55676", "supplier1Review": "positive", "supplier2Review": "positive", "supplier3Review": "positive", "supplier1Location": "Ggs", "supplier2Location": "Gzgh", "supplier3Location": "Hhdh", "cashChequeProportions": "Hdh", "numberOfFixedSuppliers": "668"}}	\N	2025-09-23 09:32:30.047	2025-09-23 09:36:49.235	Business	\N	\N	\N	\N	20	wfe	\N	\N	\N	\N	PD	\N	\N	\N
82	183	AddressOne	14	Pending	beyscale	\N	\N	2025-09-12 04:40:55.712	2025-09-12 04:40:55.712	\N	\N	\N	\N	\N	38	\N	\N	\N	\N	\N	FI	\N	\N	\N
79	100	Business	44	Completed	konkondapur	{"basicDetails": {"address": "konkondapur", "bankName": "TATA CAPITAL LIMITED", "loanAmount": "2000", "businessName": "retail business", "mobileNumber": "9949007272", "applicantName": "mohan reddy", "applicationNumber": "mohan110077"}, "existingLoans": {"loans": [{"emi": "", "tenure": "", "purpose": "", "bankName": "", "loanAmount": ""}]}, "uploadedItems": [{"id": "1757394595573tt265ig257", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/21fa0250-fde5-4ee7-b147-9727b4b7b107.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.4642646, "locality": "Hyderabad", "longitude": 78.3679297, "timestamp": "2025-09-09T05:09:55.573Z", "s3ImageUrl": "verification/undefined/1757394594514-fbuv34.jpg", "isOverlayNeeded": true}], "businessDetails": {"netMargin": "2525555555633658888555985598888888888888855555555555555", "businessType": "test type ", "occupiedSince": "2525555555633658888555985598888888888888855555555555555", "stockObserved": "52525555555633658888555985598888888888888855555555555555", "natureOfBusiness": "Service Provider", "businessStartYear": "2525555555633658888555985598888888888888855555555555555", "employeesDeclared": "2525555555633658888555985598888888888888855555555555555", "employeesObserved": "765", "rawMaterialSupplier": "2525555555633658888555985598888888888888855555555555555", "businessPremisesSize": "100-500 sq.ft", "constitutionOfBusiness": "Partnership", "businessActivityObserved": "Wholesaletxgfv"}, "thirdPartyCheck": {"checks": [{"tpcName": "", "comments": "", "mobileNumber": "", "relationship": ""}]}, "applicantDetails": {"age": "", "education": "", "maritalStatus": "", "yearsInCurrentCity": "", "yearsAtCurrentAddress": ""}, "additionalDetails": {"details": [{"value": ""}]}, "familyMemberDetails": [{"age": "6", "name": "Vvb", "relation": "Mother", "mobileNumber": "9912994741", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}]}	\N	2025-09-09 04:48:36.045	2025-09-15 07:50:34.596	Business	\N	\N	\N	\N	5	retail business	\N	\N	\N	\N	PD	\N	\N	\N
111	759	Business	44	Completed	kondapur	{"assetDetails": {"assets": [{"address": "Car bike gold sugar cane machine ", "mortgaged": "yes", "ownerName": "Sarala", "marketValue": "30", "areaMeasured": "200", "purchaseCost": "30", "purchaseYear": "15"}], "status": "positive", "remarks": "Remarks 1", "vehicles": "Car", "otherIncome": "Other business ", "observations": "Purple ", "siteCoordinates": "Developer company ", "lifeInsuranceMediclaim": "Car", "capitalInvestedBusiness": "Gold", "liquidMoveableMonetaryItems": "Gold"}, "basicDetails": {"phoneNo": "9912994741", "noOfVisit": "2", "personMet": "other", "constitution": "partnership", "applicantName": "kalpana", "nameOfConcern": "beyondscale", "aboutApplicant": "Good applicant", "visitedAddress": "Shaikpet ", "nameOfPersonMet": "Raj", "structureOfLoan": "other", "appointmentFixed": "yes", "initiatedAddress": "kondapur", "coApplicantDetails": "Good ", "residentialDetails": "Owner of the house in madhpur"}, "existingLoans": {"loans": [{"emi": "80000", "tenure": "15", "purpose": "Business development ", "bankName": "Indian ", "loanAmount": "10000000"}]}, "familyDetails": [{"age": "60", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law ", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "12th Pass"}], "salariesWages": {"remarks": "kalpanareddyreddy100@gmail.com", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "15:00", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "14:00", "wagesPerMonthPerDay": "400", "otherMajorExpenditure": "School fees,car petrol,ect", "salaryPerMonthPerEmployee": "400"}, "clientsDebtors": {"turnover": "400", "customers": [{"name": "Anuradha", "phone": "9912994741", "review": "positive", "location": "Madhapur "}], "netMargins": "300", "creditPeriod": "400", "cashChequeProportions": "300", "numberOfFixedCustomers": "500", "averageStockMaintenance": "500"}, "thirdPartyCheck": {"checks": [{"tpcName": "Dhana", "comments": "Good ", "mobileNumber": "9000782279", "relationship": "Other", "otherRelation": "Daughter ", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Owner of the house "}]}, "suppliersCreditors": {"suppliers": [{"name": "Mohan ", "phone": "9949006271", "review": "positive", "location": "Madhapur "}], "creditPeriod": "400", "cashChequeProportions": "300", "numberOfFixedSuppliers": "500"}, "shareholdingDetails": {"shareholders": [{"name": "Padma ", "designation": "House wife ", "shareholdingPercentage": "10", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Qa"}]}}	\N	2025-09-25 11:52:41.735	2025-09-25 12:05:00.931	Business	\N	\N	\N	\N	5	beyondscale	\N	\N	\N	\N	PD	\N	\N	\N
99	714	Business	47	Completed	gWREHT	{"assetDetails": {"assets": [{"address": "Ehzh", "mortgaged": "yes", "ownerName": "Hdhdh", "marketValue": "65656", "areaMeasured": "6565", "purchaseCost": "466", "purchaseYear": "68656"}], "status": "positive", "remarks": "Hshdjjxn", "vehicles": "Hehdhjd", "otherIncome": "Shhdj", "observations": "Hdhdh", "siteCoordinates": "Zhjdkr", "lifeInsuranceMediclaim": "Hshsh", "capitalInvestedBusiness": "Hueujrhfj", "liquidMoveableMonetaryItems": "Hdhs"}, "basicDetails": {"phoneNo": "4456765465", "applicantName": "efsdgs", "nameOfConcern": "wegrsd", "initiatedAddress": "gWREHT"}, "existingLoans": {"loans": [{"emi": "6566", "tenure": "656", "purpose": "Hdhh", "bankName": "Hshh", "loanAmount": "64665"}, {"emi": "646", "tenure": "646", "purpose": "Heheh", "bankName": "Hdh", "loanAmount": "6464"}]}, "familyDetails": [{"age": "65", "name": "Name1", "relation": "Father", "mobileNumber": "3469565656", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}, {"age": "656", "name": "Hxh", "relation": "Brother", "mobileNumber": "6566565656", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "salariesWages": {"salariesWages": {"remarks": "Hdhd", "statusOfLabour": "permanent", "numberOfLabours": "6465", "workingHoursEnd": "17:10", "statusOfEmployee": "permanent", "numberOfEmployees": "65", "workingHoursStart": "09:10", "wagesPerMonthPerDay": "6461", "otherMajorExpenditure": "Hshs", "salaryPerMonthPerEmployee": "65665"}}, "clientsDebtors": {"clientsDebtors": {"turnover": "64656", "netMargins": "64", "creditPeriod": "6868", "customer1Name": "Gdhhd", "customer2Name": "Shdh", "customer3Name": "", "customer1Phone": "64656", "customer2Phone": "65656", "customer3Phone": "", "customer1Review": "positive", "customer2Review": "positive", "customer3Review": "", "customer1Location": "Hhdhd", "customer2Location": "Hdhdh", "customer3Location": "", "cashChequeProportions": "Hdhdh", "numberOfFixedCustomers": "3565", "averageStockMaintenance": "65656"}}, "thirdPartyCheck": {"checks": [{"tpcName": "Hxh", "comments": "Hdh", "mobileNumber": "6566", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Negative"}, {"tpcName": "Hdh", "comments": "Hdh", "mobileNumber": "646", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Hzhdh"}, {"value": "Hdhdh"}, {"value": "Hxhdhjj"}]}, "suppliersCreditors": {"suppliers": [{"name": "Hdh", "phone": "6466566868", "review": "positive", "location": "Hshhe"}, {"name": "Hsh", "phone": "6465", "review": "positive", "location": "Gdhd"}, {"name": "Dhh", "phone": "6465666568", "review": "positive", "location": "Yshdh"}], "creditPeriod": "646", "cashChequeProportions": "G", "numberOfFixedSuppliers": "6"}, "shareholdingDetails": {"shareholders": [{"name": "Heh", "designation": "Ydh", "shareholdingPercentage": "64", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "mother", "functionalOfPartnerDirector": "Hdh"}, {"name": "Hdh", "designation": "Heh", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Yshh"}]}}	\N	2025-09-24 09:37:30.179	2025-09-25 04:55:16.914	Business	\N	\N	\N	\N	20	wegrsdf	\N	\N	\N	\N	PD	{"rent": 0, "sales": 12333, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 12425, "insurance": 0, "netProfit": 12481, "bankCharges": 0, "grossProfit": 12481, "closingStock": 145, "depreciation": 0, "openingStock": 12422, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	\N	\N
105	737	Business	44	Completed	26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003.	{"assetDetails": {"assets": [{"address": "Kondapur ", "mortgaged": "yes", "ownerName": "Dhana sree", "marketValue": "50", "areaMeasured": "200", "purchaseCost": "300", "purchaseYear": "400"}], "status": "positive", "remarks": "Remarks 2", "vehicles": "Bik", "otherIncome": "Business ", "observations": "School ", "siteCoordinates": "Bus", "lifeInsuranceMediclaim": "Car", "capitalInvestedBusiness": "Gold ", "liquidMoveableMonetaryItems": "Cash"}, "basicDetails": {"phoneNo": "9494525451", "applicantName": "ANDE DHANALAKSHMI", "nameOfConcern": "rtdtfy", "initiatedAddress": "26-22-21, Mudunurivari Street,Gandhi Nagar, VIJAYAWADA – 520 003."}, "existingLoans": {"loans": [{"emi": "80000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian ", "loanAmount": "30000000"}]}, "familyDetails": [{"age": "60", "name": "Sudarshan ", "relation": "Other", "mobileNumber": "9908205471", "otherRelation": "Father in law", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "Remarks 1", "statusOfLabour": "permanent", "numberOfLabours": "300", "workingHoursEnd": "00:05", "statusOfEmployee": "permanent", "numberOfEmployees": "400", "workingHoursStart": "13:00", "wagesPerMonthPerDay": "500", "otherMajorExpenditure": "Car petrol ", "salaryPerMonthPerEmployee": "30000"}, "clientsDebtors": {"turnover": "200", "customers": [{"name": "Kalpana ", "phone": "9912994741", "review": "positive", "location": "Madhapur "}], "netMargins": "300", "creditPeriod": "500", "cashChequeProportions": "1000", "numberOfFixedCustomers": "500", "averageStockMaintenance": "100"}, "thirdPartyCheck": {"checks": [{"tpcName": "Eshwaramma ", "comments": "Good remarks ", "mobileNumber": "9966339966", "relationship": "Other", "otherRelation": "Amma ", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Good \\n"}, {"value": "Good company "}]}, "suppliersCreditors": {"suppliers": [{"name": "Mohan ", "phone": "9949006271", "review": "positive", "location": "Madhapur "}], "creditPeriod": "100", "cashChequeProportions": "50", "numberOfFixedSuppliers": "200"}, "shareholdingDetails": {"shareholders": [{"name": "Padma ", "designation": "Homemaker ", "shareholdingPercentage": "10", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "spouse", "functionalOfPartnerDirector": "Food "}]}}	\N	2025-09-25 06:20:02.161	2025-09-25 09:47:32.259	Business	\N	\N	\N	\N	5	rtdtfy	\N	\N	\N	\N	PD	\N	\N	\N
117	772	Business	47	Completed	svdzbf	{"basicDetails": {"phoneNo": "3564345647", "applicantName": "akraaaa", "nameOfConcern": "cdvf", "initiatedAddress": "svdzbf"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "5", "purpose": "Shop", "bankName": "Axis", "loanAmount": "100000"}]}, "familyDetails": [{"age": "55", "name": "Ramm", "relation": "Father", "mobileNumber": "3868668666", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}, {"age": "54", "name": "Hdhd", "relation": "Mother", "mobileNumber": "6468338386", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "Good", "statusOfLabour": "permanent", "numberOfLabours": "646", "workingHoursEnd": "05:07", "statusOfEmployee": "permanent", "numberOfEmployees": "255", "workingHoursStart": "10:07", "wagesPerMonthPerDay": "555", "otherMajorExpenditure": "Noi", "salaryPerMonthPerEmployee": "20000"}, "bankingDetails": {"assets": "Yes assests", "bankAccounts": [{"type": "Hdhdh", "account": "64665656", "bankName": "Axis", "averageBalance": "55000", "numberOfYearsMaintained": "50"}, {"type": "Gshdj", "account": "64664665", "bankName": "Dhamsn", "averageBalance": "555000", "numberOfYearsMaintained": "50"}], "licMutualFunds": "Lic"}, "financeDetails": {"shareholders": [{"name": "Ghkll", "designation": "Gh", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Xcg"}]}, "businessDetails": {"salesVolume": "188", "stockSource": "Suppliers", "wageExpenses": "100000", "profitPerUnit": "20", "stockHandling": "Premises", "typeOfBusiness": "Partnership", "numberOfWorkers": "255", "natureOfBusiness": "Trader", "yearBusinessStarted": "1999", "majorTransactionMode": "Cash", "businessPremisesOwnership": "Rented"}, "thirdPartyCheck": {"checks": [{"tpcName": "Rd", "comments": "Edd", "mobileNumber": "555", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Ee"}, {"value": "Fff"}]}, "documentsObserved": {"shareholders": [{"name": "Randy", "designation": "Head", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Director"}, {"name": "Ghj", "designation": "Head 2", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Director "}]}, "suppliersCreditors": {"suppliers": [{"name": "Hsh", "phone": "9596465656", "review": "positive", "location": "Hyd"}, {"name": "Hsj", "phone": "6656566565", "review": "positive", "location": "Hytfg"}], "creditPeriod": "20", "cashChequeProportions": "10/20", "numberOfFixedSuppliers": "20"}}	\N	2025-09-26 10:34:43.777	2025-09-26 10:42:30.29	Business	\N	\N	\N	\N	19	cdvf	\N	\N	\N	\N	PD	\N	\N	\N
123	782	Business	47	Completed	dafsgd	{"assetDetails": {"assets": [{"address": "Asset1 maxhine", "mortgaged": "yes", "ownerName": "Rahhh", "marketValue": "48", "areaMeasured": "25000", "purchaseCost": "25000", "purchaseYear": "1980"}, {"address": "Assets2", "mortgaged": "yes", "ownerName": "Rajjh", "marketValue": "30008", "areaMeasured": "256669", "purchaseCost": "2500", "purchaseYear": "2005"}], "status": "positive", "remarks": "Goodd", "vehicles": "Car-xuv", "otherIncome": "Yes farm", "observations": "Good overall", "siteCoordinates": "31_567_677", "lifeInsuranceMediclaim": "Yes life insurance", "capitalInvestedBusiness": "Yes businnes loan", "liquidMoveableMonetaryItems": "Yes cash gold"}, "basicDetails": {"phoneNo": "2134565432", "applicantName": "testing1", "nameOfConcern": "sfad", "initiatedAddress": "dafsgd"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "5", "purpose": "Farm", "bankName": "Axiss", "loanAmount": "25000"}, {"emi": "5", "tenure": "5", "purpose": "Farm", "bankName": "Ferderal", "loanAmount": "25000"}]}, "familyDetails": [{"age": "45", "name": "Rama", "relation": "Father", "mobileNumber": "6465656656", "otherRelation": "", "employmentType": "NRI", "stayingWithApplicant": "Yes", "educationalQualification": "PG/Professional Certification"}, {"age": "44", "name": "Sita", "relation": "Mother", "mobileNumber": "6565665656", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "salariesWages": {"remarks": "Nothing", "statusOfLabour": "permanent", "numberOfLabours": "25", "workingHoursEnd": "03:25", "statusOfEmployee": "permanent", "numberOfEmployees": "455", "workingHoursStart": "09:31", "wagesPerMonthPerDay": "6000", "otherMajorExpenditure": "No other", "salaryPerMonthPerEmployee": "25000"}, "bankingDetails": {"bankAccounts": [{"bankName": "Bane 1", "openSince": "1990", "branchName": "Akp", "accountType": "Personal ", "endUseOfLoan": "2005"}, {"bankName": "Yesbank ", "openSince": "2000", "branchName": "Vizag", "accountType": "Personal", "endUseOfLoan": "2030"}]}, "clientsDebtors": {"turnover": "450000", "customers": [{"name": "Bane 1", "phone": "6665656650", "review": "positive", "location": "Hdhh"}, {"name": "Ytrrhkd", "phone": "6466565656", "review": "positive", "location": "Loc2"}], "netMargins": "25000", "creditPeriod": "25", "cashChequeProportions": "11/20", "numberOfFixedCustomers": "25", "averageStockMaintenance": "4555"}, "thirdPartyCheck": {"checks": [{"tpcName": "Rahhh", "comments": "Good", "mobileNumber": "6468686868", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}, {"tpcName": "Fsghs", "comments": "Good", "mobileNumber": "2255555656", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Hshdh"}, {"value": "Hdhhd"}]}, "documentsObserved": {"documents": [{"remarks": "Good", "documentName": "Name of doc", "documentType": "Doc type", "documentCategory": "Pg"}, {"remarks": "Avg", "documentName": "Doc2", "documentType": "Type2", "documentCategory": "General"}]}, "suppliersCreditors": {"suppliers": [{"name": "Tyuu", "phone": "6868686866", "review": "positive", "location": "Tyui"}, {"name": "Hdjd", "phone": "6565665656", "review": "positive", "location": "Hdhhdh"}], "creditPeriod": "45", "cashChequeProportions": "11/20", "numberOfFixedSuppliers": "45"}, "shareholdingDetails": {"shareholders": [{"name": "Raj", "designation": "Head", "shareholdingPercentage": "45", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Partner"}, {"name": "Raj2", "designation": "Head2", "shareholdingPercentage": "45", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Director"}], "aboutTheBusiness": "Good business "}}	\N	2025-09-26 14:56:53.745	2025-09-26 15:06:56.876	Business	\N	\N	\N	\N	12	sfad	\N	\N	\N	\N	PD	\N	\N	\N
129	829	Business	44	Completed	madhapure	{"timestamp": "2025-09-29T09:27:10.087Z", "sectionData": {"basicDetails": {"phoneNo": "9949007272", "personMet": "other", "loanAmount": "cash_credit", "dateOfVisit": "yes", "applicantName": "kalpana", "nameOfConcern": "dhana sree ", "purposeOfLoan": "Businessman ", "aboutApplicant": "Bbebdb", "visitedAddress": "Ggg", "nameOfPersonMet": "Pavitra ", "initiatedAddress": "madhapure", "typeofCollateral": "Bbebe", "collateralDetails": "Vbb", "residentialDetails": "Vhb"}, "familyDetails": [{"age": "25", "name": "Kalpana", "relation": "Other", "mobileNumber": "3366988885", "otherRelation": "Sister in law ", "employmentType": "Homemaker", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "bankingDetails": {"assets": "Car", "bankAccounts": [{"type": "Saving ", "account": "66339988556699", "bankName": "Indian ", "averageBalance": "20", "numberOfYearsMaintained": "2010"}], "licMutualFunds": "Lic"}}, "basicDetails": {"phoneNo": "9949007272", "personMet": "other", "loanAmount": "cash_credit", "dateOfVisit": "yes", "applicantName": "kalpana", "nameOfConcern": "dhana sree ", "purposeOfLoan": "Businessman ", "aboutApplicant": "Bbebdb", "visitedAddress": "Ggg", "nameOfPersonMet": "Pavitra ", "initiatedAddress": "madhapure", "typeofCollateral": "Bbebe", "collateralDetails": "Vbb", "residentialDetails": "Vhb"}, "investigable": true, "existingLoans": {"loans": [{"emi": "900", "tenure": "8", "purpose": "Business development ", "bankName": "Axis ", "loanAmount": "90000"}]}, "familyDetails": [{"age": "25", "name": "Kalpana", "relation": "Other", "mobileNumber": "3366988885", "otherRelation": "Sister in law ", "employmentType": "Homemaker", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "", "wagesPerMonthPerDay": "2500", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "35000"}, "bankingDetails": {"assets": "Car", "bankAccounts": [{"type": "Saving ", "account": "66339988556699", "bankName": "Indian ", "averageBalance": "20", "numberOfYearsMaintained": "2010"}], "licMutualFunds": "Lic"}, "financeDetails": {"shareholders": [{"name": "Vbtgtbth", "designation": "Vvtbt", "shareholdingPercentage": "22", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "G"}]}, "businessDetails": {"salesVolume": "20", "stockSource": "suppliers", "wageExpenses": "40", "profitPerUnit": "30", "stockHandling": "premises", "typeOfBusiness": "llp", "numberOfWorkers": "500", "natureOfBusiness": "distributor", "yearBusinessStarted": "2010", "majorTransactionMode": "cash", "businessPremisesOwnership": "rented"}, "thirdPartyCheck": {"checks": [{"tpcName": "Vvbn", "comments": "Rcb", "mobileNumber": "9996698558", "relationship": "Local Shop Owner", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Vt tv"}]}, "documentsObserved": {"documents": [{"remarks": "Good ", "documentName": "Dhana", "documentType": "Aadhar passport ", "documentCategory": "Identity proof "}]}, "suppliersCreditors": {"suppliers": [{"name": "kalpanareddyreddy100@gmail.com", "phone": "9966332255", "review": "positive", "location": "Vbmjh"}], "creditPeriod": "30", "cashChequeProportions": "600000", "numberOfFixedSuppliers": "500"}}	\N	2025-09-29 08:54:22.23	2025-09-29 09:47:22.02	Business	\N	\N	\N	\N	5	dhana sree 	\N	\N	\N	\N	PD	\N	\N	\N
135	846	Business	47	Pending	scvada	{"performance": {"anyChequeBounces": "yes", "detailsOfCollateral": "Details are collateral"}, "basicDetails": {"phoneNo": "3456764534", "personMet": "co_applicant", "applicantName": "test6", "contactNumber": "6768686688", "nameOfConcern": "dwafvd", "initiatedAddress": "scvada", "relationshipWithBorrower": "Friends "}, "commonPoints": {"salesFluctuations": "No fluctuations ", "turnoverAndMargin": "45009 and 6lak", "charteredAcDetails": "Av details", "customerIdentityEstablishedDuringPD": "Identify card", "loansTakenFromFamilyFriendsBusinessAssociates": "Not taken"}, "existingLoans": {"loans": [{"emi": "6", "tenure": "5", "purpose": "Farm", "bankName": "Indian", "loanAmount": "50"}]}, "familyDetails": [{"age": "55", "name": "Raj", "relation": "Father", "mobileNumber": "6566656566", "otherRelation": "", "employmentType": "NRI", "stayingWithApplicant": "Yes", "educationalQualification": "PG/Professional Certification"}], "bankingDetails": {"assets": "Asset1,23", "bankAccounts": [{"type": "Saving", "account": "686866868", "bankName": "Bank1", "averageBalance": "5000000", "numberOfYearsMaintained": "5"}], "licMutualFunds": "Lic present"}, "clientsDebtors": {"customers": [{"name": "Rahhh", "phone": "6468668668", "review": "positive", "location": "Loc1"}]}, "businessDetails": {"constitution": "sole_proprietorship", "prevEmployment": "Yes - rah", "whoStartedBusiness": "acquired", "yearsInCurrentCity": "15", "isResidenceCumOffice": "yes", "yearsInCurrentOffice": "19", "ownershipOfBusinessPlace": "self_owned"}, "businessProfile": {"natureOfBusiness": "manufacturing", "productServicesOffered": "Many servic", "businessModelAndBackground": "Fishing mart"}, "thirdPartyCheck": {"checks": [{"tpcName": "Rajj", "comments": "Good better", "mobileNumber": "6656876868", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Tety"}, {"value": "Hehhd"}]}, "suppliersCreditors": {"suppliers": [{"name": "Hsjs", "phone": "6165656656", "review": "positive", "location": "Raksm"}]}, "miscelleanousDetails": {"stockSeen": "yes", "noOfMachinesSeen": "25", "noOfEmployeesSeen": "25", "businessActivitySeen": "yes", "businessNameBoardSeen": "yes", "anyOtherObservationsOrRemarksDuringVisit": "Yes reamaks", "anyOtherBusinessOrAlternativeIncomeSource": "Yes alternative present"}, "workingCapitalDetails": {"limit": "5", "bankName": "Indian limited", "collateral": "Collateral ", "utilization": "Utilizes ", "linkedLoansIfAny": "No linked", "endOfProposedLoans": "1980 end of proposed loan"}}	\N	2025-09-29 15:29:59.14	2025-09-29 15:29:59.14	Business	\N	\N	\N	\N	12	dwafvd	f	\N	\N	\N	PD	\N	\N	\N
141	874	Work	11	Pending	Vijayawada	\N	\N	2025-10-06 05:08:12.658	2025-10-06 05:08:12.658	\N	\N	\N	\N	\N	10	\N	\N	\N	\N	Google Internship Pvt.ltd.	FI	\N	\N	\N
142	874	Business	11	Pending	Vijayawada	\N	\N	2025-10-06 05:08:42.419	2025-10-06 05:08:42.419	\N	\N	\N	\N	\N	10	Food Business	\N	\N	\N	\N	FI	\N	\N	\N
149	861	Business	44	Pending	wedfg	\N	\N	2025-10-07 07:23:06.174	2025-10-07 07:23:06.174	\N	\N	\N	\N	\N	5	werrgfh	\N	\N	\N	\N	PD	\N	\N	\N
147	884	Business	44	Completed	kondapur	{"bankDetails": {"avgBal": "B"}, "basicDetails": {"phoneNo": "9494525451", "nameOfEntity": "Test", "applicantName": "mohanreddy", "nameOfConcern": "dhana", "nameOfApplicant": "Kalpana", "initiatedAddress": "kondapur", "nameOfCoApplicants": "Dhana"}, "otherDetails": {"assets": "H"}, "familyDetails": {"familyDetails": []}, "officeAddress": {"add": "Testing ", "rentedOwned": ""}, "businessDetails": {"currentBusinessDetails": ""}, "customerDetails": {"totalCustomersNo": "9"}, "supplierDetails": {"totalSuppliersNo": "5"}, "employeesDetails": {"currentEmployees": "V"}, "residentialAddress": {"ownedBy": "Bzzb"}, "документы": {"otherDocumentSeen": "B"}, "proposedLoanDetails": {"amount": "1000", "tenure": "6", "product": "Apply ", "bankName": "Indian ", "accountNo": "Qyhdh536677777777", "repaymentFrom": "2025hnmkjmujhjjuujhju", "typeSAAccount": "Saving "}, "salesAndProfitDetails": {"netMonthlyIncome": "B"}, "siteVisitObservations": {"noOfEmployeesSeenDuringPD": "6"}, "valueAddedInformation": {"salaryDeductionPercentage": "6"}}	\N	2025-10-07 06:31:44.007	2025-10-07 09:04:13.327	Business	\N	\N	\N	\N	5	dhana	\N	\N	\N	\N	PD	\N	\N	\N
156	896	Business	44	Completed	7uyhg	{"bankDetails": {"avgBal": "2000", "primaryBanker": "Axis ", "natureOfAccount": "Salary "}, "basicDetails": {"phoneNo": "5666666666", "applicantName": "gfcdc", "nameOfConcern": "87uyhg", "initiatedAddress": "7uyhg"}, "otherDetails": {"assets": "Gold car bike 🚲", "businessIndustry": "Sarees ", "politicalConnection": "Yes", "endUseOfProposedLoan": "2024", "otherBusinessIncomeDetails": "Rxrcr"}, "familyDetails": {"familyDetails": [{"age": "32", "name": "Akhila", "relation": "Sister", "profession": "Teacher ", "monthlyIncome": "100000", "qualification": "Inter"}]}, "officeAddress": {"add": "Madhapur ", "ownedBy": "Dhana ", "areaSqFt": "2000", "rentedOwned": "Rented", "cmvRentPerMonth": "2000", "occupiedSinceYears": "2019"}, "businessDetails": {"stockAsOnDate": "12/3/2025", "currentBusinessDetails": "Saree"}, "customerDetails": {"totalCustomersNo": "15000", "totalDebtorsAsOnDate": "50000"}, "supplierDetails": {"totalSuppliersNo": "55", "totalCreditorsAsOnDate": "2588"}, "employeesDetails": {"salaryRange": "25000", "keyEmployeeName": "Testing ", "currentEmployees": "500"}, "residentialAddress": {"add": "Kondapur ", "ownedBy": "Mohan ", "areaSqFt": "1000", "rentedOwned": "Rented", "cmvRentPerMonth": "30000", "occupiedSinceYears": "2010", "addressOfPDAndPersonMet": "Shaikpet "}, "документы": {"panCard": "466567765677776", "otherDocumentSeen": "Vgv bh"}, "proposedLoanDetails": {"amount": "47766", "tenure": "5", "product": "Kalpana", "bankName": "Indian ", "accountNo": "35555", "repaymentFrom": "Testing ", "typeSAAccount": "Saving "}, "salesAndProfitDetails": {"profitMargin": "150000", "netMonthlyIncome": "200000", "turnoverFY202425": "2000", "cashSalesPercentage": "2800", "expTurnoverFY202526": "15000", "monthlyTurnoverSales": "250000", "covidEffectOnTurnover": "10000", "postLockdownBusinessSpeed": "4000"}, "siteVisitObservations": {"landmark": "Kukatpally ", "neighborhood": "Yes", "stockSeenDuringPD": "Yes", "namePlateDisplayed": "Yes", "officeWellFurnished": "Yes", "businessActivitySeen": "Yes", "anyDecreaseInNetWorth": "Yes", "thirdPartyConfirmation": "Ggvb", "noOfCustomersSeenDuringPD": "859", "noOfEmployeesSeenDuringPD": "60000", "difficultyInLocatingPremises": "Yes", "abnormalIncreaseDecreaseInTurnover": "Yes"}, "valueAddedInformation": {"strengths": "2000", "weaknesses": "Dhana", "customerBehavior": "Good", "digitalWalletUsed": "Phonepay ", "utilityBillDetails": "Ok", "customerShopLocality": "Market Road", "nearbyTransportStand": "Yes", "lossSufferedInBusiness": "Ggv", "neighborhoodShopsNature": "Photo ", "salariesPaidDuringCovid": "Yes", "salaryDeductionPercentage": "280"}}	\N	2025-10-07 10:30:32.824	2025-10-07 10:42:04.448	Business	\N	\N	\N	\N	5	87uyhg	\N	\N	\N	\N	PD	\N	\N	\N
162	905	Business	44	Completed	shaikpet	{"netWorth": {"netWorth": [{"ownerName": "Raj", "typeOfProperty": "Cggvv", "yearsOfOwnership": "Vvggbb", "approxMarketValue": "V. "}]}, "timestamp": "2025-10-08T07:23:18.701Z", "caseDetails": {"contactNo": "+919912994741", "personMet": "Other ", "coApplicant": "Happy ", "dateOfVisit": "🍌 banana", "addressVisited": "Madhapur, Hyderabad, Telangana, India", "meetingDetails": "Apple", "typeOfBorrower": "Individual ", "nameOfApplicant": "Raj", "referenceNumber": "Kalpana 111"}, "particulars": {"coordinates": "Cv. "}, "basicDetails": {"phoneNo": "9912994741", "applicantName": "kalpanareddy", "nameOfConcern": "happi  shoping mall", "initiatedAddress": "shaikpet"}, "investigable": true, "loansDetails": {"loansDetails": [{"os": "Testing ", "product": "Development ", "remarks": "Good ", "loanAmount": "1000000", "nameOfBankInstitution": "Indian "}]}, "familyDetails": {"aboutApplicant": "Positive ", "aboutCoApplicant": "Amma", "andTheirFamilyDetails": "belure"}, "outputsSupply": {"creditTerms": "Vvv", "marketForOutput": "Vvvbv", "modeOfMarketing": "Ghvv", "typeOfCustomers": "Vgbb", "stockOfFinishedGoods": "Vbbbb"}, "businessDetails": {"margins": "14009", "gstNumber": "1234", "legalName": "Legal gst", "tradeName": "Happi", "shopAddress": "Ayyappa society ", "businessName": "Dhanasree Saree business ", "typeOfEntity": "Sales ", "establishment": "Tgvsv", "godownAddress": "Madhapur, Hyderabad, Telangana, India", "lastGSTReturn": "12346", "shopOwnership": "Owned", "productDetails": "Cat", "businessProcess": "Business development ", "godownOwnership": "", "activityObserved": "Electric scooter ", "natureOfBusiness": "Sales and wholesale ", "documentsObserved": "Pan aadhar "}, "employeeDetails": {"pfEsiApplied": "Yes", "noOfEmployees": "300", "salaryDetails": "30000"}, "inputsPurchases": {"orderCycle": "Ag h huh h", "creditTerms": "Cvbb", "avgOrderQnty": "Vvbb", "otherRemarks": "Vbb", "detailsOfInputs": "Traffic ", "purchaseDetails": "Business analyst "}, "tradeReferences": {"customers": [{"contactDetails": "99800876555", "nameOfCustomer": "Narshimha "}], "suppliers": [{"contactDetails": "00110099777777888", "nameOfSuppliers": "Eshwaramma "}, {"contactDetails": "eret5rf", "nameOfSuppliers": "amma"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "25", "name": "Dhana", "remarks": "Good ", "relation": "Daughter ", "occupation": "Teacher ", "qualification": "Inter"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Konda ", "sourceOfIncome": "Shop"}]}, "applicantsMainBankingDetails": {"endUse": "Tesfv", "remarks": "Good ", "bankName": "Axis ", "noOfYear": "2019", "accountType": "Saving ", "limitOfCCOD": "4000", "particulars": "Cvvvv", "ownContribution": "Livvbi", "accountHolderName": "Kalpa ", "remarksAdditional": " Bnb"}}	\N	2025-10-08 04:50:37.91	2025-10-08 09:42:00.841	Business	\N	\N	\N	\N	5	happi  shoping mall	\N	\N	\N	\N	PD	\N	\N	\N
165	908	Business	47	Pending	bnmn	{"netWorth": {"netWorth": [{"ownerName": "Gh", "typeOfProperty": "Gh", "yearsOfOwnership": "33", "approxMarketValue": "Hu"}, {"ownerName": "G", "typeOfProperty": "H", "yearsOfOwnership": "6", "approxMarketValue": "G"}]}, "caseDetails": {"contactNo": "6787654567", "personMet": "test12", "coApplicant": "Gg", "addressVisited": "bnmn", "typeOfBorrower": "Private Limited Company", "nameOfApplicant": "test12", "referenceNumber": "test12"}, "particulars": {"coordinates": "17.4460342,78.3580792"}, "loansDetails": {"loansDetails": [{"emi": "6", "pos": "H", "product": "G", "remarks": "G", "loanAmount": "6", "nameOfBankInstitution": "Y"}, {"emi": "3", "pos": "G", "product": "G", "remarks": "G", "loanAmount": "6", "nameOfBankInstitution": "Y"}]}, "familyDetails": {"aboutApplicant": "Gg", "aboutCoApplicant": "G", "andTheirFamilyDetails": "Yy"}, "outputsSupply": {"creditTerms": "H", "marketForOutput": "G", "modeOfMarketing": "J", "typeOfCustomers": "H", "stockOfFinishedGoods": "H"}, "uploadedItems": [{"id": "1759895055201vvu77mtq02n", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/8dab4932-89d3-4327-97bb-4d589c99c9f0.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-10-08T03:44:15.201Z", "s3ImageUrl": "verification/163/1759895053660-wqhd0n.jpg", "isOverlayNeeded": false}], "businessDetails": {"margins": "Yy", "gstNumber": "Gh", "legalName": "Gh", "tradeName": "Gh", "shopAddress": "bnmn", "businessName": "bvnmnm", "typeOfEntity": "Gh", "establishment": "Yh", "godownAddress": "Gh", "lastGSTReturn": "Hh", "shopOwnership": "Owned", "productDetails": "Gg", "businessProcess": "Gg", "godownOwnership": "Rented", "activityObserved": "Gh", "natureOfBusiness": "Gh", "documentsObserved": "Hh"}, "employeeDetails": {"pfEsiApplied": "Yes", "noOfEmployees": "6", "salaryDetails": "H"}, "inputsPurchases": {"orderCycle": "Y", "creditTerms": "H", "avgOrderQnty": "G", "otherRemarks": "Hh", "detailsOfInputs": "Y", "purchaseDetails": "G"}, "ownContributions": {"ownContributions": [{"remarks": "Hu", "particulars": "Yh"}, {"remarks": "Gh", "particulars": "Yh"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "66", "name": "Gh", "remarks": "G", "relation": "Ty", "occupation": "Gg", "qualification": "Under graduate"}, {"age": "55", "name": "Vv", "remarks": "G", "relation": "G", "occupation": "Gg", "qualification": "Graduate"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Gh", "sourceOfIncome": "Gg"}, {"details": "Y", "sourceOfIncome": "Yh"}]}, "tradeReferencesCustomers": {"customers": [{"contactDetails": "Gg", "nameOfCustomer": "G"}, {"contactDetails": "Gh", "nameOfCustomer": "Yh"}]}, "tradeReferencesSuppliers": {"suppliers": [{"contactDetails": "G", "nameOfSuppliers": "G"}, {"contactDetails": "Y", "nameOfSuppliers": "Y"}]}, "applicantsMainBankingDetails": {"endUse": "Gh", "bankingDetails": [{"remarks": "Y", "bankName": "Y", "noOfYear": "3", "accountType": "Cash Credit", "limitOfCCOD": "G", "accountHolderName": "G"}, {"remarks": "Yy", "bankName": "Y", "noOfYear": "3", "accountType": "Current", "limitOfCCOD": "Y", "accountHolderName": "Y"}]}}	\N	2025-10-08 10:46:04.938	2025-10-08 10:46:04.938	Business	\N	\N	\N	\N	19	bvnmnm	f	\N	\N	\N	PD	\N	\N	\N
161	903	Business	44	Completed	kondapur	{"timestamp": "2025-10-09T05:34:12.774Z", "bankDetails": {"avgBal": "50000", "primaryBanker": "Axis ", "natureOfAccount": "Saving "}, "basicDetails": {"nameOfEntity": "dhana sarees ", "nameOfApplicant": "kalpanareddy", "nameOfCoApplicants": ""}, "investigable": true, "otherDetails": {"assets": "Car bike gold 🪙", "liabilities": [{"emi": "5", "bank": "India ", "amount": "299999", "tenure": "5", "natureOfLoan": "Individual ", "outstandingBalance": "400000"}, {"emi": 5, "bank": "axices", "amount": 57654, "tenure": "5", "natureOfLoan": "gtrfcv", "outstandingBalance": 5555555}], "anyCourtCases": "Yes", "businessIndustry": "Ygags", "politicalConnection": "Yes", "endUseOfProposedLoan": "Good ", "otherBusinessIncomeDetails": "Business development "}, "familyDetails": {"familyDetails": [{"age": "6", "name": "Dhana", "relation": "Daughter ", "profession": "Study ", "monthlyIncome": "20555", "qualification": "Inter "}]}, "officeAddress": {"add": "Gvv", "ownedBy": " V v ", "areaSqFt": "Gg4666", "rentedOwned": "Rented", "cmvRentPerMonth": "88988", "occupiedSinceYears": "5888"}, "uploadedItems": [{"id": "1759992219283ws5kmgpkvin", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/a620a9bb-6dca-42e6-8b14-5177f94b73f4.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.464302, "locality": "Hyderabad", "longitude": 78.3679027, "timestamp": "2025-10-09T06:43:39.283Z", "s3ImageUrl": "verification/161/1759992218708-iytil.jpg", "isOverlayNeeded": true}], "businessDetails": {"stockAsOnDate": "5000", "currentBusinessDetails": "Beyondscale "}, "customerDetails": {"customers": [{"debtorDays": "6666", "nameOfCustomer": "Narshimha ", "percentageOfTotalSales": "5trgf666666666666666", "relationshipSinceYears": 6666}], "totalCustomersNo": "23588", "totalDebtorsAsOnDate": "200"}, "supplierDetails": {"suppliers": [{"creditorDays": "5", "nameOfSupplier": "Dhana ", "relationshipSinceYears": "2019", "percentageOfTotalPurchases": "50"}, {"creditorDays": "5", "nameOfSupplier": "happi", "relationshipSinceYears": 8, "percentageOfTotalPurchases": "60"}], "totalSuppliersNo": "26398", "totalCreditorsAsOnDate": "25000"}, "employeesDetails": {"salaryRange": "25000", "keyEmployeeName": "Tester", "currentEmployees": "500"}, "residentialAddress": {"add": "Cv v", "ownedBy": "Cvvv", "areaSqFt": "Fcv4566", "rentedOwned": "Rented", "cmvRentPerMonth": "88566", "occupiedSinceYears": "988", "addressOfPDAndPersonMet": " Vhhhh"}, "документы": {"panCard": "425526262637", "otherDocumentSeen": "Pan aadhar passport size "}, "proposedLoanDetails": {"amount": 20000, "tenure": "5", "product": "", "bankName": "Tata Ubl", "accountNo": "Rygvv666677777766666", "repaymentFrom": "Bank name HDFC account type savings account number 425623663637737", "typeSAAccount": "Vsvvs"}, "salesAndProfitDetails": {"profitMargin": "Ggvvvb", "netMonthlyIncome": "2455", "turnoverFY202425": "20000", "cashSalesPercentage": "8668", "expTurnoverFY202526": "56778", "monthlyTurnoverSales": "C hu hu hvv", "covidEffectOnTurnover": "Cggvgbhk", "postLockdownBusinessSpeed": "Evbhu"}, "siteVisitObservations": {"landmark": "Rameshwaram ", "neighborhood": "Yes", "stockSeenDuringPD": "Yes", "namePlateDisplayed": "Yes", "officeWellFurnished": "Yes", "businessActivitySeen": "Yes", "anyDecreaseInNetWorth": "Yes", "thirdPartyConfirmation": "True ", "noOfCustomersSeenDuringPD": "2000", "noOfEmployeesSeenDuringPD": "1000", "difficultyInLocatingPremises": "Yes", "abnormalIncreaseDecreaseInTurnover": "Yes"}, "valueAddedInformation": {"strengths": "Gbbb", "weaknesses": "Bzbxb", "customerBehavior": "Good", "digitalWalletUsed": "Phonepay ", "utilityBillDetails": "Ok", "customerShopLocality": "Market Road", "nearbyTransportStand": "Business Stop 🚏", "lossSufferedInBusiness": "Vvvwvdvd", "neighborhoodShopsNature": "Development ", "salariesPaidDuringCovid": "Yes", "salaryDeductionPercentage": "1000"}}	\N	2025-10-08 04:48:47.208	2025-10-09 08:11:21.517	Business	\N	\N	\N	\N	5	dhana sarees 	\N	\N	\N	\N	PD	\N	\N	\N
94	678	Business	47	Completed	das	{}	\N	2025-09-23 11:02:02.716	2025-09-23 12:01:05.095	Business	\N	\N	\N	\N	20	FSFQGE	\N	\N	\N	\N	PD	\N	\N	\N
84	345	Business	41	Completed	Warangal	{"assetDetails": {"assets": [{"address": "Jsshshsbs", "mortgaged": "yes", "ownerName": "Uwgahss", "marketValue": "8484", "areaMeasured": "12484", "purchaseCost": "245", "purchaseYear": "54840"}], "status": "positive", "remarks": "Hahsbsbs", "vehicles": "Ywhwhebevcs", "otherIncome": "Hahsbsbsvs", "observations": "Havshshs s", "siteCoordinates": "Hahshshshahs", "lifeInsuranceMediclaim": "Yshsbsb", "capitalInvestedBusiness": "Hsbsbshs", "liquidMoveableMonetaryItems": "Hababsbs"}, "basicDetails": {"phoneNo": "", "noOfVisit": "36449", "personMet": "applicant", "constitution": "partnership", "applicantName": "", "nameOfConcern": "", "aboutApplicant": "Ausgwvww", "visitedAddress": "7whwgww", "nameOfPersonMet": "", "structureOfLoan": "working_capital", "appointmentFixed": "yes", "initiatedAddress": "", "coApplicantDetails": "Xuxhsbs", "residentialDetails": "Yebebsha"}, "basic_details": {"phoneNo": "", "noOfVisit": "2446", "personMet": "applicant", "constitution": "partnership", "applicantName": "", "nameOfConcern": "", "aboutApplicant": "Bbsbsjs", "visitedAddress": "Uebeebkns", "nameOfPersonMet": "", "structureOfLoan": "cash_credit", "appointmentFixed": "yes", "initiatedAddress": "", "coApplicantDetails": "Jhsjsshs", "residentialDetails": "Agassbsn"}, "existingLoans": {"loans": [{"emi": "94949", "tenure": "315", "purpose": "Hahsbs", "bankName": "Ushsbs", "loanAmount": "649494"}]}, "familyDetails": [{"age": "16484", "name": "Ushsbsbs", "relation": "Spouse", "mobileNumber": "3164846491", "otherRelation": "", "employmentType": "Retired", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "salariesWages": {"remarks": "Jssbsb", "statusOfLabour": "permanent", "numberOfLabours": "6464", "workingHoursEnd": "11:47", "statusOfEmployee": "permanent", "numberOfEmployees": "646494", "workingHoursStart": "13:47", "wagesPerMonthPerDay": "6484", "otherMajorExpenditure": "Ibsbsb", "salaryPerMonthPerEmployee": "64949494"}, "Existing Loans": {"loans": [{"emi": "6844", "tenure": "6484", "purpose": "Hsvsvs", "bankName": "Hsvsvs", "loanAmount": "649484"}]}, "clientsDebtors": {"turnover": "6484", "netMargins": "64848", "creditPeriod": "649494", "customer1Name": "Gavsvs", "customer2Name": "", "customer3Name": "", "customer1Phone": "648494946494", "customer2Phone": "", "customer3Phone": "", "customer1Review": "positive", "customer2Review": "", "customer3Review": "", "customer1Location": "Uahahs", "customer2Location": "", "customer3Location": "", "cashChequeProportions": "Hagabah", "numberOfFixedCustomers": "644949", "averageStockMaintenance": "6484"}, "family_details": [{"age": "34949", "name": "Jshsbs", "relation": "Brother", "mobileNumber": "6494949494", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "thirdPartyCheck": {"checks": [{"tpcName": "Ysgsgs", "comments": "Babshshwhw", "mobileNumber": "6494949484", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Usbsbs"}, {"value": "Issnsbs"}]}, "third_party_check": {"checks": [{"tpcName": "Usvsvs", "comments": "Usvsvssn", "mobileNumber": "6494049494", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Positive"}]}, "suppliersCreditors": {"creditPeriod": "649494", "supplier1Name": "Uahsbs", "supplier2Name": "", "supplier3Name": "", "supplier1Phone": "649494", "supplier2Phone": "", "supplier3Phone": "", "supplier1Review": "positive", "supplier2Review": "", "supplier3Review": "", "supplier1Location": "Jsbsbs", "supplier2Location": "", "supplier3Location": "", "cashChequeProportions": "Hahaha", "numberOfFixedSuppliers": "3494949"}, "shareholdingDetails": {"shareholders": [{"name": "Jabsbs", "designation": "Jsvsvs", "shareholdingPercentage": "20", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Hsvabasb"}]}}	\N	2025-09-18 10:05:57.326	2025-09-22 08:46:56.733	Business	\N	\N	\N	\N	20	Kannapa Kirana Store	\N	\N	\N	\N	PD	\N	\N	\N
100	721	Business	47	Completed	WAESRHT	{"assetDetails": {"assets": [{"address": "Hdhhhkm", "mortgaged": "yes", "ownerName": "Hdhh", "marketValue": "6656", "areaMeasured": "65665", "purchaseCost": "6566", "purchaseYear": "65656"}, {"address": "Hxhj", "mortgaged": "yes", "ownerName": "Hehjd", "marketValue": "65656", "areaMeasured": "65665", "purchaseCost": "5665", "purchaseYear": "65656"}], "status": "positive", "remarks": "Hehhe", "vehicles": "Car bike", "otherIncome": "Noo", "observations": "Hehdh", "siteCoordinates": "Hdhdh", "lifeInsuranceMediclaim": "Insurance", "capitalInvestedBusiness": "Loon business", "liquidMoveableMonetaryItems": "Liquid"}, "basicDetails": {"phoneNo": "5546576556", "applicantName": "qwertyuio", "nameOfConcern": "FWAEGW", "initiatedAddress": "WAESRHT"}, "existingLoans": {"loans": [{"emi": "6566", "tenure": "656", "purpose": "Ueh", "bankName": "Hmsm", "loanAmount": "646"}]}, "familyDetails": [{"age": "326", "name": "Namme", "relation": "Father", "mobileNumber": "6565668686", "otherRelation": "", "employmentType": "Farmer/Agriculturist", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}, {"age": "656", "name": "Hdhh", "relation": "Son", "mobileNumber": "6565665665", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}], "salariesWages": {"remarks": "Hdh", "statusOfLabour": "permanent", "numberOfLabours": "656", "workingHoursEnd": "09:43", "statusOfEmployee": "permanent", "numberOfEmployees": "656", "workingHoursStart": "16:43", "wagesPerMonthPerDay": "6626", "otherMajorExpenditure": "Hdh", "salaryPerMonthPerEmployee": "5566565"}, "clientsDebtors": {"turnover": "656", "netMargins": "356", "creditPeriod": "656", "customer1Name": "Hdh", "customer2Name": "Hdh", "customer3Name": "Hsh", "customer1Phone": "34668686686", "customer2Phone": "656", "customer3Phone": "66566", "customer1Review": "positive", "customer2Review": "positive", "customer3Review": "positive", "customer1Location": "Hdhhd", "customer2Location": "Heh", "customer3Location": "Heh", "cashChequeProportions": "Hdh", "numberOfFixedCustomers": "656", "averageStockMaintenance": "656"}, "thirdPartyCheck": {"checks": [{"tpcName": "Jdjj", "comments": "Hshdj", "mobileNumber": "6566568686", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Negative"}, {"tpcName": "Djhd", "comments": "Udjjd", "mobileNumber": "6656", "relationship": "Neighbor", "otherRelation": "", "feedbackStatus": "Negative"}]}, "additionalDetails": {"details": [{"value": "Jdjdj"}, {"value": "Hdj"}, {"value": "Hdjjd"}]}, "suppliersCreditors": {"suppliersCreditors": {"creditPeriod": "6465", "cashChequeProportions": "Hdh", "numberOfFixedSuppliers": "5665"}}, "familyMemberDetails": [{"age": "326", "name": "Namme", "relation": "Father", "mobileNumber": "6565668686", "otherRelation": "", "employmentType": "Farmer/Agriculturist", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}, {"age": "656", "name": "Hdhh", "relation": "Son", "mobileNumber": "6565665665", "otherRelation": "", "employmentType": "Part Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "10th Pass"}, {"age": "456", "name": "DSFD", "relation": "Mother", "mobileNumber": "7558654323", "employmentType": "Full Time Job", "stayingWithApplicant": "Yes", "educationalQualification": "Below 10th"}], "shareholdingDetails": {"shareholders": [{"name": "Hdhh", "designation": "Hdh", "shareholdingPercentage": "6", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "director", "functionalOfPartnerDirector": "Hdhe"}, {"name": "Dhhd", "designation": "Ydh", "shareholdingPercentage": "25", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "mother", "functionalOfPartnerDirector": "Hdh"}, {"name": "Dhdh", "designation": "Ydh", "shareholdingPercentage": "3", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "mother", "functionalOfPartnerDirector": "Hdh"}]}}	\N	2025-09-24 11:09:43.329	2025-09-25 04:30:10.88	Business	\N	\N	\N	\N	19	FWAEGW	\N	\N	\N	\N	PD	\N	\N	\N
106	743	Business	47	Pending	Rajahmundry	\N	\N	2025-09-25 07:27:52.241	2025-09-25 07:27:52.241	\N	\N	\N	\N	\N	20	jhv	\N	\N	\N	\N	PD	\N	\N	\N
112	111	Business	41	Pending	DOOR NO SHOP NO 2 , KG ROAD , NANDIKOTKUR , KURNOOL , Andhra Pradesh , 518401	\N	\N	2025-09-25 12:15:31.727	2025-09-25 12:15:31.727	\N	\N	\N	\N	\N	20	Lays factory	\N	\N	\N	\N	PD	\N	\N	\N
118	773	Business	44	Completed	Kowetha Telangana pin no:500085	{"assetDetails": {"assets": [{"address": "Ameerpet ", "mortgaged": "yes", "ownerName": "Jeevan", "marketValue": "200", "areaMeasured": "500", "purchaseCost": "1000", "purchaseYear": "2019"}], "status": "positive", "remarks": "Good ", "vehicles": "Car", "otherIncome": "House ", "observations": "Testing ", "siteCoordinates": "Test ", "lifeInsuranceMediclaim": "Gold ", "capitalInvestedBusiness": "Shop ", "liquidMoveableMonetaryItems": "Good "}, "basicDetails": {"phoneNo": "9912994741", "noOfVisit": "3", "personMet": "other", "constitution": "private_limited", "applicantName": "kowtha team", "nameOfConcern": "Google Pvt Ltd", "aboutApplicant": "Good ", "visitedAddress": "Madhapur ", "nameOfPersonMet": "Kalpana", "structureOfLoan": "working_capital", "appointmentFixed": "yes", "initiatedAddress": "Kowetha Telangana pin no:500085", "coApplicantDetails": "Good ", "residentialDetails": "Owner "}, "existingLoans": {"loans": [{"emi": "60000", "tenure": "10", "purpose": "Business development ", "bankName": "Indian ", "loanAmount": "1000000"}]}, "familyDetails": [{"age": "25", "name": "Dhana", "relation": "Daughter", "mobileNumber": "9912994741", "otherRelation": "", "employmentType": "Student", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "Good ", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "15:23", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "15:24", "wagesPerMonthPerDay": "400", "otherMajorExpenditure": "Home ", "salaryPerMonthPerEmployee": "35000"}, "bankingDetails": {"bankAccounts": [{"bankName": "Axe ", "openSince": "2019", "branchName": "Kondapur ", "accountType": "1234455566", "endUseOfLoan": "Testing "}]}, "clientsDebtors": {"turnover": "500", "customers": [{"name": "Sudarshan ", "phone": "9908205471", "review": "positive", "location": "Shaikpet "}], "netMargins": "100", "creditPeriod": "10", "cashChequeProportions": "Testing ", "numberOfFixedCustomers": "500", "averageStockMaintenance": "500"}, "thirdPartyCheck": {"checks": [{"tpcName": "Eshwaramma ", "comments": "Good ", "mobileNumber": "9966332255", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Testing "}, {"value": "Kowtha "}]}, "documentsObserved": {"shareholders": [{"name": "Test", "designation": "Fgvb", "shareholdingPercentage": "19", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "daughter", "functionalOfPartnerDirector": "Cvb"}]}, "suppliersCreditors": {"suppliers": [{"name": "Padma ", "phone": "9000782279", "review": "positive", "location": "Kondapur "}], "creditPeriod": "400", "cashChequeProportions": "400", "numberOfFixedSuppliers": "500"}, "shareholdingDetails": {"shareholders": [{"name": "100", "designation": "Qa", "shareholdingPercentage": "50", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "son", "functionalOfPartnerDirector": "Testing"}], "aboutTheBusiness": "Good "}}	\N	2025-09-26 10:41:35.149	2025-09-26 11:04:26.521	Business	\N	\N	\N	\N	12	Google Pvt Ltd	\N	\N	\N	\N	PD	\N	\N	\N
124	783	Business	47	Pending	dafsgd	{"assetDetails": {"assets": [{"address": "Asset1 maxhine", "mortgaged": "yes", "ownerName": "Rahhh", "marketValue": "48", "areaMeasured": "25000", "purchaseCost": "25000", "purchaseYear": "1980"}, {"address": "Assets2", "mortgaged": "yes", "ownerName": "Rajjh", "marketValue": "30008", "areaMeasured": "256669", "purchaseCost": "2500", "purchaseYear": "2005"}], "status": "positive", "remarks": "Goodd", "vehicles": "Car-xuv", "otherIncome": "Yes farm", "observations": "Good overall", "siteCoordinates": "31_567_677", "lifeInsuranceMediclaim": "Yes life insurance", "capitalInvestedBusiness": "Yes businnes loan", "liquidMoveableMonetaryItems": "Yes cash gold"}, "basicDetails": {"phoneNo": "2134565432", "applicantName": "testing1", "nameOfConcern": "sfad", "initiatedAddress": "dafsgd"}, "existingLoans": {"loans": [{"emi": "5", "tenure": "5", "purpose": "Farm", "bankName": "Axiss", "loanAmount": "25000"}, {"emi": "5", "tenure": "5", "purpose": "Farm", "bankName": "Ferderal", "loanAmount": "25000"}]}, "familyDetails": [{"age": "45", "name": "Rama", "relation": "Father", "mobileNumber": "6465656656", "otherRelation": "", "employmentType": "NRI", "stayingWithApplicant": "Yes", "educationalQualification": "PG/Professional Certification"}, {"age": "44", "name": "Sita", "relation": "Mother", "mobileNumber": "6565665656", "otherRelation": "", "employmentType": "Salaried", "stayingWithApplicant": "Yes", "educationalQualification": "Diploma/ITI Certification"}], "salariesWages": {"remarks": "Nothing", "statusOfLabour": "permanent", "numberOfLabours": "25", "workingHoursEnd": "03:25", "statusOfEmployee": "permanent", "numberOfEmployees": "455", "workingHoursStart": "09:31", "wagesPerMonthPerDay": "6000", "otherMajorExpenditure": "No other", "salaryPerMonthPerEmployee": "25000"}, "bankingDetails": {"bankAccounts": [{"bankName": "Bane 1", "openSince": "1990", "branchName": "Akp", "accountType": "Personal ", "endUseOfLoan": "2005"}, {"bankName": "Yesbank ", "openSince": "2000", "branchName": "Vizag", "accountType": "Personal", "endUseOfLoan": "2030"}]}, "clientsDebtors": {"turnover": "450000", "customers": [{"name": "Bane 1", "phone": "6665656650", "review": "positive", "location": "Hdhh"}, {"name": "Ytrrhkd", "phone": "6466565656", "review": "positive", "location": "Loc2"}], "netMargins": "25000", "creditPeriod": "25", "cashChequeProportions": "11/20", "numberOfFixedCustomers": "25", "averageStockMaintenance": "4555"}, "thirdPartyCheck": {"checks": [{"tpcName": "Rahhh", "comments": "Good", "mobileNumber": "6468686868", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}, {"tpcName": "Fsghs", "comments": "Good", "mobileNumber": "2255555656", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Hshdh"}, {"value": "Hdhhd"}]}, "documentsObserved": {"documents": [{"remarks": "Good", "documentName": "Name of doc", "documentType": "Doc type", "documentCategory": "Pg"}, {"remarks": "Avg", "documentName": "Doc2", "documentType": "Type2", "documentCategory": "General"}]}, "suppliersCreditors": {"suppliers": [{"name": "Tyuu", "phone": "6868686866", "review": "positive", "location": "Tyui"}, {"name": "Hdjd", "phone": "6565665656", "review": "positive", "location": "Hdhhdh"}], "creditPeriod": "45", "cashChequeProportions": "11/20", "numberOfFixedSuppliers": "45"}, "shareholdingDetails": {"shareholders": [{"name": "Raj", "designation": "Head", "shareholdingPercentage": "45", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Partner"}, {"name": "Raj2", "designation": "Head2", "shareholdingPercentage": "45", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "brother", "functionalOfPartnerDirector": "Director"}], "aboutTheBusiness": "Good business "}}	\N	2025-09-26 15:07:10.973	2025-09-26 15:07:10.973	Business	\N	\N	\N	\N	12	sfad	f	\N	\N	\N	PD	\N	\N	\N
148	886	Business	44	Completed	wdefgn	{"netWorth": {"netWorth": [{"ownerName": "Ghb", "typeOfProperty": "   Vvb", "yearsOfOwnership": " Bb", "approxMarketValue": "Fvvc"}]}, "caseDetails": {"contactNo": "88895", "personMet": "Tvvb", "coApplicant": "Cvv", "dateOfVisit": "", "addressVisited": "Bcvg", "meetingDetails": "Vvvb", "typeOfBorrower": "Cgg", "nameOfApplicant": "Ccvvv", "referenceNumber": "Ett234"}, "particulars": {"coordinates": "C vh"}, "basicDetails": {"phoneNo": "9949007272", "applicantName": "kalpanabelure", "nameOfConcern": "fdgbnhm", "initiatedAddress": "wdefgn"}, "loansDetails": {"loansDetails": [{"os": "Fg", "emi": " Vv", "product": "Cgh", "remarks": "Vh", "loanAmount": "G b", "nameOfBankInstitution": "Vbb"}]}, "familyDetails": {"aboutApplicant": "Bhavi", "aboutCoApplicant": "Vvb", "andTheirFamilyDetails": "Vb"}, "outputsSupply": {"creditTerms": "Btgbbh", "marketForOutput": "T gt", "modeOfMarketing": "Tbo", "typeOfCustomers": "Gh", "stockOfFinishedGoods": "Vhg"}, "businessDetails": {"margins": "C", "gstNumber": "Ty456", "legalName": "Gbb", "tradeName": "Vv", "shopAddress": "Tgcv", "businessName": "Vbbb", "typeOfEntity": "Cvvvv", "establishment": "V ", "godownAddress": "Cvb", "lastGSTReturn": "Dtg567", "shopOwnership": "Owned", "productDetails": "Vdvs", "businessProcess": "Vdvd", "godownOwnership": "Owned", "activityObserved": "Vvh", "natureOfBusiness": "Vvdb", "documentsObserved": "Vvb"}, "employeeDetails": {"pfEsiApplied": "Ch", "noOfEmployees": "89", "salaryDetails": "Gh"}, "inputsPurchases": {"orderCycle": "Vgdg", "creditTerms": "Bdv", "avgOrderQnty": "Vsvsh", "otherRemarks": "Ebsn", "detailsOfInputs": "Gdggs", "purchaseDetails": "Gdgs"}, "tradeReferences": {"customers": [{"contactDetails": "4565456545464545", "nameOfCustomer": "34rty"}], "suppliers": [{"contactDetails": "Hh", "nameOfSuppliers": "Vb"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "45", "name": "H", "remarks": "C", "relation": "V", "occupation": "G", "qualification": "Hh"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Vvb", "sourceOfIncome": "Vvv"}]}, "applicantsMainBankingDetails": {"endUse": "V", "remarks": "C", "bankName": "   Vvbgg", "noOfYear": "896", "accountType": "Gvv", "limitOfCCOD": "Vh", "particulars": "Fgh", "ownContribution": "Cbh", "accountHolderName": "Vbbgy", "remarksAdditional": "Vbh"}}	\N	2025-10-07 07:05:23.798	2025-10-07 09:54:29.029	Business	\N	\N	\N	\N	5	fdgbnhm	\N	\N	\N	\N	PD	{"rent": 0, "sales": 23333, "wages": 0, "auditFee": 0, "purchase": 24, "salaries": 0, "services": 23, "insurance": 0, "netProfit": 21403, "bankCharges": 0, "grossProfit": 20869, "closingStock": 3, "depreciation": 0, "openingStock": 122, "rentReceived": 200, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 2344, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 334, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	\N	\N
130	831	Business	44	Completed	3r24t	{"basicDetails": {"phoneNo": "3453647543", "personMet": "applicant", "loanAmount": "term_loan", "dateOfVisit": "yes", "applicantName": "test4", "nameOfConcern": "qeqwrq", "purposeOfLoan": "Testing ", "aboutApplicant": "Good ", "visitedAddress": "Madhapur ", "initiatedAddress": "3r24t", "typeofCollateral": "Testing ", "collateralDetails": "Testing ", "residentialDetails": "Owner "}, "existingLoans": {"loans": [{"emi": "68000", "tenure": "10", "purpose": "Business development ", "bankName": "Axis ", "loanAmount": "1000000"}]}, "familyDetails": [{"age": "65", "name": "Sudarshan ", "relation": "Father", "mobileNumber": "9000782279", "otherRelation": "", "employmentType": "Self Employed", "stayingWithApplicant": "Yes", "educationalQualification": "Graduate"}], "salariesWages": {"remarks": "", "statusOfLabour": "permanent", "numberOfLabours": "500", "workingHoursEnd": "", "statusOfEmployee": "permanent", "numberOfEmployees": "500", "workingHoursStart": "", "wagesPerMonthPerDay": "2500", "otherMajorExpenditure": "", "salaryPerMonthPerEmployee": "35000"}, "bankingDetails": {"assets": "Car", "bankAccounts": [{"type": "Saving ", "account": "69632589666", "bankName": "Indian ", "averageBalance": "6000", "numberOfYearsMaintained": "2019"}], "licMutualFunds": "Lic"}, "financeDetails": {"shareholders": [{"name": "Mohan ", "designation": "Testing ", "shareholdingPercentage": "80", "comingIntoLoanStructure": "yes", "relationshipWithApplicant": "son", "functionalOfPartnerDirector": "Testing "}]}, "businessDetails": {"salesVolume": "1200", "stockSource": "suppliers", "wageExpenses": "400", "profitPerUnit": "15", "stockHandling": "premises", "typeOfBusiness": "partnership", "numberOfWorkers": "500", "natureOfBusiness": "manufacturer", "yearBusinessStarted": "2019", "majorTransactionMode": "cash", "businessPremisesOwnership": "owned"}, "thirdPartyCheck": {"checks": [{"tpcName": "Dhanasree ", "comments": "Good ", "mobileNumber": "9949006271", "relationship": "Friend", "otherRelation": "", "feedbackStatus": "Positive"}]}, "additionalDetails": {"details": [{"value": "Good "}]}, "documentsObserved": {"documents": [{"remarks": "Good ", "documentName": "Kalpana", "documentType": "Aadhar passport ", "documentCategory": "Identity proof "}]}, "suppliersCreditors": {"suppliers": [{"name": "Kalpana", "phone": "9912996635", "review": "positive", "location": "Kondapur "}], "creditPeriod": "7", "cashChequeProportions": "60000", "numberOfFixedSuppliers": "500"}}	\N	2025-09-29 09:39:49.966	2025-09-29 10:42:22.942	Business	\N	\N	\N	\N	20	qeqwrq	\N	\N	\N	\N	PD	\N	\N	\N
136	860	Business	44	Pending	madhapur	\N	\N	2025-10-03 05:51:07.151	2025-10-03 05:51:07.151	\N	\N	\N	\N	\N	5	kalpana company	\N	\N	\N	\N	PD	\N	\N	\N
157	897	Business	44	Completed	i8u7y	{"bankDetails": {"avgBal": "G"}, "basicDetails": {"phoneNo": "9912994741", "applicantName": "mohan reddy", "nameOfConcern": "o8k8iujyh", "initiatedAddress": "i8u7y"}, "otherDetails": {"assets": "V", "endUseOfProposedLoan": "G", "otherBusinessIncomeDetails": "R"}, "familyDetails": {"familyDetails": [{"name": "T"}]}, "officeAddress": {"rentedOwned": "Owned"}, "businessDetails": {"stockAsOnDate": "V"}, "customerDetails": {"totalCustomersNo": "889", "totalDebtorsAsOnDate": "889"}, "supplierDetails": {"totalSuppliersNo": "8888", "totalCreditorsAsOnDate": "5899"}, "employeesDetails": {"keyEmployeeName": "G"}, "residentialAddress": {"rentedOwned": "Rented"}, "документы": {"otherDocumentSeen": "V"}, "proposedLoanDetails": {"amount": "Ff"}, "salesAndProfitDetails": {"expTurnoverFY202526": "Ty"}, "siteVisitObservations": {"officeWellFurnished": "Yes"}, "valueAddedInformation": {"lossSufferedInBusiness": "H"}}	\N	2025-10-07 10:45:21.129	2025-10-07 10:46:55.514	Business	\N	\N	\N	\N	5	o8k8iujyh	\N	\N	\N	\N	PD	\N	\N	\N
163	907	Business	47	Completed	bnmn	{"netWorth": {"netWorth": [{"ownerName": "Gh", "typeOfProperty": "Gh", "yearsOfOwnership": "33", "approxMarketValue": "Hu"}, {"ownerName": "G", "typeOfProperty": "H", "yearsOfOwnership": "6", "approxMarketValue": "G"}]}, "caseDetails": {"contactNo": "6787654567", "personMet": "test12", "coApplicant": "Gg", "addressVisited": "bnmn", "typeOfBorrower": "Partnership Firm", "nameOfApplicant": "test12", "referenceNumber": "test12"}, "particulars": {"coordinates": "17.4460342,78.3580792"}, "loansDetails": {"loansDetails": [{"emi": "6", "pos": "H", "product": "G", "remarks": "G", "loanAmount": "6", "nameOfBankInstitution": "Y"}, {"emi": "3", "pos": "G", "product": "G", "remarks": "G", "loanAmount": "6", "nameOfBankInstitution": "Y"}, {"emi": 3, "pos": "s", "product": "C", "remarks": "se", "loanAmount": 32, "nameOfBankInstitution": "C"}]}, "familyDetails": {"aboutApplicant": "Gg", "aboutCoApplicant": "Gg", "andTheirFamilyDetails": "Yy"}, "outputsSupply": {"creditTerms": "H", "marketForOutput": "nnG", "modeOfMarketing": "J", "typeOfCustomers": "H", "stockOfFinishedGoods": "H"}, "uploadedItems": [{"id": "1759895055201vvu77mtq02n", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/8dab4932-89d3-4327-97bb-4d589c99c9f0.jpg", "type": "photo", "isCamera": true, "timestamp": "2025-10-08T03:44:15.201Z", "s3ImageUrl": "verification/163/1759895053660-wqhd0n.jpg", "isOverlayNeeded": false}], "businessDetails": {"margins": "Yy", "gstNumber": "Gh", "legalName": "Ghhh", "tradeName": "Gh", "shopAddress": "bnmn", "businessName": "bvnmnm", "typeOfEntity": "Gh", "establishment": "Yh", "godownAddress": "Gh", "lastGSTReturn": "Hh", "shopOwnership": "Owned", "productDetails": "Gg", "businessProcess": "Gg", "godownOwnership": "Rented", "activityObserved": "Gh", "natureOfBusiness": "Gh", "documentsObserved": "Hh"}, "employeeDetails": {"pfEsiApplied": "Yes", "noOfEmployees": "6", "salaryDetails": "Hb"}, "inputsPurchases": {"orderCycle": "Y", "creditTerms": "H", "avgOrderQnty": "G", "otherRemarks": "Hh", "detailsOfInputs": "Y", "purchaseDetails": "Gg"}, "ownContributions": {"ownContributions": [{"remarks": "Hu", "particulars": "Yh"}, {"remarks": "Gh", "particulars": "Yh"}, {"remarks": "b", "particulars": "nmnm"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "66", "name": "Gh", "remarks": "G", "relation": "Ty", "occupation": "Gg", "qualification": "Under graduate"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Gh", "sourceOfIncome": "Gg"}]}, "tradeReferencesCustomers": {"customers": [{"contactDetails": "Gg", "nameOfCustomer": "G"}, {"contactDetails": "Gh", "nameOfCustomer": "Yh"}]}, "tradeReferencesSuppliers": {"suppliers": [{"contactDetails": "G", "nameOfSuppliers": "G"}, {"contactDetails": "Y", "nameOfSuppliers": "Y"}, {"contactDetails": "sc", "nameOfSuppliers": "sac"}]}, "applicantsMainBankingDetails": {"endUse": "Ghnn", "bankingDetails": [{"remarks": "Y", "bankName": "Y", "noOfYear": "3", "accountType": "Cash Credit", "limitOfCCOD": "G", "accountHolderName": "G"}]}}	\N	2025-10-08 09:49:44.975	2025-10-08 10:53:50.041	Business	\N	\N	\N	\N	19	bvnmnm	\N	\N	\N	\N	PD	\N	\N	\N
166	909	Business	44	Completed	kondapur	{"netWorth": {"netWorth": [{"ownerName": "Eshwaramma ", "typeOfProperty": "Bzbxb", "yearsOfOwnership": "64546", "approxMarketValue": "Vxbxb"}]}, "caseDetails": {"contactNo": "9912990098", "personMet": "kalpana reddy", "coApplicant": "Mohan ", "addressVisited": "kondapur", "typeOfBorrower": "Proprietorship", "nameOfApplicant": "kalpana reddy", "referenceNumber": "kalpana1100"}, "particulars": {"coordinates": "17.4478524,78.386272111"}, "loansDetails": {"loansDetails": [{"emi": "5000", "pos": "Gevsb", "product": "Saree ", "remarks": "Good ", "loanAmount": "100000", "nameOfBankInstitution": "Indian "}]}, "familyDetails": {"aboutApplicant": "kalpanabelureAge 30She is graduate Location Hyderabad  Telangana  NUMBERS: NAMES AND RELATION  AND MOBILE NO SIRTOTAL JOB EXPIRENCE:3year DATE OF JOINING :2022 nov 21yDESIGNATION : Associate QA Engineer TWO REFERENECE NUMBERS:  NO SIR: 9949006271", "aboutCoApplicant": "NUMBERS: NAMES AND RELATION  AND MOBILE NO SIR\\nTOTAL JOB EXPIRENCE:3year \\nDATE OF JOINING :2022 nov 21y\\nDESIGNATION : Associate QA Engineer \\nTWO REFERENECE\\n NUMBERS:  NO SIR: 9949006271", "andTheirFamilyDetails": "Son name happy age 7"}, "outputsSupply": {"creditTerms": "Bdvdb", "marketForOutput": "Good ", "modeOfMarketing": "Normal ", "typeOfCustomers": "Individual ", "stockOfFinishedGoods": "Yes"}, "uploadedItems": [{"id": "17599340163932l1rgls4nak", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/2e88fbc1-57dd-4e23-92a6-26f97d3c3725.jpg", "type": "photo", "pincode": "500081", "isCamera": true, "latitude": 17.447848, "locality": "Hyderabad", "longitude": 78.3862718, "timestamp": "2025-10-08T14:33:36.393Z", "s3ImageUrl": "verification/166/1759934009562-arbza8.jpg", "isOverlayNeeded": true}], "businessDetails": {"margins": "50%", "gstNumber": "12345", "legalName": "Belure anu reddy ", "tradeName": "Hp", "shopAddress": "kondapur", "businessName": "kalpana business", "typeOfEntity": "Wholesale ", "establishment": "15years", "godownAddress": "Cyber hills colony ", "lastGSTReturn": "NA", "shopOwnership": "Owned", "productDetails": "Nothing ", "businessProcess": "Business name kalpana dhana", "godownOwnership": "Owned", "activityObserved": "Good ", "natureOfBusiness": "Wholesale market ", "documentsObserved": "Pan aadhar passport "}, "employeeDetails": {"pfEsiApplied": "Yes", "noOfEmployees": "500", "salaryDetails": "2500"}, "inputsPurchases": {"orderCycle": "Full load ", "creditTerms": "Apple ", "avgOrderQnty": "500", "otherRemarks": "Good ", "detailsOfInputs": "Mok", "purchaseDetails": "Cash"}, "ownContributions": {"ownContributions": [{"remarks": "Shhdhx", "particulars": "Xvvxv"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "65", "name": "Sudarshan ", "remarks": "Good ", "relation": "Father in law ", "occupation": "Rental ", "qualification": "10th pass"}, {"age": "55", "name": "Padma ", "remarks": "Good ", "relation": "Mother in law ", "occupation": "House wife ", "qualification": "Under graduate"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Bhfvv", "sourceOfIncome": "Cvvvvh"}]}, "tradeReferencesCustomers": {"customers": [{"contactDetails": "9765678865", "nameOfCustomer": "Anu Deep "}]}, "tradeReferencesSuppliers": {"suppliers": [{"contactDetails": "9999273377", "nameOfSuppliers": "Magic "}]}, "applicantsMainBankingDetails": {"endUse": "2025", "bankingDetails": [{"remarks": "Good ", "bankName": "Axis ", "noOfYear": "54884", "accountType": "Savings", "limitOfCCOD": "Vxvxb", "accountHolderName": "Dhana "}]}}	\N	2025-10-08 14:15:32.411	2025-10-08 15:12:55.543	Business	\N	\N	\N	\N	5	kalpana business	\N	\N	\N	\N	PD	\N	\N	\N
144	879	Business	47	Completed	asdf	{"netWorth": {"netWorth": [{"ownerName": "Rajh", "typeOfProperty": "Lic fc", "yearsOfOwnership": "Solo", "approxMarketValue": "250009"}, {"ownerName": "Rahh2", "typeOfProperty": "Lic fc2", "yearsOfOwnership": "2050", "approxMarketValue": "293939"}, {"ownerName": "acaaqad", "typeOfProperty": "ddwd", "yearsOfOwnership": "4555", "approxMarketValue": "876876"}]}, "caseDetails": {"contactNo": "676866895", "personMet": "Person", "coApplicant": "Co", "dateOfVisit": "11-12-2025", "addressVisited": "Address1233", "meetingDetails": "Meetung", "typeOfBorrower": "Type2233", "nameOfApplicant": "Nameee", "referenceNumber": "Losid"}, "particulars": {"coordinates": "24_6828&6662_672"}, "basicDetails": {"phoneNo": "4567987867", "applicantName": "test8", "nameOfConcern": "sdfgfds", "initiatedAddress": "asdf"}, "loansDetails": {"loansDetails": [{"os": "5", "emi": "5", "product": "Prod1", "remarks": "Good", "loanAmount": "636367", "nameOfBankInstitution": "Acis"}, {"os": "5", "emi": 5, "product": "qdwd", "remarks": "ggg", "loanAmount": 35533, "nameOfBankInstitution": "sdd"}]}, "familyDetails": {"aboutApplicant": "About app", "aboutCoApplicant": "About cooo", "andTheirFamilyDetails": "Ab fam"}, "outputsSupply": {"creditTerms": "Cred terrrr", "marketForOutput": "Mar", "modeOfMarketing": "Modeeee", "typeOfCustomers": "Ty cust", "stockOfFinishedGoods": "Stoc finish good"}, "businessDetails": {"margins": "Mar", "gstNumber": "73737388", "legalName": "Le name", "tradeName": "Td name", "shopAddress": "Hydd kond", "businessName": "Bus name", "typeOfEntity": "Typ ennnn", "establishment": "Hydd", "godownAddress": "God add", "lastGSTReturn": "25000", "shopOwnership": "Owned", "productDetails": "Prod de", "businessProcess": "Bus pro", "godownOwnership": "Rented", "activityObserved": "Ac ob", "natureOfBusiness": "Nat", "documentsObserved": "Obse"}, "employeeDetails": {"pfEsiApplied": "Yes pf", "noOfEmployees": "25", "salaryDetails": "Sal detaislsss"}, "inputsPurchases": {"orderCycle": "Ord cyc", "creditTerms": "25", "avgOrderQnty": "255", "otherRemarks": "Othe rem", "detailsOfInputs": "Deti", "purchaseDetails": "Pur"}, "tradeReferences": {"customers": [{"contactDetails": "737373773", "nameOfCustomer": "Vust2"}, {"contactDetails": "73773737", "nameOfCustomer": "Vust2"}, {"contactDetails": "454323456", "nameOfCustomer": "vust3"}], "suppliers": [{"contactDetails": "Cont1", "nameOfSuppliers": "Supp 1"}, {"contactDetails": "Cont2-7838", "nameOfSuppliers": "Sup2"}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "Age1", "name": "Name1", "remarks": "Rem", "relation": "Rel", "occupation": "Icc", "qualification": "Qua"}, {"age": "Age", "name": "Name2", "remarks": "Hshe", "relation": "Rel2", "occupation": "Occ2", "qualification": "Qu2"}, {"age": 24, "name": "name2", "remarks": "ac", "relation": "d", "occupation": "ddd", "qualification": "10th pass"}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "Secert", "sourceOfIncome": "Other in"}, {"details": "Secerey2", "sourceOfIncome": "Other in2"}, {"details": "2edd", "sourceOfIncome": "trddd"}]}, "applicantsMainBankingDetails": {"endUse": "20205", "remarks": "Remarks again", "bankName": "Acis", "noOfYear": "25", "accountType": "Acc type", "limitOfCCOD": "Limit cc", "particulars": "Partuc", "ownContribution": "Yes own cont", "accountHolderName": "Rajj", "remarksAdditional": "Remarks3"}}	\N	2025-10-06 09:50:53.926	2025-10-07 07:02:22.402	Business	\N	\N	\N	\N	20	sdfgfds	\N	\N	\N	\N	PD	{"rent": 0, "sales": 1000, "wages": 0, "auditFee": 0, "purchase": 0, "salaries": 0, "services": 0, "insurance": 0, "netProfit": 998, "bankCharges": 0, "grossProfit": 998, "closingStock": 0, "depreciation": 0, "openingStock": 2, "rentReceived": 0, "advertisement": 0, "hamaliCharges": 0, "sadarExpenses": 0, "costOfServices": 0, "interestOnLoan": 0, "packingCharges": 0, "postageTelegram": 0, "telephoneCharges": 0, "officeMaintenance": 0, "commissionReceived": 0, "electricityCharges": 0, "printingStationery": 0, "repairsMaintenance": 0, "manufacturingExpenses": 0}	<ul><li>ascasc</li><li>wqd</li><li>qwd</li></ul>	\N
159	901	Business	44	Completed	wqv	{"netWorth": {"netWorth": [{"ownerName": "", "typeOfProperty": "", "yearsOfOwnership": "", "approxMarketValue": ""}]}, "caseDetails": {"contactNo": "2234632453", "personMet": "rest ", "coApplicant": "Akvxbx", "addressVisited": "wqv", "typeOfBorrower": "Proprietorship", "nameOfApplicant": "test11", "referenceNumber": "test11"}, "particulars": {"coordinates": "17.4642441,78.3679146"}, "loansDetails": {"loansDetails": [{"emi": "", "pos": "", "product": "", "remarks": "", "loanAmount": "", "nameOfBankInstitution": ""}]}, "familyDetails": {"aboutApplicant": "Fg", "aboutCoApplicant": "", "andTheirFamilyDetails": ""}, "outputsSupply": {"creditTerms": "", "marketForOutput": "Ccc", "modeOfMarketing": "", "typeOfCustomers": "", "stockOfFinishedGoods": ""}, "uploadedItems": [{"id": "17599199273053pd4w700ihm", "uri": "file:///data/user/0/com.beyondscale.kowthafi/cache/76d6cbc5-5e14-4442-9c57-34459190620d.jpg", "type": "photo", "pincode": "500084", "isCamera": true, "latitude": 17.464287, "locality": "Hyderabad", "longitude": 78.3678898, "timestamp": "2025-10-08T10:38:47.305Z", "s3ImageUrl": "verification/159/1759919926454-545ni.jpg", "isOverlayNeeded": true}], "businessDetails": {"shopAddress": "wqv", "businessName": "wdf"}, "employeeDetails": {"pfEsiApplied": "", "noOfEmployees": "8", "salaryDetails": "X"}, "inputsPurchases": {"orderCycle": "", "creditTerms": "Tz", "avgOrderQnty": "", "otherRemarks": "", "detailsOfInputs": "", "purchaseDetails": ""}, "ownContributions": {"ownContributions": [{"remarks": "", "particulars": ""}]}, "businessOwnerDetails": {"businessOwnerDetails": [{"age": "", "name": "", "remarks": "", "relation": "", "occupation": "", "qualification": ""}]}, "otherSourcesOfIncome": {"otherSourcesOfIncome": [{"details": "", "sourceOfIncome": ""}]}, "tradeReferencesCustomers": {"customers": [{"contactDetails": "", "nameOfCustomer": ""}]}, "tradeReferencesSuppliers": {"suppliers": [{"contactDetails": "", "nameOfSuppliers": ""}]}, "applicantsMainBankingDetails": {"endUse": "", "bankingDetails": [{"remarks": "", "bankName": "", "noOfYear": "", "accountType": "", "limitOfCCOD": "", "accountHolderName": ""}]}}	\N	2025-10-07 12:01:51.467	2025-10-08 10:39:44.167	Business	\N	\N	\N	\N	5	wdf	\N	\N	\N	\N	PD	\N	\N	\N
\.


--
-- Data for Name: VerificationRetries; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public."VerificationRetries" (id, "verificationId", date, geotag, address, reason, "fieldExecutiveId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: kowtha
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f0f8585a-a8c4-4633-afdf-e38b4ada97ba	40c31492068484896f14fed5e61c6dc05290589ba27b50f78a44168b305b58ff	2025-06-03 06:55:53.364416+00	20250602095604_intial_migration	\N	\N	2025-06-03 06:55:53.29925+00	1
36b2bbdc-58a1-4939-8489-c499192d01c8	91a6618607867e39d651e37f5555df36b745d674921e0633cb0cf4859f3cd1d6	2025-06-03 07:18:23.802531+00	20250603071656_address_optional_field	\N	\N	2025-06-03 07:18:23.789752+00	1
fd48ba80-db8c-4a83-b713-1363f2c7597e	d3ad97c7d85ace4ea0c402b40e87c084f99ed53c55d33e94eb59cc534c7858f1	2025-06-24 11:27:16.618267+00	20250624112450_added_finalreportpath	\N	\N	2025-06-24 11:27:16.600027+00	1
194afc64-82ef-4288-b5e2-a566d65ed0c6	07a9db27b3970f1f7a334f5e4af967c0f78c821459b3a064d9ee8b7b898b7ec1	2025-06-03 13:01:02.793799+00	20250603125951_add_user_status	\N	\N	2025-06-03 13:01:02.77538+00	1
bbf5508a-e28a-4c29-8e1c-a24171673a90	0c39d8cedf96ff32e3a86b7b7a9c3b61dcfe9ec81ea41b1342973ac8659ea501	2025-06-04 09:06:05.73019+00	20250604090517_addresstype_optional	\N	\N	2025-06-04 09:06:05.713521+00	1
ef1f2af3-731a-482b-8dd7-8c80f46011ad	9f8fe6f19ee96a3aa3f7d5c0ff06587eb20295e5b5e02509c35efe77a19f52be	2025-07-10 07:24:57.731792+00	20250710072043_added_businessname	\N	\N	2025-07-10 07:24:57.722305+00	1
0d5a1ede-41aa-4baa-9edf-586f20c80eb8	3261813890902b3fb31a32fb23970a9d562745a0e2fad835173bfd1a805d1363	2025-06-04 11:33:56.913721+00	20250604113307_added_addresstype	\N	\N	2025-06-04 11:33:56.903869+00	1
9c76f183-af16-406b-a20f-d16e024eafc8	b9c6d78013cf99e913bb6e1ddcfde0f398476a60ce2b19c999cbfaac5438e7e7	2025-07-01 09:25:27.925692+00	20250701020631_added_verification_retries	\N	\N	2025-07-01 09:25:27.899594+00	1
e2b3c4fb-afe3-4790-96ed-2674ac902c1b	d1c1ef904adb1eebebf8616795dbf0b0ddc71c1d10a7ab8dc35b5675388f4ae3	2025-06-05 10:44:13.150915+00	20250605104350_number_applicanttype_unique	\N	\N	2025-06-05 10:44:13.131788+00	1
8bb022a3-acc1-4d27-baa0-d52cd7951312	55d3422c6b1858ead9572628a50de081e86339f7dbbf96414793f5f8374cb319	2025-06-05 10:57:37.171484+00	20250605105716_dummy_remove_addresstype	\N	\N	2025-06-05 10:57:37.157777+00	1
984ab307-b0a4-46ea-b20a-13f4958197c7	3ef85ca556e2f51ea91539b9c01ea5a69e94476dea9f116abe04784a0fad3ae2	2025-06-05 11:00:22.195874+00	20250605110002_addresstype_changed	\N	\N	2025-06-05 11:00:22.182344+00	1
ec3dfb9d-18f5-4a78-9323-2caee393eacb	9bed9e90dcb96394c8a1bf4ab470d7635d836d15dbf65ec310a696e0140b3a89	2025-07-01 09:25:27.934911+00	20250701060549_added_appdeployment	\N	\N	2025-07-01 09:25:27.927249+00	1
f59fef99-83b9-40ab-b60b-19762e2fb134	3d21925605a17a06178834243da60ba59058755988ce2df68bd141031356a710	2025-06-11 10:32:04.219115+00	20250611062221_added_device_id	\N	\N	2025-06-11 10:32:04.202756+00	1
423b2c48-8a52-44d7-b507-e73ce3509178	6af4c34343af627c392881c27a5a2ffa54fa95e370d26afa48ffbaa2455c5dd5	2025-06-12 12:42:32.913955+00	20250612123433_removed_documenttable	\N	\N	2025-06-12 12:42:32.894622+00	1
c137a598-3a5b-4317-a280-473d8b9ea74c	7cf26594ea2b5c401d65dcf7cbed21676781dc03fb99f0b078ef6ccd7736a457	2025-08-13 10:40:59.544869+00	20250813100140_user_office_optional	\N	\N	2025-08-13 10:40:59.526011+00	1
a78a0ba1-d261-4235-873c-a6ada2f01ce0	483e5de0fff1f1ba97f916633a7e4cdfd96e3bbfc4a9c8db8ac36042326e4c39	2025-06-18 09:18:20.372876+00	20250618071251_added_attendance	\N	\N	2025-06-18 09:18:20.339597+00	1
8d6325ed-6b35-438b-ad1a-10ce5bf1e706	d40aadc5f2894471644c33c903c4d35b865c4bece00edb7a8fa449a9c116256b	2025-07-01 09:25:27.942173+00	20250701065738_removed_uniqueapplicationnumber	\N	\N	2025-07-01 09:25:27.936414+00	1
93172dc6-410a-4691-bec8-75e2546d9ade	6241abb555a042ca319f84666940f1b335086fea14630acebfccc70dcaeca3c2	2025-06-23 05:22:18.169588+00	20250620092631_removed_editrequest_mandatory	\N	\N	2025-06-23 05:22:18.155481+00	1
fe3f7a9c-c42a-4039-b41a-b5cf60b7ca8d	0beff93fc15bb94b81da0133cbe7fa7d30b8fdeeb1c5efef80d683b55c5c74df	2025-06-23 06:57:09.46778+00	20250623064003_added_approvedstatus	\N	\N	2025-06-23 06:57:09.453104+00	1
92397783-8a5e-4497-99f6-cbc3c611e93c	ac33b6ec731b0fcd24ac99e848f41a8a8b1870d78460278c3fc1189f9e457836	2025-07-16 08:36:14.717457+00	20250716074727_added_postponed	\N	\N	2025-07-16 08:36:14.703849+00	1
6a219c02-7e8f-4c78-aa62-3a34cb76d957	d1d2dc63ce03b40abbf71f12c6096cf7a5cbf7f37466ff4297ee4d054e88abaa	2025-07-02 11:45:20.990318+00	20250702113138_added_user_locality	\N	\N	2025-07-02 11:45:20.975006+00	1
a773612f-e3af-4a53-99f4-b1b32ee03552	b17f6bbde7121c55aebe5383867cef9b172a8d92379cae7daadf9fb85b19a81f	2025-07-04 13:40:41.493033+00	20250704133141_added_location_type	\N	\N	2025-07-04 13:40:41.475573+00	1
2a4d8894-deda-41eb-b798-2ef834199d9d	98ecf30cd9097c40b72b54f5ffdb35ad6e645c84f86f592aa79cb7e6b22cb893	2025-08-08 12:32:53.655481+00	20250808122639_removed_ops_id_loan	\N	\N	2025-08-08 12:32:53.621158+00	1
7f7ce934-d735-4a81-8759-7b529a6fbf1a	8a0971efc89304523dfb7030450d3f5b189573fdcd3149742dd8a33ec9e1c12c	2025-07-09 10:39:33.061614+00	20250707095416_added_userroles	\N	\N	2025-07-09 10:39:33.051419+00	1
c39ad1c6-7dfd-451d-91ca-896e433730ad	3ce69650ad0c3e91a88717f292e44c8d75c25475948cb5e4b2e50e3b877bcca5	2025-07-16 09:38:39.053103+00	20250716092337_added_postponedreason	\N	\N	2025-07-16 09:38:39.04133+00	1
16fa6e87-aaa5-4e6c-b9a5-7902bd14e337	342a822000f717c3571cd246fb877be20805e317272f751bf9043f9891c71aff	2025-07-10 06:58:31.235963+00	20250710062815_added_veriferverifcation	\N	\N	2025-07-10 06:58:31.215744+00	1
9fbd319e-cd25-40dc-ad58-f9e3537cd6ce	51892d7bb3fd3c544b2db1d64710e8febae4b382947f4a3d56750adcfaef7e1c	2025-07-16 10:40:04.746569+00	20250716101605_added_office_name	\N	\N	2025-07-16 10:40:04.736639+00	1
7ab35b5a-d6da-4d42-8699-910cc6037a32	6af6fdb97fe752b30e04928875845cdc2ab8902475ce3f592325a194bf3faf54	2025-07-31 05:06:53.956114+00	20250728114658_added_pd	\N	\N	2025-07-31 05:06:53.923631+00	1
6e73148e-7247-480e-8706-c2e12b344e09	3f19f684ebe9f95621f43582eaa950341830396fc615dc498c59b27298b670cd	2025-08-12 07:01:33.619487+00	20250812064207_added_emaillog	\N	\N	2025-08-12 07:01:33.571937+00	1
a817c3d6-e219-46b0-af83-bc7f6e69e3e5	6b6269bcc75869722f2627e54dd29728fe2ae51fd389bf7efa0955e7aa3357e6	2025-07-31 05:06:53.962631+00	20250730090559_added_defaultdept	\N	\N	2025-07-31 05:06:53.957622+00	1
de9924c7-c246-4082-8b97-7a220e142357	7e56a325071cad1bed86ce97cc862f02fe87c1cf75c4a75a90a21363b97e2645	2025-08-13 09:53:24.097566+00	20250812115836_added_office_departmentroles	\N	\N	2025-08-13 09:53:24.075254+00	1
c3a2d48b-d399-4f27-9b64-8c272dd7cbb9	32b52dad4b294c8e9d0661c98944d2feaf8d6991795ff9ad930281985ff5eef3	2025-09-01 05:45:08.527848+00	20250901052801_added_banks	\N	\N	2025-09-01 05:45:08.460938+00	1
986a88f5-5634-4d15-b4d5-7e382f0a77c8	9a211b2780ef6c2f5270a29b656ed24c226b4fb87ac2a11427fd2ff4a4712417	2025-08-19 09:55:20.105222+00	20250819063408_remove_office_id_user	\N	\N	2025-08-19 09:55:20.070581+00	1
ba219163-7cb8-4980-b370-83d92149f2f7	91af0c01693168164d44735ba00e1ff10e290ecb1fe59e33593a00340eea85fe	2025-08-28 10:30:18.918718+00	20250828093205_added_synopsis	\N	\N	2025-08-28 10:30:18.902282+00	1
f2c7cc43-3aef-475a-aec1-dd097f6590e6	c5871b8e1cf160da57e1c25a61f873693dec08f5c7c3576980e04fb295eca54f	2025-08-28 08:46:53.057784+00	20250828063337_added_financialanalysis	\N	\N	2025-08-28 08:46:53.037892+00	1
556459d1-8d76-4989-baca-d97e5bfa81f3	f4401f135f69cb713d8edb4728e96b55fed4ae475955eda48f5c5392bc27530c	2025-09-01 05:45:08.537425+00	20250901053708_merged_git	\N	\N	2025-09-01 05:45:08.530225+00	1
dfe9c9f8-98ae-4be2-9f44-92b41ef4434a	0762dad6ad978e146759531537068321021cec9171005c8d3adc14010f1fe71e	2025-09-01 05:45:08.544907+00	20250901054101_added_fin_synopsis	\N	\N	2025-09-01 05:45:08.539066+00	1
81023717-d49e-4d69-b849-ae02e502d135	8d151c8f0395a1da8ad19f8f326546c76ddb09caed652f39716993979a20de25	2025-09-01 07:13:30.075181+00	20250901065406_added_reassign	\N	\N	2025-09-01 07:13:30.059585+00	1
ca15799b-82c4-4a12-adb0-48392ad19970	aa3f4bf1a18af5a6ddeb42d5ec616b66785445a9b151172a6c42208efb2b95c0	2025-10-08 12:23:45.453458+00	20251006095455_added_new_userrole	\N	\N	2025-10-08 12:23:45.4329+00	1
\.


--
-- Name: AppDeployment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."AppDeployment_id_seq"', 85, true);


--
-- Name: Attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Attendance_id_seq"', 51, true);


--
-- Name: Bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Bank_id_seq"', 15, true);


--
-- Name: DepartmentRole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."DepartmentRole_id_seq"', 577, true);


--
-- Name: EditRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."EditRequest_id_seq"', 93, true);


--
-- Name: Loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Loan_id_seq"', 911, true);


--
-- Name: Office_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Office_id_seq"', 22, true);


--
-- Name: Organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Organization_id_seq"', 1, false);


--
-- Name: PDEmailLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."PDEmailLog_id_seq"', 1, false);


--
-- Name: Session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Session_id_seq"', 414, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."User_id_seq"', 47, true);


--
-- Name: VerificationRetries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."VerificationRetries_id_seq"', 1, false);


--
-- Name: Verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kowtha
--

SELECT pg_catalog.setval('public."Verification_id_seq"', 168, true);


--
-- Name: AppDeployment AppDeployment_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."AppDeployment"
    ADD CONSTRAINT "AppDeployment_pkey" PRIMARY KEY (id);


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: Bank Bank_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Bank"
    ADD CONSTRAINT "Bank_pkey" PRIMARY KEY (id);


--
-- Name: DepartmentRole DepartmentRole_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."DepartmentRole"
    ADD CONSTRAINT "DepartmentRole_pkey" PRIMARY KEY (id);


--
-- Name: EditRequest EditRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."EditRequest"
    ADD CONSTRAINT "EditRequest_pkey" PRIMARY KEY (id);


--
-- Name: Loan Loan_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Loan"
    ADD CONSTRAINT "Loan_pkey" PRIMARY KEY (id);


--
-- Name: Office Office_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Office"
    ADD CONSTRAINT "Office_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: PDEmailLog PDEmailLog_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."PDEmailLog"
    ADD CONSTRAINT "PDEmailLog_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationRetries VerificationRetries_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."VerificationRetries"
    ADD CONSTRAINT "VerificationRetries_pkey" PRIMARY KEY (id);


--
-- Name: Verification Verification_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Bank_name_key; Type: INDEX; Schema: public; Owner: kowtha
--

CREATE UNIQUE INDEX "Bank_name_key" ON public."Bank" USING btree (name);


--
-- Name: DepartmentRole_userId_department_key; Type: INDEX; Schema: public; Owner: kowtha
--

CREATE UNIQUE INDEX "DepartmentRole_userId_department_key" ON public."DepartmentRole" USING btree ("userId", department);


--
-- Name: Loan_applicationNumber_applicantType_department_reassignCou_key; Type: INDEX; Schema: public; Owner: kowtha
--

CREATE UNIQUE INDEX "Loan_applicationNumber_applicantType_department_reassignCou_key" ON public."Loan" USING btree ("applicationNumber", "applicantType", department, "reassignCount");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: kowtha
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_mobile_key; Type: INDEX; Schema: public; Owner: kowtha
--

CREATE UNIQUE INDEX "User_mobile_key" ON public."User" USING btree (mobile);


--
-- Name: Verification_loanId_type_key; Type: INDEX; Schema: public; Owner: kowtha
--

CREATE UNIQUE INDEX "Verification_loanId_type_key" ON public."Verification" USING btree ("loanId", type);


--
-- Name: Attendance Attendance_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DepartmentRole DepartmentRole_officeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."DepartmentRole"
    ADD CONSTRAINT "DepartmentRole_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES public."Office"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DepartmentRole DepartmentRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."DepartmentRole"
    ADD CONSTRAINT "DepartmentRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EditRequest EditRequest_approvedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."EditRequest"
    ADD CONSTRAINT "EditRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EditRequest EditRequest_loanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."EditRequest"
    ADD CONSTRAINT "EditRequest_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES public."Loan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EditRequest EditRequest_requestedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."EditRequest"
    ADD CONSTRAINT "EditRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EditRequest EditRequest_verificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."EditRequest"
    ADD CONSTRAINT "EditRequest_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES public."Verification"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Loan Loan_officeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Loan"
    ADD CONSTRAINT "Loan_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES public."Office"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Loan Loan_operationsExecutiveId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Loan"
    ADD CONSTRAINT "Loan_operationsExecutiveId_fkey" FOREIGN KEY ("operationsExecutiveId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Office Office_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Office"
    ADD CONSTRAINT "Office_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDEmailLog PDEmailLog_loanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."PDEmailLog"
    ADD CONSTRAINT "PDEmailLog_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES public."Loan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VerificationRetries VerificationRetries_fieldExecutiveId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."VerificationRetries"
    ADD CONSTRAINT "VerificationRetries_fieldExecutiveId_fkey" FOREIGN KEY ("fieldExecutiveId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VerificationRetries VerificationRetries_verificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."VerificationRetries"
    ADD CONSTRAINT "VerificationRetries_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES public."Verification"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Verification Verification_fieldExecutiveId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_fieldExecutiveId_fkey" FOREIGN KEY ("fieldExecutiveId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Verification Verification_loanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES public."Loan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Verification Verification_verifierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kowtha
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: kowtha
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--


