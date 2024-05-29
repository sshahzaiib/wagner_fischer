#!/usr/bin/env zx

const fs = require('fs');

// check if the file exists
if (!fs.existsSync('words.txt')) {
  console.log('words.txt does not exist. Downloading the file...');
  let data = await (await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt')).text();
  fs.writeFileSync('words.txt', data);
}

function loadDictionary(filePath = 'words.txt') {
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n').map(word => word.trim()).filter(Boolean);
}

/**
 * Computes the Levenshtein distance between two strings using the Wagner-Fischer algorithm.
 * The Levenshtein distance is a measure of the minimum number of single-character edits 
 * (insertions, deletions, or substitutions) required to change one string into the other.
 *
 * @param {string} s1 - The first string to compare.
 * @param {string} s2 - The second string to compare.
 * @returns {number} The Levenshtein distance between s1 and s2.
 *
 * @example
 * // returns 3
 * wagnerFischer('kitten', 'sitting')
 *
 * @description
 * The function first checks the lengths of the two strings. If s1 is longer than s2, 
 * it swaps the two strings and their lengths. This is done to ensure that s1 is the 
 * shorter string, which optimizes the space complexity of the algorithm.
 * 
 * It initializes currentRow as an array of integers from 0 to the length of s1. This 
 * represents the initial state of the dynamic programming table, where the first string 
 * is empty and all characters of the second string are insertions.
 * 
 * The function then enters a nested loop, iterating over each character of s2 and s1. 
 * For each pair of characters, it computes the cost of addition, deletion, and change 
 * (substitution). If the current characters of s1 and s2 are not equal, it increments 
 * the change cost.
 * 
 * It then sets the current cell of the dynamic programming table (i.e., currentRow[j]) 
 * to the minimum of the addition cost, deletion cost, and change cost. This represents 
 * the minimum number of edits required to transform the substring s1[0..j] into s2[0..i].
 * 
 * After iterating over all characters, it returns the last cell of currentRow, which 
 * represents the Levenshtein distance between s1 and s2.
 * 
 * This function is typically used in applications like spell checking, DNA sequence 
 * alignment, and natural language processing, where measuring the difference between 
 * two sequences is required.
 */
function wagnerFischer(s1, s2) {
    let len_s1 = s1.length, len_s2 = s2.length;
    if (len_s1 > len_s2) {
        [s1, s2] = [s2, s1];
        [len_s1, len_s2] = [len_s2, len_s1];
    }

    let currentRow = Array.from({length: len_s1 + 1}, (_, i) => i);
    for (let i = 1; i <= len_s2; i++) {
        let previousRow = currentRow;
        currentRow = [i].concat(Array(len_s1).fill(0));
        for (let j = 1; j <= len_s1; j++) {
            let add = previousRow[j] + 1;
            let del = currentRow[j - 1] + 1;
            let change = previousRow[j - 1];
            if (s1[j - 1] !== s2[i - 1]) {
                change += 1;
            }
            currentRow[j] = Math.min(add, del, change);
        }
    }

    return currentRow[len_s1];
}

function spellCheck(word, dictionary) {
  let suggestions = [];

  for (let correctWord of dictionary) {
      if (correctWord) { // Ensure the word is not empty
          let distance = wagnerFischer(word, correctWord);
          suggestions.push({correctWord, distance});
      }
  }

  // Sort and slice the suggestions
  suggestions.sort((a, b) => a.distance - b.distance);
  return suggestions.slice(0, 10);
}

let dictionary = loadDictionary();
console.log(`Dictionary loaded with ${dictionary.length} words`);

const misspelledWord = await question('Enter a word? ')
let suggestions = spellCheck(misspelledWord, dictionary);
console.log(`Top 10 suggestions for '${misspelledWord}':`);
for (let {correctWord, distance} of suggestions) {
  console.log(`${correctWord} (Distance: ${distance})`);
}