<template>
    <div class="busPosition-container" id="busPosition_container">
        <div class="bus-state">
            <div class="title">等待发车</div>
        </div>
        <div id="bus_position_box_scroll">
            <div class="bus-position-box" style="width: 800px;">
                <div class="bus-position">
                    <div class="bus" style="left: 210px;">
                        <van-icon class-prefix="icon iconfont iconbus"></van-icon>
                    </div>
                    <div class="bus bus-arrive" style="left: 60px;">
                        <van-icon class-prefix="icon iconfont iconbus"></van-icon>
                    </div>
                </div>
                <div class="station-layout">
                    <div class="station-item">
                        <div class="start-icon">
                            <span>起</span>
                        </div>

                        <div class="station-idx">1</div>
                        <div class="station-name">上里站</div>
                    </div>

                    <div class="station-item station-item-active">
                        <div class="station-icon">
                            <van-icon class-prefix="icon iconfont icontongxinyuantu"></van-icon>
                        </div>
                        <div class="station-idx">1</div>
                        <div class="station-name">上里站</div>
                    </div>

                    <div class="station-item">
                        <div class="station-icon">
                            <van-icon class-prefix="icon iconfont iconjiantouarrow484"></van-icon>
                        </div>
                        <div class="station-idx">1</div>
                        <div class="station-name">上里站</div>
                    </div>

                    <div class="station-item">
                        <div class="station-icon">
                            <van-icon class-prefix="icon iconfont iconjiantouarrow484"></van-icon>
                        </div>
                        <div class="station-idx">1</div>
                        <div class="station-name">上里站</div>
                    </div>

                    <div class="station-item">
                        <div class="station-icon">
                            <van-icon class-prefix="icon iconfont iconjiantouarrow484"></van-icon>
                        </div>
                        <div class="station-idx">1</div>
                        <div class="station-name">上里站</div>
                    </div>

                    <div class="station-item">
                        <div class="end-icon">
                            <span>终</span>
                        </div>
                        <div class="station-idx">1</div>
                        <div class="station-name">上里站</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    export default {
        name: 'vBusPosition',  // 公交位置
        props: {
            buslineId: {
                type: String,
                default: ''
            },
            // 方向
            direction: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                scroll: '',
                stationList: [
                    {
                        stationName: '',
                        stationIndex: ''
                    }
                ],

                //
                stationItemStyleAttribute: {
                    width: 60
                },
            };
        },
        mounted() {
            this.scroll = new BScroll('#bus_position_box_scroll',{
                scrollY: false,
                scrollX: true
            })
        }
    }
</script>

<style lang="scss" scoped>
    .busPosition-container {
        width: 100%;
        min-height: 250px;
        overflow: hidden;
        background-color: #FFF;
        .bus-state {
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
            .title {
                text-align: center;
                font-size: 22px;
                color: rgb(240, 176, 41);
            }
        }

        .bus-position-box {
            padding: 0 8px;
            .bus-position {
                position: relative;
                height: 50px;
                .bus {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    .iconfont {
                        font-size: 16px;
                        color: #209ee3;
                    }

                    &.bus-arrive{
                        .iconfont {
                            color: rgb(240, 176, 41);
                        }
                    }
                }
            }
            .station-layout {
                position: relative;
                display: flex;
                &:before {
                    position: absolute;
                    display: block;
                    content: " ";
                    top: 3px;
                    left: 0;
                    right: 0;
                    height: 10px;
                    background-color: rgb(125, 197, 76);
                }
                .station-item {
                    position: relative;
                    top: 0;
                    width: 60px;
                    text-align: center;
                    /*background-color: red;*/

                    .start-icon, .end-icon {
                        width: 14px;
                        height: 14px;
                        text-align: center;
                        color: #FFF;
                        font-size: 12px;
                        line-height: 14px;
                        & > span {
                            padding: 0 3px;
                            border-radius: 2px;
                        }
                    }
                    .start-icon {
                        & > span {
                            background-color: #85b632;
                        }
                    }
                    .end-icon {
                        & > span {
                            background-color: #ed6e94;
                        }
                    }
                    .station-icon{
                        padding: 2px 0;
                        width: 16px;
                        height: 14px;
                        line-height: 12px;
                        /*background-color: #0086b3;*/
                        .iconfont {
                            color: #FFF;
                            font-size: 10px;
                            font-weight: 700;
                        }
                    }
                    .station-idx {
                        padding: 5px 0;
                        font-size: 12px;
                        color: #999;
                        width: 16px;
                    }
                    .station-name {
                        font-size: 16px;
                        width: 16px;
                    }

                    &.station-item-active {
                        .station-icon {
                            padding:0;
                            height: 16px;
                            line-height: 16px;
                            .iconfont {
                                border-radius: 50%;
                                background-color: #FFF;
                                font-size: 16px;
                                color: rgb(240, 176, 41);
                            }
                        }
                        .station-idx, .station-name {
                            font-weight: 700;
                            color: rgb(240, 176, 41);
                        }
                    }
                }
            }
        }
    }
</style>