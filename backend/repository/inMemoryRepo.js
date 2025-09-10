const store = new Map();

const Repo = {
    save: (key, value) => store.set(key, value),
    get: (key) => store.get(key) || null,
    exists: (key) => store.has(key),
    remove: (key) => store.delete(key),
    allKeys: () => Array.from(store.keys())
};

export default Repo;