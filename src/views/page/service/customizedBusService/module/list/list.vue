<template>
    <van-pull-refresh class="list-container" v-model="isLoading" @refresh="onRefresh">
        <van-list
                class="messageList-container"
                v-model="listLoading"
                :finished="listFinished"
                finished-text="没有更多了"
                :error.sync="listError"
                error-text="请求失败，点击重新加载"
                @load="onLoad">

            <div class="page-body">
                <div class="item van-hairline--bottom"
                     v-for="item in listData" @click="com_goto('customizedBusMap', {id: item.customBusId})">
                    <div class="left-panel">
                        <span class="time van-hairline--right">{{item.departTime}}</span>
                    </div>
                    <div class="center-panel">
                        <div class="center-row">
                            <span class="start">起</span>
                            <span class="station-name">{{item.beginStation}}</span>
                        </div>
                        <div class="center-row">
                            <span class="end">终</span>
                            <span class="station-name">{{item.endStation}}</span>
                        </div>
                    </div>
                    <div class="right-panel" v-if="lineStatus === 'publish'" @click.stop="vote(item)">
                        <div class="right-row">
                            <van-icon v-if="item.voteFlag === 0" name="like-o"></van-icon>
                            <van-icon v-else name="like" color="#11be83"></van-icon>
                        </div>
                        <div class="right-row">
                            <span class="text">{{item.voteNum}}人求开通</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </van-pull-refresh>
</template>

<script>
    import comMixin from '../../../../../../lib/mixins/comMixin';
    export default {
        name: 'vlist',
        mixins: [comMixin],
        props: {
            lineStatus: {
                type: String,
                required: true
            }
        },
        computed: {
            onLoadUrl() {
                if (this.lineStatus === 'open') return '/customBus/openList';
                else if (this.lineStatus === 'publish') return '/customBus/waitOpenList';
            }
        },
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0     // 总行数
                },
                isLoading: false,
                listLoading: false,
                listFinished: false,
                listError: false,
                listData: [],
            };
        },
        watch: {
            lineStatus: {
                immediate: true,
                handler(val) {
                    this.searchParams.current = 1;
                }
            }
        },
        mounted() {},
        methods: {
            onRefresh() {
                this.searchParams.current = 1;
                this.listData = [];
                this.listFinished = false;
                // this.onLoad();
            },
            onLoad() {
                this.$http({
                    method: 'post',
                    url: this.onLoadUrl,
                    data: this.searchParams
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.searchParams.current++;
                        this.listData = this.listData.concat(res.data.records || []);
                        this.searchParams.total = res.data.total;
                    }
                    if (!res.data.records) {
                        this.listFinished = true;
                    }
                    this.isLoading = false;
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                    this.listError = true;
                })
            },
            // 投票
            vote(item) {
                this.$http({
                    method: 'get',
                    url: '/customBus/vote',
                    params: {
                        customBusId: item.customBusId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        item.voteFlag = item.voteFlag === 0 ? 1 : 0;
                        item.voteFlag === 0 ? item.voteNum-- : item.voteNum++;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .list-container {
        .page-body {
            background-color: #FFF;
            .item {
                display: flex;
                .left-panel {
                    .time {
                        margin: 5px 0;
                        display: inline-block;
                        height: 50px;
                        width: 60px;
                        text-align: center;
                        line-height: 50px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #333;
                    }
                }
                .center-panel {
                    flex: 1;
                    padding: 10px;
                    .center-row {
                        margin-bottom: 10px;
                        line-height: 15px;
                        font-size: 13px;
                        &:last-child {
                            margin-bottom: 0;
                        }

                        .start {
                            padding: 0 2px;
                            color: #fff;
                            border-radius: 3px;
                            background-color: #209ee3;
                        }
                        .end {
                            padding: 0 2px;
                            color: #fff;
                            border-radius: 3px;
                            background-color: #11be83;
                        }
                        .station-name {
                            padding-left: 5px;
                        }
                    }
                }
                .right-panel {
                    text-align: center;
                    padding: 10px 10px 0;
                    color: #999;
                    .van-icon {
                        font-size: 20px;
                    }
                }
            }
        }
    }
</style>