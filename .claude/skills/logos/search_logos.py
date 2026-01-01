#!/usr/bin/env python3
"""
Search the app-icons-and-colors.csv file efficiently without loading the entire file.

Usage:
    python search_logos.py <search_term> [--limit N] [--case-sensitive]

Search patterns:
    "appname"    - Exact match (case-insensitive by default)
    "*appname"   - Wildcard: matches apps ending with appname
    "appname*"   - Wildcard: matches apps starting with appname
    "*appname*"  - Wildcard: matches apps containing appname
    "app*name"   - Wildcard: matches apps with pattern (e.g., "Google Drive")

Examples:
    python search_logos.py "google"        # Exact match for "google"
    python search_logos.py "*mail"         # Apps ending with "mail"
    python search_logos.py "slack*"        # Apps starting with "slack"
    python search_logos.py "*drive*"       # Apps containing "drive"
    python search_logos.py "Google*Drive"  # Apps matching pattern
    python search_logos.py "Gmail" --case-sensitive
"""

import csv
import argparse
import sys
import json
import re
from pathlib import Path


def create_pattern(search_term, case_sensitive=False):
    """
    Convert search term with wildcards to regex pattern.

    Args:
        search_term: Search term with optional * wildcards
        case_sensitive: Whether to make pattern case-sensitive

    Returns:
        Compiled regex pattern
    """
    # Escape special regex characters except *
    escaped = re.escape(search_term)
    # Replace escaped \* with .* for wildcard matching
    pattern_str = escaped.replace(r'\*', '.*')

    # If no wildcards, make it an exact match
    if '*' not in search_term:
        pattern_str = f'^{pattern_str}$'
    else:
        # Add anchors based on wildcard position
        if not search_term.startswith('*'):
            pattern_str = f'^{pattern_str}'
        if not search_term.endswith('*'):
            pattern_str = f'{pattern_str}$'

    flags = 0 if case_sensitive else re.IGNORECASE
    return re.compile(pattern_str, flags)


def search_csv(file_path, search_term, limit=None, case_sensitive=False):
    """
    Search CSV file for matches in the App column.

    Args:
        file_path: Path to CSV file
        search_term: String to search for (supports * wildcards)
        limit: Maximum number of results to return (None for all)
        case_sensitive: Whether search should be case-sensitive

    Returns:
        List of matching rows
    """
    results = []
    pattern = create_pattern(search_term, case_sensitive)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row in reader:
                # Search only in the App column
                app_name = row.get('App', '')
                if pattern.match(app_name):
                    results.append(row)
                    if limit and len(results) >= limit:
                        break

        return results

    except FileNotFoundError:
        print(f"Error: File not found: {file_path}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}", file=sys.stderr)
        sys.exit(1)


def format_output(results, headers=None):
    """Format results as JSON."""
    output = {
        "count": len(results),
        "results": results
    }
    print(json.dumps(output, indent=2))


def main():
    parser = argparse.ArgumentParser(
        description='Search app-icons-and-colors.csv efficiently'
    )
    parser.add_argument(
        'search_term',
        help='Term to search for in App column (supports * wildcards)'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Maximum number of results to return'
    )
    parser.add_argument(
        '--case-sensitive',
        action='store_true',
        help='Make search case-sensitive'
    )
    parser.add_argument(
        '--file',
        default='app-icons-and-colors.csv',
        help='Path to CSV file (default: app-icons-and-colors.csv)'
    )

    args = parser.parse_args()

    # Resolve file path: default relative to script, custom relative to cwd
    file_path = Path(args.file)
    if not file_path.is_absolute():
        if args.file == 'app-icons-and-colors.csv':
            # Default file: look in script directory
            script_dir = Path(__file__).parent
            file_path = script_dir / file_path
        else:
            # Custom file: resolve relative to current working directory
            file_path = Path.cwd() / file_path

    # Search and display results
    results = search_csv(
        file_path,
        args.search_term,
        limit=args.limit,
        case_sensitive=args.case_sensitive
    )

    format_output(results)


if __name__ == '__main__':
    main()
