
export function init() {
  console.log("App loaded!");
}


let message = "Hello World!";
console.log(message);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const header = document.getElementById("h1");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//header =
ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 1000);


