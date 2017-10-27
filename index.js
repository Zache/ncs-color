const hues = {
    'R': { h: 345, s: 99, v: 77 },
    'Y': { h: 50, s: 100, v: 100 },
    'B': { h: 197, s: 100, v: 74 },
    'G': { h: 160, s: 100, v: 63 }
};

const strictNcsRegex = /^S? ?(\d{2})(\d{2})-([RGBY]|([RGBY])(\d{2})([RGBY]))$/;
export const ncsRegex = new RegExp(strictNcsRegex, 'i');

export function ncs2hsv(ncs) {
    ncs = ncs.toUpperCase();

    if (!strictNcsRegex.test(ncs))
        throw new Error('Not a valid NCS string ' + ncs);

    const res = strictNcsRegex.exec(ncs).filter(m => !!m);

    // extract value from blackness
    let v = 100 - parseInt(result[1], 10);

    // saturation, in 0-100
    let s = parseInt(result[2], 10);

    // hue from primitive color(s)
    let huePart = result.slice(3);

    let h = 0;

    if (huePart.length === 1) {
        h = hues[huePart[0]].h;
        s = (s / 100) * hues[huePart[0]].s;
        v = (v / 100) * hues[huePart[0]].v;
    }
    else {
        const p1 = hues[huePart[1]];
        const p2 = hues[huePart[3]];
        const frac = parseInt(huePart[2], 10) * 0.01;
        h = Math.round(p2.h * frac + p1.h * (1 - frac));
        s = (s / 100) * (p2.s * frac + p1.s * (1 - frac));
        v = (v / 100) * (p2.v * frac + p1.v * (1 - frac));
    }

    const maxS = 85;
    s = s > 0 ? 90 * s / maxS + 10 : 0;

    return [h, s, v]; // 0-360, 0-100, 0-100
}