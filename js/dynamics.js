// **********  fullPage  ********** //
var myFullpage = new fullpage('#fullpage', {
    navigation: true,
    navigationPosition: 'right',


    onLeave: function(origin, destination, direction) {
        var origId = origin.item.getAttribute('id');
        var destId = destination.item.getAttribute('id');


        if(origId == "title-sec") {
            // show map section when user scrolls beyond title page (this is to prevent stack-loading in first page!)
            $('#map-container').css("display", "inline");
        }

        // color navigation dots accordingly
        if(origId == 'mcu-intro-sec' || origId == 'map-sec' || origId == 'future-sec') {
            $('#fp-nav ul li a span').removeClass('bright-navdots');

        };
        if(destId == 'mcu-intro-sec' || destId == 'map-sec' || destId == 'future-sec') {
            $('#fp-nav ul li a span').addClass('bright-navdots');
        };

    },


    afterLoad: function(origin, destination, direction) {
        var secId = destination.item.getAttribute('id');


        switch (secId) {
            case 'cookiechart-sec':
                drawCookieChartVis();
                break;
            case 'linechart-sec':
                drawLineChartVis();
                break;
            case 'mcu-intro-sec':
                break;
            case 'plot-flow-sec':
                if (!plotVis.drawn) {
                    drawPlotVis();
                }
                break;

            case 'characters-sec':
                if (!doneIntro) {
                    charactersIntro();
                }
                break;
            case 'network-intro-vis':
                drawNetworkIntroVis();
                break;
            case 'network-vis':
                drawNetworkVis();
                break;
        }
    }
});

// ********** Plot plot ********** //
function drawPlotVis() {
    plotVis.drawVis();
    animationFuncs[0]();
}
var animationFuncs = [
    plotFlowTextFirst,
    plotFlowTextSecond,
    plotFlowTextThird
];
function plotFlowTextFirst() {
    var plotFlowText = $("#plot-flow-text");
    $("<span>This is a timeline of movies as they were released.</span>")
        .hide()
        .appendTo(plotFlowText)
        .fadeIn(1000, function() {
            $("<span> However, this linear timeline only tells part of the story.</span>")
                .hide()
                .appendTo(plotFlowText)
                .fadeIn(1000, animationFuncs[1]);
        });
}
function plotFlowTextSecond() {
    var plotFlowText = $("#plot-flow-text");
    plotFlowText.children()
        .delay(1000)
        .fadeOut(500)
        .promise()
        .done(function() {
            $("#plot-flow-text").remove();
            animationFuncs[2]();
        });
}
function plotFlowTextThird() {
    $("#btn-container").fadeIn(1000)
}
$("#btn-branching")
    .on('click', function() {
        plotVis.toggleBranching();
    });


$('#btn-cookie').on('click', function(event) {
    cookiechartVis.toggleCookie();
});

// $('#btn-cookie2').on('click', function(event) {
//   cookiechartVis.toggleCookie2();
// });

// ********** Network intro ********** //
function drawNetworkIntroVis() {

}

// ********** Network vis ********** //
function drawNetworkVis() {

}

// ********** linechart vis ********** //
function drawLineChartVis() {
    if (!linechartVis.drawn) {
        linechartVis.updateVis();
    }
}

// ********** linechart vis ********** //
function drawCookieChartVis() {
    if (!cookiechartVis.drawn) {
        cookiechartVis.updateVis();
    }
}

// ********** Event handler ********** //
var eventHandler = {};
eventHandler.clicked = false;
$(eventHandler).bind("clickHighlight", function(event, character) {
    if (this.clicked === character) {
        $(this).trigger("clickClear");
    } else {
        this.clicked = character;
        $(this).trigger("highlight", character);
    }
});
$(eventHandler).bind("clickClear", function() {
    this.clicked = false;
    $(this).trigger("selectionClear")
});
$(eventHandler).bind("mouseover", function(event, character) {
    if (!this.clicked) {
        $(this).trigger("highlight", character);
    }
});
$(eventHandler).bind("mouseout", function() {
    if (!this.clicked) {
        $(this).trigger("selectionClear");
    }
});
$(eventHandler).bind("highlight", function(event, character) {
    matrixVis.highlight(character);
    networkVis.highlight(character);
    charStatsVis.highlight(character);
});
$(eventHandler).bind("selectionClear", function() {
    matrixVis.clearHighlight();
    networkVis.clearHighlight();
});

