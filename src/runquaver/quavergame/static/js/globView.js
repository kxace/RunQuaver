var socket;
var pipes;
var birds = {};
var quaver_char;

function preload() {
    quaver_char = loadGif("static/img/giphy.gif");
}
function setup() {
    canvas = createCanvas(1200, 600);
    canvas.parent('sketch-holder');
    socket = io.connect('https://runquaver.hopto.org:3000', verify=false);
    socket.on('move', updateUsers);
    function updateUsers(data) {
        // console.log("hear success!!!");
        birds[data.user] = {
            x: data.x,
            y: data.y,
            r : parseInt(data.r),
            g : parseInt(data.g),
            b : parseInt(data.b)
        }
    }

    pipes = [];
    get_map();
}

function draw() {
    background(200);
    var x = parseInt($('#myRange')[0].value);
    fill(0);
    for (i = 0; i < pipes.length; i++) {
        pipe = pipes[i];

        rect(pipe.x - x, height - pipe.height, pipe.w, 10);
    }
    for (var key in birds) {
        newbird = {
            username: key,
            x : parseInt(birds[key].x),
            y : parseInt(birds[key].y),
            r : parseInt(birds[key].r),
            g : parseInt(birds[key].g),
            b : parseInt(birds[key].b)
        };
        // ellipse(newbird.x - x - 18, newbird.y - 25, 36, 48);
        image(quaver_char, newbird.x - x - 18, newbird.y - 25, 36, 48);
        tint(color(newbird.r, newbird.g, newbird.b));
        text(newbird.username, newbird.x - x, newbird.y - 20);
        noTint();
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
