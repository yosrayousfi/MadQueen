window.onload = function () {
  // document.getElementById("audio").play();
  const getNewQuote = () => {
    fetch("https://got-quotes.herokuapp.com/quotes")
      .then((resp) => resp.json())
      .then((data) => renderQuotes(data));
    setTimeout(getNewQuote, 5000);
  };
  const renderQuotes = (GOTData) => {
    if (GOTData.quote.length < 90) {
      document.querySelector("#quote").innerHTML =
        GOTData.quote + " -- " + GOTData.character;
    }
  };
  getNewQuote();

  const playClick = (event) => {
    event.currentTarget.style.display = "none";
    document.querySelector("#loading").style.display = "block";
    setTimeout(hide, 2000);
  };
  document.querySelector("#start").onclick = playClick;

  const hide = () => {
    document.querySelector("#loading").style.display = "none";
    document.body.style.backgroundImage =
      "url('assets/images/kingsLanding.jpg')";
    document.querySelector("#myNavbar").style.display = "block";
    document.querySelector("#quote").style.display = "none";
    game();
  };
  //////////////////////////
  //Game//
  const game = () => {
    const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      fireBalls = [];
    let cH = (ctx.canvas.height = window.innerHeight),
      cW = (ctx.canvas.width = window.innerWidth);
    const obstacles = [];
    const player = {
      posX: 200,
      posY: 200,
      width: 70,
      height: 79,
      deg: 0,
    };

    const update = () => {
      cH = ctx.canvas.height = window.innerHeight;
      cW = ctx.canvas.width = window.innerWidth;
    };
    const mouseRotation = (e) => {
      const centerX = player.posX + 0.5 * player.width,
        centerY = player.posY + 0.5 * player.height,
        dx = e.pageX - centerX,
        dy = e.pageY - centerY;
      player.deg = Math.atan2(dy, dx);
    };
    const fly = (e) => {
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
    };
    const drogon = () => {
      const cx = player.posX + 0.5 * player.width,
        cy = player.posY + 0.5 * player.height;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(player.deg);
      ctx.translate(-cx, -cy);
      ctx.drawImage(
        document.getElementById("source"),
        player.posX,
        player.posY,
        150,
        150
      );
      ctx.restore();
      fire();
    };
    //utils
    const random = (from, to) => {
      return Math.floor(Math.random() * (to - from + 1)) + from;
    };
    const newObstacle = () => {
      let type = random(1, 4),
        coordsX,
        coordsY;

      switch (type) {
        case 1:
          coordsX = random(0, cW);
          coordsY = 0 - 150;
          break;
        case 2:
          coordsX = cW + 150;
          coordsY = random(0, cH);
          break;
        case 3:
          coordsX = random(0, cW);
          coordsY = cH + 150;
          break;
        case 4:
          coordsX = 0 - 150;
          coordsY = random(0, cH);
          break;
      }

      const obstacle = {
        width: 134,
        height: 123,
        moveY: 0,
        coordsX: coordsX,
        coordsY: coordsY,
        size: random(1, 3),
        deg: Math.atan2(coordsX - cW / 2, -(coordsY - cH / 2)),
      };
      obstacles.push(obstacle);
    };

    const _obstacles = () => {
      obstacles.forEach((elm) => {
        ctx.save();
        ctx.translate(elm.coordsX, elm.coordsY);
        ctx.rotate(elm.deg);
        ctx.drawImage(
          document.getElementById("dead"),
          -(elm.width / elm.size) / 2,
          (elm.moveY += 1 / elm.size),
          elm.width / elm.size,
          elm.height / elm.size
        );
        ctx.restore();
      });
      if (obstacles.length < 10) {
        newObstacle();
      }
    };
    const fire = () => {
      for (var i = 0; i < fireBalls.length; i++) {
        ctx.save();
        const cx = player.posX + 0.5 * player.width,
          cy = player.posY + 0.5 * player.height;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(player.deg);
        ctx.translate(-cx, -cy);
        ctx.drawImage(
          document.getElementById("fire"),
          player.posX,
          (fireBalls[i].y -= 20),
          150,
          150
        );
        ctx.restore();
      }
    };
    const action = () => {
      var fireBall = {
        x: player.posX,
        y: player.posY - 100,
        deg: player.deg,
      };
      fireBalls.push(fireBall);
    };
    const start = () => {
      ctx.clearRect(0, 0, cW, cH);
      ctx.beginPath();
      drogon();
      _obstacles();
    };
    const init = () => {
      window.requestAnimationFrame(init);
      start();
    };
    init();
    window.addEventListener("keydown", fly, true);
    canvas.addEventListener("mousemove", mouseRotation);
    window.addEventListener("resize", update);
    canvas.addEventListener("click", action);
  };
};
