import MainLayout from '../views/layout/main'
const Login = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
       component: () => import('../views/page/login/login.vue')
    },
    {
        path: '/changePassword',
        name: 'changePassword',
        meta: {
            title: '修改密码'
        },
        component: () => import('../views/page/login/forgetPwd.vue')
    }
];

const Main = [
    {
        path: '/',
        redirect: '/home',
        // alias: '/home',
        meta: {
            title: ''
        },
        component: MainLayout,
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '工作',
                    data: {}
                },
                component: () => import('../views/page/home/home.vue')
            },
            {
                path: 'userCenter',
                name: 'userCenter',
                meta: {
                    title: '个人中心',
                    data: {}
                },
                component: () => import('../views/page/userCenter/userCenter.vue')
            },
        ]
    }
];

// 公交查询
const BusService = [
    {
        path: '/service/busService',
        name: 'busService',
        meta: {
            title: '公交查询'
        },
        component: () => import('../views/page/service/busService/busService.vue')
    },
    {
        path: '/service/busService/lineInfo/:id',
        name: 'lineInfo',
        meta: {
            title: '线路信息'
        },
        component: () => import('../views/page/service/busService/children/lineInfo/lineInfo.vue')
    },
    {
        path: '/service/busService/lineListByStation/:id',
        name: 'lineListByStation',
        meta: {
            title: '线路信息'
        },
        component: () => import('../views/page/service/busService/children/lineListByStation/lineListByStation.vue')
    },
    {
        path: '/service/busService/lineMap/:id',
        name: 'lineMap',
        meta: {
            title: '线路地图'
        },
        component: () => import('../views/page/service/busService/children/lineMap/lineMap.vue')
    },
    {
        path: '/service/busService/whereToGoSearch',
        name: 'whereToGoSearch',
        meta: {
            title: '去哪里查询'
        },
        component: () => import('../views/page/service/busService/children/whereToGoSearch/whereToGoSearch.vue')
    }
];
// 出租车服务
const TaxiService = [
    {
        path: '/service/taxiService',
        name: 'taxiService',
        meta: {
            title: '出租车服务'
        },
        component: () => import('../views/page/service/taxiService/taxiService.vue')
    },
    {
        path: '/service/taxiService/waitingTaxi',
        name: 'waitingTaxi',
        meta: {
            title: '等待接驾'
        },
        component: () => import('../views/page/service/taxiService/children/waitingTaxi/waitingTaxi.vue')
    },
    {
        path: '/service/taxiService/orderDetail/:taxiOrderId',
        name: 'orderDetail',
        meta: {
            title: '订单详情'
        },
        component: () => import('../views/page/service/taxiService/children/orderDetail/orderDetail.vue')
    },
];
// 自行车服务
const BikeService = [
    {
        path: '/service/bikeService',
        name: 'bikeService',
        meta: {
            title: '自行车服务'
        },
        component: () => import('../views/page/service/bikeService/bikeService.vue')
    },
];
// 客车服务
const PassengerService = [
    {
        path: '/service/passengerService',
        name: 'passengerService',
        meta: {
            title: '客车服务'
        },
        component: () => import('../views/page/service/passengerService/passengerService.vue')
    }
];
// 包车服务
const CharteredBusService = [
    {
        path: '/service/charteredBusService',
        name: 'charteredBusService',
        meta: {
            title: '包车服务'
        },
        component: () => import('../views/page/service/charteredBusService/charteredBusService.vue')
    },
    {
        path: '/service/charteredBusService/charteredBusOrderDetail/:id',
        name: 'charteredBusOrderDetail',
        meta: {
            title: '包车订单详情'
        },
        component: () => import('../views/page/service/charteredBusService/children/charteredBusOrderDetail/charteredBusOrderDetail.vue')
    },
];
// 定制公交服务
const CustomizedBusService = [
    {
        path: '/service/customizedBusService',
        name: 'customizedBusService',
        meta: {
            title: '定制公交服务'
        },
        component: () => import('../views/page/service/customizedBusService/customizedBusService.vue')
    },
    {
        path: '/service/customizedBusService/customizedBusMap/:id',
        name: 'customizedBusMap',
        meta: {
            title: '定制公交线路地图'
        },
        component: () => import('../views/page/service/customizedBusService/children/customizedBusMap/customizedBusMap.vue')
    }
];
// 快捷停车服务
const ParkService = [
    {
        path: '/service/parkService',
        name: 'parkService',
        meta: {
            title: '快捷停车'
        },
        component: () => import('../views/page/service/parkService/parkService.vue')
    },
];
// 充电桩服务
const ChargingService = [
    {
        path: '/service/chargingService',
        name: 'chargingService',
        meta: {
            title: '充电桩服务'
        },
        component: () => import('../views/page/service/chargingService/chargingService.vue')
    },
];
// 一卡通服务
const CardService = [
    {
        path: '/service/cardService',
        name: 'cardService',
        meta: {
            title: '一卡通服务'
        },
        component: () => import('../views/page/service/cardService/cardService.vue')
    },
];

// 订单管理
const OrderManage = [
    {
        path: '/order/orderManage/:active',
        name: 'orderManage',
        meta: {
            title: '订单管理'
        },
        component: () => import('../views/page/order/orderManage.vue')
    },
    {
        path: '/order/orderManage/charteredBusPayType/:id',
        name: 'charteredBusPayType',
        meta: {
            title: '包车订单支付'
        },
        component: () => import('../views/page/order/children/charteredBusPayType/payType.vue')
    },
    {
        path: '/order/orderManage/charteredBusInvoice/:id',
        name: 'charteredBusInvoice',
        meta: {
            title: '包车发票申请'
        },
        component: () => import('../views/page/order/children/charteredBusInvoice/invoice.vue')
    }
];
// 其它
const OtherPage = [
    {
        path: '/userCenter/feedback',
        name: 'feedback',
        meta: {
            title: '反馈与建议'
        },
        component: () => import('../views/page/userCenter/children/feedback/feedback.vue')
    },
    {
        path: '/home/noticeListPage',
        name: 'noticeListPage',
        meta: {
            title: '通知公告'
        },
        component: () => import('../views/page/home/children/noticeListPage/noticePage.vue')
    },
    {
        path: '/home/noticeDetail/:id',
        name: 'noticeDetail',
        meta: {
            title: '通知公告详情'
        },
        component: () => import('../views/page/home/children/noticeDetail/noticeDetail.vue')
    },
    {
        path: '/userCenter/messageList',
        name: 'messageList',
        meta: {
            title: '消息通知'
        },
        component: () => import('../views/page/userCenter/children/messageList/messageList.vue')
    }
];

// 出行服务
const Service = [
    ...BusService,
    ...TaxiService,
    ...BikeService,
    ...CharteredBusService,
    ...PassengerService,
    ...CustomizedBusService,
    ...ParkService,
    ...ChargingService,
    ...CardService,
    ...OrderManage,
    ...OtherPage
];

export default [
    ...Login,
    ...Main,
    ...Service
]