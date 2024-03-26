import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      plist: [],
      path: '',
    };
  },
  mutations: {
    updateData(state, { plist, path }) {
      state.plist = plist;
      state.path = path;
    },
  },
});
