<template>
    <div>
        <span v-if="$checkStrIsNull(text) && $checkStrIsNull(file) && $checkStrIsNull(historyFile)">
            无数据
        </span>
        <div v-html="text"></div>
        <div v-if="fileUrl && fileUrl.length > 0">
            <div v-for="(item,index) in fileUrl" :key="index">
                <!-- <a class="blue-span" :href="getPath(item, fileSuffix)" target="_blank">{{ file.split(',')[index] }}</a> -->
                <a class="blue-span" :href="item" target="_blank">{{ file.split(',')[index] }}</a>
            </div>
        </div>
        <!-- <div v-if="!$checkStrIsNull(historyFile)">
            <div v-for="(item,index) in historyFile.split(',')" :key="index">
                <a class="blue-span" :href="getPath(item, fileSuffix)" target="_blank">{{ item }}</a>
            </div>
        </div> -->
    </div>
</template>
<script>
export default {
    components: {
    },
    props: {
        text: {},
        file: {},
        historyFile: {},
        fileSuffix: {},
    },
    data() {
        return {
            fileUrl: [],
        }
    },
    computed: {
    },
    created() {
        this.getFileUrl()
    },
    mounted() {

    },
    methods: {
        //获取文件的url
        async getFileUrl() {
            if(!this.$checkStrIsNull(this.file)){
                this.fileUrl = []
                for(let i = 0; i < this.file.split(',').length; i++){
                    await this.$codePost('/service/get_driver_file/', {
                        pre_path: this.fileSuffix,
                        path: this.file.split(',')[i]
                    }).then(res=>{
                        this.fileUrl.push(res.data)
                    })
                }
            }
        },
    },
}
</script>
