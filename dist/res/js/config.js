/**
 项目配置
 **/
layui.define(function(exports){
    var obj = {
        'env': 'dev',

        'devApiUrl': 'http://106.12.35.153:8000/api/merconsole/',
        'devFrontUrl': 'http://106.12.35.153:8080/',

        'testApiUrl': '',
        'testFrontUrl': '',

        'prodApiUrl': '',
        'prodFrontUrl': '',
    };

    obj.cgi = {
        token: 'login/token',
        captcha: 'login/captcha',
        login: 'login'
    };

    obj.frontUrl =obj[obj.env + 'FrontUrl'];
    obj.apiUrl =obj[obj.env + 'ApiUrl'];

    console.log("配置文件加载")
    exports('config', obj);
});
