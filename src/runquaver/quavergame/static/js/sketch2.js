var pipes2;
var match;
var frame = 0;
var path;
var myp5 = new p5(function (sketch) {

    var x = 100, y = 100;

    sketch.setup = function () {
        canvas2 = createCanvas(900, 600);
        // canvas2.parent('sketch-holder2');
    };

    sketch.draw = function () {
        if (!path) return;
        sketch.background(255);
        sketch.fill(0);
        if (frame < path.x.length - 1) {
            frame++;
            for (var i = 0; i < pipes2.length; i++) {
                if (path.x[frame] < path.x[frame + 1])
                    pipes2[i].x -= 2;
            }

        }
        for (i = 0; i < pipes2.length; i++) {
            pipes2[i].show();
            if (i === pipes2.length - 1) pipes2[i].showFinish();
        }
        background(255);

        ellipse(100, path.y[frame])
    };
});

function setup() {


}

function draw() {

}