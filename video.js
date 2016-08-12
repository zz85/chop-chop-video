video = document.querySelector('video')
// video.currentTime
// video.play()
// video.pause()
// video.playbackRate
// video.duration
// http://www.html5rocks.com/en/tutorials/video/basics/
// https://www.w3.org/2010/05/video/mediaevents.html

video.addEventListener('loadedmetadata', function() {
	console.log('loadedmetadata', video.duration);
});

video.addEventListener('durationchange', function() {
	console.log('durationchange', video.duration);
});


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

video_events.forEach( name => {
	video.addEventListener(name, e => console.log(name, e))
} )