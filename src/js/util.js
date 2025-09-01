Util = {}
Util.randomInt = function(min, max) {
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
Util.degToRad = function(degrees) {
    return degrees * (Math.PI / 180);
}
Util.radToDeg = function(radians) {
    return radians * (180 / Math.PI);
}
