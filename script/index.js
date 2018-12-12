let kicks = new Array(16).fill(0);
let claps = new Array(16).fill(0);
let hihats = new Array(16).fill(0);
let snares = new Array(16).fill(0);
let closed = new Array(16).fill(0);
let buttons = new Array(16).fill(1);
let buttonValues = $(".led-blue");
let index = 0;
let kits;
let part;
let pitch = 0;
let BPM = 120;

Tone.Transport.bpm.value = BPM;

let tonePlayer = new Tone.Loop(function (time) {
    playKick();
    playHat();
    playClap();
    playClosed();
    playSnare();
    cycleButton();
}, "16n");
let drumEffects = {
    "pitches": {
        "clap": 1,
        "snare": 1,
        "hihat": 1,
        "kick": 1,
        "closed": 1
    },
    "volumes": {
        "clap": .5,
        "snare": .5,
        "hihat": .5,
        "kick": .5,
        "closed": .5
    },
    "delay": {
        "time": {
            "clap": 0,
            "snare": 0,
            "hihat": 0,
            "kick": 0,
            "closed": 0
        },
        "feedback": {
            "clap": 0,
            "snare": 0,
            "hihat": 0,
            "kick": 0,
            "closed": 0
        }
    },
    "reverb": {
        "time": {
            "clap": 0.001,
            "snare": 0.001,
            "hihat": 0.001,
            "kick": 0.001,
            "closed": 0.001
        },
        "decay": {
            "clap": 0,
            "snare": 0,
            "hihat": 0,
            "kick": 0,
            "closed": 0
        }
    },
    "oscillator": {
        "freq": 220,
        "wave": "sine",
        "attack": 0,
        "decay": 0,
        "sustain": 0,
        "release": 0,
        "blast" : 1,
        "dirt" : 0,
        "filter" : 0
    }
};
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
    //Canvas creation for sound analysis
    // let soundCanvas = createCanvas(400, 250);
    // noFill();
    // fft = new p5.FFT();
    // fft.setInput(part);
    // soundCanvas.parent('visualSound');

    oscillatorParams = drumEffects.oscillator;
    oscillatorEnvelope = new p5.Envelope();
    oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
    oscillatorEnvelope.setRange(1,0);
    oscillator = new p5.Oscillator(oscillatorParams.wave);
    oscillator.start();
    oscillator.freq(drumEffects.oscillator.freq);
    oscillator.amp(oscillatorEnvelope);

    frequencyEnvelope = new p5.Envelope();
    frequencyEnvelope.setADSR(0.01, drumEffects.oscillator.filter, 0, 0.0001);
    frequencyEnvelope.setRange(drumEffects.oscillator.blast, drumEffects.oscillator.dirt);

    bpFilter = new p5.Filter('BandPass');
    oscillator.connect(bpFilter);
    bpFilter.freq(frequencyEnvelope);
    bpFilter.res(25);
    //Part creation for drum loop
    /*part = new p5.Part(16, 1/16);
    part.addPhrase('kick', playKick, kicks);
    part.addPhrase('clap', playClap, claps);
    part.addPhrase('snare', playSnare, snares);
    part.addPhrase('hat', playHat, hihats);
    part.addPhrase('closed', playClosed, closed);
    part.addPhrase('buttons', cycleButton, buttons);
    part.setBPM(BPM);
*/
    kickDelay = new p5.Delay();
    clapDelay = new p5.Delay();
    hatDelay = new p5.Delay();
    snareDelay = new p5.Delay();
    closedDelay = new p5.Delay();

    kickReverb = new p5.Reverb();
    clapReverb = new p5.Reverb();
    hatReverb = new p5.Reverb();
    snareReverb = new p5.Reverb();
    closedReverb = new p5.Reverb();
}

function playKick() {
    if (kicks[index] === 1) {
        kickDelay.process(kickSound, drumEffects.delay.time["kick"], drumEffects.delay.feedback["kick"], 2300);
        kickReverb.process(kickSound, drumEffects.reverb.time["kick"], drumEffects.reverb.decay["kick"]);
        kickSound.rate(drumEffects.pitches['kick']);
        kickSound.amp(drumEffects.volumes['kick']);
        kickSound.play();
    }
}

function playClap() {
    if (claps[index] === 1) {
        clapDelay.process(clapSound, drumEffects.delay.time["clap"], drumEffects.delay.feedback["clap"], 2300);
        clapReverb.process(clapSound, drumEffects.reverb.time["clap"], drumEffects.reverb.decay["clap"]);
        clapSound.rate(drumEffects.pitches['clap']);
        clapSound.amp(drumEffects.volumes['clap']);
        clapSound.play();
    }
}

