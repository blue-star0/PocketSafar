#!/usr/bin/env python3
        
        
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
