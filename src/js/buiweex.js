/**
 * 框架中常用的工具方法
 */
const modal = weex.requireModule('modal');
const animation = weex.requireModule('animation');
const navigator = weex.requireModule('navigator');
const navigatorEx = weex.requireModule("NavigatorExModule");
const stream = weex.requireModule('stream');

let buiweex = {
    //components下的组件
    buiActionSheet: require("../components/bui-actionsheet.vue"),
    buiButton: require("../components/bui-button.vue"),
    buiCheckbox: require("../components/bui-checkbox.vue"),
    buiCheckboxList: require("../components/bui-checkbox-list.vue"),
    buiDialog: require("../components/bui-dialog.vue"),
    buiDropdown: require("../components/bui-dropdown.vue"),
    buiHeader: require("../components/bui-header.vue"),
    buiIcon: require("../components/bui-icon.vue"),
    buiImage: require("../components/bui-image.vue"),
    buiLazyRender: require("../components/bui-lazy-render.vue"),
    buiLoad: require("../components/bui-load.vue"),
    buiMask: require("../components/bui-mask.vue"),
    buiPanel: require("../components/bui-panel.vue"),
    buiRadio: require("../components/bui-radio.vue"),
    buiRadioList: require("../components/bui-radio-list.vue"),
    buiSearchbarCenter: require("../components/bui-searchbar-center.vue"),
    buiSearchbarLeft: require("../components/bui-searchbar-left.vue"),
    buiSwitch: require("../components/bui-switch.vue"),
    buiTabbar: require("../components/bui-tabbar.vue"),
    buiTip: require("../components/bui-tip.vue"),
    buiVideo: require("../components/bui-video.vue"),
    buiContent: require("../components/bui-content.vue"),
    buiContentScroll: require("../components/bui-content-scroll.vue"),
    buiImageSlider: require("../components/bui-image-slider.vue"),
    buiCell: require("../components/bui-cell.vue"),
    buiPopup: require("../components/bui-popup.vue"),
    buiNumberInput: require("../components/bui-number-input.vue"),
    buiRichcell: require("../components/bui-richcell.vue"),
    buiPopupShow: require("../components/bui-popupshow.vue"),
    /**
     * 吐司信息
     * @param msg {string} 提示文本
     */
    toast(msg) {
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        modal.toast({
            message: msg || "",
            duration: 1
        });
    },

    /**
     * 弹出警告
     * @param msg {string} 提示文本
     * @param callback {function} 点击确定后回调函数
     * @param option {object} 参数
     * @param option.okTitle {string} 确定按钮文本
     */
    alert(msg, callback, option) {
        let okTitle = "确定";
        if (option) {
            if (option.okTitle)
                okTitle = option.okTitle;
        }
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        modal.alert({
            message: msg || "",
            duration: 1,
            okTitle: okTitle
        }, value => {
            callback && callback(value);
        });
    },

    /**
     * 弹出确认框
     * @param msg {string} 提示文本
     * @param callback {function} 点击确定/取消后回调函数
     * @param option {object} 参数
     * @param option.okTitle {string} 确定按钮文本
     * @param option.cancelTitle {string} 取消按钮文本
     */
    confirm(msg, callback, option) {
        let okTitle = "确定", cancelTitle = "取消";
        if (option) {
            if (option.okTitle)
                okTitle = option.okTitle;
            if (option.cancelTitle)
                cancelTitle = option.cancelTitle;
        }
        modal.confirm({
            message: msg || "",
            duration: 0.4,
            okTitle: okTitle,
            cancelTitle: cancelTitle,
        }, value => {
            callback && callback(value);
        });
    },

    /**
     * 显示一个组件（可设置动画）
     * @param params
     * @param callback
     */
    show(params, callback) {
        let el = params.id;
        if (!el) {
            return;
        }
        let duration = params.duration;
        let transform = params.transform || 'translate(0, 0)';
        let transformOrigin = params.transformOrigin || 'center center';
        let timingFunction = params.timingFunction || 'ease';

        animation.transition(el, {
            styles: {
                opacity: '1',
                transform: transform,
                transformOrigin: transformOrigin
            },
            duration: duration || 0,
            timingFunction: timingFunction,
            delay: 0
        }, () => {
            callback && callback();
        });
    },

    /**
     * 隐藏一个组件(可设置动画)
     * @param params
     * @param callback
     */
    hide(params, callback) {
        let el = params.id;
        if (!el) {
            return;
        }
        let duration = params.duration;
        let transform = params.transform || 'translate(0, 0)';
        let transformOrigin = params.transformOrigin || 'center center';
        let timingFunction = params.timingFunction || 'ease';
        animation.transition(el, {
            styles: {
                opacity: '0',
                transform: transform,
                transformOrigin: transformOrigin
            },
            duration: duration || 0,
            timingFunction: timingFunction,
            delay: 0
        }, () => {
            callback && callback();
        });
    },

    /**
     * 获取当前上下文路径
     * @return {string} 当前上下文路径
     */
    getContextPath() {
        let url;
        let bundleUrl = weex.config.bundleUrl;
        url = bundleUrl.split('/').slice(0, -1).join('/');
        return url;
    },

    /**
     * 加载一个新的页面(bundleJS)
     * @method push
     * @param url {string} bundle js 地址
     * @param params {object} 传递的参数
     */
    push(url, params) {
        let paramsStr = "";
        if (params) {
            for (let key in params) {
                paramsStr += key + "=" + encodeURIComponent(params[key]) + "&";
            }
        }
        if (url.indexOf('?') < 0) {
            url += "?";
        }
        url += paramsStr;
        //link平台中使用navigatorEx,debugtool中使用navigator
        try {
            navigatorEx.push(url);
        } catch (ex) {
            navigator.push({
                url: url,
                animated: 'true'
            }, e => {
            });
        }
    },

    /**
     * 返回上个页面
     * @method pop
     */
    pop() {
        navigator.pop({
            animated: 'true'
        }, e => {
        });
    },

    /**
     * 获取页面参数(bundleJS),从url查询参数中获取
     * @method getPageParams
     * @return {object} 返回json数据
     */
    getPageParams() {
        let params = {};
        let url = weex.config.bundleUrl;
        let index = url.indexOf("?");
        if (index > 0) {
            let query = url.substring(index + 1);
            let temp = query.split('&');
            let key, value;
            for (var p in temp) {
                if (temp[p]) {
                    key = temp[p].split('=')[0];
                    value = temp[p].split('=')[1];
                    params[key] = decodeURIComponent(value);
                }
            }
        }
        return params;
    },

    /**
     * 发送POST请求
     * @method post
     * @param params {object} 请求参数
     * @param params.url {string} 请求的URL
     * @param params.headers {object} 请求头, Content-Type默认值是 application/x-www-form-urlencoded
     * @param params.type {string} 响应类型, json(默认),text
     * @param params.data {object} 请求数据，带到 HTTP body中
     * @return {Promise.<TResult>} 成功: resolve(data, status, statusText), 失败: reject(status, statusText)
     */
    post(params){
        let url = params.url || "";
        let headers = params.headers || {};
        let data = params.data;
        let type = params.type || "json";
        if (typeof data == "object") {
            data = JSON.stringify(data);
        }
        // headers["Content-Type"]="application/x-www-form-urlencoded";
        // headers["Content-Type"]="application/json";
        return new Promise((resolve, reject) => {
            stream.fetch({
                method: "POST",
                type: type,
                url: url,
                headers: headers,
                body: data
            }, (res) => {
                if (res.ok) {
                    resolve(res.data, res.status, res.statusText);
                } else {
                    reject(res.status, res.statusText);
                }
            });
        });
    },

    /**
     * 发送GET请求
     * @method get
     * @param params {object} 请求参数
     * @param params.url {string} 请求的URL
     * @param params.headers {object} 请求头
     * @param params.type {string} 响应类型, json(默认),text
     * @param params.data {object} 请求数据，自动拼接到url后面
     * @return {Promise.<TResult>} 成功: resolve(data, status, statusText), 失败: reject(status, statusText)
     */
    get(params){
        return new Promise((resolve, reject) => {
            let url = params.url || "";
            let headers = params.headers || {};
            let data = params.data || {};
            let type = params.type || "json";
            if (!url.includes("?")) {
                url += "?";
            }
            if (typeof data == "object") {
                for (let key in data) {
                    url += `&${key}=${encodeURIComponent(data[key])}`;
                }
            }
            stream.fetch({
                method: "GET",
                type: type,
                url: url,
                headers: headers
            }, (res) => {
                if (res.ok) {
                    resolve(res.data, res.status, res.statusText);
                } else {
                    reject(res.status, res.statusText);
                }
            });
        });
    },

    /**
     * 判断是否是 iphone x
     * @return {*|boolean}
     */
    isIPhoneX() {
        return weex && (weex.config.env.deviceModel === 'iPhone10,3' || weex.config.env.deviceModel === 'iPhone10,6');
    },

    install(Vue, options) {
        let that = buiweex;
        Vue.mixin({
            components: {
                'bui-header': that.buiHeader,
                'bui-icon': that.buiIcon,
                'bui-button': that.buiButton,
                'bui-image': that.buiImage,
                'bui-actionsheet': that.buiActionSheet,
                'bui-checkbox': that.buiCheckbox,
                'bui-checkbox-list': that.buiCheckboxList,
                'bui-dialog': that.buiDialog,
                'bui-dropdown': that.buiDropdown,
                'bui-lazy-render': that.buiLazyRender,
                'bui-load': that.buiLoad,
                'bui-mask': that.buiMask,
                'bui-panel': that.buiPanel,
                'bui-radio': that.buiRadio,
                'bui-radio-list': that.buiRadioList,
                'bui-searchbar-center': that.buiSearchbarCenter,
                'bui-searchbar-left': that.buiSearchbarLeft,
                'bui-switch': that.buiSwitch,
                'bui-tabbar': that.buiTabbar,
                'bui-tip': that.buiTip,
                'bui-video': that.buiVideo,
                'bui-content': that.buiContent,
                'bui-content-scroll': that.buiContentScroll,
                'bui-image-slider': that.buiImageSlider,
                'bui-cell':that.buiCell,
                'bui-popup':that.buiPopup,
                'bui-number-input': that.buiNumberInput,
                'bui-richcell':that.buiRichcell,
                'bui-popupshow':that.buiPopupShow
            }
        });

        Vue.prototype.$alert = that.alert;

        Vue.prototype.$toast = that.toast;

        Vue.prototype.$confirm = that.confirm;

        Vue.prototype.$show = that.show;

        Vue.prototype.$hide = that.hide;

        Vue.prototype.$getContextPath = that.getContextPath;

        Vue.prototype.$push = that.push;

        Vue.prototype.$pop = that.pop;

        Vue.prototype.$getPageParams = that.getPageParams;

        Vue.prototype.$post = that.post;

        Vue.prototype.$get = that.get;

        Vue.prototype.$isIPhoneX = that.isIPhoneX;
    }
}

module.exports = buiweex;
