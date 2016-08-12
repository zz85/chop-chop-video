'use strict';

// create a canvas slider with notation / visualizations

function getSlider(controller) {


	// declare stuff

	const PADDING = 10
	const WIDTH = 400
	const HEIGHT = 50


	const canvas = document.createElement('canvas')
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	const ctx = canvas.getContext('2d')

	document.body.appendChild(canvas);

	// canvas.style.background = 'red';

	canvas.addEventListener('mouseover', e => {

	})

	canvas.addEventListener('mousedown', e => {
		controller('move', (e.offsetX - PADDING) / (WIDTH - 2 * PADDING))
	})

	function render(data) {

		const {
			currentTime,
			duration,
			map
		} = data || {};


		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		const scrollWidth = WIDTH - 2 * PADDING;
		const scrollHeight = HEIGHT - 2 * PADDING;
		const progress = currentTime / duration;


		// draw inner pane
		ctx.strokeRect(PADDING, PADDING, scrollWidth, scrollHeight);

		ctx.strokeRect(PADDING + progress * scrollWidth, PADDING, 1, scrollHeight);

		const THRESHOLD = 0.0005;
		ctx.save();

		Object.keys(map || {}).forEach( k => {
			const v = map[k];

			if ( v < THRESHOLD ) {
				ctx.fillStyle = 'blue';
				ctx.fillRect(PADDING + (+k) / duration * scrollWidth, PADDING + scrollHeight * v / THRESHOLD, 1, 1);
			}
			else {
				ctx.fillStyle = '#3fe';
				ctx.fillRect(PADDING + (+k) / duration * scrollWidth, PADDING, 1, scrollHeight);
			}

		} )

		ctx.restore();

	}

	function data(d) {
		render(d);
	}


	render()

	return {
		data: data
	}

}




// x=pane[bg:red,border:something]

// component system?

// panel [x, y, w, h]
// rotation scale
// animation
// layer

// nested
// click, touch, pressed, down
//
