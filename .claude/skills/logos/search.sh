#!/usr/bin/env bash
#
# Search the app-icons-and-colors.csv file and return logo URL or color.
#
# Usage:
#     ./search_logos.sh <search_term> [--color] [--case-sensitive] [--file PATH]
#
# Options:
#     --color          Return hex color instead of image URL (default: image URL)
#     --case-sensitive Case-sensitive search (default: case-insensitive)
#     --file PATH      Custom CSV file path
#
# Search patterns:
#     "appname"    - Exact match (case-insensitive by default)
#     "*appname"   - Wildcard: matches apps ending with appname
#     "appname*"   - Wildcard: matches apps starting with appname
#     "*appname*"  - Wildcard: matches apps containing appname
#     "app*name"   - Wildcard: matches apps with pattern
#
# Examples:
#     ./search_logos.sh "Slack"           # Returns image URL for Slack
#     ./search_logos.sh "Slack" --color   # Returns hex color for Slack
#     ./search_logos.sh "*mail"           # First app ending with "mail"
#     ./search_logos.sh "Gmail" --case-sensitive

set -euo pipefail

# Default values
RETURN_COLOR=false
CASE_SENSITIVE=false
CSV_FILE=""
SEARCH_TERM=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --color)
            RETURN_COLOR=true
            shift
            ;;
        --case-sensitive)
            CASE_SENSITIVE=true
            shift
            ;;
        --file)
            CSV_FILE="$2"
            shift 2
            ;;
        --help|-h)
            head -n 24 "$0" | tail -n +2 | sed 's/^# \?//'
            exit 0
            ;;
        -*)
            echo "Error: Unknown option $1" >&2
            exit 1
            ;;
        *)
            if [[ -z "$SEARCH_TERM" ]]; then
                SEARCH_TERM="$1"
            else
                echo "Error: Multiple search terms provided" >&2
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate search term
if [[ -z "$SEARCH_TERM" ]]; then
    echo "Error: Search term required" >&2
    echo "Usage: $0 <search_term> [--limit N] [--case-sensitive] [--file PATH]" >&2
    exit 1
fi

# Determine CSV file path
if [[ -z "$CSV_FILE" ]]; then
    # Default: look in script directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    CSV_FILE="$SCRIPT_DIR/app-icons-and-colors.csv"
elif [[ ! "$CSV_FILE" = /* ]]; then
    # Relative path: resolve to absolute
    CSV_FILE="$(pwd)/$CSV_FILE"
fi

# Check if file exists
if [[ ! -f "$CSV_FILE" ]]; then
    echo "Error: File not found: $CSV_FILE" >&2
    exit 1
fi

# Convert wildcard pattern to grep regex
convert_pattern() {
    local pattern="$1"
    local result=""

    # Check if pattern has wildcards
    if [[ "$pattern" != *"*"* ]]; then
        # No wildcards: exact match
        # Escape special regex characters
        result=$(echo "$pattern" | sed 's/[.[\^$]/\\&/g')
        echo "^${result}$"
        return
    fi

    # Has wildcards: convert to regex
    # Start with anchor if pattern doesn't start with *
    if [[ ! "$pattern" =~ ^\* ]]; then
        result="^"
    fi

    # Process the pattern character by character
    local escaped=""
    escaped=$(echo "$pattern" | sed 's/[.[\^$]/\\&/g')

    # Replace * with .*
    escaped=$(echo "$escaped" | sed 's/\*/\.\*/g')
    result="${result}${escaped}"

    # End with anchor if pattern doesn't end with *
    if [[ ! "$pattern" =~ \*$ ]]; then
        result="${result}$"
    fi

    echo "$result"
}

# Build grep pattern
PATTERN=$(convert_pattern "$SEARCH_TERM")

# Build grep flags
GREP_FLAGS="-E"
if [[ "$CASE_SENSITIVE" == false ]]; then
    GREP_FLAGS="$GREP_FLAGS -i"
fi

# Search CSV for first match
while IFS=, read -r app image color; do
    # Skip header
    if [[ "$app" == "App" ]]; then
        continue
    fi

    # Match against App column
    if echo "$app" | grep -q $GREP_FLAGS "$PATTERN"; then
        # Strip carriage returns (Windows line endings)
        color="${color%$'\r'}"

        # Return requested value
        if [[ "$RETURN_COLOR" == true ]]; then
            echo "$color"
        else
            echo "$image"
        fi
        exit 0
    fi
done < "$CSV_FILE" || true

# No match found
exit 1
