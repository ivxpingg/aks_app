<template>
    <div class="orderManage-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="我的订单" @click-left="com_back"></van-nav-bar>
        </van-sticky>
        <div class="page-body" :style="{height: height}">
            <van-tabs ref="vanTab" v-model="active" sticky :offset-top="46">
                <van-tab title="包车订单" name="charteredBus">
                    <vCharteredBusOrderList></vCharteredBusOrderList>
                </van-tab>
                <van-tab title="出租车订单" name="taxi">
                    <vOrderList></vOrderList>
                </van-tab>
                <van-tab title="充电桩订单" name="charging">

                </van-tab>
            </van-tabs>

        </div>
    </div>
</template>

<script>
    import comMixin from '../../../lib/mixins/comMixin';
    import vOrderList from './module/orderList/orderList';
    import vCharteredBusOrderList from './module/charteredBusOrderList/charteredBusOrderList';
    export default {
        name: 'vorderManage',
        mixins: [comMixin],
        components: {vOrderList, vCharteredBusOrderList},
        data () {
            return {
                height: 'auto',
                active: 'charteredBus'
            };
        },
        mounted() {
            this.height = (window.innerHeight - 46 - 50) + 'px';
            this.active = this.$route.params.active || 'charteredBus';
        }
    }
</script>

<style lang="scss" scoped>
    .orderManage-container {
    }
</style>