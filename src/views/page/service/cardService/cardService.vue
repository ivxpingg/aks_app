<template>
    <div class="cardService-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="一卡通服务" @click-left="com_goto('home')"></van-nav-bar>
        </van-sticky>
        <div class="page-body" :style="{height: height + 'px'}">
            <div class="card-info">
                <van-row>
                    <van-col span="12">
                    </van-col>
                    <van-col span="12">
                    </van-col>
                </van-row>
            </div>

            <div class="baidu" id="baidu_card_dom"></div>

            <div class="current-position" @click="getLocation">
               <van-icon name="aim"></van-icon>
            </div>
        </div>

        <van-popup v-model="popup_show"
            position="bottom"
            style="height: 100px; overflow-y: initial;">
            <vPositionInfo @showDrivingLine="showDrivingLine"
                           :cardId="positionInfo_props.cardId"></vPositionInfo>
        </van-popup>
    </div>
</template>

<script>
    import comMixin from '../../../../lib/mixins/comMixin';
    import baiduMixin from '../../../../lib/mixins/baiduMixin';
    import initBMap from '../../../../lib/baidu/initBMap';
    import vPositionInfo from './module/positionInfo/positionInfo';
    export default {
        name: 'vCardService', // 一卡通
        mixins: [comMixin, baiduMixin],
        components: {vPositionInfo},
        data () {
            return {
                popup_show: false,
                map: null,
                height: 200,
                formData: {
                    from: {
                        marker: null,
                        point: null,
                        title: '当前位置',
                        address: ''
                    },
                    to: {
                        marker: null,
                        point: null,
                        title: '',
                        address: ''
                    }
                },
                cardList: [
                    // {
                    //     cardId: '',
                    //     cardName: '',
                    //     lng: '',
                    //     lat: ''
                    // }
                ],

                positionInfo_props: {
                    cardId: '',
                    address: ''
                },

                // 驾车计划
                drivingRoute: {
                    obj: null,
                    duration: '', // 时间
                    distance: '', // 距离
                }
            };
        },
        mounted() {
            this.height = window.innerHeight - 46;
            initBMap('baidu_card_dom').then((map) => {
                this.map = map;
                this.getData();
                this.getLocation();
            });

        },
        methods: {
            getLocation() {
                this.BD_getLocation((result, error) => {
                    if(error) {
                        this.$notify(error.message);
                    }
                    else {
                        this.map.panTo(result.point);
                        this.formData.from.point = result.point;
                        this.formData.from.title = '当前位置';
                        if (this.formData.from.marker) {
                            this.formData.from.marker.setPosition(result.point);
                        }
                        else {
                            // this.formData.from.marker = new BMap.Marker(result.point);
                            this.formData.from.marker = this.BD_now_position_overlay(this.map, result.point);
                            this.map.addOverlay(this.formData.from.marker);
                        }
                    }
                })
            },

            getData() {
                this.$http({
                    method: 'get',
                    url: '/card/list'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.cardList = res.data || [];
                        this.setServerPosition();
                    }
                })
            },
            // 设置一卡通服务点
            setServerPosition() {
                let that = this;
                this.cardList.forEach((item) => {
                    let point = new BMap.Point(item.lng, item.lat);
                    let marker = this.DB_card_position_overlay(point);
                    marker.info = item;
                    marker.addEventListener('click', function () {
                        that.popup_show = true;
                        that.formData.to.point = this.point;
                        that.positionInfo_props.cardId = this.info.cardId;
                        that.positionInfo_props.address = this.info.address;
                    });
                    this.map.addOverlay(marker);
                });
            },
            // 设置驾车线路
            showDrivingLine() {
                if (!this.formData.from.point || !this.formData.to.point) return;

                this.BD_driver_baidu(
                    this.formData.from.point.lat,
                    this.formData.from.point.lng,
                    this.formData.to.point.lat,
                    this.formData.to.point.lng,
                    this.formData.from.title,
                    this.positionInfo_props.address
                );

                // let that = this;
                // if (!this.formData.from.point || !this.formData.to.point) return;
                //
                // if (!this.drivingRoute.obj) {
                //     this.drivingRoute.obj = new BMap.DrivingRoute(this.map, {
                //         renderOptions: {
                //             map: this.map,
                //             autoViewport: true
                //         },
                //         onSearchComplete: function(results) {
                //             if (that.drivingRoute.obj.getStatus() !== BMAP_STATUS_SUCCESS) {
                //                 return;
                //             }
                //             let plan = results.getPlan(0);
                //             that.drivingRoute.duration = plan.getDuration(true);
                //             that.drivingRoute.distance = plan.getDistance(true);
                //
                //         }
                //     });
                // }
                // else {
                //     this.drivingRoute.obj.clearResults();
                // }
                // this.drivingRoute.obj.search(this.formData.from.point, this.formData.to.point);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .cardService-container {
        .page-body {
            position: relative;
            .card-info {
                position: absolute;
                padding: 0 20px;
                top: 0;
                left: 0;
                right: 0;
                z-index: 99;
                background-color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                text-align: center;
                line-height: 40px;
            }
            .baidu {
                height: 100%;
            }
            .current-position {
                position: fixed;
                padding-top: 0.5px;
                bottom: 20px;
                left: 10px;
                width: 32px;
                height: 32px;
                line-height: 32px;
                background-color: #FFF;
                text-align: center;
                border-radius: 5px;
                box-shadow: 0 0 5px #dcdcdc;

                .van-icon {
                    padding: 7px 8px;
                    font-size: 16px;
                    font-weight: 700;
                }
            }
        }
    }
</style>