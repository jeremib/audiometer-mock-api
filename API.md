# Audiometer Mock API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication

All endpoints except `/login` require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Login

**POST** `/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "admin@hearingtest.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "tester-001",
    "username": "admin@hearingtest.com",
    "name": "Dr. Sarah Johnson",
    "role": "certified_tester"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Get Tenants

**GET** `/api/tenants`

Retrieve all tenants associated with the authenticated user.

**Response:**
```json
{
  "tenants": [
    {
      "id": "acme-corp",
      "name": "ACME Corporation",
      "industry": "Manufacturing",
      "active": true
    },
    {
      "id": "tech-solutions",
      "name": "Tech Solutions Inc",
      "industry": "Technology",
      "active": true
    }
  ]
}
```

---

### 3. Get Groups by Tenant

**GET** `/api/:tenantId/groups`

Retrieve all groups within a specific tenant.

**Parameters:**
- `tenantId` (path): The tenant ID

**Response:**
```json
{
  "groups": [
    {
      "id": "factory-floor",
      "tenant_id": "acme-corp",
      "name": "Factory Floor Workers",
      "description": "High noise exposure employees",
      "employee_count": 45,
      "risk_level": "high"
    },
    {
      "id": "office-staff",
      "tenant_id": "acme-corp",
      "name": "Office Staff",
      "description": "Administrative personnel",
      "employee_count": 23,
      "risk_level": "low"
    }
  ]
}
```

---

### 4. Get Profiles by Group

**GET** `/api/:tenantId/groups/:groupId/profiles`

Retrieve all employee profiles within a specific group.

**Parameters:**
- `tenantId` (path): The tenant ID
- `groupId` (path): The group ID

**Response:**
```json
{
  "profiles": [
    {
      "id": "emp-001",
      "employee_id": "E12345",
      "first_name": "John",
      "last_name": "Smith",
      "date_of_birth": "1985-06-15",
      "department": "Manufacturing",
      "last_test_date": "2023-12-01"
    },
    {
      "id": "emp-002",
      "employee_id": "E12346",
      "first_name": "Maria",
      "last_name": "Rodriguez",
      "date_of_birth": "1990-03-22",
      "department": "Manufacturing",
      "last_test_date": "2023-11-15"
    }
  ]
}
```

---

### 5. Search Profiles

**GET** `/api/:tenantId/profiles/search?q={query}`

Search for employee profiles within a tenant.

**Parameters:**
- `tenantId` (path): The tenant ID
- `q` (query): Search query string (searches in first name, last name, employee ID, and department)

**Response:**
```json
{
  "profiles": [
    {
      "id": "emp-001",
      "employee_id": "E12345",
      "first_name": "John",
      "last_name": "Smith",
      "date_of_birth": "1985-06-15",
      "department": "Manufacturing",
      "last_test_date": "2023-12-01"
    }
  ]
}
```

---

### 6. Get Profile with Test Path and Previous Tests

**GET** `/api/:tenantId/profiles/:profileId`

Retrieve detailed information about a specific profile, including the test path and all previous test results.

**Parameters:**
- `tenantId` (path): The tenant ID
- `profileId` (path): The profile ID

**Response:**
```json
{
  "profile": {
    "id": "emp-001",
    "employee_id": "E12345",
    "first_name": "John",
    "last_name": "Smith",
    "date_of_birth": "1985-06-15",
    "department": "Manufacturing",
    "last_test_date": "2023-12-01"
  },
  "test_path": [
    {
      "step": 1,
      "frequency_hz": 500,
      "decibel_db": 25,
      "ear": "left"
    },
    {
      "step": 2,
      "frequency_hz": 1000,
      "decibel_db": 25,
      "ear": "left"
    }
    // ... more test steps
  ],
  "previous_tests": [
    {
      "id": "test-2023-12-01-emp001",
      "test_date": "2023-12-01T10:30:00.000Z",
      "tester_id": "tester-001",
      "device_id": "device-audio-001",
      "test_type": "audiometry",
      "results": [
        {
          "step": 1,
          "frequency_hz": 500,
          "decibel_db": 25,
          "ear": "left",
          "response": "heard"
        },
        {
          "step": 2,
          "frequency_hz": 1000,
          "decibel_db": 25,
          "ear": "left",
          "response": "heard"
        }
        // ... more test results
      ],
      "next_test_due": "2024-12-01"
    },
    {
      "id": "test-2023-06-15-emp001",
      "test_date": "2023-06-15T14:15:00.000Z",
      "tester_id": "tester-001",
      "device_id": "device-audio-001",
      "test_type": "audiometry",
      "results": [
        // ... test results
      ],
      "next_test_due": "2024-06-15"
    }
  ]
}
```

**Notes:**
- `previous_tests` array is ordered by test date (newest first by default)
- Each test includes complete audiometry results with hearing thresholds
- Results show the decibel level at which the patient could hear each frequency

---

### 7. Submit Hearing Test

**POST** `/api/:tenantId/profiles/:profileId/tests`

Submit new hearing test results for a profile.

**Parameters:**
- `tenantId` (path): The tenant ID
- `profileId` (path): The profile ID

**Request Body:**
```json
{
  "test_metadata": {
    "test_date": "2024-11-14T10:30:00Z",
    "tester_id": "tester-001",
    "device_id": "device-audio-001",
    "test_type": "audiometry"
  },
  "results": [
    {
      "step": 1,
      "frequency_hz": 500,
      "decibel_db": 25,
      "ear": "left",
      "response": "heard"
    },
    {
      "step": 2,
      "frequency_hz": 1000,
      "decibel_db": 30,
      "ear": "left",
      "response": "heard"
    }
    // ... more test results
  ]
}
```

**Response:**
```json
{
  "success": true,
  "test_id": "test-1699961234567-abc123xyz",
  "message": "Test submitted successfully"
}
```

**Validation Rules:**
- `test_metadata.test_date`: Required, must be a valid ISO 8601 date string
- `test_metadata.tester_id`: Required string
- `test_metadata.device_id`: Required string
- `test_metadata.test_type`: Optional, defaults to "audiometry"
- `results`: Required array with at least one result
- Each result must include:
  - `step`: Number (sequential test step)
  - `frequency_hz`: Number (test frequency in Hertz)
  - `decibel_db`: Number (sound level in decibels)
  - `ear`: Enum ("left", "right", or "both")
  - `response`: Enum ("heard" or "not_heard")

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Invalid or expired token"
}
```
or
```json
{
  "message": "Access denied to this tenant"
}
```

