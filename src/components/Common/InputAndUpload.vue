<template>
    <div class="input-and-Upload">
        <!--选择模式-->
        <div class="radio-select">
            <div>
                <el-radio-group v-model="inputModel">
                    <el-radio 
                        v-for="(item,index) in selectData.radioOption" 
                        :key="index" 
                        :label="item.value"
                    >
                        {{ item.label }}
                    </el-radio>
                </el-radio-group>
            </div>

            <div v-if="selectData.rightTip != undefined" class="right-tip">
                {{ selectData.rightTip }}
            </div>
        </div>
        <div>
            <!--文件上传-->
            <div v-if="oldInputModel == 'file'">
                <el-upload
                    class="upload-div" 
                    ref="uploadFileRef"
                    drag
                    multiple
                    action="#"
                    :auto-upload="false"
                    :file-list="fileList"
                    :show-file-list="false"
                    :accept="selectData.selectDict[oldInputModel].fileAccept"
                    :on-change="changeFile"
                    :on-remove="removeFile">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        <em>点击</em>或拖拽上传
                        <div>支持拓展名:{{ selectData.selectDict[oldInputModel].fileAccept }}</div>
                    </div>
                </el-upload>
                <file-show-div
                    file-name-key="name"
                    no-data-label="您还没有上传文件"  
                    :old-data="oldFileData" 
                    :new-data="fileData" 
                    @removeOld="removeOldFile" 
                    @removeNew="removeFile"
                />
            </div>
            <!--历史包体-->
            <div v-else-if="oldInputModel == 'history'">
                <div class="history-div">
                    <el-popover
                        v-if="!this.$checkIsNull(this.project)"
                        width="400"
                        placement="top"
                        trigger="click"
                        v-model="historyPackageFlag"
                    >
                        <el-table 
                            ref="historyTableRef" 
                            :data="historyPackageData" 
                            @selection-change="changeHistoryPackage">
                            <el-table-column type="selection" align="center"></el-table-column>
                            <el-table-column 
                                property="projectCode" 
                                label="项目代号" 
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.project }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  
                                property="uploadDate" 
                                label="上传日期" 
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.application_date }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  
                                property="testVersion" 
                                label="包体版本" 
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.test_version }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            small
                            align="right"
                            layout="total, prev, pager, next"
                            :page-size="historyList.rows"
                            :current-page="historyList.page"
                            :total="historyTotal"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                        />
                        <div class="btn-group">
                            <el-button 
                                type="primary" 
                                size="mini" 
                                @click="confirmHistory"
                            >
                                确定
                            </el-button>
                            <el-button size="mini" @click="historyPackageFlag = false">取消</el-button>
                        </div>
                        <el-button
                            class="el-button-margin" 
                            icon="el-icon-plus" 
                            slot="reference" 
                            @click="showHistory"
                        >
                            添加历史包体
                        </el-button>
                    </el-popover>
                    <el-button 
                        v-else
                        class="el-button-margin" 
                        icon="el-icon-plus"  
                        @click="showHistory"
                    >
                        添加历史包体
                    </el-button>
                </div>
                <file-show-div
                    file-name-key="test_inclusions_file"
                    no-data-label="您还没有选择历史包体"  
                    :old-data="oldHistoryData" 
                    :new-data="historyArr" 
                    @removeOld="removeOldHistory" 
                    @removeNew="removeHistory"
                />
            </div>
            <!-- 下载链接 -->
            <div v-else>
                <self-rich-editor
                    style="color:black;" 
                    :value.sync="textareaValue" 
                    :placeholder="selectData.selectDict[oldInputModel].placeholder"
                />
            </div>
        </div>
    </div>
