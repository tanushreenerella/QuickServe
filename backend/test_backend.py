import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend():
    print("🧪 Testing Backend API...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root endpoint: {response.status_code} - {response.json()}")
        
        # Test health check
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        
        # Test menu endpoint
        response = requests.get(f"{BASE_URL}/menu")
        print(f"✅ Menu endpoint: {response.status_code} - Found {len(response.json())} items")
        
        # Test analytics
        response = requests.get(f"{BASE_URL}/analytics/dashboard")
        print(f"✅ Analytics: {response.status_code} - Data received")
        
        print("🎉 All backend tests passed! Your API is working correctly.")
        
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        print("Make sure the server is running: uvicorn app.main:app --reload")

if __name__ == "__main__":
    test_backend()