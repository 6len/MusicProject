let kicks = new Array(16).fill(0);
let claps = new Array(16).fill(0);
let hihats = new Array(16).fill(0);
let snares = new Array(16).fill(0);
let closed = new Array(16).fill(0);
let percones = new Array(16).fill(0);
let perctwos = new Array(16).fill(0);
let oscillators = new Array(16).fill(0);
let pattern = 'one';
let buttonValues = $(".led-blue");
let index = 0;
let kits;
let part;
let pitch = 0;
let BPM = 120;
let played=0;
let recording=false;
Tone.Transport.bpm.value = BPM;

let lowPassFilterOn = false;
let highPassFilterOn = false;

knobInit();

//--Loops at the correct BPM
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
}, "16n");

let drumPatterns = {
    "one": {
        "kick": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "snare": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "clap": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "hihat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "closed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "percone": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "perctwo": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "oscillator": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "drumEffects": {
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
            }
        }
    },
    "two": {
        "kick": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "snare": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "clap": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "hihat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "closed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "percone": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "perctwo": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "oscillator": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "drumEffects": {
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
            }
        }
    },
    "three": {
        "kick": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "snare": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "clap": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "hihat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "closed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "percone": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "perctwo": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "oscillator": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "drumEffects": {
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
            }
        }
    },
    "four": {
        "kick": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "snare": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "clap": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "hihat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "closed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "percone": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "perctwo": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "oscillator": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "drumEffects": {
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
            }
        }
    },
    "oscillator": {
        "freq": 55,
        "wave": "sine",
        "attack": 0,
        "decay": 0,
        "sustain": 0,
        "release": 0,
        "res": 1,
        "filter": 20,
        "mod": 0,
        "depth": 0,
        "modwave": "sine",
        "hpFilter": 20,
        "hpRes": 1
    },
    "bpm": 120
};

let oscillatorEffects = drumPatterns.oscillator;
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
    snareSound = loadSound("SoundSamples/KORG-ER-1/SD-ER1-Japanese70s.wav");
    hihatSound = loadSound("SoundSamples/KORG-ER-1/HH-ER1-Beatbox.wav");
    kickSound = loadSound("SoundSamples/KORG-ER-1/BD-ER1-Hotmix95.wav");
    clapSound = loadSound("SoundSamples/KORG-ER-1/CLPZ-ER1-ClapNeat.wav");
    closedSound = loadSound("SoundSamples/KORG-ER-1/Closed-Hi-Hat-1.wav");
    perconeSound = loadSound("SoundSamples/KORG-ER-1/CYM-ER1-CrashCymbal1.wav");
    perctwoSound = loadSound("SoundSamples/KORG-ER-1/TOM-ER-MicroTom1.wav");
}

function setup() {
    //Canvas creation for sound analysis
    let soundCanvas = createCanvas(400, 120);
    noFill();
    fft = new p5.FFT();
    soundCanvas.parent('visualSound');

    oscillatorParams = drumPatterns.oscillator;
    oscillatorEnvelope = new p5.Envelope();
    oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
    oscillatorEnvelope.setRange(1, 0);

    oscillator = new p5.Oscillator();
    oscillator.setType(oscillatorParams.wave);
    oscillator.freq(drumPatterns.oscillator.freq);

    filter = new p5.LowPass();
    filter.freq(drumPatterns.oscillator.filter);
    filter.res(drumPatterns.oscillator.res);

    hpFilter = new p5.HighPass();
    hpFilter.freq(drumPatterns.oscillator.hpFilter);
    hpFilter.res(drumPatterns.oscillator.hpRes);

    mod = new p5.Oscillator();
    mod.setType(oscillatorParams.modwave);
    mod.freq(oscillatorParams.mod);
    mod.amp(oscillatorParams.depth);
    mod.start();
    mod.disconnect();
    oscillator.freq(mod);

    oscillator.disconnect();
    filter.process(oscillator);
    hpFilter.process(oscillator);
    oscillator.amp(oscillatorEnvelope);
    oscillator.start();
    filter.toggle();
    hpFilter.toggle();

    kickDelay = new p5.Delay();
    clapDelay = new p5.Delay();
    hatDelay = new p5.Delay();
    snareDelay = new p5.Delay();
    closedDelay = new p5.Delay();
    perconeDelay = new p5.Delay();
    perctwoDelay = new p5.Delay();

    kickReverb = new p5.Reverb();
    clapReverb = new p5.Reverb();
    hatReverb = new p5.Reverb();
    snareReverb = new p5.Reverb();
    closedReverb = new p5.Reverb();
    perconeReverb = new p5.Reverb();
    perctwoReverb = new p5.Reverb();

    recorder = new p5.SoundRecorder();
    saveSound = new p5.SoundFile();
}

