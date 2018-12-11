let kicks = new Array(16).fill(0);
let claps = new Array(16).fill(0);
let hihats = new Array(16).fill(0);
let snares = new Array(16).fill(0);
let closed = new Array(16).fill(0);
let buttons = new Array(16).fill(1);
let buttonValues = $(".sequencerButton");
let index = 0;
let kits;
let pitchSlider = document.getElementById("pitchSlider");
let tempoSlider = document.getElementById("tempoSlider");
let part;
let pitch = 1;
let BPM = 120;

let kickSound, clapSound, hihatSound, snareSound, closedSound;
$(document).ready(function () {
    $.getJSON("drumkits/drumkits.json", function (data) {
        let drumKits = data.drumkits;
        jQuery.each(Object.keys(drumKits), function () {
            addDropdownItem(this)
        });
        kits = drumKits;
        console.log(drumKits);
        preload();
    });
});

function addDropdownItem(item) {
    $("#kits").append("<div class='item' data-value='" + item + "'>" + item + "</div>");
}

let sound;

function preload() {
    kickSound = loadSound("SoundSamples/KORG-ER-1/BD-ER1-GoaKick.wav");
    clapSound = loadSound("SoundSamples/KORG-ER-1/CLPZ-ER1-ClapNeat.wav");
    snareSound = loadSound("SoundSamples/KORG-ER-1/SD-ER1-70sSnareNice.wav");
    hihatSound = loadSound("SoundSamples/KORG-ER-1/HH-ER1-MicroHat.wav");
    closedSound = loadSound("SoundSamples/KORG-ER-1/Closed-Hi-Hat-1.wav");
}

function setup() {
    var soundCanvas = createCanvas(400, 250);
    noFill();
    fft = new p5.FFT();
    fft.setInput(part);
    soundCanvas.parent('visualSound');

    part = new p5.Part();
    part.addPhrase('kick', playKick, kicks);
    part.addPhrase('clap', playClap, claps);
    part.addPhrase('snare', playSnare, snares);
    part.addPhrase('hat', playHat, hihats);
    part.addPhrase('closed', playClosed, closed);
    part.addPhrase('buttons', cycleButton, buttons);
    part.setBPM(BPM);
}

function playKick() {
    kickSound.rate(pitch);
    kickSound.play();
}

function playClap() {
    clapSound.rate(pitch);
    clapSound.play();
}

function playHat() {
    hihatSound.rate(pitch);
    hihatSound.play();
}

function playSnare() {
    snareSound.rate(pitch);
    snareSound.play();
}

function playClosed() {
    closedSound.rate(pitch);
    closedSound.play();
}

function cycleButton() {
    $(".sequencerButton").removeClass("cycle");
    $(buttonValues[index]).addClass("cycle");
    index++;
    if (index === 16) {
        index = 0;
    }
}


function changeSound(button) {
    let index = button.getAttribute("index");
    let kitValue = $("#drumsDropdown").dropdown('get value');
    $(button).hasClass("active") ? $(button).removeClass("active") : $(button).addClass("active");
    if (kitValue === "kick") {
        (kicks[index] === 1) ? kicks[index] = 0 : kicks[index] = 1;
    } else if (kitValue === "clap") {
        (claps[index] === 1) ? claps[index] = 0 : claps[index] = 1;
    } else if (kitValue === "snare") {
        (snares[index] === 1) ? snares[index] = 0 : snares[index] = 1;
    } else if (kitValue === "hihat") {
        (hihats[index] === 1) ? hihats[index] = 0 : hihats[index] = 1;
    } else if (kitValue === "closed") {
        (closed[index] === 1) ? closed[index] = 0 : closed[index] = 1;
    } else {
        $(button).hasClass("active") ? $(button).removeClass("active") : $(button).addClass("active");
        alert("Please select a drum");
    }
}

$("#playButton").click(function () {
    part.loop();
});

$("#stopButton").click(function () {
    part.stop();
});

function toggleActiveBySound(drum) {
    $(".sequencerButton").removeClass("active");
    for (var i = 0; i < buttonValues.length; i++) {
        if (drum[i] === 1) {
            $(buttonValues[i]).addClass("active");
        }
    }
}

$(".sequencerButton").click(function () {
    changeSound(this);
});

$("#drumsDropdown").change(function () {
    let kitValue = $("#drumsDropdown").dropdown('get value');
    if (kitValue === "kick") {
        toggleActiveBySound(kicks);
    } else if (kitValue === "clap") {
        toggleActiveBySound(claps);
    } else if (kitValue === "snare") {
        toggleActiveBySound(snares);
    } else if (kitValue === "hihat") {
        toggleActiveBySound(hihats);
    } else if (kitValue === "closed") {
        toggleActiveBySound(closed);
    }
});

$("#kitsDropdown").change(function () {
    let kitValue = $("#kitsDropdown").dropdown('get value');
    kickSound = loadSound(kits[kitValue].kick);
    clapSound = loadSound(kits[kitValue].clap);
    snareSound = loadSound(kits[kitValue].snare);
    hihatSound = loadSound(kits[kitValue].hihat);
    closedSound = loadSound(kits[kitValue].closed);
});

pitchSlider.oninput = function () {
    pitch = this.value / 100;
    pitchSliderValue.innerHTML = pitch;
    console.log(this.value);
};

tempoSlider.oninput = function () {
    BPM = this.value;
    part.setBPM(BPM);
    tempoSliderValue.innerHTML = BPM;
    console.log(this.value);
};

$('.ui.dropdown')
    .dropdown()
;

function draw() {
    background(0);
    stroke(255);

    var spectrum = fft.analyze();

    beginShape();
    for (i = 0; i < spectrum.length; i++) {
        vertex(i, map(spectrum[i], 0, 255, height, 0));
    }
    endShape();
}




