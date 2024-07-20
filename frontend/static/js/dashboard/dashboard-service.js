import { Dashboard, Status } from "./Dashboard.js";
import { TeamService } from "../team-service.js";
import { Task } from "./Task.js";
import { getDaysCount } from "../utility.js";
import { navigate } from "../index.js";

export class DashboardService {

    teamService = new TeamService();
    
    async loadDashboard(args) {
        let board = await this.findDashboard(args.id);
        this.renderDashboard(board);
    }

    renderDashboard(board) {
        document.getElementById('root').innerHTML = board.getDashboardHtml();
        document.querySelector('div.dashboard-header span.task-timeline').addEventListener('scroll', this.syncScroll);
        this.setBoardMaxWidth(board);
        this.assignChangeStatusEvent(board);
        if (board.status != Status.CLOSED) {
            this.assignControllEvents(board);
            this.assignCreateTaskEvent(board);
            this.assignEditEvents(board);
        }
    }

    renderTaskList(board) {
        document.querySelector('ul.dashboard-tasks').innerHTML = board.getTaskListHtml();
        this.syncScroll();
        if (board.status != Status.CLOSED) {
            this.assignControllEvents(board);
            this.assignEditEvents(board);
        }
    }

    setBoardMaxWidth(board) {
        let timeSpanWidth = getDaysCount(board.startDate, board.endDate) * 25 + 1;
        document.querySelectorAll('span.task-timeline').forEach(element => element.style.maxWidth = `${timeSpanWidth}px`);
        let assigneeWidth = document.querySelector('span.task-assignee').offsetWidth;
        let nameWidth = document.querySelector('span.task-name').offsetWidth;
        let controlsWidth = document.querySelector('span.task-controls').offsetWidth;

        document.querySelector('div.dashboard-content').style.maxWidth = assigneeWidth + nameWidth + timeSpanWidth + controlsWidth - 4 + 'px';
    }

    assignEditEvents(board) {
        document.querySelectorAll('li.dashboard-task').forEach(element => this.assignEditTaskEvent(board, element));
    }

    assignEditTaskEvent(board, element) {
        element.addEventListener('dblclick', () => {
            let newTaskBtn = document.getElementById('dashboard-btns');
            newTaskBtn.style.display = 'none';
            let newTaskEl = document.getElementById('new-task-plc');
            newTaskEl.innerHTML = board.getNewTaskHtml();

            let edited = board.tasks.filter(task => task.id == element.querySelector('label').textContent)[0];
            this.populateEditTask(edited);

            document.getElementById('add-task-btn').textContent = 'Save task';
            document.getElementById('add-task-btn').addEventListener('click', () => this.updateTask(edited, board));
            document.getElementById('cncl-task-btn').addEventListener('click', () => this.hideNewTaskBlock());
        });
    }

    populateEditTask(edited) {
        document.getElementById('new-task-assignee').value = edited.assignee;
        document.getElementById('new-task-name').value = edited.name;
        document.getElementById('new-task-start').value = edited.startDate;
        document.getElementById('new-task-end').value = edited.endDate;
    }

    async updateTask(edited, board) {
        this.populateTask(edited);
        if (edited.startDate > edited.endDate) {
            console.warn('Start date is later then end date');
        } else {
            this.hideNewTaskBlock();
            await this.saveDashboard(board);
            this.renderTaskList(board);
        }
    }

    assignCreateTaskEvent(board) {
        document.getElementById('new-task-btn').addEventListener('click', () => {
            document.getElementById('new-task-plc').innerHTML = board.getNewTaskHtml();
            document.getElementById('dashboard-btns').style.display = 'none';
            document.getElementById('add-task-btn').addEventListener('click', () => this.addNewTask(board));
            document.getElementById('cncl-task-btn').addEventListener('click', () => this.hideNewTaskBlock());
        });
    }

    assignChangeStatusEvent(board) {
        document.getElementById('chng-sts-btn').addEventListener('click', async () => {
            if (board.status == Status.CLOSED) {
                await this.removeDashboard(board);
                history.pushState(null, null, `/dashboards`);
                navigate();
                return;
            }

            if (board.status == Status.NEW) {
                board.status = Status.ACTIVE;
            } else if (board.status == Status.ACTIVE) {
                board.status = Status.CLOSED;
            }
            await this.saveDashboard(board);
            this.renderDashboard(board);
        });
    }

    async removeDashboard(board) {
        let boards = Array.from(await this.getDashboards()).filter(el => el.id != board.id);
        localStorage.setItem('dashboards', JSON.stringify(boards));
    }

