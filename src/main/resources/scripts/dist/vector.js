export class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    length_to_target(target) {
        let x = Math.abs(this.x - target.x);
        let y = Math.abs(this.y - target.y);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
}
//# sourceMappingURL=vector.js.map