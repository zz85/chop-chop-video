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

// TODO refactor pixel process to separate class


let ctx, video, canvas, greyscale

let slider = getSlider(callback);


function callback(action, values) {
	if (action == 'move') {
		video.currentTime = values * video.duration;
	}
}

video = document.querySelector('video')

// video.addEventListener('loadedmetadata', function() {
// 	console.log('loadedmetadata', video.duration);
// });

video.addEventListener('durationchange', function() {
	// do something with total time here.
	// console.log('durationchange', video.duration);
});

let processStarted = false;
let map = {};

video.addEventListener('canplaythrough', function() {
	// let start processing!

	if (!processStarted) {
		canvas = document.createElement('canvas');
		width = canvas.width = video.videoWidth / 2 | 0; // do resizing?
		height = canvas.height = video.videoHeight  / 2 | 0; //
		greyscale = new Float32Array( width * height );
		frameBuffer = new Float32Array( width * height ).fill(0);

		console.log(canvas.width, canvas.height);

		ctx = canvas.getContext('2d');
		processStarted = true;

		document.body.appendChild(canvas);

		// video.play();
		processFrame();
	}
});

let lastTime = 0;

function greyscaleImage( idata, greyscale ) {

	let data = idata.data;
	let pixels = idata.width * idata.height;

	// conversion to greyscale

	for ( let i = 0; i < pixels; i++ ) {
		let ref = i * 4;
		let r = data[ ref + 0 ] / 255;
		let g = data[ ref + 1 ] / 255;
		let b = data[ ref + 2 ] / 255;

		greyscale[ i ] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		// greyscale[ i ] = (r + g + b) / 3;
	}

	return greyscale;
}


video.addEventListener('timeupdate', function() {
	const now = video.currentTime;

	if (lastTime !== now) {
		// console.log('time', video.currentTime, now - lastTime);
		lastTime = now;
		// video.pause();
		processFrame();
	} else {
		// console.log('same!');
	}
});

function processFrame() {

	// ctx.clearRect(0, 0, width, height);
	ctx.drawImage( video, 0, 0, width, height );
	idata = ctx.getImageData( 0, 0, width, height );


	greyscaleImage(idata, greyscale);

	// do ping pong later

	let summed = 0
	let pixels = width * height;

	// conversion to greyscale

	for ( let i = 0; i < pixels; i++ ) {
		const diff = greyscale[ i ] - frameBuffer[ i ];
		summed += diff * diff;
	}



	for ( let i = 0; i < pixels; i++ ) {
		frameBuffer[i] = greyscale[ i ];
	}

	// frameBuffer.set(greyscale);

	const score = summed / pixels;
	map[ video.currentTime ] = score;
	if (score > 0.0005) // 0.001
	console.log('diff', video.currentTime, score * 100);

	slider.data({
		currentTime: video.currentTime,
		duration: video.duration,
		map
	});

	// TODO plot the scores

	// video.play();
	let seek = 1 / 4; // sample interval of quarter second
	// 0.25 1/24 1/29.97 30

	if (video.currentTime + seek > video.duration) {
		return;
	}
	video.currentTime += seek;
}


// video.currentTime
// video.play()
// video.pause()
// video.playbackRate
// video.duration

// https://www.w3.org/2010/05/video/mediaevents.html
// for (v in video) console.log(v)


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