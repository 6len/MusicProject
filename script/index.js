let kicks = new Array(16).fill(0);
let claps = new Array(16).fill(0);
let hihats = new Array(16).fill(0);
let snares = new Array(16).fill(0);
let closed = new Array(16).fill(0);
let percones = new Array(16).fill(0);
let perctwos = new Array(16).fill(0);
let oscillators = new Array(16).fill(0);
let buttonValues = $(".led-blue");
let index = 0;
let kits;
let part;
let pitch = 0;
let BPM = 120;
let drumPatternImports;
Tone.Transport.bpm.value = BPM;

knobInit();

let tonePlayer = new Tone.Loop(function (time) {
    playKick();
    playHat();
    playClap();
    playClosed();
    playSnare();
    playPercone();
    playPerctwo();
    playOsc();
    cycleButton();

    console.log(index);
}, "16n");
let drumEffects = {
    "pitches": {
        "clap": 1,
        "snare": 1,
        "hihat": 1,
        "kick": 1,
        "closed": 1,
        "percone": 1,
        "perctwo": 1
    },
    "volumes": {
        "clap": .5,
        "snare": .5,
        "hihat": .5,
        "kick": .5,
        "closed": .5,
        "percone": .5,
        "perctwo": .5
    },
    "delay": {
        "time": {
            "clap": 0,
            "snare": 0,
            "hihat": 0,
            "kick": 0,
            "closed": 0,
            "percone": 0,
            "perctwo": 0
        },
        "feedback": {
            "clap": 0,
            "snare": 0,
            "hihat": 0,
            "kick": 0,
            "closed": 0,
            "percone": 0,
            "perctwo": 0
        }
    },
    "reverb": {
        "time": {
            "clap": 0.001,
            "snare": 0.001,
            "hihat": 0.001,
            "kick": 0.001,
            "closed": 0.001,
            "percone": 0.001,
            "perctwo": 0.001
        },
        "decay": {
            "clap": 0,
            "snare": 0,
            "hihat": 0,
            "kick": 0,
            "closed": 0,
            "percone": 0,
            "perctwo": 0
        }
    },
    "oscillator": {
        "freq": 55,
        "wave": "sine",
        "attack": 0,
        "decay": 0,
        "sustain": 0,
        "release": 0,
        "res": 25,
        "filter": 20,
        "mod": 0,
        "depth": 0
    },
    "bpm": 120
};

