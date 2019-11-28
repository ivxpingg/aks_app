<template>
    <div class="parkService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="快捷停车" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>

        <div class="page-body">
            建设中，尽情期待！
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    export default {
        name: 'vParkService',  // 快捷停车
        mixins: [comMixin],
        data () {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .parkService-container {
        .page-body {
            line-height: 300px;
            font-size: 20px;
            text-align: center;
            color: #999;
        }
    }
</style>