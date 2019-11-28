<template>
    <div class="steps-container">
        <van-steps :active="5">
            <van-step>填写需求 <van-icon slot="inactive-icon" name="edit" size="22px"/></van-step>
            <van-step>客服联系 <van-icon slot="inactive-icon" name="phone-o" size="22px" /></van-step>
            <van-step>确认报价 <van-icon slot="inactive-icon" name="certificate" size="22px" /></van-step>
            <van-step>支付订单 <van-icon slot="inactive-icon" name="credit-pay" size="22px" /></van-step>
            <van-step>派车出行 <van-icon slot="inactive-icon" name="logistics" size="22px" /></van-step>
        </van-steps>
    </div>
</template>

<script>
    export default {
        name: 'vsteps',
        data () {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .steps-container {
        margin: 10px;
        border-radius: 5px;
        overflow: hidden;
    }
</style>
<style lang="scss">
    .steps-container {
        .van-step--horizontal .van-step__circle-container {
            top: 40px;
        }
        .van-step--horizontal .van-step__line {
            top: 40px;
        }

        .van-icon {
            color: #07c160;
        }
    }
</style>