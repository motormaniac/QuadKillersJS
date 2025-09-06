Util = {}
Util.random_int = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Util.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
Util.lerp = function(start, end, t) {
    return start + (end - start) * t;
}
Util.map = function(value, a, b, c, d) {
    return c + ((value - a) * (d - c)) / (b - a);
}
Util.deg_to_rad = function(degrees) {
    return degrees * (Math.PI / 180);
}
Util.rad_to_deg = function(radians) {
    return radians * (180 / Math.PI);
}
Util.hsv_to_hex = function(h, s, v) {
    h = Util.clamp(h, 0, 360);
    s = Util.clamp(s, 0, 1);
    v = Util.clamp(v, 0, 1);

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