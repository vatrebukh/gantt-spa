import { navigate } from "./index.js";
import { User } from "./user-service.js";
import { UserService } from "./user-service.js";

const userService = new UserService();

export class TeamService {

    async renderTeams() {
        const teams = await this.loadTeams();
        document.getElementById('root').innerHTML = this.getTeamsHtml(teams);
        this.assignEvents();
    }

    async renderTeam(teamId) {
        let team = Array.from(await this.loadTeams()).filter(el => el.id == teamId).map(el => new Team(el))[0];
        document.getElementById('root').innerHTML = this.getTeamHtml(team);
        this.assignTeamEvents(team);
    }

    async loadTeams() {
        let data = JSON.parse(localStorage.getItem('teams'));
        return data ? data : await fetch('/static/data/teams.json').then(response => response.json());
    }

    assignTeamEvents(team) {
        document.querySelectorAll('img.rmmark').forEach(element => element.addEventListener('click', element => this.removeUser(team, element)));

        document.getElementById('new-user-btn').addEventListener('click', e => {
            document.getElementById('add-user').innerHTML = userService.getNewUserHtml();
            document.getElementById('add-user-btn').addEventListener('click', () => this.addUser(team));
            document.getElementById('cncl-user-btn').addEventListener('click', () => this.onCancel());
        });
    }

    async addUser(team) {
        team.users.push({ id: this.getNewId(team.users), name: document.getElementById('new-user-name').value });
        await this.updateTeam(team);
        await this.renderTeam(team.id);
    }

    onCancel() {
        document.getElementById('add-user').innerHTML = '<button id="new-user-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>Add User</button>';
        this.assignTeamEvents();
    }

    getNewId(users) {
        let ids = users.map(user => user.id);
        let id = 1001; 
        while (ids.includes(id)) {
            id++;
        }
        return id;
    }

    async removeUser(team, element) {
        console.log(team);
        team.users = team.users.filter(user => user.id != element.target.parentElement.parentElement.querySelector('label').textContent);
        await this.updateTeam(team);
        await this.renderTeam(team.id);
    }

    async updateTeam(team) {
        let teams = await this.loadTeams();
        teams = teams.map(it => {
            if (it.id == team.id) {
                it.users = team.users;
                it.name = team.name;
            }
            return it;
        })
        localStorage.setItem('teams', JSON.stringify(teams));
    }

    getTeamsHtml(data) {
        return `
            <div class="teams-container">
                <div id="add-team">
                    <button id="new-team-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>New Team</button>
                </div>
                <div id="team-infos">
                    ${Array.from(data).map(info => new Team(info).getTeamInfoHtml()).join('')}
                </div>
            </div>
        `;
    }

    getTeamHtml(team) {
        return `
            <div class="teams-container">
                <div id="team-info">
                    <span>${team.name}</span>
                    <div id="users">
                        <ul>
                            ${Array.from(team.users).map(info => new User(info).getUserHtml()).join('')}
                        </ul>
                    </div>
                </div>
                <div id="add-user">
                    <button id="new-user-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>Add User</button>
                </div>
            </div>
        `;
    }

    assignEvents() {
        document.querySelectorAll('div.team-info')
            .forEach(element => element.addEventListener('click', e => {
                let parent = this.findElement(e.target, 'div.team-info');
                let id = parent.querySelector('label').textContent;
                history.pushState(null, null, `/teams/${id}`);
                navigate();
            }));
        
        document.getElementById('new-team-btn').addEventListener('click', e => {
            history.pushState(null, null, '/teams/new');
            navigate();
        });
    }

    findElement(target, description) {
        if (target.matches(description)) {
            return target;
        } else {
            return this.findElement(target.parentElement, description);
        }
    }
}

class Team {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.users = data.users;
    }

    getTeamInfoHtml() {
        return `
            <div class="team-info">
                <label hidden>${this.id}</label>
                <div class="team-name">${this.name}</div>
                <div>Members: ${this.users.length}</div>
            </div>
        `;
    }
}