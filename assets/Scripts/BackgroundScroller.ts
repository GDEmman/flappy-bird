import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundScroller')
export class BackgroundScroller extends Component {
    @property(Number)
    speed: number = 100;

    @property(Node)
    bg1: Node = null!;

    @property(Node)
    bg2: Node = null!;

    private bgWidth: number = 0;

    start(){
        this.bgWidth = this.bg1.getComponent(UITransform)!.width;
    }

    update(deltaTime: number){
       this.bg1.setPosition(this.bg1.position.x - this.speed * deltaTime, this.bg1.position.y);
       this.bg2.setPosition(this.bg2.position.x - this.speed * deltaTime, this.bg2.position.y);

       if(this.bg1.position.x <= -this.bgWidth){
        this.bg1.setPosition(this.bg2.position.x + this.bgWidth, this.bg1.position.y)
       }

       if(this.bg2.position.x <= -this.bgWidth){
        this.bg2.setPosition(this.bg1.position.x + this.bgWidth, this.bg2.position.y)
       }
    }
}


