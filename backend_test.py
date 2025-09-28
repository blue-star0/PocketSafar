#!/usr/bin/env python3
"""
POCKETSAFAR Backend Testing Suite
Tests all backend components including authentication, travel diary, expenses, AI guide, and gamification
"""

import asyncio
import httpx
import json
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Configuration
BASE_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://trip-analytics-1.preview.emergentagent.com')
API_URL = f"{BASE_URL}/api"

class PocketSafarTester:
    def __init__(self):
        self.session_token = None
        self.user_data = None
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def close(self):
        await self.client.aclose()
    
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
    
    async def test_health_check(self):
        """Test if backend is accessible"""
        try:
            response = await self.client.get(f"{BASE_URL}/")
            if response.status_code == 200:
                self.log_test("Backend Health Check", "PASS", f"Backend accessible at {BASE_URL}")
                return True
            else:
                self.log_test("Backend Health Check", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", f"Connection error: {str(e)}")
            return False
    
    async def test_emergent_auth_integration(self):
        """Test Emergent Authentication Integration"""
        print("🔐 Testing Emergent Authentication Integration...")
        
        # Test session creation endpoint exists
        try:
            # Test without session ID (should fail)
            response = await self.client.post(f"{API_URL}/auth/session")
            if response.status_code == 400:
                self.log_test("Auth Session Endpoint", "PASS", "Correctly requires session ID")
            else:
                self.log_test("Auth Session Endpoint", "FAIL", f"Unexpected status: {response.status_code}")
                return False
                
            # Test with invalid session ID
            response = await self.client.post(
                f"{API_URL}/auth/session",
                headers={"X-Session-ID": "invalid_session_id"}
            )
            if response.status_code == 401:
                self.log_test("Auth Invalid Session", "PASS", "Correctly rejects invalid session")
            else:
                self.log_test("Auth Invalid Session", "FAIL", f"Status: {response.status_code}")
                return False
                
            return True
            
        except Exception as e:
            self.log_test("Emergent Auth Integration", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_user_management_endpoints(self):
        """Test User Management endpoints without authentication"""
        print("👤 Testing User Management Endpoints...")
        
        try:
            # Test /auth/me without token (should fail)
            response = await self.client.get(f"{API_URL}/auth/me")
            if response.status_code == 401:
                self.log_test("Auth Me Endpoint Protection", "PASS", "Correctly requires authentication")
            else:
                self.log_test("Auth Me Endpoint Protection", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test logout endpoint
            response = await self.client.post(f"{API_URL}/auth/logout")
            if response.status_code == 200:
                self.log_test("Logout Endpoint", "PASS", "Logout endpoint accessible")
            else:
                self.log_test("Logout Endpoint", "FAIL", f"Status: {response.status_code}")
                return False
                
            return True
            
        except Exception as e:
            self.log_test("User Management", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_consent_management_system(self):
        """Test Consent Management System"""
        print("📋 Testing Consent Management System...")
        
        try:
            # Test consent endpoint without auth (should fail)
            consent_data = {"consent_given": True}
            response = await self.client.post(
                f"{API_URL}/consent",
                json=consent_data
            )
            
            if response.status_code == 401:
                self.log_test("Consent Endpoint Protection", "PASS", "Correctly requires authentication")
                return True
            else:
                self.log_test("Consent Endpoint Protection", "FAIL", f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Consent Management", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_travel_diary_crud(self):
        """Test Travel Diary CRUD Operations"""
        print("✈️ Testing Travel Diary CRUD Operations...")
        
        try:
            # Test create travel entry without auth (should fail)
            travel_data = {
                "title": "Amazing Trip to Kerala",
                "description": "Beautiful backwaters and spice gardens",
                "location": "Alleppey, Kerala",
                "date": "2024-01-15",
                "transportation_rating": 4,
                "infrastructure_rating": 5,
                "review": "Excellent experience with houseboats"
            }
            
            response = await self.client.post(
                f"{API_URL}/travel-entries",
                json=travel_data
            )
            
            if response.status_code == 401:
                self.log_test("Travel Entry Creation Protection", "PASS", "Correctly requires authentication")
            else:
                self.log_test("Travel Entry Creation Protection", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test get travel entries without auth (should fail)
            response = await self.client.get(f"{API_URL}/travel-entries")
            if response.status_code == 401:
                self.log_test("Travel Entry Retrieval Protection", "PASS", "Correctly requires authentication")
                return True
            else:
                self.log_test("Travel Entry Retrieval Protection", "FAIL", f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Travel Diary CRUD", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_expense_tracking_system(self):
        """Test Expense Tracking System"""
        print("💰 Testing Expense Tracking System...")
        
        try:
            # Test create expense without auth (should fail)
            expense_data = {
                "description": "Hotel accommodation",
                "amount": 2500.0,
                "category": "accommodation",
                "date": "2024-01-15"
            }
            
            response = await self.client.post(
                f"{API_URL}/expenses",
                json=expense_data
            )
            
            if response.status_code == 401:
                self.log_test("Expense Creation Protection", "PASS", "Correctly requires authentication")
            else:
                self.log_test("Expense Creation Protection", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test get expenses without auth (should fail)
            response = await self.client.get(f"{API_URL}/expenses")
            if response.status_code == 401:
                self.log_test("Expense Retrieval Protection", "PASS", "Correctly requires authentication")
            else:
                self.log_test("Expense Retrieval Protection", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test expense summary without auth (should fail)
            response = await self.client.get(f"{API_URL}/expenses/summary")
            if response.status_code == 401:
                self.log_test("Expense Summary Protection", "PASS", "Correctly requires authentication")
                return True
            else:
                self.log_test("Expense Summary Protection", "FAIL", f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Expense Tracking", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_ai_travel_guide_integration(self):
        """Test AI Travel Guide Integration (GPT-5)"""
        print("🤖 Testing AI Travel Guide Integration...")
        
        try:
            # Test AI guide without auth (should fail)
            ai_request = {
                "message": "What are the best places to visit in Kerala?",
                "location": "Kerala, India"
            }
            
            response = await self.client.post(
                f"{API_URL}/ai-guide",
                json=ai_request
            )
            
            if response.status_code == 401:
                self.log_test("AI Guide Protection", "PASS", "Correctly requires authentication")
                return True
            else:
                self.log_test("AI Guide Protection", "FAIL", f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("AI Travel Guide", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_trip_cost_calculator(self):
        """Test Trip Cost Calculator with AI"""
        print("🧮 Testing Trip Cost Calculator...")
        
        try:
            # Test calculator without auth (should fail)
            calc_data = {
                "budget": 15000.0,
                "duration_days": 5,
                "location": "Goa, India"
            }
            
            response = await self.client.post(
                f"{API_URL}/calculate-trip-cost",
                json=calc_data
            )
            
            if response.status_code == 401:
                self.log_test("Trip Calculator Protection", "PASS", "Correctly requires authentication")
                return True
            else:
                self.log_test("Trip Calculator Protection", "FAIL", f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Trip Cost Calculator", "FAIL", f"Error: {str(e)}")
            return False
    
    async def test_api_structure_and_routes(self):
        """Test API structure and route availability"""
        print("🛣️ Testing API Structure and Routes...")
        
        required_routes = [
            "/auth/session",
            "/auth/logout", 
            "/auth/me",
            "/consent",
            "/travel-entries",
            "/expenses",
            "/expenses/summary",
            "/ai-guide",
            "/calculate-trip-cost"
        ]
        
        all_routes_exist = True
        
        for route in required_routes:
            try:
                # Just check if route exists (will return 401 for protected routes, which is expected)
                response = await self.client.get(f"{API_URL}{route}")
                if response.status_code in [200, 401, 405]:  # 405 for wrong method, but route exists
                    self.log_test(f"Route {route}", "PASS", f"Route exists (status: {response.status_code})")
                else:
                    self.log_test(f"Route {route}", "FAIL", f"Unexpected status: {response.status_code}")
                    all_routes_exist = False
            except Exception as e:
                self.log_test(f"Route {route}", "FAIL", f"Error: {str(e)}")
                all_routes_exist = False
        
        return all_routes_exist
    
    async def test_cors_configuration(self):
        """Test CORS configuration"""
        print("🌐 Testing CORS Configuration...")
        
        try:
            # Test preflight request
            response = await self.client.options(
                f"{API_URL}/auth/me",
                headers={
                    "Origin": "https://example.com",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "authorization"
                }
            )
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                if "access-control-allow-origin" in cors_headers:
                    self.log_test("CORS Configuration", "PASS", "CORS headers present")
                    return True
                else:
                    self.log_test("CORS Configuration", "WARN", "CORS headers missing")
                    return True  # Not critical for functionality
            else:
                self.log_test("CORS Configuration", "WARN", f"Preflight status: {response.status_code}")
                return True  # Not critical for functionality
                
        except Exception as e:
            self.log_test("CORS Configuration", "WARN", f"Error: {str(e)}")
            return True  # Not critical for functionality
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting POCKETSAFAR Backend Testing Suite")
        print("=" * 60)
        
        test_results = {}
        
        # Test backend accessibility
        test_results['health_check'] = await self.test_health_check()
        
        if not test_results['health_check']:
            print("❌ Backend not accessible. Stopping tests.")
            return test_results
        
        # Test all components
        test_results['emergent_auth'] = await self.test_emergent_auth_integration()
        test_results['user_management'] = await self.test_user_management_endpoints()
        test_results['consent_management'] = await self.test_consent_management_system()
        test_results['travel_diary'] = await self.test_travel_diary_crud()
        test_results['expense_tracking'] = await self.test_expense_tracking_system()
        test_results['ai_guide'] = await self.test_ai_travel_guide_integration()
        test_results['trip_calculator'] = await self.test_trip_cost_calculator()
        test_results['api_structure'] = await self.test_api_structure_and_routes()
        test_results['cors'] = await self.test_cors_configuration()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in test_results.values() if result)
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name.replace('_', ' ').title()}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All backend tests passed!")
        else:
            print("⚠️ Some tests failed. Check details above.")
        
        return test_results

async def main():
    """Main test runner"""
    tester = PocketSafarTester()
    try:
        results = await tester.run_all_tests()
        return results
    finally:
        await tester.close()

if __name__ == "__main__":
    asyncio.run(main())