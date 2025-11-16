"""
Quick Snowflake Connection Test

Tests authentication and database access.
"""

import sys
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import snowflake.connector

def test_connection():
    """Test Snowflake connection and permissions"""
    print("=" * 60)
    print("Snowflake Connection Test")
    print("=" * 60)

    # Show configuration (without password)
    print("\nConfiguration:")
    print(f"  Account: {os.getenv('SNOWFLAKE_ACCOUNT', 'NOT SET')}")
    print(f"  User: {os.getenv('SNOWFLAKE_USER', 'NOT SET')}")
    print(f"  Database: {os.getenv('SNOWFLAKE_DATABASE', 'CENSUS_DATA')}")
    print(f"  Schema: {os.getenv('SNOWFLAKE_SCHEMA', 'FLORIDA')}")
    print(f"  Warehouse: {os.getenv('SNOWFLAKE_WAREHOUSE', 'QUERY_WH')}")

    try:
        # Test 1: Establish basic connection (without database/schema)
        print("\n[1/5] Testing basic authentication...")
        conn = snowflake.connector.connect(
            account=os.getenv('SNOWFLAKE_ACCOUNT'),
            user=os.getenv('SNOWFLAKE_USER'),
            password=os.getenv('SNOWFLAKE_PASSWORD'),
            role=os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN'),
        )
        print("✓ Authentication successful")

        cursor = conn.cursor()

        # Test 2: Check account info
        print("\n[2/5] Checking account access...")
        cursor.execute("SELECT CURRENT_ACCOUNT(), CURRENT_USER(), CURRENT_ROLE()")
        row = cursor.fetchone()
        print(f"  Account: {row[0]}")
        print(f"  User: {row[1]}")
        print(f"  Role: {row[2]}")

        # Test 3: List databases
        print("\n[3/5] Listing available databases...")
        cursor.execute("SHOW DATABASES")
        databases = cursor.fetchall()
        print(f"  Found {len(databases)} databases:")
        for db in databases[:5]:  # Show first 5
            print(f"    - {db[1]}")  # Database name is in column 1
        if len(databases) > 5:
            print(f"    ... and {len(databases) - 5} more")

        # Test 4: Check if target database exists
        print("\n[4/5] Checking target database...")
        db_name = os.getenv('SNOWFLAKE_DATABASE', 'CENSUS_DATA')
        db_exists = any(db[1] == db_name for db in databases)
        if db_exists:
            print(f"  ✓ Database '{db_name}' exists")

            # Try to use it
            cursor.execute(f"USE DATABASE {db_name}")

            # Check schemas
            cursor.execute("SHOW SCHEMAS")
            schemas = cursor.fetchall()
            print(f"  Found {len(schemas)} schemas in {db_name}")

            schema_name = os.getenv('SNOWFLAKE_SCHEMA', 'FLORIDA')
            schema_exists = any(s[1] == schema_name for s in schemas)
            if schema_exists:
                print(f"  ✓ Schema '{schema_name}' exists")
                cursor.execute(f"USE SCHEMA {schema_name}")
            else:
                print(f"  ⚠ Schema '{schema_name}' does NOT exist")
                print(f"    Available schemas: {', '.join([s[1] for s in schemas[:5]])}")
        else:
            print(f"  ⚠ Database '{db_name}' does NOT exist")
            print(f"    You need to create it first")

        # Test 5: Check warehouse
        print("\n[5/5] Checking warehouse access...")
        wh_name = os.getenv('SNOWFLAKE_WAREHOUSE', 'QUERY_WH')
        cursor.execute("SHOW WAREHOUSES")
        warehouses = cursor.fetchall()
        wh_exists = any(wh[0] == wh_name for wh in warehouses)
        if wh_exists:
            print(f"  ✓ Warehouse '{wh_name}' exists and is accessible")
        else:
            print(f"  ⚠ Warehouse '{wh_name}' does NOT exist")
            print(f"    Available warehouses: {', '.join([wh[0] for wh in warehouses[:5]])}")

        cursor.close()
        conn.close()

        print("\n" + "=" * 60)
        if db_exists and schema_exists and wh_exists:
            print("✓ All checks passed! Ready to run migrations.")
        else:
            print("⚠ Setup incomplete. See recommendations below.")
            print("\nRecommendations:")
            if not db_exists:
                print(f"  1. Create database: CREATE DATABASE {db_name};")
            if db_exists and not schema_exists:
                print(f"  2. Create schema: CREATE SCHEMA {db_name}.{schema_name};")
            if not wh_exists:
                print(f"  3. Create warehouse: CREATE WAREHOUSE {wh_name};")
        print("=" * 60)

        return True

    except Exception as e:
        print(f"\n✗ Connection test failed: {e}")
        print("\nPlease check:")
        print("  1. Your .env file has correct Snowflake credentials")
        print("  2. Your Snowflake account is active")
        print("  3. You have the necessary permissions")
        return False


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
