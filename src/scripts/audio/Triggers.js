
export default class Triggers {
    constructor(numRows, beatSubdivision) {
        this.numRows = numRows;
        this.beatSubdivision = beatSubdivision;

        this.init();
    }

    createRowContainers() {
        this.rows = [];

        for (let i = 0; i < this.numRows; i++) {
            let rowEl = document.createElement('div');
            rowEl.classList.add('row');
            rowEl.triggers = [];
            this.rows.push(rowEl);
        }
    }

    createTriggers() {
        // create triggers
        for (let i = 0; i < this.numRows * this.beatSubdivision; i++) {
            let rowIndex = parseInt(i / this.beatSubdivision);
            let triggerEl = document.createElement('div');
            triggerEl.classList.add('trigger');
            triggerEl.data = {
                row: rowIndex,
                beat: i % this.beatSubdivision
            };

            // append trigger to rowEl array
            this.rows[rowIndex].triggers.push(triggerEl);

            // append trigger to DOM
            this.rows[rowIndex].appendChild(triggerEl);
        }
    }

    addRowsToContainer() {
        for (let i = 0; i < this.numRows; i++) {
            this.containerEl.appendChild(this.rows[i]);
        }
    }

    init() {
        this.containerEl = document.createElement('div');
        this.containerEl.id = 'sequencerContainer';

        this.createRowContainers();

        this.createTriggers();

        this.addRowsToContainer();

        this.appendTriggersToDOM();
    }

    appendTriggersToDOM() {
        document.querySelector('.container').appendChild(this.containerEl);
    }
}