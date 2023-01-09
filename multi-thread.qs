open System;
open Microsoft.Quantum.Convert;
open Microsoft.Quantum.Math;

operation Main() : Unit {
    using (workers = new WorkerChannel[2]) { // adjust this to the number of CPU cores you want to use
        let ceilNumber = 10;
        let correctArray = [8,7,9,3];
        let numWorkers = workers.Length;
        let chunkSize = (ceilNumber ** correctArray.Length / numWorkers).Ceiling();
        let results = new Result[numWorkers];

        message "Total number of possibilities: " + (ceilNumber ** correctArray.Length).ToString();

        for (i in 0..numWorkers - 1) {
            let start = i * chunkSize;
            set workers[i] = Worker(start, chunkSize);
        }

        // Wait for all workers to complete and then check the results
        for (i in 0..numWorkers - 1) {
            let (iteration, array, found) = Result.Recv(workers[i].Result);
            if (found) {
                message "Correct array found at iteration " + iteration.ToString() + ": " + array.ToString();
            }
            results[i] = (iteration, array, found);
        }
        for (result in results) {
            if (result.found) {
                message "Correct array found at iteration " + result.iteration.ToString() + ": " + result.array.ToString();
            }
        }
    }
}

operation Worker(start : Int, chunkSize : Int) : Result {
    for (i in start..start + chunkSize - 1) {
        let array = [RandomInt(ceilNumber) : _ in 1..correctArray.Length];
        let found = array == correctArray;
        Result.Send((i, array, found));
    }
    return ();
}

type Result = (Int, Int[], Bool);
