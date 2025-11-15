# Access Target Lab - Tests

This directory contains unit and integration tests for the Access Target Lab backend.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

## Running Tests

### Run all tests:
```bash
pytest
```

### Run specific test file:
```bash
pytest tests/test_fcc_filter.py
```

### Run with verbose output:
```bash
pytest -v
```

### Run specific test class or function:
```bash
# Run specific test class
pytest tests/test_fcc_filter.py::TestFCCDataCollector

# Run specific test function
pytest tests/test_fcc_filter.py::TestFCCDataCollector::test_init_with_credentials
```

### Run with coverage report:
```bash
pytest --cov=app.backend.agents --cov-report=html
```

## Test Structure

- `test_fcc_filter.py` - Unit tests for FCC data collection
  - `TestFCCDataCollector` - Tests for FCCDataCollector class
  - `TestDownloadFCCHexagonData` - Tests for hexagon data download
  - `TestGetFCCDataForLocation` - Tests for location-based queries

## Writing New Tests

When adding new tests:
1. Create test files with `test_` prefix
2. Use descriptive test names: `test_<function>_<scenario>`
3. Mock external API calls to avoid hitting real endpoints
4. Clean up temporary files in tests

## Mocking

Tests use `unittest.mock` to mock:
- API requests (`requests.get`)
- File operations
- Environment variables
- External dependencies

This ensures tests run quickly and don't require API credentials.
