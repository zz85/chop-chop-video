class SlowFast {
}

const BG = '#2b2b2b';
const TXT_COLOR = '#aaa';
const MID_LINE = '#1b1b1b';
const SPACER = 5;
const BTN_COLOR = '#fefefe';
const CURVE_COLOR = '#ca0347'

/*
For more spline interpolation, see
1. CatMull
https://github.com/mrdoob/three.js/blob/dev/src/extras/curves/CatmullRomCurve3.js
https://github.com/mrdoob/three.js/blob/dev/src/extras/curves/SplineCurve.js
https://github.com/mrdoob/three.js/blob/dev/src/extras/CurveUtils.js
2. ATAN?
https://github.com/llun/slowfast/blob/master/lib/transitions.js
3. Bezier Curves https://github.com/zz85/flowlab/blob/2aefe6c17a3a1593168cc2e3b3ac579ad54d31ce/node.js#L64
4. Others http://bl.ocks.org/mbostock/4342190

My big guess from the behaviour of the app is this, they are using bezier curves.
Another possible approach is to use a ease-out-in tween between every points.
*/

class SlowFastUI {
    constructor(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.width = width;
        this.height = height;
        this.ctx = canvas.getContext('2d');

        document.body.appendChild(canvas);

        this.points = []; // list of {x, y} in floating points
        this.points.push({x: 0, y: 0});
        this.points.push({x: 0.25, y: 0.5}); // this.points.push({x: 0.25, y: 0});
        this.points.push({x: 0.75, y: -0.5}); // this.points.push({x: 0.75, y: 0});
        this.points.push({x: 1, y: 0});
    }

    render() {
        const { ctx, width, height, points } = this;

        // bg color of course
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, width, height);

        // center line
        ctx.strokeStyle = MID_LINE;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // label axis
        ctx.font = '10px Helvetica';
        ctx.fillStyle = TXT_COLOR;
        ctx.textBaseline = 'top';
        ctx.fillText('FAST', SPACER, SPACER);

        ctx.textBaseline = 'bottom';
        ctx.fillText('SLOW', SPACER, height - SPACER);

        const convertPointToCoords = (p) => ({
            x:  p.x * width,
            y: (p.y + 1) * 0.5 * height
        })

        ctx.strokeStyle = 'red';
        // render spline
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = convertPointToCoords(points[i]);
            const p1 = convertPointToCoords(points[i + 1]);

            const midx = p0.x * 0.5 + p1.x * 0.5;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);

            ctx.bezierCurveTo(
                midx, p0.y,
                midx, p1.y,
                p1.x, p1.y);

            // ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
        }

        // render points
        for (let i = 0; i < points.length; i++) {
            const { x, y } = points[i];
            ctx.fillStyle = BTN_COLOR;
            ctx.beginPath();
            ctx.arc(width * x, height * (1 + y) * 0.5, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}


function findClosestPoint() {
    for (let x = 0; x < width; x++) {
        // interpolate the points!
        const cx = x / width;
        let p0, p1;
        // assume points have been sorted
        for (let p = 0; p < points.length; p++) {
            let point = points[p];
            if (point.x <= cx) {
                p0 = point;
            }
            else if (point.x >= cx) {
                p1 = point;
                break;
            }
        }

        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 4;
    }
}

slowFast = new SlowFastUI(600, 300);
slowFast.render();