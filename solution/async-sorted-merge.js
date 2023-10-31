"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const MinHeap = require("./min-heap");
module.exports = (logSources, printer) => {
  
  return new Promise(async (resolve, reject) => {
    
    let minHeap = new MinHeap();
    let promises = [];
    let buffer_size = 100;
    let logSourcesBufferSizes = [];
    for (let i = 0; i < logSources.length; i++) {
      logSourcesBufferSizes.push(0);
      let logSourceBufferPromise = new Promise(async (resolve, reject) => {
          for (let j = 0; j < buffer_size; j++) {
            let value = await logSources[i].popAsync()
            minHeap.insert({data: value, index: i});
            logSourcesBufferSizes[i]+=1;
          }
          resolve(logSourcesBufferSizes[i]);
        });
      //await logSourceBufferPromise;
      console.log("Buffered log source " + i)
      promises.push(logSourceBufferPromise);
    }
      
    for (let i = 0; i < promises.length; i++) {
      await promises[i];
    }
    promises = [];
    while (minHeap.heap.length > 0) {
      let min = minHeap.pop();
      printer.print(min.data);
      logSourcesBufferSizes[min.index]-=1;
      if (promises[min.index] == undefined) 
        promises[min.index] = [];
      await Promise.all(promises[min.index]);
      let promise = logSources[min.index].popAsync().then((value) => {
        if (value) {
          minHeap.insert({data: value, index: min.index});
          logSourcesBufferSizes[min.index]+=1;
        }
      });
      if (logSourcesBufferSizes[min.index] == 0) {
        await promise;
      }
      promises[min.index].push(promise);
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
