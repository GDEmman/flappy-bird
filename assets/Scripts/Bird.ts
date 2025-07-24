import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, input, Input, EventKeyboard, KeyCode, Prefab, instantiate, UITransform,
    EventTouch, Collider2D, Contact2DType, IPhysics2DContact,
    AudioClip, AudioSource } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {

    @property(RigidBody2D)
    rigidBody: RigidBody2D = null;

    private collider: Collider2D | null = null;

    @property([GameManager])
    gameManager: GameManager;

    @property({ type: AudioClip })
    flapSFX: AudioClip = null!;

    @property({ type: AudioClip })
    deadSFX: AudioClip = null!;

    @property({ type: AudioClip })
    scoreFX: AudioClip = null!;

    @property(Prefab)
    laserPrefab: Prefab = null!;

    @property(Node)
    laserParent: Node = null!;


    private audioSource: AudioSource = null!;

    private triggered = false;

    private isGameOver = false;

    start() {

        this.rigidBody = this.getComponent(RigidBody2D)!;
        this.audioSource = this.node.addComponent(AudioSource);

        input.on(Input.EventType.MOUSE_DOWN, this.flap, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    playFlapSound() {
        if (this.flapSFX && this.audioSource) {
            this.audioSource.playOneShot(this.flapSFX);
        }
    }

    playDeadSound(){
         if (this.deadSFX && this.audioSource) {
            this.audioSource.playOneShot(this.deadSFX);
        }
    }

    playScoreSound(){
         if (this.scoreFX && this.audioSource) {
            this.audioSource.playOneShot(this.scoreFX);
        }
    }

    update(deltaTime: number){
        if (this.isGameOver) return;
        
        const velocity = this.rigidBody.linearVelocity;

        let angle = velocity.y * 0.6;
        angle = Math.max(Math.min(angle,25), -90);

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
            this.playDeadSound();
            this.node.active = false;

            GameManager.instance.gameOver();
        }

        else if(otherCollider.tag === 3){
            this.triggered = true;

            const managerScript = this.gameManager.getComponent(GameManager);
            managerScript?.increaseScore();
            this.playScoreSound();
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
        this.playFlapSound();
        this.rigidBody.linearVelocity = new Vec2(0, 15);
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) {
            this.shootLaser();
        }
    }

    shootLaser() {
        const laser = instantiate(this.laserPrefab);

        // Get world position of the bird
        const worldPos = this.node.getWorldPosition();

        // Convert world position to local position of laserParent
        const localPos = this.laserParent.getComponent(UITransform)
            ? this.laserParent.getComponent(UITransform)!.convertToNodeSpaceAR(worldPos)
            : worldPos;

        laser.setPosition(localPos);

        // Reset rotation so it's always straight
        laser.setRotationFromEuler(0, 0, 0);

        // Add to laserParent
        this.laserParent.addChild(laser);
    }
}


