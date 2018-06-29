// 1.点击开始游戏-->startPage消失-->游戏开始
// 2.随机出现食物，出现三节蛇开始运动
// 3.上下左右移动-->改变方向运动
// 4.判断吃到食物-->食物消失，蛇加一
// 5.判断游戏结束，弹出框

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
function init() {
    // 地图信息
    this.mapW = parseInt(map.offsetWidth);
    this.mapH = parseInt(map.offsetHeight);
    this.map = content;

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
    
    //分数
    this.score = 0;
    scoreBox.innerText = this.score;
    bindEvent();
}
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
        return;
    }

    // 判断是否吃到自己，游戏结束
    var snackHeadX = this.snackBody[0][0],
        snackHeadY = this.snackBody[0][1];
    for(var i = this.snackBody.length - 1; i > 0; i --) {
        var snackBodyX = this.snackBody[i][0];
        var snackBodyY = this.snackBody[i][1];
        if(snackHeadX == snackBodyX && snackHeadY == snackBodyY) {
            reloadGame();
            return;
        }
    }
}

function removeClass(className) {
    var doms = document.getElementsByClassName(className);
    while(doms.length) {
        doms[0].parentNode.removeChild(doms[0]);
    }
}

function reloadGame() {
    removeClass('snack');
    removeClass('food');
    clearInterval(snackMove);
    
    this.snackBody = [[2, 0, 'head'], [1, 0, 'body'], [0, 0, 'body']];
    this.direct = 'right';
    this.toRight = true;
    this.toLeft = false;
    this.toDown = true;
    this.toUp = true;
    startPauseBool = true;
    startGameBool = true;
    
    oLoser.style.display = 'block';
    startPause.style.backgroundImage = 'url(./img/start.png)';
    finalScore.innerText = this.score;
    this.score = 0;
    scoreBox.innerText = this.score;
}
function startGame() {
    startPage.style.display = 'none';
    leftPart.style.display = 'block';
    food();
    snack();
}
function setDire(code) {
    switch (code) {
        case 37:  //←
            if(this.toLeft) {
                this.direct = 'left';
                this.toLeft = true;
                this.toRight = false;
                this.toUp = true;
                this.toDown = true;
            }
            break;
        case 38:    //↑
            if(this.toUp) {
                this.direct = 'up';
                this.toLeft = true;
                this.toRight = true;
                this.toUp = true;
                this.toDown = false;
            }
            break;
        case 39:    //→
            if(this.toRight) {
                this.direct = 'right';
                this.toLeft = false;
                this.toRight = true;
                this.toUp = true;
                this.toDown = true;
            }
            break;
        case 40:    //↓
            if(this.toDown) {
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
function startAndPauseGame() {
    if(startPauseBool) { // 开始
        if(startGameBool) {
            startGameBool = false;
            startGame();
        }
        snackMove = setInterval(move, speed);
        startPause.style.backgroundImage = 'url(./img/pause.png)';
        document.onkeydown = function(e) {
            var code = e.which;
            setDire(code);
        }
        startPauseBool = false;
    }else { // 暂停
        clearInterval(snackMove);
        startPause.style.backgroundImage = 'url(./img/start.png)';
        document.onkeydown = function(e) {
            e.returnValue = false;
            return false;
        }
        startPauseBool = true;
    }
}
function bindEvent() {
    startBtn.onclick = function() {
        startAndPauseGame();
    }
    startPause.onclick = function() {
        startAndPauseGame();
    }
    oClose.onclick = function() {
        oLoser.style.display = 'none';
    }
}