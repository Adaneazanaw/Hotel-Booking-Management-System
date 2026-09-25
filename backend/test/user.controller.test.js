const test = require('node:test');
const assert = require('node:assert/strict');
const models = require('../models');
const userController = require('../controllers/user.controller');

const originalUserModel = models.User;

function mockResponse() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

test('updateUser saves profile picture and user fields for the current admin', async () => {
  const mockUser = {
    id: 1,
    username: 'adminuser',
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@example.com',
    phone: '123456',
    role: 'admin',
    profilepicurl: 'https://old.example.com/avatar.png',
    update: async (changes) => {
      Object.assign(mockUser, changes);
      return mockUser;
    },
  };

  models.User = {
    findByPk: async (id) => (Number(id) === mockUser.id ? mockUser : null),
  };

  const req = {
    params: { id: '1' },
    body: {
      username: 'updatedadmin',
      profilepicurl: 'https://new.example.com/avatar.png',
    },
    user: { id: 1, role: 'admin' },
  };

  const res = mockResponse();

  await userController.updateUser(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.success, true);
  assert.equal(res.payload.user.profilepicurl, 'https://new.example.com/avatar.png');
  assert.equal(res.payload.user.username, 'updatedadmin');

  models.User = originalUserModel;
});
