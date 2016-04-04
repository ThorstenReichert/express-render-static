'use strict';

/**
 * Module dependencies
 * @private
 */

var path = require('path');

/**
 * Module exports
 * @public
 */

module.exports = renderStatic;

/**
 * @param {string} directory
 * @param {object} config
 * @return {function}
 * @public
 */

function renderStatic(directory, config) {
    config = config || {};

    if (!directory) {
        throw new TypeError('directory required');
    }

    if (typeof directory !== 'string') {
        throw new TypeError('directory required to be of type string');
    }

    // file extension to render
    var extension = config.extension || 'jade';
    if (extension.substr(0,1) !== '.') {
        extension = '.' + extension;
    }

    // view model
    var locals = config.locals || {};

    return function (req, res, next) {
        if (req.method !== 'GET') {
            return next();
        }

        if (req.path.substr(req.path.length - extension.length) === extension) {
            var file = path.join(directory, req.path);
            res.render(file, locals);
        } else {
            return next();
        }
    };
}
