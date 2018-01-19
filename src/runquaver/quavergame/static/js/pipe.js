function Pipe(h, w, x) {
    this.height = h;
    this.x = x;
    this.w = w;

    this.highlight = false;
    this.soundCount = 0;

    this.show = function () {
        fill(0, 200);
        noStroke();
        if (this.highlight) fill(169, 214, 162);
        rect(this.x, height - this.height, this.w, 10);
    };

    this.update = function () {
        this.x -= bird.speed;
    };

    this.showFinish = function () {
        fill(255, 0, 100);
        c = color(100);
        // rect(this.x + this.w, 0, 10, height);
        stroke(c, 20);
        line(this.x + this.w, 0, this.x + this.w, height);

    };

    this.hits = function(bird) {
        if (bird.y === (height - this.height - bird.height / 2)) {
            if (bird.margin_left >= this.x && bird.margin_left <= (this.x + this.w)) {
                // console.log("Pass the x");
                this.highlight = true;
                return true;
            }
        }
        this.highlight = false;
        return false;
    }
}
