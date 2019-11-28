<template>
    <div class="positionInfo-container">
        <div class="base-info">
            <div class="btn-walk" @click="$emit('showDrivingLine')">
                <van-icon class-prefix="icon iconfont iconbuxing"></van-icon>
            </div>
            <!--<div class="btn-walk" >-->
                <!--<a href="http://api.map.baidu.com/marker?location=40.047669,116.313082&title=我的位置&content=百度奎科大厦&output=html&src=webapp.baidu.openAPIdemo ">-->
                    <!--<van-icon class-prefix="icon iconfont iconbuxing"></van-icon>-->
                <!--</a>-->
            <!--</div>-->

            <div class="row-item">
                <img :src="imgUrl" alt="">
                <span class="title-head"> {{formData.cardName}}</span>
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
    import {isIosOrAndroid} from '../../../../../../lib/tools';
    export default {
        name: 'vpositionInfo',
        props: {
            cardId: {
                type: String,
                default: ''
            }
        },
        computed: {
            url() {

                if (this.phoneType === 'android') {
                    return `bdapp://map/navi?location=${this.formData.lat},${this.formData.lng}&coord_type=bd09ll&type=BLK&src=ios.ivxpingg.openAPI.aks`;
                }
                else if (this.phoneType === 'ios') {
                    return `baidumap://map/navi?location=${this.formData.lat},${this.formData.lng}&coord_type=bd09ll&type=BLK&src=ios.ivxpingg.openAPI.aks`;
                }
                else {
                    return '';
                }
            }
        },
        data () {
            return {
                phoneType: isIosOrAndroid(),
                formData: {
                    cardId: '',
                    cardName: '',
                    servicePhone: '',
                    address: '',
                    lat: 0,
                    lng: 0
                },
                imgUrl: '#'
            };
        },
        watch: {
            cardId: {
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
                    url: '/card/detail',
                    params: {
                        cardId: this.cardId
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
                        relationId: this.cardId,
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