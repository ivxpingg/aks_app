<template>
    <div class="charteredBusOrderDetail-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="订单详情" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body">
            <div class="step-panel">
                <van-steps v-if="formData.orderStatus === 'cancel'" :active="active">
                    <van-step>待接单</van-step>
                    <van-step>已取消</van-step>
                </van-steps>

                <van-steps v-else-if="formData.orderStatus === 'close'" :active="active">
                    <van-step>待接单</van-step>
                    <van-step>已关闭</van-step>
                </van-steps>

                <van-steps v-else :active="active">
                    <van-step>待接单</van-step>
                    <van-step>已接单</van-step>
                    <van-step>行程中</van-step>
                    <van-step>已完成</van-step>
                </van-steps>

            </div>

            <div class="order-info">
                <div class="card-title">订单信息</div>
                <div class="item"> <span class="title">订单编号：</span> <span class="text">{{formData.orderNo}}</span> </div>
                <div class="item"> <span class="title">订单时间：</span> <span class="text">{{formData.insTime}}</span> </div>
                <div class="item"> <span class="title">用车时间：</span> <span class="text">{{formData.beginTime}}</span> </div>
                <div class="item"> <span class="title">用车人数：</span> <span class="text">{{formData.seatNum}}</span> </div>
                <div class="item"> <span class="title">联系人：</span> <span class="text">{{formData.contactsName}}</span> </div>
                <div class="item"> <span class="title">联系电话：</span> <span class="text">{{formData.contactsPhone}}</span> </div>
                <div class="item"> <span class="title">需求备注：</span> <span class="text">{{formData.description}}</span> </div>
            </div>

            <div class="order-info">
                <div class="card-title">行程信息</div>
                <div class="item"> <span class="title">出发地点：</span> <span class="text">{{formData.beginAddress}}</span> </div>
                <div class="item"> <span class="title">目的地点：</span> <span class="text">{{formData.endAddress}}</span> </div>
                <div class="item"> <span class="title">司机名称：</span> <span class="text">{{formData.driverName}}</span> </div>
                <div class="item"> <span class="title">联系电话：</span> <span class="text">{{formData.driverPhone}}</span> </div>
                <div class="item"> <span class="title">接送时间：</span> <span class="text">{{formData.pickUpTime}}</span> </div>
                <div class="item"> <span class="title">车辆安排：</span> <span class="text">{{formData.carType}}</span> </div>
                <div class="item"> <span class="title">车牌号：</span> <span class="text">{{formData.licensePlate}}</span> </div>
                <div class="item"> <span class="title">行程费用：</span> <span class="text">{{formData.tripCost}}</span> </div>
                <div class="item"> <span class="title">服务内容：</span> <span class="text">{{formData.serviceContent}}</span> </div>
                <div class="item" v-show="formData.refuseReason"> <span class="title">拒绝理由：</span> <span class="text">{{formData.refuseReason}}</span> </div>

                <div class="btn-panel" v-if="formData.driverPhone">
                    <van-button :url="'tel:' + formData.driverPhone"
                                type="primary"
                                size="large"
                                color="rgb(26,216,226)">联系司机</van-button>
                </div>
            </div>

            <div class="order-info" v-show="!!formData.payTime">
                <div class="card-title">支付情况</div>
                <div class="item"> <span class="title">支付时间：</span> <span class="text">{{formData.payTime}}</span> </div>
                <div class="item"> <span class="title">支付方式：</span> <span class="text">{{formData.payTypeLabel}}</span> </div>
                <div class="item"> <span class="title">支付金额：</span> <span class="text">￥{{formData.totalPrice}} 元</span> </div>
                <div class="item"> <span class="title">发票抬头：</span> <span class="text">{{formData.invoiceName}}</span> </div>
                <div class="item"> <span class="title">税号：</span> <span class="text">{{formData.invoiceNo}}</span> </div>

            </div>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../../lib/mixins/comMixin';
    export default {
        name: 'vcharteredBusOrderDetail',
        mixins: [comMixin],
        computed: {
            active() {
                switch (this.formData.orderStatus)  {
                    case 'wait_receive': return 0; break;
                    case 'receive_order': return 1; break;
                    case 'in_trip': return 2; break;
                    case 'complete': return 3; break;
                    case 'cancel': return 1; break;
                    case 'close': return 1; break;
                }
                return 10;
            }
        },
        data () {
            return {
                formData: {
                    rentCarOrderId: '', //	包车订单id
                    beginAddress: '', //	起点名称
                    beginLng: '',
                    beginLat: '',
                    endAddress: '', //	终点名称
                    endLng: '',
                    endLat: '',
                    beginTime: '', //	用车开始时间
                    endTime: '', //	用车结束时间
                    seatNum: '', //	用车人数
                    contactsPhone: '', //	联系人电话
                    contactsName: '', //	联系人
                    description: '', //	描述
                    driverName: '', //	司机名称
                    driverPhone: '', //	司机联系电话
                    pickUpTime: '',  // 接送时间
                    carType: '', //	车辆类型
                    licensePlate: '', //	车牌号码
                    tripCost: '',  // 行程费用
                    serviceContent: '',  // 服务内容
                    invoiceName: '', //	发票名称
                    invoiceNo: '', //	税号
                    orderStatus: '',  // 订单状态
                    insTime: '', //	创建时间
                    payTime: '', // 支付时间
                    payType: '', // 支付方式
                    totalPrice: '', // 支付金额
                    refuseReason: '' // 拒绝理由
                },
            };
        },
        mounted() {
            this.formData.rentCarOrderId = this.$route.params.id;
            this.getData();
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/rentCar/detail',
                    params: {
                        rentCarOrderId: this.formData.rentCarOrderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            beginTime: this.timeFormat(res.data.beginTime, 'YYYY-MM-DD HH:mm'),
                            endTime: this.timeFormat(res.data.endTime, 'YYYY-MM-DD HH:mm'),
                            insTime: this.timeFormat(res.data.insTime, 'YYYY-MM-DD HH:mm:ss'),
                            pickUpTime: this.timeFormat(res.data.pickUpTime, 'YYYY-MM-DD HH:mm'),
                            payTime: this.timeFormat(res.data.payTime, 'YYYY-MM-DD HH:mm:ss')
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .charteredBusOrderDetail-container {
        .page-body {
            padding: 10px 10px;

            .step-panel {
                border-radius: 5px;
                overflow: hidden;
            }
            .order-info {
                margin-top: 8px;
                padding: 10px 15px;
                background-color: #FFF;
                border-radius: 5px;
                overflow: hidden;

                .card-title {
                    position: relative;
                    padding-left: 14px;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 30px;
                    &:after {
                        display: block;
                        position: absolute;
                        top: 6px;
                        left: 0;
                        content: ' ';
                        width: 6px;
                        height: 18px;
                        background-color: rgb(26, 216, 226);
                        border-radius: 3px;
                    }
                }
                .item {
                    padding: 3px;
                    font-size: 13px;
                    line-height: 22px;
                }
            }
        }
    }
</style>