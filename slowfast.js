class SlowFast {
}

const BG = '#2b2b2b';
const TXT_COLOR = '#4b4b4b';
const MID_LINE = '#1b1b1b';


class SlowFastUI {
    constructor(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.width = width;
        this.height = height;
        this.ctx = canvas.getContext('2d');

        document.body.appendChild(canvas);
    }

    render() {
        const { ctx, width, height } = this;

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

        // TXT_COLOR

    }
}

slowFast = new SlowFastUI(600, 300);
slowFast.render();