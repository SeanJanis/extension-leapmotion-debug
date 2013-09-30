LeapDebug (Google Chrome extension) 
==============

Chrome extension for debugging the Leap Motion controller setup. Once installed, opens
an overlay with options to connect the Leap controller. The debug tool uses the [LeapJs](http://js.leapmotion.com/)
API to listen for animation frame updates and allows you to record incoming data for later
playback without the device connected.

Drawing code based on Isaac Cohen's tutorial: [http://js.leapmotion.com/tutorials/welcome](http://js.leapmotion.com/tutorials/welcome)

## Quick start

Start by reading the Chrome Extension tutorial: 
[Getting Started: Building a Chrome Extension](http://developer.chrome.com/extensions/getstarted.html)

To debug Chrome Extension:
- Navigate to: [chrome://extensions/](chrome://extensions/)
- Ensure the 'Developer Mode' checkbox is enabled
- Click 'Load unpacked extension...'
- Select the LeapDebug code directory and Google Chrome will automatically load the extension for testing.

## Helpful hints

This app was built using AngularJS, Bootstrap 3.0, Animate.css and LeapJs.

## Code Structure

- Front-end AngularJS controllers found under /public/js/angular/controllers/*
- Partial templates used to render views: /public/partials

## Extras
- Uses animate.css to create smooth transitions

## TODOs / Future Versions
- More granular output for Live Stats view (expand menus for showing 2d/3d coordinates)
- Better HTML canvas drawing for Live Hand & Finger Tracking
- End-to-end unit tests for leap_handler.js

## Authors

**Sean Janis**
+ [http://seanjanis.com](http://seanjanis.com)


## Copyright and license

MIT
