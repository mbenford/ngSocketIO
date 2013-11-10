(function() {
'use strict';

describe('socket-io module', function() {
    var $rootScope, io, socket, currentCallback, sut;

    beforeEach(function() {
        module('socket-io');

        socket = jasmine.createSpyObj('socket', ['addListener', 'once', 'removeListener', 'removeAllListeners', 'emit']);
        socket.addListener.andCallFake(function(name, callback) { currentCallback = callback; });
        socket.once = socket.addListener;
        socket.emit.andCallFake(function(name, data, callback) { currentCallback = callback; });

        io = jasmine.createSpyObj('io', ['connect']);
        io.connect.andReturn(socket);

        module(function($provide) {
            $provide.value('io', io);
        });

        inject(function(_$rootScope_, _socket_) {
            $rootScope = _$rootScope_;
            sut = _socket_;
        });

        spyOn($rootScope, '$digest');
    });

    describe('addListener method', function() {
        it('adds a listener to an event', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.addListener('event', callback);

            // Assert
            expect(socket.addListener).toHaveBeenCalledWith('event', jasmine.any(Function));
        });

        it('calls the callback and triggers a digest cycle', function() {
            // Arrange
            var callback = jasmine.createSpy();
            sut.addListener('foo', callback);

            // Act
            currentCallback('some data');

            // Assert
            expect(callback).toHaveBeenCalledWith('some data');
            expect($rootScope.$digest).toHaveBeenCalled();
        });

        it('binds a listener to the scope so it gets removed when the scope is destroyed', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.addListener('foo', callback).bindTo($rootScope);
            $rootScope.$broadcast('$destroy');
            $rootScope.$digest();

            // Assert
            expect(socket.removeListener).toHaveBeenCalledWith('foo', currentCallback);
        });

        it('ensures that on is just an alias for addListener', function() {
            expect(sut.on).toBe(sut.addListener);
        });
    });

    describe('once method', function() {
        it('adds a listener to an event that will trigger only once', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.once('event', callback);

            // Assert
            expect(socket.once).toHaveBeenCalledWith('event', jasmine.any(Function));
        });

        it('calls the callback and triggers a digest cycle', function() {
            // Arrange
            var callback = jasmine.createSpy();
            sut.once('foo', callback);

            // Act
            currentCallback('some data');

            // Assert
            expect(callback).toHaveBeenCalledWith('some data');
            expect($rootScope.$digest).toHaveBeenCalled();
        });

        it('binds a listener to the scope so it gets removed when the scope is destroyed', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.once('foo', callback).bindTo($rootScope);
            $rootScope.$broadcast('$destroy');
            $rootScope.$digest();

            // Assert
            expect(socket.removeListener).toHaveBeenCalledWith('foo', currentCallback);
        });
    });

    describe('removeListener method', function() {
        it('removes a listener previously added', function() {
            // Arrange
            var callback = jasmine.createSpy();
            sut.addListener('event', callback);

            // Act
            sut.removeListener('event', callback);

            // Assert
            expect(socket.removeListener).toHaveBeenCalledWith('event', currentCallback);
        });
    });

    describe('removeAllListeners method', function() {
        it('removes all listeners of an event', function() {
            // Act
            sut.removeAllListeners('event');

            // Assert
            expect(socket.removeAllListeners).toHaveBeenCalledWith('event');
        });
    });

    describe('emit method', function() {
        it('emits an event', function() {
            // Act
            sut.emit('event', 'some data');

            // Assert
            expect(socket.emit).toHaveBeenCalledWith('event', 'some data');
        });

        it('emits an event with an acknowledgement callback', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.emit('event', 'some data', callback);

            // Assert
            expect(socket.emit).toHaveBeenCalledWith('event', 'some data', jasmine.any(Function));
        });

        it('calls the acknowledgment callback and triggers a digest cycle', function() {
            // Arrange
            var callback = jasmine.createSpy();
            sut.emit('event', 'some data', callback);

            // Act
            currentCallback('some other data');

            // Assert
            expect(callback).toHaveBeenCalledWith('some other data');
            expect($rootScope.$digest).toHaveBeenCalled();
        });
    });
});

}());