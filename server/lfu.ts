import { coerceValue } from "graphql";

class Node<T> {
    data: T;
    next: Node<T>;
    previous: Node<T>;

    constructor(data: T) {
        this.data = data;
        this.next = this.previous = null;
    }
}

export class DoublyLinkedList<T> {
    head: Node<T>;
    tail: Node<T>;
    length: number;

  
    constructor(data: T = null) {               //value coming from node initially null === this.value = null
      if (data) {
        const headNode = new Node(data);
        this.head = headNode;
        this.tail = headNode;
        this.length = 1;
      } else {
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
    }
    /**
     * return true if the length of the linkedList is 0
     */
    isEmpty(): boolean {
      return this.length === 0;                 // true means empty
    }
  
    /**
     * Adding node to the end of the LinkedList
     * @param node                                  
     */
    private addNode(data: T) {
      let newNode = new Node(data);         
      if (this.isEmpty()) {
        this.head = this.tail = newNode;
      } else {
        this.tail.next = newNode;
        newNode.previous = this.tail;
        this.tail = newNode;
      }
      this.length++;
    }
  
    /**
     * add the node in the beginning of the LinkedList
     * @param data
     */
    addFirst(data: T) {
      if (this.isEmpty()) {
        this.head = this.tail = new Node(data);
      } else {
        let node = new Node(data);
        this.head.previous = node;
        node.next = this.head;
        this.head = node;
      }
      this.length++;
    }
  
    /**
     * add the node in the last of the linkedList
     * @param data
     */
    addLast(data: T) {              //second name for .addNode pass by refrence
      this.addNode(data);
    }
  
    /**
     * add a node at provided index with data
     * @param data
     * @param index
     */
    addAt(data: T, index: number) {                                     //addAt is basically a higher order function that determines which helper is best suited to create a new node, 
                                                                        //the helper invoked is also responsible for returning and incrementing LL
      if (index < 0 || index > this.length) throw "Illegal argument";
      if (index === 0) this.addFirst(data);
      else if (index === this.length) this.addNode(data);
      else {
        if (index < this.length / 2) {                                //  if index happens to be less than half the array get rid of the other, no point in going through it
          let currentNode = this.head;                                //  start looping from the head
          for (let i = 0; i < index; i++) {
            currentNode = currentNode.next;                           
          }
          this.newNodeAssignment(currentNode, data);                  //  
        } else {
          let currentNode = this.tail;
          for (let i = this.length - 1; i > index; i--) {  
            currentNode = currentNode.previous;
          }
          this.newNodeAssignment(currentNode, data);
        }
      }
    }
  
    //helper method for reassigning next, and prev after adding a new node
    private newNodeAssignment(currentNode: Node<T>, data: T) : Node<T>{              // [ Prev ] <=>  [newNode] <=>  [ Current ] <=>
                                                                                    //          <-------------------
        let newNode = new Node(data);                                              //           <-  
                                                                                  //                            ->                       
      currentNode.previous.next = newNode;                                       //last Node point at brand new node
                                                                                //                              <-
      newNode.previous = currentNode.previous;                                  
      newNode.next = currentNode;
      currentNode.previous = newNode;
      this.length++;                                                            //increment to add new node
      return newNode.next;
    }
  
    /**
     * add the list of element to the linked list after the provided node
     * @param startNode is the staring node from which the list will be added
     * @param l list of elements (Array)
     */

    //in the event we add data from an array, we initialize a start node that takes in the first element and creates the LL off subsequent elements
    private addFrom(startNode: Node<T>, l: Array<T>): Node<T>{
      if(!l) throw new Error('NullPointerException');                  // 1 , 2 , 3, 4, 5, a, b, c, 6 , 7 
      if(!startNode){                                                   //start node is equal to index of node poaition to insert after
        for(let content of l){
          this.addLast(content);                                        //if no list 
        }
      }else{
        for(let content of l){
          startNode = this.newNodeAssignment(startNode, content);      ///  1, 2, 3, 4, 5, 6, 7       //  [a, b, c]
        }
      }
      return startNode;
    }
  
    /**
     * add all the element to the end of the linked list
     * @param l list of element
     */
    addAll(l: Array<T>): boolean{
      if(!l) throw new Error('NullPointerException');
      for(let content of l){
        this.addNode(content);
      }
      return true;
    }
  
    /**
     * add the list of element to the linked list from the provided index
     * @param index starting index for insertion
     * @param l list of element
     */
    addAllFrom(index: number, l: Array<T>): boolean{
      if(!l) throw new Error('NullPointerException')
      if (index < 0 || index > this.length) throw new Error("Illegal argument");
      let currentNode = this.head;
      
      if(index === 0){
        this.addFirst(l[index]);
        l.splice(0,1);
        currentNode = this.head.next;
      }else if(index === this.length){
        return this.addAll(l);
      }
      
      for(let i = 0; i < index; i++){
        currentNode = currentNode.next;
      }
      console.log(`current node data is ${currentNode.data}`);
      this.addFrom(currentNode, l);
      return true;
    }
  
    /**
     * return the value of first node if it exists.
     */
    peekFirst(): T {
      if (this.isEmpty()) throw "The LinkedList is empty.";
      return this.head.data;
    }
  
    /**
     * return the value of last node if it exists.
     */
    peekLast(): T {
      if (this.isEmpty()) throw "The LinkedList is empty.";
      return this.tail.data;
    }
  
    /**
     * delete the first node of the linked list
     */
    deleteFirst(): T {
      if (this.isEmpty()) throw "The LinkedList is empty";
  
      let data: T = this.head.data;
      this.head = this.head.next;
      this.length--;
  
      if (this.isEmpty()) this.tail = null;
      else this.head.previous = null;
  
      return data;
    }
  
    /**
     * delete the last node of the linked list
     */
    deleteLast(): T {
      if (this.isEmpty()) throw "The LinkedList is empty";
  
      let data: T = this.head.data;
      this.tail = this.tail.previous;
      this.length--;
  
      if (this.isEmpty()) this.head = null;
      else this.tail.next = null;
  
      return data;
    }
  
    /**
     * delete the node at provided index
     * @param index
     */
    deleteAt(index: number): T {
      if (index < 0 || index >= this.length) throw "Illegal argument";
      if (index === 0) return this.deleteFirst();
      else if (index === this.length - 1) return this.deleteLast();
      else {
        if (index < this.length / 2) {
          let currentNode = this.head;
          for (let i = 0; i < index; i++) {
            currentNode = currentNode.next;
          }
          return this.removeNode(currentNode);
        } else {
          let currentNode = this.tail;
          for (let i = this.length - 1; i > index; i--) {
            currentNode = currentNode.previous;
          }
          return this.removeNode(currentNode);
        }
      }
    }
    
    private removeNode(node: Node<T>): T {
      const data = node.data;
      node.previous.next = node.next;
      node.next.previous = node.previous;
      this.length--;
  
      node.data = null;
      node.next = node.previous = null;
  
      return data;
    }
  
    /**
     * delete the node in the linked list
     * @param node
     */
    deleteNode(node: Node<T>){
      if(!node.previous) this.deleteFirst();
      else if(!node.next) this.deleteLast();
      else{
        this.removeNode(node);
      }
    }
    /**
     * delete the first node contains with data
     * @param data
     */
    deleteWith(data: T){
      let node = this.head;
      while(node){
        if(node.data === data){
          this.deleteNode(node);
          return;
        }
        node = node.next;
      }
    }
  
     /**
     * check the data present in the linkedList or not
     * @param data 
     */
    contains(data: T): boolean{
      let currentNode = this.head;
      while(currentNode){
        if(currentNode.data === data) return true;
        currentNode = currentNode.next
      }
      return false;
    }
  
    /**
     * clear the linked list
     */
    clear(): boolean{
      let node: Node<T> = this.head;
      while(node){
        let next: Node<T> = node.next;
        node.data = null;
        node.next = null;
        node.previous = null;
        node = next;
      }
      this.head = this.tail = null;
      this.length = 0;
      return true;
    }
  
  
  
    /**
     * Generator to iterate over the linkedList
     */
    *items() {
      let node = this.head;
      while (node) {
        yield node;
        node = node.next;
      }
    }
  
    /**
     * print the data of the LinkedList
     */
    print(){
      let dataArray: Array<T> = [];
      for(let node of this){
        dataArray.push(node.data);
      }
      console.log(dataArray);
    }
  
    [Symbol.iterator]() {
      let node = this.head;
      return {
        next: () => {
          if (node) {
            let data = node;
            node = node.next;
            return { value: data, done: false };
          } else {
            return { done: true };
          }
        }
      };
    }
}


// *****  --------------------   ***** //


function LfuNode(key: Number, value: String) {
    this.prev = null;
    this.next = null;

    this.key = key;
    this.data = value;

    this.frequencyCount = 1;
}

function LfuDoublyLinkedList() {
    this.head = new LfuNode('head', null);
    this.tail = new LfuNode('tail', null);

    this.head.next = this.tail;
    this.tail.prev = this.head;

    this.size = 0;
}

LfuDoublyLinkedList.prototype.insertAtHead = function(node) {
    // set current head as new node's next
    node.next = this.head.next;
    this.head.next.prev = node;

    // set current head as new node
    this.head.next = node;
    node.prev = this.head;

    this.size++;
}

LfuDoublyLinkedList.prototype.removeAtTail = function() {
    const oldTail = this.tail.prev; // save last node to return back

    // get reference to node we want to remove
    const prev = this.tail.prev;

    // from the node we want to remove - get the prev node, then set THAT node's next to tail
    prev.prev.next = this.tail;

    // set prev node of the tail to the node previous to the node we want to remove
    this.tail.prev = prev.prev;

    this.size--;
    return oldTail;
}

LfuDoublyLinkedList.prototype.removeNode = function(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;

    this.size--;
}

function LfuCache(capacity) {
    this.keys = {}; // stores LfuNode
    this.frequency = {}; // stores LfuDoublyLinkedList

    this.capacity = capacity;

    this.minFrequency = 0; // keeps track of the lowest frequency linked list
    this.size = 0;
}
//set method takes in capacity and size, and determines if to dri
LfuCache.prototype.set = function(key, value) {
    let node = this.keys[key];

    // if node doesnt exist in keys then add it
    if (node == undefined) {

        // create new node and store in keys
        node = new LfuNode(key, value);
        this.keys[key] = node;

        // if we have space for node then try to add it to linked list with frequency 1
        if (this.size !== this.capacity) {

            // if linked list for frequency 1 doesnt exist then create it
            if (this.frequency[1] == undefined) 
            this.frequency[1] = new LfuDoublyLinkedList();
                
            // add new node and increment size of frequency 1
            this.frequency[1].insertAtHead(node);
            this.size++;

        } else {
            // else frequency 1 is full and we need to delete a node first so delete tail
            const oldTail = this.frequency[this.minFrequency].removeAtTail();
            delete this.keys[oldTail.key];

            // if we deleted frequency 1 then add it back before adding new node
            if (this.frequency[1] === undefined) 
                this.frequency[1] = new LfuDoublyLinkedList();

            this.frequency[1].insertAtHead(node);
        }

        // we added a new node so minFrequency needs to be reset to 1
        // aka new node was referenced once
        this.minFrequency = 1;

    } else {
        // else node exists so we need to get it and move it to the new linked list

        // save the old frequency of the node and increment (also update data)
        const oldFrequencyCount = node.frequencyCount; //[1]
        node.data = value; // [coral]
        node.freqCount++;  // [2]

        // remove node from the linked list
        this.frequency[oldFrequencyCount].removeNode(node);

        // if new list doesnt exist then make it now
                             // [2]
        if (this.frequency[node.frequencyCount] === undefined) 
            this.frequency[node.frequencyCount] = new LfuDoublyLinkedList();

        // now add node to new linked list with the incremented freqCount
        this.frequency[node.frequencyCount].insertAtHead(node);

        // if the node we incremented was in the minFrequency list of all lists
        // and there's nothing left in the old list then we know the new minFrequency
        // any node in any list is in the next freq so increment that now
        if (
            oldFrequencyCount === this.minFrequeny
            && Object.keys(this.frequency[oldFrequencyCount]).size === 0
        ) {
            this.minFrequency++;

        }
    }
}

LfuCache.prototype.get = function(key) {
    const node = this.keys[key];
    if (node == undefined) return null;

    const oldFrequencyCount = node.frequencyCount;
    node.frequencyCount++;

    // remove node from old frequency list and create new one if next one doesnt exist
    // before adding the node to the next list at the head
    this.frequency[oldFrequencyCount].removeNode(node);
    if (this.frequency[node.frequencyCount] === undefined) 
        this.frequency[node.frequencyCount] = new LfuDoublyLinkedList();

    this.frequency[node.frequencyCount].insertAtHead(node);

    // if old frequency list is empty then update minFrequency
    if (
        oldFrequencyCount === this.minFrequency
        && Object.keys(this.frequency[oldFrequencyCount]).length === 0
    ) {
        this.minFrequency++;
    }

    return node.data;
}