function playHat() {
    if(hihats[index] === 1) {
        hatDelay.process(hihatSound, drumEffects.delay.time["hihat"], drumEffects.delay.feedback["hihat"], 2300);
        hatReverb.process(hihatSound, drumEffects.reverb.time["hihat"], drumEffects.reverb.decay["hihat"]);
        hihatSound.rate(drumEffects.pitches['hihat']);
        hihatSound.amp(drumEffects.volumes['hihat']);
        hihatSound.play();
    }
}

function playSnare() {
    if(snares[index] === 1) {
        snareDelay.process(snareSound, drumEffects.delay.time["snare"], drumEffects.delay.feedback["snare"], 2300);
        snareReverb.process(snareSound, drumEffects.reverb.time["snare"], drumEffects.reverb.decay["snare"]);
        snareSound.rate(drumEffects.pitches['snare']);
        snareSound.amp(drumEffects.pitches['snare']);
        snareSound.play();
    }
}

function playClosed() {
    if(closed[index] === 1) {
        closedDelay.process(closedSound, drumEffects.delay.time["closed"], drumEffects.delay.feedback["closed"], 2300);
        closedReverb.process(closedSound, drumEffects.reverb.time["closed"], drumEffects.reverb.decay["closed"]);
        closedSound.rate(drumEffects.pitches['closed']);
        closedSound.amp(drumEffects.volumes['closed']);
        closedSound.play();
    }
}

function cycleButton() {
    $(".led-blue").removeClass("on");
    $(buttonValues[index]).addClass("on");
    index++;
    if (index === 16) {
        index = 0;
    }
}


function changeSound(button) {
    let index = button.getAttribute("index");
    let kitValue = $(button).parent('div').attr('value');
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
    getAudioContext().resume();
    tonePlayer.start(0);
    Tone.Transport.start();
});

$("#stopButton").click(function () {
    tonePlayer.stop();
});


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


$('.ui.dropdown')
    .dropdown()
;

function draw() {
}

$(".optionButton").click(function () {
    let drumOptions = $(this).attr('value');
    $("#optionsModalHeader").text((drumOptions + ' options').toUpperCase());

    let pitchValue = drumEffects.pitches[drumOptions];
    let pitchHandle = $("#pitch-handle");
    pitchHandle.text(pitchValue);
    $("#pitchSlider").slider({
        range: "max",
        min: 0,
        max: 200,
        value: pitchValue * 100,
        create: function () {
            pitchHandle.text(pitchValue);
        },
        slide: function (event, ui) {
            pitchHandle.text(ui.value / 100);
            drumEffects.pitches[drumOptions] = ui.value / 100;
        }
    });

    let volumeValue = drumEffects.volumes[drumOptions];
    let volumeHandle = $("#volume-handle");
    volumeHandle.text(volumeValue);
    $("#volumeSlider").slider({
        range: "max",
        min: 0,
        max: 100,
        value: volumeValue * 100,
        create: function () {
            volumeHandle.text(volumeValue);
        },
        slide: function (event, ui) {
            volumeHandle.text(ui.value / 100);
            drumEffects.volumes[drumOptions] = ui.value / 100;
        }
    });

    let delayTimeValue = drumEffects.delay.time[drumOptions];
    let delayFeedbackValue = drumEffects.delay.feedback[drumOptions];

    let delayTimeHandle = $("#delay-time-handle");
    let delayFeedbackHandle = $("#delay-feedback-handle");

    delayTimeHandle.text(delayTimeValue);
    $("#delayTimeSlider").slider({
        range: "max",
        min: 0,
        max: 50,
        value: delayTimeValue * 100,
        create: function () {
            delayTimeHandle.text(delayTimeValue);
        },
        slide: function (event, ui) {
            delayTimeHandle.text(ui.value / 100);
            drumEffects.delay.time[drumOptions] = ui.value / 100;
        }
    });

    delayFeedbackHandle.text(delayFeedbackValue);
    $("#delayFeedbackSlider").slider({
        range: "max",
        min: 0,
        max: 80,
        value: delayFeedbackValue * 100,
        create: function () {
            delayFeedbackHandle.text(delayFeedbackValue);
        },
        slide: function (event, ui) {
            delayFeedbackHandle.text(ui.value / 100);
            drumEffects.delay.feedback[drumOptions] = ui.value / 100;
        }
    });

    let reverbTimeValue = drumEffects.reverb.time[drumOptions];
    let reverbTimeHandle = $("#reverb-time-handle");
    reverbTimeHandle.text(reverbTimeValue);

    $("#reverbTimeSlider").slider({
        range: "max",
        min: 0,
        max: 200,
        value: reverbTimeValue * 100,
        create: function () {
            reverbTimeHandle.text(reverbTimeValue);
        },
        slide: function (event, ui) {
            reverbTimeHandle.text(ui.value / 100);
            drumEffects.reverb.time[drumOptions] = ui.value / 100;
        }
    });

    let reverbDecayValue = drumEffects.reverb.decay[drumOptions];
    let reverbDecayHandle = $("#reverb-decay-handle");
    reverbDecayHandle.text(reverbDecayValue);

    $("#reverbDecaySlider").slider({
        range: "max",
        min: 0,
        max: 500,
        value: reverbDecayValue * 100,
        create: function () {
            reverbDecayHandle.text(reverbDecayValue);
        },
        slide: function (event, ui) {
            reverbDecayHandle.text(ui.value / 100);
            drumEffects.reverb.decay[drumOptions] = ui.value / 100;
        }
    });

    $("#optionsModal").modal('show');
});

