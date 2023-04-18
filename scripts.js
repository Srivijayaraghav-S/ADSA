  // define an array of products to search through
class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    enqueue(item, priority) {
      this.heap.push({ item, priority });
      this.bubbleUp(this.heap.length - 1);
    }
  
    dequeue() {
      const min = this.heap[0];
      const end = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.bubbleDown(0);
      }
      return min.item;
    }
    toArray() {
        // make a copy of the heap
        const heapCopy = [...this.heap];
        const h = heapCopy;
        const result = [];
        // remove items from the heap in order
        while (heapCopy.length > 0) {
          result.push(h.pop());
        }
        // restore the heap to its original state
        this.heap = heapCopy;
    
        return result;
      }
    bubbleUp(index) {
      const element = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        if (element.priority >= parent.priority) break;
        this.heap[parentIndex] = element;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }
  
    bubbleDown(index) {
      const length = this.heap.length;
      const element = this.heap[index];
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let leftChild, rightChild;
        let swap = null;
        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (leftChild.priority < element.priority) {
            swap = leftChildIndex;
          }
        }
        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)
          ) {
            swap = rightChildIndex;
          }
        }
        if (swap === null) break;
        this.heap[index] = this.heap[swap];
        this.heap[swap] = element;
        index = swap;
      }
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  }
  class BTree {
    constructor(order) {
      this.order = order;
      this.root = new BTreeNode(order);
    }
  
    insert(key, value) {
      this.root.insert(key, value);
      if (this.root.isFull()) {
        const newRoot = new BTreeNode(this.order);
        newRoot.children.push(this.root);
        newRoot.splitChild(0);
        this.root = newRoot;
      }
    }
  
    search(key) {
      return this.root.search(key);
    }
  }
  
  class BTreeNode {
    constructor(order) {
      this.order = order;
      this.keys = [];
      this.values = [];
      this.children = [];
    }
  
    isLeaf() {
      return this.children.length === 0;
    }
  
    isFull() {
      return this.keys.length === this.order - 1;
    }
  
    search(key) {
      let i = 0;
      while (i < this.keys.length && key > this.keys[i]) {
        i++;
      }
      if (this.keys[i] === key) {
        return this.values[i];
      } else if (this.isLeaf()) {
        return null;
      } else {
        return this.children[i].search(key);
    }
    }
    
    insert(key, value) {
    let i = 0;
    while (i < this.keys.length && key > this.keys[i]) {
    i++;
    }
    if (this.isLeaf()) {
    this.keys.splice(i, 0, key);
    this.values.splice(i, 0, value);
    } else {
    const child = this.children[i];
    if (child.isFull()) {
    this.splitChild(i);
    if (key > this.keys[i]) {
    i++;
    }
    }
    this.children[i].insert(key, value);
    }
    }
    
    splitChild(i) {
    const child = this.children[i];
    const newChild = new BTreeNode(this.order);
    const mid = Math.floor(child.keys.length / 2);
    newChild.keys = child.keys.splice(mid + 1);
    newChild.values = child.values.splice(mid + 1);
    if (!child.isLeaf()) {
    newChild.children = child.children.splice(mid + 1);
    }
    this.keys.splice(i, 0, child.keys[mid]);
    this.values.splice(i, 0, child.values[mid]);
    this.children.splice(i + 1, 0, newChild);
    }
    }
    
    class SegmentTree {
        constructor(array) {
          this.tree = this.buildTree(array);
        }
      
        buildTree(array, start = 0, end = array.length - 1) {
          if (start === end) {
            return { value: array[start] };
          }
          const mid = Math.floor((start + end) / 2);
          const left = this.buildTree(array, start, mid);
          const right = this.buildTree(array, mid + 1, end);
          return {
            left,
            right,
            value: left.value + right.value,
          };
        }
      
        query(start, end, array, node = this.tree, nodeStart = 0, nodeEnd = array.length - 1) {
          if (start > nodeEnd || end < nodeStart) {
            return 0;
          } else if (start <= nodeStart && end >= nodeEnd) {
            return node.value;
          } else {
            const mid = Math.floor((nodeStart + nodeEnd) / 2);
            const leftValue = this.query(start, end, node.left, nodeStart, mid);
            const rightValue = this.query(start, end, node.right, mid + 1, nodeEnd);
            return leftValue + rightValue;
          }
        }
      
        update(index, value, array, node = this.tree, nodeStart = 0, nodeEnd = array.length - 1) {
          if (nodeStart === nodeEnd) {
            node.value = value;
          } else {
            const mid = Math.floor((nodeStart + nodeEnd) / 2);
            if (index <= mid) {
              this.update(index, value, node.left, nodeStart, mid);
            } else {
              this.update(index, value, node.right, mid + 1, nodeEnd);
            }
            node.value = node.left.value + node.right.value;
          }
        }
      }
