"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
function init() {
    console.log("App loaded!");
}
let message = "Hello World!";
console.log(message);
const canvas = document.getElementById("canvas");
const header = document.getElementById("h1");
const ctx = canvas.getContext("2d");
//header =
ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 1000);
//# sourceMappingURL=client.js.map