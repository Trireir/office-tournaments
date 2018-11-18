const { getStorage, saveStorage, allStorage, deleteStorage } = require('./commands-services/services');

module.exports = function() {
  if (!process.env.HALO_USERNAME || !process.env.HALO_PASSWORD || !process.env.HALO_BASE_URL
    || !process.env.HALO_STORAGE_USERS || !process.env.HALO_STORAGE_TEAMS || !process.env.HALO_STORAGE_CHANNELS) {
    throw new Error('Configuration not complete');
  }

  return {
    teams: {
      get: getStorage(process.env.HALO_STORAGE_TEAMS),
      save: saveStorage(process.env.HALO_STORAGE_TEAMS),
      all: allStorage(process.env.HALO_STORAGE_TEAMS),
      delete: deleteStorage(process.env.HALO_STORAGE_TEAMS)
    },
    channels: {
      get: getStorage(process.env.HALO_STORAGE_CHANNELS),
      save: saveStorage(process.env.HALO_STORAGE_CHANNELS),
      all: allStorage(process.env.HALO_STORAGE_CHANNELS),
      delete: deleteStorage(process.env.HALO_STORAGE_CHANNELS)
    },
    users: {
      get: getStorage(process.env.HALO_STORAGE_USERS),
      save: saveStorage(process.env.HALO_STORAGE_USERS),
      all: allStorage(process.env.HALO_STORAGE_USERS),
      delete: deleteStorage(process.env.HALO_STORAGE_USERS)
    }
  };
}