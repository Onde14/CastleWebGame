export class Unit {
    id = Math.random();
    selected = false;
    type: string = "infantry";
    select(){
        console.log(`${this.type} selected. ID: ${this.id}`)
    }

    buildUnit(){

    }
}