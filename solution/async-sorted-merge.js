"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const MinHeap = require("./min-heap");
module.exports = (logSources, printer) => {
  
  return new Promise(async (resolve, reject) => {
    
    let minHeap = new MinHeap();
    let promises = [];
    for (let i = 0; i < logSources.length; i++) {
      let promise = logSources[i].popAsync().then((value) => {
                      if (value) {
                        minHeap.insert({data: value, index: i});
                      }
                    });
      promises.push(promise);
    }
    for (let i = 0; i < promises.length; i++) {
      await promises[i];
    }
    while (minHeap.heap.length > 0) {
      let min = minHeap.pop();
      printer.print(min.data);
      let value = await logSources[min.index].popAsync();
      if (value) {
        minHeap.insert({data: value, index: min.index});
      }
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
