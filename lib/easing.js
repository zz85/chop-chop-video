const unit = new UnitBezier(0.5, 0, 0.5, 1); // standard
// unit = new UnitBezier(0.25, 0, 0.75, 1),
// unit = new UnitBezier(0.75, 0, 0.25, 1),

const Easing = {
    Linear: function(k) {
        return k;
    },
    QuadraticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k;
        }

        return - 0.5 * (--k * (k - 2) - 1);
    },
    CubicInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k;
        }

        return 0.5 * ((k -= 2) * k * k + 2);
    },
    ExponentialInOut: function (k) {
        if (k === 0) {
            return 0;
        }

        if (k === 1) {
            return 1;
        }

        if ((k *= 2) < 1) {
            return 0.5 * Math.pow(1024, k - 1);
        }

        return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
    },

    BezierInOut: function(k) {
        return unit.solve(k, unit.epsilon);
    }
}