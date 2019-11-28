<template>
    <div class="bikeStationInfo-container">
        <div class="base-info">
            <div class="btn-walk" @click="$emit('showWalkingLine')">
                <van-icon class-prefix="icon iconfont iconbuxing"></van-icon>
            </div>
            <div class="row-item">
                <img :src="imgUrl" alt="">
                <span class="title-head">{{formData.bikeName}}</span>
            </div>
            <div class="row-item">
                <span class="title">位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置：</span>
                <span class="text">{{formData.address}}</span>
            </div>
            <!--<div class="row-item">-->
                <!--<span class="title">停放数量：</span>-->
                <!--<span class="text text-color1">14</span>-->
            <!--</div>-->
        </div>
        <!--<div class="swipe">-->
            <!--<van-swipe :loop="false" :width="200" :height="120">-->
                <!--<van-swipe-item>-->
                    <!--<img class="img" src="/img/bike/bike-1.jpg" alt="">-->
                <!--</van-swipe-item>-->
                <!--<van-swipe-item>-->
                    <!--<img class="img" src="/img/bike/bike-2.jpg" alt="">-->
                <!--</van-swipe-item>-->
                <!--<van-swipe-item>-->
                    <!--<img class="img" src="/img/bike/bike-3.jpg" alt="">-->
                <!--</van-swipe-item>-->
            <!--</van-swipe>-->
        <!--</div>-->
    </div>
</template>

<script>
    import Config from '../../../../../../config';
    export default {
        name: 'vBikeStationInfo',
        props: {
            bikeId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                formData: {
                    bikeId: '',
                    bikeName: '',
                    // servicePhone: '',
                    address: ''
                },
                imgUrl: '/img/bike/bike-h.jpg'
            };
        },
        watch: {
            bikeId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.getData();
                    }
                }
            }
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/bike/detail',
                    params: {
                        bikeId: this.bikeId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                        this.getImg();
                    }
                })
            },
            getImg() {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: this.bikeId,
                        fileType: 'bike'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS' && res.data.length > 0) {
                        this.imgUrl = Config.filePath + res.data[0].url;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bikeStationInfo-container {
        position: relative;
        padding-bottom: 16px;

        .base-info {
            .btn-walk {
                position: absolute;
                top: 10px;
                right: 10px;
                height: 30px;
                width: 30px;
                background-color: #177bdc;
                border-radius: 50%;
                text-align: center;
                .iconfont {
                    font-size: 20px;
                    color: #FFF
                }
            }
            .row-item {
                padding: 0 16px;
                > img {
                    position: absolute;
                    display: inline-block;
                    top: -30px;
                    left: 16px;
                    width: 60px;
                    height: 60px;
                    border-radius: 5px;
                }

                .title-head {
                    padding-left: 70px;
                    color: #333;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 40px;
                }
                .title {
                    font-size: 12px;
                    color: #333;
                    font-weight: 700;
                }
                .text {
                    font-size: 12px;
                    color: #666;
                    &.text-color1 {
                        color: #209ee3;
                    }
                }
            }
        }
        .swipe {
            padding-top: 10px;
            .van-swipe-item {
                border-radius: 5px;
                overflow: hidden;
            }
            .img {
                width: 200px;
            }
        }
    }
</style>