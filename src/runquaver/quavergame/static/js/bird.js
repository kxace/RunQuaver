

function Bird() {
    // some constants
    this.width = 32;
    this.height = 48;
    this.gravity = GRAVITY;
    this.velocity = 0;
    this.lift = -10;
    this.margin_left = 100;
    this.username = $("#username")[0].innerHTML;

    // variables: margin_left, y is the centre of bird on canvas
    this.y = -100;
    this.x = 100;
    this.speed = 0;
    this.score = this.x - this.margin_left;
    this.game_id = 0;
    this.time = 0;
    this.x_coordinates = [];
    this.y_coordinates = [];

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.color = color(this.r, this.g, this.b, 200);

    this.birds = {};

    // status information
    // bird_state: 0-floor, 1-sky, 2-marginLeft
    this.bird_state = 1;
    // game_state: 0-ongoing, 1-gameover, 2-pause, 3-viewing, 4-finish
    this.game_state = logged_in === true ? 0 : 3;
    // current_pipe_number
    this.curr_pipe = 0;

    this.show = function () {
        fill(0);
        noStroke();
        textFont('Courier New', [30]);
        text("Score: " + this.score, 950, 30);
        textSize(20);
        if (this.game_state != 3) {
            fill(0, 102, 153);
            text(this.showState(), width * 0.4, 30);
        }

        this.showOthers();


        textSize(15);

        switch (this.game_state) {
            case 0: // ongoing
                fill(0);

                tint(this.color, 50);
                image(quaver_char, this.margin_left - this.width/2, this.y - 25, 36, 48);
                noTint();
                text(this.username, 80, this.y - 29);
                break;
            case 1: // gameover
                fill(0, 40);
                rect(0, 0, width, height);
                break;
            case 2: // pause
                fill(0, 40);
                rect(0, 0, width, height);
                break;
            case 3: // viewing
                break;
            case 4: // finished
                fill(0);

                tint(this.color, 50);
                image(quaver_char, this.margin_left - this.width/2, this.y - 25, 36, 48);
                noTint();
                text(this.username, 80, this.y - 29);
                break;
        }

    };
    this.showOthers = function() {
        for (var key in this.birds) {
            newbird = {
                username: key,
                x : parseInt(this.birds[key].x),
                y : parseInt(this.birds[key].y),
                r : parseInt(this.birds[key].r),
                g : parseInt(this.birds[key].g),
                b : parseInt(this.birds[key].b)
            };
            fill(255, 0, 100);

            tint(color(newbird.r, newbird.g, newbird.b), 50);
            image(quaver_char, newbird.x - this.x + this.margin_left - this.width/2, newbird.y - 25, 36, 48);
            noTint();
            text(newbird.username, newbird.x - this.x + this.margin_left - 20, newbird.y - 29);
        }
    };
    this.showState = function () {
        switch (this.game_state) {
            case 0:
                return "Playing! Press 'P' to pause";
            case 1:
                return "Game over";
            case 2:
                return "Pausing! Press 'P' to continue";
            case 3:
                return "Viewing" + ".".repeat(Math.floor(this.time / 40) % 4);
            case 4:
                return "Finished";
        }
    };

    this.up = function () {
        if (this.game_state === 0 && this.bird_state === 0) {
            jumpSound.play();
            this.velocity = this.lift;
            this.y -= 20;
            this.bird_state = 1;
            this.gravity = GRAVITY;
        }
    };

    this.update = function (pipes) {

        var data = {
            x : this.x,
            y : this.y,
            user : this.username,
            r : this.r,
            g : this.g,
            b : this.b
        };
        // console.log("Sending: " + data.x +" " + data.y);
        socket.emit('move', data);
        if (this.game_state === 0) {
            this.time++;
            this.x_coordinates.push(parseInt(this.x));
            this.y_coordinates.push(parseInt(this.y));

        }
        if (this.time !== 0 && this.time % 150 === 0) {
            this.time++;
            this.save_status(false);
        }
        if (this.x + this.width / 2 === max_dist && this.game_state === 0) {
            this.game_finish();
            return;
        }
        if (this.game_state !== 0) return;
        this.x += this.speed;
        this.score = this.x - this.margin_left;
        // update pipe
        if (this.curr_pipe + 1 < pipes.length &&
            this.margin_left + this.width / 2 >= pipes[this.curr_pipe + 1].x) {
            this.curr_pipe++;
        }
        this.get_state(pipes[this.curr_pipe]);
        // console.log("this.x: " + this.x + "pipe: " + pipes[this.curr_pipe].x);
        switch (this.bird_state) {
            case 0: // on floor
                this.y = height - pipes[this.curr_pipe].height - this.height / 2;
                this.gravity = 0;
                this.velocity = 0;

                break;
            case 1: // on sky
                this.gravity = GRAVITY;
                this.velocity += this.gravity;
                this.y += this.velocity;
                break;
            case 2: // marginLeft
                this.speed = 0;
                this.gravity = GRAVITY;
                this.velocity += this.gravity;
                this.y += this.velocity;
                break;
        }
        // fall to the ground
        if (this.y > height) {
            this.game_state = 1;
            this.y = height;
            this.speed = 0;
            this.velocity = 0;
            this.game_over();
        }
    };

    this.get_state = function (pipe) {
        // bird_state: 0-floor, 1-sky, 2-marginLeft
        cur_h = height - this.y;

        if (this.margin_left + this.width / 2 >= pipe.x
            && this.margin_left - this.width / 2 <= pipe.x + pipe.w) {
            if (Math.abs(pipe.height - cur_h + this.height / 2) < 20) {
                this.bird_state = 0;
                return;
            }
        }

        if (this.margin_left + this.width / 2 === pipe.x && cur_h - this.height / 2 < pipe.height) {
            this.bird_state = 2;
            return;
        }
        this.bird_state = 1;
    };

    this.save_status = function (finished) {
        to_save = {
            "x_coordinates": this.x_coordinates,
            "y_coordinates": this.y_coordinates,
            "score": this.score,
            "id": this.game_id,
            "finished": finished,
            "time": this.time
        };
        //console.log(to_save);
        this.x_coordinates = [];
        this.y_coordinates = [];
        $.ajax({
            type: 'POST',
            url: "/save",
            data: to_save,
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (resultData) {
                console.log("save success");
            }
        });
    };

    this.new_game = function () {
        this.game_state = 0;
        console.log(key_mode + " " + voice_mode);
        $.get("/start/" + (key_mode ? "1" : "0"))
            .done(function (data) {

                console.log(data);
                bird.game_id = parseInt(data);
                bird.x_coordinates = [100];
                bird.y_coordinates = [height / 3];
                bird.save_status(false);
            });
    };

    this.game_start = function () {
        console.log("called game_start()");
        $.get("/resume/" + (key_mode === true ? "1" : "0"))
            .done(function (data) {
                console.log(data);
                if (!data || data.length <= 0) {
                    bird.new_game();
                } else {
                    // resume game
                    console.log("resuming game()");
                    //console.log(data);
                    data_x = data[0].fields.x_path.split(",");
                    data_y = data[0].fields.y_path.split(",");
                    bird.x = parseInt(data_x[data_x.length - 2]);
                    bird.y = parseInt(data_y[data_y.length - 2]);
                    bird.speed = 0;
                    bird.score = data[0].fields.score;
                    bird.time = data[0].fields.time;
                    bird.game_state = 2;
                    bird.game_id = parseInt(data[0].fields.game_id);
                    pipes = [];
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
                    for (var i = 0; i < pipes.length; i++) {
                        pipes[i].x -= bird.x;
                        pipes[i].x += bird.margin_left;
                    }
                }
            });
    };

    this.game_over = function () {
        // variables: margin_left, y is the centre of bird on canvas
        console.log("called game_over()");
        if (!fallSound.isPlaying()) {
            fallSound.play();
        }
        this.game_state = 1;
        this.y = height / 3;
        this.x = 100;
        this.speed = 0;
        this.save_status(true);


        swal({
            title: "Game Over!",
            text: "Your final score is " + this.score,
            icon: 'success',
            button: "Play Again!"
        }).then((value) => {
            location.reload();
        });

    };

    this.game_pause = function () {
        console.log("called game_pause()");
        this.game_state = 2;
        this.save_status(false);
    };

    this.game_resume = function () {
        console.log("called game_resume()");
        this.game_state = 0;
        // this.save_status(false);
    };

    this.game_finish = function () {
        console.log("called game_finish()");
        if (!finishSound.isPlaying()) {
            finishSound.play();
        }
        this.game_state = 4;
        this.save_status(true);
        key_mode = false;
        voice_mode = false;
    }
}
