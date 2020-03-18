var httpReq;
var form;
var domain = '172.31.19.91';
layui.use('layer', function () {
    var $ = layui.$ //由于layer弹层依赖jQuery，所以可以直接得到
        , layer = layui.layer;

    // $.ajaxSetup({
    //     //完成请求后触发。即在success或error触发后触发
    //     complete: function (xhr, status) {
    //         console.log(xhr)
    //         if (xhr.status == UNAUTHORIZED_STATUS_CODE) {
    //             showAlertMsg({'message': UNAUTHORIZED_STATUS_TEXT}, logout, {'key': 'sessionId', 'url': loginUrl})
    //         }
    //     }
    // })
});


function loadDroplist(id, url, node, selectedValue) {
    layui.use('form', function () {
        form = layui.form;
        layui.use(['jquery'], function () {
            var $ = jQuery = layui.$;
            $.getJSON(url, function (r) {
                data = (node != '') ? r[node] : r;
                $.each(data, function (k, v) {
                    $('#' + id).append(opt = new Option(v.title, v.value));
                    if (selectedValue != null) {
                        if (selectedValue == v.value) {
                            opt.selected = true
                        }
                    }
                });
                form.render();
            });
        });
    });
}

function loadDroplistByValue(id, url, node, parentValue, selectedValue, k) {
    layui.use('form', function () {
        form = layui.form;
        layui.use(['jquery'], function () {
            var $ = jQuery = layui.$;
            $('#' + id).empty();
            $.getJSON(url, function (r) {
                data = (node != '') ? r[node] : r;
                $.each(data, function (pk, pv) {
                    if (parentValue == pv.value) {
                        data = pv[k];
                        $.each(data, function (key, val) {
                            $('#' + id).append(opt = new Option(val.title, val.value));
                            if (selectedValue != null) {
                                if (selectedValue == val.value) {
                                    opt.selected = true
                                }
                            }
                        });
                    }
                });
                form.render();
            });
        });
    });
}

function POSTHttpRequest(url, data, callback) {
    var httpReq = new XMLHttpRequest();
    httpReq.open('POST', url);
    httpReq.setRequestHeader('content-type', 'application/json');
    httpReq.setRequestHeader('sessionId', getCookie('sessionId'));
    httpReq.send(JSON.stringify(data));
    httpReq.onreadystatechange = function () {
        if (httpReq.readyState == 4 && httpReq.status == 200) {
            response = JSON.parse(httpReq.response);
            callback(response);
        }

        if (httpReq.status == 401) {
            showAlertMsg({'message': UNAUTHORIZED_STATUS_TEXT}, logout, {'key': 'sessionId', 'url': loginUrl})
        }
    };
    return false;
}

function get(url, callback, data) {
    var param = genParam(data);
    var httpReq = new XMLHttpRequest();
    httpReq.open('GET', url + param);
    httpReq.setRequestHeader('sessionId', getCookie('sessionId'));
    httpReq.send(null);
    httpReq.onreadystatechange = function () {
        if (httpReq.readyState == 4 && httpReq.status == 200) {
            callback();
        }

        if (httpReq.status == 401) {
            showAlertMsg({'message': UNAUTHORIZED_STATUS_TEXT}, logout, {'key': 'sessionId', 'url': loginUrl})
        }
    };
    return false;
}


function setCookie(k, v, m) {
    var date = new Date();
    date.setTime(date.getTime() + 60 * 1000 * m);
    document.cookie = k + '=' + v + '; expires=' + date.toGMTString() + '; path=/; domain=' + domain;
}

function getCookie(k) {
    var key = k + '=';
    var pairs = document.cookie.split(';');
    for (i = 0; i < pairs.length; i++) {
        var pair = pairs[i].trim();
        if (pair.indexOf(key) == 0) {
            return pair.substring(key.length, pair.length);
        }
    }
    return null;
}

function deleteCookie(k) {
    setCookie(k, "", -1);
}

function setValue(id, val) {
    document.getElementById(id).value = val;
}

function setDate(str, cbegin, cend) {
    var dates = str.split('-');
    setValue(cbegin, dates[0].trim());
    setValue(cend, dates[1].trim());
}

function getHeader(k) {
    var httpReq = new XMLHttpRequest();
    httpReq.open('GET', document.location, false);
    httpReq.send(null);
    return httpReq.getResponseHeader(k).toLowerCase();
}

