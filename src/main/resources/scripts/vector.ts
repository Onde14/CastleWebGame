export class Vector{
  x: number;
  y: number;


  constructor(x: number, y: number){
    this.x = x;
    this.y = y;


  }

  public length_to_target(target: Vector){
      let x = Math.abs(this.x-target.x);
      let y = Math.abs(this.y-target.y);
      return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
  }



}