<template>
    <div class="log-file-upload-div">
        <div v-if="file != ''" class="blue-span has-upload-file">
            <span class="file-name">{{ file.name }}</span>
            <i class="el-icon-circle-close" @click="file = ''"></i>
        </div>
        <div v-else-if="oldFileData" class="blue-span has-upload-file">
            <span class="file-name">{{ oldFileData }}</span>
            <i class="el-icon-circle-close" @click="oldFileData = ''"></i>
        </div>
        <el-upload 
            action="#" 
            :file-list="fileList" 
            :on-change="changeFile" 
            :auto-upload="false" 
            :multiple="false" 
            :show-file-list="false"
        >
            <span class="blue-span">上传</span>
        </el-upload>
    </div>
</template>
<script>
export default {
    components: {
    },
    props: {
        oldFile: {},
    },
    data() {
        return {
            fileList: [],
            oldFileData: "",
            file: "",
        }
    },
    computed: {
    },
    created() {
        if (this.oldFile) {
            this.oldFileData = this.oldFile;
        }

    },
    mounted() {

    },
    methods: {
        changeFile(file, fileList) {
            this.file = file;
            this.oldFileData = "";
        },
        getFileData() {
            let list = {
                oldFile: this.oldFileData,
                file: this.file.raw,
            }
            return list;
        }
    },
    watch: {
        oldFile(newValue, oldValue) {
            this.oldFileData = newValue;
        },

    }
}
</script>
<style lang="less" scoped>
.log-file-upload-div {
    width: 100%;
    display: inline-block;
    .has-upload-file {
        .file-name {
            margin-right: 0.5rem;
        }
        .el-icon-circle-close {
            cursor: pointer;
            font-weight: bold;
        }
    }
}
</style>
