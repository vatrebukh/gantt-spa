import { DashboardInfo } from "./DashboardInfo.js";
import { Dashboard } from "./Dashboard.js";
import { navigate } from "../index.js";

export class DashboardManagementService {
    async viewDashboards() {
        let dashboards = await this.getDashboardsFromLocalStorage();
        this.previewDashboards(dashboards);
        this.assignEvents();
    }

    async getDashboardsFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem('dashboards'));
        return data ? data : await this.getDashboardsFromFile();
    }

    async getDashboardsFromFile() {
        return fetch('/static/data/dashboards.json')
            .then(response => response.json());
    }

    assignEvents() {
        document.querySelectorAll('div.board-info')
            .forEach(element => element.addEventListener('click', e => {
                let parent = this.findElement(e.target, 'div.board-info');
                let id = parent.querySelector('label').textContent;
                history.pushState(null, null, `/dashboard/${id}`);
                navigate();
            }));
    }

    findElement(target, description) {
        if (target.matches(description)) {
            return target;
        } else {
            return this.findElement(target.parentElement, description);
        }
    }

    previewDashboards(data) {
        document.getElementById('root').innerHTML = Array.from(data).map(info => new DashboardInfo(info).getBoardInfoHtml()).join('');
    }

    createDashboard() {
        let newBoard = new DashboardInfo({})
        document.getElementById('root').innerHTML = newBoard.getBoardInfoHtml();
        document.getElementById('add-board-btn').addEventListener('click', async e => {
            newBoard.name = document.getElementById('new-board-name').value;
            newBoard.startDate = document.getElementById('new-board-start').value;
            newBoard.endDate = document.getElementById('new-board-end').value;
            newBoard.id = await this.generateBoardId();
            newBoard.status = 'planned';
            await this.saveDashboardToLocalStorage(newBoard);
            history.pushState(null, null, `/dashboard/${newBoard.id}`);
            navigate();
        });
        document.getElementById('cncl-board-btn').addEventListener('click', e => {
            history.pushState(null, null, '/');
            navigate();
        });
    }

    async generateBoardId() {
        return this.getDashboardsFromLocalStorage()
            .then(data => {
                let ids = Array.from(data).filter(board => board && board.id).map(board => board.id);
                let id = 1001; 
                while (ids.includes(id)) {
                    id++;
                }
                return id;
            });
    }

    async saveDashboardToLocalStorage(board) {
        this.getDashboardsFromLocalStorage()
            .then(data => {
                let arr = Array.from(data);
                arr.push(board);
                localStorage.setItem('dashboards', JSON.stringify(arr));
                let db = new Dashboard({id: board.id, name: board.name, tasks: [], startDate: board.startDate, endDate: board.endDate});
                localStorage.setItem(`dashboard-${board.id}`, JSON.stringify(db));
            });
    }

}