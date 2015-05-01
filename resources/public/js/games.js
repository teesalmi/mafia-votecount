function centerWindow() {
    "use strict";
    var centeredWidth = $('.centered').width() / 2,
        centeredHeight = $('.centered').height() / 2;
    $('.centered').css({ 'margin-left' : -centeredWidth , 'margin-top' : -centeredHeight });
}

function requestData() {
    "use strict";
    var req = new XMLHttpRequest();
    req.open("GET", "/games", true);
    req.setRequestHeader("accept", "application/json");

    req.onload = function() {
        if (req.status >= 200 && req.status < 400){
            var gamesjson = req.responseText;
            var gamesData = JSON.parse(gamesjson);
            var gamesToHtml = "";
            var key, x = 0;

            for (key in gamesData.games) {
                gamesToHtml += "<tr>";
                var url = "/#" + gamesData.games[x].id;
                gamesToHtml +=  '<td><a href="' + url + '">' + gamesData.games[x].name + "</a></td>";
                gamesToHtml += "<td>" + gamesData.games[x].url + "</td>";
                gamesToHtml += "<td>" + gamesData.games[x].start_date + "</td>";
                gamesToHtml += "</tr>";
                x++;
            }

            document.getElementById("games").innerHTML = gamesToHtml;
        } else {
            console.log("Error. Status code " + req.status);
        }
    };

    req.send(null);
    locationHashChanged();
}

function locationHashChanged() {
    "use strict";
    if (window.location.hash != "") {
        var id = "" + window.location.hash;
        id = id.slice(1, id.length);
        showGame(id);
    }
}

function showCreateGame() {
    "use strict";
    document.getElementById("index").className += ' hidden';
    document.getElementById("creategame").className =
    document.getElementById("creategame").className.replace
      ( /(?:^|\s)hidden(?!\S)/g , '' );
}

function hideCreateGame() {
    "use strict";
    document.getElementById("creategame").className += ' hidden';
    document.getElementById("index").className =
    document.getElementById("index").className.replace
      ( /(?:^|\s)hidden(?!\S)/g , '' );
    window.location.hash = "";
}

function showGame(id) {
//                  table :vote    ---> votes!!!
//                  (integer :day :not-null) - äänestyspäivä
//                  (integer :index :not-null) - viestin numero #
//                  (varchar :voter 40 :not-null) - äänestäjä
//                  (varchar :target 40)))) - äänestyksen kohde
    "use strict";
    var req = new XMLHttpRequest();
    var address = "/game/" + id;
    req.open("GET", address, true);
    req.setRequestHeader("accept", "application/json");

    req.onload = function() {
        if (req.status >= 200 && req.status < 400){
            var gamejson = req.responseText;
            var gameData = JSON.parse(gamejson);
            var gameToHtml = "";

            document.getElementById("gameheader").innerHTML = gameData.game.name;

            for (var i = 0; i < gameData.players.length; i++) {
                gameToHtml += "<li>" + gameData.players[i].name + "</li>";
            }
            
            var firstNewDayVote = false;
            var currentDay = 0;
            
            for (var i = 0; i < gameData.votes.length; i++) {
                if (currentDay != gameData.votes[i].day) {
                    firstNewDayVote = true;
                    currentDay = gameData.votes[i].day;
                }
                if (firstNewDayVote === true) {
                    gameToHtml += "<br><h1>Day " + gameData.votes[i].day + "</h1><br>";
                    firstNewDayVote = false;
                }
                if (gameData.votes[i].target == "") {
                    gameToHtml += "<li>" + gameData.votes[i].voter + " unvoted";
                } else if (gameData.votes[i].target == null) {
                    // do nothing
                } else {
                    gameToHtml += "<li>" + gameData.votes[i].voter + " voted " + gameData.votes[i].target + "</li>";
                }
            }

            
//                            [b]Bill Murray (8):[/b] Holyflare, Eden1892, rsoultin, Superbia, Vivax, Breshke, raynpelikoneet, Palmar
//                            [b]Vivax (7):[/b] [s]Holyflare[/s], Artanis[Xp], [s]Damdred[/s], LightningStrike, sicklucker, Toadesstern, Trfel, ExO_,                             [s]rsoultin[/s], [s]Palmar[/s], Damdred
//                            [b]LightningStrike (3):[/b] Bill Murray, [s]Toadesstern[/s], FecalFeast, [s]raynpelikoneet[/s], [s]Vivax[/s], Onegu
//                            [b]Toadesstern (1):[/b] [s]Palmar[/s], [s]Artanis[Xp][/s], [s]raynpelikoneet[/s], [s]Vivax[/s], VisceraEyes,         //                              [s]Palmar[/s]
//                            [b]sicklucker (1):[/b] [s]Eden1892[/s], [s]Holyflare[/s], [s]rsoultin[/s], [s]Alakaslam[/s], [s]Superbia[/s],         //                              Alakaslam, [s]Eden1892[/s], [s]Breshke[/s]
//                            [b]raynpelikoneet (0):[/b] [s]Holyflare[/s], [s]Damdred[/s], [s]rsoultin[/s], [s]Trfel[/s], [s]ExO_[/s], [s]Damdred[/s]
//                            [b]Artanis[Xp] (0):[/b] [s]Toadesstern[/s], [s]Eden1892[/s], [s]VisceraEyes[/s], [s]Eden1892[/s]
//                            [b]Eden1892 (0):[/b] [s]Fecalfeast[/s], [s]Onegu[/s], [s]Bill Murray[/s], [s]ExO[/s]
//                            [b]Damdred (0):[/b] [s]raynpelikoneet[/s], [s]sicklucker[/s], [s]Artanis[Xp][/s]
//                            [b]Superbia (0):[/b] [s]Eden1892[/s]
//                            [b]VisceraEyes (0):[/b] [s]Artanis[Xp][/s]
//                            [b]Alakaslam (0):[/b] [s]Holyflare[/s], [s]Artanis[/s], [s]sicklucker[/s], [s]Eden1892[/s]
//                            [b]ExO_ (0):[/b] [s]Eden1892[/s]
//                            [b]Palmar (0):[/b] [s]Toadesstern[/s], [s]Toadesstern[/s], [s]Bill Murray[/s]
//                            [b]Trfel (0):[/b] [s]Artanis[/s], [s]Superbia[/s], [s]Eden1892[/s]
//                            [b]Holyflare (0):[/b] [s]Alakaslam[/s]
//
//                            [b]Not Voting (0):[/b]
                       
            document.getElementById("gamedata").innerHTML = gameToHtml;
        } else {
            console.log("Error. Status code " + req.status);
        }
    };

    req.send(null);
    document.getElementById("index").className += ' hidden';
    document.getElementById("gameview").className =
    document.getElementById("gameview").className.replace
      ( /(?:^|\s)hidden(?!\S)/g , '' );
}

function hideGame() {
    "use strict";
    document.getElementById("gameview").className += ' hidden';
    document.getElementById("index").className =
    document.getElementById("index").className.replace
      ( /(?:^|\s)hidden(?!\S)/g , '' );
    window.location.hash = "";
}

requestData();
centerWindow();