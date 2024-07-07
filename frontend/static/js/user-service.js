export class UserService {

    async renderUsers() {
        const users = await this.getUsers();
        document.getElementById('root').innerHTML = this.getUsersHtml(users);
    }

    async getUsers() {
        let data = JSON.parse(localStorage.getItem('users'));
        return data ? data : await fetch('/static/data/users.json').then(response => response.json());
    }

    getUsersHtml(data) {
        return `
            <div class="users-container">
                <div id="users">
                    <ul>
                        ${Array.from(data).map(info => new User(info).getUserHtml()).join('')}
                    </ul>
                </div>
                <div id="add-user">
                    <button id="new-user-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>Add User</button>
                </div>
            </div>
        `;
    }

}

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }

    getUserHtml() {
        return `
            <li class="team-info">
                <label hidden>${this.id}</label>
                <span class="team-name">${this.name}</span>
            </li>
        `;
    }
}