let oscillatorEffects = drumEffects.oscillator;
let kickSound, clapSound, hihatSound, snareSound, closedSound, perconeSound, perctwoSound;
$(document).ready(function () {
    $.getJSON("drumkits/drumkits.json", function (data) {
        let drumKits = data.drumkits;
        jQuery.each(Object.keys(drumKits), function () {
            addDropdownItem(this)
        });
        kits = drumKits;
        console.log(drumKits);
        preload();
        setup();
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
    perconeSound = loadSound("SoundSamples/KORG-ER-1/Closed-Hi-Hat-1.wav");
    perctwoSound = loadSound("SoundSamples/KORG-ER-1/Closed-Hi-Hat-1.wav");
}

function setup() {
    //Canvas creation for sound analysis
    let soundCanvas = createCanvas(300, 100);
    noFill();
    fft = new p5.FFT();
    soundCanvas.parent('visualSound');

    oscillatorParams = drumEffects.oscillator;
    oscillatorEnvelope = new p5.Envelope();
    oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
    oscillatorEnvelope.setRange(1, 0);

    oscillator = new p5.Oscillator();
    oscillator.setType(oscillatorParams.wave);
    oscillator.freq(drumEffects.oscillator.freq);

    bpFilter = new p5.LowPass();
    bpFilter.freq(drumEffects.oscillator.filter);
    bpFilter.res(drumEffects.oscillator.res);

    mod = new p5.Oscillator();
    mod.setType("sine");
    mod.freq(oscillatorParams.mod);
    mod.amp(oscillatorParams.depth);
    mod.start();
    mod.disconnect();
    oscillator.freq(mod);

    oscillator.disconnect();
    bpFilter.process(oscillator);
    oscillator.amp(oscillatorEnvelope);
    oscillator.start();
    bpFilter.toggle();

    kickDelay = new p5.Delay();
    clapDelay = new p5.Delay();
    hatDelay = new p5.Delay();
    snareDelay = new p5.Delay();
    closedDelay = new p5.Delay();
    perconeDelay = new p5.Delay()
    perctwoDelay = new p5.Delay()

    kickReverb = new p5.Reverb();
    clapReverb = new p5.Reverb();
    hatReverb = new p5.Reverb();
    snareReverb = new p5.Reverb();
    closedReverb = new p5.Reverb();
    perconeReverb = new p5.Reverb();
    perctwoReverb = new p5.Reverb();
}

$("#playOsc").click(function () {
    getAudioContext().resume();
    let freq = parseInt(drumEffects.oscillator.freq);
    let modFreq = parseInt(drumEffects.oscillator.mod);
    let filterFreq = parseInt(drumEffects.oscillator.filter);
    let filterRes = parseInt(drumEffects.oscillator.res);
    let depth = parseInt(drumEffects.oscillator.depth);
    oscillator.freq(freq);
    mod.freq(modFreq);
    mod.amp(depth);
    oscillator.freq(mod);
    bpFilter.freq(filterFreq);
    bpFilter.res(filterRes);
    oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
    oscillatorEnvelope.play();
});


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
    if (hihats[index] === 1) {
        hatDelay.process(hihatSound, drumEffects.delay.time["hihat"], drumEffects.delay.feedback["hihat"], 2300);
        hatReverb.process(hihatSound, drumEffects.reverb.time["hihat"], drumEffects.reverb.decay["hihat"]);
        hihatSound.rate(drumEffects.pitches['hihat']);
        hihatSound.amp(drumEffects.volumes['hihat']);
        hihatSound.play();
    }
}

function playSnare() {
    if (snares[index] === 1) {
        snareDelay.process(snareSound, drumEffects.delay.time["snare"], drumEffects.delay.feedback["snare"], 2300);
        snareReverb.process(snareSound, drumEffects.reverb.time["snare"], drumEffects.reverb.decay["snare"]);
        snareSound.rate(drumEffects.pitches['snare']);
        snareSound.amp(drumEffects.volumes['snare']);
        snareSound.play();
    }
}

function playClosed() {
    if (closed[index] === 1) {
        closedDelay.process(closedSound, drumEffects.delay.time["closed"], drumEffects.delay.feedback["closed"], 2300);
        closedReverb.process(closedSound, drumEffects.reverb.time["closed"], drumEffects.reverb.decay["closed"]);
        closedSound.rate(drumEffects.pitches['closed']);
        closedSound.amp(drumEffects.volumes['closed']);
        closedSound.play();
    }
}

function playPercone() {
    if (percones[index] === 1) {
        perconeDelay.process(perconeSound, drumEffects.delay.time["percone"], drumEffects.delay.feedback["percone"], 2300);
        perconeReverb.process(perconeSound, drumEffects.reverb.time["percone"], drumEffects.reverb.decay["percone"]);
        perconeSound.rate(drumEffects.pitches['percone']);
        perconeSound.amp(drumEffects.volumes['percone']);
        perconeSound.play();
    }
}

function playPerctwo() {
    if (perctwos[index] === 1) {
        perctwoDelay.process(perctwoSound, drumEffects.delay.time["perctwo"], drumEffects.delay.feedback["perctwo"], 2300);
        perctwoReverb.process(perctwoSound, drumEffects.reverb.time["perctwo"], drumEffects.reverb.decay["perctwo"]);
        perctwoSound.rate(drumEffects.pitches['perctwo']);
        perctwoSound.amp(drumEffects.volumes['perctwo']);
        perctwoSound.play();
    }
}

function playOsc() {
    if (oscillators[index] === 1) {
        getAudioContext().resume();
        let freq = parseInt(drumEffects.oscillator.freq);
        let modFreq = parseInt(drumEffects.oscillator.mod);
        let filterFreq = parseInt(drumEffects.oscillator.filter);
        let filterRes = parseInt(drumEffects.oscillator.res);
        let depth = parseInt(drumEffects.oscillator.depth);
        oscillator.freq(freq);
        mod.freq(modFreq);
        mod.amp(depth);
        oscillator.freq(mod);
        bpFilter.freq(filterFreq);
        bpFilter.res(filterRes);
        oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
        oscillatorEnvelope.play();
    }
}

function cycleButton() {
    $(".led-blue").removeClass("on");
    $(buttonValues[index]).addClass("on");
    $(".sequencerButton").removeClass('cycling');
    $(".sequencerButton").each(function () {
        if (parseInt($(this).attr('index')) === index) {
            $(this).addClass('cycling');
        }
    });
    index++;
    if (index === 16) {
        index = 0;
    }
}


function changeSound(button) {
    let index = button.getAttribute("index");
    let kitValue = $(button).parent('div').parent('div').attr('value');
    console.log(kitValue);
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
    } else if (kitValue === "percone") {
        (percones[index] === 1) ? percones[index] = 0 : percones[index] = 1;
    } else if (kitValue === "perctwo") {
        (perctwos[index] === 1) ? perctwos[index] = 0 : perctwos[index] = 1;
    } else if (kitValue === "oscillator") {
        (oscillators[index] === 1) ? oscillators[index] = 0 : oscillators[index] = 1;
    } else {
        $(button).hasClass("active") ? $(button).removeClass("active") : $(button).addClass("active");
        alert("Please select a drum");
    }
}

$("#playButton").click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $(this).addClass('active');
    }
    getAudioContext().resume();
    tonePlayer.start(0);
    Tone.Transport.start();
});

