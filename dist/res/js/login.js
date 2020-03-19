/**
 项目配置
 **/
layui.define(['config', 'barrageutil', 'form'], function (exports) {

    var util = layui.barrageutil,
        config = layui.config,
        $ = layui.$;

    var layer = layui.layer;
    var form = layui.form;

    console.log("login")
    console.log(config)

    var getToken = function () {
        util.ajax_request_handle({
                type: "GET",
                url: config.apiUrl + config.cgi.token
            },
            util.ajax_header_setting,
            function (res) {

                var re = res.data;
                console.log("data:", re);
                util.setCookie('token', re.token, 2);

                var _random = Math.floor(Math.random() * 10000);//随机数
                $("#captcha").attr("src", config.apiUrl + config.cgi.captcha + "?token=" + re.token + "&random=" + _random)
            })
    };

    // 表单提交
    form.on('submit(login-submit)', function (obj) {
        console.log(obj);

        util.ajax_request_handle({
                type: "POST",
                url: config.apiUrl + config.cgi.login,
                data: JSON.stringify(obj.field)
            },
            util.ajax_header_setting,
            function (res) {

                var re = res.data;
                console.log("data:", re);
                if (res.code === '90000') {
                    util.setCookie('token', re.token, 2);
                    setTimeout(function () {
                        util.goToPage(config.frontUrl + 'welcome.html')
                    }, 1000)
                } else {
                    util.pop(res.message);
                    getToken();
                    return false;
                }

            },
            function (e) {
                if (e.responseJSON && e.responseJSON.message) {
                    util.pop(e.responseJSON.message)
                } else {
                    util.pop('系统网络错误');
                }
                getToken();
            });

        return false;
    })

    getToken();
    exports('login', {});
});
