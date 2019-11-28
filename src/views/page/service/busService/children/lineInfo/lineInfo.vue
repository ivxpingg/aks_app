<template>
    <div class="lineInfo-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="1路" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body">
            <div class="bus-info">
                <div class="direction">
                    <span>方向：</span>
                    <span>型钢花园站</span>
                </div>

                <div class="time">
                    <span class="start-text">首</span>
                    <span class="time-text">05:35</span>
                    <span class="end-text">末</span>
                    <span class="time-text">19:35</span>
                    <span>
                    上车
                    <span>1</span>
                    元
                </span>
                </div>
            </div>

            <div class="bus-position-box" style="padding: 10px;">
                <vBusPosition :buslineId="searchParams.buslineId"></vBusPosition>
            </div>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../../lib/mixins/comMixin';
    import vBusPosition from './module/busPosition/busPosition';
    export default {
        name: 'vlineInfo',
        mixins: [comMixin],
        components: {vBusPosition},
        data () {
            return {
                searchParams: {
                    busline_id: ''
                }
            };
        },
        mounted() {
            this.searchParams.busline_id = this.$route.params.id || '';
            this.getData();
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/',
                    params: this.searchParams
                }).then((res) => {

                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .lineInfo-container {
        .page-body {
            .bus-info {
                background-color: #FFF;
                padding: 10px;
                .direction {
                    padding-bottom: 5px;
                    font-size: 13px;
                }
                .time {
                    font-size: 12px;
                    .start-text {
                        padding: 1px;
                        color: #FFF;
                        background-color: #55a532;
                        border-radius: 2px;
                    }
                    .end-text {
                        padding: 1px;
                        color: #FFF;
                        background-color: #ae3b0a;
                        border-radius: 2px;
                    }
                    .time-text {
                        padding: 1px 5px;
                    }
                }
            }
        }
    }
</style>