$("#stopButton").click(function () {
    $('#playButton').removeClass('active');
    tonePlayer.stop();
});


$(".sequencerButton").click(function () {
    changeSound(this);
});

$("#kitsDropdown").change(function () {
    let kitValue = $("#kitsDropdown").dropdown('get value');
    kickSound = loadSound(kits[kitValue].kick);
    clapSound = loadSound(kits[kitValue].clap);
    snareSound = loadSound(kits[kitValue].snare);
    hihatSound = loadSound(kits[kitValue].hihat);
    closedSound = loadSound(kits[kitValue].closed);
    perconeSound = loadSound(kits[kitValue].percone);
    perctwoSound = loadSound(kits[kitValue].perctwo);
});


$('.ui.dropdown')
    .dropdown()
;

function draw() {
    background(255);

    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255, 0, 0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i < waveform.length; i++) {
        var x = map(i, 0, waveform.length, 0, width);
        var y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
    }
    endShape();
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

let tempoHandle = $("#tempo-handle");

$("#tempoSlider").slider({
    range: "max",
    min: 60,
    max: 200,
    value: drumEffects.bpm,
    create: function () {
        tempoHandle.text(drumEffects.bpm);
    },
    slide: function (event, ui) {
        tempoHandle.text(ui.value);
        drumEffects.bpm = ui.value;
        Tone.Transport.bpm.value = ui.value;
    }
});

function knobInit() {
    $("#frequencyKnob").knob({
        bgColor: "black",
        fgColor: "silver",
        type: "vol",
        tooltip: true,
        turnWith: null,
        arc: 240,
        steps: 240,
        offset: 0,
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
        arc: 240,
        steps: 240,
        offset: 0,
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
        arc: 240,
        steps: 1000,
        offset: 0,
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
        arc: 240,
        steps: 400,
        offset: 0,
        min: 20,
        max: 10000,
        range: "auto",
        invertRange: false,
        round: true,
        fineTuneFactor: 1,
        value: 1,
        resetValue: 1,
        classPrefix: "knob"

    });

    $("#resonanceKnob").knob({
        bgColor: "black",
        fgColor: "silver",
        type: "vol",
        tooltip: true,
        turnWith: null,
        arc: 240,
        steps: 400,
        offset: 0,
        min: 1,
        max: 100,
        range: "auto",
        invertRange: false,
        round: true,
        fineTuneFactor: 1,
        value: 25,
        resetValue: 1,
        classPrefix: "knob"

    });
    $("#modKnob").knob({
        bgColor: "black",
        fgColor: "silver",
        type: "vol",
        tooltip: true,
        turnWith: null,
        arc: 240,
        steps: 400,
        offset: 0,
        min: 0.000001,
        max: 260,
        range: "auto",
        invertRange: false,
        round: true,
        fineTuneFactor: 1,
        value: 0,
        resetValue: 1,
        classPrefix: "knob"

    });

    $("#modDepthKnob").knob({
        bgColor: "black",
        fgColor: "silver",
        type: "vol",
        tooltip: true,
        turnWith: null,
        arc: 240,
        steps: 400,
        offset: 0,
        min: -150,
        max: 150,
        range: "auto",
        invertRange: false,
        round: true,
        fineTuneFactor: 1,
        value: 0,
        resetValue: 1,
        classPrefix: "knob"

    });
}

