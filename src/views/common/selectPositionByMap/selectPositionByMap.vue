<template>
    <div class="selectPositionByMap-container">
        <van-sticky :offset-top="0">
            <van-search placeholder="请输入搜索关键词"
                        show-action
                        @cancel="$emit('onBack')"
                        @input="onSearch"
                        v-model="searchParams.value"></van-search>
        </van-sticky>

        <div class="page-body" :style="{height: height + 'px'}">
            <div class="baidu" id="baidu_selectPosition_dom"></div>

            <div class="current-position" @click="getLocation">
                <van-icon name="aim"></van-icon>
            </div>

            <div class="postion-img" v-show="searchResultList.length === 0">
                <img src="/img/map/position.png" alt="">
                <!--<div class="text">在这里上车</div>-->
            </div>

            <div class="searchList" v-show="searchResultList.length > 0">
                <van-cell-group>
                    <template v-for="item in searchResultList">
                        <van-cell :title="item.title"
                                  :key="item.address"
                                  icon="location-o"
                                  :label="item.address"
                                  @click="onSelectCell(item)" ></van-cell>
                    </template>
                </van-cell-group>
            </div>

            <div class="onok-panel" v-show="selected.title !== ''">
                <van-button type="primary"
                            size="large"
                            color="rgb(26,216,226)"
                            round @click="onOk">确 定</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import initBMap from '../../../lib/baidu/initBMap';
    import baiduMixin from '../../../lib/mixins/baiduMixin';
    export default {
        name: 'vselectPositionByMap',
        mixins: [baiduMixin],
        data () {
            let that = this;
            return {
                height: 'auto',
                searchParams: {
                    value: ''
                },
                myOverlay: null,
                marker: null,
                local: null,
                options: {
                    onSearchComplete (results) {
                        // 判断状态是否正确
                        that.searchResultList = [];
                        if (that.local.getStatus() === BMAP_STATUS_SUCCESS) {
                            for (let i = 0; i < results.getCurrentNumPois(); i ++){
                                that.searchResultList.push({
                                    title: results.getPoi(i).title,
                                    address: results.getPoi(i).address,
                                    result: results,
                                    idx: i
                                });

                            }
                        }
                    }
                },
                searchResultList: [

                ],

                selected: {
                    title: '',
                    point: null
                }
            };
        },
        mounted() {
            let that = this;
            this.height = window.innerHeight - 54;
            initBMap('baidu_selectPosition_dom').then((map) => {
                this.map = map;
                this.local = new BMap.LocalSearch(this.map, this.options);
                this.map.addEventListener('dragend', function(e) {
                    that.getStart();
                });
                // this.getLocation();
            });
        },
        methods: {
            getLocation() {
                let that = this;
                let geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() === BMAP_STATUS_SUCCESS){
                        that.map.panTo(r.point);
                        // that.formData.startPoint = r.point;
                        // that.formData.startAddress = '当前位置';
                        if (that.myOverlay) {
                            that.myOverlay.setPosition(r.point);
                        }
                        else {
                            that.myOverlay = that.BD_now_position_overlay(that.map, r.point);
                        }

                        that.getStart();
                    } else {
                       // that.map.removeOverlay(that.myOverlay);
                       // that.myOverlay = null;
                        that.$notify('无法定位到您的当前位置');
                    }
                },{enableHighAccuracy: true, maximumAge: 0});
            },
            // 解析上车位置
            getStart(p) {

                let that = this;
                let point =  p || this.map.getCenter();
                let geocoder = new BMap.Geocoder();
                geocoder.getLocation(point, function (result) {
                    // that.map.panTo(this.selectedItem.result.getPoi(data.idx).point);
                    that.selected.title = result.address;
                    that.selected.point = result.point;
                    that.showMarker();
                    // that.setDrivingLine();
                });
            },
            onSearch() {
                this.local.search(this.searchParams.value);
            },
            // 显示选择的地点
            showMarker() {
                if (this.marker) {
                    this.map.removeOverlay(this.marker.getLabel());
                    let label = new BMap.Label(this.selected.title, {
                        offset: new BMap.Size(this.selected.title.length * -5.5, -26)
                    });
                    this.marker.setLabel(label);
                    this.marker.setPosition(this.selected.point);
                }
                else {
                    let label = new BMap.Label(this.selected.title, {
                        offset: new BMap.Size(this.selected.title.length * -6, -26)
                    });
                    this.marker = new BMap.Marker(this.selected.point);
                    this.marker.setLabel(label);
                    this.map.addOverlay(this.marker);
                }
                this.map.panTo(this.selected.point);
            },
            onSelectCell(item) {
                this.selected.title = item.title;
                this.selected.point = item.result.getPoi(item.idx).point;
                this.showMarker();
                this.searchResultList = [];
            },
            onOk() {
                if (this.marker) {
                    this.map.removeOverlay(this.marker);
                    this.marker = null;
                }
                this.$emit('callback', this.selected);
                this.selected.title = '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .selectPositionByMap-container {
        .page-body {
            position: relative;
            .baidu {
                height: 100%;
            }

            .searchList {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                padding: 10px;
                height: 100%;
                overflow: auto;
                background-color: transparent;
                .page-main-inner {
                    height: 100%;
                    background-color: #FFF;
                    box-shadow: 0 0 3px #ebedf0;
                    overflow-y: auto;
                }
            }

            .current-position {
                position: absolute;
                padding-top: 0.5px;
                bottom: 75px;
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
            }

            .onok-panel {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 10px;
            }
        }
    }
</style>