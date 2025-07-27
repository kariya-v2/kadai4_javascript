// --- GAME OVER・リスタート・スコア・ジャンプ調整デモ（game-demo-area-2） ---
window.addEventListener('DOMContentLoaded', function() {
    const area = document.getElementById('game-demo-area-2');
    const scoreDisplay = document.getElementById('score-display');
    const gameoverMsg = document.getElementById('gameover-message-2');
    const restartBtn = document.getElementById('restart-btn');
    if (!area || !scoreDisplay || !gameoverMsg || !restartBtn) return;

    // 犬の生成
    const dog = document.createElement('img');
    dog.src = 'images/dog.png';
    dog.id = 'dog';
    dog.style.position = 'absolute';
    dog.style.left = '30px';
    dog.style.bottom = '10px';
    dog.style.width = '60px';
    area.appendChild(dog);

    let isJumping = false;
    let jumpHeight = 100; // ジャンプ力UP
    let jumpSpeed = 6;    // ジャンプ速度UP
    let dogBottom = 10;
    let score = 0;
    let gameOver = false;
    let isCrouching = false;
    let isFastDrop = false;

    // ジャンプ処理（滞空時間延長）
    function jump() {
        if (isJumping) return;
        isJumping = true;
        let upInterval = setInterval(() => {
            if (dogBottom < jumpHeight && !isFastDrop) {
                dogBottom += jumpSpeed;
                dog.style.bottom = dogBottom + 'px';
            } else {
                clearInterval(upInterval);
                let airTime = 20; // 滞空時間（ms単位で調整）
                setTimeout(() => {
                    let downInterval = setInterval(() => {
                        if (dogBottom > 10) {
                            // 急降下時は速度アップ
                            let dropSpeed = isFastDrop ? jumpSpeed * 2.5 : jumpSpeed;
                            dogBottom -= dropSpeed;
                            // 着地を下回らないように補正
                            if (dogBottom < 10) dogBottom = 10;
                            dog.style.bottom = dogBottom + 'px';
                        } else {
                            dogBottom = 10;
                            dog.style.bottom = '10px';
                            clearInterval(downInterval);
                            isJumping = false;
                            isFastDrop = false;
                        }
                    }, 20);
                }, airTime * 5);
            }
        }, 20);
    }

    document.addEventListener('keydown', function(e) {
        if (gameOver) return;
        if ((e.code === 'ArrowUp' || e.code === 'Space') && !isJumping) {
            jump();
        }
        if (e.code === 'ArrowDown') {
            dog.src = 'images/crouching_dog.png';
            isCrouching = true;
            if (isJumping) {
                isFastDrop = true;
            }
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.code === 'ArrowDown') {
            dog.src = 'images/dog.png';
            isCrouching = false;
            isFastDrop = false;
        }
    });

    function spawnObstacle() {
        const isCactus = Math.random() < 0.5;
        const obs = document.createElement('img');
        obs.src = isCactus ? 'images/cactus.png' : 'images/arrow.png';
        obs.className = isCactus ? 'cactus' : 'arrow';
        obs.style.position = 'absolute';
        obs.style.left = area.offsetWidth + 'px';
        obs.style.width = '40px';
        if (isCactus) {
            obs.style.bottom = '0px';
        } else {
            const randTop = Math.floor(Math.random() * (area.offsetHeight - 40));
            obs.style.top = randTop + 'px';
        }
        area.appendChild(obs);

        let pos = area.offsetWidth;
        const speed = 4; // 障害物の速度を統一
    let isFastDrop = false;
        const move = setInterval(() => {
            if (gameOver) {
                clearInterval(move);
                obs.remove();
                return;
            }
            pos -= speed;
            obs.style.left = pos + 'px';

            // 当たり判定（イヌの判定を小さく、しゃがみ時は高さを低く）
            const dogRect = dog.getBoundingClientRect();
            const obsRect = obs.getBoundingClientRect();
            // 判定用の縮小値
            let shrinkW = 0.7, shrinkH = isCrouching ? 0.4 : 0.7;
            const dogHitBox = {
                left: dogRect.left + dogRect.width * (1 - shrinkW) / 2,
                right: dogRect.right - dogRect.width * (1 - shrinkW) / 2,
                top: dogRect.top + dogRect.height * (1 - shrinkH) / 2,
                bottom: dogRect.bottom - dogRect.height * (1 - shrinkH) / 2
            };
            if (
                dogHitBox.left < obsRect.right &&
                dogHitBox.right > obsRect.left &&
                dogHitBox.top < obsRect.bottom &&
                dogHitBox.bottom > obsRect.top
            ) {
                clearInterval(move);
                gameoverMsg.style.display = 'block';
                gameOver = true;
            }

            if (pos < -40) {
                clearInterval(move);
                obs.remove();
                if (!gameOver) {
                    score++;
                    scoreDisplay.textContent = "SCORE: " + score;
                }
            }
        }, 16);
    }

    function startGameObstacles() {
        function loop() {
            if (gameOver) return;
            spawnObstacle();
            const next = Math.random() * 1000 + 1000;
            setTimeout(loop, next);
        }
        loop();
    }

    restartBtn.addEventListener('click', function() {
        // 初期化
        gameoverMsg.style.display = 'none';
        score = 0;
        scoreDisplay.textContent = "SCORE: 0";
        gameOver = false;
        dogBottom = 10;
        dog.style.bottom = '10px';
        dog.src = 'images/dog.png';
        // 障害物を全て消す
        Array.from(area.querySelectorAll('.cactus, .arrow')).forEach(e => e.remove());
        startGameObstacles();
    });

    startGameObstacles();
});
// --- 統合デモエリア（game-demo-area） ---
window.addEventListener('DOMContentLoaded', function() {
    const area = document.getElementById('game-demo-area');
    if (!area) return;

    // 犬の生成
    const dog = document.createElement('img');
    dog.src = 'images/dog.png';
    dog.id = 'dog';
    dog.style.position = 'absolute';
    dog.style.left = '30px';
    dog.style.bottom = '10px';
    dog.style.width = '60px';
    area.appendChild(dog);

    let isJumping = false;
    let jumpHeight = 60;
    let jumpSpeed = 4;
    let dogBottom = 10;

    function jump() {
        if (isJumping) return;
        isJumping = true;
        let upInterval = setInterval(() => {
            if (dogBottom < jumpHeight) {
                dogBottom += jumpSpeed;
                dog.style.bottom = dogBottom + 'px';
            } else {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (dogBottom > 10) {
                        dogBottom -= jumpSpeed;
                        dog.style.bottom = dogBottom + 'px';
                    } else {
                        clearInterval(downInterval);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }

    document.addEventListener('keydown', function(e) {
        if (e.code === 'ArrowUp' || e.code === 'Space') {
            jump();
        }
        if (e.code === 'ArrowDown') {
            dog.src = 'images/crouching_dog.png';
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.code === 'ArrowDown') {
            dog.src = 'images/dog.png';
        }
    });

    function spawnObstacle() {
        const isCactus = Math.random() < 0.5;
        const obs = document.createElement('img');
        obs.src = isCactus ? 'images/cactus.png' : 'images/arrow.png';
        obs.className = isCactus ? 'cactus' : 'arrow';
        obs.style.position = 'absolute';
        obs.style.left = area.offsetWidth + 'px';
        obs.style.width = '40px';
        if (isCactus) {
            obs.style.bottom = '0px';
        } else {
            const randTop = Math.floor(Math.random() * (area.offsetHeight - 40));
            obs.style.top = randTop + 'px';
        }
        area.appendChild(obs);

        let pos = area.offsetWidth;
        const speed = isCactus ? 4 : 6;
        const move = setInterval(() => {
            pos -= speed;
            obs.style.left = pos + 'px';

            // 当たり判定
            const dogRect = dog.getBoundingClientRect();
            const obsRect = obs.getBoundingClientRect();
            if (
                dogRect.left < obsRect.right &&
                dogRect.right > obsRect.left &&
                dogRect.top < obsRect.bottom &&
                dogRect.bottom > obsRect.top
            ) {
                clearInterval(move);
                document.getElementById('gameover-message').style.display = 'block';
            }

            if (pos < -40) {
                clearInterval(move);
                obs.remove();
            }
        }, 16);
    }

    function startGameObstacles() {
        function loop() {
            if (document.getElementById('gameover-message').style.display === 'block') return;
            spawnObstacle();
            const next = Math.random() * 1000 + 1000;
            setTimeout(loop, next);
        }
        loop();
    }

    startGameObstacles();
});
// --- 障害物デモエリア（obstacle-demo-area） ---
window.addEventListener('DOMContentLoaded', function() {
    const demoArea = document.getElementById('obstacle-demo-area');
    if (!demoArea) return;

    // サボテンを出現・移動させる関数
    function spawnCactus() {
        const cactus = document.createElement('img');
        cactus.src = 'images/cactus.png';
        cactus.className = 'cactus';
        cactus.style.position = 'absolute';
        cactus.style.bottom = '0px';
        cactus.style.left = demoArea.offsetWidth + 'px';
        cactus.style.width = '40px';
        demoArea.appendChild(cactus);

        let pos = demoArea.offsetWidth;
        const move = setInterval(() => {
            pos -= 4;
            cactus.style.left = pos + 'px';
            if (pos < -40) {
                clearInterval(move);
                cactus.remove();
            }
        }, 16);
    }

    // 矢を出現・移動させる関数
    function spawnArrow() {
        const arrow = document.createElement('img');
        arrow.src = 'images/arrow.png';
        arrow.className = 'arrow';
        arrow.style.position = 'absolute';
        // ランダムな高さ（地面から20px〜エリア上端まで）
        const randTop = Math.floor(Math.random() * (demoArea.offsetHeight - 40));
        arrow.style.top = randTop + 'px';
        arrow.style.left = demoArea.offsetWidth + 'px';
        arrow.style.width = '40px';
        demoArea.appendChild(arrow);

        let pos = demoArea.offsetWidth;
        const move = setInterval(() => {
            pos -= 6;
            arrow.style.left = pos + 'px';
            if (pos < -40) {
                clearInterval(move);
                arrow.remove();
            }
        }, 16);
    }

    // ランダムな間隔で障害物を出現させる
    function startObstaclesDemo() {
        function loop() {
            if (Math.random() < 0.5) {
                spawnCactus();
            } else {
                spawnArrow();
            }
            // 次の出現までランダム（1〜2秒）＋必ず1秒インターバル
            const next = Math.random() * 1000 + 1000;
            setTimeout(loop, next);
        }
        loop();
    }

    startObstaclesDemo();
});
// デモエリアにdog.pngを表示し、ジャンプ・しゃがみ動作を実装
window.addEventListener('DOMContentLoaded', function() {
    const demoArea = document.getElementById('dog-demo-area');
    if (!demoArea) return;
    const dog = document.createElement('img');
    dog.src = 'images/dog.png';
    dog.id = 'dog-demo-img';
    dog.style.position = 'absolute';
    dog.style.left = '30px';
    dog.style.bottom = '10px';
    dog.style.width = '60px';
    demoArea.appendChild(dog);

    let isJumping = false;
    let jumpHeight = 60;
    let jumpSpeed = 4;
    let dogBottom = 10;

    function jump() {
        if (isJumping) return;
        isJumping = true;
        let upInterval = setInterval(() => {
            if (dogBottom < jumpHeight) {
                dogBottom += jumpSpeed;
                dog.style.bottom = dogBottom + 'px';
            } else {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (dogBottom > 10) {
                        dogBottom -= jumpSpeed;
                        dog.style.bottom = dogBottom + 'px';
                    } else {
                        clearInterval(downInterval);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }

    document.addEventListener('keydown', function(e) {
        if (e.code === 'ArrowUp' || e.code === 'Space') {
            jump();
        }
        if (e.code === 'ArrowDown') {
            dog.src = 'images/crouching_dog.png';
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.code === 'ArrowDown') {
            dog.src = 'images/dog.png';
        }
    });
});
// script.js
// 今後、恐竜ゲームのJavaScriptコードがここに追加されます。
// 現時点では、背景のアニメーションはCSSによって行われています。

// 恐竜要素への参照
const dino = document.getElementById('dino');

// 今後、ジャンプなどの機能がここに追加されます。
// --- index.htmlから移動 ---
// 完成版ゲーム用のJS（他デモとID競合しないように）
window.addEventListener('DOMContentLoaded', function() {
    const area = document.getElementById('final-game-area');
    const scoreDisplay = document.getElementById('final-score-display');
    const gameoverMsg = document.getElementById('final-gameover-message');
    const restartBtn = document.getElementById('final-restart-btn');
    const ground = document.getElementById('background-ground');
    if (!area || !scoreDisplay || !gameoverMsg || !restartBtn || !ground) return;
    // 犬の生成
    const dog = document.createElement('img');
    dog.src = 'images/dog.png';
    dog.id = 'final-dog';
    dog.style.position = 'absolute';
    dog.style.left = '30px';
    dog.style.bottom = '10px';
    dog.style.width = '60px';
    dog.style.zIndex = '1';
    area.insertBefore(dog, scoreDisplay);
    let isJumping = false;
    let jumpHeight = 100;
    let jumpSpeed = 6;
    let dogBottom = 10;
    let score = 0;
    let gameOver = false;
    let isCrouching = false;
    let isFastDrop = false;
    function jump() {
        if (isJumping) return;
        isJumping = true;
        let upInterval = setInterval(() => {
            if (dogBottom < jumpHeight && !isFastDrop) {
                dogBottom += jumpSpeed;
                dog.style.bottom = dogBottom + 'px';
            } else {
                clearInterval(upInterval);
                let airTime = 20;
                setTimeout(() => {
                    let downInterval = setInterval(() => {
                        if (dogBottom > 10) {
                            let dropSpeed = isFastDrop ? jumpSpeed * 2.5 : jumpSpeed;
                            dogBottom -= dropSpeed;
                            if (dogBottom < 10) dogBottom = 10;
                            dog.style.bottom = dogBottom + 'px';
                        } else {
                            dogBottom = 10;
                            dog.style.bottom = '10px';
                            clearInterval(downInterval);
                            isJumping = false;
                            isFastDrop = false;
                        }
                    }, 20);
                }, airTime * 5);
            }
        }, 20);
    }
    document.addEventListener('keydown', function(e) {
        if (gameOver) return;
        if ((e.code === 'ArrowUp' || e.code === 'Space') && !isJumping) {
            jump();
        }
        if (e.code === 'ArrowDown') {
            dog.src = 'images/crouching_dog.png';
            isCrouching = true;
            if (isJumping) {
                isFastDrop = true;
            }
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.code === 'ArrowDown') {
            dog.src = 'images/dog.png';
            isCrouching = false;
            isFastDrop = false;
        }
    });
    function spawnObstacle() {
        const isCactus = Math.random() < 0.5;
        const obs = document.createElement('img');
        obs.src = isCactus ? 'images/cactus.png' : 'images/arrow.png';
        obs.className = isCactus ? 'cactus' : 'arrow';
        obs.style.position = 'absolute';
        obs.style.left = area.offsetWidth + 'px';
        obs.style.width = '40px';
        obs.style.zIndex = '1';
        if (isCactus) {
            obs.style.bottom = '0px';
        } else {
            const randTop = Math.floor(Math.random() * (area.offsetHeight - 40));
            obs.style.top = randTop + 'px';
        }
        area.appendChild(obs);
        let pos = area.offsetWidth;
        const speed = 4;
        const move = setInterval(() => {
            if (gameOver) {
                clearInterval(move);
                obs.remove();
                return;
            }
            pos -= speed;
            obs.style.left = pos + 'px';
            const dogRect = dog.getBoundingClientRect();
            const obsRect = obs.getBoundingClientRect();
            let shrinkW = 0.7, shrinkH = isCrouching ? 0.4 : 0.7;
            const dogHitBox = {
                left: dogRect.left + dogRect.width * (1 - shrinkW) / 2,
                right: dogRect.right - dogRect.width * (1 - shrinkW) / 2,
                top: dogRect.top + dogRect.height * (1 - shrinkH) / 2,
                bottom: dogRect.bottom - dogRect.height * (1 - shrinkH) / 2
            };
            if (
                dogHitBox.left < obsRect.right &&
                dogHitBox.right > obsRect.left &&
                dogHitBox.top < obsRect.bottom &&
                dogHitBox.bottom > obsRect.top
            ) {
                clearInterval(move);
                gameoverMsg.style.display = 'block';
                restartBtn.style.display = 'inline-block';
                gameOver = true;
            }
            if (pos < -40) {
                clearInterval(move);
                obs.remove();
                if (!gameOver) {
                    score++;
                    scoreDisplay.textContent = "SCORE: " + score;
                }
            }
        }, 16);
    }
    function startGameObstacles() {
        function loop() {
            if (gameOver) return;
            spawnObstacle();
            const next = Math.random() * 1000 + 1000;
            setTimeout(loop, next);
        }
        loop();
    }
    restartBtn.addEventListener('click', function() {
        gameoverMsg.style.display = 'none';
        restartBtn.style.display = 'none';
        score = 0;
        scoreDisplay.textContent = "SCORE: 0";
        gameOver = false;
        dogBottom = 10;
        dog.style.bottom = '10px';
        dog.src = 'images/dog.png';
        Array.from(area.querySelectorAll('.cactus, .arrow')).forEach(e => e.remove());
        startGameObstacles();
    });
    startGameObstacles();
});