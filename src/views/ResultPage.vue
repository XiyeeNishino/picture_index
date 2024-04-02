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
        <h2 class="result-title">&nbsp;&nbsp;&nbsp;&nbsp;相似图片</h2>
        <br> <br> <br> <br> <br> <br> <br> <br>
        <div class="waterfall wf-wrap" ref="waterfall">
            <ul>
                <transition-group name="list" tag="li">
                    <li v-for="(item, index) in waterfallList" :key="index" class="wf-item" :style="{
                    top: item.top + 'px',
                    left: item.left + 'px',
                    width: item.width + 'px',
                    height: item.height + 'px',
                }">
                        <div class="v-waterfall-item">
                            <img :src="item.src" @click="openOriginal(item.src)" />
                        </div>
                    </li>
                </transition-group>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            plistData: [],
            pathData: '',
            images: [],
            waterfallList: [],
            waterfallCol: 5,
            colWidth: 350,
            marginRight: 10,
            marginBottom: 10,
            colHeights: [],
            apiIndex: 1,
            imageBatchSize: 100,  // 每批加载的图片数量
            imagesLoaded: 0,
        }
    },
    methods: {
        receiveAndStoreData() {
            // 接收数据并存储到本地数据中
            this.plistData = this.plist;
            this.pathData = this.path;
        },
        init() {
            this.colHeights = new Array(this.waterfallCol)
            for (let i = 0; i < this.colHeights.length; i++) {
                this.colHeights[i] = 0
            }
            this.colWidth =
                (this.$refs.waterfall.clientWidth -
                    (this.waterfallCol - 1) * this.marginRight) /
                this.waterfallCol
            this.loadImgs(this.apiIndex)
        },
        loadImgs() {
            let promiseAll = [],
                imgs = [],
                start = this.imagesLoaded,
                end = Math.min(this.imagesLoaded + this.imageBatchSize, this.images.length);
            this.imagesLoaded = end;

            for (let i = start; i < end; i++) {
                promiseAll.push(new Promise(resolve => {
                    imgs[i] = new Image();
                    imgs[i].src = this.images[i];
                    imgs[i].onload = () => {
                        let imgData = {
                            height: (imgs[i].height * this.colWidth) / imgs[i].width,
                            width: this.colWidth,
                            src: this.images[i]
                        };
                        this.waterfallList.push(imgData);
                        this.rankImgs(imgData);
                        resolve(imgs[i]);
                    };
                }));
            }

            Promise.all(promiseAll).then(() => {
                this.observe();
            });
        },
        observe() {
            let imgs = document.getElementsByClassName('wf-item');
            if (imgs.length === 0) return;

            let index = Math.max(0, imgs.length - 1);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target);
                        if (this.imagesLoaded < this.images.length) {
                            this.loadImgs(this.apiIndex);
                        }
                    }
                });
            }, {
                rootMargin: '0px',
                threshold: 0.1
            });
            observer.observe(imgs[index]);
        },
        openOriginal(imageUrl) {
            window.open(imageUrl, '_blank');
        },
        rankImgs(imgData) {
            let min = this.filterMin()
            imgData.top = min.minHeight
            imgData.left = min.minIndex * (this.colWidth + this.marginRight)
            this.colHeights[min.minIndex] += imgData.height + this.marginBottom
        },
        filterMin() {
            let minHeight = Math.min.apply(null, this.colHeights)
            return {
                minHeight: minHeight,
                minIndex: this.colHeights.indexOf(minHeight)
            }
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
    },
    created() {
        this.receiveAndStoreData();
        console.log(this.plistData);
        console.log(this.pathData);
        this.pathData = "http://127.0.0.1:5000//statics/upload/" + this.pathData;
        this.fetchImage();
        console.log(this.pathData);
        for (let i = 0; i < this.plistData.length; i++) {
            this.images.push("http://127.0.0.1:5000//statics/index/" + this.plistData[i]);
        }
    },
    computed: {
        ...mapState(['plist', 'path']),
    },
    mounted() {
        this.init()
    },
    unmounted() {
    },
}
</script>

<style>
body {
    margin-left: -10px;
    overflow-x: hidden;
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

ul li {
    list-style: none;
}

.wf-wrap {
    position: relative;
    width: 1500px;
    margin: 0 auto;
}

.wf-item {
    position: absolute;
    height: 100%;
}

.wf-item img {
    width: 100%;
}

.list-enter-active,
.list-leave-active {
    transition: all 1s;
}

.list-enter,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.v-waterfall-item img {
    border: 2px solid #ddd;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.v-waterfall-item img:hover {
    transform: scale(1.05);
    cursor: pointer;
}
</style>
