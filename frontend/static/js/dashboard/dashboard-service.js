import { Dashboard } from "./Dashboard.js";
import { Task } from "./Task.js";
import { getDaysCount } from "../utility.js";

export class DashboardService {
    
    async loadDashboard(args) {
        let board = await this.getDashboardFromLocalStorage(args.id);
        this.renderDashboard(board);
    }

    renderDashboard(board) {
        document.getElementById('root').innerHTML = board.getDashboardHtml();
        document.querySelector('div.dashboard-header span.task-timeline').addEventListener('scroll', this.syncScroll);
        this.setBoardMaxWidth(board);
        this.assignControllEvents(board);
        this.assignCreateTaskEvent(board);
        this.assignEditEvents(board);
    }

    renderTaskList(board) {
        this.saveDashboardToLocalStorage(board);
        document.querySelector('ul.dashboard-tasks').innerHTML = board.getTaskListHtml();
        this.assignControllEvents(board);
        this.assignEditEvents(board);
        this.syncScroll();
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
        document.querySelectorAll('li.dashboard-task').forEach(element => this.assignEditEvent(board, element));
    }

    assignEditEvent(board, element) {
        element.addEventListener('dblclick', () => {
            let newTaskBtn = document.getElementById('new-task-btn');
            newTaskBtn.style.display = 'none';
            let newTaskEl = document.getElementById('new-task-plc');
            newTaskEl.innerHTML = board.getNewTaskHtml();

            let edited = board.tasks.filter(task => task.name == element.querySelector('span.task-name').textContent)[0];
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

    updateTask(edited, board) {
        this.populateTask(edited);
        this.hideNewTaskBlock();
        this.renderTaskList(board);
    }

    assignCreateTaskEvent(board) {
        let newTaskBtn = document.getElementById('new-task-btn');
        newTaskBtn.addEventListener('click', () => {
            document.getElementById('new-task-plc').innerHTML = board.getNewTaskHtml();
            newTaskBtn.style.display = 'none';
            document.getElementById('add-task-btn').addEventListener('click', () => this.addNewTask(board));
            document.getElementById('cncl-task-btn').addEventListener('click', () => this.hideNewTaskBlock());
        });
    }

    addNewTask(board) {
        let newTask = new Task();
        this.populateTask(newTask);
        if (!newTask.name || !newTask.startDate || !newTask.endDate) {
            console.warn('Mandatory fields required');
            return;
        }
        board.tasks.push(newTask);
        this.renderTaskList(board);
        this.hideNewTaskBlock();
    }

    hideNewTaskBlock() {
        document.getElementById('new-task-plc').innerHTML = '';
        document.getElementById('new-task-btn').style.display = 'block';
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

    removeTask(board, element) {
        board.tasks = board.tasks.filter(task => task.name != element.parentElement.parentElement.parentElement.querySelector('span.task-name').textContent);
        this.renderTaskList(board);
    }

    moveUp(board, element) {
        board.moveDown(element.parentElement.parentElement.parentElement.querySelector('span.task-name').textContent);
        this.renderTaskList(board);
    }

    moveDown(board, element) {
        board.moveUp(element.parentElement.parentElement.parentElement.querySelector('span.task-name').textContent);
        this.renderTaskList(board);
    }

    syncScroll() {
        const masterSpan = document.querySelector('div.dashboard-header span.task-timeline');
        const taskSpans = document.querySelectorAll('ul.dashboard-tasks span.task-timeline');
        taskSpans.forEach((span) => span.scrollLeft = masterSpan.scrollLeft);
      }

    async getDashboardFromLocalStorage(id) {
        let data = JSON.parse(localStorage.getItem(`dashboard-${id}`));
        return data ? new Dashboard(data) : this.getDashboard(id);
    }

    async getDashboard(id) {
        return fetch(`/static/data/board-${id}.json`)
            .then(response => response.json())
            .then(data => new Dashboard(data));
    }

    saveDashboardToLocalStorage(board) {
        localStorage.setItem(`dashboard-${board.id}`, JSON.stringify(board));
    }   
}
