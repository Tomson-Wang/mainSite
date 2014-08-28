// JavaScript Document
Common = {};
var MD5KEY = '0c09bc02-c74e-11e2-a9da-00163e1210d9';
var URL = "http://api.d.edaijia.cn/rest/";
Common.config = {
  appkey: '51000031',
  ver: 3
};
var CU = Common.CU = {
  isSucceed: function (data) {
    if (data.code != 0) {
      alert(data.message);
    }
    return data.code == 0;
  },
  dateFormat: function (date, format) {
    format = format || 'yyyy-MM-dd hh:mm:ss';
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  },
  getSig: function (param) {
    var paramStr = [], paramStrSorted = [];
    for (var n in param) {
      paramStr.push(n);
    }
    paramStr = paramStr.sort();
    $(paramStr).each(function (index) {
      paramStrSorted.push(this + param[this]);
    });
    var text = paramStrSorted.join('') + MD5KEY;
    return $.md5(text);
  }
};

Common.stringify = function (data) {
  var value = "";
  for (prop in data) {
    value += prop + "=" + data[prop] + "&";
  }
  return value.substr(0, value.length - 1);
};
Common.getRequest = function (model) {
  var req = $.extend(true, {}, Common.config);
  req.method = model.method;
  req.timestamp = CU.dateFormat(new Date());
  var model = model.params ? model.params : model;

  req = $.extend(true, req, model);
  req.sig = CU.getSig(req);

  return $.ajax({
    url: URL,
    type: 'GET',
    data: Common.stringify(req),
    crossDomain: true,
    dataType: 'jsonp',
    timeout: 5000,
    statusCode: {500: function () {
      alert('500 服务器错误');
    }},
    statusCode: {404: function () {
      alert('404 服务器无法找到被请求的页面');
    }},
    error: function (x, h, r) {
      alert("错误")
    },
    success: function (data) {

    }
  });
};

Common.postRequest = function (model) {
  var req = $.extend(true, {}, Common.config);
  req.method = model.method;
  req.timestamp = CU.dateFormat(new Date());
  var model = model.params ? model.params : model;

  req = $.extend(true, req, model);
  req.sig = CU.getSig(req);

  return $.ajax({
    url: "http://api.d.edaijia.cn/public/",
    type: 'POST',
    data: Common.stringify(req),
    crossDomain: true,
    dataType: 'json',
    timeout: 5000,
    statusCode: {500: function () {
      alert('500 服务器错误');
    }},
    statusCode: {404: function () {
      alert('404 服务器无法找到被请求的页面');
    }},
    error: function (x, h, r) {
      alert("错误")
    },
    success: function (data) {

    }
  });
};

//获取URL参数
Common.UrlGet = function () {
  var args = {};
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    value = decodeURIComponent(value);
    args[argname] = value;
  }
  return args;
}
//特殊字符过滤正则
Common.strip = function (s) {
  var pattern = new RegExp("[%--`'!@#$^&*()=|{}:;,\\[\\]<>/?'！@#￥……&*（）——|{}【】‘；：”“ 。，、？]");
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern);
  }
  return rs;
}
//获取外部js模板
Common.getTemplate = function (url) {
  return $.ajax({
    url: url,
    type: 'GET',
    dataType: 'html',
    crossDomain: true,
    timeout: 5000,
    statusCode: {500: function () {
      alert('500 服务器错误');
    }},
    statusCode: {404: function () {
      alert('404 服务器无法找到被请求的页面');
    }},
    error: function (x, h, r) {
      alert("错误")
    },
    success: function (data) {

    }
  });
}
//字符串转对象
Common.parse=function(str){
  var arrParam = str.split("&");
  var resObj={};
  for(var i=0; i<arrParam.length;i++){
    var param=arrParam[i].split("=");
    resObj[param[0]]=!!param[1]?param[1]:"";
  }
  return resObj;
}
$(function () {
  var templateURL = "templates/";
  $("[data-edj-temp]").each(function (i, e) {
    $t = $(this);
    var fileName = $(this).data("edj-temp") ;
    var url=templateURL +fileName+ ".temp"
        $.ajax({
      url: url,
      type: 'GET',
      data:fileName,
      dataType: 'html',
      crossDomain: true,
      timeout: 5000,
      statusCode: {500: function () {
        alert('500 服务器错误');
      }},
      statusCode: {404: function () {
        alert('404 服务器无法找到被请求的页面');
      }},
      error: function (x, h, r) {
        alert("错误")
      },
      success: function (t) {
        if (t == "") {
          console.log("the template is null");
          return false;
        }

        $("[data-edj-temp='"+this.url.split("?")[1]+"']").append($(t));
      }

    });
  });
});