// ********** Characters Intro ********** //
var doneIntro = false;

function charactersIntro() {
    doneIntro = true;
    startIntro();
}

function startIntro() {
    fadeOutAll();
    drawSkipButton();
    introNetwork();
}

function fadeOutAll() {
    [networkVis, charStatsVis, matrixVis].forEach(d => fadeOut(d));
}

function fadeInAll() {
    [networkVis, charStatsVis, matrixVis].forEach(d => fadeIn(d));
}

function introNetwork() {
    networkVis.force.stop();

    // Show the network
    fadeIn(networkVis);
    networkVis.force.restart();

    // Show text
    var divRight = $("<div></div>").addClass('tutorial middle');
    divRight.appendTo(".col-right");
    divRight.append("<p>" +
        "This is a network of the links between the Wikipedia pages associated with each character. " +
        "Presumably, each link represents some sort of relation between the two characters. E.g. if " +
        "<span class='iron-man'>Iron Man</span> links to <span class='hulk'>Hulk</span>, then somewhere on " +
        "<span class='iron-man'>Iron Man</span>'s page is a reference to <span class='hulk'>Hulk</span>, " +
        "meaning that the two characters did something together." +
        "</p>" +
        "<button class='btn btn-danger btn-tutorial' id='tutorial1'>Continue</button>");

    // Re-cover and transition to introMatrix
    $("#tutorial1").on('click', function() {
        fadeOut(networkVis);
        networkVis.force.stop();
        divRight.remove();
        introMatrix();
    });
}

function introMatrix() {
    fadeIn(matrixVis);

    // Show text
    var divLeft = $("<div></div>").addClass('tutorial bottom');
    divLeft.appendTo(".col-left");
    divLeft.append("<p>" +
        "In this matrix, we can see the superpowers and abilities of each of the avengers (and their enemies) " +
        "Each row represents a type of ability and each column is a character. If a character has that ability, an " +
        "icon will be displayed. " +
        "<br/>" +
        "Try clicking the names of the powers to sort the matrix based on that power and try hovering " +
        "over the columns to see more stats on that character! " +
        "</p>" +
        "<button class='btn btn-danger btn-tutorial' id='tutorial2'>Continue</button>");

    $("#tutorial2").on('click', function() {
        fadeOut(matrixVis);
        divLeft.remove();
        introCharStats();
    })
}

function introCharStats() {

    fadeIn(charStatsVis);

    // Show text
    var divLeft = $("<div></div>").addClass('tutorial top');
    divLeft.appendTo('.col-left');
    divLeft.append("<p>" +
        "When you hover over a character in the network or matrix, corresponding stats about their Wikipedia " +
        "presence are displayed, including their network centrality, views, page count, and word count. Hover " +
        "over the question marks to see more information on those measures!" +
        "</p>" +
        "<button class='btn btn-danger btn-tutorial' id='tutorial3'>Let me explore!</button>");

    $("#tutorial3").on('click', function() {
        divLeft.remove();
        endIntro();
    })

}

function endIntro() {
    $(".tutorial").remove();
    fadeInAll();
    drawReplayButton();
}

function drawSkipButton() {
    var button = $("<div class='tutorial top-left'>" +
        "<button class='btn btn-danger btn-tutorial' id='tutorial-skip'>Skip tutorial</button>" +
        "</div>");
    button.appendTo('.col-left');
    button.on('click', skipIntro);
}
function skipIntro() {
    endIntro();

}
function drawReplayButton() {
    var button = $("<div class='tutorial top-left'>" +
        "<button class='btn btn-danger btn-tutorial' id='tutorial-replay'>Replay tutorial</button>" +
        "</div>")
        .hide();
    button.appendTo('.col-left');
    button.fadeIn(500);
    button.on('click', replayIntro);
}
function replayIntro() {
    $(".tutorial").remove();
    startIntro();
}
