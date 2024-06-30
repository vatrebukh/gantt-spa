
export class DashboardInfo {
    constructor({id, name, startDate, endDate, status}) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    getBoardInfoHtml() {
        if (this.id) {
            return this.getFullBoardInfoHtml();
        } else {
            return this.getEmptyBoardInfoHtml();
        }
    }

    getFullBoardInfoHtml() {
        return `
            <div class="board-info status-${this.status}">
                <label hidden>${this.id}</label>
                <div>${this.name}</div>
                <div>${this.startDate} - ${this.endDate}</div>
                <div>${this.status}</div>
            </div>
        `;
    }

    getEmptyBoardInfoHtml() {
        return `
            <div id="new-board">
                <input type="text" id="new-board-name" placeholder="Dashboard name"></input>
                <label for="board-start-date">Start date</label>
                <input type="date" id="new-board-start" class="board-start-date"></input>
                <label for="board-end-date">End date</label>
                <input type="date" id="new-board-end" class="board-end-date"></input>

                <div>                
                    <button class="add-board-btn" id="add-board-btn"><span>Create</span></button>
                    <button class="add-board-btn" id="cncl-board-btn"><span>Cancel</span></button>
                </div>
            </div>
        `;
    }
}