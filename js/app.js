/*global ctx, Resources*/

//用于碰撞检测的全局变量
var boy_area = [1000,1000,83,89];
/* exported INIT, PLAYING, FAIL, SUCESS, END */
//表征游戏状态的常量
var INIT = 0, PLAYING = 1, FAIL = 2, SUCESS = 3, END = 4;
// 这是我们的玩家要躲避的敌人 
var Enemy = function(level) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = 500 * Math.random(Date.now()) -100;
    this.y = Math.ceil(Math.random(Date.now())*4 - 1)*84 + 65;
    this.speed = Math.ceil(Math.random(Date.now) * 3) * (100 + 25 * level);
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if(this.x > 580) {
        //虫子循环加载
        this.x = -600 * Math.random(Date.now()) -100;
        this.y = Math.ceil(Math.random(Date.now())*4 - 1)*84 + 65;    
    }       
    this.x += dt * this.speed;
    //碰撞检测
    if(this.x + 100 >= boy_area[0] && this.x <= boy_area[2] && Math.abs(this.y - boy_area[1]) < 20){
        game.fail();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Game类，负责管理游戏的 关卡、分数、时间、生命、经验、失败、成功
 * 生成游戏各种状态下的画面
 */
var Game = function() {
    this.pause = false;
    this.loseCtrl = false;
    this.pass_time = 0;
    this.status = PLAYING;
    this.old_status = this.status;
    this.scroe = 0;
    this.leftTime = 20;
    this.heart = 3;
    this.level = 1;
    this.coll = [0,0,0,0,0];
};
/**
 * 绘制游戏得分、生命、时间、Level信息等
 */
Game.prototype.render = function() {
    switch(this.status){
    case SUCESS:
        drawSucess();
        break;
    case FAIL:
        drawFail();
        break;
    case END:
        drawEnd();
        break;
    default:
        break;
    }
    drawTime.call(this);
    drawScore.call(this);
    drawHeart.call(this);
    drawColl.call(this);
    function drawEnd(){
        ctx.font = 'bold 50px x';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER~',110,300);
    }
    function drawFail() {
        ctx.font = 'bold 38px x';
        ctx.fillStyle = 'red';
        ctx.fillText('FAIL',210,300);
    }
    function drawColl() {
        ctx.font = 'bold 20px x';
        ctx.fillStyle = 'black';
        ctx.fillText(this.coll.slice(0,3),300,20);
    }
    function drawTime() {
        ctx.font = 'bold 20px x';
        ctx.fillStyle = 'black';
        ctx.fillText(Math.ceil(this.leftTime)+'s',0,20);
    }
    function drawScore() {
        ctx.font = 'bold 20px x';
        ctx.fillStyle = 'black';
        ctx.fillText('Level: '+Math.ceil(this.level),60,20);
    }
    function drawHeart() {
        ctx.font = 'bold 20px x';
        ctx.fillStyle = 'black';
        ctx.fillText('L: '+Math.ceil(this.heart),200,20);
    }
    function drawSucess() {
        ctx.font = 'bold 50px h';
        ctx.fillStyle = 'gold';
        ctx.fillText('SUCCESS',120,300);
    }
};
/**
 * 控制游戏状态
 */
Game.prototype.update = function(dt) {
    if(this.old_status == this.status){
        this.pass_time += dt;
        switch(this.status){
        case SUCESS:
            if(this.pass_time > 2){
                this.status = PLAYING;
                this.start();
            }
            break;
        case FAIL:
            if(this.pass_time > 0.8){
                this.pause = false;
                this.status = PLAYING;
                this.start();
            }
            break;
        case PLAYING:
            this.leftTime -= dt;
            if(this.leftTime < 0)
                this.fail();
            if(this.coll[0] * this.coll[1] * this.coll[2] > 0){
                this.coll[0]--;
                this.coll[1]--;
                this.coll[2]--;
                this.heart++;
            }
            break;
        case END:
            if(this.pass_time > 3){
                game = new Game();
                game.start();                    
            }
            break;
        }
    }
    else{
        this.pass_time = 0;
        this.old_status = this.status;
    }
};
/**
 * 闯关成功，进入下一局
 * 显示 SUCESS信息2秒
 * loseCtrl 用于屏蔽用户输入
 */
Game.prototype.sucess = function() {
    this.level++;
    this.status = SUCESS;
    this.loseCtrl = true;
};
/**
 * 闯关失败，失去一次生命
 * 显示 FAIL 信息0.8秒后，重新开始游戏
 */
Game.prototype.fail = function() {
    this.heart--;
    this.pause = true;
    this.status = FAIL;
    if(this.heart < 0){
        //GAME OVER
        this.heart = 0;
        this.status = END;        
    }
};
/**
 * 开始游戏
 * 初始化游戏角色
 * 虫子、水晶位置随机指定，player进入初始位置。
 * 虫子数量初始化为6个
 */
Game.prototype.start = function() {
    this.pause = false;
    this.loseCtrl = false;
    this.leftTime = 20;
    allEnemies = [];
    for(var i = 0; i < 6; i++) {
        allEnemies[i] = new Enemy(this.level);
    }
    coll = new Collectible();
    player = new Player({
        x: 200,
        y: 410
    });
};
var CollectibleSprite = [
    'Gem Blue.png',
    'Gem Green.png',
    'Gem Orange.png'
];
/* exported BLUE, GREEN, ORANGE */
var BLUE = 0, GREEN = 1, ORANGE = 2;
/**
 * 水晶Class
 */
var Collectible = function() {
    this.disp = true;
    this.x = 30 + 100*Math.ceil(Math.random(Date.now())*4);
    this.y = 60 + 84 * Math.ceil(Math.random(Date.now())*3);
    this.type = Math.floor(Math.random(Date.now())*3);
    this.sprite = 'images/'+CollectibleSprite[this.type];
};
Collectible.prototype.update = function(dt) {
    //被吃掉后不再显示
    if(!this.disp)
        return;
    //被吃掉检测
    if(this.x + 15 >= boy_area[0] && this.x +15 <= boy_area[2] && Math.abs(this.y - boy_area[1] -80) < 30){
        this.eaten();
    }
};
Collectible.prototype.render = function() {
    if(this.disp){
        var img = Resources.get(this.sprite);
        ctx.drawImage(img, 0, 0, img.width, img.height, this.x, this.y, 30, 50);
    }
};
Collectible.prototype.eaten = function() {
    this.disp = false;
    game.coll[this.type]++;
};
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(pos) {
    this.sprite = 'images/char-boy.png';
    this.x = pos.x;
    this.y = pos.y;
    boy_area[0] = 17 + this.x;
    boy_area[2] = 83 + this.x;
    boy_area[1] = 10 + this.y;
    //display
    this.disp = true;
    this.passtime = 0;
};
Player.prototype.update = function(dt) {
};
Player.prototype.render = function() {
    if(this.disp){
        // ctx.fillRect(this.x,this.y,Resources.get(this.sprite).width,Resources.get(this.sprite).height)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
Player.prototype.handleInput = function(keys) {
    if(game.pause||game.loseCtrl)
        return;
    switch(keys) {
    case 'left':
        this.x = this.x < 100 ? this.x : this.x - 100;
        break;
    case 'right':
        this.x = this.x > 399 ? this.x : this.x + 100;
        break;
    case 'up':
        this.y = this.y < 0 ? this.y : this.y - 84;
        if(this.y < 20){
            game.sucess();
            // console.log('sucess');
        }
        break;
    case 'down':
        this.y = this.y > 400 ? this.y : this.y + 84;
        break;
    default:
        break;
    }
    boy_area[0] = 17 + this.x;
    boy_area[2] = 83 + this.x;
    boy_area[1] = 10 + this.y;
};


/* exported allEnemies,player, coll */
// 现在实例化你的所有对象
var game = new Game();
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies, player, coll;
game.start();
// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
