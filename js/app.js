var boy_area = [1000,1000,83,89]
var g_status = 'playing'
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
        fail();
    }
    this.render();
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(pos) {
    this.sprite = 'images/char-boy.png';
    this.x = pos.x;
    this.y = pos.y;
    boy_area[0] = 17 + this.x
    boy_area[2] = 83 + this.x
    boy_area[1] = 10 + this.y
}
Player.prototype.update = function(dt) {
    
}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(keys) {
    // console.log(keys);
    switch(keys) {
        case 'left':
            this.x = this.x < 100 ? this.x : this.x - 100;
            break;
        case 'right':
            this.x = this.x > 399 ? this.x : this.x + 100;
            break;
        case 'up':
            this.y = this.y < 0 ? this.y : this.y - 84;
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
/**
 * @description: 处理游戏失败
 */
function fail() {
    console.log('hit')
    player = new Player({
        x: 200,
        y: 410
    })
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = []
for(var i = 0; i < 7; i++) {
    allEnemies[i] = new Enemy(randomPosition())
}
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
