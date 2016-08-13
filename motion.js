/* Motion Cutter */

function MotionCutter(video) {
	// TODO PARAMETERS
	// add theshold?
	// sampling

	let processStarted = false;

	let ctx, canvas, greyscale
	let width, height, pixels
	let lastTime = 0;
	let completed

	let map_keys = [], map_values = []
	let self = this;

	this.process = (c) => {
		video.addEventListener('canplaythrough', activate);
		video.addEventListener('timeupdate', onTimeUpdate);
		completed = c
	}

	function onTimeUpdate() {
		const now = video.currentTime;

		if (lastTime !== now) {
			// console.log('time', video.currentTime, now - lastTime);
			lastTime = now;
			// video.pause();
			processFrame(video);
		} else {
			// console.log('same!');
		}
	}

	function activate() {

		if (processStarted) return;
		// let start processing!

		canvas = document.createElement('canvas');
		width = canvas.width = video.videoWidth / 2 | 0; // do resizing?
		height = canvas.height = video.videoHeight  / 2 | 0; //
		greyscale = new Float32Array( width * height );
		frameBuffer = new Float32Array( width * height ).fill(0);

		pixels = width * height;

		console.log(canvas.width, canvas.height);

		ctx = canvas.getContext('2d');
		processStarted = true;

		document.body.appendChild(canvas);

		// video.play();
		processFrame();
	}

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
		}

		return greyscale;
	}


	function processFrame() {

		// ctx.clearRect(0, 0, width, height);
		ctx.drawImage( video, 0, 0, width, height );
		idata = ctx.getImageData( 0, 0, width, height );


		greyscaleImage(idata, greyscale);

		// do ping pong later

		let summed = 0


		// conversion to greyscale

		for ( let i = 0; i < pixels; i++ ) {
			const diff = greyscale[ i ] - frameBuffer[ i ];
			summed += diff * diff;
		}

		// for ( let i = 0; i < pixels; i++ ) {
		// 	frameBuffer[i] = greyscale[ i ];
		// }

		frameBuffer.set(greyscale);

		const score = summed / pixels;

		map_keys.push(video.currentTime);
		map_values.push(score);

		if (score > 0.0005) {
			// 0.001
			// console.log('diff', video.currentTime, score * 100);
		}

		// emit progress
		self.onProgress(
		{
			keys: map_keys,
			values: map_values
		})



		let seek = 1; // 1 / 4; // sample interval of quarter second
		// 0.25 1/24 1/29.97 30

		if (video.currentTime + seek > video.duration) {
			// DONE!
			video.removeEventListener('canplaythrough', activate);
			video.removeEventListener('timeupdate', onTimeUpdate);

			completed({
				map_keys,
				map_values
			});
			return;
		}
		video.currentTime += seek;
	}
}