### 404 Not Found
```json
{
  "message": "Profile not found"
}
```
or
```json
{
  "message": "Group not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Sample Data

The API includes the following mock data for testing:

### Test User
- Username: `admin@hearingtest.com`
- Password: `SecurePass123!`

### Tenants
- `acme-corp` - ACME Corporation (Manufacturing)
- `tech-solutions` - Tech Solutions Inc (Technology)

### Profiles with Previous Tests
- `emp-001` (John Smith) - Has 2 previous hearing tests
- `emp-002` (Maria Rodriguez) - Has 1 previous hearing test
- `emp-003` (David Chen) - Has 1 previous hearing test

---

## Data Models

### Profile
```typescript
{
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  department: string;
  last_test_date: string | null;
}
```

### Test Path Step
```typescript
{
  step: number;
  frequency_hz: number;
  decibel_db: number;
  ear: "left" | "right" | "both";
}
```

### Hearing Test Result
```typescript
{
  step: number;
  frequency_hz: number;
  decibel_db: number;
  ear: "left" | "right" | "both";
  response: "heard" | "not_heard";
}
```

### Previous Test
```typescript
{
  id: string;
  test_date: string; // ISO 8601 timestamp
  tester_id: string;
  device_id: string;
  test_type: string;
  results: HearingTestResult[];
  next_test_due: string | null;
}
```
