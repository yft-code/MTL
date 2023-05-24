<template>
    <div class="swiper-test">
        <picture-view ref="pictureViewRef" :img-path="imagePath" :show-title="showTitle" />
        <div v-show="sliderArr.length > 0" class="swiper-father">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div 
                        class="swiper-slide center-and-middle" 
                        v-for="(item,index) in pathArr" 
                        :key="index">
                        <img :src="item" :alt="showTitle ? '截图来自设备：' + imagePath[index].device_name : ' '" @click="showPreview(index)">
                        <span v-if="showTitle && !isPc" class="picture-from">截图来自设备：{{ imagePath[index].device_name }}</span>
                        <!-- <span v-if="showTitle && isPc" class="picture-from">截图来自：{{ imagePath[index].inflect_model }}</span> -->
                    </div>
                </div>
            </div>
            <div class="left-arrow" @click="changeActiveImage(sliderValue-2)">
                <img src="@/assets/img/prevImg1.png">
            </div>
            <div class="right-arrow" @click="changeActiveImage(sliderValue)">
                <img src="@/assets/img/nextImg1.png">
            </div>
            <div v-if="sliderArr.length > 1" style="margin-top:10px;" >
                <div class="center-and-middle">
                    <div class="background-div" @click="changeActiveImage(0)">
                        <img src="@/assets/img/firstImg.png">
                    </div>
                    <div class="background-div" @click="changeActiveImage(sliderValue - 2)">
                        <img src="@/assets/img/prevImg2.png">
                    </div>
                    <div class="slide-container-div">
                        <el-slider v-model="sliderValue" @change="changeSlider" :min="1" :max="sliderArr.length"></el-slider>
                        <div style="text-align:center;font-size:12px;">共 {{ sliderArr.length }} 张图片</div>
                    </div>
                    <div class="background-div" @click="changeActiveImage(sliderValue)">
                        <img src="@/assets/img/nextImg2.png">
                    </div>
                    <div class="background-div" @click="changeActiveImage(sliderArr.length-1)">
                        <img src="@/assets/img/lastImg.png">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="sliderArr.length == 0" class="swiper-father center-and-middle">
            暂无截图
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Swiper from 'swiper/dist/js/swiper.esm.bundle'
import 'swiper/dist/css/swiper.min.css'

export default {
    components: {
    },
    props: {
        imagePath: Array,
        showTitle: Boolean,
        isPc: Boolean,
    },
    created() {
        this.getPathArr()
    },
    data() {
        return {
            sliderValue: 1,
            mySwiper: "",
            pathArr: [],
        }
    },
    computed: {
        sliderArr() {
            if (this.imagePath != null) {
                let arr = this.imagePath.map((value, index) => {
                    if(this.showTitle){
                        return value.picture;
                    }else {
                        return value;
                    }
                })
                return arr;
            } else {
                return [];
            }
        },
        prePath(){
            return this.$store.getters.getPrePath
        },
    },
    watch: {
        sliderArr(newValue, oldValue) {
            if (newValue.length > 0) {
                // 初始化，滚回第一张图片
                this.sliderValue = 1;
                this.mySwiper.slideTo(0, 0, false);
            }
            this.getPathArr()
        }
    },
    mounted() {
        let container = '.swiper-container';
        let _this = this;
        //用jquery方法绑定Swiper
        this.mySwiper = new Swiper(container, {
            observer: true,
            lazyLoading: true,
            observeParents: true,
            slidesPerView: 3,
            centeredSlides: true,
            on: {
                transitionEnd: function() {
                    //activeIndex是swaiper中，当前选中的图片下标，从0-length-1
                    //sliderValue是el-slider中，当前选中的值，从1-length
                    _this.sliderValue = this.activeIndex + 1;
                },
            },
        })
        
        // this.getPathArr()

    },
    methods: {
        //切换图片显示
        changeActiveImage(index) {
            if (index >= 0 && index <= this.sliderArr.length - 1) {
                this.sliderValue = index + 1;
                this.mySwiper.slideTo(index, 1000, false);
            }
        },

        //el-slider改变sliderValue值后
        changeSlider(sliderValue) {
            this.mySwiper.slideTo(sliderValue - 1, 1000, false);
        },

        showPreview(index){
            this.$refs.pictureViewRef.showPicture(index);
        },

        async getPathArr(){
            this.pathArr = [];
            for(let i = 0; i < this.imagePath.length; i++){
                await this.$codePost('/service/get_driver_file/', {
                    pre_path: this.prePath.pic,
                    path: this.imagePath[i].picture,
                }).then(res=>{
                    this.pathArr.push(res.data)
                })
            }
            console.log(this.pathArr)
        }
    },



}
</script>
<style scoped>
.swiper-test {
    height: 98%;
}

.swiper-father {
    margin-top: 5px;
    width: 100%;
    height: 100%;
    position: relative;
}

.swiper-father>>>.img-layer {
    z-index: 1100;
}

.swiper-container {
    width: 90%;
    height: 100%;
}

.swiper-slide {
    width: 100%;
    font-size: 18px;
    background: #ffffff;
    cursor: pointer;
}

.swiper-slide-active {
    background: #EBEEF5 !important;
}

.swiper-slide img {
    max-width: 260px;
    height: 150px
}

.left-arrow,
.right-arrow {
    position: absolute;
    z-index: 10;
    top: 47%;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #6e757e;
}

.left-arrow {
    left: 10px;
    right: auto;
}

.right-arrow {
    left: auto;
    right: 10px;
}

.background-div {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 5px;
    cursor: pointer;
    background-color: #6e757e;
}

.slide-container-div {
    width: 200px;
    height: 20px;
    cursor: pointer;
    margin: 0 10px 0 10px;
}

.picture-from {
    position: absolute;
    font-size: 14px;
    bottom: 1rem;
    z-index: 1;
    width: 100%;
    text-align: center;
}

.slide-container-div>>>.el-slider__runway {
    margin: 8px 0;
}

.slide-container-div>>>.el-slider__bar {
    background-color: #97AFC2;
}

.slide-container-div>>>.el-slider__button {
    border-color: #a0b4c8;
}


</style>
<style>

</style>