<template>
    <div class="userHeader-container">
        <div class="header-info">
            <img src="/img/user/head-img.jpg" alt="">
            <div class="name">{{$store.state.user.userName}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vuserHeader',
        data () {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .userHeader-container {
        position: relative;
        height: 150px;
        overflow: hidden;

        &:before {
            position: absolute;
            display: block;
            content: " ";
            width: 1000px;
            height: 1000px;
            background-color: #1AD8E2;
            border-radius: 50%;
            top: -1000px;
            left: -500px;
            margin-top: 140px;
            margin-left: 50%;
        }

        .header-info {
            position: relative;
            display: flex;
            padding: 26px;
            > img {
                height: 60px;
                width: 60px;
                border-radius: 50%;
            }
            .name {
                padding-left: 10px;
                font-size: 16px;
                color: #FFF;
                line-height: 60px;
                font-weight: 700;
            }
        }
    }
</style>