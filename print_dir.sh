#!/bin/bash

# Function to print directory structure recursively
print_directory_structure() {
    local dir=$1
    local prefix=$2
    local max_depth=$3
    local current_depth=$4

    # Check if we've reached the maximum depth
    if [ "$current_depth" -gt "$max_depth" ] && [ "$max_depth" -ne 0 ]; then
        return
    fi

    # Print the current directory name
    echo "${prefix}${dir##*/}"

    # Iterate over the contents of the directory
    for item in "$dir"/*; do
        # Skip node_modules directory
        if [ "${item##*/}" = "node_modules" ]; then
            continue
        fi

        if [ -d "$item" ]; then
            # If it's a directory, recurse into it
            print_directory_structure "$item" "$prefix│   " "$max_depth" $((current_depth + 1))
        elif [ -f "$item" ]; then
            # If it's a file, print its name
            echo "${prefix}├── ${item##*/}"
        fi
    done
}

# Main script
echo "Next.js 14 Project Structure (excluding node_modules):"
echo "----------------------------------------------------"

# Set the root directory (current directory by default)
root_dir=${1:-.}

# Set the maximum depth (0 for unlimited)
max_depth=${2:-0}

# Call the function to print the directory structure
print_directory_structure "$root_dir" "" "$max_depth" 1
