<template>
    <div v-if="activeIndex != -1" ref="pitureViewComponentRef" class="picture-view-component" title="" @click="activeIndex = -1" @keyup.esc="activeIndex = -1" tabindex="0">
        <div class="close-preview" @click="activeIndex = -1">
            <i class="el-icon-close"></i>
        </div>
        <div class="last-pic-button" @click.stop="changePicIndex(-1)" v-if="imgPath.length > 1">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="next-pic-button" @click.stop="changePicIndex(1)" v-if="imgPath.length > 1">
            <i class="el-icon-arrow-right"></i>
        </div>
        <div class="picture-preview" @drop="drop" @dragover="dragover">
            <img 
                v-if="imgUrl && imgUrl.length > 0"
                id="previewImg" 
                class="picture-preview-img" 
                style="" 
                ref="previewImg" 
                :src="imgUrl[activeIndex]" 
                :style="{transform:'scale('+ scale +') rotate('+ deg +'deg)',top:top+'px',left:left+'px'}"
                @click.stop
                draggable="true" 
                @dragstart="dragstart($event)">
        </div>
        <div v-if="showTitle" class="picture-title" @click.stop>
            <span>截图来自设备：{{ imgPath[activeIndex].device_name }}</span>
        </div>
        <!--旋转按钮-->
        <div class="img-toolbar" @click.stop>
            <div class="img-inner">
                <i class="el-icon-zoom-in" title="放大" @click.stop="toolbar('zoomIn')"></i>
                <i class="el-icon-zoom-out" title="缩小" @click.stop="toolbar('zoomOut')"></i>
                <i class="el-icon-refresh-right" title="旋转" @click.stop="toolbar('rotate')"></i>
            </div>
        </div>
        <div class="thumbnail-swiper" @click.stop>
            <div class="thumbnail-list" :style="{'left': thumbnailLeft}" v-if="imgUrl && imgUrl.length > 0">
                <div v-for="(item, index) in imgUrl" :key="index" :class="{'thumbnail-picture-div': true, 'active': activeIndex == index}" @click="activeIndex = index">
                    <img :src="showTitle ? item.picture : item" class="thumbnail-picture">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    props: {
        imgPath: {
            // type: Array,
            required: true,
        },
        showTitle: Boolean,

    },
    data() {
        return {
            activeIndex: -1,
            thumbnailLeft: "50%",
            deg: 0,
            scale:1,
            //拖拽
            dragDisX: "",
            dragDisY: "",
            dragMoveX: "",
            dragMoveY: "",
            left:"",
            top:"",
            screenTop:"",
            screenLeft:"",
            // style:null,
            imgUrl: [],
        }
    },
    methods: {
        async showPicture(index) {
            this.activeIndex = index;
            this.imgUrl = []
            for(let i = 0; i < this.imgPath.length; i++){
                if(this.showTitle){
                    await this.$codePost('/service/get_driver_file/', {
                        pre_path: this.prePath.pic,
                        path: this.imgPath[i].picture
                    }).then(res=>{
                        this.imgUrl.push(res.data)
                    })
                }else{
                    await this.$codePost('/service/get_driver_file/', {
                        pre_path: this.prePath.pic,
                        path: this.imgPath[i]
                    }).then(res=>{
                        this.imgUrl.push(res.data)
                    })
                }
            }
        },
        //切换图片显示
        changePicIndex(gap) {
            let newIndex = this.activeIndex + gap;
            if (newIndex < 0) {
                //在第一张图片还要找上一张图片时
                newIndex = this.imgPath.length - 1;
            } else if (newIndex > this.imgPath.length - 1) {
                //在最后一张图片还要找下一张图片时
                newIndex = 0;
            }
            this.activeIndex = newIndex;
        },
        //旋转图片
        toolbar(type) {
            if (type == 'rotate') {
                this.deg += 90;
            } else if (type == 'zoomIn') {//放大
                this.scale += 0.1
            } else if (type == 'zoomOut') {//缩小
                if(this.scale > 0.2){
                    this.scale -= 0.1
                }
            }
        },

        getImgNaturalDimensions(oImg, callback) {
            var nWidth, nHeight;
            if (!oImg.naturalWidth) {
                nWidth = oImg.naturalWidth;
                nHeight = oImg.naturalHeight;
                callback(oImg, { w: nWidth, h: nHeight });
            } else {
                var nImg = new Image();
                nImg.onload = function() {
                    var nWidth = nImg.width,
                        nHeight = nImg.height;
                    callback(oImg, { w: nWidth, h: nHeight });
                }
                nImg.src = oImg.src;
            }
        },
        drop(event) {
            this.isDrag = false
        },
        dragover(event) {
            // event.preventDefault()
            this.dragMoveX = event.pageX - this.dragDisX;//移动的x距离
            this.dragMoveY = event.pageY - this.dragDisY;//移动的y距离
            this.top = this.screenTop + this.dragMoveY;
            this.left = this.screenLeft + this.dragMoveX;
        },
     
        dragstart(event) {
            // 图片距离屏幕初始距离
            this.screenTop = $('#previewImg').offset().top - 80 ;
            this.screenLeft = $('#previewImg').offset().left - 50;
            this.dragDisX = event.pageX;
            this.dragDisY = event.pageY;
        },
    },
    computed: {
        ImgMaxWidth() {
            return document.body.clientHeight - 170
        },
        prePath(){
            return this.$store.getters.getPrePath
        },
    },
    watch: {
        activeIndex(newValue, oldValue) {
            this.deg = 0
            this.scale = 1
            if (newValue == -1) {
                this.thumbnailLeft = "50%";
            } else {
                let leftWdith = newValue * 32;
                this.thumbnailLeft = "calc(50% - " + leftWdith + "px)";
            }
            if (oldValue == -1) {
                this.$nextTick(() => {
                    this.$refs.pitureViewComponentRef.focus();
                })
            }
        },
    }
}
</script>
<style scoped>
.picture-view-component {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100000000000000;
    cursor: auto;
}

