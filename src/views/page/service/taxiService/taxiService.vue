<template>
    <div class="taxiService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="出租车服务" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>

        <div class="page-main" :style="{height: height + 'px'}">
            <div class="baidu" id="baidu_dom"></div>

            <div class="postion-img" v-if="formData.endPoint === null">
                <img src="/img/map/position.png" alt="">
                <div class="text">在这里上车</div>
            </div>

            <div class="where-panel">
                <!--当前或者预约-->
                <!--<div class="btn-switer" @click="serviceType = (serviceType === 'now' ? 'make' : 'now')">-->
                    <!--<span class="now"-->
                          <!--:class="{ active: serviceType === 'now' }">现在</span>-->
                    <!--<span class="make"-->
                          <!--:class="{ active: serviceType === 'make' }">预约</span>-->
                <!--</div>-->
                <div class="current-position" @click="getLocation">
                    <van-icon name="aim"></van-icon>
                </div>

                <div class="form">
                    <van-cell-group>
                        <van-field
                                v-model="formData.startAddress"
                                readonly
                                @click="searchPosition('start')"
                                placeholder="请选择" >
                            <van-icon slot="left-icon" class-prefix="icon iconfont icondian" size="22px" color="#1AD8E2"></van-icon>
                        </van-field>

                        <van-field
                                v-model="formData.endAddress"
                                readonly
                                @click="searchPosition('end')"
                                placeholder="您要去哪儿">
                            <van-icon slot="left-icon" class-prefix="icon iconfont icondian" size="22px" color="#E69B21"></van-icon>
                        </van-field>
                    </van-cell-group>
                </div>
                <div class="where-panel-btn-panel">
                    <van-button type="primary"
                                size="large"
                                color="rgb(26,216,226)"
                                :disabled="disabled"
                                round @click="callTaxi">立即呼叫</van-button>
                </div>
            </div>
        </div>

        <van-popup v-model="search_popup"
                   :overlay="false"
                   position="bottom"
                   style="width: 100%; height: 100%; background-color: transparent;">
            <vSearchPositionBaidu ref="positionSearch"
                                  :placeholder="positionSearch_props.placeholder"
                                  :map="map"
                                  @callback="callbackPosition"
                                  @cancel="search_popup = false"></vSearchPositionBaidu>
        </van-popup>
    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    import baiduMixin from '../../../../lib/mixins/baiduMixin';
    import initBMap from '../../../../lib/baidu/initBMap';
    import vSearchPositionBaidu from './module/searchPositionBaidu/searchPositionBaidu';
    export default {
        name: 'vtaxiService',
        mixins: [comMixin, baiduMixin],
        components: {vSearchPositionBaidu},
        computed: {
            disabled() {
                return !(!!this.formData.startPoint && !!this.formData.endPoint);
            }
        },
        data () {
            return {
                search_popup: false,
                map: null,
                height: 200,
                // 当前位置自定义覆盖物
                myOverlay: null,

                serviceType: 'now', // ['now' | 'make'] 'now': 现在；'make'：预约

                positionSearch_props: {
                    placeholder: ''
                },
                formData: {
                    time: '',
                    startAddress: '当前位置',
                    endAddress: '',
                    startPoint: null,
                    endPoint: null
                },
                setType: 'start',

                // 覆盖物对象
                obj: {
                    startMarker: null,
                    endMarker: null
                },
                // 百度线路对象
                driving_baidu: null
            };
        },
        mounted() {
            let that = this;
            this.height = window.innerHeight - 46;
            this.getOrder();
            // this.BD_setLoaction_fun();
        },
        methods: {
            // 判断是否有正在进行中的出租车订单
            getOrder() {
                this.$http({
                    method: 'get',
                    url: '/taxi/LastTaxiOrderDetail'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        let orderStatusList = ['wait_receive','receive_order', 'in_trip'];
                        if (orderStatusList.indexOf(res.data.orderStatus) > -1) {
                            this.$router.push({
                                name: 'waitingTaxi'
                            });
                        }
                        else {
                            this.initMap();
                        }
                    }
                    else {

                    }
                })
            },
            initMap() {
                let that = this;
                initBMap('baidu_dom').then((map) => {
                    this.map = map;
                    this.map.addEventListener('dragend', function(e) {
                        if (that.formData.endPoint === null) {
                            that.getStart();
                        }
                    });
                    this.getLocation();
                });
            },
            // 解析上车位置
            getStart(p) {
                let that = this;
                let point =  p || this.map.getCenter();
                let geocoder = new BMap.Geocoder();
                geocoder.getLocation(point, function (result) {
                    that.map.panTo(result.point);
                    that.formData.startAddress = result.address;
                    that.formData.startPoint = result.point;
                    // that.setDrivingLine();
                });
            },
            getLocation() {
                // let that = this;
                // let geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(function(r){
                //     if(this.getStatus() === BMAP_STATUS_SUCCESS){
                //         that.map.centerAndZoom(r.point, 15);
                //         that.getStart(r.point);
                //         // that.formData.startPoint = r.point;
                //         // that.formData.startAddress = '当前位置';
                //         if (that.myOverlay) {
                //             that.myOverlay.setPosition(r.point);
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
                let r = this.BD_getLocation_app();
                if (r.state) {
                    this.map.centerAndZoom(r.point, 15);
                    this.getStart(r.point);
                    // that.formData.startPoint = r.point;
                    // that.formData.startAddress = '当前位置';
                    if (this.myOverlay) {
                        this.myOverlay.setPosition(r.point);
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
            // 调用检索组件
            searchPosition(type) {
                // 判断地图是否加载成功
                this.setType = type;
                if (!this.map) { return; }
                if (type === 'start') {
                    this.positionSearch_props.placeholder = '请选择上车位置';
                }
                else {
                    this.positionSearch_props.placeholder = '请输入去哪儿位置';
                }
                this.search_popup = true;
                setTimeout(() => {
                    this.$refs.positionSearch.$refs.search.querySelector('input').focus();
                }, 0)
            },
            // 检索组件回调
            callbackPosition(data) {
                this.search_popup = false;
                if (this.setType === 'start') {
                    this.formData.startAddress = data.title;
                    this.formData.startPoint = data.result.getPoi(data.idx).point
                }
                else if (this.setType === 'end') {
                    this.formData.endAddress = data.title;
                    this.formData.endPoint = data.result.getPoi(data.idx).point
                }

                if (this.formData.startPoint && this.formData.endPoint) {
                    this.map.setViewport([this.formData.startPoint, this.formData.endPoint]);
                    this.setStartMarker();
                    this.setEndMarker();
                    this.myOverlay.hide();
                    // this.setDrivingLine();
                }
            },
            // 呼叫出租车
            callTaxi() {
                let data = {
                    beginAddress: this.formData.startAddress,
                    beginLng: this.formData.startPoint.lng,
                    beginLat: this.formData.startPoint.lat,
                    endAddress: this.formData.endAddress,
                    endLng: this.formData.endPoint.lng,
                    endLat: this.formData.endPoint.lat,
                };
                this.$http({
                    method: 'post',
                    url: '/taxi/submitOrder',
                    data: data
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$router.push({
                            name: 'waitingTaxi'
                        });
                    }
                });

            },
            // 设置上车起点位置
            setStartMarker() {
                if (!this.formData.startPoint) return;
                if (!this.obj.startMarker) {
                    let pt = this.formData.startPoint;
                    let myIcon = new BMap.Icon("/img/map/start-point.png", new BMap.Size(28,34));
                    myIcon.setImageSize(new BMap.Size(28,34));
                    this.obj.startMarker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
                    this.map.addOverlay(this.obj.startMarker);
                }
                else {
                    this.obj.startMarker.setPosition(this.formData.startPoint);
                }
            },
            // 设置终点位置
            setEndMarker() {
                if (!this.formData.endPoint) return;
                if (!this.obj.endMarker) {
                    let pt = this.formData.endPoint;
                    let myIcon = new BMap.Icon("/img/map/end-point.png", new BMap.Size(28,34));
                    myIcon.setImageSize(new BMap.Size(28,34));
                    this.obj.endMarker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
                    this.map.addOverlay(this.obj.endMarker);
                }
                else {
                    this.obj.endMarker.setPosition(this.formData.endPoint);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .taxiService-container {
        .page-main {
            position: relative;
            .baidu {
                height: 100%;
            }

            .postion-img {
                position: absolute;
                z-index: 99;
                top: 50%;
                left: 50%;
                margin-top: -32px;
                margin-left: -10px;
                > img {
                    width: 20px;
                    height: 32px;
                }
                .text {
                    position: absolute;
                    top: -36px;
                    left: -30px;
                    font-size: 12px;
                    line-height: 30px;
                    color: #333;
                    text-align: center;
                    width: 80px;
                    height: 30px;
                    border-radius: 16px;
                    background-color: #FFF;
                    box-shadow: 0 0 2px #999;

                    &:after {
                        position: absolute;
                        display: block;
                        top: 100%;
                        left: 50%;
                        margin-left: -4px;
                        content: " ";
                        width: 0;
                        height: 0;
                        font-size: 0;
                        border-width: 4px 4px 0 4px;
                        border-style: solid;
                        border-color: #FFF transparent;
                        z-index: 1;
                    }
                }
            }

            .where-panel {
                position: absolute;
                left: 10px;
                right: 10px;
                bottom: 10px;
                padding-top: 45px;
                .btn-switer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    overflow: hidden;
                    border-radius: 18px;
                    .now, .make {
                        padding: 8px 20px;
                        color: rgb(153, 153, 153);
                        font-size: 14px;
                        line-height: 36px;
                        background-color: #FFF;

                        &.active {
                            color: #FFF;
                            background-color: #1AD8E2;
                        }
                    }
                }

                .current-position {
                    position: absolute;
                    padding-top: 0.5px;
                    top: 5px;
                    right: 10px;
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    background-color: #FFF;
                    text-align: center;
                    border-radius: 5px;
                    box-shadow: 0 0 5px #dcdcdc;
                    color: #000;
                    .van-icon {
                        padding: 7px 8px;
                        font-size: 16px;
                        font-weight: 700;
                    }
                }

                .where-panel-btn-panel {
                    padding-top: 10px;
                }
            }
        }
    }
</style>