    async addNewTask(board) {
        let newTask = new Task();
        newTask.id = this.getNewTaskId(board);
        this.populateTask(newTask);
        if (!newTask.name || !newTask.startDate || !newTask.endDate) {
            console.warn('Mandatory fields required');
            return;
        }
        if (newTask.startDate > newTask.endDate) {
            console.warn('Start date is later then end date');
            return;
        }
        board.tasks.push(newTask);
        await this.saveDashboard(board);  //todo: save on click?
        this.hideNewTaskBlock();
        this.renderTaskList(board);
    }

    hideNewTaskBlock() {
        document.getElementById('new-task-plc').innerHTML = '';
        document.getElementById('dashboard-btns').style.display = 'block';
    }

    getNewTaskId(board) {
        let ids = board.tasks.map(task => task.id);
        let id = 1001; 
        while (ids.includes(id)) {
            id++;
        }
        return id;
    }

    populateTask(task) {
        task.assignee = document.getElementById('new-task-assignee').value;
        task.name = document.getElementById('new-task-name').value ;
        task.startDate = document.getElementById('new-task-start').value;
        task.endDate = document.getElementById('new-task-end').value;
    }

    assignControllEvents(board) { 
        document.querySelectorAll('img.rmmark').forEach(element => element.addEventListener('click', () => this.removeTask(board, element)));
        document.querySelectorAll('img.dnmark').forEach(element => element.addEventListener('click', () => this.moveUp(board, element)));
        document.querySelectorAll('img.upmark').forEach(element => element.addEventListener('click', () => this.moveDown(board, element)));
    }

    async removeTask(board, element) {
        board.tasks = board.tasks.filter(task => task.id != element.parentElement.parentElement.parentElement.querySelector('label').textContent);
        await this.saveDashboard(board);  //todo: save on click?
        this.renderTaskList(board);
    }

    async moveUp(board, element) {
        board.moveDown(element.parentElement.parentElement.parentElement.querySelector('label').textContent);
        await this.saveDashboard(board);  //todo: save on click?
        this.renderTaskList(board);
    }

    async moveDown(board, element) {
        board.moveUp(element.parentElement.parentElement.parentElement.querySelector('label').textContent);
        await this.saveDashboard(board);  //todo: save on click?
        this.renderTaskList(board);
    }

    syncScroll() {
        const masterSpan = document.querySelector('div.dashboard-header span.task-timeline');
        const taskSpans = document.querySelectorAll('ul.dashboard-tasks span.task-timeline');
        taskSpans.forEach((span) => span.scrollLeft = masterSpan.scrollLeft);
    }

    async createDashboard() {
        let teams = await this.teamService.loadTeams();
        let newBoard = new Dashboard({})
        document.getElementById('root').innerHTML = newBoard.getBoardInfoHtml(teams);
        document.getElementById('add-board-btn').addEventListener('click', async () => {
            newBoard.name = document.getElementById('new-board-name').value;
            newBoard.startDate = document.getElementById('new-board-start').value;
            newBoard.endDate = document.getElementById('new-board-end').value;
            newBoard.id = await this.generateBoardId();
            newBoard.status = Status.NEW;
            newBoard.tasks = [];
            newBoard.team = this.findTeam(teams);
            await this.saveDashboard(newBoard);
            history.pushState(null, null, `/dashboard/${newBoard.id}`);
            navigate();
        });
        document.getElementById('cncl-board-btn').addEventListener('click', e => {
            history.pushState(null, null, '/');
            navigate();
        });
    }

    findTeam(teams) {
        let teamNameWithId = document.getElementById('team-name').value;
        let teamId = teamNameWithId.split('(')[1].split(')')[0];
        let team = Array.from(teams).filter(el => el.id == teamId)[0];
        return team;
    }

    async findDashboard(id) {
        let data = await this.getDashboards();
        return Array.from(data).filter(el => el.id == id).map(el => new Dashboard(el))[0];
    }

    async saveDashboard(board) {
        let boards = Array.from(await this.getDashboards()).filter(el => el.id != board.id);
        boards.push(board);
        localStorage.setItem('dashboards', JSON.stringify(boards));
    }

    async generateBoardId() {
        let ids = Array.from(await this.getDashboards()).filter(board => board && board.id).map(board => board.id);
        let id = 1001; 
        while (ids.includes(id)) {
            id++;
        }
        return id;
    }

    async getDashboards() {
        return JSON.parse(localStorage.getItem('dashboards')) || await fetch('/static/data/dashboards.json').then(response => response.json());
    }
}
