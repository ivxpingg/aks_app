<template>
    <div class="positionInfo-container">
        <div class="base-info">
            <div class="btn-walk" @click="$emit('showDrivingLine')">
                <van-icon class-prefix="icon iconfont iconbuxing"></van-icon>
            </div>
            <div class="row-item">
                <img :src="imgUrl" alt="">
                <span class="title-head"> {{formData.chargePileName}}</span>
            </div>
            <div class="row-item">
                <span class="title">位 置：</span>
                <span class="text">{{formData.address}}</span>
            </div>
            <div class="row-item">
                <span class="title">电 话：</span>
                <span class="text text-color1">
                    {{formData.servicePhone}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import Config from '../../../../../../config';
    export default {
        name: 'vpositionInfo',  // 充电桩位置信息
        props: {
            chargePileId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                formData: {
                    chargePileId: '',
                    chargePileName: '',
                    // servicePhone: '',
                    address: ''
                },
                imgUrl: '/img/chargePile/head.jpg'
            };
        },
        watch: {
            chargePileId: {
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
                    url: '/chargePile/detail',
                    params: {
                        chargePileId: this.chargePileId
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
                        relationId: this.chargePileId,
                        fileType: 'card'
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
    .positionInfo-container {
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
    }
</style>