/* components */
var h = window.innerHeight;
var w = window.innerWidth;
var elements = document.getElementsByClassName("object");
var offset = 14;
function object(id) {
  this.id = id;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
/* mouse down */
function mdown(e) {
  this.classList.add("drag");
  if (e.type === "mousedown") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }
  x = event.pageX - this.offsetLeft;
  y = event.pageY - this.offsetTop;
  try {
    document.body.addEventListener("mousemove", mmove, false);
    document.body.addEventListener("touchmove", mmove, false);
  } catch (e) { }
}
/* mouse move */
function mmove(e) {
  var drag = document.getElementsByClassName("drag")[0];
  if (e.type === "mousemove") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }
  e.preventDefault();
  try {
    drag.style.left = event.pageX - x + "px";
    drag.style.top = event.pageY - y + "px";
    eval("object" + drag.getAttribute("id")).left = event.pageX - x;
    eval("object" + drag.getAttribute("id")).top = event.pageY - y;
    if (eval("object" + drag.getAttribute("id")).type == "main") {
      eval("object" + drag.getAttribute("id")).x =
        eval("object" + drag.getAttribute("id")).left + offset;
      eval("object" + drag.getAttribute("id")).y = eval(
        "object" + drag.getAttribute("id")
      ).top;
    } else {
      eval("object" + drag.getAttribute("id")).x =
        eval("object" + drag.getAttribute("id")).left + offset;
      eval("object" + drag.getAttribute("id")).y =
        eval("object" + drag.getAttribute("id")).top +
        eval("object" + drag.getAttribute("id")).height;
    }
    update();
    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);
  } catch (e) { }
}
/* mouse up */
function mup(e) {
  var drag = document.getElementsByClassName("drag")[0];
  try {
    document.body.removeEventListener("mousemove", mmove, false);
    drag.removeEventListener("mouseup", mup, false);
    document.body.removeEventListener("touchmove", mmove, false);
    drag.removeEventListener("touchend", mup, false);
    drag.classList.remove("drag");
  } catch (e) { }
}
/* lines */
var bodyStyles = window.getComputedStyle(document.body);
var lineColor = bodyStyles.getPropertyValue("--color-darkgray");
var canvas = document.getElementById("canvas");
canvas.width = w;
canvas.height = h;
var ctx = canvas.getContext("2d");
ctx.strokeStyle = lineColor;
var drawLine = function (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};
var update = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < elements.length; i++) {
    if (
      elements[i].classList.contains("group1") &&
      elements[i].classList.contains("main")
    ) {
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].classList.contains("group1")) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        } else if (
          elements[j].classList.contains("group2") &&
          elements[j].classList.contains("main")
        ) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        } else if (
          elements[j].classList.contains("group3") &&
          elements[j].classList.contains("main")
        ) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        } else if (
          elements[j].classList.contains("group4") &&
          elements[j].classList.contains("main")
        ) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        } else if (
          elements[j].classList.contains("group5") &&
          elements[j].classList.contains("main")
        ) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        }
      }
    } else if (
      elements[i].classList.contains("group2") &&
      elements[i].classList.contains("main")
    ) {
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].classList.contains("group2")) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        }
      }
    } else if (
      elements[i].classList.contains("group3") &&
      elements[i].classList.contains("main")
    ) {
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].classList.contains("group3")) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        }
      }
    } else if (
      elements[i].classList.contains("group4") &&
      elements[i].classList.contains("main")
    ) {
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].classList.contains("group4")) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        }
      }
    } else if (
      elements[i].classList.contains("group5") &&
      elements[i].classList.contains("main")
    ) {
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].classList.contains("group5")) {
          drawLine(
            eval("object" + i).x,
            eval("object" + i).y,
            eval("object" + j).x,
            eval("object" + j).y
          );
        }
      }
    }
  }
};
/* main */
for (var i = 0; i < elements.length; i++) {
  var l = getRandomInt(w - elements[i].clientWidth);
  var t = getRandomInt(h - elements[i].clientHeight);
  eval("var object" + i + "= new object(" + i + ");");
  eval("object" + i).width = elements[i].clientWidth;
  eval("object" + i).height = elements[i].clientHeight;
  eval("object" + i).left = l;
  eval("object" + i).top = t;
  if (elements[i].classList.contains("main")) {
    eval("object" + i).type = "main";
    eval("object" + i).x = l + offset;
    eval("object" + i).y = t;
  } else {
    eval("object" + i).type = "args";
    eval("object" + i).x = l + offset;
    eval("object" + i).y = t + elements[i].clientHeight;
  }
  elements[i].id = i;
  elements[i].style.left = l + "px";
  elements[i].style.top = t + "px";
  elements[i].addEventListener("mousedown", mdown, false);
  elements[i].addEventListener("touchstart", mdown, false);
}
update();
/* log */
function log(num) {
  var message = "";
  if (num == 1) {
    message += "五十嵐学<br>";
    message += "諏訪・八ヶ岳西麓在住、プログラマー。<br>";
    message += "Manabu Igarashi<br>";
    message += "Programmer based in Suwa, Japan.<br>";
    message += "GitHub<br>";
    message +=
      '<a href="//github.com/igramjp" target="_blank" rel="noreferrer noopener">https://github.com/igramjp</a>';
  } else if (num == 2) {
    message += "IGRAM LAB (YouTube)<br>";
    message += "音響プログラミングの実験や演奏を映像で公開しています。耳で聴き、目で見る「音の現象」を共有する実験室です。<br>";
    message += "Experiments and performances in sound programming, shared through video. A lab for exploring sonic phenomena you can see and hear.<br>";
    message +=
      '<a href="https://www.youtube.com/@igramlab" target="_blank" rel="noreferrer noopener">https://www.youtube.com/@igramlab<a/><br>';
    message += "<br>";
    message += "IGRAM RESEARCH（note）<br>";
    message += "音響表現の背景にある技術や思想を記録・考察しています。SuperColliderやMaxのコードに宿る思考を言葉にします。<br>";
    message += "Exploring the techniques and ideas behind sonic expression. Turning the thoughts embedded in SuperCollider and Max code into words.<br>";
    message += "<br>";
    message += "IGRAM NETWORK（Discord）<br>";
    message += "音響プログラミングに関心のある人々が集うコミュニティです。コードや音、対話を通じてゆるやかにつながります。<br>";
    message += "A community for those interested in sound programming. Connecting through code, sound, and conversation.<br>";
  } else if (num == 3) {
    message += "IGRAM LAB (YouTube)<br>";
    message += "音響プログラミングの実験や演奏を映像で公開しています。耳で聴き、目で見る「音の現象」を共有する実験室です。<br>";
    message += "Experiments and performances in sound programming, shared through video. A lab for exploring sonic phenomena you can see and hear.<br>";
    message +=
      '<a href="https://www.youtube.com/@igramlab" target="_blank" rel="noreferrer noopener">https://www.youtube.com/@igramlab<a/>';
  } else if (num == 4) {
    message += "IGRAM RESEARCH<br>";
    message += "IGRAM RESEARCH（note）<br>";
    message += "音響表現の背景にある技術や思想を記録・考察しています。SuperColliderやMaxのコードに宿る思考を言葉にします。<br>";
    message += "Exploring the techniques and ideas behind sonic expression. Turning the thoughts embedded in SuperCollider and Max code into words.<br>";
  } else if (num == 5) {
    message += "IGRAM NETWORK<br>";
    message += "IGRAM NETWORK（Discord）<br>";
    message += "音響プログラミングに関心のある人々が集うコミュニティです。コードや音、対話を通じてゆるやかにつながります。<br>";
    message += "A community for those interested in sound programming. Connecting through code, sound, and conversation.<br>";
  } else if (num == 6) {
    message += "リアルタイム純正律周波数 ― Web MIDIによる実験アプリ<br>";
    message += "Real-Time Just Intonation Frequencies – A Web MIDI Experiment<br>";
    message +=
      '<a href="/app/just-intonation-midi/" target="_blank" rel="noreferrer noopener">/app/just-intonation-midi/</a>';
  } else if (num == 7) {
    message += "竹音（ちくおん／bamboo music）<br>";
    message += "日本を拠点とするインディペンデントな音楽レーベル兼アート・インプリントです。<br>";
    message += " bamboo music is an independent record label and art imprint based in Japan.<br>";
    message +=
      '<a href="https://bamboomusic.asia/" target="_blank" rel="noreferrer noopener">https://bamboomusic.asia/</a>';
  } else if (num == 8) {
    message += "CONTACT (Google Forms)<br>";
    message += "ご質問やご相談などありましたら、こちらのフォームよりお気軽にお問い合わせください。<br>";
    message += "If you have any questions or inquiries, please feel free to contact me using the form below.<br>";
    message +=
      '<a href="https://forms.gle/9kQKMp8ajEr3vf716" target="_blank" rel="noreferrer noopener">https://forms.gle/9kQKMp8ajEr3vf716</a>';
  }
  $("#log").html(message);
}

