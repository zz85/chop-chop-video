require('ffmpeg-splice')({

	input: 'manuals 9 Aug/a.mp4',
	splices: [
		// {
		// 	start: 10 * 1000,
		// 	duration: 10 * 1000,
		// },{
		// 	start: 30 * 1000,
		// 	duration: 5 * 1000,
		// }

		{
  "start": 0,
  "end": 2000,
  "duration": 2000
 },
 {
  "start": 10750,
  "end": 13500,
  "duration": 2750
 },
 {
  "start": 22250,
  "end": 24000,
  "duration": 1750
 },
 {
  "start": 37250,
  "end": 39500,
  "duration": 2250
 },
 {
  "start": 49250,
  "end": 53000,
  "duration": 3750
 },
 {
  "start": 59750,
  "end": 62000,
  "duration": 2250
 },
 {
  "start": 71250,
  "end": 76000,
  "duration": 4750
 },
 {
  "start": 83750,
  "end": 85500,
  "duration": 1750
 },
 {
  "start": 90750,
  "end": 94017.59599999999,
  "duration": 3267.5959999999905
 }
	],
	output: 'spliced_video.mp4', // will be the concatenation
															 // of the specified segments.
	tmpFolder: '/tmp',

}, function(err) {

	if(err) console.log(err)
	else console.log('done')

})


// s.forEach( e => { e.start *= 1000; e.end *= 1000; e.duration = e.end - e.start } )

// sample:
// A) 1:33 / 17.8MB -> 24s / 4.1MB
