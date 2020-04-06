window.onload = function () {
  // document.getElementById("audio").play();
  function getNewQuote() {
    fetch("https://got-quotes.herokuapp.com/quotes")
      .then((resp) => resp.json())
      .then((data) => renderQuotes(data));
    setTimeout(getNewQuote, 5000);
  }
  function renderQuotes(GOTData) {
    if (GOTData.quote.length < 90) {
      console.log(document.querySelector("#quote"));
      document.querySelector("#quote").innerHTML =
        GOTData.quote + " -- " + GOTData.character;
    }
  }
  getNewQuote();

  var $start = document.querySelector("#start");
  $start.onclick = playClick;
  function playClick(event) {
    let target = event.currentTarget;
    target.style.display = "none";
    document.querySelector("#loading").style.display = "block";
    setTimeout(hide, 2000);
  }
  function hide() {
    document.querySelector("#loading").style.display = "none";
    document.body.style.backgroundImage =
      "url('assets/images/kingsLanding.jpg')";
    document.querySelector("#myNavbar").style.display = "block";

    game();
  }
  //////////////////////////
  //Game//
  function game() {
    var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      cH = (ctx.canvas.height = document.getElementsByTagName(
        "body"
      )[0].clientHeight),
      cW = (ctx.canvas.width = document.getElementsByTagName(
        "body"
      )[0].clientWidth);
    // cH = (ctx.canvas.height = window.innerHeight),
    // cW = (ctx.canvas.width = window.innerWidth);
    var player = {
      posX: 200,
      posY: 200,
      width: 70,
      height: 79,
      deg: 0,
    };
    window.addEventListener("keydown", fly, true);
    canvas.addEventListener("mousemove", mouseRotation);
    window.addEventListener("resize", update);
    function update() {
      cH = ctx.canvas.height = window.innerHeight;
      cW = ctx.canvas.width = window.innerWidth;
    }
    function mouseRotation(e) {
      let centerX = player.posX + 0.5 * player.width;
      let centerY = player.posY + 0.5 * player.height;
      let dx = e.pageX - centerX;
      let dy = e.pageY - centerY;
      player.deg = Math.atan2(dy, dx);
    }
    function fly(e) {
      e.preventDefault();
      if (e.keyCode == 65) {
        console.log("left");
        if (player.posX > 0) player.posX -= 20;
      }
      if (e.keyCode == 87) {
        console.log("up");
        console.log(player.posY);
        if (player.posY > 0) player.posY -= 20;
      }
      if (e.keyCode == 68) {
        console.log("right");
        console.log(player.posX);
        if (player.posX + player.width < cW) player.posX += 20;
      }
      if (e.keyCode == 83) {
        console.log("down");
        console.log(player.posY);
        if (player.posY + player.height < cH) player.posY += 20;
      }
    }
    function drogon() {
      ctx.save();
      const image = document.getElementById("source");
      let cx = player.posX + 0.5 * player.width;
      let cy = player.posY + 0.5 * player.height;
      ctx.translate(cx, cy);
      ctx.rotate(player.deg);
      ctx.translate(-cx, -cy);
      ctx.drawImage(image, player.posX, player.posY, 150, 150);
      ctx.restore();
    }
    function start() {
      ctx.clearRect(0, 0, cW, cH);
      ctx.beginPath();
      drogon();
    }
    function init() {
      window.requestAnimationFrame(init);
      start();
    }
    init();
  }
};
