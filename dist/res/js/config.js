/**
 项目配置
 **/
layui.define(function(exports){
    var obj = {
        'env': 'dev',

        'devApiUrl': '',
        'devFrontUrl': '',

        'testApiUrl': '',
        'testFrontUrl': '',

        'prodApiUrl': '',
        'prodFrontUrl': '',
    };

    obj.cgi = {

    };

    obj.frontUrl =obj[obj.env + 'FrontUrl'];
    obj.apiUrl =obj[obj.env + 'ApiUrl'];

    console.log("配置文件加载")
    exports('config', obj);
});
