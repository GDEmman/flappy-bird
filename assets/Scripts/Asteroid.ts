import { _decorator, Component, Node, Prefab, instantiate, Vec3} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Asteroid')
export class Asteroid extends Component {

    @property(Prefab)
    destroyEffect: Prefab = null!;

    update(deltaTime: number) 
    {
        const pos = this.node.position;
        const newX = pos.x - 500 * deltaTime;
        this.node.setPosition(newX, pos.y);

        if (newX < -1500) {
            console.log("ASTEROID DESTROY!");
            this.node.destroy(); // ← fixed: add parentheses to actually call destroy
        }
    }

    destroyWithEffect() {
         if (this.destroyEffect && this.node.parent) {
            const worldPos = this.node.getWorldPosition();
            const effect = instantiate(this.destroyEffect);

            // Convert world position to local position of the parent
            const localPos = new Vec3();
            this.node.parent.inverseTransformPoint(localPos, worldPos);

            effect.setPosition(localPos);
            this.node.parent.addChild(effect);
        }

        this.node.destroy();
    }
}


