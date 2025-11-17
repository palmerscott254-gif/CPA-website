"""
Simple download test - run Django server first:
python manage.py runserver
"""
import requests

BASE = "http://localhost:8000/api"

# Login
print("Logging in...")
r = requests.post(f"{BASE}/auth/login/", json={"email": "admin@example.com", "password": "admin123"})
token = r.json()['access']
print(f"✓ Token: {token[:30]}...")

# Get materials
print("\nGetting materials...")
r = requests.get(f"{BASE}/materials/")
materials = r.json() if isinstance(r.json(), list) else r.json().get('results', [])
if not materials:
    print("No materials found")
    exit()

mat = materials[0]
print(f"✓ Testing material {mat['id']}: {mat['title']}")

# Download
print(f"\nDownloading...")
r = requests.get(
    f"{BASE}/materials/{mat['id']}/download/",
    headers={"Authorization": f"Bearer {token}"}
)

print(f"Status: {r.status_code}")
print(f"Content-Type: {r.headers.get('Content-Type')}")

if r.status_code == 200:
    if 'json' in r.headers.get('Content-Type', ''):
        data = r.json()
        if 'download_url' in data:
            print(f"\n✓✓✓ SUCCESS - Got presigned URL")
            print(f"URL: {data['download_url'][:100]}...")
            
            # Test the URL
            r2 = requests.head(data['download_url'])
            print(f"\nPresigned URL test: {r2.status_code}")
            if r2.status_code == 200:
                print("✓✓✓ PRESIGNED URL WORKS!")
            else:
                print("✗ Presigned URL returns:", r2.status_code)
        else:
            print("✗ No download_url in response")
    else:
        print(f"✓✓✓ SUCCESS - Got file directly ({len(r.content)} bytes)")
else:
    print(f"✗ FAILED: {r.text}")
