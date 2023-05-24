<template>
    <!-- <div class="expert-services">
        <sidebar />
        <router-view></router-view>
        <compatibility-application v-if="curService === 'compatibility'" />
        <performance-application v-if="curService === 'performance'" />
        <privacy-application v-if="curService === 'privacy'" />
        <weaknet-application v-if="curService === 'weaknet'" />
        <protocol-application v-if="curService === 'protocol'" />
        <preliminary-application v-if="curService === 'preliminary'" />
        <service-orders-list v-if="curService === 'serviceOrdersList'" :serviceData="serviceData" />
    </div> -->
    <div class="expert-services">
        <sidebar />
        <router-view :serviceData="serviceData"></router-view>
        <!-- <compatibility-application v-if="curService === 'compatibility'" />
        <performance-application v-if="curService === 'performance'" />
        <privacy-application v-if="curService === 'privacy'" />
        <weaknet-application v-if="curService === 'weaknet'" />
        <protocol-application v-if="curService === 'protocol'" />
        <preliminary-application v-if="curService === 'preliminary'" />
        <service-orders-list v-if="curService === 'serviceOrdersList'" :serviceData="serviceData" /> -->
    </div>
</template>

<script>
    import compatibilityApplication from '@/components/ExpertServices/Compatibility/CompatibilityApplication.vue'
    import performanceApplication from '@/components/ExpertServices/Performance/PerformanceApplication.vue'
    import privacyApplication from '@/components/ExpertServices/Privacy/PrivacyApplication.vue'
    import weaknetApplication from '@/components/ExpertServices/Weaknet/WeaknetApplication.vue'
    import protocolApplication from '@/components/ExpertServices/Protocol/ProtocolApplication.vue'
    import preliminaryApplication from '@/components/ExpertServices/Preliminary/PreliminaryApplication.vue'
    import serviceOrdersList from '@/components/Common/ServiceOrdersList.vue'
    import sidebar from '@/components/Common/Sidebar.vue'

    export default {
        components: {
            compatibilityApplication,
            performanceApplication,
            privacyApplication,
            weaknetApplication,
            protocolApplication,
            preliminaryApplication,
            serviceOrdersList,
            sidebar
        },
        data() {
            return {
                serviceData: {
                    label: '服务单列表',
                    value: 'total'
                }
            }
        },
        props:{
            
        },
        created(){
        },
        mounted(){
            
        },
        computed:{
            curService() {
                let query = this.$route.query;
                let service = this.$route.query.service;
                console.log('service',service);
                return service;
            }
        },
        watch:{
        },
        methods:{
            
        },
    }
</script>
    
<style scoped>
    .expert-services {
        height: calc(100% - 64px);
        width: 100%;
        display: flex;
        background: #E5E5E5;
        margin-top: 64px;
    } 
</style>

<style>
</style> 