// 1.点击开始游戏-->startPage消失-->游戏开始
// 2.随机出现食物，出现三节蛇开始运动
// 3.上下左右移动-->改变方向运动
// 4.判断吃到食物-->食物消失，蛇加一
// 5.判断游戏结束，弹出框

var content = document.getElementsByClassName('content')[0];
var oLoser = document.getElementsByClassName('loser')[0];
var oClose = document.getElementsByClassName('close')[0];
var startBtn = document.getElementsByClassName('startBtn')[0];
var startPBtn = document.getElementsByClassName('start-pause')[0];
var startPage = document.getElementsByClassName('startPage')[0];
var startPauseBtn = document.getElementsByClassName('start-pause')[0];
var oLeftPart = document.getElementsByClassName('left-part')[0];
var oScore = document.getElementById('score');
var oFinalScore = document.getElementById('final-score');

var speed = 200;
var timer = null;

init();
function init() {
    // 地图信息
    this.mapW = parseInt(map.offsetWidth);
    this.mapH = parseInt(map.offsetHeight);
    this.map = content;
    // 蛇信息
    this.snackBody = [[2,0,'head'], [1,0,'body'], [0,0,'body']];

    // 食物信息
    this.foodWidth = 20;
    this.foodHeight = 20;
    this.foodPositionX = 0;
    this.foodPositionY = 0;
    
    // 游戏信息
    this.score = 0;
    this.direction = 'right';
    this.toRight = true;
    this.toLeft = false;
    this.toDown = true;
    this.toUp = true;
    this.startFlag = true;
    this.overFlag = false;
    // food();
    // snack();
    bindEvent();
}
function food() {
    var food = document.createElement('div');
    food.setAttribute('class', 'food');
    foodPositionX = Math.floor(Math.random() * (mapW / foodWidth));  
    foodPositionY = Math.floor(Math.random() * (mapH / foodHeight));
    food.style.left = foodPositionX * foodWidth + 'px';
    food.style.top = foodPositionY * foodHeight + 'px';
    
    map.appendChild(food);
}
function snack() {
    for(var i = 0; i < snackBody.length; i++) {
        var snack = document.createElement('div');
        snack.style.left = snackBody[i][0] * 20 + 'px';
        snack.style.top = snackBody[i][1] * 20 + 'px';
        
        snack.classList.add(snackBody[i][2]);
        snack.classList.add('snack');
        map.appendChild(snack);
    }
    var snackHead = document.getElementsByClassName('head')[0];
    switch (direction) {
        case 'right':
            snackHead.style.transform = 'rotate(0deg)';
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
    // 蛇身
    for(var i = snackBody.length - 1; i > 0; i --) {
        snackBody[i][0] = snackBody[i - 1][0];
        snackBody[i][1] = snackBody[i - 1][1];
    }
    // 蛇头
    switch(direction) {
        case 'right':
            snackBody[0][0] = snackBody[0][0] + 1;
            break;
        case 'left':
            snackBody[0][0] = snackBody[0][0] - 1;
            break;
        case 'up':
            snackBody[0][1] = snackBody[0][1] - 1;
            break;
        case 'down':
            snackBody[0][1] = snackBody[0][1] + 1;
            break;
        default:
            break;
    }
    
    // 判断是否吃到食物，加分
    var len = snackBody.length;
    var snackTailX = snackBody[len - 1][0],
        snackTailY = snackBody[len - 1][1];
    if(snackBody[0][0] == foodPositionX && snackBody[0][1] == foodPositionY) {
        removeClass('food');
        food();
        // 因为不好判断新尾巴当前出现在哪个方向的点上，所以隐藏在最后一个尾部处，下一次移动会继承位置出现
        var newTail = [snackTailX, snackTailY, 'body']; 
        snackBody.push(newTail);
        score ++;
        oScore.innerText = score;
    }
    removeClass('snack');
    snack();

    // 判断是否撞壁，游戏结束
    if(snackBody[0][0] < 0 || snackBody[0][0] >= (mapW / 20) || snackBody[0][1] < 0 || snackBody[0][1] >= (mapH / 20)) {
        gameOver();
        return;
    }

    // 判断是否吃到自己，游戏结束
    for(var i = snackBody.length - 1; i > 0; i --) {
        if(snackBody[0][0] == snackBody[i][0] && snackBody[0][1] == snackBody[i][1]) {
            gameOver();
            return;
        }
    }
}

function removeClass(className) {
    var doms = document.getElementsByClassName(className);
    var len = doms.length;
    for(var i = 0; i < len; i ++) {
        doms[0].parentNode.removeChild(doms[0]);
    }
}

function gameOver() {
    clearInterval(timer);
    removeClass('snack');
    removeClass('food');
    oFinalScore.innerText = score;
    oLoser.style.display = 'block';

    snackBody = [[2, 0, 'head'], [1, 0, 'body'], [0, 0, 'body']];
    direction = 'right';
    toRight = true;
    toLeft = false;
    toDown = true;
    toUp = true;
    overFlag = true;
    startFlag = false;
    score = 0;
    oScore.innerText = score;
    startPauseBtn.style.backgroundImage = 'url(./img/start.png)';
}
function startGame() {
    food();
    snack();
    overFlag = false;
    timer = setInterval(move, speed);
}
function startPause() {
    if(startFlag) { // 开始转为暂停
        clearInterval(timer);
        startPauseBtn.style.backgroundImage = 'url(./img/start.png)';
        startFlag = false;
    }else { // 暂停转为开始
        startPauseBtn.style.backgroundImage = 'url(./img/pause.png)';
        startFlag = true;
        if(!overFlag) {
            timer = setInterval(move, speed);
        }else {
            startGame();
        }
    }
}
function changeDirection(e) {
    switch (e.which) {
        case 37:  //←
            if(toLeft) {
                direction = 'left';
                toLeft = true;
                toRight = false;
                toUp = true;
                toDown = true;
            }
            break;
        case 38:    //↑
            if(toUp) {
                direction = 'up';
                toLeft = true;
                toRight = true;
                toUp = true;
                toDown = false;
            }
            break;
        case 39:    //→
            if(toRight) {
                direction = 'right';
                toLeft = false;
                toRight = true;
                toUp = true;
                toDown = true;
            }
            break;
        case 40:    //↓
            if(toDown) {
                direction = 'down';
                toLeft = true;
                toRight = true;
                toUp = false;
                toDown = true;
            }
            break;
        default:
            break;
    }
}
function bindEvent() {
    startBtn.onclick = function() {
        startPage.style.display = 'none';
        oLeftPart.style.display = 'block';
        startGame();
    }
    startPBtn.onclick = function() {
        startPause();
    }
    oClose.onclick = function() {
        oLoser.style.display = 'none';
    }
    document.onkeydown = function(e) {
        var event = e || window.event;
        changeDirection(e);
    }
}