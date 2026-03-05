let message = "Hello World!";
console.log(message);

const canvas = <HTMLCanvasElement> document.getElementById("canvas");	
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 1000);