function verifyLength(minlength, maxlength) {
    layui.use('form', function () {
        var form = layui.form;
        form.verify({
            length: function (value) {
                if (minlength != '' && value.length < minlength) {
                    return '输入长度不能小于' + minlength;
                }
                if (maxlength != '' && value.length > maxlength) {
                    return '输入长度不能大于' + maxlength;
                }
            }
        });
    });
}

function genParamString(params) {
    var str = '?';
    for (var key in params) {
        if (str == '?') {
            str = str + key + '=' + params[key];
        } else {
            str = str + '&' + key + '=' + params[key];
        }
    }
    return str;
}

function renderDetailTable(params) {
    var param = genParamString(params.where);
    var xmlhttpReq = new XMLHttpRequest();
    xmlhttpReq.open('GET', params.url + param);
    xmlhttpReq.setRequestHeader('sessionId', getCookie('sessionId'));
    xmlhttpReq.send(null);
    xmlhttpReq.onreadystatechange = function () {
        if (xmlhttpReq.readyState == 4 && xmlhttpReq.status == 200) {
            res = JSON.parse(xmlhttpReq.response);
            data = (params.data)(res);
            var rows = '<table><tbody>';
            for (var i = 0; i < params.rows.length; i++) {
                for (k in params.rows[i]) {
                    if (typeof(data[k]) != 'undefined') {
                        rows += '<tr><td>' + params.rows[i][k] + '</td><td>' + data[k] + '</td>'
                    }
                }
            }
            rows += '</tbody></table>';
            document.getElementById(params.id).innerHTML = rows;
        }
    };
}

function renderPieChart(params) {
    var dom = document.getElementById(params.id); //div id
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            text: params.text, // text
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: params.category // title of the data set
        },
        series: [
            {
                name: params.hover_category, //
                type: 'pie',
                radius: '55%',
                center: ['30%', '40%'],
                data: params.data, // data source
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function renderLineChart(params) {
    var dom = document.getElementById(params.id); //折线图ID
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            text: params.text, // 设置标题
            subtext: '',
            // x: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: params.category //折线分类示意名称
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {show: true}
            }
        },
        xAxis: {
            type: 'category',
            data: params.x_title // X轴名称，
        },
        yAxis: {
            type: 'value'
        },
        series: params.data
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function renderBarChart(params) {
    var dom = document.getElementById(params.id); // 柱状图ID
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    app.title = params.title;
    option = {
        title: {
            text: params.title
        },
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: params.type        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: params.x_title, //X轴 名称
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: params.hover_category, //设置柱状图鼠标在节点悬浮时显示的字段名称
            type: 'bar',
            barWidth: '60%',
            data: params.data //设置数据
        }]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function uploadFile(size, url, returnCode, params) {
    layui.use('upload', function () {
        var $ = layui.jquery
            , upload = layui.upload;
        var fileListView = $('#file_list_view')
            , uploadListIns = upload.render({
            elem: '#choose_file_button'
            , url: url
            , headers: {sessionId: getCookie('sessionId')}
            , data: params
            , size: (size * 1024)
            , accept: 'file'
            , multiple: true
            , auto: false
            , bindAction: '#upload_file_button'
            , choose: function (obj) {
                var files = this.files = obj.pushFile();
                obj.preview(function (index, file, result) {
                    var tr = $(['<tr id="upload-' + index + '">'
                        , '<td>' + file.name + '</td>'
                        , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                        , '<td>等待上传</td>'
                        , '<td>'
                        , '<button class="layui-btn layui-btn-xs file-reload layui-hide">重传</button>'
                        , '<button class="layui-btn layui-btn-xs layui-btn-danger file-delete">删除</button>'
                        , '</td>'
                        , '</tr>'].join(''));

                    //单个重传
                    tr.find('.file-reload').on('click', function () {
                        obj.upload(index, file);
                    });

                    //删除
                    tr.find('.file-delete').on('click', function () {
                        delete files[index];
                        tr.remove();
                        uploadListIns.config.elem.next()[0].value = '';
                    });

                    fileListView.append(tr);
                });
            }
            , done: function (res, index, upload) {
                if (res.return_code == returnCode) {
                    var tr = fileListView.find('tr#upload-' + index)
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    tds.eq(3).html('');
                    return delete this.files[index];
                }
                this.error(index, upload);
            }
            , error: function (index, upload) {
                var tr = fileListView.find('tr#upload-' + index)
                    , tds = tr.children();
                tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(3).find('.file-reload').removeClass('layui-hide');
            }
        });
    });
}

function uploadImage(size, url, returnCode) {
    layui.use('upload', function () {
        var $ = layui.jquery
            , upload = layui.upload;
        var layer = layui.layer;
        var uploadListIns = upload.render({
            elem: '#choose_image_button'
            , url: url
            , headers: {sessionId: getCookie('sessionId')}
            , accept: 'images'
            , multiple: true
            , size: (size * 1024)
            , auto: false
            , bindAction: '#upload_image_button'
            , choose: function (obj) {
                //预读本地文件示例，不支持ie8
                var files = obj.pushFile();
                obj.preview(function (index, file, result) {
                    var img_info = `
                        <div  class="h_up_img"><img src="${result}" alt="${file.name}" class="layui-upload-img"><p class="delete"  data-id="${index}">删除</p></div>
                    `
                    $('#image_list_view').append(img_info)
                    $('.delete').off("click").on('click', function () {
                        var _index = $(this).data("id");
                        delete files[_index]
                        $(this).parent().remove();
                        uploadListIns.config.elem.next()[0].value = '';
                    });
                });

            }
            , before: function (obj) {
                uploda_value = [];
            }
            , done: function (res) {
                //上传完毕
                // alert(res.toString())
                // uploda_value.push(res.url);
                // $("#uploadID").val(uploda_value);
            }
            , allDone: function (obj) {
                console.log(obj)
                alert('上传完成')
            }
        });
    });
}

function openApiUrl() {
    window.open(response.data);
}

function logout(params) {
    deleteCookie(params.key);
    window.location.href = params.url;
}

function checkStatus(params) {
    if (response.return_code != "90000") {
        window.location.href = params.url;
    }
}

function showApiMsg(response) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.open({
            title: '系统消息'
            , content: response.message
        });
    });
}

