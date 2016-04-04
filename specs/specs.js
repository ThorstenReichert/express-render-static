var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');

var renderStatic = require('../index');
var directory = '/dir';
var config = {};
var locals = {test: 'teststring'};
var mw = null;

/**
 * Mocks
 */

var req = {};
req.method = null;
req.path = null;
var res = {};
res.render = null;
var next = null;

/**
 * Helper functions
 */

function testArray(array) {
    array.forEach(function (item) {
        it(item, function () {
            req.path = item;
        });
    });
}

function testExtension(ext, array) {
    var extText = 'default';
    if (ext !== '') {
        extText = ext;
    }

    describe(extText + ' extension and', function () {

        beforeEach(function () {

            config = {extension: ext};
            if (ext !== '') {
                mw = renderStatic(directory, config);
            } else {
                mw = renderStatic(directory);
            }

        });

        testArray(array);

    });
}

describe('renderStatic', function () {

    it('should be {function}', function () {
        expect(renderStatic).to.be.a('function');
    });

    it('should return {function}', function () {
        expect(renderStatic(directory, config)).to.be.a('function');
    });

    it('should require directory', function () {
        expect(renderStatic.bind()).to.throw(Error);
    });

    it('should require {string} as directory', function () {
        expect(renderStatic.bind(null)).to.throw(TypeError);
        expect(renderStatic.bind(1)).to.throw(TypeError);
        expect(renderStatic.bind({test: 1})).to.throw(TypeError);
        expect(renderStatic.bind(function () {})).to.throw(TypeError);
    });

});

describe('middleware function', function () {

    beforeEach(function () {
        directory = '/dir';
        config = {
            locals: locals
        };

        mw = renderStatic(directory, config);

        res.render = sinon.spy();
        next = sinon.spy();
    });

    it('should call render with (<directory> + <path>) and locals', function () {
        req.path = 'file.jade';
        req.method = 'GET';
        mw(req, res, next);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith(path.join(directory, req.path), locals)).to.be.true;
    });

    it('should call next for req.method POST', function () {
        req.path = 'file.jade';
        req.method = 'POST';
        mw(req, res, next);
        expect(res.render.called).to.be.false;
        expect(next.calledOnce).to.be.true;
    });

    it('should call next for req.method PUT', function () {
        req.path = 'file.jade';
        req.method = 'PUT';
        mw(req, res, next);
        expect(res.render.called).to.be.false;
        expect(next.calledOnce).to.be.true;
    });

    it('should call next for req.method PATCH', function () {
        req.path = 'file.jade';
        req.method = 'PATCH';
        mw(req, res, next);
        expect(res.render.called).to.be.false;
        expect(next.calledOnce).to.be.true;
    });

    it('should call next for req.method DELETE', function () {
        req.path = 'file.jade';
        req.method = 'DELETE';
        mw(req, res, next);
        expect(res.render.called).to.be.false;
        expect(next.calledOnce).to.be.true;
    });

    describe('should pass heuristics:', function () {

        beforeEach(function () {
            req.method = 'GET';
        });

        describe('call res.render once and do not call next for', function () {

            testExtension('', [
                'file.jade',
                '/file.jade',
                'users/file.jade',
                '/users/file.jade',
                '/some/ridiculously/long/path/name/file.jade'
            ]);

            testExtension('jade', [
                'file.jade',
                '/file.jade',
                'users/file.jade',
                '/users/file.jade',
                '/some/ridiculously/long/path/name/file.jade'
            ]);

            testExtension('.jade', [
                'file.jade',
                '/file.jade',
                'users/file.jade',
                '/users/file.jade',
                '/some/ridiculously/long/path/name/file.jade'
            ]);

            testExtension('html', [
                'file.html',
                '/file.html',
                'users/file.html',
                '/users/file.html',
                '/some/ridiculously/long/path/name/file.html'
            ]);

            testExtension('.html', [
                'file.html',
                '/file.html',
                'users/file.html',
                '/users/file.html',
                '/some/ridiculously/long/path/name/file.html'
            ]);

            afterEach(function () {
                mw(req, res, next);
                expect(res.render.calledOnce).to.be.true;
                expect(next.called).to.be.false;
            });

        });

        describe('call next once and do not call res.render for', function () {

            testExtension('', [
                '',
                '/',
                'file.txt',
                'file.html',
                'filejade',
                'file.ade',
                'file.jad',
                'file.',
                '/users',
                '/users/file.txt',
                '/users/filejade',
                '/users/file.ade',
                '/users/file.jad',
                '/users/settings/default',
                'file.html',
                '/file.html',
                'users/file.html',
                '/users/file.html',
                '/some/ridiculously/long/path/name/file.html'
            ]);

            testExtension('jade', [
                '',
                '/',
                'file.txt',
                'file.html',
                'filejade',
                'file.ade',
                'file.jad',
                'file.',
                '/users',
                '/users/file.txt',
                '/users/filejade',
                '/users/file.ade',
                '/users/file.jad',
                '/users/settings/default',
                'file.html',
                '/file.html',
                'users/file.html',
                '/users/file.html',
                '/some/ridiculously/long/path/name/file.html'
            ]);

            testExtension('.jade', [
                '',
                '/',
                'file.txt',
                'file.html',
                'filejade',
                'file.ade',
                'file.jad',
                'file.',
                '/users',
                '/users/file.txt',
                '/users/filejade',
                '/users/file.ade',
                '/users/file.jad',
                '/users/settings/default',
                'file.html',
                '/file.html',
                'users/file.html',
                '/users/file.html',
                '/some/ridiculously/long/path/name/file.html'
            ]);

            testExtension('html', [
                '',
                '/',
                'file.txt',
                'file.jade',
                'filehtml',
                'file.tml',
                'file.htm',
                'file.',
                '/users',
                '/users/file.txt',
                '/users/filehtml',
                '/users/file.tml',
                '/users/file.htm',
                '/users/settings/default',
                'file.jade',
                '/file.jade',
                'users/file.jade',
                '/users/file.jade',
                '/some/ridiculously/long/path/name/file.jade'
            ]);

            testExtension('.html', [
                '',
                '/',
                'file.txt',
                'file.jade',
                'filehtml',
                'file.tml',
                'file.htm',
                'file.',
                '/users',
                '/users/file.txt',
                '/users/filehtml',
                '/users/file.tml',
                '/users/file.htm',
                '/users/settings/default',
                'file.jade',
                '/file.jade',
                'users/file.jade',
                '/users/file.jade',
                '/some/ridiculously/long/path/name/file.jade'
            ]);

            afterEach(function () {
                mw(req, res, next);
                expect(res.render.called).to.be.false;
                expect(next.calledOnce).to.be.true;
            });

        });

    });

});
