import { _decorator, Component, Node, instantiate, Prefab, Game, director, SpriteFrame, Sprite } from 'cc';
import { ScoreDisplay } from './ScoreDisplay';
import { Bird } from './Bird';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    static instance: GameManager;

    @property(Prefab)
    pipePrefab: Prefab = null!;

    @property(Node)
    pipeParent: Node = null!;

    @property(Node)
    scoreDisplayNode: Node = null!;

    @property(Node)
    gameOverUI: Node = null!;

    @property(Node)
    birdNode: Node = null!;

    @property(ScoreDisplay)
    finalScoreDisplay: ScoreDisplay = null!;

    @property(ScoreDisplay)
    highScoreDisplay: ScoreDisplay = null!;

    @property(Node)
    medalDisplay: Node = null!;

    @property(SpriteFrame)
    medalBronze: SpriteFrame = null!;

    @property(SpriteFrame)
    medalSilver: SpriteFrame = null!;

    @property(SpriteFrame)
    medalGold: SpriteFrame = null!;

    @property(SpriteFrame)
    medalPlatinum: SpriteFrame = null!;

    private score = 0;
    private timer = 0;
    private isGameOver = false;

    onLoad(){
        GameManager.instance = this;
    }

    start(){
        const scoreDisplay = this.scoreDisplayNode.getComponent(ScoreDisplay);
        scoreDisplay?.updateScore(this.score);

        this.gameOverUI.active = false;
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

    gameOver(){
        console.log("Game Over!");
        this.isGameOver = true;

        const bird = this.birdNode.getComponent(Bird);
        bird?.onGameOver();

        this.gameOverUI .active = true;

        this.finalScoreDisplay.updateScore(this.score);

        const saveHighScore = parseInt(localStorage.getItem('highScore') || '0');

        if(this.score > saveHighScore){
            localStorage.setItem('highScore', this.score.toString());
        }

        const finalHighScore = Math.max(this.score, saveHighScore);
        this.highScoreDisplay.updateScore(finalHighScore);

        const medalSprite = this.medalDisplay.getComponent(Sprite);
        if (medalSprite) {
        if (this.score >= 50) {
            medalSprite.spriteFrame = this.medalPlatinum;
        } else if (this.score >= 30) {
            medalSprite.spriteFrame = this.medalGold;
        } else if (this.score >= 20) {
            medalSprite.spriteFrame = this.medalSilver;
        } else if (this.score >= 10) {
            medalSprite.spriteFrame = this.medalBronze;
        } else {
            medalSprite.spriteFrame = null;
        }
    }

        this.pipeParent.children.forEach(pipe => pipe.active = false);
    }

    restartGame(){
        director.loadScene(director.getScene().name);
    }

    

}


