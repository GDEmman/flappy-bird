import { _decorator, Component, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact, Node, Prefab } from 'cc';
import { Asteroid } from './Asteroid';
const { ccclass, property } = _decorator;

@ccclass('Laser')
export class Laser extends Component {
    speed: number = 1000;

    private collider: Collider2D | null = null;

    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onLoad() {
        this.collider = this.getComponent(Collider2D);
    }

    onEnable() {
        this.collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDisable() {
        this.collider?.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(deltaTime: number) {
        this.node.setPosition(this.node.position.x + this.speed * deltaTime, this.node.position.y);

        if (this.node.x > 1500) {
            console.log("Laser Destroy");
            this.node.destroy(); // ← fixed: add parentheses to actually call destroy
        }
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        // Destroy target and laser
        const asteroid = other.node.getComponent(Asteroid);

         if(other.node.name === 'asteroid' || other.tag === 5){
            asteroid?.destroyWithEffect();
            other.node.destroy();
            this.node.destroy();
        }
    }
}


