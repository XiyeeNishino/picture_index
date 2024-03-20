<template>
  <div class="textile-image-search">
    <div class="title-container">
      <h1 class="title">纺织/布料图片检索系统</h1>
    </div>
    <div class="file-input-container">
      <input type="file" @change="onSelectFile" accept="image/*" ref="fileInput" style="display: none;">
      <el-input v-model="fileName" placeholder="未选择文件" readonly></el-input>
      <el-button @click="triggerFileInput">选择文件</el-button>
    </div>
    <div class="cropping-container">
      <div class="cropper-container">
        <img ref="cropperImage" alt="Source Image">
      </div>
      <div class="preview-and-controls">
        <div class="preview-container"></div>
        <div class="data-controls">
          <div class="input-group">
            <label>X:</label>
            <el-input-number v-model.number="cropData.x" controls-position="right"></el-input-number>
          </div>
          <div class="input-group">
            <label>Y:</label>
            <el-input-number v-model.number="cropData.y" controls-position="right"></el-input-number>
          </div>
          <div class="input-group">
            <label>Width:</label>
            <el-input-number v-model.number="cropData.width" controls-position="right"></el-input-number>
          </div>
          <div class="input-group">
            <label>Height:</label>
            <el-input-number v-model.number="cropData.height" controls-position="right"></el-input-number>
          </div>
          <div class="input-group">
            <label>Rotate:</label>
            <el-input-number v-model.number="cropData.rotate" controls-position="right"></el-input-number>
          </div>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <el-button-group>
        <el-button type="primary" circle @click="rotate(90)">
          <el-icon><refresh-right /></el-icon>
        </el-button>
        <el-button type="primary" circle @click="rotate(-90)">
          <el-icon><refresh-left /></el-icon>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" circle @click="zoom(0.1)">
          <el-icon><zoom-in /></el-icon>
        </el-button>
        <el-button type="primary" circle @click="zoom(-0.1)">
          <el-icon><zoom-out /></el-icon>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" circle @click="setDragMode('rank')">
          <el-icon>
            <rank />
          </el-icon>
        </el-button>
        <el-button type="primary" circle @click="setDragMode('crop')">
          <el-icon>
            <crop />
          </el-icon>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" @click="setAspectRatio(16 / 9)">16:9</el-button>
        <el-button type="primary" @click="setAspectRatio(4 / 3)">4:3</el-button>
        <el-button type="primary" @click="setAspectRatio(1 / 1)">1:1</el-button>
        <el-button type="primary" @click="setAspectRatio(2 / 3)">2:3</el-button>
        <el-button type="primary" @click="setAspectRatio(NaN)">Free</el-button>
      </el-button-group>
    </div>
    <div class="search-controls">
      <el-select v-model="selectedMaterials" multiple placeholder="请选择材料" class="material-select-static">
        <el-option label="原色数码布料" value="原色数码布料"></el-option>
        <el-option label="蕾丝" value="蕾丝"></el-option>
      </el-select>
      <el-button type="success" @click="navigateToResultPage">检索</el-button>
      <!-- <button @click="navigateToResultPage" class="search-button">检索</button> -->
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { ElSelect, ElOption, ElButton, ElButtonGroup, ElIcon, ElInputNumber } from 'element-plus';
import 'element-plus/dist/index.css';
import { RefreshRight, RefreshLeft, ZoomIn, ZoomOut, Rank, Crop } from '@element-plus/icons-vue';

export default {
  components: {
    ElSelect,
    ElOption,
    ElButton,
    ElButtonGroup,
    ElIcon,
    RefreshRight,
    RefreshLeft,
    ZoomIn,
    ZoomOut,
    Rank,
    Crop,
    ElInputNumber,
  },
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
      selectedMaterials: [],
    };
  },
  methods: {
    navigateToResultPage() {
      this.$router.push({ name: 'ResultPage' });
    },
    triggerFileInput() {
      // 触发文件输入的点击事件
      this.$refs.fileInput.click();
    },
    onSelectFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
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
        aspectRatio: NaN,
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
        this.selectedAspectRatio = ratio;
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
  font-family: "微软雅黑", "Microsoft YaHei", Arial, sans-serif;
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
  display: flex; 
  align-items: center; 
  gap: 10px; 
  margin-bottom: 20px;
}

.el-input {
  flex-grow: 1;
}

.cropping-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.cropper-container,
.preview-container {
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
  top: 380px;
  position: absolute;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  font-family: "微软雅黑", "Microsoft YaHei", Arial, sans-serif;
}

.input-group label,
.input-group input {
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
  background-color: #4CAF50;
  /* 绿色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.navigation-button button:hover {
  background-color: #45a049;
}

.search-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
}

.material-select-static {
  flex-grow: 1;
  margin-right: 20px;
}
</style>