.last-pic-button,
.next-pic-button {
    position: absolute;
    top: calc(50% - 130px);
    width: 50px;
    height: 200px;
    background: transparent;
    font-size: 3rem;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: rgba(0, 0, 0, .5);
}

.last-pic-button {
    left: 0;
    border-radius: 0 10px 10px 0;
}

.next-pic-button {
    right: 0;
    border-radius: 10px 0 0 10px;
}

.last-pic-button:hover,
.next-pic-button:hover,
.img-toolbar:hover {
    background-color: rgba(0, 0, 0, 1);
}

.close-preview {
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50%;
    cursor: pointer;
    height: 160px;
    width: 160px;
    overflow: hidden;
    position: absolute;
    right: -80px;
    top: -80px;
    color: white;
    font-size: 2rem;
}

.close-preview>.el-icon-close {
    position: absolute;
    top: 95px;
    left: 30px;
}

.close-preview:hover {
    background-color: rgba(0, 0, 0, 1);
}

.picture-title {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    /*width: 100%;*/
    text-align: center;
    color: white;
    font-size: 1rem;
    height: 40px;
    line-height: 40px;
}

.thumbnail-swiper {
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    height: 50px;
}

.picture-preview {
    position: relative;
    top: 80px;
    left: 50px;
    right: 50px;
    width: calc(100% - 100px);
    height: calc(100% - 170px);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.picture-preview-img {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    /*transition: all .3s linear;*/
}

.thumbnail-list {
    position: absolute;
    display: flex;
    transition: all .3s linear;
}

.thumbnail-picture-div {
    padding: 1px;
    width: 32px;
    height: 52px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    cursor: pointer;
    opacity: 0.5;
    box-sizing: border-box;
}

.thumbnail-picture-div:hover {
    opacity: 0.75;
}

.thumbnail-picture-div.active {
    opacity: 1;
}

.thumbnail-picture {
    height: 50px;
    margin: 0 auto;
}

.img-toolbar {
    position: absolute;
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    width: 162px;
    height: 44px;
    padding: 0 23px;
    background-color: rgba(0, 0, 0, 0.5);
    border-color: #fff;
    border-radius: 22px;
    cursor: pointer;
}

.img-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    text-align: justify;
    align-items: center;
    justify-content: space-around;
}

.img-inner i {
    color: #fff;
    font-style: normal;
    font-weight: 400;
    font-size: 23px;
    line-height: 44px;
}
</style>
