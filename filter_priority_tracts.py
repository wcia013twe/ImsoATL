"""
Filter tract coverage data to identify priority tracts.

Priority definition (defaults):
- coverage (25/3) below 100%
- population at least 500 residents

Usage:
    python filter_priority_tracts.py \
        --input florida_tract_coverage.csv \
        --output florida_tract_priority.csv \
        --coverage-col coverage \
        --population-col population \
        --max-coverage 100 \
        --min-population 500
"""

import argparse
import logging
from pathlib import Path

import pandas as pd

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def filter_priority_tracts(
    input_path: Path,
    output_path: Path,
    coverage_col: str = "coverage",
    population_col: str = "population",
    max_coverage: float = 100.0,
    min_population: int = 500,
) -> pd.DataFrame:
    """Filter the coverage CSV down to priority tracts."""
    logger.info(f"Loading coverage data from {input_path}")
    df = pd.read_csv(input_path)

    missing_cols = [
        col
        for col in (coverage_col, population_col)
        if col not in df.columns
    ]
    if missing_cols:
        raise ValueError(
            f"Missing required columns in {input_path}: {', '.join(missing_cols)}"
        )

    logger.info(
        "Filtering tracts with %s < %.2f and %s >= %d",
        coverage_col,
        max_coverage,
        population_col,
        min_population,
    )
    filtered = df[
        (df[coverage_col] < max_coverage) & (df[population_col] >= min_population)
    ].copy()

    logger.info("Found %d priority tracts", len(filtered))
    filtered.to_csv(output_path, index=False)
    logger.info(f"Saved filtered CSV to {output_path}")
    return filtered


def resolve_paths(
    input_arg: Path | None,
    output_arg: Path | None,
) -> tuple[Path, Path]:
    """
    Determine default input/output paths when CLI args are omitted.

    Returns:
        Tuple of (input_path, output_path)
    """
    if input_arg:
        input_path = Path(input_arg)
    else:
        candidates = sorted(Path(".").glob("*_tract_coverage.csv"))
        if not candidates:
            raise FileNotFoundError(
                "No input file provided and no *_tract_coverage.csv found."
            )
        input_path = candidates[0]
        logger.info(f"No --input provided. Using default: {input_path}")

    if output_arg:
        output_path = Path(output_arg)
    else:
        name = input_path.name
        if "_coverage" in name:
            output_name = name.replace("_coverage", "_priority")
        else:
            output_name = f"{input_path.stem}_priority.csv"
        output_path = input_path.with_name(output_name)
        logger.info(f"No --output provided. Saving to default: {output_path}")

    return input_path, output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Filter tract coverage CSV")
    parser.add_argument(
        "--input",
        type=Path,
        default=None,
        help="Input coverage CSV path",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output filtered CSV path",
    )
    parser.add_argument(
        "--coverage-col",
        default="coverage",
        help="Column name for coverage percentage",
    )
    parser.add_argument(
        "--population-col",
        default="population",
        help="Column name for population counts",
    )
    parser.add_argument(
        "--max-coverage",
        type=float,
        default=100.0,
        help="Maximum coverage percentage to retain (exclusive)",
    )
    parser.add_argument(
        "--min-population",
        type=int,
        default=500,
        help="Minimum population threshold to retain",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    input_path, output_path = resolve_paths(args.input, args.output)
    filter_priority_tracts(
        input_path=input_path,
        output_path=output_path,
        coverage_col=args.coverage_col,
        population_col=args.population_col,
        max_coverage=args.max_coverage,
        min_population=args.min_population,
    )


if __name__ == "__main__":
    main()
