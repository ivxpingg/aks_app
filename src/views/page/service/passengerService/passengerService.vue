<template>
    <div class="passengerService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="客车查询" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>

        <div class="page-body">
            建设中，尽情期待！
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    export default {
        name: 'vPassengerService', // 客车查询服务
        mixins: [comMixin],
        data () {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .passengerService-container {
        .page-body {
            line-height: 300px;
            font-size: 20px;
            text-align: center;
            color: #999;
        }
    }
</style>