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

async function getClasification(channel) {
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
      process.env.HALO_MODULE
    ],
    'searchValues': {
      'property': 'channel',
      'operation': 'in',
      'value': [
        channel
      ],
      'type': 'string'
    },
    'metaSearch': {
      'property': 'deletedAt',
      'operation': '=',
      'value': null,
      'type': 'null'
    }
  })
};

async function getPlayer(username, channel) {
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
      process.env.HALO_MODULE
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

function createUser(username, points, channel) {
  return AxiosHALO.post('generalcontent/instance', {
    name: username,
    module: process.env.HALO_MODULE,
    values: {
      name: username,
      points: points,
      channel: channel,
    }
  });
}

function updateUser(id, username, points, channel) {
  return AxiosHALO.put(`generalcontent/instance/${id}`, {
    'name': username,
    'module': process.env.HALO_MODULE,
    'values': {
      'name': username,
      'points': points,
      'channel': channel,
    },
  });
}

module.exports = {
  getPlayer,
  getClasification,
  createUser,
  updateUser
}