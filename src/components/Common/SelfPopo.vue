<template>
    <img class="popo-img" src="@/assets/img/popo.png" @click="$popo.singalPopo(email)">
</template>

<script>
import popo from '@/utils/popo.js'
export default {
    data() {
        return {
        }
    },
    props: {
        email: String
    },
    computed: {

    },
    mounted() {

    },
    components: {
    },
    methods: {
    },

    watch: {

    }
}
</script>
<style scoped>
.popo-img {
    width: 15px;
    height: 14px;
    vertical-align: middle;
    margin-left: 3px;
    cursor: pointer;
}
</style>