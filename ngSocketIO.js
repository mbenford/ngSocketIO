'use strict';

angular.module('ngSocketIO', []).factory('socket', function($rootScope) {
    var socket = io.connect();

    var on = function(name, callback) {
        socket.addListener(name, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    };

    var off = function(name, callback) {
        socket.removeListener(name, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    };

    var emit = function(name, data, callback) {
        socket.emit(name, data, function () {
            if (callback) {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
        })
    };

    return {
        on: on,
        addListener: on,
        off: off,
        removeListener: off,
        emit: emit
    };
});