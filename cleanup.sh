#!/bin/bash
# Cleanup script for ImsoATL project
# Removes unnecessary files and organizes data

echo "🧹 Cleaning up ImsoATL project..."

# Remove Python cache files
echo "Removing Python cache files..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
find . -type f -name "*.pyo" -delete 2>/dev/null

# Create data directory structure if needed
mkdir -p data/raw
mkdir -p data/processed

# Move large GPKG files to data/raw (keep CSV for pipeline)
echo "Moving large GPKG files to data/raw..."
if [ -f "florida_tract_coverage.gpkg" ]; then
    mv florida_tract_coverage.gpkg data/raw/
    echo "  ✓ Moved florida_tract_coverage.gpkg"
fi

if [ -f "georgia_tract_coverage.gpkg" ]; then
    mv georgia_tract_coverage.gpkg data/raw/
    echo "  ✓ Moved georgia_tract_coverage.gpkg"
fi

# Move georgia CSV (not needed for demo)
if [ -f "georgia_tract_coverage.csv" ]; then
    mv georgia_tract_coverage.csv data/raw/
    echo "  ✓ Moved georgia_tract_coverage.csv (not needed for Florida demo)"
fi

# Move raw data processing script
if [ -f "calculate_coverage_from_csv.py" ]; then
    mv calculate_coverage_from_csv.py app/backend/data_pipeline/
    echo "  ✓ Moved calculate_coverage_from_csv.py to backend pipeline"
fi

# Clean up node_modules bloat (optional - uncomment if needed)
# echo "Cleaning Next.js cache..."
# cd app/frontend && rm -rf .next && cd ../..

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "📊 Project structure:"
echo "  ├── florida_tract_coverage.csv (kept for pipeline)"
echo "  ├── data/"
echo "  │   ├── raw/ (large GPKG files)"
echo "  │   └── processed/ (JSON outputs)"
echo "  └── app/"
echo "      ├── frontend/public/data/ (served to users)"
echo "      └── backend/data_pipeline/ (processing scripts)"
