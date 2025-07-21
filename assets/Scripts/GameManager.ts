import { _decorator, Component, Node, instantiate, Prefab } from 'cc';
import { ScoreDisplay } from './ScoreDisplay';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab)
    pipePrefab: Prefab = null!;

    @property(Node)
    pipeParent: Node = null!;

    @property(Node)
    scoreDisplayNode: Node = null!;

    private score = 0;

    private timer = 0;

    start(){
        const scoreDisplay = this.scoreDisplayNode.getComponent(ScoreDisplay);
        scoreDisplay?.updateScore(this.score);
    }

    update(deltaTime: number) {
        this.timer += deltaTime;
        if (this.timer > 2.5) {
            this.spawnTime();
            this.timer = 0;
        }
    }

    spawnTime() {
        const pipe = instantiate(this.pipePrefab);
        const yOffset = Math.random() * 200 - 100;
        pipe.setPosition(400, yOffset);
        this.pipeParent.addChild(pipe);
    }

    increaseScore() {
        console.log('Score: '+this.score++);
        const display = this.scoreDisplayNode.getComponent(ScoreDisplay);
        display?.updateScore(this.score);
    }

    

}