$("#frequencyKnob, #filterKnob, #resonanceKnob, #modKnob, #modDepthKnob").knob().on('turn', function () {
    let effect = $(this).attr('effect');
    let knobValue = this.innerText;
    drumEffects.oscillator[effect] = parseInt(knobValue);
    oscillatorEffects = drumEffects.oscillator;
});

$("#attackKnob, #decayKnob, #sustainKnob, #releaseKnob").knob().on('turn', function () {
    let effect = $(this).attr('effect');
    let knobValue = this.innerText;
    drumEffects.oscillator[effect] = parseInt(knobValue) / 1000;
    oscillatorEffects = drumEffects.oscillator;
});

$(".wave").click(function () {
    let wave = $(this).attr('value');
    drumEffects.oscillator.wave = wave;
    oscillator.setType(drumEffects.oscillator.wave);
    oscillatorEffects = drumEffects.oscillator;
});

$('.ui.checkbox').checkbox({
    onChange: (function () {
        bpFilter.toggle();
    })
});

$('#savePattern').click(function () {
    let savedPattern = {
        "drumPattern": {
            "kick": kicks,
            "snare": snares,
            "hihat": hihats,
            "clap": claps,
            "closed": closed,
            "percone": percones,
            "perctwo": perctwos,
            "oscillator": oscillators
        },
        "drumEffects": {
            drumEffects
        }
    };

    $("<a />", {
        "download": "drum-settings.json",
        "href": "data:application/json," + encodeURIComponent(JSON.stringify(savedPattern))
    }).appendTo("body")
        .click(function () {
            $(this).remove()
        })[0].click();
});


$("#uploadButton").click(function () {
    let file = document.getElementById('uploadPattern').files[0];
    if (file.type === "application/json") {
        var fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = function (evt) {
            processFile(JSON.parse(evt.target.result));
        }
        fileReader.onerror = function (evt) {
            console.log("error");
        }
    } else {
        alert("Wrong file format");
    }
});

function processFile(file) {
    drumPatternImports = file.drumPattern;
    console.log(drumPatternImports);
    kicks = drumPatternImports.kick;
    snares = drumPatternImports.snare;
    hihats = drumPatternImports.hihat;
    closed = drumPatternImports.closed;
    claps = drumPatternImports.clap;
    percones = drumPatternImports.percone;
    perctwos = drumPatternImports.perctwo;
    oscillators = drumPatternImports.oscillator;

    drumEffects = file.drumEffects.drumEffects;
    drumEffects.oscillator = oscillatorEffects;

    activateDrums();
}

function activateDrums() {
    let lightIndex = 0;
    $(".sequencerButton").removeClass('active');
    $('.sequencerButton').each(function () {
        let sequenceValue = $(this).parent().parent().attr('value');
        if (drumPatternImports[sequenceValue][lightIndex] === 1) {
            $(this).addClass('active');
        }
        if (lightIndex === 15) {
            lightIndex = 0;
        } else {
            lightIndex++;
        }
    });
    tempoHandle.text(drumEffects.bpm);
    $("#tempoSlider").slider({
        range: "max",
        min: 60,
        max: 200,
        value: drumEffects.bpm,
        create: function () {
            tempoHandle.text(drumEffects.bpm);
        },
        slide: function (event, ui) {
            tempoHandle.text(ui.value);
            drumEffects.bpm = ui.value;
            Tone.Transport.bpm.value = ui.value;
        }
    });

}

$("#resetButton").click(function () {
    kicks = new Array(16).fill(0);
    claps = new Array(16).fill(0);
    hihats = new Array(16).fill(0);
    snares = new Array(16).fill(0);
    closed = new Array(16).fill(0);
    percones = new Array(16).fill(0);
    perctwos = new Array(16).fill(0);
    oscillators = new Array(16).fill(0);

    activateDrums();
});