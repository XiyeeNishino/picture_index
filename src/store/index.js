import { createStore } from 'vuex';

export default createStore({
  state: {
    plist: [],
    path: '',
    imageDataUrl: null,
    cropData: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotate: 0,
    },
  },
  mutations: {
    setImageDataUrl(state, dataUrl) {
      state.imageDataUrl = dataUrl;
    },
    updateData(state, payload) {
      state.plist = payload.plist;
      state.path = payload.path;
    },
    setCropData(state, cropData) {
      state.cropData = cropData;
    },
  },
});
