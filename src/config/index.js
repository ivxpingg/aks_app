const PROJECT_NAME = '/aks';
const ORIGIN = window.location.origin;
const ENV = process.env.NODE_ENV;
export default {
    env: ENV,
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    passwordKey: '9nQIpFft2tjudUXIaw23msqyFRI3gtbM',
    cookieExpires: 9999,
    tokenKey: 'ikey_traffic_trip',
    origin: ORIGIN,
    ajaxUrl: PROJECT_NAME,
    filePath: window.location.origin + PROJECT_NAME,

    // 公交查询地址
    busSearchUrl: "http://124.88.217.239:8001/intelligentbus/index/search.htm?t=" + Math.random()
    // busSearchUrl: "http://110.86.21.246:8887/intelligentbus/index/search.htm?t=" + Math.random()
}