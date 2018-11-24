let kicks = new Array(16).fill(0);
let claps = new Array(16).fill(0);
let hihats = new Array(16).fill(0);
let snares = new Array(16).fill(0);

let pitchSlider = document.getElementById("pitchSlider");
let tempoSlider = document.getElementById("tempoSlider");
let part;
let pitch = 1;
let BPM = 120;

let kickSound, clapSound, hihatSound, snareSound;
$(document).ready(function() {
    $.getJSON("drumkits/drumkits.json", function (data) {
        let drumKits = data.drumkits;
        jQuery.each(Object.keys(drumKits), function() {
            addDropdownItem(this)
        })
        preload();
        console.log(kicks);
    });
})

function addDropdownItem(item){
    $("#kits").append("<div class='item'>"+item+"</div>");
}
let sound;
function preload() {
    kickSound = loadSound("SoundSamples/KORG-ER-1/BD-ER1-GoaKick.wav");
    clapSound = loadSound("SoundSamples/KORG-ER-1/CLPZ-ER1-ClapNeat.wav");
    snareSound = loadSound("SoundSamples/KORG-ER-1/SD-ER1-70sSnareNice.wav");
    hihatSound = loadSound("SoundSamples/KORG-ER-1/HH-ER1-MicroHat.wav");
}

function setup() {
    part = new p5.Part(8, 1/16);
    part.addPhrase('kick', playKick, kicks);
    part.addPhrase('clap', playClap, claps);
    part.addPhrase('snare', playSnare, snares);
    part.addPhrase('hat', playHat, hihats);
    part.setBPM(BPM);
    part.loop();
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
function changeSound(index) {
    let kitValue = $("#drumsDropdown").dropdown('get value');
    console.log(kitValue);

    if(kitValue == "kick") {
        (kicks[index] == 1) ? kicks[index] = 0: kicks[index] = 1;
    } else if(kitValue == "clap") {
        (claps[index] == 1) ? claps[index] = 0: claps[index] = 1;
    } else if(kitValue == "snare") {
        (snares[index] == 1) ? snares[index] = 0: snares[index] = 1;
    } else if(kitValue == "hihat") {
        (hihats[index] == 1) ? hihats[index] = 0: hihats[index] = 1;
    } else {
        alert("Please select a drum");
    }console.log(kicks);
}

$(".sequencerButton").click(function() {
    console.log(this.getAttribute("index"));
    changeSound(this.getAttribute("index"));
})

pitchSlider.oninput = function() {
    pitch = this.value/100;
    pitchSliderValue.innerHTML = pitch;
    console.log(this.value);
}

tempoSlider.oninput = function() {
    BPM = this.value;
    part.setBPM(BPM);
    tempoSliderValue.innerHTML = BPM;
    console.log(this.value);
}

$('.ui.dropdown')
    .dropdown()
;


