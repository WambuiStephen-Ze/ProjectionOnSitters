// import {availableParallelism} from 'node:os';
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// import cluster from 'node:cluster';

// const counts = availableParallelism();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// console.log(`Primary processorId ${process.processorId}`);

// cluster.setupPrimary({
//     exec: __dirname + "/sitsBackend/app.js"
// });

// for (let i = 0; i < counts; i++) {
//     cluster.fork();
// }

// cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.processorId} has terminated`)
//     console.log('Initiating running new');
//     cluster.fork();
// })