$("#playOsc").click(function () {
    getAudioContext().resume();
    let freq = parseInt(drumPatterns.oscillator.freq);
    let modFreq = parseInt(drumPatterns.oscillator.mod);
    let filterFreq = parseInt(drumPatterns.oscillator.filter);
    let filterRes = parseInt(drumPatterns.oscillator.res);
    let hpFilterFreq = parseInt(drumPatterns.oscillator.hpFilter);
    let hpFilterRes = parseInt(drumPatterns.oscillator.hpRes);
    let depth = parseInt(drumPatterns.oscillator.depth);
    oscillator.freq(freq);
    mod.setType(drumPatterns.oscillator.modwave);
    mod.freq(modFreq);
    mod.amp(depth);
    oscillator.freq(mod);
    filter.freq(filterFreq);
    filter.res(filterRes);
    hpFilter.freq(hpFilterFreq);
    hpFilter.res(hpFilterRes);
    oscillatorEnvelope.setADSR(oscillatorParams.attack, oscillatorParams.decay, oscillatorParams.sustain, oscillatorParams.release);
    oscillatorEnvelope.play();
});


function playKick() {
    if (kicks[index] === 1) {
        kickDelay.process(kickSound, drumPatterns[pattern].drumEffects.delay.time["kick"], drumPatterns[pattern].drumEffects.delay.feedback["kick"], 2300);
        kickReverb.process(kickSound, drumPatterns[pattern].drumEffects.reverb.time["kick"], drumPatterns[pattern].drumEffects.reverb.decay["kick"]);
        kickSound.rate(drumPatterns[pattern].drumEffects.pitches['kick']);
        kickSound.amp(drumPatterns[pattern].drumEffects.volumes['kick']);
        kickSound.play();
    }
}

function playClap() {
    if (claps[index] === 1) {
        clapDelay.process(clapSound, drumPatterns[pattern].drumEffects.delay.time["clap"], drumPatterns[pattern].drumEffects.delay.feedback["clap"], 2300);
        clapReverb.process(clapSound, drumPatterns[pattern].drumEffects.reverb.time["clap"], drumPatterns[pattern].drumEffects.reverb.decay["clap"]);
        clapSound.rate(drumPatterns[pattern].drumEffects.pitches['clap']);
        clapSound.amp(drumPatterns[pattern].drumEffects.volumes['clap']);
        clapSound.play();
    }
}

function playHat() {
    if (hihats[index] === 1) {
        hatDelay.process(hihatSound, drumPatterns[pattern].drumEffects.delay.time["hihat"], drumPatterns[pattern].drumEffects.delay.feedback["hihat"], 2300);
        hatReverb.process(hihatSound, drumPatterns[pattern].drumEffects.reverb.time["hihat"], drumPatterns[pattern].drumEffects.reverb.decay["hihat"]);
        hihatSound.rate(drumPatterns[pattern].drumEffects.pitches['hihat']);
        hihatSound.amp(drumPatterns[pattern].drumEffects.volumes['hihat']);
        hihatSound.play();
    }
}

function playSnare() {
    if (snares[index] === 1) {
        snareDelay.process(snareSound, drumPatterns[pattern].drumEffects.delay.time["snare"], drumPatterns[pattern].drumEffects.delay.feedback["snare"], 2300);
        snareReverb.process(snareSound, drumPatterns[pattern].drumEffects.reverb.time["snare"], drumPatterns[pattern].drumEffects.reverb.decay["snare"]);
        snareSound.rate(drumPatterns[pattern].drumEffects.pitches['snare']);
        snareSound.amp(drumPatterns[pattern].drumEffects.volumes['snare']);
        snareSound.play();
    }
}

