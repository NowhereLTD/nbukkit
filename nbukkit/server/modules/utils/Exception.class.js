

class Exception {
    constructor(value, message) {
        this.value = value;
        this.message = message;
    }
    toString(){
        return this.value + ": " + this.message;
    }
}
module.exports = Exception;
