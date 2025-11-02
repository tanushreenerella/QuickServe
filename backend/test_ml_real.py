# backend/test_ml_real.py
"""
COMPREHENSIVE TEST SCRIPT FOR ML SYSTEM
Tests all machine learning endpoints and functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print(f"{'='*60}")

def test_ml_status():
    """Test ML system status"""
    print_section("TESTING ML SYSTEM STATUS")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/status")
        data = response.json()
        
        print("✅ ML Status Endpoint Working")
        print(f"   System Status: {data['system_status']}")
        print(f"   Models Loaded: {data['models_loaded']}")
        print(f"   Training Data: {data['training_data']}")
        
        return True
    except Exception as e:
        print(f"❌ ML Status Test Failed: {e}")
        return False

def test_order_volume_prediction():
    """Test order volume prediction"""
    print_section("TESTING ORDER VOLUME PREDICTION")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/predict/volume")
        data = response.json()
        
        print("✅ Order Volume Prediction Working")
        print(f"   Predicted Volume: {data['predicted_order_volume']} orders/hour")
        print(f"   Time Period: {data['time_period']}")
        print(f"   Confidence: {data['confidence']}")
        
        return True
    except Exception as e:
        print(f"❌ Order Volume Test Failed: {e}")
        return False

def test_peak_hours_prediction():
    """Test peak hours prediction"""
    print_section("TESTING PEAK HOURS PREDICTION")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/predict/peak-hours?hours=12")
        data = response.json()
        
        print("✅ Peak Hours Prediction Working")
        print(f"   Predicted {len(data['predictions'])} hours")
        print(f"   Found {data['summary']['peak_hours_count']} peak hours")
        
        # Show peak hours
        peak_hours = [p for p in data['predictions'] if p['is_peak']]
        for hour in peak_hours[:3]:
            print(f"   🚀 {hour['hour']}: {hour['predicted_volume']} orders")
        
        return True
    except Exception as e:
        print(f"❌ Peak Hours Test Failed: {e}")
        return False

def test_wait_time_prediction():
    """Test wait time prediction"""
    print_section("TESTING WAIT TIME PREDICTION")
    
    try:
        test_order = {
            "items": ["Cheeseburger", "French Fries"],
            "current_queue_length": 5
        }
        
        response = requests.post(f"{BASE_URL}/ml/predict/wait-time", json=test_order)
        data = response.json()
        
        print("✅ Wait Time Prediction Working")
        print(f"   Predicted Wait: {data['predicted_wait_minutes']} minutes")
        print(f"   Preparation Time: {data['breakdown']['preparation_time']} minutes")
        print(f"   Queue Impact: {data['breakdown']['queue_impact']} minutes")
        print(f"   Recommendation: {data['recommendation']}")
        
        return True
    except Exception as e:
        print(f"❌ Wait Time Test Failed: {e}")
        return False

def test_popular_recommendations():
    """Test popular item recommendations"""
    print_section("TESTING POPULAR RECOMMENDATIONS")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/recommendations/popular?limit=4")
        data = response.json()
        
        print("✅ Popular Recommendations Working")
        print(f"   Found {data['total_recommendations']} recommendations")
        print(f"   Most Popular: {data['most_popular']['name']}")
        
        print("   📊 Top Recommendations:")
        for i, item in enumerate(data['recommendations'][:3], 1):
            print(f"      {i}. {item['name']} (Score: {item['popularity_score']:.1f})")
        
        return True
    except Exception as e:
        print(f"❌ Recommendations Test Failed: {e}")
        return False

def test_quick_meal_recommendations():
    """Test quick meal recommendations"""
    print_section("TESTING QUICK MEAL RECOMMENDATIONS")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/recommendations/quick-meals")
        data = response.json()
        
        print("✅ Quick Meal Recommendations Working")
        print(f"   Found {len(data['quick_meals'])} quick meals")
        print(f"   Average Prep Time: {data['average_prep_time']:.1f} minutes")
        
        for meal in data['quick_meals']:
            print(f"   ⚡ {meal['name']} ({meal['prep_time']} min)")
        
        return True
    except Exception as e:
        print(f"❌ Quick Meals Test Failed: {e}")
        return False

def test_ml_insights():
    """Test ML insights endpoint"""
    print_section("TESTING ML INSIGHTS")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/insights")
        data = response.json()
        
        print("✅ ML Insights Working")
        insights = data['business_intelligence']
        
        print("   📈 Data Analysis:")
        print(f"      • Total Orders: {insights['data_analysis']['total_orders_analyzed']:,}")
        print(f"      • Most Popular: {insights['data_analysis']['most_popular_item']}")
        print(f"      • Avg Prep Time: {insights['data_analysis']['average_preparation_time']} min")
        
        print("   🤖 Model Performance:")
        print(f"      • Order Volume MAE: {insights['model_performance']['order_volume_mae']}")
        print(f"      • Wait Time MAE: {insights['model_performance']['wait_time_mae']}")
        
        print("   💡 Business Insights:")
        for insight in insights['business_insights'].items():
            print(f"      • {insight[0]}: {insight[1]}")
        
        return True
    except Exception as e:
        print(f"❌ ML Insights Test Failed: {e}")
        return False

def test_demo_predictions():
    """Test demo predictions endpoint"""
    print_section("TESTING DEMO PREDICTIONS")
    
    try:
        response = requests.get(f"{BASE_URL}/ml/demo-predictions")
        data = response.json()
        
        print("✅ Demo Predictions Working")
        demo = data['demo_predictions']
        
        print("   🎯 Demo Results:")
        for key, value in demo.items():
            print(f"      • {key}: {value}")
        
        print("   🧠 ML Capabilities:")
        for capability in data['ml_capabilities']:
            print(f"      • {capability}")
        
        return True
    except Exception as e:
        print(f"❌ Demo Predictions Test Failed: {e}")
        return False

def run_comprehensive_test():
    """Run all ML tests"""
    print("🚀 STARTING COMPREHENSIVE ML SYSTEM TEST")
    print("=" * 60)
    
    tests = [
        test_ml_status,
        test_order_volume_prediction,
        test_peak_hours_prediction,
        test_wait_time_prediction,
        test_popular_recommendations,
        test_quick_meal_recommendations,
        test_ml_insights,
        test_demo_predictions
    ]
    
    results = []
    for test in tests:
        try:
            success = test()
            results.append((test.__name__, success))
            time.sleep(1)  # Brief pause between tests
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            results.append((test.__name__, False))
    
    # Print summary
    print_section("TEST SUMMARY")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    print(f"📊 Results: {passed}/{total} tests passed")
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {status} {test_name}")
    
    if passed == total:
        print("\n🎉 ALL ML TESTS PASSED! Your machine learning system is working perfectly!")
        print("   Next steps:")
        print("   1. Integrate ML predictions into your frontend")
        print("   2. Use wait time predictions in order flow")
        print("   3. Show popular recommendations to users")
        print("   4. Display peak hours for better planning")
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please check the errors above.")
    
    print("=" * 60)
    return passed == total

if __name__ == "__main__":
    success = run_comprehensive_test()
    exit(0 if success else 1)