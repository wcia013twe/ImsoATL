"""
Validate coverage calculation for a specific census tract

This script manually calculates coverage for one tract and compares
with the automated script output.
"""

import pandas as pd

# Load the raw FCC data
print("Loading FCC Cable data...")
fcc_df = pd.read_csv('data/bdc_13_Cable_fixed_broadband_D24_11nov2025.csv')

# Pick a test tract - let's use the first one we saw
test_tract = '13091960100'

print(f"\n{'='*70}")
print(f"Manual Validation for Census Tract: {test_tract}")
print(f"{'='*70}")

# Convert block_geoid to string format
fcc_df['block_geoid'] = fcc_df['block_geoid'].apply(
    lambda x: format(int(x), '015d') if pd.notna(x) else None
)

# Extract tract GEOID from block GEOID (first 11 digits)
fcc_df['tract_geoid'] = fcc_df['block_geoid'].str[:11]

# Filter to just this tract
tract_data = fcc_df[fcc_df['tract_geoid'] == test_tract].copy()

print(f"\nRaw data for this tract:")
print(f"  Total rows (provider-block combinations): {len(tract_data)}")
print(f"  Unique blocks: {tract_data['block_geoid'].nunique()}")
print(f"  Unique providers: {tract_data['provider_id'].nunique()}")

# Check which blocks have 25/3 Mbps service
tract_data['has_broadband'] = (
    (tract_data['max_advertised_download_speed'] >= 25) &
    (tract_data['max_advertised_upload_speed'] >= 3)
)

blocks_with_broadband = tract_data[tract_data['has_broadband']]['block_geoid'].nunique()
total_blocks = tract_data['block_geoid'].nunique()

print(f"\nBroadband availability (25/3 Mbps):")
print(f"  Blocks with 25/3 Mbps: {blocks_with_broadband}")
print(f"  Total blocks in data: {total_blocks}")

# Calculate coverage percentage
coverage_pct = (blocks_with_broadband / total_blocks * 100) if total_blocks > 0 else 0

print(f"\nManual calculation:")
print(f"  Coverage = {blocks_with_broadband}/{total_blocks} × 100 = {coverage_pct:.2f}%")

# Compare with script output
output_df = pd.read_csv('georgia_tract_coverage.csv')
script_coverage = output_df[output_df['GEOID'] == test_tract]['coverage'].values

if len(script_coverage) > 0:
    print(f"\nScript output:")
    print(f"  Coverage = {script_coverage[0]:.2f}%")

    print(f"\nValidation:")
    if abs(coverage_pct - script_coverage[0]) < 0.01:
        print(f"  ✓ MATCH! Manual and script calculations agree.")
    else:
        print(f"  ✗ MISMATCH! Difference: {abs(coverage_pct - script_coverage[0]):.2f}%")
else:
    print(f"\n✗ Tract {test_tract} not found in script output!")

# Show sample blocks
print(f"\nSample blocks in this tract:")
sample_blocks = tract_data.groupby('block_geoid').agg({
    'provider_id': 'count',
    'max_advertised_download_speed': 'max',
    'max_advertised_upload_speed': 'max'
}).head(5)
sample_blocks.columns = ['Providers', 'Max Down (Mbps)', 'Max Up (Mbps)']
print(sample_blocks.to_string())

print(f"\n{'='*70}")
