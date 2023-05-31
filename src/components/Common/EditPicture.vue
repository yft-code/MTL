<template>
    <div class="edit-picture">
        <self-dialog 
            ref="editPictureRef" 
            :dialog-data="{
                title: '编辑图片',
                width: '25rem', 
                top: '3rem', 
                confirmName: '确定', 
                closeName: '取消' 
                }"
            @confirm="confirmMethod">
            <div v-if="oldPictures.length > 0" class="picShow">
                <div 
                    v-for="(item,index) in oldPictures" 
                    :key="index" 
                    class="pic-show-item"
                >
                    <self-picture-show :img-path="[item.pic_url]" img-type="thumbnail" />
                    <i class="el-icon-circle-close" @click="removeOldPic(index,item.id)"></i>
                </div>
            </div>
            <div v-if="previewPics.length > 0" class="picShow">
                <div 
                    v-for="(item,index) in previewPics" 
                    :key="index" 
                    class="pic-show-item"
                >  
                    <self-picture-show :img-path="[item]" img-type="thumbnail" />
                    <i class="el-icon-circle-close" @click="removePic(index)"></i>
                </div>
            </div>
            <div style="width:100%;">
                <upload-file 
                    ref="uploadFileRef"
                    accept-file-type=".jpg,.jpeg,.gif,.png,.bmp,.JPG,.JPEG,.GIF,.PNG,.BMP" 
                    :is-multiple="true"
                    :is-paste-pic="true"
                    :onChangeFunc="changeFile"
                />
            </div>
        </self-dialog>
    </div>
</template>
<script>
import uploadFile from 'uploadfile'
import SelfDialog from '@/components/Common/SelfDialog.vue'
import {updateExpertTestPicturePc,updateExpertTestPicture,updatePicture} from '@/api/common'
export default {
    components: {
        uploadFile,
        SelfDialog,
    },
    props: {
        confirmType: {
            required: true,
            type: String,
        }
    },
    data() {
        return {
            list: {},
            oldPictures: [],
            oldDeleteList: [],
            //给upload组件用，拿不到数据
            fileList: [],
            //新上传的预览图片地址
            previewPics: [],
            //上传的图片文件
            fileListData: [],
        }
    },
    computed: {
    },
    watch: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        editPicture(list, picData, oldFileData) {
            this.list = list;
            if (picData != undefined) {
                this.oldPictures = JSON.parse(JSON.stringify(picData));
            } else {
                this.oldPictures = [];
            };
            this.oldDeleteList = [];
            //如果当前有暂时记录的还没传给后台的图片数据，获取到文件和它的预览地址数据
            if (oldFileData != undefined) {
                this.fileListData = oldFileData.map((v) => {
                    return v;
                });
                this.previewPics = oldFileData.map((v) => {
                    return URL.createObjectURL(v);
                })
            } else {
                this.fileListData = [];
                this.previewPics = [];
            }
            this.$refs.editPictureRef.openDialog();
        },

        //上传事件
        changeFile(file, fileList) {
            this.$set(this.fileListData, this.fileListData.length, file.raw);
            let picUrl = URL.createObjectURL(file.raw);
            this.$set(this.previewPics, this.previewPics.length, picUrl);
        },

        //移除上传的图片
        removePic(index) {
            this.previewPics.splice(index, 1);
            this.fileListData.splice(index, 1);
        },

        //移除已有的图片地址
        removeOldPic(index, id) {
            this.oldPictures.splice(index, 1);
            this.oldDeleteList.push(id);
        },

        //上传后台
        async  confirmMethod() {
            if (this.confirmType == "directAxios") {
                //直接传给后台
                //用于测试内容表格中上传图片
                this.$store.commit("setPageIsLoading", true);
                let formData = new FormData();
                for (let k in this.list) {
                    formData.append(k, this.list[k]);
                }
                formData.append("delete_list", JSON.stringify(this.oldDeleteList));
                for (let i = 0; i < this.fileListData.length; i++) {
                    formData.append("picture_list", this.fileListData[i]);
                }
                if(this.list.test_type == '11'){
                    let res=await updateExpertTestPicturePc({},{ operation: "编辑图片", success: true, failed: true })
                        if (res.code == 200) {
                            this.$emit("afterEdit");
                            this.$refs.editPictureRef.closeDialog();
                        }
                        this.$store.commit("setPageIsLoading", false);
                }else if(this.list.test_type == '10'){
                    let res=await updateExpertTestPicture({},{ operation: "编辑图片", success: true, failed: true })
                        if (res.code == 200) {
                            this.$emit("afterEdit");
                            this.$refs.editPictureRef.closeDialog();
                        }
                        this.$store.commit("setPageIsLoading", false);
                }else if(this.list.test_type == '30'){
                    formData.append("application_id", this.$route.query.id);
                    let res=await updatePicture({},{ operation: "编辑图片", success: true, failed: true })
                        if (res.code == 200) {
                            this.$emit("afterEdit");
                            this.$refs.editPictureRef.closeDialog();
                        }
                        this.$store.commit("setPageIsLoading", false);
                }
            } else {
                //把数据传给父组件让父组件自己处理
                //用于新增、编辑测试内容时分次上传多个问题的图片
                let list = {
                    questionId: this.list.questionId,
                    oldPictures: this.oldPictures,
                    oldDeleteList: this.oldDeleteList,
                    fileListData: this.fileListData,
                }
                this.$emit("afterEdit", list);
                this.$refs.editPictureRef.closeDialog();
            }
        }
    }
}
</script>
<style lang="less" scoped>
.edit-picture {
    padding: 0;
    .picShow {
        .pic-show-item {
            display: inline-block;
            position: relative;
            width: 360px;
            margin-bottom: 0.2rem;
            vertical-align: top; 
            .el-icon-circle-close {
                position: absolute;
                right: 0.2rem;
                top: 0.2rem;
                color: #f56c6c;
                cursor: pointer;
                font-weight: bold;
                font-size: 1rem;
            }
        }
    }
}
</style>
<style scoped>
.edit-picture>>>#previewContainer,
.edit-picture>>>.el-upload-list {
    display: none;
}
</style>