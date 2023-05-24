<template>
    <el-drawer
        size="55%"
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">
            <slot v-if="drawer"></slot>
        </el-drawer>
</template>


<script> 
export default {
    components: {
        
    },
    data() {
        return {
            direction: 'rtl',
            // direction: 'ltr',
            drawer: false
        }
    },
    props: {
        title: {},
    },
    mounted(){

    },
    computed: {
        
    },
    created() {
    },
    methods: {
        openDrawer(){
            this.drawer = true
        },
        handleClose(done){
            // this.$confirm('确认关闭？').then(_ => {
            //     done();
            // }).catch(_ => {});
            this.$emit("close");
            done()
        }
    },

}
</script>

<style scoped>

</style>
