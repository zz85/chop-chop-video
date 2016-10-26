/*
 * UI Classes have this structure
 *   constructor() - setups object
 *   .path(ctx) - for drawing paths, and determining hit
 *   .render(ctx) - renders components. usually calls .path();
 */

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
        ctx.save();
        ctx.strokeStyle = LINE_COLOR;
        ctx.globalAlpha = 0.5;
        this.path(ctx);
        ctx.stroke();
        ctx.restore();
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

class Rect {
    constructor(x, y, w, h) {
        Object.assign(this, {
            x, y, w, h
        })
    }

    static pattern() {
        if (this.c) return this.c;
        const c = document.createElement('canvas');
        const w = 8;
        c.width = w;
        c.height = w;
        const ctx = c.getContext('2d');
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, w);
        ctx.stroke();
        this.c = c;
        return c;
    }

    path(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
    }

    render(ctx) {
        var pattern = ctx.createPattern(Rect.pattern(), 'repeat');
        ctx.fillStyle = pattern;
        this.path(ctx);
        ctx.fill();
    }

    ishit() {
        // bla
    }
}
