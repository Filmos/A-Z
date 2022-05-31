class Color {
    hue: number;
    sat: number;
    light: number;
    a: number;

    constructor(hex: string) {
        this.hue = 0;
        this.sat = 0;
        this.light = 0;
        this.a = 1;
        this.setHex(hex);
    }
    setHex(hex: string) {
        if (hex.indexOf('#') === 0) hex = hex.slice(1);
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length === 4) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        if (hex.length === 6) hex += 'ff';
        if (hex.length !== 8) throw new Error('Invalid hex color');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = parseInt(hex.slice(6, 8), 16);
        this.setRGB(r, g, b);
        this.setAlpha(a / 255);
        return this;
    }
    setRGB(r: number, g: number, b: number) {
        const hsl = rgbToHsl(r, g, b);
        this.hue = hsl.h;
        this.sat = hsl.s;
        this.light = hsl.l;
        return this;
    }
    setHSL(h: number, s: number, l: number) {
        this.hue = h;
        this.sat = s;
        this.light = l;
        return this;
    }

    setHue(hue: number) {
        this.hue = hue;
        return this;
    }
    setSaturation(sat: number) {
        this.sat = sat;
        return this;
    }
    setLightness(light: number) {
        this.light = light;
        return this;
    }
    setAlpha(a: number) {
        this.a = a;
        return this;
    }

    saturate(amount: number) {
        this.sat *= amount;
        return this;
    }
    lighten(amount: number) {
        this.light *= amount;
        return this;
    }
    darken(amount: number) {
        this.light *= (1 - amount);
        return this;
    }
    rotateHue(amount: number) {
        this.hue += amount;
        if (this.hue > 360) this.hue -= 360;
        if (this.hue < 0) this.hue += 360;
        return this;
    }

    getHex() {
        const rgb = hslToRgb(this.hue, this.sat, this.light);
        const r = rgb.r.toString(16).padStart(2, '0');
        const g = rgb.g.toString(16).padStart(2, '0');
        const b = rgb.b.toString(16).padStart(2, '0');
        const a = Math.floor(this.a * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}${a}`;
    }
    getRGB() {
        const rgb = hslToRgb(this.hue, this.sat, this.light);
        return { r: rgb.r, g: rgb.g, b: rgb.b };
    }
    getHSL() {
        return { h: this.hue, s: this.sat, l: this.light };
    }
    getA() {
        return this.a;
    }

    toString() {
        return this.getHex();
    }
    clone() {
        return new Color(this.getHex());
    }
}
export default Color;

function hslToRgb(h: number, s: number, l: number) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.floor(r * 255), g: Math.floor(g * 255), b: Math.floor(b * 255) };
}
function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return {
        h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
        s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        l: (100 * (2 * l - s)) / 2,
    }
}