function playClosed() {
    if (closed[index] === 1) {
        closedDelay.process(closedSound, drumPatterns[pattern].drumEffects.delay.time["closed"], drumPatterns[pattern].drumEffects.delay.feedback["closed"], 2300);
        closedReverb.process(closedSound, drumPatterns[pattern].drumEffects.reverb.time["closed"], drumPatterns[pattern].drumEffects.reverb.decay["closed"]);
        closedSound.rate(drumPatterns[pattern].drumEffects.pitches['closed']);
        closedSound.amp(drumPatterns[pattern].drumEffects.volumes['closed']);
        closedSound.play();
    }
}

function playPercone() {
    if (percones[index] === 1) {
        perconeDelay.process(perconeSound, drumPatterns[pattern].drumEffects.delay.time["percone"], drumPatterns[pattern].drumEffects.delay.feedback["percone"], 2300);
        perconeReverb.process(perconeSound, drumPatterns[pattern].drumEffects.reverb.time["percone"], drumPatterns[pattern].drumEffects.reverb.decay["percone"]);
        perconeSound.rate(drumPatterns[pattern].drumEffects.pitches['percone']);
        perconeSound.amp(drumPatterns[pattern].drumEffects.volumes['percone']);
        perconeSound.play();
    }
}

function playPerctwo() {
    if (perctwos[index] === 1) {
        perctwoDelay.process(perctwoSound, drumPatterns[pattern].drumEffects.delay.time["perctwo"], drumPatterns[pattern].drumEffects.delay.feedback["perctwo"], 2300);
        perctwoReverb.process(perctwoSound, drumPatterns[pattern].drumEffects.reverb.time["perctwo"], drumPatterns[pattern].drumEffects.reverb.decay["perctwo"]);
        perctwoSound.rate(drumPatterns[pattern].drumEffects.pitches['perctwo']);
        perctwoSound.amp(drumPatterns[pattern].drumEffects.volumes['perctwo']);
        perctwoSound.play();
    }
}

function playOsc() {
    if (oscillators[index] === 1) {
        getAudioContext().resume();
        let freq = parseInt(drumPatterns.oscillator.freq);
        let modFreq = parseInt(drumPatterns.oscillator.mod);
        let filterFreq = parseInt(drumPatterns.oscillator.filter);
        let filterRes = parseInt(drumPatterns.oscillator.res);
        let hpFilterFreq = parseInt(drumPatterns.oscillator.hpFilter);
        let hpFilterRes = parseInt(drumPatterns.oscillator.hpRes);
        let depth = parseInt(drumPatterns.oscillator.depth);
        oscillator.freq(freq);
        mod.setType(drumPatterns.oscillator.modwave);
        mod.freq(modFreq);
        mod.amp(depth);
        oscillator.freq(mod);
        filter.freq(filterFreq);
        filter.res(filterRes);
        hpFilter.freq(hpFilterFreq);
        hpFilter.res(hpFilterRes);
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
    played++;
    if (index === 16) {
        index = 0;
    }
    if (recording === true) {
        downloadProgressBar.progress('set percent', (played/17)*100);
        if(played === 17) {
            recorder.stop();
            recording=false;
            $("#stopButton").click();
            save(saveSound, 'pattern.wav');
            $("#downloadRow").slideUp(1000);
        }
    }
}


function changeSound(button) {
    let index = button.getAttribute("index");
    let kitValue = $(button).parent('div').parent('div').attr('value');
    console.log(kitValue);
    $(button).hasClass("active") ? $(button).removeClass("active") : $(button).addClass("active");
    if (kitValue === "kick") {
        (kicks[index] === 1) ? kicks[index] = 0 : kicks[index] = 1;
        drumPatterns[pattern].kick = kicks;
    } else if (kitValue === "clap") {
        (claps[index] === 1) ? claps[index] = 0 : claps[index] = 1;
        drumPatterns[pattern].clap = claps;
    } else if (kitValue === "snare") {
        (snares[index] === 1) ? snares[index] = 0 : snares[index] = 1;
        drumPatterns[pattern].snare = snares;
    } else if (kitValue === "hihat") {
        (hihats[index] === 1) ? hihats[index] = 0 : hihats[index] = 1;
        drumPatterns[pattern].hihat = hihats;
    } else if (kitValue === "closed") {
        (closed[index] === 1) ? closed[index] = 0 : closed[index] = 1;
        drumPatterns[pattern].closed = closed;
    } else if (kitValue === "percone") {
        (percones[index] === 1) ? percones[index] = 0 : percones[index] = 1;
        drumPatterns[pattern].percone = percones;
    } else if (kitValue === "perctwo") {
        (perctwos[index] === 1) ? perctwos[index] = 0 : perctwos[index] = 1;
        drumPatterns[pattern].perctwo = perctwos;
    } else if (kitValue === "oscillator") {
        (oscillators[index] === 1) ? oscillators[index] = 0 : oscillators[index] = 1;
        drumPatterns[pattern].oscillator = oscillators;
    } else {
        $(button).hasClass("active") ? $(button).removeClass("active") : $(button).addClass("active");
        alert("Please select a drum");
    }
    console.log(drumPatterns);
}

$("#playButton").click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $(this).addClass('active');
    }
    getAudioContext().resume();
    tonePlayer.start(0);
    //Tone.Transport.swing = 1;
    //Tone.Transport.swingSubdivision = "16n";
    played = 0;
    Tone.Transport.start();
});

