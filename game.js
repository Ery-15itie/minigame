// HTML要素の取得
let startButton = document.getElementById("startButton");
let jumpButton = document.getElementById("jumpButton");
let result = document.getElementById("result");
let character = document.getElementById("character");
let timerDisplay = document.getElementById("timerDisplay"); // 経過秒数を表示する<p>

// ゲーム状態を管理する変数
let totalTime = 10.0;       // 制限時間（秒）
let gameTimer = null;       // ゲーム用タイマー（interval）
let startTime = null;       // スタート時刻（高精度）
let jumped = false;         // ジャンプしたかどうか

// ゲーム開始時のリセット処理
startButton.onclick = () => {
  // --- 状態リセット ---
  result.textContent = "";           // 結果の初期化
  timerDisplay.textContent = "";     // タイム表示初期化
  jumpButton.disabled = false;       // ジャンプボタン有効化
  jumped = false;                    // ジャンプ状態リセット

  // --- タイマー初期化（前回分が残っていればクリア） ---
  clearInterval(gameTimer);

  // --- 時刻記録 ---
  startTime = performance.now();

  // タイマー部分を 0.1秒間隔 & 3秒制限で表示に変更

  gameTimer = setInterval(() => {
    let elapsed = (performance.now() - startTime) / 1000;
    let rounded = parseFloat(elapsed.toFixed(1));

    if (elapsed <= 3.0) {
      timerDisplay.textContent = `経過時間: ${rounded} 秒`;
    } else {
      timerDisplay.textContent = "";
    }

    if (elapsed >= totalTime && !jumped) {
      clearInterval(gameTimer);
      jumpButton.disabled = true;
      result.textContent = "時間切れ！ジャンプせずに終了！";
    }
  }, 100);
};

// ジャンプボタンを押したときの処理
jumpButton.onclick = () => {
  if (!startTime || jumped) return;

  let elapsed = (performance.now() - startTime) / 1000;
  let rounded = parseFloat(elapsed.toFixed(2));

  // 10秒を超えていたら無効ジャンプ
  if (rounded > totalTime) {
    result.textContent = "ジャンプが間に合わなかった！";
    jumpButton.disabled = true;
    return;
  }

  // 状態更新（ジャンプ済み）
  jumped = true;
  clearInterval(gameTimer);         // タイマーを止める
  jumpButton.disabled = true;
  timerDisplay.textContent = "";    // 経過タイマーの表示を消す

  // --- アニメーション実行 ---
  character.classList.remove("jump");
  void character.offsetWidth;       // アニメーション再実行のテクニック
  character.classList.add("jump");

  // --- 結果判定 ---
  if (rounded >= 7.05 && rounded <= 7.15) {
    result.textContent = `🎯 大成功！神業ジャンプ！ (${rounded.toFixed(2)} 秒)`;
  } else if (rounded >= 6.60 && rounded <= 7.60) {
    result.textContent = `⭕ 成功！ナイスジャンプ (${rounded.toFixed(2)} 秒)`;
  } else if (rounded < 6.60) {
    result.textContent = `❌ 残念、早すぎぃ〜 (${rounded.toFixed(2)} 秒)`;
  } else {
    result.textContent = `❌ 残念、遅すぎぃ〜 (${rounded.toFixed(2)} 秒)`;
  }
};
