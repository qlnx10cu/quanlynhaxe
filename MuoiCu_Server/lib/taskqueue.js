
const logger = require("../lib/logger");

class TaskQueue {
    constructor() {
        this.queue = Promise.resolve();
        this.index  = 0;
    }

    push(id, task) {
        this.index = this.index +1;
        logger.info("Id: "+id+" TaskQueue.push with:" + this.index);
        this.queue = this.queue.catch((error) => { console.log("catch do queue", error)});
        return this.then(task);
    }

    then(id, task) {
        logger.info("Id: "+id+" TaskQueue.then with:" + this.index);
        if (task)
            this.queue = this.queue.then(task);
        
        return this;
    }
    catch(id, task) {
        logger.info("Id: "+id+" TaskQueue.catch with:" + this.index);
        if (task)
            this.queue = this.queue.catch(task);
        return this;
    }
    finally(id, task) {
        this.index=  this.index -1;
        logger.info("Id: "+id+" TaskQueue.finally with:" + this.index);
        if (task)
            this.queue = this.queue.finally(task);
        return this;
    }
};

module.exports = new TaskQueue();