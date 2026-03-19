let message = "Hello World!";
console.log(message);
var WINDOW;
(function (WINDOW) {
    WINDOW[WINDOW["WIDTH"] = 500] = "WIDTH";
    WINDOW[WINDOW["HEIGHT"] = 500] = "HEIGHT";
})(WINDOW || (WINDOW = {}));
const canvas = document.getElementById("canvas");
const header = document.getElementById("h1");
const ctx = canvas.getContext("2d");
//header =
ctx.fillStyle = "green";
ctx.fillRect(0, 0, WINDOW.WIDTH, WINDOW.HEIGHT);
ctx.fillStyle = "gray";
ctx.fillRect(225, 50, 50, 50);
ctx.fillStyle = "gray";
ctx.fillRect(225, 400, 50, 50);
ctx.fillStyle = "brown";
ctx.fillRect(245, 100, 10, 300);
export {};
//# sourceMappingURL=client.js.map