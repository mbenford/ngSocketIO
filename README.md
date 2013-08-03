# ngSocketIO

Simple Socket.IO module for AngularJS

## Requirements

 - AngularJS 1.0.5+
 - Socket.IO 0.9.16

## Installing

Simply download the `ng-socket-io.js` file and add it to your web application. Just make sure it's included after the AngularJS script.

## Usage

 1. Add the `socket-io` module as a dependency in your AngularJS app;
 2. Inject the `socket` factory wherever you need to use Socket.IO;
 3. You're done!

## Example

    <script src="angular.js"></script>
    <script src="ng-socket-io.js"></script>
    <script>
        var myApp = angular.module('myApp', ['socket-io']);
        myApp.controller('MyCtrl', function($scope, socket) {
            // Listening to an event
            socket.on('someEvent', function(data) {
                $scope.data = data;
            });

            // Raising an event
            $scope.raise = function(message) {            
                socket.emit('otherEvent', message);
            };
        });
    </script>
    
## Cancelling a subscription automatically on scope destruction

If you want to unsubscribe from an event automatically on scope destruction, just pass the current scope to `on` method:

    socket.on('someEvent', $scope, function(data) { 
    ... 
    });