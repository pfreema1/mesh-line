/*
    starter code from here: https://codepen.io/jakealbaugh/pen/qxjPMM/
*/

import * as Tone from "tone";
import Triggers from './Triggers';

export default class Audio {
    constructor(webGLView) {
        this.webGLView = webGLView;
        this.numRows = 3;
        this.beatSubdivision = 16;

        this.init();
    }

    async init() {
        this.userGestureFix();
        this.initSampler();
        this.initTriggers();
    }

    initTriggers() {
        this.triggers = new Triggers(this.numRows, this.beatSubdivision);
    }

    initSynths() {
        this.synths = [
            new Tone.Synth(),
            new Tone.Synth(),
            new Tone.Synth()
        ];

        this.synths[0].oscillator.type = 'triangle';
        this.synths[1].oscillator.type = 'sine';
        this.synths[2].oscillator.type = 'sawtooth';

        this.gain = new Tone.Gain(0.6);
        this.gain.toMaster();

        this.synths.forEach(synth => synth.connect(this.gain));
    }

    initSampler() {
        this.sampler = new Tone.Sampler({
            "C0": "./samples/hat.wav",
            "C1": "./samples/snare.wav",
            "C2": "./samples/kick.wav"
        }, () => {
            console.log(this.sampler);

            this.initTone();
        });
    }

    initTone() {
        this.index = 0;

        Tone.Transport.scheduleRepeat(this.handleBeat.bind(this), `${this.beatSubdivision}n`);
        Tone.Transport.start();

    }

    handleBeat(time) {
        let step = this.index % this.beatSubdivision;

        for (let i = 0; i < this.numRows; i++) {
            // let synth = this.synths[i];
            const el = this.triggers.rows[i].triggers[step];

            if (el.data.isTriggered) {
                if (this.webGLView.animHooks[i]) {
                    this.webGLView.animHooks[i]();
                }


                this.sampler.triggerAttackRelease(`C${i}`, `${this.beatSubdivision}n`, time);
            }
        }
        this.index++;
    }

    userGestureFix() {
        document.documentElement.addEventListener('mousedown', () => {
            if (Tone.context.state !== 'running') Tone.context.resume();
        });
    }
}