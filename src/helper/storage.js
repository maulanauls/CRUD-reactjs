const storage = {
  set: async (key, value) => {
    let source = JSON.stringify(value);
    return localStorage.setItem(key, source);
  },
  get: async (key, defaultEmpty = null) => {
    let source = localStorage.getItem(key);
    if (source) {
      return JSON.parse(source);
    } else {
      return {};
    }
  },
  remove: async (key = null) => {
    return localStorage.removeItem(key);
  },
};

export default storage;
