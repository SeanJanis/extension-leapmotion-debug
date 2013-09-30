/**
 * Wrapper class for handling Leap Motion events and
 * updating the AngularJS UI.
 *
 * Drawing code based on Isaac Cohen's tutorial: [http://js.leapmotion.com/tutorials/welcome]
 *
 * @author Sean Janis (spjanis@gmail.com)
 */

//
// Device Constants
//
var LM_DEVICE_CONNECTED = "lm_connected";
var LM_DEVICE_DISCONNECTED = "lm_disconnected";

//
// Handlers for Leap Motion event callbacks.
//
function LeapMotionHandler(params) {
    this._lm = params.controller ? params.controller : null;
    this._scope = params.scope ? params.scope : null;
    this._canvas = params.canvas ? params.canvas : null;
    this._context = params.context ? params.context : null;

    // FPS tracker
    this._lastTime = new Date;
    this._timeElapsed = 0;
    this._frameCount = 0;
}

LeapMotionHandler.prototype = {
    //
    // Register event listeners on the Leap Motion controllers
    //
    subscribeListeners: function() {
        if (!this._lm) {
            return;
        }

        this.resetUIData();
        this._lm.on('ready', this.onReady.bind(this));
        this._lm.on('connect', this.onConnected.bind(this));
        this._lm.on('deviceConnected', this.onDeviceConnected.bind(this));
        this._lm.on('deviceDisconnected', this.onDeviceDisconnected.bind(this));
        this._lm.on('frame', this.onFrame.bind(this)); // Defaults to animation frame.
        this._lm.connect();
    },

    //
    // Connection callbacks
    //
    onReady: function() {
        this.updateDeviceStatusUI(LM_DEVICE_CONNECTED);
    },

    onConnected: function() {
        this.updateDeviceStatusUI(LM_DEVICE_DISCONNECTED);
    },

    onDeviceConnected: function() {
        this.updateDeviceStatusUI(LM_DEVICE_CONNECTED);
    },

    onDeviceDisconnected: function() {
        this.updateDeviceStatusUI(LM_DEVICE_DISCONNECTED);
        this.resetUIData();
    },

    //
    // Raw frame updates from Leap Motion device (JSON-based frame)
    //
    onFrame: function(frame) {
        this.updateLiveStats(frame);
        this.drawLiveTracking(frame);
        this._scope.$apply();
    },

    //
    // Resets all UI data to their original values
    //
    resetUIData: function() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._scope.lm_fps = 0;
        this._scope.lm_numHands = 0;
        this._scope.lm_numFingers = 0;
        this._scope.$apply();
    },

    //
    // Given a Leap Motion JSON-based frame, updates the live
    // tracking data such as number of fingers, hands, etc.
    //
    updateLiveStats: function(frame) {
        var nowTime = new Date;
        this._timeElapsed += (nowTime - this._lastTime);
        this._lastTime = nowTime;
        this._frameCount++;

        // Compute FPS, once per second
        if (this._timeElapsed >= 1000 && this._frameCount > 0) {
            this._scope.lm_fps = this._frameCount;
            this._timeElapsed = 0;
            this._frameCount = 0;
        }

        this._scope.lm_numHands = frame.hands.length.toString();
        this._scope.lm_numFingers = frame.fingers.length.toString();
    },

    //
    // Takes a raw JSON-based Leap Motion frame and draws hand
    // and finger information.
    //
    drawLiveTracking: function(frame) {
        var hand;
        var finger;
        var handScreenPos;
        var fingerScreenPos;

        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
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

    //
    // Helper method for drawing the user's hand
    // Parameters are based on screen coordinates.
    //
    drawHand: function(handCoords) {
        // Setting up the style for the fill
        this._context.fillStyle = "#FF5A40";

        // Draw a circle
        this._context.beginPath();
        this._context.arc(handCoords[0], handCoords[1], 10, 0, Math.PI*2);
        this._context.closePath();
        this._context.fill();
    },

    //
    // Helper method for drawing the user's fingers.
    // Parameters are based on screen coordinates.
    //
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
        this._context.lineWidth = 2;
        this._context.beginPath();
        this._context.arc(fingerCoords[0], fingerCoords[1], 5, 0, Math.PI*2);
        this._context.closePath();
        this._context.stroke();
    },

    //
    // Converts a 3D scene coordinate into 2D coordinate
    // space by normalizing the 3D coordinate based on the
    // the HTML canvas bounds.
    //
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

    //
    // Updates the device's main connection status.
    //
    updateDeviceStatusUI: function(statusType) {
        var statusText, statusCssClass;

        switch(statusType) {
            case LM_DEVICE_CONNECTED:
                statusText = "Connected";
                statusCssClass = "dynamic-device-status";
            break;

            default:
                statusText = "Disconnected";
                statusCssClass = "dynamic-device-status-inactive";
            break;
        }

        this._scope.deviceStatusColor = statusCssClass;
        this._scope.lm_DeviceStatus = statusText;
        this._scope.$apply();
    }
};
