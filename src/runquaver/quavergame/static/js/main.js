var logged_in = false;
var matchid = 1;
var csrftoken;

function setCover() {
    $.get("/set-cover")
        .done(function (data) {
            var top_html = data;
            $("#cover-input-page").html(top_html);
        });
}

function setRank() {
    $.get("/set-rank")
        .done(function (data) {
            var rank_html = data;
            $("#rank-bar").html(rank_html);
        });
}

function setGameList() {
    $.get("/get-list")
        .done(function (data) {
           var list_html = data;
           $("#game-list").html(list_html);
        });
}

function loadSignup() {
    $.get("/set-signup")
        .done(function (data) {
            var signup_html = data;
            $("#cover-input-page").html(signup_html);
        });
}

function logoutFunc() {
    $.get("/logout")
        .done(function (data) {
            console.log("Inside logout function");
            sessionStorage.setItem('status', 'logout');

            var repage = data;
            document.fadeOut("slow", function (data) {
                document.html(repage);
                document.fadeIn("slow");
            });
        });
}

function back() {
    $.get("/set-cover")
        .done(function (data) {
            var login_html = data;
            $("#cover-input-page").fadeOut("slow", function () {
                $("#cover-input-page").html(login_html);
                $("#cover-input-page").fadeIn("slow");
            });
        });
}

function saveImgUrl(data) {
    var img = $("#icon" + data);
    var url = img.attr('src');
    $("#imgURL").val(url);
    console.log($("#imgURL").attr('value'));

    var modal = document.getElementById("iconModal");
    modal.style.display = "none";
}

function loadIndex() {
    window.location.href = "https://runquaver.hopto.org/index";
}

// Onclick function for playback button after each match listed in the best-match-list
function playback(data) {
    // data: id of the game
    matchid = data;

    bird2 = new Bird();
    pipes2 = [];
    $.ajax({
        url: '/get-map',
        success: function (data) {
            map = JSON.parse(data);
            for (var i = 0; i < map.length; i++) {
                pipes2.push(new Pipe(map[i].height, map[i].width, map[i].left));
            }
        },
        async: false
    });
    $.ajax({
        url: '/get-match/' + matchid,
        success: function (data) {
            data = JSON.parse(data)[0];
            console.log(data);
            path = {
                x: data.fields.x_path.split(","),
                y: data.fields.y_path.split(",")
            }
        },
        async: false
    });

    var matchModal = document.getElementById('matchModal');
    var keyTrigger = document.getElementById("keyTrigger");
    var matchClose = document.getElementById("matchClose");

    keyTrigger.onclick = function ( ) {
        matchModal.style.display = "block";
    };

    matchClose.onclick = function () {
        matchModal.style.display = "none";
    }
}


function selectIcon() {
    var iconModal = document.getElementById("iconModal");
    iconModal.style.display = "block";
}

function closeSelectIcon() {
    var modal = document.getElementById("iconModal");
    modal.style.display = "none";
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


/////////////////////////////// Below is document ready functions ////////////////////////


$(document).ready(function () {
    $('body').fadeIn("slow");

    // Setup the page
    setCover();
    setRank();
    setGameList();


    if (window.location.href.indexOf("index") == 58 || window.location.href.indexOf("index") == 22 || window.location.href.indexOf("index") == 28) {
        sessionStorage.setItem('status','loggedIn');
    }

    $(document).bind('keypress', function (e) {
        if (e.keyCode == 13) {
            $('#user-login').trigger('click');
            $('#signup-submit').trigger('click');
        }
    });

    csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });

    // Load Sign up page
    $(document).on("click", "#login-signup", function (event) {
        event.preventDefault();
        $("#cover-input-page").fadeOut("slow", function () {
            loadSignup();
            $("#cover-input-page").fadeIn("slow");
        });
    });

    $("#cover-input-page").on("click", "#user-login", function(event) {
       event.preventDefault();
       var username = $("#login-un").val();
       var password = $("#login-pw").val();

       if (username == '' || password == "") {
            swal({
              title: "Input Error!",
              text: "You cannot leave the blank empty!",
              icon: "warning",
              button: "Okay",
            });
            return;
       }

        $.ajax({
            type: 'POST',
            url: "/login",
            data: {"username": username,
                   "password": password,
                    'X-CSRFToken': csrftoken,},
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (data) {
                if (data.err_code === 'invalid_form') {
                    for (var key in data.err_msg) {
                        swal({
                            title: "Error!",
                            text:  "Error for " + key + ": " + data.err_msg[key][0],
                            icon: "warning",
                            button: "Okay",
                        });
                    }
                } else {

                    swal({
                        title: "Welcome Back!",
                        text: "Play with other quavers!",
                        icon: "success",
                        button: "Start"
                    }).then((value) => {
                        window.location.href = "https://runquaver.hopto.org/index";
                    });
                }
            }
        });
    });

    // Sign up and load logged page
    $("#cover-input-page").on("click", "#signup-submit", function (event) {
        event.preventDefault();
        var username = $("#signup-un").val();
        var password1 = $("#signup-pw").val();
        var password2 = $("#signup-pw-confirm").val();

        if (username == '' || password1 == '' || password2 == '') {
            swal({
              title: "Input Error!",
              text: "You cannot leave the blank empty!",
              icon: "warning",
              button: "Okay",
            });
            return;
        }

        if (password1 != password2) {
            swal({
              title: "Input Error!",
              text: "Password does not match!",
              icon: "warning",
              button: "Okay",
            });
            return;
        }

        var imgURL = $("#imgURL").attr('value');

        if (imgURL == '') {
            swal({
              title: "Input Error!",
              text: "Please choose an icon!",
              icon: "warning",
              button: "Okay",
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/signup",
            data: {"username": username,
                   "password1": password1,
                   "password2": password2,
                    "imgURL": imgURL,
                    'X-CSRFToken': csrftoken,},
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (data) {
                if (data.err_code === 'invalid_form') {
                    for (var key in data.err_msg) {
                        swal({
                            title: "Error!",
                            text:  "Error for " + key + ": " + data.err_msg[key][0],
                            icon: "warning",
                            button: "Okay",
                        });
                    }
                } else {
                    swal({
                        title: "Welcome!",
                        text: "You have become a new quaver! Join the game now!",
                        icon: "success",
                        button: "Start"
                    }).then((value) => {
			            window.location.href = "https://runquaver.hopto.org/index";
                    });
                }
            }
        });
    });



});