$(".effectsButton").click(function () {
    getAudioContext().resume();
    let freq = parseInt(drumEffects.oscillator.freq);
    oscillator.freq(freq);
    oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
    frequencyEnvelope.setADSR(0.01, drumEffects.oscillator.filter, 0, 0.0001);
    frequencyEnvelope.setRange(drumEffects.oscillator.blast, drumEffects.oscillator.dirt);
    oscillatorEnvelope.play();
    frequencyEnvelope.play();
});

var tempoHandle = $("#tempo-handle");
tempoHandle.text(BPM);

$("#tempoSlider").slider({
    range: "max",
    min: 60,
    max: 200,
    value: BPM,
    create: function () {
        tempoHandle.text(BPM);
    },
    slide: function (event, ui) {
        tempoHandle.text(ui.value);
        BPM = ui.value;
        Tone.Transport.bpm.value = ui.value;
    }
});

$("#frequencyKnob").knob({
    bgColor: "black",
    fgColor: "silver",
    type: "vol",
    tooltip: true,
    turnWith: null,
    arc:    240,
    steps:  240,
    offset:   0,
    min: 55,
    max: 1760,
    range: "auto",
    invertRange: false,
    round: true,
    fineTuneFactor: 0.001,
    value: 0,
    resetValue: 0,
    classPrefix: "knob"

});

$("#attackKnob, #releaseKnob").knob({
    bgColor: "black",
    fgColor: "silver",
    type: "vol",
    tooltip: true,
    turnWith: null,
    arc:    240,
    steps:  240,
    offset:   0,
    min: 1,
    max: 2000,
    range: "auto",
    invertRange: false,
    round: true,
    fineTuneFactor: 0.001,
    value: 10,
    resetValue: 1,
    classPrefix: "knob"

});

$("#decayKnob, #sustainKnob").knob({
    bgColor: "black",
    fgColor: "silver",
    type: "vol",
    tooltip: true,
    turnWith: null,
    arc:    240,
    steps:  1000,
    offset:   0,
    min: 1,
    max: 1000,
    range: "auto",
    invertRange: false,
    round: true,
    fineTuneFactor: 1,
    value: 1,
    resetValue: 1,
    classPrefix: "knob"

});

$("#filterKnob").knob({
    bgColor: "black",
    fgColor: "silver",
    type: "vol",
    tooltip: true,
    turnWith: null,
    arc:    240,
    steps:  400,
    offset:   0,
    min: 1,
    max: 400,
    range: "auto",
    invertRange: false,
    round: true,
    fineTuneFactor: 1,
    value: 1,
    resetValue: 1,
    classPrefix: "knob"

});

$("#filterBlastKnob, #filterDirtKnob").knob({
    bgColor: "black",
    fgColor: "silver",
    type: "vol",
    tooltip: true,
    turnWith: null,
    arc:    240,
    steps:  10000,
    offset:   0,
    min: 1,
    max: 10000,
    range: "auto",
    invertRange: false,
    round: true,
    fineTuneFactor: 1,
    value: 1,
    resetValue: 1,
    classPrefix: "knob"

});

$("#frequencyKnob, #filterBlastKnob, #filterDirtKnob").knob().on('turn', function() {
    let effect = $(this).attr('effect');
    let knobValue = this.innerText;
    drumEffects.oscillator[effect] = knobValue;
});

$("#attackKnob, #decayKnob, #sustainKnob, #releaseKnob, #filterKnob").knob().on('turn', function() {
    let effect = $(this).attr('effect');
    let knobValue = this.innerText;
    drumEffects.oscillator[effect] = parseInt(knobValue)/1000;
});




