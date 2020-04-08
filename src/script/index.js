const sprite = new Image();
const spriteExplosion = new Image();
const spriteArrow = new Image();
const spriteShip = new Image();
const draonImg = new Image();
const fireIma = new Image();
const queenImg = new Image();

window.onload = function () {
  sprite.src =
    "https://res.cloudinary.com/dc4stsmlc/image/upload/v1570612478/Codepen/sprite_bj90k9.png";
  spriteExplosion.src =
    "https://res.cloudinary.com/dc4stsmlc/image/upload/v1570612478/Codepen/explosion_g9ncyg.png";
  spriteArrow.src = "assets/images/5-Arrow.png";
  spriteShip.src = "assets/images/6-ship.png";
  fireIma.src = "./assets/images/7-fire.png";
  draonImg.src = "./assets/images/8-dragon.png";
  queenImg.src = "./assets/images/9-throne.png";
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
    setTimeout(hideWelcomeStartGame, 2000);
  };
  document.querySelector("#start").onclick = playClick;
  const hideWelcomeStartGame = () => {
    document.querySelector("#loading").style.display = "none";
    document.body.style.backgroundImage =
      "url('assets/images/10-kingsLanding.jpg')";
    document.querySelector("#quote").style.display = "none";
    document.getElementById("progressId").style.display = "block";
    document.getElementById("directions").style.display = "block";
    document.getElementById("navbar").style.display = "block";
    let lifeBar = document.getElementById("progLife");
    const progressBar = document.getElementById("progressBar");
    let playing = false;
    let life = 100;
    let timeUp = false;
    let gameOver = false;
    let obstacles = [];
    const resetLive = () => {
      lifeBar.setAttribute("value", life);
      lifeBar.style.setProperty("--value", life + "%");
    };
    const lifeLoss = () => {
      if (playing && !gameOver) {
        if (life > 0) {
          life--;
          lifeBar.setAttribute("value", life);
          lifeBar.style.setProperty("--value", life + "%");
        } else {
          console.log("life up");
          timeUp = true;
        }
      } else {
        life = 100;
        resetLive();
      }
      setTimeout(() => {
        lifeLoss();
      }, 1000);
    };
    function game() {
      //Canvas
      const canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d"),
        cH = (ctx.canvas.height = window.innerHeight),
        cW = (ctx.canvas.width = window.innerWidth);
      let cW2 = window.innerWidth;
      let cH2 = window.innerWidth;
      //Game
      let fireBalls = [],
        explosions = [],
        destroyed = 0,
        record = 0,
        count = 0;
      //Player
      const player = {
        posX: -35,
        posY: -(100 + 82),
        width: 70,
        height: 79,
        deg: 0,
      };
      const fly = (e) => {
        //to do: verification
        e.preventDefault();
        if (e.keyCode == 65) {
          console.log("left");
          if (cW2 > player.width + 120) cW2 -= 20;
        }
        if (e.keyCode == 87) {
          console.log("up");
          if (cH2 > player.height + 120) cH2 -= 20;
        }
        if (e.keyCode == 68) {
          console.log("right");
          if (cW2 < cW * 2 - player.width - 120) cW2 += 20;
        }
        if (e.keyCode == 83) {
          // if (cH2 < cW * 2 - player.height - 120)
          cH2 += 20;
        }
      };
      const update = () => {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width = window.innerWidth;
      };
      const move = (e) => {
        player.deg = Math.atan2(e.offsetX - cW2 / 2, -(e.offsetY - cH2 / 2));
      };
      const action = (e) => {
        e.preventDefault();
        if (playing) {
          var fireBall = {
            x: -8,
            y: -179,
            sizeX: 2,
            sizeY: 10,
            realX: e.offsetX,
            realY: e.offsetY,
            dirX: e.offsetX,
            dirY: e.offsetY,
            deg: Math.atan2(e.offsetX - cW2 / 2, -(e.offsetY - cH2 / 2)),
            destroyed: false,
          };

          fireBalls.push(fireBall);
        } else {
          var dist;
          if (gameOver) {
            dist = Math.sqrt(
              (e.offsetX - cW / 2) * (e.offsetX - cW / 2) +
                (e.offsetY - (cH / 2 + 45 + 22)) *
                  (e.offsetY - (cH / 2 + 45 + 22))
            );
            if (dist < 27) {
              if (e.type == "click") {
                gameOver = false;
                count = 0;
                fireBalls = [];
                obstacles = [];
                explosions = [];
                destroyed = 0;
                player.deg = 0;
                canvas.removeEventListener("contextmenu", action);
                canvas.removeEventListener("mousemove", move);
                canvas.style.cursor = "default";
              } else {
                canvas.style.cursor = "pointer";
              }
            } else {
              canvas.style.cursor = "default";
            }
          } else {
            dist = Math.sqrt(
              (e.offsetX - cW2 / 2) * (e.offsetX - cW2 / 2) +
                (e.offsetY - cH2 / 2) * (e.offsetY - cH2 / 2)
            );

            if (dist < 27) {
              if (e.type == "click") {
                playing = true;
                canvas.removeEventListener("mousemove", action);
                canvas.addEventListener("contextmenu", action);
                canvas.addEventListener("mousemove", move);
                canvas.setAttribute("class", "playing");
                canvas.style.cursor = "default";
              } else {
                canvas.style.cursor = "pointer";
              }
            } else {
              canvas.style.cursor = "default";
            }
          }
        }
      };
      window.addEventListener("keydown", fly, true);
      canvas.addEventListener("click", action);
      canvas.addEventListener("mousemove", action);
      window.addEventListener("resize", update);
      const dragon = () => {
        ctx.save();
        ctx.translate(cW2 / 2, cH2 / 2);
        ctx.rotate(player.deg);
        ctx.drawImage(draonImg, 0, 600, 200, 200, -100, -100, 200, 200);
        ctx.restore();
        if (fireBalls.length - destroyed && playing) {
          fire();
        }
      };
      const fire = () => {
        let distance;
        fireBalls.forEach((fireBall) => {
          if (!fireBall.destroyed) {
            ctx.save();
            ctx.translate(cW2 / 2, cH2 / 2);
            ctx.rotate(fireBall.deg);
            ctx.drawImage(
              fireIma,
              fireBall.x - 50,
              (fireBall.y -= 20) + 30,
              100,
              100
            );
            ctx.restore();
            //Real coords
            fireBall.realX = 0 - (fireBall.y + 10) * Math.sin(fireBall.deg);
            fireBall.realY = 0 + (fireBall.y + 10) * Math.cos(fireBall.deg);
            fireBall.realX += cW2 / 2;
            fireBall.realY += cH2 / 2;
            //Collision
            obstacles.forEach((obs) => {
              if (!obs.destroyed) {
                distance = Math.sqrt(
                  Math.pow(obs.realX - fireBall.realX, 2) +
                    Math.pow(obs.realY - fireBall.realY, 2)
                );
                if (distance < obs.width / obs.size / 2 - 4 + (19 / 2 - 4)) {
                  destroyed += 1;
                  obs.destroyed = true;
                  fireBall.destroyed = true;
                  explosions.push(obs);
                }
              }
            });
          }
        });
      };
      const madQueen = () => {
        ctx.save();
        ctx.translate(cW / 2 + 10, cH / 2 + 10);
        ctx.drawImage(queenImg, -100, -100, 200, 200);
        ctx.restore();
      };
      const newObstacle = () => {
        let type = random(1, 5),
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
          case 5:
            coordsX = 0;
            coordsY = cH;
            break;
          // case 6:
          //   coordsX = 200;
          //   coordsY = cH + 150;
          //   break;
        }
        const obstacle = {
          x: 278,
          y: 0,
          state: 0,
          stateX: 0,
          width: 134,
          height: 123,
          realX: coordsX,
          realY: coordsY,
          moveY: 0,
          coordsX: coordsX,
          coordsY: coordsY,
          size: random(1, 3),
          deg: Math.atan2(coordsX - cW / 2, -(coordsY - cH / 2)),
          destroyed: false,
          type: type,
        };
        obstacles.push(obstacle);
      };
      const _obstacles = () => {
        let distance;
        obstacles.forEach((obs) => {
          if (!obs.destroyed) {
            ctx.save();
            ctx.translate(obs.coordsX, obs.coordsY);
            ctx.rotate(obs.deg);
            if (obs.type == 5) {
              ctx.drawImage(
                spriteShip,
                -(obs.width / obs.size) / 2,
                (obs.moveY += 1 / obs.size),
                obs.width / obs.size,
                obs.height / obs.size
              );
            } else {
              ctx.drawImage(
                spriteArrow,
                -(obs.width / obs.size) / 2,
                (obs.moveY += 1 / obs.size),
                obs.width / obs.size,
                obs.height / obs.size
              );
            }
            ctx.restore();
            //Real Coords
            obs.realX =
              0 - (obs.moveY + obs.height / obs.size / 2) * Math.sin(obs.deg);
            obs.realY =
              0 + (obs.moveY + obs.height / obs.size / 2) * Math.cos(obs.deg);

            obs.realX += obs.coordsX;
            obs.realY += obs.coordsY;
            //Game over
            distance = Math.sqrt(
              Math.pow(obs.realX - cW2 / 2, 2) +
                Math.pow(obs.realY - cH2 / 2, 2)
            );
            if (distance < obs.width / obs.size / 2 - 4 + 100) {
              gameOver = true;
              playing = false;
              canvas.addEventListener("mousemove", action);
            }
          } else if (!obs.extinct) {
            explosion(obs);
          }
        });
        if (obstacles.length - destroyed < 10 + Math.floor(destroyed / 6)) {
          newObstacle();
        }
      };
      const explosion = (obstacle) => {
        ctx.save();
        ctx.translate(obstacle.realX, obstacle.realY);
        ctx.rotate(obstacle.deg);
        let spriteY,
          spriteX = 256;
        if (obstacle.state == 0) {
          spriteY = 0;
          spriteX = 0;
        } else if (obstacle.state < 8) {
          spriteY = 0;
        } else if (obstacle.state < 16) {
          spriteY = 256;
        } else if (obstacle.state < 24) {
          spriteY = 512;
        } else {
          spriteY = 768;
        }
        if (
          obstacle.state == 8 ||
          obstacle.state == 16 ||
          obstacle.state == 24
        ) {
          obstacle.stateX = 0;
        }
        ctx.drawImage(
          spriteExplosion,
          (obstacle.stateX += spriteX),
          spriteY,
          256,
          256,
          -(obstacle.width / obstacle.size) / 2,
          -(obstacle.height / obstacle.size) / 2,
          obstacle.width / obstacle.size,
          obstacle.height / obstacle.size
        );
        obstacle.state += 1;
        if (obstacle.state == 31) {
          obstacle.extinct = true;
        }
        ctx.restore();
      };
      const start = () => {
        if (!gameOver) {
          //Clear
          ctx.clearRect(0, 0, cW, cH);
          ctx.beginPath();
          //Queen
          madQueen();
          //Player
          dragon();
          if (playing) {
            _obstacles();
            // ToDo : better display of the record
            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillText("Record: " + record + "", cW, 30);
            ctx.font = "40px Verdana";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeText("" + destroyed + "", cW2 / 2, cH2 / 2);
            ctx.fillText("" + destroyed + "", cW2 / 2, cH2 / 2);
            //update progress bar
            //ToDo : extract in fct
            progressBar.style.height = destroyed + 10 + "%";
            progressBar.style.top = 100 - (destroyed + 10) + "%";
            progressBar.innerText = destroyed + "%";
          } else {
            // the start icon
            // ctx.drawImage(sprite, 428, 12, 70, 70, cW/2 - 35, cH/2 - 35, 70,70);
          }
        } else if (count < 1) {
          //display game over
          //ToDo: work more on display and when game considered over
          //take in count the life bar
          count = 1;
          ctx.fillStyle = "rgba(0,0,0,0.75)";
          ctx.rect(0, 0, cW, cH);
          ctx.fill();
          ctx.font = "60px Verdana";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText("GAME OVER", cW / 2, cH / 2 - 150);
          ctx.font = "20px Verdana";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText("Total destroyed: " + destroyed, cW / 2, cH / 2 + 140);
          record = destroyed > record ? destroyed : record;
          ctx.font = "20px Verdana";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText("RECORD: " + record, cW / 2, cH / 2 + 185);
          ctx.drawImage(
            sprite,
            500,
            18,
            70,
            70,
            cW / 2 - 35,
            cH / 2 + 40,
            70,
            70
          );
          canvas.removeAttribute("class");
        }
      };
      const init = () => {
        window.requestAnimationFrame(init);
        start();
      };
      init();
      //Utils
      //ToDo: many math. exp can be refactored and put in utils
      //ToDo: put utils in a sep. file
      const random = (from, to) => {
        return Math.floor(Math.random() * (to - from + 1)) + from;
      };
      if (~window.location.href.indexOf("full")) {
        let full = document.getElementsByTagName("a");
        full[0].setAttribute("style", "display: none");
      }
    }
    lifeLoss();
    game();
  };
};
