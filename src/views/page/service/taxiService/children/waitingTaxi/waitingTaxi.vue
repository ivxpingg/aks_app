<template>
    <div class="waitingTaxi-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         :title="title"

                         :left-arrow="true"
                         right-text="取消行程"
                         @click-left="com_goto('home')"
                         @click-right="cancelTaxi">

            </van-nav-bar>
        </van-sticky>

        <div class="page-main" :style="{height: height + 'px'}">
            <div class="baidu" id="baidu_dom_waitingTaxi"></div>

            <div class="info-panel">
                <div class="driver-info-box" v-if="!isWait_receive">
                    <div class="driver-head">
                        <img src="/img/taxi/driver-man.png" alt="">
                    </div>
                    <div class="driver-info">
                        <div class="name"> {{driverInfo.name}}</div>
                        <div>
                            <span class="text car-number">
                                {{driverInfo.licensePlate}}
                            </span>
                            <span class="text company">
                                 {{driverInfo.companyName}}
                            </span>
                        </div>
                        <div class="estimate">
                            <van-rate v-model="driverInfo.starNum" size="8px"></van-rate>
                             <span class="text order-num">  {{driverInfo.orderNum}}单 </span>
                        </div>
                    </div>
                    <div class="btn">
                        <van-button :url="driverInfo.phone"
                                    plain
                                    round
                                    icon="phone"
                                    sizd="mini"
                                    type="primary">
                        </van-button>
                    </div>
                </div>
                <div class="taxi-message">
                    <span v-if="isWait_receive">等待司机接单，请稍后...</span>
                    <span v-if="isReceive_order">司机距离接送点{{drivingRouteInfo.distance}}， 预计{{drivingRouteInfo.duration}}后到达，请稍后...</span>
                    <span v-if="isIn_trip && drivingRouteInfo.duration">预计{{drivingRouteInfo.duration}}后到达目的地</span>
                </div>
            </div>

            <div class="btn-panel">

            </div>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../../lib/mixins/comMixin';
    import baiduMixin from '../../../../../../lib/mixins/baiduMixin';
    import initBMap from '../../../../../../lib/baidu/initBMap';
    export default {
        name: 'vwaitingTaxi',
        mixins: [comMixin, baiduMixin],
        computed: {
            title() {
                return this.orderData.orderStatus === 'wait_receive' ? '等待接单' : '等待接驾';
            },
            // 是否的待接单状态
            isWait_receive() {
                return this.orderData.orderStatus === 'wait_receive';
            },
            // 是否是已接单状态
            isReceive_order() {
                 return this.orderData.orderStatus === 'receive_order';
            },
            // 是否是在行程中
            isIn_trip() {
                return this.orderData.orderStatus === 'in_trip';
            }
        },
        beforeDestroy() {
            if (this.timerForOrder) {
                clearTimeout(this.timerForOrder);
            }
            if (this.timerForDriver) {
                clearTimeout(this.timerForDriver);
            }
        },
        data () {
            return {
                map: null,
                height: 200,
                geolocation: null,
                // 乘客位置覆盖物对象
                myOverlay: null,
                driverOverlay: null, // 司机位置覆盖物对象
                // 订单信息
                orderData: {
                    taxiOrderId: '',
                    taxiDriverId: '',
                    orderStatus: '',
                    beginAddress: '',
                    beginLng: null,
                    beginLat: null,
                    endAddress: '',
                    endLng: null,
                    endLat: null,
                },
                // 司机信息
                driverInfo: {
                    licensePlate: '',
                    name: '',
                    orderNum: 0,
                    phone: '',
                    starNum: 0,
                    companyName: ''
                },
                // 驾车线路
                drivingRoute: null,
                drivingRoute2: null,  // 用于获取司机与乘客之间的驾车时间和距离
                // 驾车线路的信息
                drivingRouteInfo: {
                    duration: '',  // 时间
                    distance: '',  // 距离
                    distanceNum: 0 // 距离数值/米
                },

                // 获取订单定时器
                timerForOrder: null,
                // 获取司机位置定时器
                timerForDriver: null
            };
        },
        mounted() {
            this.height = window.innerHeight - 46;
            initBMap('baidu_dom_waitingTaxi').then((map) => {
                this.map = map;
                this.getLocation();
                this.getOrder();

                //
            });
        },
        watch: {
            'orderData.taxiDriverId'(val) {
                if (val) {
                    this.getDriverPosition();
                    this.getDriverInfo();
                }
            }
        },
        methods: {
            // 取消行程
            cancelTaxi() {
                this.$dialog.confirm({
                    title: '提示',
                    message: '确认取消行程'
               }).then(() => {
                        this.$http({
                            method: 'get',
                            url: '/taxi/cancelOrder',
                            params: {
                                taxiOrderId: this.orderData.taxiOrderId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$router.push({
                                    name: 'taxiService'
                                });
                            }
                            else {

                            }
                        });

                }).catch(() => {

                });
            },
            // 定位
            getLocation() {
                let that = this;
                // if (!this.geolocation) {
                //     this.geolocation = new BMap.Geolocation();
                // }
                // this.geolocation.getCurrentPosition(function(r){
                //     that.com_timer(5000, that.getLocation);
                //     if(this.getStatus() === BMAP_STATUS_SUCCESS){
                //         if (that.myOverlay) {
                //             that.myOverlay._point = r.point;
                //             that.myOverlay.draw();
                //             // that.myOverlay.setPosition(p);
                //         }
                //         else {
                //             that.myOverlay = that.BD_now_position_overlay(that.map, r.point);
                //         }
                //     } else {
                //         that.map.removeOverlay(that.myOverlay);
                //         that.myOverlay = null;
                //         that.$notify('无法定位到您的当前位置');
                //     }
                // },{enableHighAccuracy: true, maximumAge: 0});

                this.com_timer(5000, this.getLocation);
                let r = this.BD_getLocation_app();
                if (r.state) {
                    if (this.myOverlay) {
                        this.myOverlay._point = r.point;
                        this.myOverlay.draw();
                        // that.myOverlay.setPosition(p);
                    }
                    else {
                        this.myOverlay = this.BD_now_position_overlay(this.map, r.point);
                    }
                }
                else {
                    this.map.removeOverlay(this.myOverlay);
                    this.myOverlay = null;
                    this.$notify('无法定位到您的当前位置');
                }
            },

            // 获取执行的订单详情
            getOrder() {
                this.$http({
                    method: 'get',
                    url: '/taxi/LastTaxiOrderDetail'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.orderData, res.data);
                        // 如果订单进入待付款之后的状态就跳转到订单详情页面
                        if (['end_trip', 'wait_pay', 'pay', 'complete', 'cancel'].indexOf(res.data.orderStatus) > -1 ) {
                            this.$router.push({
                                name: 'orderDetail',
                                params: {
                                    taxiOrderId: res.data.taxiOrderId
                                }
                            });
                        }

                        // 如果订单状态是 待接单、已接单、行程中 就继续获取更新订单信息
                        if (['wait_receive', 'receive_order', 'in_trip'].indexOf(res.data.orderStatus) > -1 ) {
                            // 设置定时器获取订单，订单状态是 已接单 或者 行程中，5秒获取一次订单信息
                            this.com_timer(5000, this.getOrder);
                        }
                        if (!this.drivingRoute) {
                            this.setDrivingLine();
                        }

                        // 测试调用
                        // this.getDriverPosition();
                    }
                    else {

                    }
                })
            },
            // 获取司机信息, 获取订单详情后，判断已接单后调用
            getDriverInfo() {
                this.$http({
                    method: 'get',
                    url: '/taxi/driverInfo',
                    params: {
                        taxiOrderId: this.orderData.taxiOrderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.driverInfo, res.data);
                    }
                    else {

                    }
                })
            },
            // 设置驾车线路, 首次获取订单详情后执行，只执行一次
            setDrivingLine() {
                if (!this.drivingRoute) {
                    this.drivingRoute = new BMap.DrivingRoute(this.map, {
                        renderOptions: {
                            map: this.map,
                            autoViewport: true
                        }
                    });
                }
                else {
                    this.drivingRoute.clearResults();
                }
                let startPoint = new BMap.Point(this.orderData.beginLng, this.orderData.beginLat);
                let endPoint = new BMap.Point(this.orderData.endLng, this.orderData.endLat);
                this.drivingRoute.search(startPoint, endPoint);
            },

            // 获取司机位置， 订单状态必须是已接单或行程中的状态。
            getDriverPosition() {
                this.$http({
                    method: 'get',
                    url: '/taxi/driverPosition',
                    params: {
                        taxiDriverId: this.orderData.taxiDriverId
                    }
                }).then((res) => {
                    this.com_timer(5000, this.getDriverPosition);
                    if (res.code === 'SUCCESS') {
                        let driverPoint = new BMap.Point(res.data.lng, res.data.lat);
                        this.setDriverPosition(driverPoint);
                        this.getDrivingRouteInfo(driverPoint);
                    }
                    else {

                    }
                })
            },
            // 设置司机地图位置， 订单状态必须是已接单或行程中的状态。
            setDriverPosition(driverPoint) {
                if (!this.driverOverlay) {
                    this.driverOverlay = this.DB_driver_position_overlay(driverPoint);
                    this.map.addOverlay(this.driverOverlay)
                }
                else {
                    this.driverOverlay.setPosition(driverPoint);
                }
            },
            // 获取司机线路预计到达时间和距离， 订单状态必须是已接单或行程中的状态。
            getDrivingRouteInfo(driverPoint) {
                let that = this;
                if (!this.drivingRoute2) {
                    this.drivingRoute2 = new BMap.DrivingRoute(this.map, {
                        onSearchComplete: function (drivingRouteResult) {
                            if (drivingRouteResult.getNumPlans() > 0) {
                                that.drivingRouteInfo.distance = drivingRouteResult.getPlan(0).getDistance();
                                that.drivingRouteInfo.duration = drivingRouteResult.getPlan(0).getDuration();
                                that.drivingRouteInfo.distanceNum = drivingRouteResult.getPlan(0).getDistance(false);
                            }
                        }
                    });
                }
                let startPoint = driverPoint;
                let endPoint;
                if (this.isReceive_order) {
                    endPoint = new BMap.Point(this.orderData.beginLng, this.orderData.beginLat);
                }
                if (this.isIn_trip) {
                    endPoint = new BMap.Point(this.orderData.endLng, this.orderData.endLat);
                }

                this.drivingRoute2.search(startPoint, endPoint);
            }

        }
    }
</script>

<style lang="scss" scoped>
    .waitingTaxi-container {
        .page-main {
            position: relative;
            .baidu {
                height: 100%;
            }
            .info-panel {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
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
                            font-size: 11px;
                            &.car-number {
                                padding-right: 10px;
                            }
                            &.company {
                                padding-left: 10px;
                            }
                            &.order-num {
                                padding-left: 10px;
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

                .taxi-message {
                    padding: 0 10px;
                    height: 36px;
                    line-height: 36px;
                    color: #FFF;
                    text-align: center;
                    background-color: rgba(0, 0, 0, 0.3);
                }
            }
        }
    }
</style>