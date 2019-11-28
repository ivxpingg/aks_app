import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '../store/store';
import Config from '../config';
import { Toast } from 'vant';
Vue.use(Router);

const whiteList = ['/login', '/changePassword'];
// 出租车页面
const taxiPage = ['taxiService', 'waitingTaxi', 'orderDetail'];
const router = new Router({
    base: '/',
    routes,
    mode: 'history'
});

// 判断是否是游客， 如果是游客禁止使用出租车
const isGuest = (to, next) => {
    if (store.getters.userType === 'guest' && taxiPage.indexOf(to.name) !== -1) {
        Toast('请先注册登录！');
        next({
            name: 'login'
        });
    }
    else {
        next();
    }
}

router.beforeEach((to, from, next) => {
    // iView.LoadingBar.start();

    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
    }
    // 判断是否已经获取用户信息
    else if (store.getters.userName === '') {
        store.dispatch('getUserInfo').then((res) => {
            isGuest(to, next);
        }).catch(() => {
            next({
                name: 'login',
                // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        })
    }
    else {
        isGuest(to, next);
        next();
    }
});

router.afterEach(() => {
    // iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;