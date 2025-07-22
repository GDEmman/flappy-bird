import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GroundScroll')
export class GroundScroll extends Component {
   @property([Node])
    groundPieces: Node[] = [];

    @property
    speed: number = 3; // pixels per second

    private groundWidth: number = 0;

    start() {
        // Assuming both ground pieces are same width
        this.groundWidth = this.groundPieces[0].getComponent(UITransform)!.width;
    }

    update(deltaTime: number) {
        for (let ground of this.groundPieces) {
            const x = ground.position.x - this.speed * deltaTime;
            ground.setPosition(x, ground.position.y);

            // If ground is out of view, reset it to the right
            if (x <= -this.groundWidth) {
                const rightmost = this.getRightmostGroundX();
                ground.setPosition(rightmost + this.groundWidth, ground.position.y);
            }
        }
    }

    getRightmostGroundX(): number {
        return Math.max(...this.groundPieces.map(g => g.position.x));
    }
}


