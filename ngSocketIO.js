'use strict';

angular.module('ngSocketIO', []).factory('socket', function($rootScope) {
    var socket = io.connect();

    var angularCallback = function(callback) {
        return function() {
            if (callback) {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            }
        }
    };

    var addListener = function(name, callback) {
        socket.addListener(name, angularCallback(callback));
    };

    var addListenerOnce = function(name, callback) {
        socket.once(name, angularCallback(callback));
    };

    var removeListener = function(name, callback) {
        socket.removeListener(name, angularCallback(callback));
    };

    var removeAllListeners = function(name) {
        socket.removeAllListeners(name);
    };

    var emit = function(name, data, callback) {
        socket.emit(name, data, angularCallback(callback));
    };

    return {
        addListener: addListener,
        on: addListener,
        once: addListenerOnce,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,
        emit: emit
    };
});