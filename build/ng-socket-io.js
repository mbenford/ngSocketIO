(function() {
'use strict';

angular.module('socket-io', []);

angular.module('socket-io').factory('socket', ["$rootScope","io", function($rootScope, io) {
    var socket = io.connect();
    var events = {};

    var addCallback = function(name, callback) {
        var event = events[name],
            wrappedCallback = wrapCallback(callback);

        if (!event) {
            event = events[name] = [];
        }

        event.push({ callback: callback, wrapper: wrappedCallback });
        return wrappedCallback;
    };

    var removeCallback = function(name, callback) {
        var event = events[name],
            wrappedCallback;

        if (event) {
            for(var i = event.length - 1; i >= 0; i--) {
                if (event[i].callback === callback) {
                    wrappedCallback = event[i].wrapper;
                    event.slice(i, 1);
                    break;
                }
            }
        }
        return wrappedCallback;
    };

    var removeAllCallbacks = function(name) {
        delete events[name];
    };

    var wrapCallback = function(callback) {
        var wrappedCallback = angular.noop;

        if (callback) {
            wrappedCallback = function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            };
        }
        return wrappedCallback;
    };

    var listener = function(name, callback) {
        return {
            bindTo: function(scope) {
                if (scope != null) {
                    scope.$on('$destroy', function() {
                        removeListener(name, callback);
                    });
                }
            }
        };
    };

    var addListener = function(name, callback) {
        socket.addListener(name, addCallback(name, callback));
        return listener(name, callback);
    };

    var addListenerOnce = function(name, callback) {
        socket.once(name, addCallback(name, callback));
        return listener(name, callback);
    };

    var removeListener = function(name, callback) {
        socket.removeListener(name, removeCallback(name, callback));
    };

    var removeAllListeners = function(name) {
        socket.removeAllListeners(name);
        removeAllCallbacks(name);
    };

    var emit = function(name, data, callback) {
        if (callback) {
            socket.emit(name, data, wrapCallback(callback));
        }
        else {
            socket.emit(name, data);
        }
    };

    return {
        addListener: addListener,
        on: addListener,
        once: addListenerOnce,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,
        emit: emit
    };
}]);

angular.module('socket-io').factory('io', function() {
    return io;
});

}());