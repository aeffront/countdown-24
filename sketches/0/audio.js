import * as Tone from 'tone';












class Track {
    constructor() {

        this.source = new Tone.Oscillator({}).start();

        this.envelope = new Tone.AmplitudeEnvelope({
            attack: 0.,
            decay: 0.1,
            sustain: 1.0,
            release: 0.
        })

        this.gain = new Tone.Gain(0.1)

        this.filter = new Tone.Filter(200, "allpass")

        this.nodes = [this.source, this.envelope, this.gain, this.filter]

        this.buildChain();

        this.effects = [];

        
        
    }

    

    buildChain(){
        
        this.nodes.forEach((element,i) => {
            if(i < this.nodes.length - 1){
                element.connect(this.nodes[i+1]);
            } else {
                element.toDestination();
            }
            
        });
    }

    addEffect(effect){
        this.nodes.push(effect); // Add the effect to the nodes array
    
    // Dynamically create a property on the parent object
    if (effect.name) {
        this[effect.name] = effect;
    } else {
        console.warn("Effect does not have a 'name' property.");
    }
    this.buildChain();
    }

    removeEffect(effect){
        let index = this.nodes.indexOf(this[effect]);
        if(index != -1){
            this.nodes.splice(index, 1);
        }
        this.buildChain();
    }

    setNodePosition(node, position) {
        let index = this.nodes.indexOf(node);
        console.log(index);
        if (index !== -1) {
            this.nodes[index].disconnect(); // Disconnect the node from the chain
            this.nodes.splice(index, 1); // Remove the node from its current position
            if (position === 'first') {
                this.nodes.unshift(node); // Add the node to the beginning of the array
            } else if (position === 'last') {
                this.nodes.push(node); // Add the node to the end of the array
            }
            this.buildChain(); // Rebuild the chain to reflect the new order

        } else {
            console.warn("Node not found in the nodes array.");
        }
    };
}

function getRandomCMajorNoteFrequency() {
    // Frequencies for C Major scale in one octave (C4 to B4)
    const cMajorScale = {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.00,
        A4: 440.00,
        B4: 493.88,
    };
    
    // Get an array of note names
    const notes = Object.keys(cMajorScale);
    
    // Select a random note
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    
    // Return the frequency of the random note
    return cMajorScale[randomNote];
}

function init(){
    const Source1 = new Track();
    Source1.source.frequency.value = 100;
    Source1.source.type = "sine";
    Source1.envelope.attack = 0.0;
    Source1.envelope.decay = 0.1;
    Source1.envelope.sustain = 0.7;
    Source1.envelope.release = 0.0;
    Source1.gain.gain.value = 0.2;
    Source1.filter.type = "allpass";
    Source1.filter.frequency.value = 1000;
    Source1.filter.rolloff = -12;





    const distortion = new Tone.Distortion(1);
    //Source1.addEffect(distortion);

    const bitcrusher = new Tone.BitCrusher(16);
    //Source1.addEffect(bitcrusher);

    Source1.setNodePosition(Source1.filter, 'last');
    console.log(Source1) 

    let octave = 5;

    Source1.seq = new Tone.Sequence((time, note) => {
        if(note !== "") {
            Source1.gain.gain.value = 0.5;
            Source1.source.frequency.value = Tone.Frequency(note).toFrequency();
        }
        else {
            Source1.gain.gain.value = 0;

        }
        console.log(Source1.seq.state);
        Source1.envelope.triggerAttack(time);
        Source1.envelope.triggerRelease(time + 0.1); // Trigger release after 0.5 seconds for slower notes
    }, ["D3","","","","","","",""], "4n") // Change the subdivision to "4n" for quarter notes
    Source1.seq.loop = false;


    

  

    const Source2 = new Track();
    Source2.source = new Tone.Noise().start();
    Source2.source.type = "pink";
    Source2.buildChain();
    Source2.nodes[Source2.nodes.length - 1].toDestination();
    
 
    Source2.envelope.attack = 0.01;
    Source2.envelope.decay = 0.1;
    Source2.envelope.sustain = 0.7;
    Source2.envelope.release = 0.7;



 


    const reverb = new Tone.Reverb(10.);
    Source2.addEffect(reverb);

    const sequencer = document.querySelectorAll('.seq-button');
const seqButtons = Array.from(sequencer);  
seqButtons.forEach((button,i) => {
    console.log(button.value);
    button.addEventListener('click', (e) => {
        button.classList.toggle('active');
        console.log( i,button.classList.contains('active') ? true : false);
        updateSeq(Source1.seq)
    });
});

function updateSeq(sequence){
    
    let notes = sequence.events;
    console.log(notes);
    notes.forEach((note, i) => {
        console.log(note);
        if(seqButtons[i].classList.contains('active')){
            console.log("active");
            notes[i] = "D3";
        }
        else{
            notes[i] = "";
        }
        console.log(notes);
    
    Source1.seq.events = notes;
    //console.log(Source1.seq.events);
    });

}



    


    document.addEventListener('keydown', (e) => {
        console.log(e);
        let note = e.key;
    

    
    
        switch(note){
            case "a":
                
                if(Source1.seq.state == "stopped"){
                    console.log("start");
                    Source1.seq.start(Tone.TransportTime());
                    
                }
                else{
                    console.log("overlay");
                    Source1.seq.stop(Tone.TransportTime());
                }
                
                
                
                
                
                break;
            case "z":
                //Source2.source.frequency.value = getRandomCMajorNoteFrequency();
                Source2.envelope.triggerAttackRelease("10t");
                break;
        }
        
        
    });
    document.addEventListener('keyup', (e) => {
        let note = e.key;
        switch(note){
            case "a":
                
                //Source1.envelope.triggerRelease();
                break;
            case "z":
                Source2.envelope.triggerRelease();
                break;
        }
    });
	
}


// Wait for a user click to start the audio context

document.addEventListener('keydown', (e) => {
    if(e.code == "Space"){
        
        Tone.start();
        Tone.Transport.start();
        Tone.Transport.bpm.value = 120;
        console.log("audio is ready");
    }
    
    init();

});




        

