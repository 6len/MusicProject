let kicks = new Array(16).fill(0);
let slider = document.getElementById("tempoSlider");
let part;
let pitch = 1;
let BPM = 80;
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
    $("#kits").append("<div class='item'>"+item+"</div>")
}
let sound;
function preload() {
    sound = loadSound("SoundSamples/KORG-ER-1/CLPZ-ER1-ClapNeat.wav");
}

function setup() {
    part = new p5.Part(8, 1/16);
    part.addPhrase('kick', playSound, kicks);
    part.setBPM(BPM);
    part.loop();
}

function playSound() {
    sound.rate(pitch);
    sound.play();
}

function changeSound(index) {
    (kicks[index] == 1) ? kicks[index] = 0: kicks[index] = 1;
    console.log(kicks);
}

$(".sequencerButton").click(function() {
    console.log(this.getAttribute("index"));
    changeSound(this.getAttribute("index"));
})

slider.oninput = function() {
    pitch = this.value/100;
    sliderValue.innerHTML = pitch;
    console.log(this.value);
}


