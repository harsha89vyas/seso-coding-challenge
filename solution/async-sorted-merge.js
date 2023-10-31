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
      for (let j = 0; j < buffer_size; j++) {
        let promise = logSources[i].popAsync().then((value) => {
          if (value) {
            minHeap.insert({data: value, index: i});
          }
        });
        promises.push(promise);
        logSourcesBufferSizes[i]+=1;
      }
    }
    for (let i = 0; i < promises.length; i++) {
      await promises[i];
    }
    promises = [];
    while (minHeap.heap.length > 0) {
      let min = minHeap.pop();
      printer.print(min.data);
      logSourcesBufferSizes[min.index]-=1;
      let promise = logSources[min.index].popAsync().then((value) => {
        if (value) {
          minHeap.insert({data: value, index: min.index});
          logSourcesBufferSizes[min.index]+=1;
        }
      });
      if (logSourcesBufferSizes[min.index] == 0) {
        await promise;
      }
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
