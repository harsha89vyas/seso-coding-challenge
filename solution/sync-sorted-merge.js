"use strict";

const MinHeap = require("./min-heap");
// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  let minHeap = new MinHeap();
  for (let i = 0; i < logSources.length; i++) {
    minHeap.insert({data: logSources[i].pop(), index: i});
  }
  while (minHeap.heap.length > 0) {
    let min = minHeap.pop();
    printer.print(min.data);
    let next = logSources[min.index].pop();
    if (next) {
      minHeap.insert({data: next, index: min.index});
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};
