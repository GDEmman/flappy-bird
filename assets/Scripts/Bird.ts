import { _decorator, Component, Node, RigidBody2D, Vec2, input, Input, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {

    @property(RigidBody2D)
    rigidBody: RigidBody2D = null;

    start() {
        input.on(Input.EventType.TOUCH_START, this.flap, this);
        //input.on(Input.EventType.MOUSE_DOWN, this.flap, this);
    }

    flap() {
        this.rigidBody.linearVelocity = new Vec2(0, 15);
    }
}


