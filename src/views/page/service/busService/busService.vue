<template>
    <div class="busService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="公交实时查询" @click-left="com_back"></van-nav-bar>
        </van-sticky>
        <vNoticeBar></vNoticeBar>
        <van-sticky :offset-top="46">
            <van-search placeholder="您可以查询线路、换乘、站点..."
                        shape="round"
                        readonly
                        @click.stop.prevent="showSearch"></van-search>
        </van-sticky>
        <van-popup v-model="search_popup"
                   :overlay="false"
                   position="right"
                   style="width: 100%; height: 100%;">
            <vBusSearch ref="busSearch"
                        @onSearch="onSearch"
                        @cancel="search_popup = false"></vBusSearch>
        </van-popup>
    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    import vBusSearch from './module/busSearch/busSearch';
    import vNoticeBar from '../../../common/noticeBar/noticeBar';
    export default {
        name: 'vbusService',
        mixins: [comMixin],
        components: {vBusSearch, vNoticeBar},
        data () {
            return {
                searchParams: {
                    value: ''
                },
                search_popup: false
            };
        },
        mounted() {
        },
        methods: {
            showSearch() {
                this.search_popup = true;
                setTimeout(() => {
                    this.$refs.busSearch.$refs.search.querySelector('input').focus();
                }, 0)
            },
            onSearch() {
            },
            onCancel() {}
        }
    }
</script>

<style lang="scss" scoped>
    .busService-container {
    }
</style>