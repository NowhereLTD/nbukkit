module.exports = class Inventory {

    constructor(size, holder) {
        this.size = size;
        this.holder = holder;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    setItem(id, item) {
        this.items[id] = item;
    }



}