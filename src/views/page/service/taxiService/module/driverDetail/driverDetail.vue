<template>
    <div class="driverDetail-container">
        <div class="driver-info-box">
            <div class="driver-head">
                <img src="/img/taxi/driver-man.png" alt="">
            </div>
            <div class="driver-info">
                <div class="name">{{driverInfo.name}}</div>
                <div>
                            <span class="text car-number">
                                {{driverInfo.licensePlate}}
                            </span>
                    <span class="text company">
                                {{driverInfo.companyName}}
                            </span>
                </div>
                <div class="estimate">
                    <van-rate :value="driverInfo.starNum" size="12px"></van-rate>
                    <span class="text order-num">  {{driverInfo.orderNum}}单 </span>
                </div>
            </div>
            <div class="btn" v-if="showPhone">
                <van-button :url="url"
                            plain
                            round
                            icon="phone"
                            sizd="mini"
                            type="primary">
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vdriverDetail',
        props: {
            taxiOrderId: {
                type: String,
                default: ''
            },
            showPhone: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            url() {
                return 'tel:' + this.driverInfo.phone;
            }
        },
        data () {
            return {
                driverInfo: {
                    name: '',
                    taxiDriverId: '', // 司机id
                    licensePlate: '', // 车牌号码
                    starNum: 0,  // 星级
                    orderNum: 0, // 订单数
                    companyName: '',// 公司名称
                    phone: ''
                }
            };
        },
        watch: {
            taxiOrderId(val) {
                if (val) {
                    this.getData();
                }
            }
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/taxi/driverInfo',
                    params: {
                        taxiOrderId: this.taxiOrderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.driverInfo, res.data);
                    }
                    else {

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .driverDetail-container {
        .driver-info-box {
            display: flex;
            background-color: #FFF;
            .driver-head {
                padding: 10px;
                > img {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                }
            }
            .driver-info {
                flex: 1;
                padding: 5px 0;
                .name {
                    font-size: 15px;
                    font-weight: 700;
                }
                .text {
                    color: #999;
                    font-size: 12px;
                    &.car-number {
                        padding-right: 12px;
                    }
                    &.company {
                        padding-left: 12px;
                    }
                    &.order-num {
                        padding-left: 12px;
                    }
                }
            }
            .btn {
                padding: 16px 10px 0 0;
                .van-button--normal {
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    padding: 0;
                }
            }
        }
    }
</style>