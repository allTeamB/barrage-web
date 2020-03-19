/**
 项目配置
 **/
layui.define(['laytpl', 'layer', 'element', 'config'], function (exports) {
    var config = layui.config,
        layer = layui.layer,
        $ = layui.$;

    var util = {
        ajax_request_handle: function (setting, headers, success_func, error_func) {
            var params = setting.data || {};
            var load_idx = layer.load(2, {time: 3 * 1000});
            $.ajax({
                type: setting.type || "GET",
                url: setting.url || "",
                data: params,
                headers: headers.call() || {},
                dataType: "json",
                timeout: 10000, //超时时间：10秒
                success: function (data) {
                    console.log("成功返回:", data);
                    layer.close(load_idx);
                    if (data.code !== '90000') {
                        util.pop(data.message);
                        return;
                    }

                    if (success_func != undefined && success_func instanceof Function) {
                        success_func.call(this, data)
                    } else {
                        util.ajax_default_success_func.call(this, data)
                    }
                },
                error: function (xhr, status, error) {
                    console.log("请求接口失败:", xhr);
                    console.log("status:", xhr.status);
                    if (xhr.status === 401) {
                        util.pop("登录态已失效,请重新登录");
                        return;
                    }

                    layer.close(load_idx);
                    if (success_func != undefined && error_func instanceof Function) {
                        error_func.call(this, xhr)
                    } else {
                        util.ajax_default_error_func.call(this, xhr)
                    }
                }
            })
        },
        pop: function (content) {
            layer.open({
                title: '提示'
                , content: content
            });
        },
        /**
         * 获取请求头
         * @returns {{token: string, "Content-Type": string}}
         */
        ajax_header_setting: function () {
            var headers = {
                "token": util.getCookie("token"),
                "Content-Type": "application/json; charset=UTF-8"
                // "Content-Type": "application/json"
            };

            $.extend(headers);
            return headers;
        },
        /**
         * 默认成功处理方法
         * @param xhr
         * @returns {boolean}
         */
        ajax_default_success_func: function (xhr) {
            util.pop("数据回调成功");
            return false;
        },
        /**
         * 默认异常处理方法
         * @param xhr
         * @returns {boolean}
         */
        ajax_default_error_func: function (xhr) {
            console.log("status:", xhr.status)
            if (xhr.responseJSON) {
                util.pop(xhr.responseJSON.message);
            } else {
                util.pop("网络错误");
            }

            return false;
        },
        /**
         * 获取 cookie
         * @param k
         * @returns {string|null}
         */
        getCookie: function (k) {
            var key = k + '=';
            var pairs = document.cookie.split(';');
            for (i = 0; i < pairs.length; i++) {
                var pair = pairs[i].trim();
                if (pair.indexOf(key) == 0) {
                    return pair.substring(key.length, pair.length);
                }
            }
            return null;
        },
        /**
         * 删除 cookie
         * @param k
         */
        deleteCookie: function (k) {
            util.setCookie(k, "", -1);
        },
        /**
         * 设置 cookie
         * @param name
         * @param value
         * @param expire
         */
        setCookie: function (name, value, expire) {
            console.log(name + "," + value)
            var exp = new Date();
            exp.setTime(exp.getTime() + expire * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            // + '; path=/; domain=' + config.frontUrl;
        },
        /**
         * 获取url中参数值
         * @param name
         * @returns {string|null}
         */
        getUrlParam: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        },
        /**
         * 页面跳转
         * @param url
         */
        goToPage: function (url) {
            window.location.href = url;
        }
    }

    console.log("util 加载")
    exports('barrageutil', util);
});
