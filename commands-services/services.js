const axios = require('axios');

let token;
const AxiosHALO = axios.create({
  baseURL: 'https://halo-stage.mobgen.com/api/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

AxiosHALO.interceptors.response.use(
  res => (Promise.resolve(res.data)),
  (err) => {
    if (err && err.response && err.response.status === 401 && !err.config._retry && !err.config.url.includes('oauth/token')) {
      const originalRequest = err.config;
      originalRequest._retry = true;
      return AxiosHALO.post('oauth/token', {
        username: process.env.HALO_USERNAME,
        password: process.env.HALO_PASSWORD,
        grant_type: 'password',
      }).then((data) => {
        token = data.access_token;
        AxiosHALO.defaults.headers.common.Authorization = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return AxiosHALO(originalRequest);
      }).catch((err) => {
        return Promise.reject(err.error.message);
      })
    }
    if (err && err.response && err.response.data) {
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err);
  },
);

async function getClasification(team, channel) {
  return AxiosHALO.post('generalcontent/instance/search', {
    'searchSettings': {
      'enableSlowSearch': true
    },
    'sortSettings': {
      'enableSlowSort': true,
      'sortLocale': 'en-EN'
    },
    'sort': 'values.points desc',
    'pagination': {
      'page': 1,
      'limit': 200
    },
    'moduleIds': [
      process.env.HALO_MODULE_USERS
    ],
    'searchValues': {
      'condition': 'and',
      'operands': [{
      'property': 'channel',
      'operation': 'in',
      'value': [
        channel
      ],
      'type': 'string'
      }, {
        'property': 'team',
        'operation': 'in',
        'value': [
          team
        ],
        'type': 'string'
      }]
    },
    'metaSearch': {
      'property': 'deletedAt',
      'operation': '=',
      'value': null,
      'type': 'null'
    }
  })
};

async function getPlayer(username, team, channel) {
  return AxiosHALO.post('generalcontent/instance/search', {
    'searchSettings': {
      'enableSlowSearch': true
    },
    'sortSettings': {
      'enableSlowSort': true,
      'sortLocale': 'en-EN'
    },
    'sort': 'values.points asc',
    'pagination': {
      'page': 1,
      'limit': 1
    },
    'moduleIds': [
      process.env.HALO_MODULE_USERS
    ],
    'searchValues': {
      'condition': 'and',
      'operands': [{
      'property': 'channel',
      'operation': 'in',
      'value': [
        channel
      ],
      'type': 'string'
      }, {
        'property': 'team',
        'operation': 'in',
        'value': [
          team
        ],
        'type': 'string'
      }, {
        'property': 'name',
        'operation': 'in',
        'value': [
          username
        ],
        'type': 'string'
      }]
    },
    'metaSearch': {
      'property': 'deletedAt',
      'operation': '=',
      'value': null,
      'type': 'null'
    }
  })
};

function createUser(username, points, team, channel) {
  return AxiosHALO.post('generalcontent/instance', {
    name: username,
    module: process.env.HALO_MODULE_USERS,
    values: {
      name: username,
      points,
      channel,
      team,
    }
  });
}

function updateUser(id, username, points, team, channel) {
  return AxiosHALO.put(`generalcontent/instance/${id}`, {
    'name': username,
    'module': process.env.HALO_MODULE_USERS,
    'values': {
      name: username,
      points: points,
      channel: channel,
      team: team,

    },
  });
}

// Functions to store botkit info of users, channels and teams
function getStorage(module) {
  return function(id, cb) {
    AxiosHALO.post('generalcontent/instance/search', {
      'pagination': {
        'page': 1,
        'limit': 1
      },
      'moduleIds': [
        module
      ],
      'searchValues': {
        'property': 'id',
        'operation': 'in',
        'value': [
          id
        ],
        'type': 'string'
      },
      'metaSearch': {
        'property': 'deletedAt',
        'operation': '=',
        'value': null,
        'type': 'null'
      }
    }).then((response) => {
      if(response.items[0]) {
        cb(null, response.items[0].values.data);
      } else {
        cb('Not found');
      }
    }).catch((err) => {
      cb('Error in storage: ', err.message);
    });
  }
}

function saveStorage(module) {
  return function(data, cb) {
    AxiosHALO.post('generalcontent/instance', {
      name: data.id,
      module: module,
      values: {
        id: data.id,
        data: data,
      }
    }).then((res) => {
      cb(null, 'Saved');
    }).catch((err) => {
      cb(err);
    })
  }
}

function deleteStorage(module) {
  return function(data, cb) {
    AxiosHALO.post('generalcontent/instance/search', {
      'pagination': {
        'page': 1,
        'limit': 1
      },
      'moduleIds': [
        module
      ],
      'searchValues': {
        'property': 'id',
        'operation': 'in',
        'value': [
          data.id
        ],
        'type': 'string'
      },
      'metaSearch': {
        'property': 'deletedAt',
        'operation': '=',
        'value': null,
        'type': 'null'
      }
    }).then((response) => {
      if(response.items[0]) {
        AxiosHALO.delete(`generalcontent/instance/${response.items[0].id}`)
        .then(() => {
          cb(null, 'Removed');
        })
      } else {
        cb('Not found');
      }
    }).catch((err) => {
      cb('Error removing from storage: ', err.message);
    });
  }
}

function allStorage(module) {
  return function(cb) {
    AxiosHALO.post('generalcontent/instance/search', {
      'moduleIds': [
        module
      ],
      'metaSearch': {
        'property': 'deletedAt',
        'operation': '=',
        'value': null,
        'type': 'null'
      }
    }).then((response) => {
      if(response.items) {
        const values = response.items.map(i => i.values.data);
        cb(null, values);
      } else {
        cb('Not found');
      }
    });
  }
}

module.exports = {
  getPlayer,
  getClasification,
  createUser,
  updateUser,
  getStorage,
  saveStorage,
  deleteStorage,
  allStorage,
}