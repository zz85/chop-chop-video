class SlowFast {
    // JS version of https://itunes.apple.com/sg/app/slow-fast-slow-control-speed/id727309825?mt=8

    /*
    Original behaviour
    1. points
        - drag to move
        - long hold to remove
    2. everywhere else
        - touch to move time
        - long hold to add point
    3. curve is make of bezier curves
        - moving point doesn't affect more than 2 segments
    4. moving 1st and last points trims the videos
    5. can't move a point across an eariler or later point.
        - doing so scales the rest of the points.
    6. video loops
    7. nice balloon toolbars, and bubble / pill dialogs

    Extended behaviour to explore
    1. Use other easing functions (DONE)
        - also allow to move bezier control points
    2. allow addition of points only on line?
    3. allow removal of points by dragging it out
    4. re-order points if dragged across one another?
    5. restrict point adding to the curve only?
    6. undo / redo
    7. mouse / touch gestures
    8. debug points as a linear list.
    */
}

const BG = '#2b2b2b';
const TXT_COLOR = '#aaa';
const MID_LINE = '#1b1b1b';
const SPACER = 5;
const BTN_COLOR = '#fefefe';
const CURVE_COLOR = '#ca0347'
const LINE = '#ebebeb';
const EasingFunc = Easing.QuadraticInOut; // BezierInOut

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
        this.points.push({x: 0.333, y: 0});
        this.points.push({x: 0.667, y: 0});
        // this.points.push({x: 0.25, y: 0.5}); // this.points.push({x: 0.25, y: 0});
        // this.points.push({x: 0.75, y: -0.5}); // this.points.push({x: 0.75, y: 0});
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

    findClosestPoints(cx) {
        if (cx < 0 || cx > 1) return;
        let p0, p1;
        const points = this.points;

        // assume points have been sorted
        for (let p = 0; p < points.length; p++) {
            let point = points[p];
            if (point.x <= cx) {
                p0 = point;
            }
            else if (point.x >= cx) {
                p1 = point;
                return [p0, p1];
            }
        }
    }

    yValueAt(cx) {
        const pairs = this.findClosestPoints(cx);
        if (pairs) {
            const [p0, p1] = pairs;
            const dx = p1.x - p0.x;
            const t = (cx - p0.x) / dx;

            const y = EasingFunc(t);
            const dy = p1.y - p0.y;
            return y;
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


        // Prepare graphical objects

        // render spline
        this.curve = new EaseCurve(points.map(this.convertPointToCoords, this), this);

        // render points
        this.circles = points.map((p) => new Circle(
            width * p.x, height * (1 + p.y) * 0.5, 11, BTN_COLOR, p));

        if (!this.ghost) {
            this.ghost = new Circle(0, 0, 10, '#333333');
        }

        if (!this.line) {
            this.line = new Line({
                x0: 0, y0: 0, x1: 0, y1: height
            });
        }

        // Items for rendering
        this.children = new Set();
        this.children.add(this.curve);
        this.children.add(this.line);
        this.circles.forEach(c => this.children.add(c));
        this.children.add(this.ghost);

        for (let c of this.children) {
            c.render(ctx);
        }
    }
}

class Line {
    constructor(o) {
        Object.assign(this, o);
    }

    path(ctx) {
        const {x0, y0, x1, y1} = this;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
    }

    render(ctx) {
        ctx.strokeStyle = 'yellow';
        this.path(ctx);
        ctx.stroke();
    }
}

class Curve {
    constructor(points, tag) {
        this.points = points;
        this.tag = tag;
    }

    path(ctx) {
        const points = this.points;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];

            if (i === 0) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.moveTo(p0.x, p0.y);
            }

            const midx = p0.x * 0.5 + p1.x * 0.5;

            ctx.bezierCurveTo(
                midx, p0.y,
                midx, p1.y,
                p1.x, p1.y);
        }
    }

    render(ctx) {
        ctx.strokeStyle = CURVE_COLOR;

        this.path(ctx);
        ctx.stroke();
    }
}

class EaseCurve {
    constructor(points, tag) {
        this.points = points;
        this.tag = tag;
    }

    path(ctx) {
        const points = this.points;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];

            if (i === 0) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.moveTo(p0.x, p0.y);
            }

            const dx = p1.x - p0.x;
            const dy = p1.y - p0.y;
            const divisions = dx * 2 | 0;
            for (let x = 0; x < divisions; x++) {
                const t = x / divisions;
                ctx.lineTo(p0.x + dx * t, p0.y + EasingFunc(t) * dy);
            }
        }
    }

    render(ctx) {
        ctx.strokeStyle = CURVE_COLOR;

        this.path(ctx);
        ctx.stroke();
    }
}

class Circle {
    constructor(x, y, r, color, tag) {
        Object.assign(this, {
            x, y, r, color, tag
        })
        this.tag = tag;
    }

    path(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        this.path(ctx);
        ctx.fill();
    }
}

/*
class Emitter {
    constructor() {

    }

    on() {

    }

    off() {

    }

    emit() {

    }
}
*/

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
        else {
            // - W
            const p = slowFast.findClosestPoints(mx / slowFast.width);
            const points = slowFast.points;
            if (p[0]) {
                const insert = points.indexOf(p[1]);

                points.splice(insert, 0, slowFast.convertCoordsToPoint({
                    x: mx,
                    y: my
                }));
            }
        }
    }

    onmousemove(e) {
        const mx = e.layerX;
        const my = e.layerY;

        // update line
        slowFast.line.x0 = slowFast.line.x1 = mx;

        // update ghost
        slowFast.ghost.x = mx;
        slowFast.ghost.y = my;

        if (this.nodeDown) {
            const { node, offset } = this.nodeDown;
            if (node instanceof Circle && node !== slowFast.ghost) {
                node.x = mx - offset.x;
                node.y = my - offset.y;
                const convert = slowFast.convertCoordsToPoint(node);
                // - W
                node.tag.x = convert.x;
                node.tag.y = convert.y;
            }
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


function animate() {
    slowFast.render();
    requestAnimationFrame(animate);
}

function findNode(mx, my) {
    const ctx = slowFast.ctx;

    var nodes = [];
    for (let node of slowFast.circles) {
        node.path(ctx);
        if (ctx.isPointInPath(mx, my)) {
            // nodes.push(node);
            return node;
        }
    }

    // return nodes.pop();
}


slowFast = new SlowFastUI(600, 280);
click = new ClickHandler();

animate();
