<template>
    <div class="orderDetail-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="行程详情" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>
        <div class="page-body">
            <div class="info-panel van-hairline--bottom">
                <vDriverDetail :taxiOrderId="orderData.taxiOrderId"></vDriverDetail>
            </div>

            <div class="order-tip" v-if="orderData.orderStatus === 'end_trip'">
                <span>等待司机输入付款金额</span>
            </div>

            <div class="order-panel" v-if="orderData.orderStatus === 'wait_pay'">
                <div class="fee">
                    <span>车费：</span>
                    <span>RMB </span>
                    <span>{{orderData.totalPrice}}</span>
                    <span> 元</span>
                </div>
                <div class="pay-panel" v-if="orderData.orderStatus === 'wait_pay'">
                    <van-divider>支付方式</van-divider>
                    <div class="pay-type">
                        <van-radio-group v-model="payType_radio">
                            <van-cell-group  :border="false">
                                <van-cell title="微信支付" clickable @click="radio = 'wechat'" :border="false">
                                    <van-icon slot="icon" name="wechat" color="rgb(116, 187, 98)" size="24px" style="padding-right: 5px;"/>
                                    <van-radio slot="right-icon" name="1" />
                                </van-cell>
                                <van-cell title="现金支付" clickable @click="radio = 'cash'" :border="false">
                                    <div slot="icon" style="width: 30px; height: 24px;"></div>
                                    <van-radio slot="right-icon" name="2" />
                                </van-cell>
                            </van-cell-group>
                        </van-radio-group>

                        <div class="pay-btn" style="padding-top: 20px;">
                            <van-button round type="info"
                                        color="rgb(26,216,226)"
                                        size="large"
                                        @click="submitPay">确认支付</van-button>
                        </div>
                    </div>
                </div>
            </div>

            <!--评价-->
            <div class="evaluate-panel" v-if="showEvaluate">
                <van-divider> 匿 名 评 价</van-divider>

                <div class="start">
                    <van-rate v-model="evaluateForm.evaluateNum" :readonly="orderData.evaluateNum !== 0" size="32px"></van-rate>
                    <div class="start-msg" v-if="orderData.evaluateNum === 0">{{evaluateForm.startText}}</div>
                    <div class="start-text" v-if="orderData.evaluateNum !== 0">已评价，谢谢您的反馈</div>
                </div>
                <div class="evaluateType">
                    <div class="type"
                         v-for="item in dict_evaluateType"
                         :key="item.id"
                         :class="{'active': evaluateForm.evaluateType.indexOf(item.value) > -1}"
                         @click="onClick_evaluateType(item)">{{item.label}}</div>
                </div>
                <div class="btn" style="padding-top: 20px;" v-if="orderData.evaluateNum === 0">
                    <van-button round type="info"
                                color="rgb(26,216,226)"
                                size="large"
                                @click="submitEvaluate">提交评价</van-button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import comMixin from '../../../../../../lib/mixins/comMixin';
    import vDriverDetail from '../../module/driverDetail/driverDetail';
    export default {
        name: 'vorderDetail',
        mixins: [comMixin],
        components: {vDriverDetail},
        computed: {
            // 是否显示评价
            showEvaluate() {
                return ['pay', 'complete'].indexOf(this.orderData.orderStatus) > -1;
            }
        },
        beforeDestroy() {
            if (this.timerForEndTrip) {
                clearTimeout(this.timerForEndTrip);
            }
        },
        data () {
            return {
                taxiOrderId: '',
                // 订单信息
                orderData: {
                    taxiOrderId: '',
                    taxiDriverId: '',
                    orderStatus: '',
                    evaluateNum: 0,  // 评价次数
                    beginAddress: '',
                    beginLng: null,
                    beginLat: null,
                    endAddress: '',
                    endLng: null,
                    endLat: null
                },
                // 支付
                payType_radio: 'wechat',
                // 评价
                evaluateForm: {
                    evaluateNum: 0,
                    evaluateType: [],
                    startText: ''
                },
                dict_evaluateType: [],

                // 定时器，如果是行程结束状态
                timerForEndTrip: null
            };
        },
        mounted() {
            this.taxiOrderId = this.$route.params.taxiOrderId || '';

            if (this.taxiOrderId === '') {
                this.$router.push({
                    name: 'home'
                });
            }
            this.com_getDicts(['evaluateType']);

            this.getOrder();
        },
        watch: {
            'evaluateForm.startNum'(val) {
                switch (val) {
                    case 1: this.evaluateForm.startText = '非常不满意'; break;
                    case 2: this.evaluateForm.startText = '不满意'; break;
                    case 3: this.evaluateForm.startText = '满意'; break;
                    case 4: this.evaluateForm.startText = '非常满意'; break;
                    case 5: this.evaluateForm.startText = '非常满意,无可挑剔'; break;
                }
            }
        },
        methods: {
            // 获取订单详情
            getOrder() {
                this.getEvaluate();
                this.$http({
                    method: 'get',
                    url: '/taxi/taxiOrderDetail',
                    params: {
                        taxiOrderId: this.taxiOrderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.orderData, res.data);

                        if (this.orderData.orderStatus === 'end_trip') {
                            this.timerForEndTrip = setTimeout(() => {
                                this.getOrder();
                            }, 3000)
                        }
                    }
                    else {

                    }
                })
            },
            // 获取评价
            getEvaluate() {
                this.$http({
                    method: 'get',
                    url: '/evaluate/evaluateDetail',
                    params: {
                        orderId: this.taxiOrderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.evaluateForm.evaluateNum = res.data.starNum;
                        this.evaluateForm.evaluateType = res.data.evaluateType.split(',');
                    }
                    else {

                    }
                })
            },

            // 支付
            submitPay() {
                this.$http({
                    method: 'get',
                    url: '/taxi/confirmPay',
                    params: {
                        taxiOrderId: this.orderData.taxiOrderId,
                        payType: this.payType_radio
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.getOrder();
                    }
                })
            },
            // 评价具体内容
            onClick_evaluateType(item) {
                // 如果已经评价就不再触发
                if (this.orderData.evaluateNum !== 0) return;
                let idx = this.evaluateForm.evaluateType.indexOf(item.value);
                if (idx > -1) {
                    this.evaluateForm.evaluateType.splice(idx, 1);
                }
                else {
                    this.evaluateForm.evaluateType.push(item.value);
                }
            },
            // 评价
            submitEvaluate() {
                if (this.evaluateForm.orderData === 0) {
                    this.$toast('请评价');
                    return;
                }
                this.$http({
                    method: 'post',
                    url: '/evaluate/evaluate',
                    data: {
                        orderId: this.orderData.taxiOrderId,
                        evaluateType: this.evaluateForm.evaluateType.join(','),
                        starNum: this.evaluateForm.evaluateNum,
                        moduleType: 'taxi'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.getOrder();
                    }
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .orderDetail-container {
        background-color: #FFF;

        .order-tip {
            display: block;
            padding: 50px 0;
            font-size: 18px;
            font-weight: 700;
            color: #ff5b20;
            text-align: center;
        }
        .order-panel {
            .fee {
                padding: 30px 0 10px;
                color: rgb(26,216,226);
                text-align: center;
                font-size: 24px;
                font-weight: 700;
            }
            .pay-panel {
                padding: 10px 20px;
            }
        }

        .evaluate-panel {
            .start {
                padding: 20px 0;
                text-align: center;
                .start-text {
                    padding: 10px 0 0;
                    color: #999;
                }
                .start-msg {
                    padding: 10px 0 0;
                    color: #e69b21;
                    font-size: 14px;
                }
            }

            .evaluateType {
                position: relative;
                overflow: hidden;
                padding: 10px 10px;
                .type {
                    margin: 5px 10px;
                    padding: 5px 15px;
                    float: left;
                    display: inline-block;
                    border-radius: 15px;
                    border: 1px solid rgb(255, 210, 30);
                    &.active {
                        background-color: rgb(255, 210, 30);
                        color: #FFF;
                    }
                }
            }

            .btn {
                padding: 10px 20px;
            }
        }

    }
</style>