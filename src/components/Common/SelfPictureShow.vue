<template>
    <div class="picture-show">
        <picture-view 
            ref="pictureViewRef" 
            :img-path="imgPath" 
            :show-title="showTitle"
        />
        <div v-if="imgType == 'thumbnail' && urlArr && urlArr.length > 0">
            <img
                class="viewer-img"
                v-for="(path, index) in urlArr"
                :key="path"
                :src="path"
                @click="showPicture(index)"
            />
        </div>
        <img v-else
            class="image-icon" 
            :src="require('@/assets/img/tupian.png')"
            @click="showPicture()" 
        />
    </div>
</template>

<script>
import {getDriverFile} from '@/api/common'
export default {
    data() {
        return {
            urlArr: [],
        }
    },
    props: {
        imgPath: {
            // type: Array,
            required: true,
        },
        imgType: String,
        showTitle: Boolean,
    },
    computed:{
        imgArr(){
            if(this.showTitle){
                return this.imgPath.map((v)=>{ return v.picture });
            }else{
                return this.imgPath;
            }
        },
        prePath(){
            return this.$store.getters.getPrePath
        },
        
    },
    created() {
        this.getUrlArr()
    },
    methods: {
        // 获取批量的图片路径
        async getUrlArr(){
            this.urlArr = []
            for(let i = 0; i < this.imgPath.length; i++){
                let url = this.showTitle ? this.imgPath[i].picture : this.imgPath[i]
                if(url.indexOf('blob') != -1){
                    this.urlArr.push(url)
                }else{
                 let res = await getDriverFile({
                        pre_path: this.prePath.pic,
                        path: url
                    },{})
                    if(res.code == 200){
                        this.urlArr.push(res.data)
                        }else{
                        this.urlArr.push(url)
                    }
                }
            }
        },
        
        //手动触发图片点击函数
        showPicture(index) {
            if (index == undefined) {
                index = 0;
            }
            this.$refs.pictureViewRef.showPicture(index);
        }
    },
}
</script>
<style scoped>
.picture-show {
    display: inline-block;
}

.thumbnail-image {
    max-width: 100%;
    cursor: pointer;
}

.viewer-img {
    width: 100%;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    vertical-align: top;
    cursor: pointer;
}
</style>
