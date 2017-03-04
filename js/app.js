var boy_area = [1000,1000,83,89];
var INIT = 0, PLAYING = 1, FAIL = 2, SUCESS = 3;
// var g_status = PLAYING
// 这是我们的玩家要躲避的敌人 
var Enemy = function(pos) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = pos.x;//-100;
    this.y = pos.y;//65;
    this.speed = pos.speed
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if(this.x > 580) {
        var pos = randomPosition()
        this.x = pos.x;
        this.y = pos.y;
    }       
    this.x += dt * this.speed;
    if(this.x + 100 >= boy_area[0] && this.x <= boy_area[2] && Math.abs(this.y - boy_area[1]) < 20){
        game.fail();
    }
    this.render();
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
}
Game.prototype.render = function() {
    switch(this.status){
        case SUCESS:
            drawSucess();
            break;
        case FAIL:
            drawFail();
            break;
        default:
            break;
    }
    drawTime.call(this);
    drawScore.call(this);
    drawHeart.call(this);
    drawColl.call(this);
    function drawFail() {
        ctx.font = "bold 30px x"
        ctx.fillStyle = 'black';
        ctx.fillText('FAIL',100,200);
    }
    // [].slice
    function drawColl() {
        ctx.font = "bold 20px x"
        ctx.fillStyle = 'black';
        ctx.fillText(this.coll.slice(0,3),300,20);
    }
    function drawTime() {
        ctx.font = "bold 20px x"
        ctx.fillStyle = 'black';
        ctx.fillText(Math.ceil(this.leftTime)+'s',0,20);
    }
    function drawScore() {
        ctx.font = "bold 20px x"
        ctx.fillStyle = 'black';
        ctx.fillText('Level: '+Math.ceil(this.level),60,20);
    }
    function drawHeart() {
        ctx.font = "bold 20px x"
        ctx.fillStyle = 'black';
        ctx.fillText('L: '+Math.ceil(this.heart),200,20);
    }
    function drawSucess() {
        ctx.font = "bold 30px h"
        ctx.fillStyle = 'black';
        ctx.fillText('SUCESS',100,200);
    }
}
Game.prototype.update = function(dt) {
    if(this.old_status == this.status){
        this.pass_time += dt;
        switch(this.status){
            case SUCESS:
                if(this.pass_time > 2){
                    this.status = PLAYING;
                    this.level++;
                    this.start()
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
                this.leftTime -= 0;
                if(this.leftTime < 0)
                    this.fail();
                break;
        }
    }
    else{
        this.pass_time = 0;
        this.old_status = this.status;
    }
}
Game.prototype.sucess = function() {
    this.levet++;
    this.status = SUCESS;
    this.loseCtrl = true;
}
Game.prototype.fail = function() {
    console.log('fail')
    return
    this.heart--;
    this.pause = true;
    this.status = FAIL;
    if(this.heart < 0){
        //restart
        this.level = 1;
        this.heart = 3;
    }
}
Game.prototype.start = function() {
    this.pause = false;
    this.loseCtrl = false;
    this.leftTime = 20;
    allEnemies = [];
    for(var i = 0; i < 7+this.level; i++) {
        allEnemies[i] = new Enemy(randomPosition())
    }
    coll = new Collectible();
    player = new Player({
        x: 200,
        y: 410
    });
}
var CollectibleSprite = [
    'Gem Blue.png',
    'Gem Green.png',
    'Gem Orange.png'
]
var BLUE = 0, GREEN = 1, ORANGE = 2;
var Collectible = function() {
    this.disp = true;
    this.x = 30 + 100*Math.ceil(Math.random(Date.now())*4);
    this.y = 60 + 84 * Math.ceil(Math.random(Date.now())*3);
    this.type = Math.floor(Math.random(Date.now())*3);
    this.sprite = 'images/'+CollectibleSprite[this.type];
    console.log(this.type)
}
Collectible.prototype.update = function(dt) {
    if(!this.disp)
        return;
    if(this.x + 15 >= boy_area[0] && this.x +15 <= boy_area[2] && Math.abs(this.y - boy_area[1] -80) < 30){
        this.eaten()
    }
}
Collectible.prototype.render = function() {
    if(this.disp){
        var img = Resources.get(this.sprite);
        // ctx.fillRect(this.x,this.y,30,50)
        ctx.drawImage(img, 0, 0, img.width, img.height, this.x, this.y, 30, 50);
    }
}
Collectible.prototype.eaten = function() {
    this.disp = false;
    game.coll[this.type]++;
}
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
}
Player.prototype.update = function(dt) {
}
Player.prototype.render = function() {
    if(this.disp){
        // ctx.fillRect(this.x,this.y,Resources.get(this.sprite).width,Resources.get(this.sprite).height)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}
Player.prototype.handleInput = function(keys) {
    if(game.pause||game.loseCtrl)
        return
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
                console.log('sucess')
            }
            break;
        case 'down':
            this.y = this.y > 400 ? this.y : this.y + 84;
            break;
        default:
            break;
    }
    boy_area[0] = 17 + this.x
    boy_area[2] = 83 + this.x
    boy_area[1] = 10 + this.y
}
/**
 * @description: 随机生成一个初始位置
 * @returns: 返回一个位置对象 {x: ?,y: ?}
 */
function randomPosition(){
    var y = Math.ceil(Math.random(Date.now())*4 - 1)*84 + 65
    var x = -800 * Math.random(Date.now()) -100
    var s = 100 * Math.ceil(Math.random(Date.now) * 3)
    // console.log(x)
    return {
        x: x,
        y: y,
        speed: s
    }
}


// 现在实例化你的所有对象
var game = new Game();
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = []
for(var i = 0; i < 7; i++) {
    allEnemies[i] = new Enemy(randomPosition())
}
var coll = new Collectible()
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player({
    x: 200,
    y: 410
})
// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