$("#stopButton").click(function () {
    $('#playButton').removeClass('active');
    $('.sequencerButton').removeClass('cycling');
    index = 0;
    tonePlayer.stop();
});

$("#pauseButton").click(function () {
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
    background(0);

    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255, 255, 255); // waveform is red
    strokeWeight(3);
    for (var i = 0; i < waveform.length; i++) {
        var x = map(i, 0, waveform.length, 0, width);
        var y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
    }
    endShape();

    strokeWeight(1);
    // add a note about what's happening
    text('Modulator Frequency: ' + drumPatterns.oscillator.mod.toFixed(3) + ' Hz', 20, 20);
    text('Modulator Depth: ' + drumPatterns.oscillator.depth.toFixed(3), 20, 40);
    text('Oscillator Frequency: ' + drumPatterns.oscillator.freq + ' Hz', width / 2, 20);

}

$(".optionButton").click(function () {
    let drumOptions = $(this).attr('value');
    $("#optionsModalHeader").text((drumOptions + ' options').toUpperCase());

    let pitchValue = drumPatterns[pattern].drumEffects.pitches[drumOptions];
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
            drumPatterns[pattern].drumEffects.pitches[drumOptions] = ui.value / 100;
        }
    });

    let volumeValue = drumPatterns[pattern].drumEffects.volumes[drumOptions];
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
            drumPatterns[pattern].drumEffects.volumes[drumOptions] = ui.value / 100;
        }
    });

    let delayTimeValue = drumPatterns[pattern].drumEffects.delay.time[drumOptions];
    let delayFeedbackValue = drumPatterns[pattern].drumEffects.delay.feedback[drumOptions];

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
            drumPatterns[pattern].drumEffects.delay.time[drumOptions] = ui.value / 100;
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
            drumPatterns[pattern].drumEffects.delay.feedback[drumOptions] = ui.value / 100;
        }
    });

    let reverbTimeValue = drumPatterns[pattern].drumEffects.reverb.time[drumOptions];
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
            drumPatterns[pattern].drumEffects.reverb.time[drumOptions] = ui.value / 100;
        }
    });

    let reverbDecayValue = drumPatterns[pattern].drumEffects.reverb.decay[drumOptions];
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
            drumPatterns[pattern].drumEffects.reverb.decay[drumOptions] = ui.value / 100;
        }
    });

    $("#optionsModal").modal('show');
});

let tempoHandle = $("#tempo-handle");

