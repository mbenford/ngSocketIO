(function() {
'use strict';

angular.module('socket-io', []);

angular.module('socket-io').factory('socket', ["$rootScope","io", function($rootScope, io) {
    var socket = io.connect();
    var callbacks = {};

    var wrapCallback = function(callback) {
        var wrappedCallback = callbacks[callback];
        if (!wrappedCallback) {
            wrappedCallback = function() {
                if (callback) {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                }
            };
            callbacks[callback] = wrappedCallback;
        }
        return wrappedCallback;
    };

    var addListener = function(name, scope, callback) {
        if (arguments.length === 2) {
            scope = null;
            callback = arguments[1];
        }

        socket.addListener(name, wrapCallback(callback));

        if (scope != null) {
            scope.$on('$destroy', function() {
                removeListener(name, callback);
            });
        }
    };

    var addListenerOnce = function(name, callback) {
        socket.once(name, wrapCallback(callback));
    };

    var removeListener = function(name, callback) {
        socket.removeListener(name, wrapCallback(callback));
        delete callbacks[callback];
    };

    var removeAllListeners = function(name) {
        socket.removeAllListeners(name);
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