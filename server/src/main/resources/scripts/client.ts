let message = "Hello World!";
console.log(message);

enum WINDOW {
	WIDTH = 500,
	HEIGHT = 500,
}



const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const header = document.getElementById("h1");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//header =
ctx.fillStyle = "green";
ctx.fillRect(0, 0, WINDOW.WIDTH, WINDOW.HEIGHT);

ctx.fillStyle = "gray";
ctx.fillRect(225,50, 50, 50);

ctx.fillStyle = "gray";
ctx.fillRect(225,400, 50, 50);

ctx.fillStyle = "brown" ;
ctx.fillRect(245,100, 10, 300);





