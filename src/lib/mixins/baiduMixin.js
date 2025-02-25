export default {
    data() {
        return {
            DB_geolocation: null
        }
    },
    methods: {
        BD_getLocation(callback) {
            let r = this.BD_getLocation_app();
            if (r.state) {
                if (callback) {
                    callback(r);
                }
            }
            else {
                if (callback) {
                    callback(r, new Error('无法定位到您的当前位置'));
                }
            }
        },
        // 设置全局定位方法
        BD_setLoaction_fun() {
            if (!window.setLoaction) {
                window.setLoaction = function (time, lng, lat, address, province, city) {
                    //window.ikey_time = time || '';
                    window.ikey_lng = lng || '';
                    window.ikey_lat = lat || '';
                    // window.ikey_address = address || '';
                    // window.ikey_province = province || '';
                    // window.ikey_city = city || '';
                }
            }
        },
        // 返回定位信息
        BD_getLocation_app() {

            let loc;
            if (!window.ikey_lng || !window.ikey_lat) {
                loc = {
                    state: false
                }; // 是否有定位数据
                return loc;
            }
            else {
                loc = {
                    state: true,
                    // time: window.ikey_time,
                    lng: window.ikey_lng,
                    lat: window.ikey_lat,
                    // address: window.ikey_province,
                    // province: window.ikey_province,
                    // city: window.ikey_city,
                    point: new BMap.Point(window.ikey_lng, window.ikey_lat)
                };

                return loc;
            }
        },

        // 自定义当前位置覆盖物
        BD_now_position_overlay(map, point) {
            let CustomOverlay = function (m, p) {
                this._map = m;
                this._point = p;
            };
            CustomOverlay.prototype = new BMap.Overlay();
            CustomOverlay.prototype.initialize = function () {
                let div = this._div = document.createElement('div');
                div.style.position = "absolute";
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                div.style.backgroundColor = 'rgb(0, 153, 255)';
                div.style.border = "2px solid #FFF";
                div.style.boxShadow = '0 0 1px #999';
                div.style.width = '18px';
                div.style.height = '18px';
                div.style.borderRadius = '50%';
                this._map.getPanes().labelPane.appendChild(div);

                return div;
            };
            CustomOverlay.prototype.draw = function () {
                let map = this._map;
                let pixel = map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x  - 9 + "px";
                this._div.style.top  = pixel.y - 9 + "px";
            };

            let myOverlay = new CustomOverlay(map, point);
            this.map.addOverlay(myOverlay);
            return myOverlay;
        },
        // 司机位置覆盖物
        DB_driver_position_overlay(point) {
            let pt = point;
            let myIcon = new BMap.Icon("/img/map/taxi.png", new BMap.Size(15, 32));
            myIcon.setImageSize(new BMap.Size(15, 32));
            return new BMap.Marker(pt,{icon:myIcon});  // 创建标注
        },

        // 一通卡服务点覆盖物
        DB_card_position_overlay(point) {
            let pt = point;
            let myIcon = new BMap.Icon("/img/map/card-marker.png", new BMap.Size(32, 32));
            myIcon.setImageSize(new BMap.Size(32, 32));

            return new BMap.Marker(pt,{icon:myIcon});  // 创建标注
        },
        // 自行车服务点覆盖物
        DB_bike_position_overlay(point) {
            let pt = point;
            let myIcon = new BMap.Icon("/img/map/bike-marker.png", new BMap.Size(32, 32));
            myIcon.setImageSize(new BMap.Size(32, 32));

            return new BMap.Marker(pt,{icon:myIcon});  // 创建标注
        },


        // 根据坐标点解析地址
        BD_LocalSearch(map, point, callback ) {
            let geocoder = new BMap.Geocoder();
            geocoder.getLocation(point, callback);
        },

        com_timer(time, callback) {
            setTimeout(() => {
                callback()
            }, time);
        },

        // 唤起驾车导航
        BD_driver_baidu(beginLat, beginLng, endLat, endLng, beginAddress, endAddress) {
            let str = `
                ${beginLat},
                ${beginLng},
                ${endLat},
                ${endLng},
                ${beginAddress},
                ${endAddress}`;
            Toaster.postMessage(str);
        }

    }
}