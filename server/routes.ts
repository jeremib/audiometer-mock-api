import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import { loginSchema, testSubmissionSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "hearing-test-secret-key";
const JWT_EXPIRES_IN = "1h";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        token,
        expires_in: 3600,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get tenants
  app.get("/tenants", authenticateToken, async (req: any, res) => {
    try {
      const tenants = await storage.getTenantsByUserId(req.user.userId);
      res.json({ tenants });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get groups by tenant
  app.get("/api/:tenantId/groups", authenticateToken, async (req: any, res) => {
    try {
      const { tenantId } = req.params;
      
      // Verify user has access to this tenant
      const userTenants = await storage.getTenantsByUserId(req.user.userId);
      if (!userTenants.some(tenant => tenant.id === tenantId)) {
        return res.status(403).json({ message: "Access denied to this tenant" });
      }

      const groups = await storage.getGroupsByTenant(tenantId);
      res.json({ groups });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get profiles by group
  app.get("/api/:tenantId/groups/:groupId/profiles", authenticateToken, async (req: any, res) => {
    try {
      const { tenantId, groupId } = req.params;
      
      // Verify user has access to this tenant
      const userTenants = await storage.getTenantsByUserId(req.user.userId);
      if (!userTenants.some(tenant => tenant.id === tenantId)) {
        return res.status(403).json({ message: "Access denied to this tenant" });
      }

      const profiles = await storage.getProfilesByGroup(tenantId, groupId);
      res.json({ profiles });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search profiles in a tenant
  app.get("/api/:tenantId/profiles/search", authenticateToken, async (req: any, res) => {
    try {
      const { tenantId } = req.params;
      const { q } = req.query;
      
      // Verify user has access to this tenant
      const userTenants = await storage.getTenantsByUserId(req.user.userId);
      if (!userTenants.some(tenant => tenant.id === tenantId)) {
        return res.status(403).json({ message: "Access denied to this tenant" });
      }

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query parameter 'q' is required" });
      }

      const profiles = await storage.searchProfiles(tenantId, q.trim());
      res.json({ profiles });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get profile details with test path
  app.get("/api/:tenantId/profiles/:profileId", authenticateToken, async (req: any, res) => {
    try {
      const { tenantId, profileId } = req.params;
      
      // Verify user has access to this tenant
      const userTenants = await storage.getTenantsByUserId(req.user.userId);
      if (!userTenants.some(tenant => tenant.id === tenantId)) {
        return res.status(403).json({ message: "Access denied to this tenant" });
      }

      const profile = await storage.getProfile(tenantId, profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const testPath = await storage.getTestPathByProfile(profileId);
      const previousTests = await storage.getHearingTestsByProfile(profileId);

      res.json({
        profile: {
          id: profile.id,
          employee_id: profile.employeeId,
          first_name: profile.firstName,
          last_name: profile.lastName,
          date_of_birth: profile.dateOfBirth,
          department: profile.department,
          last_test_date: profile.lastTestDate
        },
        test_path: testPath?.steps || [],
        previous_tests: previousTests.map(test => ({
          id: test.id,
          test_date: test.testDate,
          tester_id: test.testerId,
          device_id: test.deviceId,
          test_type: test.testType,
          results: test.results,
          next_test_due: test.nextTestDue
        }))
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Submit hearing test results
  app.post("/api/:tenantId/profiles/:profileId/tests", authenticateToken, async (req: any, res) => {
    try {
      const { tenantId, profileId } = req.params;
      
      // Verify user has access to this tenant
      const userTenants = await storage.getTenantsByUserId(req.user.userId);
      if (!userTenants.some(tenant => tenant.id === tenantId)) {
        return res.status(403).json({ message: "Access denied to this tenant" });
      }

      const profile = await storage.getProfile(tenantId, profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const testData = testSubmissionSchema.parse(req.body);
      
      const hearingTest = await storage.createHearingTest({
        tenantId,
        profileId,
        testDate: new Date(testData.test_metadata.test_date),
        testerId: testData.test_metadata.tester_id,
        deviceId: testData.test_metadata.device_id,
        testType: testData.test_metadata.test_type,
        results: testData.results,
        nextTestDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
      });

      res.status(201).json({
        success: true,
        test_id: hearingTest.id,
        message: "Test results saved successfully",
        next_test_due: hearingTest.nextTestDue
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid test data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "operational",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
