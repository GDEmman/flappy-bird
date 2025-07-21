import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('ScoreTrigger')
export class ScoreTrigger extends Component {
   
    @property(Node)
    gameManager: Node = null!;

    private triggered = false;

    onEnable(){
        const collider = this.getComponent(Collider2D);
        collider?.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
    }

    onDisable(){
        const collider = this.getComponent(Collider2D);
        collider?.off(Contact2DType.BEGIN_CONTACT, this.onContact, this);
    }

    private onContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null){
        if(this.triggered) return;
        if(other.node.name === 'Bird'){
            this.triggered = true;

            const managerScript = this.gameManager.getComponent(GameManager);
            managerScript?.increaseScore();
        }
    }
}


