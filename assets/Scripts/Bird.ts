import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, input, Input, EventTouch, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {

    @property(RigidBody2D)
    rigidBody: RigidBody2D = null;

    private collider: Collider2D | null = null;

    @property([GameManager])
    gameManager: GameManager;

    private triggered = false;

    private isGameOver = false;

    start() {

        this.rigidBody = this.getComponent(RigidBody2D)!;

        input.on(Input.EventType.MOUSE_DOWN, this.flap, this);

        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number){
        if (this.isGameOver) return;
        
        const velocity = this.rigidBody.linearVelocity;

        let angle = velocity.y * 0.6;
        angle = Math.max(Math.min(angle,25), -90);

        this.node.setRotationFromEuler(new Vec3(0, 0, angle));

        this.node.setRotationFromEuler(new Vec3(0, 0, angle));
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

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        if(otherCollider.tag === 1 || otherCollider.tag === 2 || otherCollider.tag === 4){
            console.log('🐤 Bird collided!');
            this.node.active = false;

            GameManager.instance.gameOver();
        }

        else if(otherCollider.tag === 3){
            this.triggered = true;

            const managerScript = this.gameManager.getComponent(GameManager);
            managerScript?.increaseScore();
        }

        if(this.triggered) return;
    }

    onDestroy() {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    public onGameOver() {
        this.isGameOver = true;
    }

    flap() {
        this.rigidBody.linearVelocity = new Vec2(0, 15);
    }
}


