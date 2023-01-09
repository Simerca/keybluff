const { Worker, isMainThread, parentPort } = require('worker_threads');
const fs = require('fs');
const correctArray = [
    6,9,3,4
];

let ceilNumber = 10;

function printProgress(progress, array) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}

if (isMainThread) {
    const numWorkers = 4; // adjust this to the number of CPU cores you want to use
    const chunkSize = Math.ceil(ceilNumber ** correctArray.length / numWorkers);
    let workers = [];
    let results = [];

    console.log(`Total number of possibilities: ${ceilNumber ** correctArray.length}`);

    function startWorker(start) {
        const worker = new Worker(__filename);
        worker.on('error', () => {
            console.log('Worker error, restarting...');
            worker.terminate();
            startWorker(start);
        });
        worker.on('exit', () => {
            console.log('Worker exit, restarting...');
            worker.terminate();
            startWorker(start);
        });
        worker.on('message', ({ iteration, array, found }) => {
            if (found) {
                printProgress(`Correct array found at iteration ${iteration}:`, array);
                fs.writeFileSync('./find_array.txt', JSON.stringify(array));
                workers.forEach(w => w.terminate());
            } else {
                printProgress(`Testing combination at iteration ${iteration}:`, array);
            }
            results.push({ iteration, array, found });
        });
        worker.postMessage({ start, chunkSize });
        workers.push(worker);
    }

    for (let i = 0; i < numWorkers; i++) {
        startWorker(i * chunkSize);
    }

    // Wait for all workers to complete and then check the results
    Promise.all(workers).then(() => {
        results.forEach(result => {
            if (result.found) {
                console.log(`Correct array found at iteration ${result.iteration}:`, result.array);
            }
        });
    });
} else {
    parentPort.on('message', ({ start, chunkSize }) => {
        for (let i = start; i < start + chunkSize; i++) {
            const array = [];
            for (let j = 0; j < correctArray.length; j++) {
                array[j] = Math.floor(Math.random() * ceilNumber);
            }
            const found = JSON.stringify(array) === JSON.stringify(correctArray);
            parentPort.postMessage({ iteration: i, array, found });
        }
    });
}
