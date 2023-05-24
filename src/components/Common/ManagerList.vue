<template>

    <div class="manager-list">
        <div class="manager-title">用户管理页面</div>
        <div class="container">
            
        </div>
    </div>
    
</template>
<script>

export default {
    components: {

    },
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    created() {

    },
    methods: {

    }
}
</script>
<style scoped>
    .manager-list {
        width: 100%;
        flex: 1;
        margin: 20px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .manager-title{
        position: absolute;
        flex: 1;
        top: 0;
        z-index: 1;
        padding: 0 20px;
        font-size: 16px;
        color: #333333;
        font-weight: 700;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
        height: 47px;
        width: calc(100% - 40px);
        line-height: 47px;
        z-index: 1;
        background: #fff;
        border-radius: 4px 4px 0 0;
    }
</style>