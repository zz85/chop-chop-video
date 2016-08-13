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

const THRESHOLD = 0.01; // lower is more sensitive... 0.0005 0.001 | 0.01 for absed.
let slider = getSlider(callback);

const seek = 1 / 4; // 1 / 4; // sample interval of quarter second
// 0.25 1/24 1/29.97 30



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
	window.r = results;

	const { map_keys, map_values } = results;
	console.log('motion completed!!');


	let selections = []
	let currentSelection = {
		start: 0,
		blanks: 0
	}

	for (let i = 0; i < map_values.length; i++ ) {
		ts = map_keys[i]
		value = map_values[i];

		if (value > THRESHOLD) {
			console.log('1')
			// there is motion, so do nothing
			currentSelection.blanks = 0;

			// with the exception of the last item
			if (i === map_values.length - 1) {
				currentSelection.end = ts
				selections.push(currentSelection)
			}
		} else {
			// no more motion, we end the previous selection if there is one, then place marker here
			console.log('0')

			currentSelection.blanks++;

			if (currentSelection.blanks > 3) {
				// confidence that there's no motion...
				currentSelection.end = map_keys[i - currentSelection.blanks]

				if ((currentSelection.end - currentSelection.start) > seek) {

					selections.push(currentSelection)
					currentSelection = {blanks: 0, start: ts}
				}

				// move the slider (in history)
				currentSelection.start = map_keys[i - currentSelection.blanks]
			}
		}
	}

	console.log('selections', selections)
	window.s = selections;
})



// video.currentTime
// video.play()
// video.pause()
// video.playbackRate
// video.duration

// https://www.w3.org/2010/05/video/mediaevents.html
// https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges

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