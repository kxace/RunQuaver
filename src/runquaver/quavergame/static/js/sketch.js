var bird;
var pipes;
var GRAVITY = 0.2;
var max_dist;
var quaver_char;

var mic;
var vol;

var button_audio;
var button_key;

var voice_mode = false;
var key_mode = false;

var button_show = false;

var hitSound;
var finishSound;
var fallSound;
var jumpSound;

var quaver;

var socket;

var logo_bg;
var game_bg;

function preload() {
    hitSound = loadSound("static/sounds/lip.mp3");
    finishSound = loadSound("static/sounds/finish.mp3");
    fallSound = loadSound("static/sounds/laugh.mp3");
    jumpSound = loadSound("static/sounds/jump.mp3");
    jumpSound.setVolume(0.3);
    quaver = loadGif("static/img/quaver.gif");

    quaver_char = loadGif("static/img/giphy.gif");
    //logo_bg = loadImage("http://img2.3png.com/7634e7a7ecfd7637098720b7883794f8c6b6.png");
    logo_bg = loadImage("static/img/logo_bg.jpg");
    game_bg = loadImage("static/img/game-bg.jpeg");
}

function setup() {
    canvas = createCanvas(1200, 600);
    canvas.parent('sketch-holder');

    socket = io.connect('https://runquaver.hopto.org:3000');
    socket.on('move', updateUsers);
    function updateUsers(data) {
        console.log("hear success!!!");
        bird.birds[data.user] = {
            x: data.x,
            y: data.y,
            r : parseInt(data.r),
            g : parseInt(data.g),
            b : parseInt(data.b)
        }
    }
    bird = new Bird();
    pipes = [];
    get_map();
    set_button();

}

function startAudioMode() {
    mic = new p5.AudioIn();
    mic.start();

    voice_mode = true;
    bird.game_start();
}

function startKeyMode() {
    key_mode = true;
    bird.game_start();
}

function draw() {
    background(255);


    if (bird.game_state != 3) {
        button_audio.hide();
        button_key.hide();

        button_show = false;
    }


    if (sessionStorage.getItem('status') != 'loggedIn') {
        button_audio.hide();
        button_key.hide();

        button_show = false;
    }

    if (key_mode == true) {
        textSize(15)
        fill(0, 102, 153, 51);
        text("Keyboard mode", 100, 30);

    }

    if (voice_mode == true) {
        fill(0, 102, 153, 51);
        text("Voice mode", 100, 30);
    }


    for (var i = 0; i < pipes.length; i++) {
        pipes[i].show();

        if (pipes[i].hits(bird)) {
            if (!hitSound.isPlaying() && pipes[i].soundCount == 0) {
                hitSound.play();
                pipes[i].soundCount += 1;
            }
        }

        if (i === pipes.length - 1) pipes[i].showFinish();
        if (!bird.game_state) pipes[i].update();
    }


    for (var key in bird.birds) {
        ellipse(bird.x - bird.birds[key].x+ this.margin_left, bird.birds[key].y, 30);
    }


    if (voice_mode == true) {
        vol = mic.getLevel() * 1000;
        reactToAudio();
    }

    bird.update(pipes);
    bird.show();


    if (sessionStorage.getItem('status') == 'loggedIn' && bird.game_state == 3) {
        if (button_show == false) {
            button_audio.show();
            button_key.show();
            button_show = true;
        }


        image(logo_bg, width*0.2, 30, 700, 420);
        image(quaver, width*0.31, 100);
        fill(0, 0, 0, 200);
        textSize(50);
        text("RUN! QUAVER", width * 0.4, 170);

    }
}

function keyPressed() {
    if (key_mode == true) {
        if (keyCode == UP_ARROW) {
            bird.up();

        }
        if (keyCode == RIGHT_ARROW) {
            bird.speed = 2;
        }
    }

    if (keyCode === 80 && bird.game_state === 0) {
        bird.game_pause();
    } else if (keyCode === 80 && bird.game_state === 2) {
        bird.game_resume();
    }
}

function keyReleased() {
    if (key_mode == true) {
        if (keyCode == RIGHT_ARROW) {
            bird.speed = 0;
        }
    }
}

function reactToAudio() {
    if (vol > 100) {
        bird.up();
        console.log("Up voice" + vol);
    }

    if (vol <= 100 && vol > 7) {
        bird.speed = 2;
    }

    if (vol <= 7) {
        bird.speed = 0;
    }

    if (bird.game_state === 4) {

    }
}

function get_map() {
    $.ajax({
        url: '/get-map',
        success: function (data) {
            map = JSON.parse(data);
            for (var i = 0; i < map.length; i++) {
                pipes.push(new Pipe(map[i].height, map[i].width, map[i].left));
                max_dist = pipes[i].x + pipes[i].w;
            }
        },
        async: false
    });
}

function set_button() {

    button_audio = createButton("");
    button_audio.parent('sketch-holder');
    button_audio.size(200, 50);
    button_audio.class('button');
    button_audio.style("background-color", "#82CBE1");

    var span_audio = createSpan("Voice Mode");
    span_audio.parent(button_audio);


    button_key = createButton("");
    button_key.parent('sketch-holder');
    button_key.size(200, 50);
    button_key.class('select-button');
    button_key.class('button');
    button_key.style("background-color", "#86B9C9");

    button_key.style("position", "absolute");

    var span_key = createSpan("Key Mode");
    span_key.parent(button_key);


    button_audio.position(580, 350);
    button_key.position(580, 410);


    button_audio.mousePressed(startAudioMode);
    button_key.mousePressed(startKeyMode);

    button_audio.hide();
    button_key.hide();
    button_show = false;

}

