"""
Application Configuration

Manages environment variables and application settings.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Credentials
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FCC_USERNAME = os.getenv("FCC_USERNAME")
FCC_API_TOKEN = os.getenv("FCC_API_TOKEN")
CENSUS_API_KEY = os.getenv("CENSUS_API_KEY")

# Application Settings
APP_NAME = "Access Target Lab"
APP_VERSION = "0.1.0"
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# Data Storage
DATA_DIR = Path(__file__).parent.parent / "data"
FCC_DATA_DIR = DATA_DIR / "fcc"
CENSUS_DATA_DIR = DATA_DIR / "census"
CACHE_DIR = DATA_DIR / "cache"

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
FCC_DATA_DIR.mkdir(exist_ok=True)
CENSUS_DATA_DIR.mkdir(exist_ok=True)
CACHE_DIR.mkdir(exist_ok=True)

# FCC API Settings
FCC_API_BASE_URL = "https://bdc.fcc.gov/api/public/map"
FCC_DEFAULT_AS_OF_DATE = "2024-06-30"

# Census API Settings
CENSUS_API_BASE_URL = "https://api.census.gov/data"
CENSUS_YEAR = "2020"
