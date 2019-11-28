<template>
    <div class="servicePanel-container">
        <div class="body">
            <div class="header">
                <div class="title">出行服务</div>
            </div>

            <div class="service-list">
                <van-row gutter="4">
                    <van-col span="8">
                        <div class="service-box-1" @click="gotoBusSearch">
                            <div class="left-panel">
                                <div class="title">公交查询</div>
                                <div class="title-sub">实时公交</div>
                            </div>
                            <div class="right-panel">
                                <van-icon class-prefix="icon iconfont icongongjiao"></van-icon>
                            </div>
                        </div>
                    </van-col>
                    <van-col span="8">
                        <div class="service-box-1" @click="com_goto('taxiService')">
                            <div class="left-panel">
                                <div class="title">出租车</div>
                                <div class="title-sub">一键打车</div>
                            </div>
                            <div class="right-panel">
                                <van-icon class-prefix="icon iconfont icontaxi"></van-icon>
                            </div>
                        </div>
                    </van-col>
                    <van-col span="8">
                        <div class="service-box-1" @click="com_goto('bikeService')">
                            <div class="left-panel">
                                <div class="title">自行车</div>
                                <div class="title-sub">绿色出行</div>
                            </div>
                            <div class="right-panel">
                                <van-icon class-prefix="icon iconfont iconft-bike" size="28px"></van-icon>
                            </div>
                        </div>
                    </van-col>
                </van-row>

                <van-row style="margin-top: 10px;">
                    <van-col span="4">
                        <div class="service-box-2" @click="com_goto('passengerService')">
                            <div class="icon-box">
                                <van-icon slot="icon"
                                          size="28px"
                                          class-prefix="icon iconfont iconkeche">
                                </van-icon>
                            </div>
                            <div class="text">客车查询</div>
                        </div>
                    </van-col>
                    <van-col span="4">
                        <div class="service-box-2" @click="com_goto('charteredBusService')">
                            <div class="icon-box">
                                <van-icon slot="icon"
                                          size="28px"
                                          class-prefix="icon iconfont iconlvyoubaochedingdan">
                                </van-icon>
                            </div>
                            <div class="text">定制包车</div>
                        </div>
                    </van-col>
                    <van-col span="4">
                        <div class="service-box-2" @click="com_goto('customizedBusService')">
                            <div class="icon-box">
                                <van-icon slot="icon"
                                          size="28px"
                                          class-prefix="icon iconfont icongongjiao">
                                </van-icon>
                            </div>
                            <div class="text">定制公交</div>
                        </div>
                    </van-col>
                    <van-col span="4">
                        <div class="service-box-2" @click="com_goto('parkService')">
                            <div class="icon-box">
                                <van-icon slot="icon"
                                          size="28px"
                                          class-prefix="icon iconfont icontingchechang">
                                </van-icon>
                            </div>
                            <div class="text">快捷停车</div>
                        </div>
                    </van-col>
                    <van-col span="4">
                        <div class="service-box-2" @click="com_goto('chargingService')">
                            <div class="icon-box">
                                <van-icon slot="icon"
                                          size="28px"
                                          class-prefix="icon iconfont iconchongdianzhuang1">
                                </van-icon>
                            </div>
                            <div class="text">充电桩</div>
                        </div>
                    </van-col>
                    <van-col span="4">
                        <div class="service-box-2" @click="com_goto('cardService')">
                            <div class="icon-box">
                                <van-icon slot="icon"
                                          size="28px"
                                          class-prefix="icon iconfont iconcardb">
                                </van-icon>
                            </div>
                            <div class="text">一卡通</div>
                        </div>
                    </van-col>
                </van-row>
            </div>

        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixins/comMixin';
    import Config from '../../../../../config';
    export default {
        name: 'vservicePanel',
        mixins: [comMixin],
        data () {
            return {};
        },
        methods: {
            gotoBusSearch() {
                window.location.href = Config.busSearchUrl;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .servicePanel-container {
        .body {
            .header {
                display: flex;
                padding: 0 16px;
                background-color: #FFF;
                line-height: 40px;
                .title {
                    flex: 1;
                    font-size: 16px;
                    font-weight: 700;
                }
            }

            .service-list {
                background-color: #FFF;
                padding: 0 5px 20px;
                .service-box-1 {
                    display: flex;
                    height:69px;
                    background:linear-gradient(251deg,rgba(163,247,230,1) 0%,rgba(163,247,230,1) 36%,rgba(137,247,203,1) 100%);
                    border-radius: 5px;
                    .left-panel {
                        flex: 1;
                        padding: 10px 0 0 4px;
                        color: #FFF;
                        text-align: center;
                        .title {
                            font-size: 14px;
                            line-height: 26px;
                        }
                        .title-sub {
                            font-size: 12px;
                            line-height: 1.5;
                        }

                    }
                    .right-panel {
                        padding: 10px 5px;
                        .iconfont {
                            color: #FFF;
                            font-size: 24px;
                        }
                    }
                }

                .service-box-2 {
                    text-align: center;
                    .icon-box {
                        margin: 0 auto;
                        width:52px;
                        height:50px;
                        line-height: 50px;
                        background:linear-gradient(180deg,rgba(123,205,244,1) 0%,rgba(155,222,250,1) 100%);
                        border-radius: 5px;
                        .iconfont {
                            color: #FFF;
                            font-size: 24px;
                        }
                    }
                    .text {
                        color: #999;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>