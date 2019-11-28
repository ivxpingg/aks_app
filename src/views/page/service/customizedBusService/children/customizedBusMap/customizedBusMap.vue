<template>
    <div class="customizedBusMap-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         :title="formData.lineName" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body" :style="{height: height + 'px'}">
            <div class="baidu" id="baidu_customizedBusMap_dom"></div>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../../lib/mixins/comMixin';
    import initBMap from '../../../../../../lib/baidu/initBMap';
    export default {
        name: 'vcustomizedBusMap',
        mixins: [comMixin],
        data () {
            return {
                map: null,
                height: 200,
                customBusId: '',
                formData: {
                    lineName: ''
                },
                lineStations: []
            };
        },
        mounted() {
            this.height = window.innerHeight - 46;
            this.customBusId = this.$route.params.id;
            initBMap('baidu_customizedBusMap_dom').then((map) => {
                this.map = map;
                this.getData();
                this.getLine();
            });
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/customBus/customBusDetail',
                    params: {
                        customBusId: this.customBusId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                    }
                    else {}
                })
            },
            getLine() {
                this.$http({
                    method: 'get',
                    url: '/customBus/stationList',
                    params: {
                        customBusId: this.customBusId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.lineStations = res.data;
                        this.setAllStationPosition();
                        this.drawLine();
                    }
                    else {}
                })
            },
            // 在地图显示站点
            setAllStationPosition() {
                if (this.lineStations.length > 0) {
                    setTimeout(() => {
                        this.map.panTo(new BMap.Point(this.lineStations[0].lng, this.lineStations[0].lat));
                    }, 1000);
                }

                this.lineStations.forEach((item) => {
                    let point = new BMap.Point(item.lng, item.lat);
                    let marker = new BMap.Marker(point, {
                        title: item.stationName
                    });

                    let label = new BMap.Label(item.stationName, {
                        offset: new BMap.Size(-item.stationName.length * 5 - 5,  -20)
                    });
                    label.setStyle({
                        padding: '0 5px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: 'transparent',
                        color: '#666',
                        border: 'none',
                        textShadow: '0 0 3px #999',
                        borderRadius: '3px'
                    });
                    marker.setLabel(label);
                    marker.info = item;
                    marker.setLabel(

                    );
                    this.map.addOverlay(marker);
                })
            },
            // 绘制站点线路
            drawLine() {
                let points = this.lineStations.map(item => new BMap.Point(item.lng, item.lat));

                if (points.length > 0) {
                    if (this.polyline) {
                        this.map.removeOverlay(this.polyline);
                    }
                    this.polyline = new BMap.Polyline(points, {
                        strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
                    this.map.addOverlay(this.polyline);
                }
                else {
                    if (this.polyline) {
                        this.polyline = null;
                        this.map.removeOverlay(this.polyline);
                    }
                }

            },

        }
    }
</script>

<style lang="scss" scoped>
    .customizedBusMap-container {
        .page-body {
            position: relative;
            .baidu {
                height: 100%;
            }
        }
    }
</style>