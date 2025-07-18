import { _decorator, Component, Node, RigidBody2D, Vec2, input, Input, EventTouch, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {

    @property(RigidBody2D)
    rigidBody: RigidBody2D = null;

    private collider: Collider2D | null = null;

    onLoad() {
        this.collider = this.getComponent(Collider2D);
    }

    onEnable() {
        this.collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDisable() {
        this.collider?.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    private onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        console.log('🐤 Bird collided!');

        // Example Game Over Logic
        this.node.active = false;

        // TODO: Trigger GameManager to show Game Over UI or reset
    }

    start() {
        input.on(Input.EventType.TOUCH_START, this.flap, this);

        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onDestroy() {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    flap() {
        this.rigidBody.linearVelocity = new Vec2(0, 15);
    }
}


