"""
Snowflake Database Setup Script

Creates the CENSUS_DATA database and FLORIDA schema if they don't exist.
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

def setup_database():
    """Create database and schema"""
    print("=" * 60)
    print("Snowflake Database Setup")
    print("=" * 60)

    try:
        # Connect to Snowflake
        print("\n[1/3] Connecting to Snowflake...")
        conn = snowflake.connector.connect(
            account=os.getenv('SNOWFLAKE_ACCOUNT'),
            user=os.getenv('SNOWFLAKE_USER'),
            password=os.getenv('SNOWFLAKE_PASSWORD'),
            role=os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN'),
            warehouse=os.getenv('SNOWFLAKE_WAREHOUSE', 'QUERY_WH'),
        )
        print("✓ Connected")

        cursor = conn.cursor()

        # Create database
        print("\n[2/3] Creating database...")
        db_name = os.getenv('SNOWFLAKE_DATABASE', 'CENSUS_DATA')

        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        print(f"✓ Database '{db_name}' created (or already exists)")

        cursor.execute(f"USE DATABASE {db_name}")

        # Create schema
        print("\n[3/3] Creating schema...")
        schema_name = os.getenv('SNOWFLAKE_SCHEMA', 'FLORIDA')

        cursor.execute(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")
        print(f"✓ Schema '{schema_name}' created (or already exists)")

        cursor.execute(f"USE SCHEMA {schema_name}")

        # Verify
        print("\nVerifying setup...")
        cursor.execute("SELECT CURRENT_DATABASE(), CURRENT_SCHEMA()")
        row = cursor.fetchone()
        print(f"  Current database: {row[0]}")
        print(f"  Current schema: {row[1]}")

        cursor.close()
        conn.close()

        print("\n" + "=" * 60)
        print("✓ Database setup complete!")
        print("=" * 60)
        print("\nNext steps:")
        print("  1. Run: python scripts/migrate_census_blocks.py")
        print("  2. Run: python scripts/migrate_block_population.py")

        return True

    except Exception as e:
        print(f"\n✗ Setup failed: {e}")
        return False


if __name__ == "__main__":
    success = setup_database()
    sys.exit(0 if success else 1)
