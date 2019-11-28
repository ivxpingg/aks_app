<template>
    <div class="charteredBusService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="包车服务" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>

        <vSteps></vSteps>

        <vForm></vForm>

    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    import vSteps from './module/steps/steps';
    import vForm from './module/form/form';
    export default {
        name: 'vCharteredBusService', // 包车服务
        mixins: [comMixin],
        components: {vSteps, vForm},
        data () {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .charteredBusService-container {
        padding-bottom: 20px;
    }
</style>