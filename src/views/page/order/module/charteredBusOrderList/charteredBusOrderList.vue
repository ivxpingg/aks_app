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
                    <div class="top-panel ivx-row">
                        <div class="ivx-item ivx-item_1 price">
                            {{item.totalPrice ? '￥': ''}}{{item.totalPrice}}
                        </div>
                        <div class="ivx-item">
                            <span class="state">{{item.orderStatusLabel}}</span>
                        </div>
                    </div>
                    <!--<div class="top-panel ivx-row">-->
                        <!--<div class="ivx-item">-->
                            <!--<span class="ivx-date">-->
                                <!--{{$moment(item.insTime).format('YYYY年MM月DD日 HH:mm:ss')}}-->
                            <!--</span>-->
                        <!--</div>-->
                    <!--</div>-->
                    <div class="ivx-row">
                        <div class="ivx-item ivx-item_1">
                            <span class="ivx-title">
                                <van-icon slot="left-icon" class-prefix="icon iconfont icondian" size="22px" color="#1AD8E2"></van-icon>
                            </span>
                            <span class="ivx-text">
                                {{item.beginAddress}}
                            </span>
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
                    <div class="ivx-row" style="margin-top: 5px;">
                        <div class="ivx-item ivx-item_1"></div>
                        <div class="ivx-item">
                            <van-button v-if="item.orderStatus === 'receive_order'" type="primary" size="small" @click.stop="onokOrder(item)">确认订单</van-button>
                            <van-button v-if="!item.invoiceNo && item.orderStatus === 'complete'" type="primary" size="small" style="margin-right: 5px;" @click.stop="openInvoice(item)">开发票</van-button>
                            <van-button v-if="item.orderStatus === 'book_success'" type="primary" size="small" @click.stop="openPay(item)">支付</van-button>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>

    </van-pull-refresh>
</template>

<script>
    export default {
        name: 'vcharteredBusOrderList',
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
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

                // 开发票
                popup_invoice_value: false,
                formData_invoice: {
                    rentCarOrderId: '',
                    invoiceName: '', //	发票名称
                    invoiceNo: '', //	税号
                },
                // 支付方式
                popup_pay_value: false,
                formData_pay: {
                    rentCarOrderId: '',
                    payType: '', // 支付方式
                    totalPrice: '', // 支付金额
                }
            };
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
                    url: '/rentCar/list',
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
            onClick_order(item) {
                // 否则跳转到订单详情页面
                this.$router.push({
                    name: 'charteredBusOrderDetail',
                    params: {
                        id: item.rentCarOrderId
                    }
                })
            },

            onokOrder(item) {
                this.$dialog.confirm({
                    title: '确认订单',
                    message: `是否确认行程?`
                }).then(() => {
                    this.$http({
                        method: 'get',
                        url: '/rentCar/confirmTrip',
                        params: {
                            rentCarOrderId: item.rentCarOrderId
                        }
                    }).then((res) => {
                        if (res.code === 'SUCCESS') {
                            this.$toast('确认成功!');
                            this.onRefresh();
                        }
                    })
                })

            },

            // 开票弹框
            openInvoice(item) {
                this.$router.push({
                    name: 'charteredBusInvoice',
                    params: {
                        id: item.rentCarOrderId
                    }
                })
            },
            // 支付弹框
            openPay(item) {
                this.$router.push({
                    name: 'charteredBusPayType',
                    params: {
                        id: item.rentCarOrderId
                    }
                })
            },


        }
    }
</script>

<style lang="scss" scoped>
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