
export class DashboardInfo {
    constructor({id, name, startDate, endDate, status}) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    getBoardInfoHtml() {
        return `
            <div class="board-info status-${this.status}">
                <label hidden>${this.id}</label>
                <div>${this.name}</div>
                <div>${this.startDate} - ${this.endDate}</div>
                <div>${this.status}</div>
            </div>
        `;
    }
}