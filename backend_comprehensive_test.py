#!/usr/bin/env python3
        
except Exception as e:
            self.log_test("Gamification System Test", "FAIL", f"Error: {str(e)}")
            return False
    
    async def run_comprehensive_tests(self):
        """Run all comprehensive tests"""
        print("🚀 Starting POCKETSAFAR Comprehensive Backend Testing")
        print("=" * 70)
        
        test_results = {}
        
        # Run comprehensive tests
        test_results['ai_guide_mock'] = await self.test_ai_guide_with_mock_auth()
        test_results['trip_calculator_mock'] = await self.test_trip_calculator_with_mock_auth()
        test_results['data_validation'] = await self.test_data_validation()
        test_results['emergent_llm_config'] = await self.test_emergent_llm_configuration()
        test_results['mongodb_connection'] = await self.test_mongodb_connection()
        test_results['gamification_structure'] = await self.test_gamification_system_structure()
        
        # Summary
        print("=" * 70)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 70)
        
        passed = sum(1 for result in test_results.values() if result)
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name.replace('_', ' ').title()}")
        
        print(f"\nOverall: {passed}/{total} comprehensive tests passed")
        
        if passed == total:
            print("🎉 All comprehensive backend tests passed!")
        else:
            print("⚠️ Some comprehensive tests failed. Check details above.")
        
        return test_results
async def main():
    """Main test runner"""
    tester = ComprehensiveTester()
    try:
        results = await tester.run_comprehensive_tests()
        return results
    finally:
        await tester.close()
if __name__ == "__main__":
    asyncio.run(main())
