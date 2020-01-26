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
        this.initTone();
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

    initTone() {

        this.initSynths();

        this.$rows = document.querySelectorAll('.sequencer-row-container');
        this.notes = ['G5', 'E4', 'C3'];
        this.index = 0;

        Tone.Transport.scheduleRepeat(this.handleBeat.bind(this), '16n');
        Tone.Transport.start();

    }

    handleBeat(time) {
        let step = this.index % 16;

        for (let i = 0; i < this.$rows.length; i++) {
            let synth = this.synths[i],
                note = this.notes[i],
                $row = this.$rows[i],
                $input = $row.querySelector(`input:nth-child(${step + 1})`);


            if ($input.checked) {
                if (this.webGLView) {
                    this.webGLView.lines.triggerSpin();
                }

                synth.triggerAttackRelease(note, '16n', time);
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