class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    // this.users = this.users.filter((user) => user.id !== id);
    let userToRemove;
    let index;
    for (let [idx, user] of this.users.entries()) {
      if (user.id === id) {
        userToRemove = user;
        index = idx;
        break;
      }
    }
    if (index) {
      this.users.splice(index, 1);
    }
    return userToRemove;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  getUserList(room) {
    return this.users
      .filter((user) => user.room === room)
      .map((user) => user.name);
  }
}

module.exports = {
  Users,
};
