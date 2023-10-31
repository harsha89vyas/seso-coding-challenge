// Desc: MinHeap class to maintain a minheap of entries from logsource by last log date

module.exports = class MinHeap {
    //constructor
    constructor() {
        this.heap = [];
    }

    //minheapify
    minHeapify(i) {
        let n = this.heap.length;
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        let smallest = i;
        if (l < n && this.heap[l].data.date < this.heap[smallest].data.date) {
            smallest = l;
        }
        if (r < n && this.heap[r].data.date < this.heap[smallest].data.date) {
            smallest = r;
        }
        if (smallest != i) {
            let temp = this.heap[i];
            this.heap[i] = this.heap[smallest];
            this.heap[smallest] = temp;
            this.minHeapify(smallest);
        }
    }
    //pop the min element from heap
    pop() {
        let n = this.heap.length;
        if (n == 0) {
            return false;
        }
        let min = this.heap[0];
        this.heap[0] = this.heap[n - 1];
        this.heap.pop();
        this.minHeapify(0);
        return min;
    }
    //insert element into minheap
    insert(element) {
        this.heap.push(element);
        let n = this.heap.length;
        let i = n - 1;
        while (i > 0) {
            let parent = Math.floor((i - 1) / 2);
            if (this.heap[parent].data.date > this.heap[i].data.date) {
                let temp = this.heap[parent];
                this.heap[parent] = this.heap[i];
                this.heap[i] = temp;
            }
            i = parent;
        }
    }
}