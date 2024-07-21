export class UserService {

    async renderUsers() {
        const users = await this.getUsers();
        document.getElementById('root').innerHTML = this.getUsersHtml(users);
        this.assignEvents();
    }

    async getUsers() {
        let data = JSON.parse(localStorage.getItem('users'));
        return data ? data : await fetch('/static/data/users.json').then(response => response.json());
    }

    assignEvents() {
        document.querySelectorAll('img.rmmark').forEach(element => element.addEventListener('click', element => this.removeUser(element)));

        document.getElementById('new-user-btn').addEventListener('click', e => {
            document.getElementById('add-user').innerHTML = this.getNewUserHtml();
            document.getElementById('add-user-btn').addEventListener('click', () => this.addUser());
            document.getElementById('cncl-user-btn').addEventListener('click', () => this.onCancel());
        });
    }

    async removeUser(element) {
        let users = await this.getUsers();
        users = users.filter(user => user.id != element.target.parentElement.parentElement.querySelector('label').textContent);
        localStorage.setItem('users', JSON.stringify(users));
        await this.renderUsers();
    }

    async addUser() {
        const users = await this.getUsers();
        let username = document.getElementById('new-user-name');
        users.push({ id: this.getNewId(users), name: username.value });
        localStorage.setItem('users', JSON.stringify(users));
        await this.renderUsers();
    }

    onCancel() {
        document.getElementById('add-user').innerHTML = '<button id="new-user-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>Add User</button>';
        this.assignEvents();
    }

    getNewId(users) {
        let ids = users.map(user => user.id);
        let id = 1001; 
        while (ids.includes(id)) {
            id++;
        }
        return id;
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

    getNewUserHtml() {
        return `
            <div id="new-user">
                <input type="text" id="new-user-name" class="user-name" placeholder="User name"></input>
                <div>                
                    <button class="add-task-btn" id="add-user-btn"><span>Add user</span></button>
                    <button class="add-task-btn" id="cncl-user-btn"><span>Cancel</span></button>
                </div>
            </div>
        `;
    }
}

export class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }

    getUserHtml() {   //TODO: class name
        return `
            <li class="team-info">
                <label hidden>${this.id}</label>
                <span class="team-name">${this.name}</span>
                <span class="user-delete"><img class="rmmark" src="/static/img/del.svg"></span>
            </li>
        `;
    }
}