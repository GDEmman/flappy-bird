import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreDisplay')
export class ScoreDisplay extends Component {
    
    @property([SpriteFrame])
    digitSprites: SpriteFrame[] = [];

    @property(Prefab)
    digitPrefab: Prefab = null!

    updateScore(score: number){
        this.node.removeAllChildren();

        const digits = score.toString().split('');

        for(const digit of digits){
            const num = parseInt(digit);
            const digitNode = instantiate(this.digitPrefab);
            const sprite = digitNode.getComponent(Sprite);
            sprite!.spriteFrame = this.digitSprites[num];
            this.node.addChild(digitNode);
        }
    }
}


