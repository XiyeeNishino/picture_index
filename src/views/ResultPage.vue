<template>
    <div class="search-result">
        <!-- 页面标题 -->
        <h1 class="page-title">纺织/布料图片检索系统</h1>
        <br> <br>
        <!-- 上传图片区域 -->
        <div class="upload-container">
            <a href="/" class="file">
                <img :src="imageUrl ? imageUrl : pathData" alt="" class="img">
                <div class="reupload-text">点击重新上传</div>
            </a>
        </div>
        <div class="black-back">
        </div>
        <!-- 检索结果展示 -->
        <div class="result-container">
            <h2 class="result-title">相似图片</h2>
            <br> <br> <br> <br> <br> <br> <br> <br>
            <div class="masonry">
                <a v-for="(img, index) in imgList" :key="index">
                    <div class="item" id="v-waterfall">
                        <img :src="img" alt="image" @click="openOriginal(img)">
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            pathData: '',
            plistData: [],
            imgList: [],
            imageUrl: '',
            baseImg: '',
            loading: false,
            allLoaded: false
        }
    },
    methods: {
        openOriginal(imageUrl) {
            window.open(imageUrl, '_blank');
        },
        fetchImage() {
            fetch(this.pathData, {
                method: 'GET',
                headers: {
                    'Content-Type': 'image/jpg'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer();
                })
                .then(arrayBuffer => {
                    const binaryImageData = new Uint8Array(arrayBuffer);
                    const base64ImageData = this.arrayBufferToBase64(binaryImageData);
                    this.imageUrl = `data:image/jpeg;base64,${base64ImageData}`;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        },
        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },
        receiveAndStoreData() {
            // 接收数据并存储到本地数据中
            this.plistData = this.plist;
            this.pathData = this.path;
        },
    },
    created() {
        this.receiveAndStoreData();
        console.log(this.plistData);
        console.log(this.pathData);
        this.pathData = "http://127.0.0.1:5000//statics/upload/" + this.pathData;
        this.fetchImage();
        console.log(this.pathData);
        for (let i = 0; i < this.plistData.length; i++) {
            this.imgList.push("http://127.0.0.1:5000//statics/index/" + this.plistData[i]);
        }
        console.log(this.imgList);
    },
    computed: {
        ...mapState(['plist', 'path']),
    },
    mounted() {
    },
    unmounted() {
    },
}
</script>

<style>
.masonry {
    width: 90%;
    margin: 20px auto;
    columns: 5;
    column-gap: 30px;
}

.item {
    width: 100%;
    break-inside: avoid;
    margin-bottom: 30px;
}

.item img {
    width: 102%;
    height: auto;
    border: 2px solid #ddd;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.item img:hover {
    transform: scale(1.05);
    cursor: pointer;
}

body {
    overflow-x: hidden;
}

.loading-spinner img {
    width: 50px;
    height: 50px;
}

.search-result {
    text-align: center;
}

.page-title {
    margin-bottom: 20px;
    font-family: "等线", Arial, sans-serif;
}

.upload-container {
    margin-bottom: 20px;
}

.black-back {
    background-color: #000;
    padding: 80px;
    width: 100%;
}

.result-title {
    position: absolute;
    margin-top: 80px;
    left: 60px;
}

.result-image {
    width: 100%;
    display: block;
    margin-bottom: 20px;
}

.reupload-text {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.file {
    z-index: 1;
    position: absolute;
    top: 200px;
    left: 60px;
    cursor: pointer;
    width: 150px;
    height: 150px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}


.updata {
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    cursor: pointer;
}

.img {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 150px;
}
</style>