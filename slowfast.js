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

    convertPointToCoords(p) {
        const { width, height } = this;

        return {
            x:  p.x * width,
            y: (p.y + 1) * 0.5 * height
        }
    }

    convertCoordsToPoint(p) {
        const { width, height } = this;

        return {
            x: p.x / width,
            y: (p.y * 2 / height) - 1
        }
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


        ctx.strokeStyle = CURVE_COLOR;
        // render spline
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = this.convertPointToCoords(points[i]);
            const p1 = this.convertPointToCoords(points[i + 1]);

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
        if (!this.circles)
        this.circles = points.map((p) => new Circle(width * p.x, height * (1 + p.y) * 0.5, 10, p));

        this.circles.forEach(c => {
            ctx.fillStyle = BTN_COLOR;
            c.render(ctx);
            ctx.fill();
        });
    }
}


class Circle {
    constructor(x, y, r, tag) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.tag = tag;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    }

    onmove() {

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

class EHandler {
    constructor() {
        this.handles = {};
    }

    bind(k, f) {
        this.handles[k] = f.bind(this);
        document.body.addEventListener(k, this.handles[k]);
    }

    unbind(k) {
        document.body.removeEventListener(k, this.handles[k]);
    }
}

class ClickHandler extends EHandler {
    constructor() {
        super();
        this.nodeDown = null;
        this.handle();
    }

    handle() {
        this.bind('mousedown', this.onmousedown)
        this.bind('mousemove', this.onmousemove)
        this.bind('mouseup', this.onmouseup)
    }

    unhandle() {
        for (let k in this.handles) {
            this.unbind(k);
        }
    }

    onmousedown(e) {
        const mx = e.layerX;
        const my = e.layerY;
        const node = findNode(mx, my);
        if (node) {
            this.nodeDown = {
                offset: {
                    x: mx - node.x,
                    y: my - node.y
                },
                node: node
            }
        }
    }

    onmousemove(e) {
        const mx = e.layerX;
        const my = e.layerY;

        if (this.nodeDown) {
            const { node, offset } = this.nodeDown;
            node.x = mx - offset.x;
            node.y = my - offset.y;
            const convert = slowFast.convertCoordsToPoint(node);
            node.tag.x = convert.x;
            node.tag.y = convert.y;
        }
        else {
            const node = findNode(mx, my);
            if (node) {
                document.body.style.cursor = 'pointer';
            }
            else {
                document.body.style.cursor = 'auto';
            }
        }
    }

    onmouseup(e) {
        this.nodeDown = null;
    }
}



slowFast = new SlowFastUI(600, 300);

function animate() {
    slowFast.render();
    requestAnimationFrame(animate);
}

click = new ClickHandler();
function findNode(mx, my) {
    return slowFast.circles.find(c => {
        c.render(slowFast.ctx);
        slowFast.ctx.closePath();
        if (slowFast.ctx.isPointInPath(mx, my)) {
            return c;
        }
    });
}


animate();