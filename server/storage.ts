import { 
  type User, 
  type InsertUser, 
  type Tenant,
  type InsertTenant,
  type Group,
  type InsertGroup,
  type Profile,
  type InsertProfile,
  type TestPath,
  type InsertTestPath,
  type HearingTest,
  type InsertHearingTest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tenant operations
  getTenants(): Promise<Tenant[]>;
  getTenantsByUserId(userId: string): Promise<Tenant[]>;
  getTenant(id: string): Promise<Tenant | undefined>;

  // Group operations
  getGroupsByTenant(tenantId: string): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;

  // Profile operations
  getProfilesByGroup(tenantId: string, groupId: string): Promise<Profile[]>;
  getProfile(tenantId: string, profileId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  searchProfiles(tenantId: string, query: string): Promise<Profile[]>;

  // Test path operations
  getTestPathByProfile(profileId: string): Promise<TestPath | undefined>;

  // Hearing test operations
  createHearingTest(test: InsertHearingTest): Promise<HearingTest>;
  getHearingTestsByProfile(profileId: string): Promise<HearingTest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tenants: Map<string, Tenant>;
  private groups: Map<string, Group>;
  private profiles: Map<string, Profile>;
  private testPaths: Map<string, TestPath>;
  private hearingTests: Map<string, HearingTest>;
  private userTenants: Map<string, string[]>; // userId -> tenantIds

  constructor() {
    this.users = new Map();
    this.tenants = new Map();
    this.groups = new Map();
    this.profiles = new Map();
    this.testPaths = new Map();
    this.hearingTests = new Map();
    this.userTenants = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Create test user
    const testUser: User = {
      id: "tester-001",
      username: "admin@hearingtest.com",
      password: "SecurePass123!", // In real app, this would be hashed
      name: "Dr. Sarah Johnson",
      role: "certified_tester"
    };
    this.users.set(testUser.id, testUser);

    // Create tenants
    const tenants: Tenant[] = [
      {
        id: "acme-corp",
        name: "ACME Corporation",
        industry: "Manufacturing",
        active: true
      },
      {
        id: "tech-solutions",
        name: "Tech Solutions Inc",
        industry: "Technology", 
        active: true
      }
    ];
    tenants.forEach(tenant => this.tenants.set(tenant.id, tenant));

    // Associate user with tenants
    this.userTenants.set("tester-001", ["acme-corp", "tech-solutions"]);

    // Create groups
    const groups: Group[] = [
      {
        id: "factory-floor",
        tenantId: "acme-corp",
        name: "Factory Floor Workers",
        description: "High noise exposure employees",
        employeeCount: 45,
        riskLevel: "high"
      },
      {
        id: "office-staff",
        tenantId: "acme-corp", 
        name: "Office Staff",
        description: "Administrative personnel",
        employeeCount: 23,
        riskLevel: "low"
      },
      {
        id: "developers",
        tenantId: "tech-solutions",
        name: "Software Developers",
        description: "Development team members",
        employeeCount: 30,
        riskLevel: "low"
      }
    ];
    groups.forEach(group => this.groups.set(group.id, group));

    // Create profiles
    const profiles: Profile[] = [
      {
        id: "emp-001",
        tenantId: "acme-corp",
        groupId: "factory-floor",
        employeeId: "E12345",
        firstName: "John",
        lastName: "Smith",
        dateOfBirth: "1985-06-15",
        department: "Manufacturing",
        lastTestDate: "2023-12-01"
      },
      {
        id: "emp-002",
        tenantId: "acme-corp",
        groupId: "factory-floor",
        employeeId: "E12346",
        firstName: "Maria",
        lastName: "Rodriguez",
        dateOfBirth: "1990-03-22",
        department: "Manufacturing",
        lastTestDate: "2023-11-15"
      },
      {
        id: "emp-003",
        tenantId: "acme-corp",
        groupId: "office-staff",
        employeeId: "E12347",
        firstName: "David",
        lastName: "Chen",
        dateOfBirth: "1988-09-10",
        department: "Administration",
        lastTestDate: "2024-01-05"
      },
      {
        id: "emp-004",
        tenantId: "acme-corp",
        groupId: "factory-floor",
        employeeId: "E12348",
        firstName: "Sarah",
        lastName: "Johnson",
        dateOfBirth: "1992-11-30",
        department: "Manufacturing",
        lastTestDate: "2024-02-14"
      },
      {
        id: "emp-005",
        tenantId: "acme-corp",
        groupId: "office-staff",
        employeeId: "E12349",
        firstName: "Michael",
        lastName: "Brown",
        dateOfBirth: "1987-04-18",
        department: "Finance",
        lastTestDate: "2024-01-20"
      },
      {
        id: "emp-006",
        tenantId: "tech-solutions",
        groupId: "developers",
        employeeId: "T54321",
        firstName: "Emily",
        lastName: "Davis",
        dateOfBirth: "1991-08-25",
        department: "Engineering",
        lastTestDate: "2024-03-01"
      },
      {
        id: "emp-007",
        tenantId: "tech-solutions",
        groupId: "developers",
        employeeId: "T54322",
        firstName: "Alex",
        lastName: "Wilson",
        dateOfBirth: "1989-12-12",
        department: "Engineering",
        lastTestDate: "2024-02-28"
      }
    ];
    profiles.forEach(profile => this.profiles.set(profile.id, profile));

    // Create test paths
    const testPaths: TestPath[] = [
      {
        id: "path-001",
        profileId: "emp-001",
        steps: [
          { step: 1, frequency_hz: 500, decibel_db: 25, ear: "left" },
          { step: 2, frequency_hz: 1000, decibel_db: 25, ear: "left" },
          { step: 3, frequency_hz: 2000, decibel_db: 25, ear: "left" },
          { step: 4, frequency_hz: 3000, decibel_db: 25, ear: "left" },
          { step: 5, frequency_hz: 4000, decibel_db: 25, ear: "left" },
          { step: 6, frequency_hz: 6000, decibel_db: 25, ear: "left" },
          { step: 7, frequency_hz: 8000, decibel_db: 25, ear: "left" },
          { step: 8, frequency_hz: 500, decibel_db: 25, ear: "right" },
          { step: 9, frequency_hz: 1000, decibel_db: 25, ear: "right" },
          { step: 10, frequency_hz: 2000, decibel_db: 25, ear: "right" },
          { step: 11, frequency_hz: 3000, decibel_db: 25, ear: "right" },
          { step: 12, frequency_hz: 4000, decibel_db: 25, ear: "right" },
          { step: 13, frequency_hz: 6000, decibel_db: 25, ear: "right" },
          { step: 14, frequency_hz: 8000, decibel_db: 25, ear: "right" }
        ]
      }
    ];
    testPaths.forEach(path => this.testPaths.set(path.id, path));

    // Create sample hearing tests
    const hearingTests: HearingTest[] = [
      {
        id: "test-2023-12-01-emp001",
        tenantId: "acme-corp",
        profileId: "emp-001",
        testDate: new Date("2023-12-01T10:30:00Z"),
        testerId: "tester-001",
        deviceId: "device-audio-001",
        testType: "audiometry",
        results: [
          { step: 1, frequency_hz: 500, decibel_db: 25, ear: "left", response: "heard" },
          { step: 2, frequency_hz: 1000, decibel_db: 25, ear: "left", response: "heard" },
          { step: 3, frequency_hz: 2000, decibel_db: 30, ear: "left", response: "heard" },
          { step: 4, frequency_hz: 3000, decibel_db: 35, ear: "left", response: "heard" },
          { step: 5, frequency_hz: 4000, decibel_db: 40, ear: "left", response: "heard" },
          { step: 6, frequency_hz: 6000, decibel_db: 45, ear: "left", response: "heard" },
          { step: 7, frequency_hz: 8000, decibel_db: 45, ear: "left", response: "heard" },
          { step: 8, frequency_hz: 500, decibel_db: 25, ear: "right", response: "heard" },
          { step: 9, frequency_hz: 1000, decibel_db: 25, ear: "right", response: "heard" },
          { step: 10, frequency_hz: 2000, decibel_db: 30, ear: "right", response: "heard" },
          { step: 11, frequency_hz: 3000, decibel_db: 40, ear: "right", response: "heard" },
          { step: 12, frequency_hz: 4000, decibel_db: 45, ear: "right", response: "heard" },
          { step: 13, frequency_hz: 6000, decibel_db: 50, ear: "right", response: "heard" },
          { step: 14, frequency_hz: 8000, decibel_db: 50, ear: "right", response: "heard" }
        ],
        nextTestDue: "2024-12-01"
      },
      {
        id: "test-2023-06-15-emp001",
        tenantId: "acme-corp",
        profileId: "emp-001",
        testDate: new Date("2023-06-15T14:15:00Z"),
        testerId: "tester-001",
        deviceId: "device-audio-001",
        testType: "audiometry",
        results: [
          { step: 1, frequency_hz: 500, decibel_db: 20, ear: "left", response: "heard" },
          { step: 2, frequency_hz: 1000, decibel_db: 20, ear: "left", response: "heard" },
          { step: 3, frequency_hz: 2000, decibel_db: 25, ear: "left", response: "heard" },
          { step: 4, frequency_hz: 3000, decibel_db: 30, ear: "left", response: "heard" },
          { step: 5, frequency_hz: 4000, decibel_db: 35, ear: "left", response: "heard" },
          { step: 6, frequency_hz: 6000, decibel_db: 40, ear: "left", response: "heard" },
          { step: 7, frequency_hz: 8000, decibel_db: 40, ear: "left", response: "heard" },
          { step: 8, frequency_hz: 500, decibel_db: 20, ear: "right", response: "heard" },
          { step: 9, frequency_hz: 1000, decibel_db: 20, ear: "right", response: "heard" },
          { step: 10, frequency_hz: 2000, decibel_db: 25, ear: "right", response: "heard" },
          { step: 11, frequency_hz: 3000, decibel_db: 35, ear: "right", response: "heard" },
          { step: 12, frequency_hz: 4000, decibel_db: 40, ear: "right", response: "heard" },
          { step: 13, frequency_hz: 6000, decibel_db: 45, ear: "right", response: "heard" },
          { step: 14, frequency_hz: 8000, decibel_db: 45, ear: "right", response: "heard" }
        ],
        nextTestDue: "2024-06-15"
      },
      {
        id: "test-2023-11-15-emp002",
        tenantId: "acme-corp",
        profileId: "emp-002",
        testDate: new Date("2023-11-15T09:00:00Z"),
        testerId: "tester-001",
        deviceId: "device-audio-002",
        testType: "audiometry",
        results: [
          { step: 1, frequency_hz: 500, decibel_db: 20, ear: "left", response: "heard" },
          { step: 2, frequency_hz: 1000, decibel_db: 20, ear: "left", response: "heard" },
          { step: 3, frequency_hz: 2000, decibel_db: 20, ear: "left", response: "heard" },
          { step: 4, frequency_hz: 3000, decibel_db: 25, ear: "left", response: "heard" },
          { step: 5, frequency_hz: 4000, decibel_db: 25, ear: "left", response: "heard" },
          { step: 6, frequency_hz: 6000, decibel_db: 30, ear: "left", response: "heard" },
          { step: 7, frequency_hz: 8000, decibel_db: 30, ear: "left", response: "heard" },
          { step: 8, frequency_hz: 500, decibel_db: 20, ear: "right", response: "heard" },
          { step: 9, frequency_hz: 1000, decibel_db: 20, ear: "right", response: "heard" },
          { step: 10, frequency_hz: 2000, decibel_db: 20, ear: "right", response: "heard" },
          { step: 11, frequency_hz: 3000, decibel_db: 25, ear: "right", response: "heard" },
          { step: 12, frequency_hz: 4000, decibel_db: 25, ear: "right", response: "heard" },
          { step: 13, frequency_hz: 6000, decibel_db: 30, ear: "right", response: "heard" },
          { step: 14, frequency_hz: 8000, decibel_db: 30, ear: "right", response: "heard" }
        ],
        nextTestDue: "2024-11-15"
      },
      {
        id: "test-2024-01-05-emp003",
        tenantId: "acme-corp",
        profileId: "emp-003",
        testDate: new Date("2024-01-05T11:45:00Z"),
        testerId: "tester-001",
        deviceId: "device-audio-001",
        testType: "audiometry",
        results: [
          { step: 1, frequency_hz: 500, decibel_db: 15, ear: "left", response: "heard" },
          { step: 2, frequency_hz: 1000, decibel_db: 15, ear: "left", response: "heard" },
          { step: 3, frequency_hz: 2000, decibel_db: 15, ear: "left", response: "heard" },
          { step: 4, frequency_hz: 3000, decibel_db: 20, ear: "left", response: "heard" },
          { step: 5, frequency_hz: 4000, decibel_db: 20, ear: "left", response: "heard" },
          { step: 6, frequency_hz: 6000, decibel_db: 20, ear: "left", response: "heard" },
          { step: 7, frequency_hz: 8000, decibel_db: 25, ear: "left", response: "heard" },
          { step: 8, frequency_hz: 500, decibel_db: 15, ear: "right", response: "heard" },
          { step: 9, frequency_hz: 1000, decibel_db: 15, ear: "right", response: "heard" },
          { step: 10, frequency_hz: 2000, decibel_db: 15, ear: "right", response: "heard" },
          { step: 11, frequency_hz: 3000, decibel_db: 20, ear: "right", response: "heard" },
          { step: 12, frequency_hz: 4000, decibel_db: 20, ear: "right", response: "heard" },
          { step: 13, frequency_hz: 6000, decibel_db: 20, ear: "right", response: "heard" },
          { step: 14, frequency_hz: 8000, decibel_db: 25, ear: "right", response: "heard" }
        ],
        nextTestDue: "2025-01-05"
      }
    ];
    hearingTests.forEach(test => this.hearingTests.set(test.id, test));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async getTenantsByUserId(userId: string): Promise<Tenant[]> {
    const userTenantIds = this.userTenants.get(userId) || [];
    return userTenantIds.map(id => this.tenants.get(id)).filter(Boolean) as Tenant[];
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async getGroupsByTenant(tenantId: string): Promise<Group[]> {
    return Array.from(this.groups.values()).filter(
      group => group.tenantId === tenantId
    );
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getProfilesByGroup(tenantId: string, groupId: string): Promise<Profile[]> {
    return Array.from(this.profiles.values()).filter(
      profile => profile.tenantId === tenantId && profile.groupId === groupId
    );
  }

  async getProfile(tenantId: string, profileId: string): Promise<Profile | undefined> {
    const profile = this.profiles.get(profileId);
    return profile && profile.tenantId === tenantId ? profile : undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }

  async searchProfiles(tenantId: string, query: string): Promise<Profile[]> {
    const searchQuery = query.toLowerCase();
    return Array.from(this.profiles.values()).filter(profile => {
      if (profile.tenantId !== tenantId) return false;
      
      return (
        profile.firstName.toLowerCase().includes(searchQuery) ||
        profile.lastName.toLowerCase().includes(searchQuery) ||
        profile.employeeId.toLowerCase().includes(searchQuery) ||
        profile.department.toLowerCase().includes(searchQuery) ||
        `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(searchQuery)
      );
    });
  }

  async getTestPathByProfile(profileId: string): Promise<TestPath | undefined> {
    return Array.from(this.testPaths.values()).find(
      path => path.profileId === profileId
    );
  }

  async createHearingTest(insertTest: InsertHearingTest): Promise<HearingTest> {
    const id = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const test: HearingTest = { ...insertTest, id };
    this.hearingTests.set(id, test);
    return test;
  }

  async getHearingTestsByProfile(profileId: string): Promise<HearingTest[]> {
    return Array.from(this.hearingTests.values()).filter(
      test => test.profileId === profileId
    );
  }
}

export const storage = new MemStorage();
