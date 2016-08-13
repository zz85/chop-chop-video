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

let slider = getSlider(callback);

function callback(action, values) {
	// Actions
	if (action == 'move') {
		video.currentTime = values * video.duration;
	}
}

video = document.querySelector('video');
motion = new MotionCutter(video);

let lastValues

motion.onProgress = function(values) {
	lastValues = values
}

video.addEventListener('timeupdate', () => {
	slider.data({
		currentTime: video.currentTime,
		duration: video.duration,
		map: lastValues
	});
})

motion.process(function(results) {
	console.log('motion completed!!');
})



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