$("#tempoSlider").slider({
    range: "max",
    min: 60,
    max: 200,
    value: drumPatterns.bpm,
    create: function () {
        tempoHandle.text(drumPatterns.bpm);
    },
    slide: function (event, ui) {
        tempoHandle.text(ui.value);
        drumPatterns.bpm = ui.value;
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

    $("#filterKnob,#hpFilterKnob").knob({
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

    $("#resonanceKnob, #hpResonanceKnob").knob({
        bgColor: "black",
        fgColor: "silver",
        type: "vol",
        tooltip: true,
        turnWith: null,
        arc: 240,
        steps: 400,
        offset: 0,
        min: 1,
        max: 25,
        range: "auto",
        invertRange: false,
        round: true,
        fineTuneFactor: 1,
        value: 1,
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

$("#frequencyKnob, #filterKnob, #resonanceKnob, #modKnob, #modDepthKnob, #hpFilterKnob, #hpResonanceKnob").knob().on('turn', function () {
    let effect = $(this).attr('effect');
    let knobValue = this.innerText;
    drumPatterns.oscillator[effect] = parseInt(knobValue);
    oscillatorEffects = drumPatterns.oscillator;
});

$("#attackKnob, #decayKnob, #sustainKnob, #releaseKnob").knob().on('turn', function () {
    let effect = $(this).attr('effect');
    let knobValue = this.innerText;
    drumPatterns.oscillator[effect] = parseInt(knobValue) / 1000;
    oscillatorEffects = drumPatterns.oscillator;
});

$(".wave").click(function () {
    $(".wave").removeClass('active');
    $(this).addClass('active');
    let wave = $(this).attr('value');
    drumPatterns.oscillator.wave = wave;
    oscillator.setType(drumPatterns.oscillator.wave);
    oscillatorEffects = drumPatterns.oscillator;
});

$(".modWave").click(function () {
    $(".modWave").removeClass('active');
    $(this).addClass('active');
    let wave = $(this).attr('value');
    drumPatterns.oscillator.modwave = wave;
    mod.setType(drumPatterns.oscillator.modwave);
    oscillatorEffects = drumPatterns.oscillator;
});

$('#lpPow').checkbox({
    onChange: (function () {
        filter.toggle();
    })
});

$('#hpPow').checkbox({
    onChange: (function () {
        hpFilter.toggle();
    })
});

$('#savePattern').click(function () {
    let savedPattern = drumPatterns;

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
    drumPatterns = file;


    kicks = drumPatterns[pattern].kick;
    snares = drumPatterns[pattern].snare;
    hihats = drumPatterns[pattern].hihat;
    closed = drumPatterns[pattern].closed;
    claps = drumPatterns[pattern].clap;
    percones = drumPatterns[pattern].percone;
    perctwos = drumPatterns[pattern].perctwo;
    oscillators = drumPatterns[pattern].oscillator;

    drumPatterns.oscillator = oscillatorEffects;

    activateDrums();
}

function activateDrums() {
    let lightIndex = 0;
    $(".sequencerButton").removeClass('active');
    $('.sequencerButton').each(function () {
        let sequenceValue = $(this).parent().parent().attr('value');
        if (drumPatterns[pattern][sequenceValue][lightIndex] === 1) {
            $(this).addClass('active');
        }
        if (lightIndex === 15) {
            lightIndex = 0;
        } else {
            lightIndex++;
        }
    });
    tempoHandle.text(drumPatterns.bpm);
    $("#tempoSlider").slider({
        range: "max",
        min: 60,
        max: 200,
        value: drumPatterns.bpm,
        create: function () {
            tempoHandle.text(drumPatterns.bpm);
        },
        slide: function (event, ui) {
            tempoHandle.text(ui.value);
            drumPatterns.bpm = ui.value;
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

    $(".sequencerButton").removeClass('active');
});

$(".patternlist").click(function () {
    $(".patternlist").removeClass("selectedPattern");
    $(this).addClass("selectedPattern");
    swapPattern($(this).attr('value'));
});

function swapPattern(patternNumber) {
    pattern = patternNumber;
    kicks = drumPatterns[patternNumber].kick;
    snares = drumPatterns[patternNumber].snare;
    hihats = drumPatterns[patternNumber].hihat;
    claps = drumPatterns[patternNumber].clap;
    closed = drumPatterns[patternNumber].closed;
    percones = drumPatterns[patternNumber].percone;
    perctwos = drumPatterns[patternNumber].perctwo;
    oscillators = drumPatterns[patternNumber].oscillator;

    refreshPattern(patternNumber);
}

function refreshPattern(patternNumber) {
    let lightIndex = 0;
    $(".sequencerButton").removeClass('active');
    $('.sequencerButton').each(function () {
        let sequenceValue = $(this).parent().parent().attr('value');
        if (drumPatterns[patternNumber][sequenceValue][lightIndex] === 1) {
            $(this).addClass('active');
        }
        if (lightIndex === 15) {
            lightIndex = 0;
        } else {
            lightIndex++;
        }
    });
}

$("#saveWav").click(function() {
    $('#downloadRow').slideDown();
    $("#stopButton").click();
    recording=true;
    recorder.record(saveSound);
    $("#playButton").click();
});

let downloadProgressBar = $("#downloadProgress").progress({
    text : {
        active  : 'Preparing your download',
        success : 'Download Ready!'
    },
    percent: 0
});



