<template>
    <div class="customizedBusService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="定制公交服务" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>
        <!--<div class="page-body">-->
            <!--建设中，尽情期待！-->
        <!--</div>-->
        <div class="page-body">
            <van-tabs ref="vanTab" v-model="active" sticky :offset-top="46">
                <van-tab title="已开通" name="open">
                    <vList lineStatus="open"></vList>
                </van-tab>
                <van-tab title="待开通" name="publish">
                    <vList lineStatus="publish"></vList>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    import vList from './module/list/list';
    export default {
        name: 'vCustomizedBusService', // 定制公交服务
        mixins: [comMixin],
        components: {vList},
        data () {
            return {
                active: 'open'
            };
        }
    }
</script>

<style lang="scss" scoped>
    .customizedBusService-container {
    }
</style>