var i = 0;
var trackPlaying = false;
var buttons = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11", "b12", "b13", "b14", "b15", "b16"];
var drums = [new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]),
    new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]),
    new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]),
    new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([]), new Pizzicato.Group([])];
var playingTrack;
var mode = kick;
var tempo = 500;
var drumKit = {
    'kick': 'SoundSamples/KORG-ER-1/BD-ER1-GoaKick.wav',
    'clap': 'SoundSamples/KORG-ER-1/CLPZ-ER1-Clapnormal.wav',
    'crash': 'SoundSamples/KORG-ER-1/CYM-ER1-CrashCymbal1.wav',
    'snare': 'SoundSamples/KORG-ER-1/SD-ER1-70sSnareNice.wav'
};
var slider = document.getElementById("tempoSlider");
var sliderValue = document.getElementById("sliderValue");
sliderValue.innerHTML = tempo;
var activeDrums = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
    10: {},
    11: {},
    12: {},
    13: {},
    14: {},
    15: {}
};

function playTrack() {
    trackPlaying = true;
    playingTrack = setInterval(function () {
        clickButton(buttons[i]);
        i++;
        if (i > 15) {
            i = 0;
        }
    }, tempo);
}

function clickButton(button) {
    $(".drumButton").removeClass('active');
    $("#" + button).addClass('active');
    drums[i].play();
}

function stopTrack() {
    trackPlaying = false;
    $(".drumButton").removeClass('active');
    clearInterval(playingTrack);
}

function changeMode(drum) {
    mode = drum;
    $('.drumButton').each(function (i, drumButton) {
        if ($(drumButton).attr(drum)) {
            $(drumButton).addClass('selected');
        }
        else {
            $(drumButton).removeClass('selected');
        }
    });
}

$(".drumButton").click(function (e) {
    var buttonClicked = e.currentTarget;

    if ($(buttonClicked).attr(mode)) {
        $(buttonClicked).removeAttr(mode);
        $(buttonClicked).removeClass('selected');
        drums[$(buttonClicked).val()].removeSound(activeDrums[$(buttonClicked).val()][mode]['sound']);
        delete activeDrums[$(buttonClicked).val()][mode];
    }
    else {
        $(buttonClicked).attr(mode, drumKit[mode]);
        $(buttonClicked).addClass('selected');
        var node = new Pz.Sound(drumKit[mode]);
        activeDrums[$(buttonClicked).val()][mode] = {'sound': node};
        drums[$(buttonClicked).val()].addSound(node);
    }
});

slider.oninput = function() {
    tempo = this.value;
    sliderValue.innerHTML = tempo;
    if(trackPlaying) {
        stopTrack();
        playTrack();
    }
}

$(document).ready(function() {
    var sineWave = new Pizzicato.Sound({
        source: 'wave'
    });

    sineWave.attack = 0.0000001;
    sineWave.decay = 0.02;
    //sineWave.sustain = 0.01;
    sineWave.release = 0.1;
    setTimeout(
        function() {
            sineWave.stop();
        }
    ,1000)
    sineWave.play();
});