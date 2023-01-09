const correctArray = [6, 9, 3, 4];

function printProgress(progress, array = []) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
  process.stdout.write(JSON.stringify(array));
}

const array = [];

let ceilNumber = 10;

for (let i = 0; i < correctArray.length; i++) {
  array[i] = 0;
}

let iteration = 0;
const totalPossibilities = ceilNumber ** correctArray.length;
console.log(`Total number of possibilities: ${totalPossibilities}`);

// create a Set to store the combinations that have been tested
const testedCombinations = new Set();

while (array[correctArray.length - 1] < ceilNumber) {
  iteration++;

  // check if the current combination of values in the array is equal to the correct array
  if (JSON.stringify(array) === JSON.stringify(correctArray)) {
    printProgress(`Correct array found at iteration ${iteration}:`, array);
    break;
  }

  // log the current combination of values in the array
  printProgress(`Testing combination at iteration ${iteration}:`);

  // increment the value at the first index
  array[0]++;

  // carry over to the next index if the value at the current index is greater than or equal to 256
  for (let i = 0; i < correctArray.length; i++) {
    if (array[i] >= ceilNumber) {
      array[i] = 0;
      array[i + 1]++;
    }
  }
}
