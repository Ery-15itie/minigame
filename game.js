// HTML要素の取得
// ゲームで使用するHTML要素をIDで取得し、変数に格納します。
let startButton = document.getElementById("startButton");
let jumpButton = document.getElementById("jumpButton");
let result = document.getElementById("result"); // 結果表示エリア
let character = document.getElementById("character"); // キャラクター画像
let timerDisplay = document.getElementById("timerDisplay"); // 経過秒数を表示する<p>
let shareButton = document.getElementById("shareButton");
let shareArea = document.getElementById("shareArea");

// ゲーム状態を管理する変数
let totalTime = 10.0;       // 制限時間（秒）
let gameTimer = null;       // ゲーム用タイマー（interval）
let startTime = null;       // スタート時刻（高精度）
let jumped = false;         // ジャンプしたかどうか

// 初期設定
// ページ読み込み時にUIの初期状態を設定

jumpButton.disabled = true; // ページ読み込み時はジャンプボタンを無効化
timerDisplay.style.display = "none"; // 経過タイマーを初期状態では非表示
shareArea.style.display = "none"; // シェアエリアを初期状態では非表示

// ゲーム開始時の処理
startButton.onclick = () => {
    // ゲーム開始時はシェアエリアを非表示に
    shareArea.style.display = "none";

    // --- 状態リセット ---
    result.textContent = "";             // 結果の初期化
    timerDisplay.textContent = "";       // タイム表示初期化
    jumpButton.disabled = false;         // ジャンプボタン有効化
    jumped = false;                      // ジャンプ状態リセット

    // --- タイマー初期化（前回分が残っていればクリア） ---
    clearInterval(gameTimer);

    // --- 時刻記録 ---
    startTime = performance.now();

    // タイマー表示を有効にする
    timerDisplay.style.display = "block";

    // タイマー部分を 0.1秒間隔 & 3秒制限で表示
    gameTimer = setInterval(() => {
        let elapsed = (performance.now() - startTime) / 1000;
        let rounded = parseFloat(elapsed.toFixed(1));

        if (elapsed <= 3.0) {
            timerDisplay.textContent = `経過時間: ${rounded} 秒`;
        } else {
            timerDisplay.textContent = ""; // 3秒経過後はタイマー表示を消す
            timerDisplay.style.display = "none"; // HTML要素も非表示にする
        }

        if (elapsed >= totalTime && !jumped) {
            clearInterval(gameTimer);
            jumpButton.disabled = true;
            result.textContent = "時間切れ！ジャンプせずに終了！";
            timerDisplay.style.display = "none"; // 時間切れ時もタイマー表示を非表示に
            shareArea.style.display = "block"; // 時間切れでもシェアボタンを表示
        }
    }, 100);
};

// ジャンプボタンを押したときの処理
jumpButton.onclick = () => {
    // ゲームが開始されていない、または既にジャンプ済みの場合は何もしない
    if (!startTime || jumped) return;

    let elapsed = (performance.now() - startTime) / 1000;
    let rounded = parseFloat(elapsed.toFixed(2));

    // 10秒を超えていたら無効ジャンプ
    if (rounded > totalTime) {
        result.textContent = "ジャンプが間に合わなかった！";
        jumpButton.disabled = true;
        timerDisplay.style.display = "none"; // タイマー表示を非表示に
        shareArea.style.display = "none"; // ジャンプが間に合わない場合はシェアボタンを出さない
        return;
    }

    // --- 状態更新（ジャンプ済み） ---
    jumped = true;
    clearInterval(gameTimer);         // タイマーを止める
    jumpButton.disabled = true;
    timerDisplay.textContent = "";    // 経過タイマーの表示を消す
    timerDisplay.style.display = "none"; // タイマー表示を完全に非表示に

    // --- アニメーション実行 ---
    character.classList.remove("jump");
    void character.offsetWidth;       // アニメーション再実行のテクニック
    character.classList.add("jump");

    // --- 結果判定 ---
    let resultMessage = ""; // 結果メッセージを保持する新しい変数
    if (rounded >= 7.05 && rounded <= 7.15) {
        resultMessage = `🎯 大成功！神業ジャンプ！ (${rounded.toFixed(2)} 秒)`;
    } else if (rounded >= 6.60 && rounded <= 7.60) {
        resultMessage = `⭕ 成功！ナイスジャンプ (${rounded.toFixed(2)} 秒)`;
    } else if (rounded < 6.60) {
        resultMessage = `❌ 残念、早すぎぃ〜 (${rounded.toFixed(2)} 秒)`;
    } else {
        resultMessage = `❌ 残念、遅すぎぃ〜 (${rounded.toFixed(2)} 秒)`;
    }
    result.textContent = resultMessage; // 結果をHTMLに表示

    // 結果が出たらシェアエリアを表示
    shareArea.style.display = "block";

    // シェアボタンがクリックされたときの処理
    // ここでイベントリスナーを設定することで、ジャンプの度に結果メッセージが更新される
    shareButton.onclick = () => {
        const gameTitle = "かみないおじさんの神業ジャンプ";
        const shareUrl = window.location.href; // 現在のページのURLを取得

        // Twitter用のテキストとURLを準備
        const twitterHashtag = "#かみないおじさん"; // シェアしたいハッシュタグ
        // resultMessage 変数を使って、正しい結果メッセージをツイートテキストに含める
        const tweetText = `${resultMessage} ${gameTitle}をプレイ！ ${twitterHashtag}`;
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;

        // 新しいウィンドウでTwitterのシェア画面を開く
        window.open(twitterShareUrl, '_blank', 'width=600,height=400');
    };
};
