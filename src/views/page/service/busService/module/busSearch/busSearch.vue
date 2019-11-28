<template>
    <div class="busSearch-container">
        <van-sticky :offset-top="0">
            <van-search ref="search"
                        v-model="searchParams.value"
                        show-action
                        shape="round"
                        placeholder="您可以查询线路、换乘、站点..."
                        @click="onSearch"
                        @cancel="$emit('cancel')">
            </van-search>
        </van-sticky>

        <!--检索结果列表-->
        <div class="page-body">
            <div class="result-list">
                <van-cell-group>
                    <van-cell v-for="(item, idx) in listData"
                              @click="onClickItem(item)"
                              :key="idx">
                        <template v-if="item.type === 'line'">
                            <van-icon class="cell-icon" slot="icon" class-prefix="icon iconfont icongongjiao" />
                            <span slot="title">
                                <span>{{item.title}} </span>
                                方向
                                <span> {{item.direction || ''}}</span>
                            </span>

                        </template>

                        <template v-if="item.type === 'station'">
                            <van-icon class="cell-icon" slot="icon" class-prefix="icon iconfont icongongjiaozhan" />
                            <span slot="title">{{item.title}}</span>
                        </template>


                    </van-cell>
                </van-cell-group>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vbusSearch',
        data () {
            return {
                searchParams: {
                    value: ''
                },
                titleStyle: {},
                listData: [
                    {
                        type: 'line',
                        title: '2路',
                        direction: '第一码头站'
                    },
                    {
                        type: 'line',
                        title: '2路',
                        direction: '第一码头站'
                    },
                    {
                        type: 'line',
                        title: '2路',
                        direction: '第一码头站'
                    },
                    {
                        type: 'station',
                        title: '同名路2站'
                    },
                ]
            };
        },
        methods: {
            onSearch() {},
            onClickItem(item) {
                this.$router.push({
                    name: 'lineInfo',
                    params: {
                        id: '123'
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .busSearch-container {
        .result-panel {
            .cell-icon {
                color: rgba(69, 90, 100, 0.6)
            }
            .van-cell__title {
                padding-left: 5px;
            }
        }
    }
</style>