function GETHttpRequest(url, params, isSetHeader, callback, callbackParams) {
    var paramStr = genParamString(params);
    var httpReq = new XMLHttpRequest();
    httpReq.open('GET', url + paramStr);
    if (isSetHeader) {
        httpReq.setRequestHeader('sessionId', getCookie('sessionId'));
    }
    httpReq.send(null);
    httpReq.onreadystatechange = function () {
        console.log(httpReq.status)
        if (httpReq.readyState == 4 && httpReq.status == 200) {
            response = JSON.parse(httpReq.response);
            callback(response, callbackParams);
        }

        if (httpReq.status == 401) {
            showAlertMsg({'message': UNAUTHORIZED_STATUS_TEXT}, logout, {'key': 'sessionId', 'url': loginUrl})
        }
    };
    return false;
}


function setDateRange(dataRangeId, cbegin, cend) {
    dataRangeObj = document.getElementById(dataRangeId)
    if (dataRangeObj.value == '') {
        begin = document.getElementById(cbegin).value
        end = document.getElementById(cend).value
        dataRangeObj.value = begin + ' - ' + end
    }
}


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        var param = unescape(r[2]);
        if (param != null && param.toString().length >= 1) {
            return param;
        }
    }
    return null;
}

function formFiller(param, response) {
    layui.use('form', function () {
        layui.form.val(param.id, response[param.node][0]);
    });
}

function showAlertMsg(params, callback, callbackParams) {
    layui.use('layer', function () {
        var layer = layui.layer;

        layer.alert(params.message, function (index) {
            callback(callbackParams);
            layer.close(index);
        });
    });
}

function HttpRequest(method, url, data, callback, callbackParams={}) {
    var httpReq = new XMLHttpRequest();
    httpReq.open(method, url);

    httpReq.setRequestHeader('content-type', 'application/json');
    httpReq.setRequestHeader('sessionId', getCookie('sessionId'));

    httpReq.send(JSON.stringify(data));
    httpReq.onreadystatechange = function () {
        if (httpReq.readyState == 4 && httpReq.status == 200) {
            response = JSON.parse(httpReq.response);
            callback(response, callbackParams);
        }

        if (httpReq.status == 400) {
            response = JSON.parse(httpReq.response);
            callback(response, callbackParams);
        }
    };
    return false;
}