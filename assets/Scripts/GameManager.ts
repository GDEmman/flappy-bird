import { _decorator, Component, Node, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab)
    pipePrefab: Prefab = null!;

    @property(Node)
    pipeParent: Node = null!;

    private timer = 0;

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

}

