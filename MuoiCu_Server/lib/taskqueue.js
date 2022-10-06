

class TaskQueue {
    constructor() {
        this.queue = Promise.resolve();
    }

    push(task) {
        this.queue = this.queue.catch(() => { });
        return this.then(task);
    }

    then(task) {
        if (task)
            this.queue = this.queue.then(task);
        return this;
    }
    catch(task) {
        if (task)
            this.queue = this.queue.catch(task);
        return this;
    }
    finally(task) {
        if (task)
            this.queue = this.queue.finally(task);
        return this;
    }
};

module.exports = new TaskQueue();