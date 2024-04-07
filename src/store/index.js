import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      plist: JSON.parse(sessionStorage.getItem('plist')) || [],
      path: sessionStorage.getItem('path') || '',
      cropData: {
        x: 0,
        y: 0,
        width: 230,
        height: 163,
        rotate: 0,
      },
      imageDataUrl: "/image/default.png",
      fromResultPage: true,
      filename: "default.png",
    };
  },
  mutations: {
    updateData(state, { plist, path }) {
      state.plist = plist;
      state.path = path;
      sessionStorage.setItem('plist', JSON.stringify(plist));
      sessionStorage.setItem('path', path);
    },
    setCropData(state, cropData) {
      state.cropData = cropData;
      sessionStorage.setItem('cropData', JSON.stringify(cropData));
    },
    setImageDataUrl(state, dataUrl) {
      state.imageDataUrl = dataUrl;
      sessionStorage.setItem('imageDataUrl', dataUrl);
    },
    setFromResultPage(state, value) {
      state.fromResultPage = value;
    },
    setFileName(state, fileName) {
      state.filename = fileName;
    }
  },
});
