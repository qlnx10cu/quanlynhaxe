const taskqueue = require('./taskqueue');
const librespone = require("../lib/respone");

function responeValue(req, res, value) {
    if (value === undefined || value === null || typeof (value) == 'function') {
        return;
    }
    if (typeof (value) == 'object') {
        if (value instanceof Promise)
            return;
        return librespone.json(req, res, value);
    }
    return librespone.error(req, res, value);
}

function process(req, res, callback, queue) {
    try {
        if (!queue) {
            return callback(req, res)
                .then((value) => {
                    responeValue(req, res, value);
                })
                .catch((error) => {
                    return librespone.error(req, res, error);
                })
        }

        return taskqueue.push(req.start, () => callback(req, res))
            .then((value) => {
                responeValue(req, res, value);
            })
            .catch((error) => {
                return librespone.error(req, res, error);
            }).finally(req.start,()=>{

            });
    } catch (error) {
        return librespone.error(req, res, error);
    }
}

class Router {
    constructor(router) {
        this.router = router;
    }

    get(url, callback, queue) {
        queue == queue || false;
        this.router.get(url, (req, res) => {
            process(req, res, callback, queue);
        });
    }
    post(url, callback, queue) {
        queue = queue || true;
        this.router.post(url, (req, res) => {
            process(req, res, callback, queue);
        });
    }
    put(url, callback, queue) {
        queue = queue || true;
        this.router.put(url, (req, res) => {
            process(req, res, callback, queue);
        });
    }
    delete(url, callback, queue) {
        queue = queue || true;
        this.router.delete(url, (req, res) => {
            process(req, res, callback, queue);
        });
    }
};

module.exports = {
    Router: function () {
        return new Router(require('express').Router());
    }
};