<template>
    <div class="main-container">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <router-view class="main-body" />
            <van-tabbar v-model="active"
                        active-color="rgb(26,216,226)"
                        @change="changeTab">
                <van-tabbar-item name="home">
                    出行服务
                    <van-icon slot="icon" :name="serviceIcon" />
                </van-tabbar-item>

                <van-tabbar-item name="userCenter">
                    <van-icon slot="icon" :name="personIcon" />
                    个人中心
                </van-tabbar-item>
            </van-tabbar>
        </van-pull-refresh>
    </div>
</template>

<script>
    export default {
        name: 'Main',
        computed: {
            serviceIcon() {
                return this.active === 'home' ? 'wap-home' : 'wap-home-o';
            },
            personIcon() {
                return this.active === 'userCenter' ? 'manager' : 'manager-o';
            }
        },
        data () {
            return {
                active: 'home',
                isLoading: false
            };
        },
        mounted() {
            this.active = this.$route.name;
        },
        methods: {
            changeTab(name) {
                this.$router.push({name})
            },
            onRefresh() {
                window.location.href = window.location.origin + '/home?t=' + Math.random();
                this.isLoading = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        .main-body {
            padding-bottom: 50px;

        }
    }
</style>
<style lang="scss">
    .main-container {
        .main-body {
        }
    }
</style>