let products = [
    {id: 1, name: "Samsung Phone", description: "Lorem ipsum dolor sit amet", price: 10.99, rating: 4.5, image: "product-a.jpg"},
    {id: 2, name: "Oppo Phone", description: "Consectetur adipiscing elit", price: 12.99, rating: 3.9, image: "product-b.jpg"},
    {id: 3, name: "Apple iPhone", description: "Sed do eiusmod tempor incididunt", price: 8.99, rating: 4.2, image: "product-c.jpg"},
    {id: 4, name: "OnePlus Phone", description: "Ut labore et dolore magna aliqua", price: 9.99, rating: 4.7, image: "product-d.jpg"},
    {id: 5, name: "Nokia Phone", description: "Ut enim ad minim veniam", price: 14.99, rating: 4.1, image: "product-e.jpg"},
    {id: 6, name: "Laptop", description: "Quis nostrud exercitation ullamco", price: 19.99, rating: 4.6, image: "product-f.jpg"},
    {id: 7, name: "Hairdryer", description: "Duis aute irure dolor in reprehenderit", price: 7.99, rating: 3.8, image: "product-g.jpg"},
    {id: 8, name: "Washing Machine", description: "Excepteur sint occaecat cupidatat non proident", price: 11.99, rating: 4.3, image: "product-h.jpg"},
    {id: 9, name: "Jewellery", description: "Sunt in culpa qui officia deserunt", price: 15.99, rating: 4.8, image: "product-i.jpg"},
    {id: 10, name: "Watch", description: "Mollit anim id est laborum", price: 18.99, rating: 4.4, image: "product-j.jpg"},
    // add more products here
  ];
  
  // define the search function
  function search(query) {
    // split the query into individual words
    let words = query.toLowerCase().split(/\s+/);
    
    // create a priority queue to store the search results
    let results = new PriorityQueue();
    
    // loop through each product
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      
      // calculate the product's relevance score
      let score = 0;
      for (let j = 0; j < words.length; j++) {
        let word = words[j];
        if (product.name.toLowerCase().includes(word)) {
          score += 10;
        }
        if (product.description.toLowerCase().includes(word)) {
          score += 5;
        }
      }
      
      // add the product and its score to the priority queue
      results.enqueue(product, score);
    }
    const x = results.toArray();
    console.log(x)
    // create a segment tree from the priority queue
    let tree = new SegmentTree(x, (a, b) => a[1] > b[1]);
    // perform a range query on the segment tree to get the top 10 search results
    let topResults = tree.query(0, 9, x);
    console.log(topResults)
    console.log(typeof(topResults));
    // return the top search results
    return topResults.map(result => result[0]);
  }
  
  // example usage:
  let query = "phone"; // search for products that contain the word "product"
  let results = search(query);
  console.log(results); // output the top 10 search results to the console
  
  
  // Get the search input and button elements
  let searchInput = document.getElementById("search-input");
  let searchButton = document.getElementById("search-button");
  
  // Add an event listener to the search button
  searchButton.addEventListener("click", function() {
    // Get the search query from the input field
    let query = searchInput.value;
  
    // Call the search function to get the relevant products
    let relevantProducts = search({ id: Math.floor(Math.random() * 1000), text: query }, products);
  
    // Update the results section with the relevant products
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    for (let i = 0; i < relevantProducts.length; i++) {
        let product = relevantProducts[i];
        let productDiv = document.createElement("div");
        productDiv.className = "product";
        let productImg = document.createElement("img");
        productImg.src = product.image;
        let productInfo = document.createElement("div");
        let productName = document.createElement("h3");
        productName.innerHTML = product.name;
        let productDescription = document.createElement("p");
        productDescription.innerHTML = product.description;
        let productPrice = document.createElement("p");
        productPrice.innerHTML = "$" + product.price.toFixed(2);
        let productRating = document.createElement("p");
        productRating.innerHTML = "Rating: " + product.rating.toFixed(1) + "/5";
        productInfo.appendChild(productName);
        productInfo.appendChild(productDescription);
        productInfo.appendChild(productPrice);
        productInfo.appendChild(productRating);
        productDiv.appendChild(productImg);
        productDiv.appendChild(productInfo);
        resultsDiv.appendChild(productDiv);
        }
        });  