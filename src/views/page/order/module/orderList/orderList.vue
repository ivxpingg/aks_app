<template>
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
                <div class="item"
                     v-for="item in listData"
                     :key="item.orderId" @click="onClick_order(item)">
                    <!--<div class="top-panel ivx-row">-->
                        <!--<div class="ivx-item ivx-item_1 price">-->
                            <!--{{item.totalPrice ? '￥': ''}}{{item.totalPrice}}-->
                        <!--</div>-->
                        <!--<div class="ivx-item state">{{item.orderStatusLabel}}</div>-->
                    <!--</div>-->
                    <div class="top-panel ivx-row">
                        <div class="ivx-item ivx-item_1 price">
                            {{item.totalPrice ? '￥': ''}}{{item.totalPrice}}
                        </div>
                        <div class="ivx-item">
                            <span class="state">{{item.orderStatusLabel}}</span>
                        </div>
                    </div>
                    <div class="top-panel ivx-row">
                        <div class="ivx-item">
                            <span class="ivx-date">
                                {{$moment(item.insTime).format('YYYY年MM月DD日 HH:mm:ss')}}
                            </span>
                        </div>
                    </div>
                    <div class="ivx-row">
                        <div class="ivx-item ivx-item_1">
                            <span class="ivx-title">
                                <van-icon slot="left-icon" class-prefix="icon iconfont icondian" size="22px" color="#1AD8E2"></van-icon>
                            </span>
                            <span class="ivx-text">
                                {{item.beginAddress}}
                            </span>
                        </div>
                        <div class="ivx-item">
                            <span v-if="item.evaluateNum === 0" class="">待评价</span>
                            <span v-else>已评价</span>
                        </div>
                    </div>
                    <div class="ivx-row">
                        <div class="ivx-item">
                            <span class="ivx-title">
                               <van-icon slot="left-icon" class-prefix="icon iconfont icondian" size="22px" color="#E69B21"></van-icon>
                            </span>
                            <span class="ivx-text">
                                 {{item.endAddress}}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </van-list>
    </van-pull-refresh>
</template>

<script>
    export default {
        name: 'vOrderList',
        props: {
            orderStatus: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                searchParams: {
                    current: 0,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        orderStatus: ''
                    }
                },
                isLoading: false,
                listLoading: false,
                listFinished: false,
                listError: false,
                listData: [],

            };
        },
        watch: {
            orderStatus: {
                handler(val) {
                    this.searchParams.condition.orderStatus = val;
                    this.searchParams.current = 1;
                }
            }
        },
        mounted() {},
        methods: {
            onRefresh() {
                this.searchParams.current = 0;
                this.listData = [];
                this.listFinished = false;
                this.onLoad();
            },
            onLoad() {
                this.searchParams.current++;
                this.$http({
                    method: 'post',
                    url: '/taxi/list',
                    data: this.searchParams
                }).then((res) => {
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
            onClick_order(item) {
                // 如果订单状态是待接单、已接单、行程中 则跳转到接驾页面 waitingTaxi
                // 否则跳转到订单详情页面
                if (['wait_receive', 'receive_order', 'in_trip'].indexOf(item.orderStatus) > -1) {
                    this.$router.push({
                        name: 'waitingTaxi'
                    })
                }
                else {
                    this.$router.push({
                        name: 'orderDetail',
                        params: {
                            taxiOrderId: item.taxiOrderId
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .orderList-container {

    }

    .page-body {
        .item {
            position: relative;
            margin: 10px;
            padding: 10px;
            background-color: #FFF;
            border-radius: 5px;

            .price {
                padding-left: 5px;
                font-size: 16px;
                font-weight: 700;
                color: rgb(249, 137, 64);
                text-align: left;
                min-height: 10px;
            }

            .ivx-date {
                padding-left: 10px;
            }
        }
    }
</style>