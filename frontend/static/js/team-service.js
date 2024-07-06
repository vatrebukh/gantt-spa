
export class TeamService {

    async renderTeams() {
        const teams = await this.loadTeams();
        document.getElementById('root').innerHTML = this.getTeamsHtml(teams);
    }

    async loadTeams() {
        let data = JSON.parse(localStorage.getItem('teams'));
        return data ? data : await fetch('/static/data/teams.json').then(response => response.json());
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