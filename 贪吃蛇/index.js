// 1.点击开始游戏-->startPage消失-->游戏开始
// 2.随机出现食物，出现三节蛇开始运动
// 3.上下左右移动-->改变方向运动
// 4.判断吃到食物-->食物消失，蛇加一
// 5.判断游戏结束，弹出框

var main = document.getElementsByClassName('main')[0];
var content = document.getElementsByClassName('content')[0];
var oLoser = document.getElementsByClassName('loser')[0];
var oClose = document.getElementsByClassName('close')[0];
var startBtn = document.getElementsByClassName('startBtn')[0];
var startPause = document.getElementsByClassName('start-pause')[0];
var startPage = document.getElementsByClassName('startPage')[0];
var leftPart = document.getElementsByClassName('left-part')[0];
var scoreBox = document.getElementById('score');
var finalScore = document.getElementById('final-score');

var startPauseBool = true;
var startGameBool = true;
var speed = 200;
var snackMove = null;

init();
// 初始化
function init() {
    // 地图信息
    this.map = content;
    this.mapW = parseInt(map.offsetWidth);
    this.mapH = parseInt(map.offsetHeight);
    this.mapX = content.offsetLeft + main.offsetLeft;
    this.mapY = content.offsetTop + main.offsetTop;

    // 蛇信息
    this.snackBody = [[2,0,'head'], [1,0,'body'], [0,0,'body']];
    this.snackWidth = 20;
    this.snackHeight = 20;

    // 食物信息
    this.foodWidth = 20;
    this.foodHeight = 20;
    this.foodX = 0;
    this.foodY = 0;
    
    // 游戏信息
    this.direct = 'right';
    this.toRight = true;
    this.toLeft = false;
    this.toDown = true;
    this.toUp = true;
    this.sameDire = true;   //为了键盘反复按同一个方向，不改变运动速度过快运动
    
    //分数
    this.score = 0;
    scoreBox.innerText = this.score;
    bindEvent();
}
// 渲染食物
function food() {
    var mapLenW = this.mapW / this.foodWidth,
        mapLenH = this.mapH / this.foodHeight;
    var food = document.createElement('div');
    var test = true;
    food.setAttribute('class', 'food');
    this.foodX = Math.floor(Math.random() * mapLenW);  
    this.foodY = Math.floor(Math.random() * mapLenH);
    // 排除食物放在蛇身上
    while(test) {
        test = false;
        for(var i = this.snackBody.length - 1; i >= 0; i--) {
            if(this.foodX == this.snackBody[i][0] || this.foodY == this.snackBody[i][1]) {
                this.foodX = Math.floor(Math.random() * mapLenW);  
                this.foodY = Math.floor(Math.random() * mapLenH);
                test = true;
                break;
            }
        }
    }

    food.style.left = this.foodX * this.foodWidth + 'px';
    food.style.top = this.foodY * this.foodHeight + 'px';
    
    this.map.appendChild(food);
}
// 渲染蛇
function snack() {
    for(var i = 0; i < snackBody.length; i++) {
        var snack = document.createElement('div');
        snack.style.left = this.snackBody[i][0] * 20 + 'px';
        snack.style.top = this.snackBody[i][1] * 20 + 'px';
        
        snack.classList.add(this.snackBody[i][2]);
        snack.classList.add('snack');
        this.map.appendChild(snack);
    }
    var snackHead = document.getElementsByClassName('head')[0];
    switch (this.direct) {
        case 'right':
            break;
        case 'left':
            snackHead.style.transform = 'rotate(180deg)';
            break;
        case 'up':
            snackHead.style.transform = 'rotate(-90deg)';
            break;
        case 'down':
            snackHead.style.transform = 'rotate(90deg)';
            break;
        default:
            break;
    }
}
// 移动
function move() {
    // 蛇身位置
    for(var i = this.snackBody.length - 1; i > 0; i --) {
        this.snackBody[i][0] = this.snackBody[i - 1][0];
        this.snackBody[i][1] = this.snackBody[i - 1][1];
    }
    // 蛇头位置
    switch(this.direct) {
        case 'right':
            this.snackBody[0][0] += 1;
            break;
        case 'left':
            this.snackBody[0][0] -= 1;
            break;
        case 'up':
            this.snackBody[0][1] -= 1;
            break;
        case 'down':
            this.snackBody[0][1] += 1;
            break;
        default:
            break;
    }
    // 清除蛇，重新加载
    removeClass('snack');
    snack();

    // 判断是否吃到食物，加分
    var snackTailX = this.snackBody[this.snackBody.length - 1][0],
        snackTailY = this.snackBody[this.snackBody.length - 1][1];
    if(this.snackBody[0][0] == this.foodX && this.snackBody[0][1] == this.foodY) {
        removeClass('food');
        food();
        // 因为不好判断新尾巴当前出现在哪个方向的点上，所以隐藏在最后一个尾部处，下一次移动会继承位置出现
        this.snackBody.push([snackTailX, snackTailY, 'body']);
        this.score ++;
        scoreBox.innerText = score;
    }

    // 判断是否撞壁，游戏结束
    if(this.snackBody[0][0] < 0 || this.snackBody[0][0] >= (mapW / 20) || this.snackBody[0][1] < 0 || this.snackBody[0][1] >= (mapH / 20)) {
        reloadGame();
    }

    // 判断是否吃到自己，游戏结束
    var snackHeadX = this.snackBody[0][0],
        snackHeadY = this.snackBody[0][1];
    for(var i = this.snackBody.length - 1; i > 0; i --) {
        var snackBodyX = this.snackBody[i][0];
        var snackBodyY = this.snackBody[i][1];
        if(snackHeadX == snackBodyX && snackHeadY == snackBodyY) {
            reloadGame();
        }
    }
}
// 删除指定类名的元素
function removeClass(className) {
    var doms = document.getElementsByClassName(className);
    while(doms.length) {
        doms[0].parentNode.removeChild(doms[0]);
    }
}
// 重新加载游戏设置信息
function reloadGame() {
    removeClass('snack');
    removeClass('food');
    clearInterval(snackMove);
    startAndPauseGame();
    
    this.snackBody = [[2, 0, 'head'], [1, 0, 'body'], [0, 0, 'body']];
    this.direct = 'right';
    this.toRight = true;
    this.toLeft = false;
    this.toDown = true;
    this.toUp = true;
    startGameBool = true;
    startPauseBool = true;

    oLoser.style.display = 'block';
    finalScore.innerText = this.score;
    this.score = 0;
    scoreBox.innerText = this.score;
}
// 开始游戏
function startGame() {
    startPage.style.display = 'none';
    leftPart.style.display = 'block';
    food();
    snack();
}
// 按键盘设置方向
function setDire(code) {
    switch (code) {
        case 37:  //←
            if(this.toLeft) {
                if(this.direct == 'left') {
                    this.sameDire = true;
                }else {
                    this.sameDire = false;
                }
                this.direct = 'left';
                this.toLeft = true;
                this.toRight = false;
                this.toUp = true;
                this.toDown = true;
            }
            break;
        case 38:    //↑
            if(this.toUp) {
                if (this.direct == 'up') {
                    this.sameDire = true;
                } else {
                    this.sameDire = false;
                }
                this.direct = 'up';
                this.toLeft = true;
                this.toRight = true;
                this.toUp = true;
                this.toDown = false;
            }
            break;
        case 39:    //→
            if(this.toRight) {
                if (this.direct == 'right') {
                    this.sameDire = true;
                } else {
                    this.sameDire = false;
                }
                this.direct = 'right';
                this.toLeft = false;
                this.toRight = true;
                this.toUp = true;
                this.toDown = true;
            }
            break;
        case 40:    //↓
            if(this.toDown) {
                if (this.direct == 'down') {
                    this.sameDire = true;
                } else {
                    this.sameDire = false;
                }
                this.direct = 'down';
                this.toLeft = true;
                this.toRight = true;
                this.toUp = false;
                this.toDown = true;
            }
            break;
        default:
            break;
    }
}
// 按鼠标点击设置方向
function setDireByClick(clickX, clickY) {
    var snackHeadX = snackBody[0][0],
        snackHeadY = snackBody[0][1];
    if(this.direct == 'left' || this.direct == 'right') {
        if(clickY > snackHeadY) {
            this.direct = 'down';
            this.toLeft = true;
            this.toRight = true;
            this.toUp = true;
            this.toDown = false;
        }else {
            this.direct = 'up';
            this.toLeft = true;
            this.toRight = true;
            this.toUp = false;
            this.toDown = true;
        }
    }else if(this.direct == 'up' || this.direct == 'down'){
        if(clickX > snackHeadX) {
            this.direct = 'right';
            this.toLeft = false;
            this.toRight = true;
            this.toUp = true;
            this.toDown = true;
        }else {
            this.direct = 'left';
            this.toLeft = true;
            this.toRight = false;
            this.toUp = true;
            this.toDown = true;
        }
    }    
}
// 开始/暂停游戏
function startAndPauseGame() {
    if(startPauseBool) { // 开始
        if(startGameBool) {
            startGameBool = false;
            startGame();
        }
        snackMove = setInterval(move, speed);
        startPause.style.backgroundImage = 'url(./img/pause.png)';
        //  键盘，控制方向
        document.onkeydown = function(e) {
            var _this = window;
            var code = e.which;
            setDire(code);
            if(!_this.sameDire) {
                move();
            }
        }
        // 鼠标点击，控制方向
        main.onmousedown = function(e) {
            var _this = window;
            var clickX = (e.clientX - _this.mapX) / _this.snackWidth,
            clickY = (e.clientY - _this.mapY) / _this.snackHeight;
            setDireByClick(clickX, clickY);
            move();
        }
        startPauseBool = false;
    }else { // 暂停
        clearInterval(snackMove);
        startPause.style.backgroundImage = 'url(./img/start.png)';
        document.onkeydown = function(e) {
            e.returnValue = false;
            return false;
        }
        main.onmousedown = function (e) {
            e.returnValue = false;
            return false;
        }
        startPauseBool = true;
    }
}
// 统一绑定事件
function bindEvent() {
    startBtn.onclick = function() {
        window.begin = true;
        startAndPauseGame();
    }
    startPause.onclick = function() {
        startAndPauseGame();
    }
    oClose.onclick = function() {
        oLoser.style.display = 'none';
    }
}