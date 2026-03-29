export class Unit {
    id = Math.random();
    selected = false;
    type = "infantry";
    select() {
        console.log(`${this.type} selected. ID: ${this.id}`);
    }
    buildUnit() {
    }
}
//# sourceMappingURL=units.js.map