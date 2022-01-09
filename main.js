"use strict";

const x = 4; // 横のマスの数
const y = 4; // 縦のマスの数
let array = []; // マスの数
let clickCount = 0; // クリックした数をカウント
let sliceEnd = 1; // 表示させる個数
const table = document.querySelector("table");
const btn = document.getElementById("btn");
const modal = document.getElementById("modal");
// パソコンかスマートフォンか判定
const eventType = window.ontouchstart !== null ? "click" : "touchstart";

// ゲーム画面生成
function init() {
  btn.textContent = "Clicik Start";
  btn.addEventListener(eventType, gameStart);
  let id = 0;
  for (let i = 0; i < y; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < x; j++) {
      let td = document.createElement("td");
      td.id = id;
      array.push(id);
      id++;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

init();

// クイズ作成
function makeQuiz() {
  array.slice(0, sliceEnd).forEach((value) => {
    document.getElementById(value).classList.remove("color");
    document.getElementById(value).textContent = "";
  });
  // Fisher–Yates shuffleアルゴリズムでシャッフル
  let a = array.length;
  while (a) {
    let j = Math.floor(Math.random() * a);
    let t = array[--a];
    array[a] = array[j];
    array[j] = t;
  }
}

// ゲームをスタートさせる
function gameStart() {
  btn.removeEventListener(eventType, gameStart);
  makeQuiz();
  document.querySelector("p").classList.add("hidden");
  btn.classList.add("hidden");
  btn.textContent = "";
  modal.classList.remove("hidden");
  modal.textContent = `Level-${sliceEnd}`;

  modal
    .animate({ opacity: [0.9, 1] }, { duration: 1000, fill: "forwards" })
    .finished.then(() => {
      modal.textContent = "Ready";

      modal
        .animate({ opacity: [1, 0] }, { duration: 2000, fill: "forwards" })
        .finished.then(() => {
          modal.classList.add("hidden");
          shwoNumber();
          setTimeout(hiddenNumber, 1000);
        });
    });
}

//　数字を表示
function shwoNumber() {
  array.slice(0, sliceEnd).forEach((value, index) => {
    document.getElementById(value).classList.add("color");
    document.getElementById(value).style.color = "white";
    document.getElementById(value).textContent = index + 1;
  });
}

// 数字を隠す
function hiddenNumber() {
  array.slice(0, sliceEnd).forEach((value) => {
    document.getElementById(value).addEventListener(eventType, panelClick);
    document.getElementById(value).style.color = "red";
    document.getElementById(value).style.cursor = "pointer";
  });
}

// 答え合わせ
function panelClick() {
  this.removeEventListener(eventType, panelClick);
  this.style.cursor = "default";
  clickCount++;
  if (Number(this.textContent) === clickCount) {
    this.style.color = "white";
    if (clickCount === sliceEnd) {
      if (sliceEnd < x * y) {
        sliceEnd++;
      }
      nextGame();
    }
  } else {
    shwoNumber();
    gameOver();
  }
}

// 次の問題
function nextGame() {
  btn.classList.remove("hidden");
  clickCount = 0;
  btn.textContent = "Clear!!";
  btn
    .animate({ opacity: [0, 1] }, { duration: 500, iterations: 3 })
    .finished.then(() => {
      btn.textContent = "Click Next";
      btn.addEventListener(eventType, gameStart);
    });
}

// ゲームオーバー画面表示
function gameOver() {
  modal.classList.remove("hidden");
  btn.classList.remove("hidden");
  btn.textContent = "Reset";
  btn.addEventListener(eventType, () => {
    location.reload();
  });
  modal.style.fontSize = "36px";
  modal.textContent = "GAME OVER";
  modal.classList.add("gameover");
  modal
    .animate({ opacity: [0, 0.7] }, { duration: 1000, fill: "forwards" })
    .finished.then(() => {});
}
