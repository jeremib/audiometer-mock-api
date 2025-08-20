import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Key, 
  Building, 
  Users, 
  UserCircle, 
  Headphones, 
  Play, 
  Download, 
  User,
  Stethoscope,
  CheckCircle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function DeveloperPortal() {
  const [activeSection, setActiveSection] = useState("authentication");
  const { toast } = useToast();

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    function updateActiveSection() {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
          current = section.getAttribute('id') || '';
        }
      });
      
      setActiveSection(current);
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
    
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  const testEndpoint = async (endpoint: string) => {
    toast({
      title: "Testing endpoint...",
      description: `Testing ${endpoint} endpoint`,
    });

    try {
      let response;
      switch (endpoint) {
        case 'login':
          response = await apiRequest("POST", "/login", {
            username: "admin@hearingtest.com",
            password: "SecurePass123!"
          });
          break;
        case 'tenants':
          response = await apiRequest("GET", "/tenants");
          break;
        case 'groups':
          response = await apiRequest("GET", "/api/acme-corp/groups");
          break;
        case 'profiles':
          response = await apiRequest("GET", "/api/acme-corp/groups/factory-floor/profiles");
          break;
        case 'profile':
          response = await apiRequest("GET", "/api/acme-corp/profiles/emp-001");
          break;
        case 'submit-test':
          response = await apiRequest("POST", "/api/acme-corp/profiles/emp-001/tests", {
            test_metadata: {
              test_date: new Date().toISOString(),
              tester_id: "tester-001",
              device_id: "iPad-12345",
              test_type: "audiometry"
            },
            results: [
              {
                step: 1,
                frequency_hz: 500,
                decibel_db: 25,
                ear: "left",
                response: "heard"
              }
            ]
          });
          break;
        default:
          throw new Error("Unknown endpoint");
      }

      toast({
        title: "Success!",
        description: `${endpoint} endpoint tested successfully`,
      });
    } catch (error) {
      toast({
        title: "Test failed",
        description: `Failed to test ${endpoint} endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Hearing Test API</h1>
              <Badge variant="outline" className="ml-3 bg-green-100 text-green-800">v1.0</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Developer Portal</span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 fixed h-full overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">API Endpoints</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('authentication')}
                  className={`sidebar-item block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === 'authentication' 
                      ? 'bg-blue-100 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                  data-testid="nav-authentication"
                >
                  <Key className="inline mr-2" size={16} />
                  Authentication
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('tenants')}
                  className={`sidebar-item block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === 'tenants' 
                      ? 'bg-blue-100 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                  data-testid="nav-tenants"
                >
                  <Building className="inline mr-2" size={16} />
                  Tenants
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('groups')}
                  className={`sidebar-item block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === 'groups' 
                      ? 'bg-blue-100 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                  data-testid="nav-groups"
                >
                  <Users className="inline mr-2" size={16} />
                  Groups
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('profiles')}
                  className={`sidebar-item block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === 'profiles' 
                      ? 'bg-blue-100 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                  data-testid="nav-profiles"
                >
                  <UserCircle className="inline mr-2" size={16} />
                  Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('tests')}
                  className={`sidebar-item block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === 'tests' 
                      ? 'bg-blue-100 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                  data-testid="nav-tests"
                >
                  <Headphones className="inline mr-2" size={16} />
                  Hearing Tests
                </button>
              </li>
            </ul>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h3>
            <Button className="w-full mb-2" data-testid="button-test-all">
              <Play className="mr-2" size={16} />
              Test All Endpoints
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-export-postman">
              <Download className="mr-2" size={16} />
              Export Postman Collection
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">HIPAA-Compliant Hearing Test API</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                A comprehensive RESTful API for conducting and managing occupational hearing tests on iPad devices. 
                This developer portal provides interactive documentation and testing capabilities for all endpoints.
              </p>
              <Card className="mt-4 border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex">
                    <Info className="text-primary mt-0.5 mr-2" size={16} />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Base URL:</strong> <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">http://localhost:5000</code>
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                        All endpoints return hardcoded data for development and testing purposes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Authentication Section */}
            <section id="authentication" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Authentication</h2>
              
              <Card className="endpoint-card shadow-md mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Badge variant="default" className="bg-green-100 text-green-800 mr-3">POST</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">/login</h3>
                    </div>
                    <Button onClick={() => testEndpoint('login')} data-testid="button-test-login">
                      <Play className="mr-1" size={16} />
                      Test
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Authenticate a hearing test administrator and receive a JWT token.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Request Body</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
  "username": "admin@hearingtest.com",
  "password": "SecurePass123!"
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response (200)</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "tester-001",
    "name": "Dr. Sarah Johnson",
    "role": "certified_tester"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tenants Section */}
            <section id="tenants" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Tenant Management</h2>
              
              <Card className="endpoint-card shadow-md mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 mr-3">GET</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">/tenants</h3>
                    </div>
                    <Button onClick={() => testEndpoint('tenants')} data-testid="button-test-tenants">
                      <Play className="mr-1" size={16} />
                      Test
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Retrieve all tenants accessible to the authenticated user.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Headers</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer">
Authorization: Bearer {`{jwt_token}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response (200)</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
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
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Groups Section */}
            <section id="groups" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Group Management</h2>
              
              <Card className="endpoint-card shadow-md mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 mr-3">GET</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">/api/{`{tenant_id}`}/groups</h3>
                    </div>
                    <Button onClick={() => testEndpoint('groups')} data-testid="button-test-groups">
                      <Play className="mr-1" size={16} />
                      Test
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Retrieve all employee groups within a specific tenant.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">URL Parameters</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm mr-2">tenant_id</code>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Tenant identifier</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response (200)</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
  "groups": [
    {
      "id": "factory-floor",
      "name": "Factory Floor Workers",
      "description": "High noise exposure employees",
      "employee_count": 45,
      "risk_level": "high"
    },
    {
      "id": "office-staff",
      "name": "Office Staff",
      "description": "Administrative personnel",
      "employee_count": 23,
      "risk_level": "low"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Profiles Section */}
            <section id="profiles" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Employee Profiles</h2>
              
              {/* Get Profiles */}
              <Card className="endpoint-card shadow-md mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 mr-3">GET</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">/api/{`{tenant_id}`}/groups/{`{group_id}`}/profiles</h3>
                    </div>
                    <Button onClick={() => testEndpoint('profiles')} data-testid="button-test-profiles">
                      <Play className="mr-1" size={16} />
                      Test
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Get all employee profiles within a specific group.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">URL Parameters</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm mr-2">tenant_id</code>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Tenant identifier</span>
                        </div>
                        <div className="flex items-center">
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm mr-2">group_id</code>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Group identifier</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response (200)</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
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
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Get Single Profile */}
              <Card className="endpoint-card shadow-md mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 mr-3">GET</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">/api/{`{tenant_id}`}/profiles/{`{profile_id}`}</h3>
                    </div>
                    <Button onClick={() => testEndpoint('profile')} data-testid="button-test-profile">
                      <Play className="mr-1" size={16} />
                      Test
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Get detailed profile information including assigned test path.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">URL Parameters</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm mr-2">tenant_id</code>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Tenant identifier</span>
                        </div>
                        <div className="flex items-center">
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm mr-2">profile_id</code>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Employee profile ID</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response (200)</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
  "profile": {
    "id": "emp-001",
    "employee_id": "E12345",
    "first_name": "John",
    "last_name": "Smith",
    "date_of_birth": "1985-06-15",
    "department": "Manufacturing"
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
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tests Section */}
            <section id="tests" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Hearing Tests</h2>
              
              <Card className="endpoint-card shadow-md mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Badge variant="default" className="bg-green-100 text-green-800 mr-3">POST</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">/api/{`{tenant_id}`}/profiles/{`{profile_id}`}/tests</h3>
                    </div>
                    <Button onClick={() => testEndpoint('submit-test')} data-testid="button-test-submit-test">
                      <Play className="mr-1" size={16} />
                      Test
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Submit hearing test results for an employee.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Request Body</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
  "test_metadata": {
    "test_date": "2024-01-15T10:30:00Z",
    "tester_id": "tester-001",
    "device_id": "iPad-12345",
    "test_type": "audiometry"
  },
  "results": [
    {
      "step": 1,
      "frequency_hz": 500,
      "decibel_db": 25,
      "ear": "left",
      "response": "heard"
    }
  ]
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response (201)</h4>
                      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm json-viewer syntax-highlight overflow-x-auto">
{`{
  "success": true,
  "test_id": "test-20240115-001",
  "message": "Test results saved successfully",
  "next_test_due": "2025-01-15"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Status Section */}
            <section className="mb-12">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 text-xl mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">API Status: Operational</h3>
                      <p className="text-green-700 dark:text-green-400">All endpoints are functioning normally. Last updated: January 15, 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
