<template>
    <div>
        <span v-if="$checkStrIsNull(text) && $checkStrIsNull(file) && $checkStrIsNull(historyFile)">
            无数据
        </span>
        <div v-html="text"></div>
        <div v-if="fileUrl && fileUrl.length > 0">
            <div v-for="(item,index) in fileUrl" :key="index">
                <a class="blue-span" :href="item" target="_blank">{{ file.split(',')[index] }}</a>
            </div>
        </div>
    </div>
</template>
<script>
import {getDriverFile} from '@/api/common'
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
                  let res = await getDriverFile({
                        pre_path: this.fileSuffix,
                        path: this.file.split(',')[i]
                    },{})
                    this.fileUrl.push(res.data) 
                }
            }
        },
    },
}
</script>
