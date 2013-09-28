//
// Handlers for Leap Motion event callbacks.
//
function LeapMotionHandler(params) {
    this._lm = params.controller ? params.controller : null;
    this._scope = params.scope ? params.scope : null;
    this._canvas = params.canvas ? params.canvas : null;
    this._context = params.context ? params.context : null;
}

LeapMotionHandler.prototype = {
    //
    // Register event listeners on the Leap Motion controllers
    //
    subscribeListeners: function() {
        if (!this._lm) {
            return;
        }

        this._lm.on('ready', this.onReady.bind(this));
        this._lm.on('connect', this.onConnected.bind(this));
        this._lm.on('deviceConnected', this.onDeviceConnected.bind(this));
        this._lm.on('deviceDisconnected', this.onDeviceDisconnected.bind(this));
        this._lm.on('frame', this.onFrame.bind(this)); // Defaults to animation frame.
        this._lm.connect();
    },

    onReady: function() {
        this.updateStatusUI("Ready");
    },

    onConnected: function() {
        this.updateStatusUI("Connected");
    },

    onDeviceConnected: function() {
        this.updateStatusUI("Device Connected");
    },

    onDeviceDisconnected: function() {
        this.updateStatusUI("Device Disconnected");
    },

    onFrame: function(frame) {
        var numFingers = frame.fingers.length;
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        //this.updateFingersUI(numFingers.toString());
        this.processInput(frame);
    },

    processInput: function(frame) {
        var hand;
        var finger;
        var handScreenPos;
        var fingerScreenPos;
        for (var i = 0; i < frame.hands.length; i++) {
            hand = frame.hands[i];
            handScreenPos = this.leapToSceneCoords(frame, hand.palmPosition);
            this.drawHand(handScreenPos);

            for (var j = 0; j < hand.fingers.length; j++) {
                finger = hand.fingers[j];
                fingerScreenPos = this.leapToSceneCoords(frame, finger.tipPosition);
                this.drawFinger(fingerScreenPos, handScreenPos);
            }
        }
    },

    drawHand: function(handCoords) {
        // Setting up the style for the fill
        this._context.fillStyle = "#FF5A40";

        // Draw a circle
        this._context.beginPath();
        this._context.arc(handCoords[0], handCoords[1], 40, 0, Math.PI*2);
        this._context.closePath();
        this._context.fill();
    },

    drawFinger: function(fingerCoords, handCoords) {
        // Setting up the style for the stroke
        this._context.strokeStyle = "#FFA040";
        this._context.lineWidth = 3;

        // Drawing the path
        this._context.beginPath();

        // Move to the hand position
        this._context.moveTo(handCoords[0], handCoords[1]);

        // Draw a line to the finger position
        this._context.lineTo(fingerCoords[0], fingerCoords[1]);

        this._context.closePath();
        this._context.stroke();

        // Draw finger tip
        this._context.strokeStyle = "#39AECF";
        this._context.lineWidth = 5;
        this._context.beginPath();
        this._context.arc(fingerCoords[0], fingerCoords[1], 20, 0, Math.PI*2);
        this._context.closePath();
        this._context.stroke();
    },

    leapToSceneCoords: function(frame, leapPos) {
        //
        var iBox = frame.interactionBox;
        var left = iBox.center[0] - iBox.size[0]/2; // x-axis, upper left
        var top = iBox.center[1] + iBox.size[1]/2;  // y-axis, upper top

        var x = leapPos[0] - left;
        var y = leapPos[1] - top;

        // Ensure x and y are scaled to entire canvas dimensions (normalize)
        x /= iBox.size[0];
        y /= iBox.size[1];

        x *= this._canvas.width;
        y *= this._canvas.height;

        return [x, -y];
    },

    updateStatusUI: function(statusText) {
        console.log("status: " + statusText);
        this._scope.lmDeviceStatus = statusText;
        this._scope.$apply();
    },

    updateFingersUI: function(dataText) {
        this._scope.lmNumFingers = dataText;
        this._scope.$apply();

        // Draw to canvas
        this._context.textAlign = 'center';
        this._context.textBaseline = 'middle';
        this._context.fillText(dataText, this._canvas.width/2, this._canvas.height/2);
    }
};
