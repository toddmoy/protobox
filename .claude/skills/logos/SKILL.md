---
name: "logos"
description: "Returns URLs for logos and brand hex colors for apps in the Zapier ecosystem. When Claude needs to show logos or use brand colors."
license: Proprietary
---

# Logos Skill

## Description
Returns logo URLs and primary brand colors (in hex) for companies on the Zapier platform.

## When to use
- Use this skill when the user asks for a company logo URL in PNG format
- Use this skill when the user needs a company brand color in hexadecimal format
- Use this skill when the user wants to add a logo to a prototype or design
- Use this skill when the user needs branding information for any Zapier integration

## Instructions

1. Parse the user's request to identify the company/app name
   - Extract the company name from the user's query
   - Determine if they need the logo URL, brand color, or both

2. Run the search.sh script using the Bash tool
   - Use the appropriate search pattern based on the company name
   - For logo URL: `./search.sh "CompanyName"`
   - For brand color: `./search.sh "CompanyName" --color`
   - For partial matches: `./search.sh "*company*"`
   - The script returns the first matching result as plain text

3. Use the result directly
   - The script returns a single value: either a logo URL or hex color (without # prefix)
   - The script exits with code 0 on success, 1 if no match found

4. Present the information to the user
   - Provide the logo URL or brand color as requested
   - Add # prefix to hex colors when displaying to the user
   - If no match is found (exit code 1), inform the user the app may not be in the database

## Important notes
- The search is case-insensitive by default
- Wildcard patterns are supported:
  - `"appname"` - Exact match
  - `"*appname"` - Ends with appname
  - `"appname*"` - Starts with appname
  - `"*appname*"` - Contains appname
  - `"app*name"` - Pattern match with wildcard in the middle
- If no results are found, inform the user that the app may not be in the Zapier platform database
- The script searches the app-icons-and-colors.csv file located in the same directory

## Tools to use
- Bash: For running the search.sh script
- The search.sh script handles all CSV parsing and search logic

## Examples

### Example 1
User: "What's the logo URL for Slack?"
Expected behavior:
1. Run: `./search.sh "Slack"`
2. Return: "The Slack logo URL is: [URL]"
3. Optionally run: `./search.sh "Slack" --color` for the brand color
4. Return: "The Slack brand color is #[hex]"

### Example 2
User: "I need the brand color for Gmail"
Expected behavior:
1. Run: `./search.sh "Gmail" --color`
2. Add # prefix to the result
3. Return: "The Gmail brand color is #[hex]"

### Example 3
User: "Show me the first app with 'mail' in the name"
Expected behavior:
1. Run: `./search.sh "*mail*"`
2. Return the logo URL for the first match
3. Note: The script returns only the first match for simplicity

## Output format
- Provide clear, direct answers to the user's query
- Format logo URLs as clickable links when possible
- Display hex colors with the # prefix (e.g., #4285F4)
- The search.sh script returns only the first match for efficiency
- If the user needs to use the information in code or design tools, provide it in an easy-to-copy format
