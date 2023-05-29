<template>
    <div class="package-upload-contianer">
        <div class="upload-item-content" >
            <div class="upload-item-title">上传测试包</div>
            <div class="item-divider"></div>
            <el-upload
                class="package-upload"   
                ref="uploadFileRef"
                drag
                action="#"
                :auto-upload="false"
                :file-list="fileList"
                :show-file-list="false"
                :accept="acceptList"
                :on-change="changeFile"
                :on-remove="removeFile"
            >
                <div class="el-upload__text">
                    <span>
                        <em>点击上传</em> / 拖拽到此区域
                    </span>
                    <div style="margin-top: 10px;">支持拓展名:{{ acceptList }}</div>
                </div>
            </el-upload>
        </div>
        <div class="content-divider"></div>
        <div class="upload-item-content" >
            <div class="upload-item-title">APP信息</div>
            <div class="item-divider"></div>
            <el-table :data="tableData" height="180">
                <el-table-column prop="appName"     label="应用名称"></el-table-column>
                <el-table-column prop="appVersion"  label="版本号"></el-table-column>
                <el-table-column prop="packageName" label="包名"></el-table-column>
                <el-table-column prop="packageSize" label="包大小"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            @click="removePackage(scope.$index, scope.row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                fileList: [],
                fileData: [],
                tableData: []
            }
        },
        props:{
            acceptList: {
                type: String,
            }
        },
        created(){
        }, 
        mounted(){
            
        },
        computed:{
        },
        watch:{
        },
        methods:{
            //上传
            changeFile(file, fileList) {
                let fileSize = file.size / 1024 / 1024 / 1024;
                if (fileSize > 3) {
                    this.$message.error("文件大小不得超过3G！");
                } else {
                    this.fileData.push(file);
                    this.tableData.push({
                        appName: file.name,
                        appVersion: '',
                        packageName: '',
                        packageSize: Math.round(fileSize * 1024, 3) + 'MB'
                    })
                    this.$emit('changePlatformWithUpload', this.tableData);
                }
            },
            //移除
            removeFile(index) {
                this.fileData.splice(index, 1);
                this.tableData.splice(index, 1);
            },
            //父组件获取结果
            getResult() {
                return this.fileData;
            },
            // 删除上传包体
            removePackage(index, rowData) {
                this.tableData.splice(index, 1);
            }
        },
    }
</script>
    
<style scoped>
    .package-upload-contianer {
        width: 100%;
        border: 1px solid #E0E4EC;
        border-radius: 4px;
        padding: 20px;
        position: relative;
        white-space: nowrap;
    }
    .upload-item-content {
        display: inline-block;
        height: 100%;
        vertical-align: top;
    }
    .upload-item-content:first-child {
        width: 30%;
        margin-right: 21px;
    }
    .upload-item-content:last-child {
        margin-left: 20px;
        width: 67%;
    }
    .content-divider {
        height: 100%;
        position: absolute;
        border-left: 1px solid #E0E4EC;
        left: calc(30% + 30px);
        top: 0;
    }
    .item-divider {
        border: 1px solid rgba(97, 119, 255, 0.1);
        margin: 10px 0 20px 0;
    }
    .upload-item-title {
        padding: 3px 10px;
        border-left: 3px solid #156EEF;
        font-size: 14px;
        line-height: 20px;
        color: #999999;
    }
    .package-upload {
        height: 100%;
        width: 100%;
    }
    .package-info-table {
        width: 100%;
    }
</style>

<style>
    .package-upload .el-upload, .package-upload .el-upload-dragger {
        width: 100%;
    }
    .package-upload .el-upload-dragger .el-upload__text {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style> 