import { _decorator, Component, Node, instantiate, Prefab, director, SpriteFrame, Sprite, input, Input, tween, Vec3, Tween } from 'cc';
import { ScoreDisplay } from './ScoreDisplay';
import { Bird } from './Bird';
import { Pipe } from './Pipe';
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

    @property(Node)
    mainMenu: Node = null!;

    private score = 0;
    private timer = 0;
    private isGameOver = false;

    private isWaiting = true;
    private originalPos: Vec3 = new Vec3();

    private isGameStart = false;

    onLoad(){
        GameManager.instance = this;
    }

    start(){
        if (this.isWaiting) {
            this.originalPos = this.birdNode.position.clone();
            this.startHoverAnimation();
        }

        const bird = this.birdNode.getComponent(Bird);
        bird.rigidBody.enabled = false;

        this.scoreDisplayNode.active = false;
        this.gameOverUI.active = false;
        this.pipeParent.active = false;
        
        this.mainMenu.active = true;

        input.on(Input.EventType.MOUSE_DOWN, this.gameStart, this);
    }

    update(deltaTime: number) {
        this.timer += deltaTime;
        if (this.timer > 2.5) {
            if(this.isGameStart == true){
                this.spawnTime();
                this.timer = 0;
            }
        }
    }

    startHoverAnimation() {
        const up = new Vec3(this.originalPos.x, this.originalPos.y + 10, this.originalPos.z);
        const down = new Vec3(this.originalPos.x, this.originalPos.y - 10, this.originalPos.z);

        tween(this.birdNode)
            .repeatForever(
                tween()
                    .to(0.6, { position: up }, { easing: 'sineInOut' })
                    .to(0.6, { position: down }, { easing: 'sineInOut' })
            )
            .start();
    }

    gameStart(){
        this.birdNode.active = true;
        this.pipeParent.active = true;
        this.mainMenu.active = false;
        this.scoreDisplayNode.active = true;

        const scoreDisplay = this.scoreDisplayNode.getComponent(ScoreDisplay);
        scoreDisplay?.updateScore(this.score);

        const bird = this.birdNode.getComponent(Bird);
        bird.rigidBody.enabled = true;

        this.isWaiting = false;
        Tween.stopAllByTarget(this.birdNode);
        this.isGameStart = true;
        
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


