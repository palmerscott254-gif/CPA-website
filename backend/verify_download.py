#!/usr/bin/env python
"""
Quick verification script for the download feature.
Tests both local and production endpoints.
"""
import requests
import sys
import json

# Configuration
LOCAL_API = "http://localhost:8000/api"
PROD_API = "https://cpa-website-lvup.onrender.com/api"

# Colors for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'


def test_endpoint(base_url, material_id=1, auth_token=None):
    """Test a download endpoint"""
    print(f"\n{YELLOW}Testing: {base_url}{RESET}")
    print("=" * 60)
    
    # Test 1: Download endpoint without auth
    print(f"\n1. Testing public download (no auth)...")
    try:
        url = f"{base_url}/materials/{material_id}/download/"
        headers = {"Accept": "application/json"}
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print(f"{GREEN}✓ Success: {response.status_code}{RESET}")
            
            # Check if JSON response
            if 'application/json' in response.headers.get('Content-Type', ''):
                data = response.json()
                print(f"  Response type: JSON")
                print(f"  Has download_url: {'download_url' in data}")
                print(f"  Has filename: {'filename' in data}")
                if 'download_url' in data:
                    print(f"  Download URL: {data['download_url'][:80]}...")
                if 'filename' in data:
                    print(f"  Filename: {data['filename']}")
            else:
                print(f"  Response type: Binary ({response.headers.get('Content-Type')})")
                print(f"  Content-Disposition: {response.headers.get('Content-Disposition')}")
        else:
            print(f"{RED}✗ Failed: {response.status_code}{RESET}")
            print(f"  Error: {response.text[:200]}")
    except Exception as e:
        print(f"{RED}✗ Error: {str(e)}{RESET}")
    
    # Test 2: With authentication (if token provided)
    if auth_token:
        print(f"\n2. Testing with authentication...")
        try:
            url = f"{base_url}/materials/{material_id}/download/"
            headers = {
                "Accept": "application/json",
                "Authorization": f"Bearer {auth_token}"
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                print(f"{GREEN}✓ Success: {response.status_code}{RESET}")
            else:
                print(f"{RED}✗ Failed: {response.status_code}{RESET}")
                print(f"  Error: {response.text[:200]}")
        except Exception as e:
            print(f"{RED}✗ Error: {str(e)}{RESET}")
    
    # Test 3: CORS preflight
    print(f"\n3. Testing CORS preflight...")
    try:
        url = f"{base_url}/materials/{material_id}/download/"
        headers = {
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization"
        }
        
        response = requests.options(url, headers=headers, timeout=10)
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
            'Access-Control-Expose-Headers': response.headers.get('Access-Control-Expose-Headers'),
        }
        
        print(f"  Status: {response.status_code}")
        for header, value in cors_headers.items():
            if value:
                print(f"  {header}: {value}")
            else:
                print(f"  {RED}{header}: Missing{RESET}")
    except Exception as e:
        print(f"{RED}✗ Error: {str(e)}{RESET}")
    
    # Test 4: Non-existent material
    print(f"\n4. Testing non-existent material (should 404)...")
    try:
        url = f"{base_url}/materials/99999/download/"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 404:
            print(f"{GREEN}✓ Correctly returns 404{RESET}")
        else:
            print(f"{YELLOW}⚠ Unexpected: {response.status_code}{RESET}")
    except Exception as e:
        print(f"{RED}✗ Error: {str(e)}{RESET}")


def main():
    """Main test runner"""
    print(f"\n{YELLOW}╔══════════════════════════════════════════════════════════╗{RESET}")
    print(f"{YELLOW}║       Download Feature Verification Script              ║{RESET}")
    print(f"{YELLOW}╚══════════════════════════════════════════════════════════╝{RESET}")
    
    # Get parameters
    material_id = input("\nEnter material ID to test (default: 1): ").strip() or "1"
    auth_token = input("Enter auth token (optional, press Enter to skip): ").strip() or None
    
    # Test local
    test_local = input("\nTest local server? (y/n, default: y): ").strip().lower()
    if test_local != 'n':
        test_endpoint(LOCAL_API, material_id, auth_token)
    
    # Test production
    test_prod = input("\nTest production server? (y/n, default: y): ").strip().lower()
    if test_prod != 'n':
        test_endpoint(PROD_API, material_id, auth_token)
    
    print(f"\n{GREEN}Testing complete!{RESET}\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Testing cancelled by user{RESET}")
        sys.exit(0)
