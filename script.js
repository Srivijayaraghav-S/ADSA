const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const query = new Query(
    form.elements.name.value,
    form.elements.category.value,
    form.elements.description.value,
    form.elements.minPrice.valueAsNumber,
    form.elements.maxPrice.valueAsNumber,
    form.elements.minRating.valueAsNumber,
    form.elements.maxRating.valueAsNumber
  );
  const results = btree.search(query);
  a=new Product();
  b=new Product();
  const topResults = new PriorityQueue();
  results.forEach(result => topResults.enqueue(result, result.score(query)));
  const filteredResults = topResults.toArray().filter(result => result.price >= query.minPrice && result.price <= query.maxPrice && result.rating >= query.minRating && result.rating <= query.maxRating);
  displayResults(filteredResults);
});

function displayResults(results) {
  // TODO: Implement code to display results in the user interface
  console.log("Display Results")
}


// Define the B-tree class
class BTree {
    constructor(order) {
      this.order = order;
      this.root = new BTreeNode(order, true);
    }
    
    // Insert a new product into the B-tree
    insert(product) {
      this.root.insert(product);
    }
    
    // Search the B-tree for products matching the query
    search(query) {
      const results = new PriorityQueue((a, b) => a.score < b.score);
      this.root.search(query, results);
      return results.toArray();
    }
  }
  
  // Define the B-tree node class
  class BTreeNode {
    constructor(order, leaf) {
      this.order = order;
      this.leaf = leaf;
      this.keys = [];
      this.children = [];
      this.products = [];
    }
    
    // Insert a new product into this node
    insert(product) {
      if (this.leaf) {
        // Insert the product into the leaf node
        this.products.push(product);
        this.products.sort((a, b) => a.name.localeCompare(b.name));
        
        // Split the node if it has too many products
        if (this.products.length > 2 * this.order) {
          const middle = Math.floor(this.products.length / 2);
          const leftProducts = this.products.slice(0, middle);
          const rightProducts = this.products.slice(middle);
          const rightNode = new BTreeNode(this.order, true);
          rightNode.products = rightProducts;
          const key = rightProducts[0].name;
          this.products = leftProducts;
          this.keys.push(key);
          this.children.push(rightNode);
        }
      } else {
        // Insert the product into the appropriate child node
        let i = 0;
        while (i < this.keys.length && product.name > this.keys[i]) {
          i++;
        }
        this.children[i].insert(product);
        
        // Split the child node if it has too many products
        if (this.children[i].products.length > 2 * this.order) {
          const middle = Math.floor(this.children[i].products.length / 2);
          const leftNode = this.children[i];
          const rightNode = new BTreeNode(this.order, leftNode.leaf);
          rightNode.products = leftNode.products.slice(middle);
          leftNode.products = leftNode.products.slice(0, middle);
          const key = rightNode.products[0].name;
          this.keys.splice(i, 0, key);
          this.children.splice(i + 1, 0, rightNode);
        }
      }
    }
    
    // Search this node and its descendants for products matching the query
    search(query, results) {
      const keys = this.keys;
      const children = this.children;
      const products = this.products;
      const n = keys.length;
      let i = 0;
      while (i < n && query.name > keys[i]) {
        i++;
      }
      if (this.leaf) {
        for (const product of products) {
          const score = product.score(query);
          results.enqueue(product, score);
          if (results.size() > 10) {
            results.dequeue();
          }
        }
      } else {
        if (i < n && query.name === keys[i]) {
          children[i].search(query, results);
        }
        if (i > 0 && query.name >= keys[i -1]) {
            children[i - 1].search(query, results);
            }
            if (i < n && query.name <= keys[i]) {
            children[i].search(query, results);
            }
            }
            }
            }
            
            // Define the Product class
            class Product {
            constructor(name, category, description, price, rating) {
            this.name = name;
            this.category = category;
            this.description = description;
            this.price = price;
            this.rating = rating;
            }
            
            // Calculate the score of this product based on the query
            score(query) {
            let score = 0;
            if (this.name.includes(query.name)) {
            score += 3;
            }
            if (this.category.includes(query.category)) {
            score += 2;
            }
            if (this.description.includes(query.description)) {
            score += 1;
            }
            score += Math.max(0, Math.min(1, (this.price - query.minPrice) / (query.maxPrice - query.minPrice))) * 2;
            score += Math.max(0, Math.min(1, (this.rating - query.minRating) / (query.maxRating - query.minRating))) * 2;
            return score;
            }
            }
            
            // Define the Query class
            class Query {
            constructor(name, category, description, minPrice, maxPrice, minRating, maxRating) {
            this.name = name;
            this.category = category;
            this.description = description;
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
            this.minRating = minRating;
            this.maxRating = maxRating;
            }
            }
            
            // Define the PriorityQueue class
            class PriorityQueue {
            constructor(comparator) {
            this.comparator = comparator;
            this.array = [];
            }
            
            enqueue(item, priority) {
            this.array.push({item, priority});
            this.array.sort((a, b) => this.comparator(a, b));
            }
            
            dequeue() {
            return this.array.shift().item;
            }
            
            size() {
            return this.array.length;
            }
            
            toArray() {
            return this.array.map(({item}) => item);
            }
            }
            
            // Example usage
            const btree = new BTree(2);
            btree.insert(new Product("Apple iPhone 12", "Electronics", "A14 Bionic chip, 5G, OLED display", 799, 4.7));
            btree.insert(new Product("Samsung Galaxy S21", "Electronics", "Exynos 2100, 5G, AMOLED display", 699, 4.5));
            btree.insert(new Product("Nike Air Zoom Pegasus 38", "Sports", "Cushion foam, breathable", 120, 4.9));
            btree.insert(new Product("Adidas Ultraboost 21", "Sports", "Primeknit+, Boost cushioning", 180, 4.8));
            const query = new Query("iPhone", "Electronics", "chip", 500, 1000, 4.5, 5);
            const results = btree.search(query);
            console.log(results);  