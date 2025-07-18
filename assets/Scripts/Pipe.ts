import { _decorator, Component, Node, Vec3, BoxCollider2D, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pipe')
export class Pipe extends Component {
    update(deltaTime: number) {
    const pos = this.node.position;
    const newX = pos.x - 200 * deltaTime;
    this.node.setPosition(newX, pos.y);

    if (newX < -1500) {
        console.log("PIPE DESTROY!");
        this.node.destroy(); // ← fixed: add parentheses to actually call destroy
    }
}
}

