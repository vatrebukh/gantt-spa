import { UserService, User } from '../frontend/static/js/user-service';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const sut = new UserService();
const rootMock = '<body><div id="root"></div></body>';

describe('getNewUserHtml', () => {
    test('should render new user form', () => {
        document.body.innerHTML = rootMock;
        document.getElementById('root').innerHTML = sut.getNewUserHtml();
  
        const newUserDiv = document.querySelector('#new-user');
        expect(newUserDiv).toBeTruthy();

        const inputs = newUserDiv.querySelectorAll('input');
        expect(inputs).toBeTruthy();
        expect(inputs).toHaveLength(1);

        const buttons = newUserDiv.querySelectorAll('button');
        expect(buttons).toBeTruthy();
        expect(buttons).toHaveLength(2);
    });
});

describe('getUsersHtml', () => {
    beforeEach(() => {
        document.body.innerHTML = rootMock;
    });

    test('should render empty list', () => {
        document.getElementById('root').innerHTML = sut.getUsersHtml([]);

        const userContainer = document.querySelector('div.users-container');
        expect(userContainer).toBeTruthy();
  
        const userList = userContainer.querySelectorAll('li');
        expect(userList).toBeTruthy();
        expect(userList).toHaveLength(0);

        const buttons = userContainer.querySelectorAll('button');
        expect(buttons).toBeTruthy();
        expect(buttons).toHaveLength(1);
    });

    test('should render one user', () => {
        document.getElementById('root').innerHTML = sut.getUsersHtml([{ id: 1, name: 'User One' }]);

        const userContainer = document.querySelector('div.users-container');
        expect(userContainer).toBeTruthy();
  
        const userList = userContainer.querySelectorAll('li');
        expect(userList).toBeTruthy();
        expect(userList).toHaveLength(1);
        const userOne = userList[0];
        expect(userOne).toBeTruthy();
        expect(userOne.querySelector('label').textContent).toBe('1');
        expect(userOne.querySelector('span.team-name').textContent).toBe('User One');

        const buttons = userContainer.querySelectorAll('button');
        expect(buttons).toBeTruthy();
        expect(buttons).toHaveLength(1);
    });

    test('should render two users', () => {
        document.getElementById('root').innerHTML = sut.getUsersHtml([{ id: 1, name: 'User One' }, { id: 2, name: 'User Two' }]);

        const userContainer = document.querySelector('div.users-container');
        expect(userContainer).toBeTruthy();
  
        const userList = userContainer.querySelectorAll('li');
        expect(userList).toBeTruthy();
        expect(userList).toHaveLength(2);
        const userOne = userList[0];
        expect(userOne).toBeTruthy();
        expect(userOne.querySelector('label').textContent).toBe('1');
        expect(userOne.querySelector('span.team-name').textContent).toBe('User One');
        const userTwo = userList[1];
        expect(userTwo).toBeTruthy();
        expect(userTwo.querySelector('label').textContent).toBe('2');
        expect(userTwo.querySelector('span.team-name').textContent).toBe('User Two');

        const buttons = userContainer.querySelectorAll('button');
        expect(buttons).toBeTruthy();
        expect(buttons).toHaveLength(1);
    });
});

describe('getNewId', () => {
    test('should return next id', () => {
        const users = [{ id: 1001, name: 'User One' }, { id: 1002, name: 'User Two' }];
        expect(sut.getNewId(users)).toBe(1003);
    });

    test('should return id from between', () => {
        const users = [{ id: 1001, name: 'User One' }, { id: 1004, name: 'User Two' }];
        expect(sut.getNewId(users)).toBe(1002);
    });
});

describe('getUsers', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should fetch users', async () => {
        fetchMock.mockResponse(JSON.stringify([{ id: 1001, name: 'User One' }]));
        const users = await sut.getUsers();
        expect(users).toHaveLength(1);
        expect(users[0].id).toBe(1001);
        expect(users[0].name).toBe('User One');
    });

    test('should get users from localstorage', async () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
            return JSON.stringify([{ id: 1001, name: 'User One' }]);
        });
        const users = await sut.getUsers();
        expect(users).toHaveLength(1);
        expect(users[0].id).toBe(1001);
        expect(users[0].name).toBe('User One');
    });
});

describe('addUser', () => {   
    test('should add user', async () => {
        fetchMock.mockResponse(JSON.stringify([{ id: 1001, name: 'User One' }]));
        document.getElementById('root').innerHTML = sut.getNewUserHtml();
        document.getElementById('new-user-name').value = 'Tom';
        await sut.addUser();
        const userContainer = document.querySelector('div.users-container');
        const userList = userContainer.querySelectorAll('li');
        expect(userList).toHaveLength(2);
        expect(userList[1].querySelector('label').textContent).toBe('1002');
        expect(userList[1].querySelector('span.team-name').textContent).toBe('Tom');

        localStorage.clear();
    });
});

describe('removeUser', () => {
    beforeEach(() => {
        document.body.innerHTML = rootMock;
    });

    test('should remove user', async () => {
        fetchMock.mockResponse(JSON.stringify([{ id: 1001, name: 'User One' }]));
        await sut.renderUsers();

        let element = document.querySelectorAll('img.rmmark')[0];
        element.target = element;

        await sut.removeUser(element);
        const userContainer = document.querySelector('div.users-container');
        const userList = userContainer.querySelectorAll('li');
        expect(userList).toHaveLength(0);
    });
})