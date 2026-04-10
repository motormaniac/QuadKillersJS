export class Ref<T> {
    value: T;
    constructor(value: T) {
        this.value = value;
    }
}

export function randomInt(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function clamp(value:number, min:number, max:number) {
    return Math.min(Math.max(value, min), max);
}
export function lerp(start:number, end:number, t:number) {
    return start + (end - start) * t;
}
export function map(value:number, a:number, b:number, c:number, d:number) {
    return c + ((value - a) * (d - c)) / (b - a);
}
export function degToRad(degrees:number) {
    return degrees * (Math.PI / 180);
}
export function radToDeg(radians:number) {
    return radians * (180 / Math.PI);
}
export function hsvToHex(h:number, s:number, v:number) {
    h = clamp(h, 0, 360);
    s = clamp(s, 0, 1);
    v = clamp(v, 0, 1);

    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;
    let r = 0, g = 0, b = 0;

    if (h < 60)      { r = c; g = x; b = 0; }
    else if (h < 120){ r = x; g = c; b = 0; }
    else if (h < 180){ r = 0; g = c; b = x; }
    else if (h < 240){ r = 0; g = x; b = c; }
    else if (h < 300){ r = x; g = 0; b = c; }
    else             { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b)
        .toString(16).slice(1).toUpperCase();
}