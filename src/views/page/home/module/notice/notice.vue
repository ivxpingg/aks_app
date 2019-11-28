<template>
    <div class="notice-container" v-show="noticeList.length > 0">
        <div class="body">
            <div class="header">
                <div class="title" @click="getLoactionGPS">通知公告</div>
                <div class="more" @click="com_goto('noticeListPage')">
                    <van-icon name="ellipsis" size="20px"></van-icon>
                </div>
            </div>
            <van-cell-group>
                <van-cell v-for="item in noticeList"
                          :key="item.newsId"
                          :value="item.publishTime" @click="viewMessage(item)">
                    <div slot="title" class="cell-title">{{item.title}}</div>
                    <van-icon slot="icon"
                              size="28px"
                              color="#1AD8E2"
                              class-prefix="icon iconfont icondian">
                    </van-icon>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixins/comMixin';
    export default {
        name: 'vnotice',
        mixins: [comMixin],
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 3,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        showPosition: 'index',
                    }
                },
                noticeList: []
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getLoactionGPS() {
                Toaster.postMessage('js调用Flutter sgj2');
            },
            getData() {
                this.$http({
                    method: 'post',
                    url: '/index/list',
                    data: this.searchParams
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.noticeList = res.data.records || [];
                        this.noticeList.forEach((item) => {
                            item.publishTime = this.timeFormat(params.row.publishTime, 'YYYY-MM-DD')
                        });
                    }
                })
            },
            viewMessage(item) {
                this.$router.push({
                    name: 'noticeDetail',
                    params: {
                        id: item.newsId
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .notice-container {
        .body {
            .header {
                display: flex;
                padding: 0 16px;
                background-color: #FFF;
                line-height: 40px;
                .title {
                    flex: 1;
                    font-size: 16px;
                    font-weight: 700;
                }
            }
            .van-cell {
                padding: 4px 10px;

                .cell-title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 200px;
                }
            }
        }
    }
</style>