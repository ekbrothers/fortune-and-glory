import ee
import os
import json

def test_ee_connection():
    """Test Google Earth Engine connection and basic functionality"""
    try:
        print("Starting Earth Engine connection test...")
        
        # Get the absolute path to the key file
        current_dir = os.getcwd()
        key_path = os.path.join(current_dir, 'key', 'gee-key.json')
        print(f"Looking for key file at: {key_path}")
        
        if not os.path.exists(key_path):
            print(f"Error: Key file not found at {key_path}")
            return False
        
        # Read and print the structure of the key file (safely)
        with open(key_path, 'r') as f:
            key_content = f.read()
            print("\nKey file content type:", type(key_content))
            print("Key file first few chars:", key_content[:50])
            key_json = json.loads(key_content)
            print("\nKey JSON structure keys:", list(key_json.keys()) if isinstance(key_json, dict) else "Not a dictionary")
            
        # Initialize Earth Engine with service account
        service_account = 'gee-archaeological-detection@ee-ekbrothers.iam.gserviceaccount.com'
        credentials = ee.ServiceAccountCredentials(service_account, key_path)
        ee.Initialize(credentials)
        
        # Try to access some data
        print("\nTesting data access...")
        image = ee.Image('USGS/SRTMGL1_003')
        info = image.getInfo()
        
        print("✓ Successfully connected to Earth Engine!")
        print("✓ Successfully accessed SRTM elevation data!")
        print("\nConnection test passed!")
        
        return True
        
    except Exception as e:
        print(f"\nError: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print("\nFull traceback:")
        print(traceback.format_exc())
        return False

if __name__ == "__main__":
    test_ee_connection()