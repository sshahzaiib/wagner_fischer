# Wagner-Fischer Algorithm Implementation

This script implements the Wagner-Fischer algorithm to compute the Levenshtein distance between two strings. The Levenshtein distance is a measure of the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.

## Prerequisites

- Node.js
- [zx](https://github.com/google/zx)

## Installation

1. Install Node.js from [https://nodejs.org/](https://nodejs.org/).
2. Install zx globally with npm:

```bash
npm install -g zx
```

## Usage
1. Make sure the script has execute permissions:
```bash
chmod +x wagner_fischer.mjs
```
2. Run the script with a word as an argument:
```bash
./wagner_fischer.mjs
```
The script will download a dictionary file (words.txt) if it does not exist in the current directory. It will then load the dictionary and compute the Levenshtein distance between the provided word and each word in the dictionary.

## Functions
- `loadDictionary()`: Loads a dictionary from a text file. Each line in the file should contain one word. The function returns an array of words.

- `wagnerFischer(s1, s2)`: Computes the Levenshtein distance between s1 and s2 using the Wagner-Fischer algorithm. Returns the Levenshtein distance as a number.

## License
This project is licensed under the MIT License.