/*
$(document).ready(function () {
  // slack api: conversations.history
  async function getToken() {
    try {
      const url = "https://igram.jp/scripts/slack-api.php";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Conversations History:", data);

      if (data.ok && Array.isArray(data.messages)) {
        var news = "";
        data.messages.forEach((message) => {
          const ts = message.ts;
          const date = new Date(Math.floor(parseFloat(ts) * 1000));
          const formattedDate = date.toISOString().split("T")[0];

          const messageText = message.text;
          const convertedText = messageText.replace(
            /<([^|>]+)(?:\|[^>]+)?>/g,
            "$1"
          );

          const urlRegex = /\bhttps?:\/\/[^\s]+/gi;
          const result = convertedText.replace(
            urlRegex,
            (url) => `<a href="${url}" target="_blank">${url}</a>`
          );

          news =
            news + "<tt>" + formattedDate + "</tt><div>" + result + "</div>";
        });
        $("#news").append(news);
      }
    } catch (error) {
      // console.error("Error during fetch operation: ", error.message);
    }
  }
  getToken();

  // chatgpt api
  async function chatGPT() {
    try {
      const url = "https://igram.jp/scripts/chatgpt-api.php";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;
      const replacedText = text.replace(/。/g, "．").replace(/、/g, "，");
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      var news =
        "<tt>" +
        formattedDate +
        " ChatGPT" +
        "</tt><div>" +
        replacedText +
        "</div>";
      $("#news").prepend(news);
    } catch (error) {
      // console.error("Error during fetch operation: ", error.message);
    }
  }
  chatGPT();
});
*/