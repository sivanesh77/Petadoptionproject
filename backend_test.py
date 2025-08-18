import requests
import sys
import json
import base64
from datetime import datetime
import io

class PetAdoptionAPITester:
    def __init__(self, base_url="https://paws-and-homes.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.user_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_pet_id = None
        self.created_order_id = None
        self.test_user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart/form-data
                    test_headers.pop('Content-Type', None)
                    response = requests.post(url, data=data, files=files, headers=test_headers)
                else:
                    response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": "admin@petadoption.com", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_user_registration(self):
        """Test user registration"""
        test_user_email = f"testuser_{datetime.now().strftime('%H%M%S')}@test.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data={
                "email": test_user_email,
                "password": "testpass123",
                "name": "Test User",
                "address": "123 Test Street",
                "phone": "+1234567890"
            }
        )
        if success:
            self.test_user_email = test_user_email
            self.test_user_id = response.get('id')
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        if not hasattr(self, 'test_user_email'):
            print("❌ Cannot test user login - no registered user")
            return False
            
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": self.test_user_email, "password": "testpass123"}
        )
        if success and 'access_token' in response:
            self.user_token = response['access_token']
            print(f"   User token obtained: {self.user_token[:20]}...")
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        if not self.user_token:
            print("❌ Cannot test profile - no user token")
            return False
            
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "api/user/profile",
            200,
            headers={'Authorization': f'Bearer {self.user_token}'}
        )
        return success

    def test_get_pets_unauthorized(self):
        """Test getting pets without authentication"""
        success, response = self.run_test(
            "Get Pets (No Auth)",
            "GET",
            "api/pets",
            200
        )
        return success

    def test_add_pet_admin(self):
        """Test adding a pet as admin"""
        if not self.admin_token:
            print("❌ Cannot test add pet - no admin token")
            return False

        # Create a simple test image (1x1 pixel PNG)
        test_image_data = base64.b64decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        )
        
        pet_data = {
            'name': 'Test Pet Buddy',
            'category': 'Dog',
            'weight': '15.5',
            'height': '45.0',
            'breed': 'Golden Retriever',
            'gender': 'male',
            'description': 'A friendly test pet for adoption testing'
        }
        
        files = {
            'image': ('test_pet.png', io.BytesIO(test_image_data), 'image/png')
        }
        
        success, response = self.run_test(
            "Add Pet (Admin)",
            "POST",
            "api/pets",
            200,
            data=pet_data,
            files=files,
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        
        if success:
            self.created_pet_id = response.get('id')
            print(f"   Created pet ID: {self.created_pet_id}")
            return True
        return False

    def test_get_pet_image(self):
        """Test getting pet image"""
        if not self.created_pet_id:
            print("❌ Cannot test pet image - no pet created")
            return False
            
        url = f"{self.base_url}/api/pets/{self.created_pet_id}/image"
        print(f"\n🔍 Testing Get Pet Image...")
        print(f"   URL: {url}")
        
        try:
            response = requests.get(url)
            self.tests_run += 1
            
            if response.status_code == 200 and response.headers.get('content-type', '').startswith('image/'):
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                print(f"   Image size: {len(response.content)} bytes")
                return True
            else:
                print(f"❌ Failed - Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                return False
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

    def test_get_all_pets_admin(self):
        """Test getting all pets as admin"""
        if not self.admin_token:
            print("❌ Cannot test admin pets - no admin token")
            return False
            
        success, response = self.run_test(
            "Get All Pets (Admin)",
            "GET",
            "api/admin/pets",
            200,
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        return success

    def test_create_order_user(self):
        """Test creating an adoption order as user"""
        if not self.user_token or not self.created_pet_id:
            print("❌ Cannot test order creation - missing user token or pet")
            return False
            
        order_data = {
            "pet_id": self.created_pet_id,
            "shipping_name": "Test User",
            "shipping_address": "123 Test Street, Test City",
            "shipping_phone": "+1234567890"
        }
        
        success, response = self.run_test(
            "Create Order (User)",
            "POST",
            "api/orders",
            200,
            data=order_data,
            headers={'Authorization': f'Bearer {self.user_token}'}
        )
        
        if success:
            self.created_order_id = response.get('id')
            print(f"   Created order ID: {self.created_order_id}")
            return True
        return False

    def test_get_orders_user(self):
        """Test getting orders as user"""
        if not self.user_token:
            print("❌ Cannot test user orders - no user token")
            return False
            
        success, response = self.run_test(
            "Get Orders (User)",
            "GET",
            "api/orders",
            200,
            headers={'Authorization': f'Bearer {self.user_token}'}
        )
        return success

    def test_get_orders_admin(self):
        """Test getting all orders as admin"""
        if not self.admin_token:
            print("❌ Cannot test admin orders - no admin token")
            return False
            
        success, response = self.run_test(
            "Get All Orders (Admin)",
            "GET",
            "api/orders",
            200,
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        return success

    def test_approve_order_admin(self):
        """Test approving an order as admin"""
        if not self.admin_token or not self.created_order_id:
            print("❌ Cannot test order approval - missing admin token or order")
            return False
            
        success, response = self.run_test(
            "Approve Order (Admin)",
            "PUT",
            f"api/orders/{self.created_order_id}/status",
            200,
            data={"status": "approved"},
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        return success

    def test_reject_order_admin(self):
        """Test rejecting an order as admin (should make pet available again)"""
        if not self.admin_token or not self.created_order_id:
            print("❌ Cannot test order rejection - missing admin token or order")
            return False
            
        success, response = self.run_test(
            "Reject Order (Admin)",
            "PUT",
            f"api/orders/{self.created_order_id}/status",
            200,
            data={"status": "rejected"},
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access to admin endpoints"""
        print(f"\n🔍 Testing Unauthorized Access...")
        
        # Test admin endpoints without token
        endpoints_to_test = [
            ("api/admin/pets", "GET"),
            ("api/pets", "POST"),
        ]
        
        unauthorized_tests = 0
        unauthorized_passed = 0
        
        for endpoint, method in endpoints_to_test:
            url = f"{self.base_url}/{endpoint}"
            try:
                if method == "GET":
                    response = requests.get(url)
                elif method == "POST":
                    response = requests.post(url, json={})
                
                unauthorized_tests += 1
                if response.status_code in [401, 403]:
                    unauthorized_passed += 1
                    print(f"✅ {endpoint} properly protected - Status: {response.status_code}")
                else:
                    print(f"❌ {endpoint} not properly protected - Status: {response.status_code}")
            except Exception as e:
                print(f"❌ Error testing {endpoint}: {str(e)}")
        
        self.tests_run += unauthorized_tests
        self.tests_passed += unauthorized_passed
        
        return unauthorized_passed == unauthorized_tests

def main():
    print("🚀 Starting Pet Adoption Platform API Tests")
    print("=" * 60)
    
    tester = PetAdoptionAPITester()
    
    # Test sequence
    test_sequence = [
        ("Admin Login", tester.test_admin_login),
        ("User Registration", tester.test_user_registration),
        ("User Login", tester.test_user_login),
        ("Get User Profile", tester.test_get_user_profile),
        ("Get Pets (No Auth)", tester.test_get_pets_unauthorized),
        ("Add Pet (Admin)", tester.test_add_pet_admin),
        ("Get Pet Image", tester.test_get_pet_image),
        ("Get All Pets (Admin)", tester.test_get_all_pets_admin),
        ("Create Order (User)", tester.test_create_order_user),
        ("Get Orders (User)", tester.test_get_orders_user),
        ("Get Orders (Admin)", tester.test_get_orders_admin),
        ("Approve Order (Admin)", tester.test_approve_order_admin),
        ("Reject Order (Admin)", tester.test_reject_order_admin),
        ("Unauthorized Access", tester.test_unauthorized_access),
    ]
    
    failed_tests = []
    
    for test_name, test_func in test_sequence:
        try:
            success = test_func()
            if not success:
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} crashed: {str(e)}")
            failed_tests.append(test_name)
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Total Tests: {tester.tests_run}")
    print(f"Passed: {tester.tests_passed}")
    print(f"Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n🎉 All tests passed!")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())