</template>
<script>
import FileShowDiv from "@/components/Common/FileShowDiv"
import SelfRichEditor from "@/components/Common/SelfRichEditor.vue"
import {getTestInclusions} from '@/api/common'
export default {
    components: {
        FileShowDiv,
        SelfRichEditor
    },
    props: {
        selectData: {
            required: true,
        },
        project: {
            type: String
        }
    },
    data() {
        return {
            //用于记录改变前的模式，因为改变模式后，如果原模式下有输入，会进行二次确认，为了方便回退模式，要记录原先的值
            oldInputModel: "textarea",
            //选择模式项中绑定的值
            inputModel: "textarea",
            //是否可监控radio值，设置该值的目的是，想要等编辑时的详情数据获取完毕后，再开始监听
            canWatchRadio: false,
            //历史包体模式
            historyPackageFlag: false,
            //获取历史包体数据传参
            historyList: {
                page: 1,
                rows: 10,
                project: "",
            },
            //历史包体数据总数
            historyTotal: 0,
            //历史包体表格数据
            historyPackageData: [],
            //旧的历史文件数据（编辑、复测时存在）
            oldHistoryData: [],
            //临时存储选中的历史包体
            tempHistory: [],
            //选中的历史文件数组
            historyArr: [],
            //输入模式,textarea输入值
            textareaValue: "",//
            //文件模式
            //旧的文件数据（编辑、复测时存在）
            oldFileData: [],
            //el-upload绑定的文件数组
            fileList: [],
            //实际的文件数组
            fileData: [],
            
        }
    },
    computed: {
    },

    created() {
        this.dealOldData();
    },
    mounted() {

    },
    methods: {
        //处理可能存在的旧数据（针对编辑、复测）
        dealOldData() {
            this.textareaValue = this.selectData.selectDict.textarea.value;
            if (!this.$checkStrIsNull(this.selectData.selectDict.file.value)) {
                //存在旧文件
                this.oldFileData = this.selectData.selectDict.file.value.split(",");
            }
            if (this.selectData.selectDict.history != undefined) {
                //存在历史包体模式
                if (!this.$checkStrIsNull(this.selectData.selectDict.history.value)) {
                    //存在旧的历史包体数据
                    this.oldHistoryData = this.selectData.selectDict.history.value.split(",");
                }
            }

            //获取原来的数据中，选的是哪种方式
            let oldInputModel = "";
            for (let i = 0; i < this.selectData.radioOption.length; i++) {
                let key = this.selectData.radioOption[i].value;
                if (this.selectData.selectDict[key].value.length != 0) {
                    oldInputModel = key;
                    break;
                }
            }
            if (oldInputModel == "") {
                //不存在旧的已有数据
                this.inputModel = this.selectData.radioOption[0].value;
            } else {
                this.inputModel = oldInputModel;
            }
            this.oldInputModel = this.inputModel;
            //可以开始监听模式变化
            this.$nextTick(() => {
                this.canWatchRadio = true;
            })
        },

        //移除旧文件
        removeOldFile(index) {
            this.oldFileData.splice(index, 1);
        },

        removeOldHistory(index) {
            this.oldHistoryData.splice(index, 1);
        },

        //页数改变时
        handleCurrentChange(val) {
            this.historyList.page = val;
            this.getHistoryData();
        },

        //每页显示多少条数据
        handleSizeChange(val) {
            this.historyList.rows = val;
            this.getHistoryData();
        },

        //显示历史包体模态框
        showHistory() {
            if (!this.$checkIsNull(this.project)) {
                if (this.project != this.historyList.project) {
                    this.tempHistory = [];
                    this.historyArr = [];
                    this.historyList.project = this.project;
                    this.getHistoryData();
                } else {
                    this.tempHistory = [];
                    this.$refs.historyTableRef.clearSelection();
                }
            } else {
                this.$message.error("请先选择项目名称！")
                this.historyPackageData = [];
                this.tempHistory = [];
                this.historyArr = [];
            }
        },

        //获取历史包体数据
        async getHistoryData() {
            let res = await getTestInclusions(this.historyList,{})
                if (res.code == 200) {
                    this.historyPackageData = res.data.data;
                    this.historyTotal = res.data.data_num;
                }
        },

        //上传
        changeFile(file, fileList) {
            let fileSize = file.size / 1024 / 1024 / 1024;
            if (fileSize > 1.2) {
                this.$message.error("文件大小不得超过1.2G！");
            } else {
                this.fileData.push(file);
            }
        },

        //移除
        removeFile(index) {
            this.fileData.splice(index, 1);
        },

        //历史包体选中
        changeHistoryPackage(value) {
            this.tempHistory = value;
        },
        
        //确定选择
        confirmHistory() {
            this.historyArr = this.historyArr.concat(JSON.parse(JSON.stringify(this.tempHistory)));
            this.historyPackageFlag = false;
        },

        //移除历史记录
        removeHistory(index) {
            this.historyArr.splice(index, 1);
        },

        //父组件获取结果
        getResult() {
            let list = {
                type: this.oldInputModel,
                textareaValue: this.textareaValue,
                fileData: this.fileData,
                historyArr: this.historyArr,
                oldFileData: this.oldFileData,
                oldHistoryData: this.oldHistoryData
            }
            return list;
        },
    },
    watch: {
        inputModel(newValue, oldValue) {
            //模式选择发生变化时，监控原来的模式下是否已经做了部分填写
            if (this.canWatchRadio && newValue != this.oldInputModel) {
                let needConfirm = false;
                if (oldValue == "textarea") {
                    if (this.textareaValue != "") {
                        needConfirm = true;
                    }
                } else if (oldValue == "file") {
                    if (this.oldFileData.length > 0 || this.fileData.length > 0) {
                        needConfirm = true;
                    }
                } else {
                    if (this.oldHistoryData.length > 0 || this.historyArr.length > 0) {
                        needConfirm = true;
                    }
                }
                //已经有信息的时候，需要二次确认，因为切换模式会清空原数据
                if (needConfirm) {
                    this.$selfConfirm("切换模式会清空现有的数据，确定切换吗?", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                        //确定
                        if (oldValue == "textarea") {
                            this.textareaValue = "";
                        } else if (oldValue == "file") {
                            this.oldFileData = [];
                            this.fileData = [];
                            this.$refs.uploadFileRef.clearFiles();
                        } else {
                            this.oldHistoryData = [];
                            this.historyArr = [];
                        }
                        this.oldInputModel = newValue;
                    }).catch(() => {
                        //取消
                        this.inputModel = oldValue;
                    });
                } else {
                    this.oldInputModel = this.inputModel;
                }
            }
        }
    },
}
</script>
<style lang="less" scoped>
.radio-select {
    margin-bottom: 1.5rem;
}
.right-tip{
    float:right;
    margin-top: 5px; 
    font-size: 14px; 
}
.el-button-margin{
    margin-top:60px
}
.btn-group{
    margin-top:1rem;
    text-align: right;
}
.history-div {
    display: inline-block;
    width: 46%;
    margin-right: 1%;
    height: 162px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    text-align: center;
    vertical-align: top;
    padding: 0.5rem;
}
</style>
<style lang="less">
.input-and-Upload {
    .upload-div {
        width: 49%;
        margin-right: 1%;
        display: inline-block;
        .el-upload {
            width: 100%;
            .el-upload-dragger {
                width: 100%;
            }
        }
    }
}
</style>