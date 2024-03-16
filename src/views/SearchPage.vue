<template>
  <div class="textile-image-search">
    <div class="title-container">
      <h1 class="title">纺织/布料图片检索系统</h1>
    </div>
    <div class="file-input-container">
      <input type="file" @change="onSelectFile" accept="image/*" class="file-input">
    </div>
    <div class="cropping-container">
      <div class="cropper-container">
        <img ref="cropperImage" alt="Source Image">
      </div>
      <div class="preview-and-controls">
        <div class="preview-container"></div>
        <div class="data-controls">
          <div class="input-group"><label>X:</label><input type="number" v-model.number="cropData.x"></div>
          <div class="input-group"><label>Y:</label><input type="number" v-model.number="cropData.y"></div>
          <div class="input-group"><label>Width:</label><input type="number" v-model.number="cropData.width"></div>
          <div class="input-group"><label>Height:</label><input type="number" v-model.number="cropData.height"></div>
          <div class="input-group"><label>Rotate:</label><input type="number" v-model.number="cropData.rotate"></div>
          <div class="input-group"><label>ScaleX:</label><input type="number" v-model.number="cropData.scaleX"></div>
          <div class="input-group"><label>ScaleY:</label><input type="number" v-model.number="cropData.scaleY"></div>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <button @click="setAspectRatio(16 / 9)">16:9</button>
      <button @click="setAspectRatio(4 / 3)">4:3</button>
      <button @click="setAspectRatio(1 / 1)">1:1</button>
      <button @click="setAspectRatio(2 / 3)">2:3</button>
      <button @click="setAspectRatio(NaN)">Free</button>
      <button @click="rotate(90)">顺时针旋转 90°</button>
      <button @click="rotate(-90)">逆时针旋转 90°</button>
      <button @click="zoom(0.1)">放大</button>
      <button @click="zoom(-0.1)">缩小</button>
      <button @click="setDragMode('move')">移动</button>
      <button @click="setDragMode('crop')">裁剪</button>
    </div>
    <div class="navigation-button">
      <button @click="navigateToResultPage">检索</button>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default {
  data() {
    return {
      cropper: null,
      cropData: {
        x: 0,
        y: 0,
        width: 230,
        height: 163,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
      },
      updatingCropData: false,
    };
  },
  methods: {
    navigateToResultPage() {
      this.$router.push({ name: 'ResultPage' });
    },
    onSelectFile(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.$refs.cropperImage.src = e.target.result;
          this.$nextTick(this.initializeCropper);
        };
        reader.readAsDataURL(file);
      }
    },
    initializeCropper() {
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(this.$refs.cropperImage, {
        aspectRatio: 16 / 9,
        preview: '.preview-container',
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        crop: () => {
          if (!this.updatingCropData) {
            this.cropData = this.cropper.getData();
          }
        },
      });
    },
    setAspectRatio(ratio) {
      if (this.cropper) {
        this.cropper.setAspectRatio(ratio);
      }
    },
    rotate(degrees) {
      if (this.cropper) {
        this.cropper.clear();
        this.cropper.rotate(degrees);
        this.$nextTick(() => {
          this.cropper.crop();
        });
      }
    },
    zoom(amount) {
      if (this.cropper) {
        this.cropper.zoom(amount);
      }
    },
    setDragMode(mode) {
      if (this.cropper) {
        this.cropper.setDragMode(mode);
      }
    },
    updateCropData() {
      if (this.cropper) {
        this.updatingCropData = true;
        this.cropper.setData(this.cropData);
        this.updatingCropData = false;
      }
    },
  },
  watch: {
    cropData: {
      handler() {
        if (!this.updatingCropData) {
          this.updateCropData();
        }
      },
      deep: true,
      immediate: true
    },
  },
  beforeUnmount() {
    if (this.cropper) {
      this.cropper.destroy();
    }
  },
};
</script>

<style scoped>
.title {
    margin-bottom: 20px;
    font-family: "等线", Arial, sans-serif;
}

.textile-image-search {
  max-width: 800px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-container {
  margin-bottom: 20px;
}

.file-input-container {
  margin-bottom: 20px;
}

.cropping-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.cropper-container, .preview-container {
  border: 1px solid #ccc;
}

.cropper-container {
  flex: 1;
  margin-right: 20px;
  width: 600px;
  height: 400px;
}

.preview-container {
  width: 300px;
  height: 200px;
  margin-bottom: 20px;
  overflow: hidden;
}

.preview-and-controls {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-controls {
  display: flex;
  flex-direction: column;
  bottom: 170px;
  position: absolute;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label, .input-group input {
  margin-right: 5px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.action-buttons button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.action-buttons button:hover {
  background-color: #0056b3;
}

.navigation-button {
  margin-top: 20px;
}

.navigation-button button {
  padding: 10px 20px;
  background-color: #4CAF50; /* 绿色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.navigation-button button:hover {
  background-color: #45a049;
}
</style>
