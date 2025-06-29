 // ボタン設定
let startButton = document.getElementById("startButton");
let jumpButton = document.getElementById("jumpButton");
let result = document.getElementById("result");

let totalTime = 10.0;
let gameTimer = null;
let autoEndTimer = null;
let startTime = null;
let jumped = false;

startButton.onclick = () => {
  result.textContent = "";
  jumpButton.disabled = false;
  startTime = performance.now();  // 高精度なタイマー
  jumped = false;

  gameTimer = setInterval(() => {
    let elapsed = (performance.now() - startTime) / 1000;
    if (elapsed >= totalTime && !jumped) {
      clearInterval(gameTimer);
      jumpButton.disabled = true;
      result.textContent = "時間切れ！ジャンプせずに終了！";
    }
  }, 50);
};

jumpButton.onclick = () => {
  if (!startTime || jumped) return;

  let elapsed = (performance.now() - startTime) / 1000;
  let rounded = parseFloat(elapsed.toFixed(2));

  if (rounded > totalTime) {
    // 押したときにすでに10秒を超えていた場合
    result.textContent = "ジャンプが間に合わなかった！";
    jumpButton.disabled = true;
    return;
  }

  jumped = true;
  clearInterval(gameTimer);
  jumpButton.disabled = true;

  if (rounded >= 7.09 && rounded <= 7.11) {
    result.textContent = `大成功！神業ジャンプ！ (${rounded.toFixed(2)} 秒)`;
  } else if (rounded >= 6.70 && rounded <= 7.60) {
    result.textContent = `成功！ナイスジャンプ (${rounded.toFixed(2)} 秒)`;
  } else if (rounded < 6.70) {
    result.textContent = `残念、早すぎぃ〜 (${rounded.toFixed(2)} 秒)`;
  } else {
    result.textContent = `残念、遅すぎぃ〜(${rounded.toFixed(2)} 秒)`;
  }
};


// キャラクターのジャンプアニメーション
//おじさんまだやる気ない
