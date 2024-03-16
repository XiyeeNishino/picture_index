<template>
    <div class="search-result">
        <!-- 页面标题 -->
        <h1 class="page-title">纺织/布料图片检索系统</h1>
        <br> <br>

        <!-- 上传图片区域 -->
        <div class="upload-container">
            <div class="file">
                <input type="file" class="updata" accept="image/*" @change="change($event)" ref="updata">
                <img :src="imageUrl ? imageUrl : baseImg" alt="" class="img">
                <div class="reupload-text">点击重新上传</div>
            </div>
        </div>
        <div class="black-back">
        </div>
        <!-- 检索结果展示 -->
        <div class="result-container">
            <h2 class="result-title">相似图片</h2>
            <br> <br> <br> <br> <br> <br> <br> <br>
            <div class="demo-image__lazy" ref="lazyContainer">
                <a v-for="(url, index) in visibleUrls" :key="index" class="image-wrapper" :href="url" target="_blank">
                    <img :src="url" class="image-item" />
                </a>
            </div>
            <div v-if="loading" class="loading-spinner">
                <img src="@/assets/loading.gif" alt="Loading..." />
            </div>
            <div v-if="allLoaded" class="loading-spinner">
                <div>
                    <el-alert title="没有更多搜索结果~" type="info" show-icon center />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        const urls = [];
        for (let i = 0; i < 100; i++) {
            urls.push(require('@/assets/cxk.png'));
        }
        return {
            imageUrl: '',
            baseImg: '',
            urls,
            loadedCount: 20,
            lazyOffset: 20,
            loading: false,
            allLoaded: false
        }
    },
    methods: {
        change(e) {
            console.log(e.target.files[0].name);
            let file = e.target.files[0]
            var reader = new FileReader()
            var that = this
            reader.readAsDataURL(file)
            reader.onload = e => {
                console.log('读取成功');
                that.imageUrl = e.target.result
            }

        },
        lazyLoadHandler() {
            const container = this.$refs.lazyContainer;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            if ((rect.bottom - window.innerHeight) <= 50 && !this.loading) {
                this.loading = true;
                setTimeout(() => {
                    this.loadedCount += this.lazyOffset;
                    this.loading = false;
                }, 500);
                if (this.loadedCount >= this.urls.length) {
                    this.allLoaded = true;
                    this.loading = false;
                }
            }
        }
    },
    created() {
        this.baseImg = require('@/assets/cxk.png')
    },
    computed: {
        visibleUrls() {
            return this.urls.slice(0, this.loadedCount);
        },
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('scroll', this.lazyLoadHandler);
        });
    },
    unmounted() {
        window.removeEventListener('scroll', this.lazyLoadHandler);
    },
}
</script>

<style>
.loading-spinner {
    text-align: center;
    margin-top: 20px;
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
    position: relative;
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

.demo-image__lazy {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.image-wrapper {
    display: inline-block;
    position: relative;
    overflow: hidden;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin-left: 60px;
    margin-bottom: 10px;
}

.image-item {
    display: block;
    width: 250px;
    transition: transform 0.3s ease;
}

.image-wrapper:hover .image-item {
    transform: scale(1.05);
}
</style>
