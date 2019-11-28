<template>
    <div class="messageList-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="消息" @click-left="com_back"></van-nav-bar>
        </van-sticky>

       <div class="page-body" :style="{height: height}">
           <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
               <van-list
                       class="messageList-container"
                       v-model="listLoading"
                       :finished="listFinished"
                       finished-text="没有更多了"
                       :error.sync="listError"
                       error-text="请求失败，点击重新加载"
                       @load="onLoad">

                   <div class="page-body">
                       <van-cell-group>
                           <van-cell v-for="item in listData"
                                     :key="item.newsId"
                                     :value="timeFormat(item.insTime)" @click="viewMessage(item)">
                               <div slot="title" class="cell-title">{{item.noticeTitle}}</div>
                               <van-icon slot="icon"
                                         v-if="item.noticeStatus === 'unRead'"
                                         size="28px"
                                         color="#1AD8E2"
                                         class-prefix="icon iconfont icondian">
                               </van-icon>
                               <!--<span v-else  style="padding: 14px;"></span>-->
                           </van-cell>
                       </van-cell-group>
                   </div>
               </van-list>

           </van-pull-refresh>
       </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixins/comMixin';
    export default {
        name: 'vmessageList',
        mixins: [comMixin],
        data () {
            return {
                height: 'auto',
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {}
                },
                isLoading: false,
                listLoading: false,
                listFinished: false,
                listError: false,
                listData: []
            };
        },
        mounted() {
            this.height = window.innerHeight - 46 + 'px';
        },
        methods: {
            onRefresh() {
                this.searchParams.current = 1;
                this.listData = [];
                this.listFinished = false;
                this.onLoad();
            },
            onLoad() {
                this.$http({
                    method: 'post',
                    url: '/notice/list',
                    data: this.searchParams
                }).then((res) => {
                    this.searchParams.current++;
                    if (res.code === 'SUCCESS') {
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
            viewMessage(item) {
                this.$dialog.alert({
                    title: item.noticeTitle,
                    message: item.noticeContent
                }).then(() => {
                    this.$http({
                        method: 'get',
                        url: '/notice/updateStatus',
                        params: {
                            noticeId: item.noticeId
                        }
                    }).then((res) => {
                        if (res.code === 'SUCCESS') {
                            item.noticeStatus = 'read';
                        }
                    })
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .messageList-container {
    }
</style>