/**
 * Created by Tomson on 14-8-20.
 */
$(function () {
  $.widget("edj.optionBox", {
//var widget = {
//插件配置
    options: {
      optionBoxIsShow: false,
      searchBox: true,
      orderByLetter: true,
      orderByLetterLowercase: false,
      orderLetterSize: 4,
      orderLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      optionData: [],
      mouseOver: true,
      mouseOverDuration: 500,
      searchKeyUpDuration: 500,
      itemSelectedCallback: undefined,
      openBoxType: "mouseover"

    },
    _firstLetters: "BPMFDTNLGKHJQXZCSW",
    _specialLetters: "AOE",
//    按键延迟监听器
    _timeoutListener: undefined,
    _mouseHoverTimer: undefined,
    //原始数据
    _dataSource: {},
    //匹配结果
    _result: [],
    //初始化插件
    _setOptions: function () {
      this._superApply(arguments);
    },
    _setOption: function (key, value) {
      // prevent invalid color values
//      if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
//        return;
//      }
      this._super(key, value);
    },
    _create: function () {
//      this

      var selectedItem = this.options.optionData.length > 0 ? this.options.optionData[0].name : "北京";
      this._dataSource = this.options.optionData;
      this.element
          .addClass("edj-option-box-open-btn")
          .text(selectedItem);
      this._createGrid();
      this._tabConstructor();
    },
    //标签构造引擎
    _tabConstructor: function () {
      var htmlTags = '';
      htmlTags += '<div class="edj-option-box-container" style="display: none;">';
      if (this.options.searchBox) {
        htmlTags += '<div class="edj-search-box"><label for="edj-search-input">搜索城市</label><input id="edj-search-input" type="search"/><div class="edj-hot-word">';
        //todo:热词逻辑
        htmlTags += '</div></div>';

      }
//  字母排序tab
      htmlTags += '<nav class="edj-letter-tabs">';
      var tagLetters = "";
      for (index in this._dataSource) {
        if (this._isEmptyValue(this._dataSource[index])) {
          continue;
        }
        tagLetters = tagLetters + index.toString();
      }
      tagLetters = tagLetters.split("").sort().join("");
      var a = tagLetters.length, b = this.options.orderLetterSize;
      var c = a % b > 0 ? (a - (a % b)) / b + 1 : a / b;
      var arrTagTittle = [];
      for (var i = 0; i < c; i++) {
        htmlTags += '<a class="edj-letter-tab-item" href="#" data-content-id="' + tagLetters.substr(i * b, b) + '" style="width:' + (100 / c) + '%;"><span>' + tagLetters.substr(i * b, b) + '</span></a>';
        arrTagTittle.push(tagLetters.substr(i * b, b));
      }
      htmlTags += '</nav><div class="edj-content-container">';
//    htmlTags+='<div class="edj-tag-item">';
      for (var i = 0; i < arrTagTittle.length; i++) {
        var l = arrTagTittle[i].length;
        htmlTags += '<div class="edj-tag-container"  data-content-id="' + tagLetters.substr(i * b, b) + '" style="display: none">';
        for (var j = 0; j < l; j++) {
          var letter = arrTagTittle[i].substr(j, 1)
          htmlTags += '<dl class="edj-letter-row"><dt>' + letter + '</dt><dd><ul>';

          var items = this._dataSource[letter];
          for (var k = 0; k < items.length; k++) {
            htmlTags += '<li><a ';

            for (_item in items[k]) {
              htmlTags += 'data-' + _item + '="' + items[k][_item] + '" '
            }

            htmlTags += '>' + items[k].name + '</a></li>';
          }
          htmlTags += '</ul></dd></dl>'
        }
        htmlTags += '</div>';
      }
      htmlTags += '</div>';
//    搜索结果
      htmlTags += '<div class="edj-search-result-container" style="display: none;"></div>';
      this.element.after(htmlTags);
      $("a.edj-letter-tab-item").eq(0).addClass("edj-letter-tab-active");
      $("div[data-content-id='" + $("a.edj-letter-tab-item").eq(0).data("content-id") + "']").show();
      this._addSearchEvent();
      this._addTagEvent();
      this._addItemClickEvent();
      this._addOpenBoxEvent();
    },
    _addItemClickEvent: function () {
      var that = this;
      $(".edj-letter-row").find("a").on("click", function () {
        that.element.text($(this).data("name"));
        $(".edj-option-box-container").hide();
      });
      if (typeof this.options.itemSelectedCallback === "function") {
        this._addSelectedCallback();
      }

    },
//    选项列表展开点解事件
    _clickEvent: function (e) {
      $(this).next().toggle();
      e.preventDefault();
    },
//    选项列表展开悬浮事件
    _mouseOverEvent: function (e, t) {

      t._mouseHoverTimer = setTimeout(function () {
        t.element.next().show();
      }, t.options.mouseOverDuration);
      t.element.on("mouseout", function () {
        clearTimeout(t._mouseHoverTimer)

      });
      $("body").on("click", function (e) {
        if (!$(e.target).hasClass("edj-option-box-open-btn")) {
          if ($(e.target).parents("[class^='edj-']").length == 0)
            t.element.next().hide();
        }
      });


    },
//    添加选项列表展开事件
    _addOpenBoxEvent: function () {
      var t = this
      switch (this.options.openBoxType) {
        case "click":
          $("a.edj-option-box-open-btn").live("click", this._clickEvent);
          break;
        case "mouseover" :
        default:
          $("a.edj-option-box-open-btn").on("mouseover", function (e) {
            t._mouseOverEvent(e, t)
          });
          break;
      }
    },
//    添加选项点击事件回调
    _addSelectedCallback: function () {
      var that = this;

      $(".edj-letter-row").find("a").on("click", function (e) {
        that.options.itemSelectedCallback(e, $(this));
      });


    },
//    添加选项卡点击事件
    _addTagEvent: function (index) {
      $("a.edj-letter-tab-item").on("click", function (e) {
        var contentId = $(this).data("content-id");
        $("a.edj-letter-tab-item").removeClass("edj-letter-tab-active");
        $(this).addClass("edj-letter-tab-active");
//        var queryStr= this._isEmptyValue(index)?"div[data-content-id]":"div[data-content-id='"+index+"']";
        $("div[data-content-id]").hide();
        $("div[data-content-id='" + contentId + "']").show();
        e.preventDefault();
      });
    },
//    添加搜索事件
    _addSearchEvent: function (callback) {
      var that = this;
      $("div.edj-search-box").find("input#edj-search-input").on('keyup', function () {
        var searchStr = $(this).val();
        if (that._isEmptyValue(searchStr)) {
          that._hideSearchResult();
        } else {
          that._checkKeyUpTimeout(searchStr);
        }
      });
    },
//    检查按键延迟
    _checkKeyUpTimeout: function (searchStr) {
      var that = this;
      if (that._timeoutListener != undefined) {
        clearTimeout(that._timeoutListener);
        that._timeoutListener = undefined;
      }
      that._timeoutListener = setTimeout(function () {
        that._DataFilter(searchStr);
        that._showSearchResult();
      }, that.options.searchKeyUpDuration);
    },
//    关闭查询结果
    _hideSearchResult: function () {
      $(".edj-search-result-container").hide();
    },
//    现实查询结果
    _showSearchResult: function () {
      if (this._isEmptyValue(this._result)) {
        var htmlTags = '<h3>对不起，没有查询到结果。</h3>'
        $("div.edj-search-result-container").html("").append(htmlTags).show();
        return false;
      }
      var htmlTags = '<ul class="edj-search-result-list">';
      for (var i = 0; i < this._result.length; i++) {
        htmlTags += '<li><a';
        for (_item in this._result[i]) {
          htmlTags += 'data-' + _item + '="' + this._result[i][_item] + '" '
        }
        htmlTags += '>' + this._result[i].name + '</a></li>';
      }
      htmlTags += '</ul>'
      $("div.edj-search-result-container").html("").append(htmlTags).show();
    },
    //判断输入是否是首字母
    _isFirstLetter: function (letter) {
      if (this._isEmptyValue(letter)) {
        return false;
      }
      return !!(this._firstLetters.indexOf(this._capsCase(letter).toUpperCase()) + 1);
    },
    //判断是否是特殊韵母
    _isSpecialLetter: function (letter) {
      if (this._isEmptyValue(letter)) {
        return false;
      }
      return !!(this._specialLetters.indexOf(this._capsCase(letter).toUpperCase()) + 1);
    },
    //大小写转换
    _capsCase: function (e) {
      if (this.options.orderByLetterLowercase) {
        return e.toLowerCase();
      } else {
        return e.toUpperCase();
      }
    },
    //键盘按键升起时间
    _keyUpEvent: function (e) {
      var $target = e instanceof jQuery ? e : this._isEmptyValue(e) ? undefined : $(e);
      var searchLetters = $target.value().split("");
      for (var i = 0; i < searchLetters.length; i++) {

      }

    },
    _DataFilter: function (strSearch) {
      this._result = [];
      strSearch.replace(new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？][0-9]"), "");
      var re = /[a-z]|[A-Z]/;
      if ((re.test(strSearch))) {

        strSearch = strSearch.toUpperCase();
        for (var i = 0; i < strSearch.length; i++) {
          var currentLetter = strSearch.substr(i, 1);
          //首字母逻辑
          if (i == 0) {
            if (this._isEmptyValue(this._dataSource[currentLetter])) {
              return null;
            }
            else {
              for (var j = 0; j < this._dataSource[currentLetter].length; j++) {
                //将拼音首字母相同的数据放入_result中
                this._result.push(this._dataSource[currentLetter][j]);
              }
            }
          }
          //非首字母逻辑
          else {
            //输入的非首字母如果是声母查找过滤_result中数据的对应位置汉字拼音首字母
            if (this._isFirstLetter(currentLetter)) {
              for (var j = 0; j < this._result.length; j++) {
                var currentData = this._result[j];
                if (!!currentData.value.split(",")[i]) {
                  if (currentLetter != currentData.value.split(",")[i].substr(0, 1).toUpperCase()) {
                    this._result.splice(j, 1);
                    j = !!j ? j - 1 : 0;
                  }
                }
                else if (strSearch.substr(0, i + 1).toUpperCase() == currentData.value.replace(",", "").substr(0, i + 1).toUpperCase()) {
                  isFound = true;
                }
              }
            }
            //        输入的非首字母如果不是汉字拼音声母
            else {
              for (var j = 0; j < this._result.length; j++) {
                var currentData = this._result[j];
                var isFound = false;
                //   _result中数据的拼写匹配
                if (strSearch.substr(0, i + 1).toUpperCase() == currentData.value.replace(",", "").substr(0, i + 1).toUpperCase()) {
                  isFound = true;
                } else if (this._isSpecialLetter(currentLetter)) {
                  //_result中数据的对应位置汉字拼音首字母匹配
                  if (currentData.value.split(",").length > i) {

                    if (currentLetter == currentData.value.split(",")[i].substr(0, 1).toUpperCase()) {
                      isFound = true;
                    }
                  }
                }

                if (!isFound) {
                  this._result.splice(j, 1);
                  j = !!j ? j - 1 : 0;
                }
              }
            }
          }
        }
      }
      else {
        this._result = [];
        if (strSearch != "") {
          for (index in this._dataSource) {
            if (this._isEmptyValue(this._dataSource[index])) {
              continue;
            }
            for (var i = 0; i < this._dataSource[index].length; i++) {
              if (this._dataSource[index][i].name.indexOf(strSearch) > -1) {
                this._result.push(this._dataSource[index][i]);
              }
            }
          }
        }

      }

      console.log(this._result);
    },

//    组内排序
    _secondLetterSort: function (arr) {
      arr.sort(function (a, b) {
        a.value.substr(0, 1).toUpperCase() - b.value.substr(0, 1).toUpperCase();
      });
      return arr;
    },

//分组
    _createGrid: function () {
      var resArray = [];
      var letters = this.options.orderLetters;
      for (var i = 0; i < letters.length; i++) {
        resArray[letters.substr(i, 1)] = [];
      }
      var arrData = this._dataSource;
      for (var i = 0; i < arrData.length; i++) {
//      if()
        resArray[arrData[i].value.substr(0, 1).toUpperCase()].push(arrData[i]);
      }
      for (var key in resArray) {
        if (this._isEmptyValue(resArray[key])) {
          continue;
        }
        resArray[key] = this._secondLetterSort(resArray[key]);
      }
      this._dataSource = resArray;
    },
//    判断空值
    _isEmptyValue: function (value) {
      var type;
      if (value == null) { // 等同于 value === undefined || value === null
        return true;
      }
      type = Object.prototype.toString.call(value).slice(8, -1);
      switch (type) {
        case 'String':
          return !$.trim(value);
        case 'Array':
          return !value.length;
        case 'Object':
          return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
        default:
          return false; // 其他对象均视作非空
      }
    }


//widget._dataSource = data;
//widget._createGrid();
//widget._DataFilter("b");
//widget._DataFilter("北京");
//console.log(widget._result);
  })
  ;
  var data = [
    {id: 1, name: "北京", value: "BEI,JING", priceIndex: 1},
    {id: 3, name: "上海", value: "SHANG,HAI", priceIndex: 1},
    {id: 5, name: "广州", value: "GUANG,ZHOU", priceIndex: 1},
    {id: 6, name: "深圳", value: "SHEN,ZHEN", priceIndex: 1},
    {id: 14, name: "天津", value: "TIAN,JIN", priceIndex: 3},
    {id: 4, name: "杭州", value: "HANG,ZHOU", priceIndex: 3},
    {id: 7, name: "重庆", value: "CHONG,QING", priceIndex: 4},
    {id: 2, name: "成都", value: "CHENG,DU", priceIndex: 3},
    {id: 8, name: "南京", value: "NAN,JING", priceIndex: 3},
    {id: 11, name: "西安", value: "XI,AN", priceIndex: 3},
    {id: 18, name: "郑州", value: "ZHENG,ZHOU", priceIndex: 3},
    {id: 10, name: "武汉", value: "WU,HAN", priceIndex: 3},
    {id: 15, name: "济南", value: "JI,NAN", priceIndex: 3},
    {id: 9, name: "长沙", value: "CHANG,SHA", priceIndex: 3},
    {id: 20, name: "青岛", value: "QING,DAO", priceIndex: 3},
    {id: 12, name: "宁波", value: "NING,BO", priceIndex: 3},
    {id: 16, name: "苏州", value: "SU,ZHOU", priceIndex: 5},
    {id: 27, name: "福州", value: "FU,ZHOU", priceIndex: 3},
    {id: 22, name: "厦门", value: "XIA,MEN", priceIndex: 3},
    {id: 23, name: "合肥", value: "HE,FEI", priceIndex: 3},
    {id: 30, name: "无锡", value: "WU,XI", priceIndex: 5},
    {id: 19, name: "沈阳", value: "SHEN,YANG", priceIndex: 3},
    {id: 21, name: "大连", value: "DA,LIAN", priceIndex: 3},
    {id: 25, name: "石家庄", value: "SHI,JIA,ZHUANG", priceIndex: 3},
    {id: 29, name: "太原", value: "TAI,YUAN", priceIndex: 3},
    {id: 31, name: "常州", value: "CHANG,ZHOU", priceIndex: 5},
    {id: 72, name: "咸阳", value: "XIAN,YANG", priceIndex: 3},
    {id: 48, name: "徐州", value: "XU,ZHOU", priceIndex: 5},
    {id: 44, name: "扬州", value: "YANG,ZHOU", priceIndex: 5},
    {id: 49, name: "金华", value: "JIN,HUA", priceIndex: 5},
    {id: 51, name: "嘉兴", value: "JIA,XING", priceIndex: 5},
    {id: 46, name: "镇江", value: "ZHEN,JIANG", priceIndex: 5},
    {id: 37, name: "南通", value: "NAN,TONG", priceIndex: 5},
    {id: 71, name: "大同", value: "DA,TONG", priceIndex: 5},
    {id: 61, name: "洛阳", value: "LUO,YANG", priceIndex: 5},
    {id: 50, name: "绍兴", value: "SHAO,XING", priceIndex: 5},
    {id: 53, name: "湖州", value: "HU,ZHOU", priceIndex: 5},
    {id: 56, name: "珠海", value: "ZHU,HAI", priceIndex: 3},
    {id: 41, name: "海口", value: "HAI,KOU", priceIndex: 3},
    {id: 43, name: "银川", value: "YIN,CHUAN", priceIndex: 3},
    {id: 33, name: "贵阳", value: "GUI,YANG", priceIndex: 3},
    {id: 24, name: "哈尔滨", value: "HA,ER,BIN", priceIndex: 3},
    {id: 76, name: "湛江", value: "ZHAN,JIANG", priceIndex: 3},
    {id: 47, name: "泰州", value: "TAI,ZHOU", priceIndex: 5},
    {id: 65, name: "唐山", value: "TANG,SHAN", priceIndex: 5},
    {id: 73, name: "连云港", value: "LIAN,YUN,GANG", priceIndex: 5},
    {id: 74, name: "丽水", value: "LI,SHUI", priceIndex: 5},
    {id: 75, name: "盐城", value: "YAN,CHENG", priceIndex: 5},
    {id: 28, name: "佛山", value: "FO,SHAN", priceIndex: 3},
    {id: 103, name: "汕头", value: "SHAN,TOU", priceIndex: 3},
    {id: 106, name: "阳江", value: "YANG,JIANG", priceIndex: 3},
    {id: 79, name: "漳州", value: "ZHANG,ZHOU", priceIndex: 3},
    {id: 40, name: "威海", value: "WEI,HAI", priceIndex: 5},
    {id: 68, name: "宜昌", value: "YI,CHANG", priceIndex: 5},
    {id: 84, name: "潍坊", value: "WEI,FANG", priceIndex: 5},
    {id: 85, name: "济宁", value: "JI,NING", priceIndex: 5},
    {id: 90, name: "德州", value: "DE,ZHOU", priceIndex: 5},
    {id: 114, name: "宿迁", value: "SU,QIAN", priceIndex: 5},
    {id: 134, name: "襄阳", value: "XIANG,YANG", priceIndex: 5},
    {id: 151, name: "绵阳", value: "MIAN,YANG", priceIndex: 5},
    {id: 152, name: "德阳", value: "DE,YANG", priceIndex: 5},
    {id: 26, name: "南昌", value: "NAN,CHANG", priceIndex: 3},
    {id: 77, name: "西宁", value: "XI,NING", priceIndex: 3},
    {id: 35, name: "南宁", value: "NAN,NING", priceIndex: 3},
    {id: 36, name: "长春", value: "CHAGN,CHUN", priceIndex: 3},
    {id: 95, name: "日照", value: "RI,ZHAO", priceIndex: 5},
    {id: 96, name: "莱芜", value: "LAI,WU", priceIndex: 5},
    {id: 98, name: "舟山", value: "ZHOU,SHAN", priceIndex: 5},
    {id: 101, name: "江门", value: "JIANG,MEN", priceIndex: 3},
    {id: 104, name: "揭阳", value: "JIE,YANG", priceIndex: 3},
    {id: 107, name: "韶关", value: "SHAO,GUAN", priceIndex: 3},
    {id: 113, name: "淮安", value: "HUAI,AN", priceIndex: 5},
    {id: 136, name: "黄石", value: "HUANG,SHI", priceIndex: 5},
    {id: 138, name: "荆州", value: "CHANG,ZHOU", priceIndex: 5},
    {id: 160, name: "萍乡", value: "PING,XIANG", priceIndex: 5},
    {id: 13, name: "温州", value: "WEN,ZHOU", priceIndex: 5},
    {id: 83, name: "三明", value: "SAN,MING", priceIndex: 3},
    {id: 128, name: "运城", value: "YUN,CHENG", priceIndex: 5},
    {id: 132, name: "渭南", value: "WEI,NAN", priceIndex: 5},
    {id: 133, name: "汉中", value: "HAN,ZHONG", priceIndex: 5},
    {id: 159, name: "新余", value: "XIN,YU", priceIndex: 5},
    {id: 167, name: "锦州", value: "JIN,ZHOU", priceIndex: 5}
  ];
  $("a.city-list").optionBox({optionData: data, openBoxType: "mouseover", itemSelectedCallback: function (e, t) {
    console.log($(t).data("name"));
  }});
})
;