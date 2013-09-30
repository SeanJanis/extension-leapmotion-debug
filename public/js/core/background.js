/**
 * Background task for monitoring Leap Motion connections and
 * updating the Chrome Extension icon.
 *
 * @author Sean Janis
 */

//
// Icons for Chrome Extension / Device connection updates.
//
var ICON_DEVICE_ACTIVE = "/public/img/icon19.png";
var ICON_DEVICE_INACTIVE = "/public/img/icon19_inactive.png";

//
// Leap Motion connection callbacks
//
var lm = new Leap.Controller();
lm.on('ready', onReady);
lm.on('connect', onConnected);
lm.on('deviceConnected', onDeviceConnected);
lm.on('deviceDisconnected', onDeviceDisconnected);
lm.connect();

//
// Leap Motion device callbacks for updating status icon.
//
function onReady() {
    chrome.browserAction.setIcon({path: ICON_DEVICE_ACTIVE});
}

function onConnected() {
    chrome.browserAction.setIcon({path: ICON_DEVICE_INACTIVE});
}

function onDeviceConnected() {
    chrome.browserAction.setIcon({path: ICON_DEVICE_ACTIVE});
}

function onDeviceDisconnected() {
    chrome.browserAction.setIcon({path: ICON_DEVICE_INACTIVE});
}