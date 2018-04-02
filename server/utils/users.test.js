const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Peter',
        room: 'Spooner',
      },
      {
        id: '2',
        name: 'Lois',
        room: 'Quahog',
      },
      {
        id: '3',
        name: 'Stewie',
        room: 'Spooner',
      },
    ];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'John',
      room: 'The Office Fans',
    };
    users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    const userId = '3';
    const user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should NOT remove a user', () => {
    const userId = '5';
    const user = users.removeUser(userId);
    expect(user).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should get a user', () => {
    expect(users.getUser('2').name).toBe('Lois');
  });

  it('should NOT get a user', () => {
    expect(users.getUser('5')).toBeUndefined();
  });

  it('should return names for Spooner', () => {
    expect(users.getUserList('Spooner')).toEqual(['Peter', 'Stewie']);
  });

  it('should return names for Quahog', () => {
    expect(users.getUserList('Quahog')).toEqual(['Lois']);
  });
});
