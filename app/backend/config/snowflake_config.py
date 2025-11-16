"""
Snowflake Configuration Module

Manages Snowflake connection credentials and connection pooling.
"""

import os
import logging
from typing import Optional
import snowflake.connector
from snowflake.connector import SnowflakeConnection
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


class SnowflakeConfig:
    """Snowflake connection configuration"""

    def __init__(self):
        """Initialize configuration from environment variables"""
        self.account = os.getenv("SNOWFLAKE_ACCOUNT")
        self.user = os.getenv("SNOWFLAKE_USER")
        self.password = os.getenv("SNOWFLAKE_PASSWORD")
        self.warehouse = os.getenv("SNOWFLAKE_WAREHOUSE", "QUERY_WH")
        self.database = os.getenv("SNOWFLAKE_DATABASE", "CENSUS_DATA")
        self.schema = os.getenv("SNOWFLAKE_SCHEMA", "FLORIDA")
        self.role = os.getenv("SNOWFLAKE_ROLE", "ACCOUNTADMIN")

        # Validate required fields
        self._validate()

    def _validate(self):
        """Validate that all required configuration is present"""
        required_fields = {
            "account": self.account,
            "user": self.user,
            "password": self.password,
        }

        missing_fields = [
            field for field, value in required_fields.items() if not value
        ]

        if missing_fields:
            raise ValueError(
                f"Missing required Snowflake configuration: {', '.join(missing_fields)}. "
                f"Please set these environment variables: {', '.join(f'SNOWFLAKE_{f.upper()}' for f in missing_fields)}"
            )

    def get_connection_params(self) -> dict:
        """
        Get connection parameters for Snowflake

        Returns:
            Dictionary of connection parameters
        """
        return {
            "account": self.account,
            "user": self.user,
            "password": self.password,
            "warehouse": self.warehouse,
            "database": self.database,
            "schema": self.schema,
            "role": self.role,
        }


# Global configuration instance
_config: Optional[SnowflakeConfig] = None


def get_config() -> SnowflakeConfig:
    """
    Get or create the global Snowflake configuration

    Returns:
        SnowflakeConfig instance
    """
    global _config

    if _config is None:
        _config = SnowflakeConfig()

    return _config


def get_connection() -> SnowflakeConnection:
    """
    Create a new Snowflake connection

    Returns:
        Active Snowflake connection

    Raises:
        Exception if connection fails
    """
    config = get_config()
    params = config.get_connection_params()

    try:
        logger.info(
            f"Connecting to Snowflake: {params['account']} "
            f"(database={params['database']}, schema={params['schema']}, warehouse={params['warehouse']})"
        )

        conn = snowflake.connector.connect(**params)

        # Explicitly set database and schema context
        cursor = conn.cursor()
        cursor.execute(f"USE DATABASE {params['database']}")
        cursor.execute(f"USE SCHEMA {params['schema']}")
        cursor.close()

        logger.info("✓ Snowflake connection established")
        return conn

    except Exception as e:
        logger.error(f"Failed to connect to Snowflake: {e}")
        raise


def execute_query(query: str, params: Optional[dict] = None) -> list:
    """
    Execute a query and return all results

    Args:
        query: SQL query to execute
        params: Optional query parameters for binding

    Returns:
        List of result rows (as dictionaries)
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(snowflake.connector.DictCursor)

        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)

        results = cursor.fetchall()
        cursor.close()

        return results

    finally:
        if conn:
            conn.close()


def execute_many(query: str, data: list) -> int:
    """
    Execute a query with multiple parameter sets (batch insert)

    Args:
        query: SQL query with parameter placeholders
        data: List of parameter tuples

    Returns:
        Number of rows affected
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.executemany(query, data)
        rowcount = cursor.rowcount

        conn.commit()
        cursor.close()

        logger.info(f"✓ Batch insert completed: {rowcount} rows affected")
        return rowcount

    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Batch insert failed: {e}")
        raise

    finally:
        if conn:
            conn.close()
