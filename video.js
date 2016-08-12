/*
 * Motion Meter
 *
 * Joshua Koo
 * 13 Aug 2016
 * This experiment detects which portions of the video has more / less motion by sampling / comparing frames.
 *
 * Basically use a simple convert to grayscale, compared intensity of last frame buffer.
 * This should be relatively simple / fast. Take sum of abs / squared difference
 *
 * Visualize the difference either with colour coding (sined red <-> blue / graph magnitude),
 * and place a threshold and show segments with or without motions.
 *
 * This might be useful for simple scene detection / marking / cutting, or simply to do auto
 * non motion trimming.
 *
 * Complicated CV techniques / object recognizition may not be required at this point.
 */


video = document.querySelector('video')
// video.currentTime
// video.play()
// video.pause()
// video.playbackRate
// video.duration

// https://www.w3.org/2010/05/video/mediaevents.html
// for (v in video) console.log(v)

video.addEventListener('loadedmetadata', function() {
	console.log('loadedmetadata', video.duration);
});

video.addEventListener('durationchange', function() {
	// do something with total time here.
	// console.log('durationchange', video.duration);
});

video.addEventListener('canplaythrough', function() {
	// let start processing!
	video.play();
	canvas = document.createElement('canvas');
	canvas.width = video.videoWidth; // do resizing?
	canvas.height = video.videoHeight; //

	console.log(canvas.width, canvas.height);

	ctx = canvas.getContext('2d');
});

let lastTime = 0;

video.addEventListener('timeupdate', function() {
	const now = video.currentTime;

	if (lastTime !== now) {
		console.log('time', video.currentTime, now - lastTime);
		lastTime = now;
		// video.pause();
		processFrame();
	} else {
		console.log('same!');
	}
});

function processFrame() {
	// video.play();
	let seek = 1;
	if (video.currentTime + seek > video.duration) {
		return;
	}
	video.currentTime += seek;
}


/*
props

width
height
videoWidth
videoHeight
poster
src
currentSrc
crossOrigin
networkState
preload
buffered
readyState
seeking
currentTime
duration
paused
defaultPlaybackRate
playbackRate
played
seekable
ended
autoplay
loop
controls
volume
muted
defaultMuted
textTracks
webkitAudioDecodedByteCount
webkitVideoDecodedByteCount
load
canPlayType
play
pause
addTextTrack
mediaKeys
onencrypted
disableRemotePlayback
srcObject
setMediaKeys
sinkId
*/

/*

on currentTime update,
seeking
timeupdate
seeked
canplay
canplaythrough
timeupdate

*/
video_events = [
	'loadstart',
	'waiting',
	'canplay',
	'canplaythrough',
	'playing',
	'ended',
	'seeking',
	'seeked',
	'play',
	'firstplay',
	'pause',
	'progress',
	'durationchange',
	'fullscreenchange',
	'error',
	'suspend',
	'abort',
	'emptied',
	'stalled',
	'loadedmetadata',
	'loadeddata',
	'timeupdate',
	'ratechange',
	'volumechange',
	'texttrackchange',
	'loadedmetadata',
	'posterchange',
	'textdata',
];

// video_events.forEach( name => {
// 	video.addEventListener(name, e => console.log(name, e))
// } )