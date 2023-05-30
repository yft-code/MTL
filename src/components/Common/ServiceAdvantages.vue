<template>
    <div class="advantages-div">
            <div class="advantages-title">服务优势</div>
            <div class="advantages-item">
                <div
                    v-for="listItem in advantagesData"
                    :key="listItem.title"
                    class="advantages-item-container"
                >
                    <div class="advantages-item-content">
                        <div class="advantages-item-title">
                            <span>{{listItem.title}}</span>
                            <div class="title-underline"></div>
                        </div>
                        <div class="advantages-item-des">{{listItem.des}}</div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                advantagesData: [
                    {
                        title: '海量终端1',
                        des: '使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。',
                    },
                    {
                        title: '海量终端2',
                        des: '使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。',
                    },
                    {
                        title: '海量终端3',
                        des: '使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。',
                    },
                    {
                        title: '海量终端4',
                        des: '使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。使用过程极为便捷，即插即用，无需任何修改。',
                    },
                ],
            }
        },
        props:{
            
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
        },
    }
</script>
    
<style lang='less' scoped>
    .advantages-div {
        width: 100%;
        position: relative;
        margin-top: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .advantages-title {
        font-size: 32px;
        font-weight: 700;
        color: #333333;
    }
    .advantages-item {
        margin-top: 30px;
        width: 100%;
        border-top: 1px solid rgba(97, 119, 255, 0.1);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .advantages-item-container {
        border-bottom: 1px solid rgba(97, 119, 255, 0.1);
        width: calc(50% - 2px);
        height: 225px;
        display: flex;
        align-items: center;
    }
    .advantages-item-container:nth-child(odd) {
        border-right: 1px solid rgba(97, 119, 255, 0.1);
        justify-content: flex-end;
    }
    .advantages-item-container:nth-child(even) {
        border-right: 1px solid rgba(97, 119, 255, 0.1);
        justify-content: flex-start;
    }
    .advantages-item-content {
        width: 560px;
        height: 130px;
        background: url('~@/assets/img/advantages.png') no-repeat;
        background-position-x: 100%;
        background-position-y: 20px;
    }
    .advantages-item-container:nth-child(odd) .advantages-item-content {
        margin-right: 30px;
    }
    .advantages-item-container:nth-child(even) .advantages-item-content {
        margin-left: 64px;
    }
    .advantages-item-title {
        font-size: 16px;
        font-weight: 700;
        color: #666666;
        position: relative;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    .title-underline {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 28px;
        height: 1px;
        border-bottom: 3px solid rgba(21, 110, 239, 1);
    }
    .advantages-item-des {
        width: 536px;
        color: #999999;
        font-size: 14px;
    }
</style>

<style>
</style>