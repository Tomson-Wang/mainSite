(function (c) {
  if (!c.kit) {
    c.kit = {};
  }
  if (!c.module) {
    c.module = {};
  }
  if (!c.ui) {
    c.ui = {};
  }
  var b = (function () {
    var f = {}, d;
    var e = function () {
      if (!d) {
        d = c('<div style="width: 950px;margin: 0 auto;height:0;position: relative;z-index: 999999;"></div>');
        d.insertBefore(c(":first", document.body));
      }
    };
    f.offset = function () {
      e();
      return d.offset();
    };
    f.size = function () {
      e();
      return[d.width(), c(window).height()];
    };
    f.getNode = function () {
      e();
      return d;
    };
    f.getNodeOffset = function (h) {
      var i = f.offset(), g = h.offset();
      return{left: g.left - i.left, top: g.top - i.top};
    };
    return function () {
      return f;
    };
  })();
  c.module.layer = function (h) {
    var e = b();
    var g = c(h).appendTo(e.getNode()).hide(), d = c("[node-type=inner]", g);
    var j = {}, i = c(j), f;
    j.show = function () {
      g.show();
      i.trigger("lay_show");
      return j;
    };
    j.hide = function () {
      g.hide();
      i.trigger("lay_hide");
      return j;
    };
    j.getOuter = function () {
      return g;
    };
    j.getInner = function () {
      return d;
    };
    j.getWrapSize = function () {
      return e.size();
    };
    j.getWrapOffset = function (k) {
      return e.getNodeOffset(k);
    };
    j.getSize = function (k) {
      if (k || !f) {
        f = [g.width(), g.height()];
      }
      return f;
    };
    j.getDom = function (k) {
      return c("[node-type=" + k + "]", g);
    };
    j.setPosition = function (k) {
      g.css(k);
      return j;
    };
    return j;
  };
  function a(d, e) {
    this._cache = [];
    this._cFn = d;
  }

  a.prototype = {constructor: a, _create: function () {
    var d = this._cFn();
    this._cache.push({store: d, used: true});
    return d;
  }, getOne: function () {
    var e = this._cache;
    for (var f = 0, d = e.length; f < d; f += 1) {
      if (e[f].used === false) {
        e[f].used = true;
        return e[f].store;
      }
    }
    return this._create();
  }, _setStat: function (e, d) {
    c.each(this._cache, function (f, g) {
      if (e === g.store) {
        g.used = d;
        return false;
      }
    });
  }, setUsed: function (d) {
    this._setStat(d, true);
  }, setUnused: function (d) {
    this._setStat(d, false);
  }, getLength: function () {
    return this._cache.length;
  }};
  c.kit.Reuse = a;
  c.module.dialog = (function () {
    return function (m, n) {
      if (!m) {
        throw"dialog no template";
      }
      var g, h, j, e, i, p, l, d, k, f;
      var o = function () {
        j = c.extend({}, n);
        g = c.module.layer(m);
        e = g.getOuter();
        i = g.getInner();
        p = g.getDom("close").click(function () {
          l();
        });
      };
      o();
      k = g.show;
      f = g.hide;
      l = function (q) {
        if (typeof d === "function" && !q) {
          if (d() === false) {
            return false;
          }
        }
        f();
        return h;
      };
      h = g;
      h.show = function () {
        k();
        return h;
      };
      h.hide = l;
      h.setMiddle = function () {
        var r = h.getWrapSize(), s = g.getSize(true), q = c(window).scrollTop();
        var t = {top: q + (r[1] - s[1]) / 2, left: (r[0] - s[0]) / 2};
        if (t.top < q) {
          t.top = q;
        }
        if (t.left < 0) {
          t.left = 0;
        }
        return h.setPosition(t);
      };
      h.setClose = function (q) {
        p[q ? "show" : "hide"]();
      };
      h.setContent = function (q) {
        if (typeof q === "string") {
          i.html(q);
        } else {
          i.append(q);
        }
        return h;
      };
      h.clearContent = function () {
        i.empty();
        return h;
      };
      h.setBeforeHideFn = function (q) {
        d = q;
      };
      h.clearBeforeHideFn = function () {
        d = null;
      };
      return h;
    };
  }());
  c.ui.dialog = (function () {
    var h = '<div class="poplayer_box" node-type="outer" style="display:block;left:420px;top:10px;">     <span class="close" node-type="close"></span>     <div class="poplayer_inner" node-type="inner"></div></div>';
    var f = null;
    var k = function (l) {
      l.clearContent();
      if (f) {
        f.setUnused(l);
      }
    };
    var e = function () {
      var l = c.module.dialog(h);
      c(l).bind("lay_show", function () {
        c.ui.mask.show();
      }).bind("lay_hide", function () {
        c.ui.mask.hide();
      });
      return l;
    };
    var g = [];
    var j = function (m) {
      var l = [];
      c.each(g, function (n, o) {
        if (o !== m) {
          l.push(o);
        }
      });
      g = l;
    };
    var d = function (o, l) {
      var n = function () {
        j(o);
        if (!l.isHold) {
          c(o).unbind("lay_hide", n);
          c(o).unbind("lay_show", m);
        }
      };
      var m = function () {
        g.push(o);
      };
      c(o).bind("lay_hide", n).bind("lay_show", m);
    };
    var i = function () {
      c(document).keydown(function (m) {
        if (g.length === 0) {
          return;
        }
        var q = g[g.length - 1];
        var p = m.keyCode, o = m.target, r = o.nodeName, l = /^input|textarea$/i;
        var n = c.contains(q.getOuter()[0], o);
        if (p === 27) {
          if (!q.isEsc) {
            return;
          }
          if (l.test(r) && n && o.type !== "button") {
            return;
          }
          q.hide();
        } else {
          if (p === 13 || p === 9) {
            if (!n) {
              m.preventDefault();
            }
          }
        }
      });
    };
    return function (l) {
      l = c.extend({isEsc: true, isHold: false, closeBtn: true, width: 500}, l || {});
      var o = l.isHold;
      if (!f) {
        i();
        f = new c.kit.Reuse(e);
      }
      var m = f.getOne();
      m.getInner().css("width", l.width);
      m.setClose(l.closeBtn);
      if (!o) {
        var n = function () {
          c(m).unbind("lay_hide", n);
          k(m);
        };
        c(m).bind("lay_hide", n);
      }
      m.isEsc = l.isEsc;
      d(m, l);
      return m;
    };
  }());
  c.ui.mask = (function () {
    var m, e = 0, f, l = c.browser.msie && c.browser.version === "6.0";

    function h() {
      if (l) {
        m.css({width: c(document).width(), height: Math.max(c(document).height(), c(window).height()), zIndex: 800});
      } else {
        m.css({position: "fixed", zIndex: 800});
      }
    }

    function j() {
      clearTimeout(f);
      f = setTimeout(h, 500);
    }

    function k() {
      if (l) {
        c(window).bind("resize", j);
      }
    }

    function d() {
      c(window).unbind("resize", j);
    }

    function g() {
      m = c('<div class="poplayer_bg"></div>').appendTo(document.body);
      h();
      return m;
    }

    var i = {show: function () {
      e++;
      if (e > 1) {
        return;
      }
      if (!m) {
        g();
      }
      k();
      m.show();
    }, hide: function () {
      if (!m || e <= 0) {
        return;
      }
      e--;
      if (e === 0) {
        d();
        m.hide();
      }
    }};
    return i;
  })();
})(jQuery);
(function (a) {
  a.qkit = {};
  a.extend((a.qClass = {}), {inherits: function (c, b) {
    function d() {
    }

    d.prototype = b.prototype;
    c.superClass_ = b.prototype;
    c.prototype = new d();
    c.prototype.constructor = c;
  }, base: function (f, b, h) {
    var d = arguments.callee.caller;
    if (d.superClass_) {
      return d.superClass_.constructor.apply(f, Array.prototype.slice.call(arguments, 1));
    }
    var c = Array.prototype.slice.call(arguments, 2);
    var g = false;
    for (var e = f.constructor; e; e = e.superClass_ && e.superClass_.constructor) {
      if (e.prototype[b] === d) {
        g = true;
      } else {
        if (g) {
          return e.prototype[b].apply(f, c);
        }
      }
    }
    if (f[b] === d) {
      return f.constructor.prototype[b].apply(f, c);
    } else {
      throw Error("lib.base called from a method of one name to a method of a different name");
    }
  }});
})(jQuery);
(function (b) {
  var a = function () {
    throw new Error("qWidget is only a abstract class!" + this.moduleName || "");
  };
  b.qWidget = a;
  b.extend(b.qWidget.prototype, {init: function () {
    this.initData();
  }, initData: function () {
    var c = this;
    b.getJSON(this.getUrl(), function (d) {
      c.rawModelData = d;
      if (c.isSuccessStatus(d)) {
        c.success(d.data);
      }
    });
  }, getUrl: function () {
    return this.url.indexOf("?") > -1 ? (this.url + "&callback=?") : (this.url + "callback=?");
  }, isSuccessStatus: function (c) {
    return c.ret == 1;
  }, success: function (g, j, f) {
    try {
      var i = this.format(g);
      var c = QTMPL[this.moduleName].render(i);
      this.render(c);
      this.setupBoxView();
      this.bindEvent();
    } catch (h) {
      console.log(h);
    }
  }, render: function (c) {
    this.$container.html(c);
    this.$container.show();
  }, setupBoxView: a, bindEvent: a, formate: a});
})(jQuery);
(function (c) {
  c.tabs = {};
  var b = c(document.body);

  function d(f) {
    var e = {};
    c("[data-tab]", f).each(function () {
      var g = c(this);
      var h = g.data("tab");
      if (!e[h]) {
        a(f, h, g.data("tab-id"), g.data("tab-active"));
        e[h] = true;
      }
    });
  }

  function a(h, i, e, j) {
    if (!i || !e) {
      return;
    }
    var l = j || "active";
    var m = h.find("[data-tab='" + i + "'][data-tab-id='" + e + "']");
    var k = h.find("[data-panel='" + i + "'][data-panel-id='" + e + "']");
    if (m.hasClass(l) && k.is(":visible")) {
      return;
    }
    var f;
    (f = h.find("[data-tab='" + i + "']")).removeClass(l);
    m.addClass(l);
    h.find("[data-panel='" + i + "']").hide().removeClass("js-transition-after js-transition-before");
    k.addClass("js-transition-before");
    k.show();
    setTimeout(function () {
      k.addClass("js-transition-after");
    }, 20);
    var g = h.find("[data-tab='" + i + "'][data-tab-id='" + e + "']:radio");
    if (g.length) {
      g.attr("checked", "checked");
    }
    c.tabs[i] = e;
    c(c.tabs).trigger(i + "-change", [e, m, k, f]);
  }

  c.tabs.changeTab = a;
  c.tabs.init = function (e, g) {
    var f = e || b;
    var g = g || "click";
    d(f);
    f.delegate("[data-tab]", g, function (i) {
      var j = c(this).data("tab");
      var h = c(this).data("tab-id");
      var k = c(this).data("tab-active");
      a(f, j, h, k);
      i.stopPropagation();
    });
  };
})(jQuery);
(function (d) {
  var f = document;
  var h = ".";
  var c = "beforeSwitch";
  var e = "switch";
  var b = "afterSwitch";
  var g = "able-switchable-";
  d.extend({able: {Switchable: a}});
  SP = a.prototype;
  a.Plugins = [];
  function a(k, j) {
    var i = this;
    i.config = d.extend({}, d.fn.switchable.defaults, j || {});
    i.$container = k;
    i._init();
  }

  d.extend(SP, {_init: function () {
    var i = this, j = i.config;
    i.activeIndex = j.activeIndex;
    i.$evtBDObject = d("<div />");
    i._parseStructure();
    if (j.hasTriggers) {
      i._bindTriggers();
    }
    d.each(a.Plugins, function () {
      this._init(i);
    });
  }, _parseStructure: function () {
    var i = this, k = i.$container, j = i.config;
    switch (j.type) {
      case 0:
        i.$triggers = k.find(h + j.navCls).children();
        i.$panels = k.find(h + j.contentCls).children();
        break;
      case 1:
        i.$triggers = k.find(h + j.triggerCls);
        i.$panels = k.find(h + j.panelCls);
        break;
    }
    i.viewLength = i.$panels.length / j.step;
  }, _bindTriggers: function () {
    var i = this, k = i.config, j = i.$triggers, l = k.events;
    j.each(function (n, m) {
      if (d.inArray("click", l) !== -1) {
        d(m).click(function (o) {
          if (i.activeIndex === n) {
            return i;
          }
          if (i.switchTimer) {
            clearTimeout(i.switchTimer);
          }
          i.switchTimer = setTimeout(function () {
            i.switchTo(n);
          }, k.delay * 1000);
          o.stopPropagation();
        });
      }
      if (d.inArray("hover", l) !== -1) {
        d(m).hover(function (o) {
          if (i.activeIndex === n) {
            return i;
          }
          if (i.switchTimer) {
            clearTimeout(i.switchTimer);
          }
          i.switchTimer = setTimeout(function () {
            i.switchTo(n);
          }, k.delay * 1000);
        }, function (o) {
          if (i.switchTimer) {
            clearTimeout(i.switchTimer);
          }
          o.stopPropagation();
        });
      }
    });
  }, beforeSwitch: function (i) {
    if (d.isFunction(i)) {
      this.$evtBDObject.bind(c, i);
    }
  }, afterSwitch: function (i) {
    if (d.isFunction(i)) {
      this.$evtBDObject.bind(b, i);
    }
  }, switchTo: function (l) {
    var p = this, j = p.config, n = d.makeArray(p.$triggers), m = d.makeArray(p.$panels), q = p.activeIndex, i = j.step, o = q * i, k = l * i;
    p.$evtBDObject.trigger(c, [l]);
    if (j.hasTriggers) {
      p._switchTrigger(q > -1 ? n[q] : null, n[l]);
    }
    p._switchView(m.slice(o, o + i), m.slice(k, k + i), l);
    p.activeIndex = l;
    p.$evtBDObject.trigger(b, [l]);
  }, prev: function () {
    var j = this, i = j.activeIndex;
    j.switchTo(i > 0 ? i - 1 : j.viewLength - 1);
  }, next: function () {
    var j = this, i = j.activeIndex;
    j.switchTo(i < j.viewLength - 1 ? i + 1 : 0);
  }, _switchTrigger: function (k, i) {
    var j = this.config.activeTriggerCls;
    if (k) {
      d(k).removeClass(j);
    }
    d(i).addClass(j);
  }, _switchView: function (k, j, i) {
    d.each(k, function () {
      d(this).hide();
    });
    d.each(j, function () {
      d(this).show();
    });
  }});
  d.fn.switchable = function (i) {
    var j = this;
    var k = j.data("switchables");
    j.data("switchables", k ? k : []);
    return j.each(function () {
      j.data("switchables").push(new a(d(this), i));
    });
  };
  d.fn.switchable.defaults = {type: 0, navCls: g + "nav", contentCls: g + "content", triggerCls: g + "trigger", panelCls: g + "panel", hasTriggers: true, activeIndex: 0, activeTriggerCls: "active", events: ["click", "hover"], step: 1, delay: 0.1, viewSize: []};
})(jQuery);
(function (g) {
  var i;
  var f = "display";
  var a = "block";
  var p = "opacity";
  var n = "z-index";
  var j = "position";
  var h = "relative";
  var e = "absolute";
  var c = "scrollx";
  var b = "scrolly";
  var k = "none";
  var d = "fade";
  var m = "liner";
  var l = "swing";
  var o = g.able.Switchable;
  g.extend(g.fn.switchable.defaults, {effect: "none", duration: 0.5, easing: m, circle: false, viewportLen: null});
  o.Effects = {none: function (r, q, s) {
    g.each(r, function () {
      g(this).hide();
    });
    g.each(q, function () {
      g(this).show();
    });
    s();
  }, fade: function (v, u, w) {
    if (v.length !== 1) {
      return;
    }
    var q = this, s = q.config, r = v[0], t = u[0];
    if (q.$anim) {
      q.$anim.clearQueue();
    }
    g(t).css(p, 1);
    if (r === t) {
      return;
    }
    q.$anim = g(r).animate({opacity: 0, duration: s.duration, easing: s.easing}, function () {
      q.$anim = null;
      g(t).css(n, 9);
      g(r).css(n, 1);
      w();
    });
  }, scroll: function (q, t, A, y) {
    var B = this, r = B.config, C = r.effect === c, z = B.viewSize[C ? 0 : 1] * y, v = {};
    var u = y == 0 && B.activeIndex == B.viewLength - 1, s = y == B.viewLength - 1 && B.activeIndex == 0, x, w = B.viewSize[C ? 0 : 1] * B.viewLength;
    if (u) {
      x = z;
      z = w;
    } else {
      if (s) {
        B.$panels.parent().css(C ? "left" : "top", -w);
      }
    }
    v[C ? "left" : "top"] = -z;
    g.extend(v, {duration: r.duration, easing: r.easing});
    if (B.$anim) {
      B.$anim.clearQueue();
    }
    B.$anim = B.$panels.parent().animate(v, r.duration * 1000, function () {
      if (u) {
        B.$panels.parent().css(C ? "left" : "top", x);
      }
      B.$anim = null;
      A();
    });
  }};
  i = o.Effects;
  i[c] = i[b] = i.scroll;
  o.Plugins.push({name: "effect", _init: function (x) {
    var s = x.config, z = s.effect, q = x.$panels, r = s.step, y = x.activeIndex, v = y * r, t = v + r - 1, w = q.length;
    s.viewportLen = s.viewportLen || s.step;
    x.viewSize = [s.viewSize[0] || q.outerWidth(true) * r, s.viewSize[1] || q.outerHeight(true) * r];
    if (z !== k) {
      q.css(f, a);
      switch (z) {
        case c:
        case b:
          q.parent().css("position", e);
          q.parent().parent().css("position", h);
          if (z === c) {
            q.css("float", "left");
            q.parent().css("width", x.viewSize[0] * x.viewLength + "px");
            q.parent().css("width", x.viewSize[0] * (x.viewLength + (s.viewportLen || 1)) + "px");
          }
          var u;
          if (s.circle) {
            u = q.slice(0, s.viewportLen);
            u.parent().append(u.clone());
          }
          u = null;
          break;
        case d:
          q.each(function (A) {
            g(this).css({opacity: (A >= v && A <= t) ? 1 : 0, position: e, zIndex: (A >= v && A <= t) ? 9 : 1});
          });
          break;
      }
    }
  }});
  g.extend(o.prototype, {_switchView: function (w, v, s) {
    var q = this, r = q.config, u = r.effect, t = g.isFunction(u) ? u : i[u];
    t.call(q, w, v, function () {
    }, s);
  }});
})(jQuery);
(function (g) {
  g.qdatepicker = {};
  var s = g.qdatepicker.ROOT_KEY = "q-datepicker";
  var k;
  var b = 0;
  var d = {"2013-01-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元旦", holidayClass: "yuandan"}, "2013-02-09": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "除夕", holidayClass: "chuxi"}, "2013-02-10": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "春节", holidayClass: "chunjie"}, "2013-02-11": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "正月初二", holidayClass: "chunjie"}, "2013-02-12": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "正月初三", holidayClass: "chunjie"}, "2013-02-24": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元宵", holidayClass: "yuanxiao"}, "2013-04-04": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "清明", holidayClass: "qingming"}, "2013-05-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "五一", holidayClass: "laodong"}, "2013-06-12": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "端午", holidayClass: "duanwu"}, "2013-09-10": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "教师"}, "2013-09-19": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "中秋", holidayClass: "zhongqiu"}, "2013-10-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "国庆", holidayClass: "guoqing"}, "2013-12-25": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "圣诞", holidayClass: "shengdan"}, "2014-01-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元旦", holidayClass: "yuandan"}, "2014-01-30": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "除夕", holidayClass: "chuxi"}, "2014-01-31": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "春节", holidayClass: "chunjie"}, "2014-02-14": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元宵", holidayClass: "yuanxiao"}, "2014-04-05": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "清明", holidayClass: "qingming"}, "2014-05-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "五一", holidayClass: "laodong"}, "2014-06-02": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "端午", holidayClass: "duanwu"}, "2014-09-08": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "中秋", holidayClass: "zhongqiu"}, "2014-10-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "国庆", holidayClass: "guoqing"}, "2014-12-25": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "圣诞", holidayClass: "shengdan"}, "2015-01-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元旦", holidayClass: "yuandan"}, "2015-02-18": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "除夕", holidayClass: "chuxi"}, "2015-02-19": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "春节", holidayClass: "chunjie"}, "2015-03-05": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元宵", holidayClass: "yuanxiao"}, "2015-04-05": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "清明", holidayClass: "qingming"}, "2015-05-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "五一", holidayClass: "laodong"}, "2015-06-20": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "端午", holidayClass: "duanwu"}, "2015-09-27": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "中秋", holidayClass: "zhongqiu"}, "2015-10-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "国庆", holidayClass: "guoqing"}, "2015-12-25": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "圣诞", holidayClass: "shengdan"}};
  var o = {week: "周", day: "天", before: "前", after: "后"};
  var n = {LANG: {prev: "", next: "", day_names: ["日", "一", "二", "三", "四", "五", "六"], OUT_OF_RANGE: "超出范围", ERR_FORMAT: "格式错误"}, CLASS: {group: "g", header: "h", calendar: "c", next: "n", prev: "p", title: "t", week: "w", month: "cm_", day_default: "st", day_selected: "st-a", day_othermonth: "st-s", day_today: "st-t", day_hover: "st-h", day_disabled: "st-d", day_round: "st-a-r", day_holiday: "st-holi-", day_area_bg: "st-area"}, WEEKDAYS: 7, STARTDAY: 1, showOtherMonths: false, defaultDay: "", disabledDays: "", customClass: "", customActiveClass: "", multi: 2, showTip: true, linkTo: null, linkRules: "", refObj: null, forceCorrect: true, formatTitle: function (u) {
    return u.getFullYear() + "年" + (u.getMonth() + 1) + "月";
  }, showOnInit: false, showOnFocus: false, container: null, minDate: null, maxDate: null, ui: null, sDay: null, endDay: null, pos: "", parseDate: function (v) {
    var u = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return u ? new Date(u[1], u[2] * 1 - 1, u[3]) : null;
  }, formatDate: function (u) {
    return u.getFullYear() + "-" + c(u.getMonth() + 1, 2) + "-" + c(u.getDate(), 2);
  }, minuteDate: function (v) {
    var u = window.SERVER_TIME || new Date();
    u = new Date(u.getFullYear() + "/" + (u.getMonth() + 1) + "/" + u.getDate());
    return(v - u) / (24 * 60 * 60 * 1000);
  }};
  var i = function () {
    var v = this;
    for (var w = 0, u = arguments.length; w < u; w++) {
      g.each(arguments[w], function (z, y) {
        var x;
        if (v.prototype[z] && jQuery.isFunction(v.prototype[z])) {
          x = v.prototype[z];
        }
        v.prototype[z] = y;
        if (x) {
          v.prototype[z]["_PARENT_"] = x;
        }
      });
    }
    if (!v.prototype.parent) {
      v.prototype.parent = function () {
        return arguments.callee.caller._PARENT_.apply(this, arguments);
      };
    }
  };

  function c(x, w) {
    x = x == null ? "" : x + "";
    for (var v = 0, u = w - x.length; v < u; v++) {
      x = "0" + x;
    }
    return x;
  }

  var j = q(d);

  function l(v) {
    var u = v.split("-");
    return new Date(u[0], u[1] - 1, u[2]);
  }

  function q(F) {
    var w = {};
    for (var E in F) {
      var v = E;
      var A = F[E];
      w[E] = A;
      var z = "";
      var C = "";
      if (A.beforeTime > 0) {
        for (var x = 1; x <= A.beforeTime; x++) {
          var B = {};
          var G = new Date(l(v).getTime() - x * 24 * 3600 * 1000);
          var y = p(G);
          B.holidayName = A.holidayName + o.before + x + o.day;
          B.dayindex = A.dayindex;
          if (!w[y]) {
            w[y] = B;
          } else {
            if ((A.dayindex > w[y].dayindex) && w[y].beforeTime == null) {
              w[y] = B;
            }
          }
        }
      }
      if (A.afterTime > 0) {
        for (var x = 1; x <= A.afterTime; x++) {
          var B = {};
          var D = new Date(l(v).getTime() + x * 24 * 3600 * 1000);
          var u = p(D);
          B.holidayName = A.holidayName + o.after + x + o.day;
          B.dayindex = A.dayindex;
          if (!w[u]) {
            w[u] = B;
          } else {
            if ((A.dayindex > w[u].dayindex) && w[p(new Date(G))].afterTime == null) {
              w[u] = B;
            }
          }
        }
      }
    }
    return w;
  }

  function p(u) {
    if (typeof u == "number") {
      u = new Date(u);
    }
    return u.getFullYear() + "-" + t(u.getMonth() + 1) + "-" + t(u.getDate());
  }

  function t(u) {
    return u < 10 ? "0" + u : u;
  }

  function e(u) {
    u.setHours(0);
    u.setMinutes(0);
    u.setSeconds(0);
    u.setMilliseconds(0);
    return u;
  }

  function h(u) {
    var v = u.offset();
    v.top += u.outerHeight();
    return v;
  }

  function r(w) {
    var u;
    if (w && !w.nodeType) {
      u = jQuery.event.fix(w || window.event).target;
    } else {
      u = w;
    }
    if (!u) {
      return null;
    }
    var v = g(u).parents("." + s);
    return v.size() > 0 ? v.eq(0).data(s) : null;
  }

  function m() {
  }

  m.implement = i;
  g.extend(m.prototype, {isUI: 1, init: function () {
    var u = this, v = this.picker, w = v.ns;
    u.attachedEl = u.attachedEl || new g;
    g(document).bind("mousedown." + w, function (z) {
      var y;
      if ((v.activeEl[0] === z.target && (y = 1)) || (u.attachedEl.index(z.target) != -1 && (y = 2))) {
        if (!v.visible()) {
          v.show(u.getDate());
        } else {
          v.hide();
        }
        if (y == 2) {
          v.activeEl.focus();
        }
        return;
      }
      var A;
      if ((A = r(z)) && A.key === v.key) {
        return;
      } else {
        v.hide();
      }
    });
    var x = function () {
      if (!v.get("container")) {
        v.getContainer().css(h(v.activeEl));
      }
    };
    x();
    g(window).bind("load." + w + " resize." + w, x);
    v.activeEl.bind("focus." + w, function (y) {
      if (v.get("showOnFocus")) {
        v.show(u.getDate());
      }
    });
    v.activeEl.bind("keydown." + w, function (y) {
      switch (y.keyCode) {
        case 40:
          u.setDate(new Date(u.getDate().getTime() + 24 * 60 * 60 * 1000));
          var z = u.validate();
          if (!z.success) {
            return;
          }
          v.show(u.getDate());
          break;
        case 38:
          u.setDate(new Date(u.getDate().getTime() - 24 * 60 * 60 * 1000));
          var z = u.validate();
          if (!z.success) {
            return;
          }
          v.show(u.getDate());
          break;
        case 9:
        case 27:
          v.hide();
          break;
        default:
          u.onKeyDown(y);
      }
    });
  }, _init: function (u) {
    this.picker = u;
  }, select: function (u) {
    this.picker.activeEl.val(this.picker.args.formatDate(u));
  }, change: function (u, v, w) {
    this.draw(v);
  }, posHandler: function (v, u) {
    var z = this.picker.activeEl.attr("data-pos"), y = v, x, w = u.parseDate(this.picker.activeEl.val()).getMonth();
    if (z === "right") {
      if ((this.picker.activeEl.attr("data-prefix") === "返" || this.picker.activeEl.attr("data-prefix") === "离店") && v.getMonth() == w) {
        y = y.getTime() - y.getDate() * 24 * 3600 * 1000;
      }
    }
    if (z === "left" && (this.picker.activeEl.attr("data-prefix") === "返" || this.picker.activeEl.attr("data-prefix") === "离店") && v.getMonth() != u.minDate.getMonth()) {
      y = y.getTime() - y.getDate() * 24 * 3600 * 1000;
    }
    x = new Date(y);
    x.setDate(1);
    return x;
  }, draw: function (y, w) {
    this.drawDate = y;
    e(y);
    var v = this.picker, w = g.extend({}, v.args, w || {}), C = w.multi, A = w.CLASS;
    w.activeDate = w.activeDate || w.parseDate(v.activeEl.val());
    var u = [], B;
    w.count = C;
    B = this.posHandler(y, w);
    u.push('<div class="' + A.group + " " + A.group + C + '">');
    for (var z = 0; z < C; z++) {
      u.push('<div class="' + A.calendar + '" data-index="' + z + '">');
      w.index = z;
      u.push(this._drawTitle(B, w));
      u.push(this._drawBody(B, w));
      u.push('<div class="' + A.month, B.getMonth() + 1, '">' + (B.getMonth() + 1) + "</div>");
      u.push("</div>");
      B.setMonth(B.getMonth() + 1);
    }
    u.push("</div>");
    g(u.join("")).appendTo(v.getContainer().empty());
    this.picker.selectUi();
  }, dispose: function () {
    var u = "." + this.picker.ns;
    g(document).unbind(u);
    g(window).unbind(u);
  }, getDate: function () {
    var u = this.picker.get("parseDate")(this.picker.activeEl.val());
    return u != u ? null : u;
  }, setDate: function (u) {
    this.picker.activeEl.val(this.picker.get("formatDate")(u));
  }, onBeforeDraw: function (w) {
    var u = function (D, C) {
      if (D.getFullYear() > C.getFullYear()) {
        return 1;
      } else {
        if (D.getFullYear() === C.getFullYear()) {
          return(D.getMonth() - C.getMonth()) / (Math.abs(D.getMonth() - C.getMonth()) || 1);
        } else {
          return -1;
        }
      }
    };
    if (this.selectedDate && this.drawDate) {
      w.setTime(this.drawDate.getTime());
    } else {
      var v = this.picker, y = v.get("minDate"), B = v.get("maxDate"), A = v.get("multi");
      var z = new Date(w.getFullYear(), w.getMonth() + A - 1, 1);
      if (B && u(z, B) > 0) {
        for (var x = 1; B && A && A > 1 && A - x > 0; x++) {
          z = new Date(w.getFullYear(), w.getMonth() + A - x - 1, 1);
          if (u(z, B) <= 0) {
            z.setMonth(z.getMonth() - A + 1);
            break;
          }
        }
      } else {
        z = null;
      }
      if (z && (!y || z.getTime() >= y.getTime())) {
        w.setTime(z.getTime());
      }
    }
  }, onKeyDown: function (u) {
  }, onSet: function () {
    this.selectedDate = null;
  }, _drawTitle: function (y, A) {
    var v = A.LANG, D = A.CLASS;
    var B = [];
    var z = A.minDate, u = A.maxDate;
    var C = A.index === 0;
    var w = A.count === A.index + 1;
    B.push('<div class="' + D.header + '">');
    B.push('<span href="#" class="' + D.next + '"', (!u || u.getFullYear() > y.getFullYear() || (u.getFullYear() === y.getFullYear() && u.getMonth() > y.getMonth())) && w ? "" : ' style="display:none;"', " onclick=\"QDP.change( event , '+1M' );return false;\">", v.next, "</span>");
    B.push('<span href="#" class="' + D.prev + '"', (!z || z.getFullYear() < y.getFullYear() || (z.getFullYear() === y.getFullYear() && z.getMonth() < y.getMonth())) && C ? "" : ' style="display:none;"', " onclick=\"QDP.change( event , '-1M' );return false;\">", v.prev, "</span>");
    B.push('<div class="' + D.title + '">', A.formatTitle(y), "</div>");
    B.push("</div>");
    return B.join("");
  }, _drawBody: function (V, y) {
    var S = y.STARTDAY, z = y.WEEKDAYS;
    var G = y.LANG, u = y.CLASS;
    var H = y.activeDate;
    var F = y.minDate, K = y.maxDate;
    if (H && H != H) {
      H = null;
    }
    var v = window.SERVER_TIME || new Date();
    var J = ["<table>", "<thead>", "<tr>"];
    for (var R = 0; R < z; R++) {
      var O = (S + R) % z;
      J.push('<th class="' + u.week + O + '">', G.day_names[O] || "", "</th>");
    }
    J.push("</tr>", "</thead>");
    J.push("<tbody>");
    var D = [];
    var L = V.getFullYear(), W = V.getMonth() + 1;
    var B = new Date(L, W - 1, 1);
    var M = 1, U = new Date(L, W, 0).getDate();
    var w = B.getDay() - S;
    while (w < 0) {
      w += z;
    }
    var N = M - w;
    var X = (z - (((1 - N + U) % z) || z)) + U;
    for (var R = N, Q = 0; R <= X; R++, Q++) {
      var E = new Date(L, W - 1, R);
      if (Q % z == 0) {
        D.push("</tr>", "<tr>");
      }
      var O = (S + Q) % z;
      D.push('<td class="' + u.week + O + " " + u.day_default);
      var A = false;
      if (g.grep(["getFullYear", "getMonth", "getDate"], function (x) {
        return E[x]() == v[x]();
      }).length == 3) {
        D.push(" " + u.day_today);
      }
      if (H != null && H.getTime() == E.getTime()) {
        D.push(" " + u.day_selected);
      }
      var C = false;
      if (R < 1 || R > U) {
        D.push(" " + u.day_othermonth);
        C = true;
      }
      if (F && E.getTime() < F.getTime() || K && E.getTime() > K.getTime() || ~y.disabledDays.toString().indexOf(y.formatDate(E))) {
        if (!C) {
          D.push(" " + u.day_disabled);
        }
        A = true;
      }
      var P = this._getDateClass(E);
      if (P && !C) {
        D.push(" " + P);
      }
      D.push('"');
      if (!A) {
        D.push(' onclick="QDP.select(event,new Date(' + E.getFullYear() + "," + E.getMonth() + "," + E.getDate() + "));", 'return false;"');
      }
      if (!A && !C) {
        D.push(" data-sort=" + y.minuteDate(E) + ">");
      } else {
        D.push('data-info = "disable">');
      }
      if (!C || y.showOtherMonths) {
        D.push('<span class="');
        var I = d[y.formatDate(E)];
        dateText = E.getDate();
        if (!A && I && I.holidayClass) {
          D.push(" " + u.day_holiday + "default");
          D.push(" " + u.day_holiday + I.holidayClass);
          dateText = I.holidayName;
        }
        D.push('">');
        var T = window.SERVER_TIME || new Date();
        if (dateText === T.getDate() && y.minuteDate(E) === 0) {
          dateText = "今天";
        }
        D.push(dateText);
        D.push("</span>");
      } else {
        D.push("&nbsp;");
      }
      D.push("</td>");
    }
    J.push(D.length > 0 ? D.slice(1, -1).join("") : "");
    J.push("</tbody>", "</table>");
    return J.join("");
  }, _getDateClass: function (v) {
    var x = this.picker.args.formatDate(v);
    var w = "";
    var u = parseInt(this.picker.activeEl.val().replace(/-/g, ""));
    var y = parseInt(x.replace(/-/g, ""));
    if (this.picker.get("linkTo") && !this.picker.get("single")) {
      this.picker.args.sDay = this.picker.activeEl.val();
      if (linkedQDP = this.picker.get("linkTo").data(g.qdatepicker.ROOT_KEY)) {
        if (typeof(linkedQDP.activeEl.val()) != "undefined" && x == linkedQDP.activeEl.val()) {
          w = this.addRoundClass("BACK");
          this.picker.args.endDay = linkedQDP.activeEl.val();
        }
      }
      if (y < parseInt(linkedQDP.activeEl.val().replace(/-/g, "")) && y > u) {
        w = this.addRoundClass("AREAR");
      }
    } else {
      if (this.picker.get("refObj")) {
        if (typeof(this.picker.activeEl.val()) != "undefined" && x == this.picker.activeEl.val()) {
          w = this.addRoundClass("BACK");
          this.picker.args.endDay = this.picker.activeEl.val();
        }
        if (refQDP = this.picker.get("refObj").data(g.qdatepicker.ROOT_KEY)) {
          if (typeof(refQDP.activeEl.val()) != "undefined" && x == refQDP.activeEl.val()) {
            w = this.addRoundClass("FROM");
            this.picker.args.sDay = refQDP.activeEl.val();
          }
        }
        if (y > parseInt(refQDP.activeEl.val().replace(/-/g, "")) && y < u) {
          w = this.addRoundClass("AREAR");
        }
      }
    }
    if (d[x]) {
      w += " holi";
    }
    return g.trim(w);
  }});
  function a(v, u) {
    if (!this.init) {
      return new a(v, u);
    } else {
      return this.init(v, u);
    }
  }

  window.QDP = {};
  g.each(["select", "change", "_trigger"], function (w, u) {
    window.QDP[u] = function () {
      if (!arguments[0]) {
        return;
      }
      var v = r(arguments[0]);
      if (v && v[u]) {
        if (u === "select") {
          return v[u].apply(v, Array.prototype.slice.call(arguments));
        } else {
          return v[u].apply(v, Array.prototype.slice.call(arguments, 1));
        }
      }
    };
  });
  g.extend(a.prototype, {init: function (v, u) {
    u = u || {};
    if (u.ui) {
      if (u.ui["isUI"]) {
        this.ui = u.ui;
      } else {
        if (typeof u.ui == "string" && g.qdatepicker.uis[u.ui]) {
          this.ui = new g.qdatepicker.uis[u.ui];
        }
      }
    }
    if (!this.ui) {
      this.ui = new m();
    }
    this.ui._init(this);
    u = this.args = g.extend(true, {}, n, u || {});
    this.key = ++b;
    var w = this.ns = s + this.key;
    var x = this.activeEl = g(v);
    this.el = g('<div class="' + s + (u.customClass ? " " + u.customClass : "") + '"></div>').appendTo(this.args.container || document.body).hide();
    g(this.el).data(s, this);
    this.ui.init();
    this.lastShowedDate = null;
    this.showedDate = null;
    if (u.showOnInit) {
      this.show();
    }
    g.each(u.on || {}, function (z, y) {
      x.bind(z + "." + w, y);
    });
    return this;
  }, _trigger: function () {
    this.activeEl.triggerHandler.apply(this.activeEl, arguments);
  }, select: function () {
    if (arguments.length > 1) {
      var u = arguments[0] || window.event;
      date = arguments[1];
    } else {
      var u = u || window.event;
      date = arguments[0];
    }
    if (u) {
      var v = u.srcElement ? u.srcElement : u.target;
      if (g(v).parents("." + this.args.CLASS.calendar).data("index") === 1) {
        this.activeEl.attr("data-pos", "right");
      }
      if (g(v).parents("." + this.args.CLASS.calendar).data("index") === 0) {
        this.activeEl.attr("data-pos", "left");
      }
    }
    this.ui.select(date);
    this.hide();
    this._trigger("q-datepicker-select", [date]);
  }, _selectTd: function (x, w, v) {
    for (var u = parseInt(x); u < parseInt(w); u++) {
      g("td[data-sort='" + u + "']:not('.st-d')").addClass(n.CLASS.day_area_bg);
    }
  }, selectUi: function () {
    var x = this, C, u, z, A, y, w;
    var v = x.args.minuteDate(new Date(x.activeEl.val().replace(/-/g, "/")));
    var B = x.activeEl[0]["id"];
    y = this.args;
    if (y.sDay) {
      u = y.minuteDate(new Date(y.sDay.replace(/-/g, "/")));
    }
    if (y.endDay) {
      z = y.minuteDate(new Date(y.endDay.replace(/-/g, "/")));
    }
    g('.q-datepicker td:not(".st_d")').bind("mouseover", function (D) {
      if (g(this).data("info") === "disable") {
        return;
      }
      g(this).addClass(y.CLASS.day_hover);
      w = g(this).parents(".ch_sch_form");
      if (w.find("[data-type = 'oneWay']").length < 1) {
        C = parseInt(g(this).attr("data-sort"));
        if (u === z && v === u && x.activeEl.attr("data-prefix") === "往" && C > z) {
          return;
        }
        if (C < z + 1 && v === u) {
          g(".q-datepicker td").removeClass(y.CLASS.day_area_bg);
          g(".q-datepicker td[data-sort='" + u + "']").removeClass(y.CLASS.day_selected);
          if (C === z) {
            x._selectTd(C, z);
          } else {
            x._selectTd(C + 1, z);
          }
        }
        if (C > z && v === u) {
          g(".q-datepicker td").removeClass(y.CLASS.day_area_bg);
          g(".q-datepicker td[data-sort='" + z + "']").removeClass(y.CLASS.day_selected + " " + n.CLASS.day_round);
        }
        if (C > u - 1 && v === z) {
          g(".q-datepicker td").removeClass(y.CLASS.day_area_bg);
          g(".q-datepicker td[data-sort='" + z + "']").removeClass(y.CLASS.day_selected + " " + n.CLASS.day_round);
          if (C === u) {
            x._selectTd(u, C);
          } else {
            x._selectTd(u + 1, C);
          }
        }
        if (u === z && v === u && x.activeEl.attr("data-prefix") === "返") {
          g(".q-datepicker td[data-sort='" + z + "']").addClass(y.CLASS.day_selected + " " + n.CLASS.day_round);
        }
      }
    }).mouseout(function () {
      if (g(this).data("info") === "disable") {
        return;
      }
      g(this).removeClass(y.CLASS.day_hover);
      if (w.find("[data-type = 'oneWay']").length < 1) {
        g(".q-datepicker td").removeClass(y.CLASS.day_area_bg);
        g(".q-datepicker td[data-sort='" + u + "']").addClass(y.CLASS.day_selected);
        g(".q-datepicker td[data-sort='" + z + "']").addClass(y.CLASS.day_round);
        x._selectTd(u + 1, z);
      }
    });
  }, set: function (y, B, A) {
    if (!this.ui.onSet || this.ui.onSet(y, B, A) === false) {
      return;
    }
    if (typeof y === "string") {
      var C = false;
      switch (y) {
        case"container":
          this.el.appendTo(B || document.body);
          this.el.css({top: "", left: ""});
          break;
      }
      for (var x = 0, v = y.split("."), u = v.length, D = this.args; x < u && (x !== u - 1 && (D[v[x]] || (D[v[x]] = {})) || (D[v[x]] = B)); D = D[v[x]], x++) {
      }
    }
    if (A && this.visible()) {
      this._show(this.showedDate);
    }
  }, get: function (y) {
    for (var x = 0, A = this.args, v = y.split("."), u = v.length; x < u && (A = A[v[x]]); x++) {
    }
    return A;
  }, change: function (w) {
    var v = typeof w === "string" ? k(w, this.showedDate) : w;
    var u = this.showedDate;
    this.lastShowedDate = this.showedDate;
    this.showedDate = v;
    this.ui.change(u, v, w);
    this._trigger("q-datepicker-change", [u, v, w]);
  }, show: function (u) {
    var w, v = this.get("minDate"), x = this.get("maxDate");
    if (!u) {
      w = window.SERVER_TIME || new Date();
    } else {
      w = u;
    }
    if (v && w.getTime() < v.getTime()) {
      w.setTime(v.getTime());
    } else {
      if (x && w.getTime() > x.getTime()) {
        w.setTime(x.getTime());
      }
    }
    this.ui.onBeforeDraw(w);
    this._show.call(this, w);
    this._trigger("q-datepicker-show", [u]);
  }, _show: function (u) {
    this.lastShowedDate = this.showedDate;
    this.showedDate = u;
    if (this.ui.draw(u) !== false) {
    }
    this.el.show();
  }, hide: function () {
    if (this.visible()) {
      this.el.hide();
      this._trigger("q-datepicker-hide");
    }
  }, dispose: function () {
    this.ui.dispose();
    this.el.remove();
    this.activeEl.unbind("." + this.ns);
    this._trigger("q-datepicker-dispose");
  }, visible: function () {
    return this.el.is(":visible");
  }, getContainer: function () {
    return this.el;
  }});
  var f = {"+M": function (v, w) {
    var u = v.getDate();
    v.setMonth(v.getMonth() + w);
    if (v.getDate() !== u) {
      v.setDate(0);
    }
  }, "-M": function (v, w) {
    var u = v.getDate();
    v.setMonth(v.getMonth() - w);
    if (v.getDate() !== u) {
      v.setDate(0);
    }
  }, "+D": function (u, v) {
    u.setDate(u.getDate() + v);
  }, "-D": function (u, v) {
    u.setDate(u.getDate() - v);
  }, "+Y": function (u, v) {
    u.setFullYear(u.getFullYear() + v);
  }, "-Y": function (u, v) {
    u.setFullYear(u.getFullYear() - v);
  }};
  g.extend(g.qdatepicker, {uis: [], createUI: function (v, y) {
    var w = y && g.qdatepicker.uis[y] ? g.qdatepicker.uis[y] : m;
    var u = function () {
    };
    g.extend(u, w);
    g.extend(u.prototype = {}, w.prototype);
    if (v) {
      g.qdatepicker.uis[v] = u;
      u.prototype.name = v;
    }
    return u;
  }, calcTime: function (A, v) {
    A = (A || "").toString();
    var y;
    if (v) {
      y = new Date(v.getTime());
    } else {
      y = new Date();
      var z = A.match(/^\d+/);
      if (z) {
        y.setTime(z[0] * 1);
      }
    }
    var x = /([+-])(\d+)([MDY])/g, u;
    while (u = x.exec(A)) {
      var w = u[1] + u[3];
      if (f[w]) {
        f[w](y, u[2] * 1);
      }
    }
    return y;
  }});
  g.qdatepicker.createUI("qunar").implement({init: function () {
    this.parent.apply(this, arguments);
    var v = this, w = this.picker;
    var y = w.get("customActiveClass");
    var x = this.triggerEl = w.activeEl.wrap('<div class="qunar-dp' + (y ? " " + y : "") + '"></div>').before('<div class="dp-prefix"></div><div class="dp-info"><b/><span class="dp-text"></span></div>').parent();
    var u = this.picker.args.prefix || w.activeEl.data("prefix");
    if (u) {
      x.find(".dp-prefix").text(u);
      w.activeEl.css({"margin-left": x.find(".dp-prefix").outerWidth(true) + "px"});
    } else {
      x.find(".dp-prefix").remove();
    }
    w.set("container", x[0]);
    this.attachedEl = this.attachedEl.add(x.find(".dp-info > b , .dp-info")).add(x.find(".dp-info > b , .dp-info > .dp-text "));
    w.activeEl.attr("maxlength", 10);
    w.activeEl.addClass("textbox");
    w.activeEl.bind("keyup." + w.ns, function (z) {
      v.updateTip(v.validate.call(v));
    }).bind("blur." + w.ns, function (z) {
      v.autoCheck.call(v);
    });
    if (w.get("defaultDay") != null) {
      this.setDate(this.getDefaultDate());
    }
    this.updateTip(this.validate());
    this.selectedDate = null;
    this.checkLinked();
    this.forIframe(w);
  }, forIframe: function (u) {
    g(window).bind("blur." + u.ns, function () {
      u.hide();
    });
  }, getDefaultDate: function () {
    var v = this.picker;
    var u = k(v.get("defaultDay"));
    var w = v.get("minDate"), x = v.get("maxDate");
    if (w && w.getTime() > u.getTime() || x && x.getTime() < u.getTime()) {
      u = w || x;
    }
    return u;
  }, checkLinked: function (B) {
    var C = this.picker, u;
    if (!C.get("linkTo") || !(u = C.get("linkTo").data(g.qdatepicker.ROOT_KEY)) || u.ui.name.indexOf("qunar") !== 0) {
      return;
    }
    var w = (C.get("linkRules") || "").split(",");
    var y = this.getDate();
    if (y == null) {
      return;
    }
    if (B) {
      if (B.restPos && B.pos || B.restPos && !u.activeEl.attr("data-pos")) {
        u.activeEl.attr("data-pos", B.restPos);
      }
    }
    var D = {};
    g.each(["ds", "mind", "maxd"], function (G, F) {
      if (w[G]) {
        D[F] = k(w[G], y);
      }
    });
    var A = u.get("strictMinDate"), v = u.get("strictMaxDate");
    if (D.mind || A) {
      var E = (D.mind ? D.mind.getTime() : -1) > (A ? A.getTime() : -1) ? D.mind : A;
      u.set("minDate", E, false);
    }
    if (D.maxd || v) {
      var E = (D.maxd ? D.maxd.getTime() : Number.MAX_VALUE) > (v ? v.getTime() : Number.MAX_VALUE) ? v : D.maxd;
      u.set("maxDate", E, false);
    }
    u.set(null, null, true);
    var x = u.ui.validate();
    if (!x.success && C.get("forceCorrect")) {
      u.select(D.ds);
      u.ui.drawDate = null;
      x = u.ui.validate();
    }
    u.ui.updateTip(x);
    var z = "Y";
    return z;
  }, select: function (v, w) {
    var u = this.picker;
    this.parent.apply(this, arguments);
    this.selectedDate = v;
    if (!w) {
      this.autoCheck();
    }
  }, showText: function (v) {
    var u = this.triggerEl.find(".dp-text");
    u.removeClass("errtext").html(v);
  }, showErrText: function (v) {
    var u = this.triggerEl.find(".dp-text");
    u.addClass("errtext").html(v);
  }, autoCheck: function () {
    var u = this.picker;
    var v = this.validate();
    var w = u.activeEl.attr("data-pos");
    if (!v.success && u.get("forceCorrect")) {
      this.setDate(this.getDefaultDate());
      this.updateTip(this.validate());
    } else {
      if (v.formatted) {
        u.activeEl.val(v.formatted);
      }
      this.updateTip(v);
    }
    this.checkLinked({pos: u.args.pos, restPos: w});
    u.args.pos = "";
  }, updateTip: function (u) {
    if (!this.picker.get("showTip")) {
      return;
    }
    if (!u.success) {
      this.showErrText(u.errmsg);
    } else {
      this.showText(u.daytip);
    }
  }, validate: function () {
    var B = this.picker;
    var x = this.picker.activeEl.val();
    var y = this.getDate();
    var D = this;
    if (this.selectedDate && this.selectedDate.getTime() != y.getTime()) {
      this.selectedDate = null;
    }
    var A = "";
    if (y == null) {
      A = B.get("LANG.ERR_FORMAT");
      B._trigger("q-datepicker-error", ["FORMAT", x]);
    } else {
      var z = B.get("minDate"), u = B.get("maxDate");
      if (z && z.getTime() > y.getTime() || u && u.getTime() < y.getTime()) {
        A = B.get("LANG.OUT_OF_RANGE");
        B.args.pos = "change";
        B._trigger("q-datepicker-error", ["RANGE", x]);
      }
    }
    var v = {success: !A, errmsg: A, formatted: null, daytip: null};
    if (v.success) {
      var w = B.get("formatDate")(y), C;
      switch (B.args.minuteDate(y)) {
        case 0:
          C = "今天";
          break;
        case 1:
          C = "明天";
          break;
        case 2:
          C = "后天";
          break;
        default:
          C = "周" + B.get("LANG.day_names")[y.getDay()];
          break;
      }
      v.daytip = j[w] ? j[w]["holidayName"] : C;
      v.formatted = w;
    }
    return v;
  }, addRoundClass: function (u) {
    if (u == "FROM") {
      return this.picker.get("CLASS")["day_selected"];
    } else {
      if (u == "BACK") {
        return this.picker.get("CLASS")["day_round"];
      } else {
        if (u == "AREAR") {
          return this.picker.get("CLASS")["day_area_bg"];
        }
      }
    }
  }});
  g.fn.qdatepicker = function () {
    if (this[0]) {
      if (arguments.length > 1 && this.data(s)) {
        var v = this.data(s);
        if (arguments[0] === "option" || arguments[0] === "setting") {
          return arguments.length > 2 ? v.set(arguments[1], arguments[2]) : v.get(arguments[1]);
        }
      } else {
        if (arguments.length <= 1) {
          if (this.data(s)) {
            this.data(s).dispose();
            this.removeData(s);
          }
          var u = new a(this[0], arguments[0]);
          this.data(s, u);
        }
      }
    }
    return this;
  };
  k = g.qdatepicker.calcTime;
})(jQuery);
(function (h) {
  h.fdatepicker = {};
  var y = h.fdatepicker.ROOT_KEY = "q-datepicker";
  var p;
  var b = 0;
  var f = {"2013-01-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元旦", holidayClass: "yuandan"}, "2013-02-09": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "除夕", holidayClass: "chuxi"}, "2013-02-10": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "春节", holidayClass: "chunjie"}, "2013-02-11": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "正月初二", holidayClass: "chunjie"}, "2013-02-12": {afterTime: 0, beforeTime: 0, dayindex: 0, holidayName: "正月初三", holidayClass: "chunjie"}, "2013-02-24": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元宵", holidayClass: "yuanxiao"}, "2013-04-04": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "清明", holidayClass: "qingming"}, "2013-05-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "五一", holidayClass: "laodong"}, "2013-06-12": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "端午", holidayClass: "duanwu"}, "2013-09-10": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "教师"}, "2013-09-19": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "中秋", holidayClass: "zhongqiu"}, "2013-10-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "国庆", holidayClass: "guoqing"}, "2013-12-25": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "圣诞", holidayClass: "shengdan"}, "2014-01-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元旦", holidayClass: "yuandan"}, "2014-01-30": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "除夕", holidayClass: "chuxi"}, "2014-01-31": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "春节", holidayClass: "chunjie"}, "2014-02-14": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元宵", holidayClass: "yuanxiao"}, "2014-04-05": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "清明", holidayClass: "qingming"}, "2014-05-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "五一", holidayClass: "laodong"}, "2014-06-02": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "端午", holidayClass: "duanwu"}, "2014-09-08": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "中秋", holidayClass: "zhongqiu"}, "2014-10-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "国庆", holidayClass: "guoqing"}, "2014-12-25": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "圣诞", holidayClass: "shengdan"}, "2015-01-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元旦", holidayClass: "yuandan"}, "2015-02-18": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "除夕", holidayClass: "chuxi"}, "2015-02-19": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "春节", holidayClass: "chunjie"}, "2015-03-05": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "元宵", holidayClass: "yuanxiao"}, "2015-04-05": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "清明", holidayClass: "qingming"}, "2015-05-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "五一", holidayClass: "laodong"}, "2015-06-20": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "端午", holidayClass: "duanwu"}, "2015-09-27": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "中秋", holidayClass: "zhongqiu"}, "2015-10-01": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "国庆", holidayClass: "guoqing"}, "2015-12-25": {afterTime: 3, beforeTime: 3, dayindex: 0, holidayName: "圣诞", holidayClass: "shengdan"}};
  var t = {week: "周", day: "天", before: "前", after: "后"};
  var k = ["1周之内", "1个月内", "3个月内", "半年内", "1年"];
  var i = ["+1周", "+2周", "1个月内", "3个月内", "1年"];
  var x = {"1周之内": {valid: true, value: "1周之内", range: 7}, "2周之内": {valid: true, value: "2周之内", range: 14}, "+1周": {valid: false, value: "2周之内", range: 14}, "+2周": {valid: false, value: "3周之内", range: 21}, "3周之内": {valid: true, value: "3周之内", range: 21}, "1个月内": {valid: true, value: "1个月内", range: 30}, "3个月内": {valid: true, value: "3个月内", range: 90}, "半年内": {valid: true, value: "半年内", range: 180}, "1年": {valid: true, value: "1年", range: 360}};
  var s = {LANG: {prev: "", next: "", day_names: ["日", "一", "二", "三", "四", "五", "六"], OUT_OF_RANGE: "超出范围", ERR_FORMAT: "格式错误"}, CLASS: {group: "g", header: "h", calendar: "c", next: "n", prev: "p", title: "t", week: "w", month: "cm_", day_default: "st", day_selected: "st-a", day_othermonth: "st-s", day_today: "st-t", day_hover: "st-h", day_disabled: "st-d", day_round: "st-a-r", day_holiday: "st-holi-", day_area_bg: "st-area"}, WEEKDAYS: 7, STARTDAY: 1, showOtherMonths: false, defaultDay: "", disabledDays: "", customClass: "", customActiveClass: "", multi: 2, showTip: true, linkTo: null, linkRules: "", refObj: null, forceCorrect: true, formatTitle: function (A) {
    return A.getFullYear() + "年" + (A.getMonth() + 1) + "月";
  }, showOnInit: false, showOnFocus: false, container: null, minDate: null, maxDate: null, ui: null, sDay: null, endDay: null, pos: "", parseDate: function (B) {
    var A = B.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return A ? new Date(A[1], A[2] * 1 - 1, A[3]) : null;
  }, formatDate: function (A) {
    return A.getFullYear() + "-" + d(A.getMonth() + 1, 2) + "-" + d(A.getDate(), 2);
  }, minuteDate: function (B) {
    var A = window.SERVER_TIME || new Date();
    A = new Date(A.getFullYear() + "/" + (A.getMonth() + 1) + "/" + A.getDate());
    return(B - A) / (24 * 60 * 60 * 1000);
  }, today: function () {
    var A = window.SERVER_TIME || new Date();
    A = new Date(A.getFullYear() + "/" + (A.getMonth() + 1) + "/" + A.getDate());
    return this.formatDate(A);
  }, plus: function (A, B) {
    return new Date(A.getTime() + B * 24 * 60 * 60 * 1000);
  }};
  var l = function () {
    var B = this;
    for (var C = 0, A = arguments.length; C < A; C++) {
      h.each(arguments[C], function (F, E) {
        var D;
        if (B.prototype[F] && jQuery.isFunction(B.prototype[F])) {
          D = B.prototype[F];
        }
        B.prototype[F] = E;
        if (D) {
          B.prototype[F]["_PARENT_"] = D;
        }
      });
    }
    if (!B.prototype.parent) {
      B.prototype.parent = function () {
        return arguments.callee.caller._PARENT_.apply(this, arguments);
      };
    }
  };

  function d(D, C) {
    D = D == null ? "" : D + "";
    for (var B = 0, A = C - D.length; B < A; B++) {
      D = "0" + D;
    }
    return D;
  }

  var o = v(f);

  function c(C) {
    var B = window.SERVER_TIME || new Date();
    var A = x[C];
    if (A) {
      A.startDate = new Date(B.getTime() + 24 * 3600 * 1000);
      A.endDate = new Date(B.getTime() + A.range * 24 * 3600 * 1000);
    }
    return A;
  }

  function n() {
    return k;
  }

  function m() {
    return i;
  }

  function q(B) {
    var A = B.split("-");
    return new Date(A[0], A[1] - 1, A[2]);
  }

  function v(L) {
    var C = {};
    for (var K in L) {
      var B = K;
      var G = L[K];
      C[K] = G;
      var F = "";
      var I = "";
      if (G.beforeTime > 0) {
        for (var D = 1; D <= G.beforeTime; D++) {
          var H = {};
          var M = new Date(q(B).getTime() - D * 24 * 3600 * 1000);
          var E = u(M);
          H.holidayName = G.holidayName + t.before + D + t.day;
          H.dayindex = G.dayindex;
          if (!C[E]) {
            C[E] = H;
          } else {
            if ((G.dayindex > C[E].dayindex) && C[E].beforeTime == null) {
              C[E] = H;
            }
          }
        }
      }
      if (G.afterTime > 0) {
        for (var D = 1; D <= G.afterTime; D++) {
          var H = {};
          var J = new Date(q(B).getTime() + D * 24 * 3600 * 1000);
          var A = u(J);
          H.holidayName = G.holidayName + t.after + D + t.day;
          H.dayindex = G.dayindex;
          if (!C[A]) {
            C[A] = H;
          } else {
            if ((G.dayindex > C[A].dayindex) && C[u(new Date(M))].afterTime == null) {
              C[A] = H;
            }
          }
        }
      }
    }
    return C;
  }

  function u(A) {
    if (typeof A == "number") {
      A = new Date(A);
    }
    return A.getFullYear() + "-" + z(A.getMonth() + 1) + "-" + z(A.getDate());
  }

  function z(A) {
    return A < 10 ? "0" + A : A;
  }

  function e(A) {
    A.setHours(0);
    A.setMinutes(0);
    A.setSeconds(0);
    A.setMilliseconds(0);
    return A;
  }

  function j(A) {
    var B = A.offset();
    B.top += A.outerHeight();
    return B;
  }

  function w(C) {
    var A;
    if (C && !C.nodeType) {
      A = jQuery.event.fix(C || window.event).target;
    } else {
      A = C;
    }
    if (!A) {
      return null;
    }
    var B = h(A).parents("." + y);
    return B.size() > 0 ? B.eq(0).data(y) : null;
  }

  function r() {
  }

  r.implement = l;
  h.extend(r.prototype, {isUI: 1, init: function () {
    var A = this, B = this.picker, C = B.ns;
    A.attachedEl = A.attachedEl || new h;
    h(document).bind("mousedown." + C, function (F) {
      var E, H;
      if ((B.activeEl[0] === F.target && (E = 1)) || (A.attachedEl.index(F.target) != -1 && (E = 2))) {
        if (!B.visible()) {
          H = c(B.activeEl.val());
          A.drawDate = H ? H.startDate : A.drawDate;
          B.show(A.getDate());
        } else {
          B.hide();
        }
        if (E == 2) {
          B.activeEl.focus();
        }
        return;
      }
      var G;
      if ((G = w(F)) && G.key === B.key) {
        return;
      } else {
        B.hide();
      }
    });
    var D = function () {
      if (!B.get("container")) {
        B.getContainer().css(j(B.activeEl));
      }
    };
    D();
    h(window).bind("load." + C + " resize." + C, D);
    B.activeEl.bind("focus." + C, function (E) {
      if (B.get("showOnFocus")) {
        B.show(A.getDate());
      }
    });
    B.activeEl.bind("keydown." + C, function (E) {
      switch (E.keyCode) {
        case 40:
          A.setDate(new Date(A.getDate().getTime() + 24 * 60 * 60 * 1000));
          var F = A.validate();
          if (!F.success) {
            return;
          }
          B.show(A.getDate());
          break;
        case 38:
          A.setDate(new Date(A.getDate().getTime() - 24 * 60 * 60 * 1000));
          var F = A.validate();
          if (!F.success) {
            return;
          }
          B.show(A.getDate());
          break;
        case 9:
        case 27:
          B.hide();
          break;
        default:
          A.onKeyDown(E);
      }
    });
  }, _init: function (A) {
    this.picker = A;
  }, select: function (A) {
    this.picker.activeEl.val(this.picker.args.formatDate(A));
  }, change: function (A, B, C) {
    this.draw(B);
  }, posHandler: function (B, A) {
    var G = this.picker.activeEl.attr("data-pos"), F = B, E, C = A.parseDate(this.picker.activeEl.val()), D = C ? C.getMonth() : (window.SERVER_TIME || new B()).getMonth();
    if (G === "right") {
      if ((this.picker.activeEl.attr("data-prefix") === "返" || this.picker.activeEl.attr("data-prefix") === "离店") && B.getMonth() == D) {
        F = F.getTime() - F.getDate() * 24 * 3600 * 1000;
      }
    }
    if (G === "left" && (this.picker.activeEl.attr("data-prefix") === "返" || this.picker.activeEl.attr("data-prefix") === "离店") && B.getMonth() != A.minDate.getMonth()) {
      F = F.getTime() - F.getDate() * 24 * 3600 * 1000;
    }
    E = new Date(F);
    E.setDate(1);
    return E;
  }, draw: function (B, G) {
    this.drawDate = B;
    e(B);
    var F = this.picker, G = h.extend({}, F.args, G || {}), E = G.multi, I = G.CLASS, C = c(F.activeEl.val());
    G.activeDate = G.activeDate || G.parseDate(F.activeEl.val()) || (C && C.startDate);
    var H = [], A;
    G.count = E;
    A = this.posHandler(B, G);
    H.push('<div class="' + I.group + " " + I.group + E + '">');
    for (var D = 0; D < E; D++) {
      H.push('<div class="' + I.calendar + '" data-index="' + D + '">');
      G.index = D;
      H.push(this._drawTitle(A, G));
      H.push(this._drawBody(A, G));
      H.push('<div class="' + I.month, A.getMonth() + 1, '">' + (A.getMonth() + 1) + "</div>");
      H.push("</div>");
      A.setMonth(A.getMonth() + 1);
    }
    this.picker.isFuzzy && H.push(this._drawFuzzyDate());
    H.push("</div>");
    h(H.join("")).appendTo(F.getContainer().empty());
    this.picker.selectUi();
  }, dispose: function () {
    var A = "." + this.picker.ns;
    h(document).unbind(A);
    h(window).unbind(A);
  }, getDate: function () {
    var B = this.picker.activeEl.val();
    var C = c(B);
    var A = C && C.valid ? C.startDate : this.picker.get("parseDate")(B);
    return A != A ? null : A;
  }, setDate: function (A) {
    this.picker.activeEl.val(this.picker.get("formatDate")(A));
  }, onBeforeDraw: function (C) {
    var A = function (J, I) {
      if (J.getFullYear() > I.getFullYear()) {
        return 1;
      } else {
        if (J.getFullYear() === I.getFullYear()) {
          return(J.getMonth() - I.getMonth()) / (Math.abs(J.getMonth() - I.getMonth()) || 1);
        } else {
          return -1;
        }
      }
    };
    if (this.selectedDate && this.drawDate) {
      C.setTime(this.drawDate.getTime());
    } else {
      var B = this.picker, E = B.get("minDate"), H = B.get("maxDate"), G = B.get("multi");
      var F = new Date(C.getFullYear(), C.getMonth() + G - 1, 1);
      if (H && A(F, H) > 0) {
        for (var D = 1; H && G && G > 1 && G - D > 0; D++) {
          F = new Date(C.getFullYear(), C.getMonth() + G - D - 1, 1);
          if (A(F, H) <= 0) {
            F.setMonth(F.getMonth() - G + 1);
            break;
          }
        }
      } else {
        F = null;
      }
      if (F && (!E || F.getTime() >= E.getTime())) {
        C.setTime(F.getTime());
      }
    }
  }, onKeyDown: function (A) {
  }, onSet: function () {
    this.selectedDate = null;
  }, _drawTitle: function (D, F) {
    var B = F.LANG, I = F.CLASS;
    var G = [];
    var E = F.minDate, A = F.maxDate;
    var H = F.index === 0;
    var C = F.count === F.index + 1;
    G.push('<div class="' + I.header + '">');
    G.push('<span href="#" class="' + I.next + '"', (!A || A.getFullYear() > D.getFullYear() || (A.getFullYear() === D.getFullYear() && A.getMonth() > D.getMonth())) && C ? "" : ' style="display:none;"', " onclick=\"QDP.change( event , '+1M' );return false;\">", B.next, "</span>");
    G.push('<span href="#" class="' + I.prev + '"', (!E || E.getFullYear() < D.getFullYear() || (E.getFullYear() === D.getFullYear() && E.getMonth() < D.getMonth())) && H ? "" : ' style="display:none;"', " onclick=\"QDP.change( event , '-1M' );return false;\">", B.prev, "</span>");
    G.push('<div class="' + I.title + '">', F.formatTitle(D), "</div>");
    G.push("</div>");
    return G.join("");
  }, _drawBody: function (aa, D) {
    var X = D.STARTDAY, E = D.WEEKDAYS;
    var L = D.LANG, A = D.CLASS;
    var M = D.activeDate;
    var K = D.minDate, P = D.maxDate;
    if (M && M != M) {
      M = null;
    }
    var B = window.SERVER_TIME || new Date();
    var O = ["<table>", "<thead>", "<tr>"];
    for (var W = 0; W < E; W++) {
      var T = (X + W) % E;
      O.push('<th class="' + A.week + T + '">', L.day_names[T] || "", "</th>");
    }
    O.push("</tr>", "</thead>");
    O.push("<tbody>");
    var I = [];
    var Q = aa.getFullYear(), ab = aa.getMonth() + 1;
    var G = new Date(Q, ab - 1, 1);
    var R = 1, Z = new Date(Q, ab, 0).getDate();
    var C = G.getDay() - X;
    while (C < 0) {
      C += E;
    }
    var S = R - C;
    var ac = (E - (((1 - S + Z) % E) || E)) + Z;
    for (var W = S, V = 0; W <= ac; W++, V++) {
      var J = new Date(Q, ab - 1, W);
      if (V % E == 0) {
        I.push("</tr>", "<tr>");
      }
      var T = (X + V) % E;
      I.push('<td class="' + A.week + T + " " + A.day_default);
      var F = false;
      if (h.grep(["getFullYear", "getMonth", "getDate"], function (ad) {
        return J[ad]() == B[ad]();
      }).length == 3) {
        I.push(" " + A.day_today);
      }
      if (M != null && M.getTime() == J.getTime()) {
        I.push(" " + A.day_selected);
      }
      var H = false;
      if (W < 1 || W > Z) {
        I.push(" " + A.day_othermonth);
        H = true;
      }
      if (K && J.getTime() < K.getTime() || P && J.getTime() > P.getTime() || ~D.disabledDays.toString().indexOf(D.formatDate(J))) {
        if (!H) {
          I.push(" " + A.day_disabled);
        }
        F = true;
      }
      var U = this._getDateClass(J);
      if (U && !H) {
        I.push(" " + U);
      }
      I.push('"');
      if (!F) {
        I.push(' onclick="QDP.select(event,new Date(' + J.getFullYear() + "," + J.getMonth() + "," + J.getDate() + "));", 'return false;"');
      }
      if (!F && !H) {
        I.push(" data-sort=" + D.minuteDate(J) + ">");
      } else {
        I.push('data-info = "disable">');
      }
      if (!H || D.showOtherMonths) {
        I.push('<span class="');
        var N = f[D.formatDate(J)];
        dateText = J.getDate();
        if (!F && N && N.holidayClass) {
          I.push(" " + A.day_holiday + "default");
          I.push(" " + A.day_holiday + N.holidayClass);
          dateText = N.holidayName;
        }
        I.push('">');
        var Y = window.SERVER_TIME || new Date();
        if (dateText === Y.getDate() && D.minuteDate(J) === 0) {
          dateText = "今天";
        }
        I.push(dateText);
        I.push("</span>");
      } else {
        I.push("&nbsp;");
      }
      I.push("</td>");
    }
    O.push(I.length > 0 ? I.slice(1, -1).join("") : "");
    O.push("</tbody>", "</table>");
    return O.join("");
  }, _drawFuzzyDate: function () {
    var A = [], B = this, D, C, E, F;
    A.push('<div class="fuzzy_t_box">');
    A.push(' <ul class="fuzzy_t_list clrfix">');
    C = B.picker.activeEl.val();
    D = c(C) ? C : "";
    F = this.picker.get("refObj") && this.picker.activeEl.val() == "1周之内";
    E = F ? m() : n();
    h.each(E, function (G, H) {
      var I = c(H);
      _class = D == H ? "st-h" : "";
      A.push('<li data-value="', I.value, '" class="', _class, '" data-range="', I.range, '"');
      A.push('onclick="QDP.fuzzyselect(event,new Date(' + I.startDate.getFullYear() + "," + I.startDate.getMonth() + "," + I.startDate.getDate() + "));", 'return false;"');
      A.push(">", H, "</li>");
    });
    A.push(" </ul>");
    A.push("</div>");
    return A.join("");
  }, _getDateClass: function (F) {
    var E = this.picker.args.formatDate(F);
    var K = "";
    var C = this.picker.activeEl.val();
    var J = c(C);
    var D = J ? this.picker.args.formatDate(J.startDate) : C;
    var M = parseInt(E.replace(/-/g, ""), 10);
    var G = parseInt(D.replace(/-/g, ""), 10);
    var I, H, L, B, A;
    if (this.picker.get("linkTo")) {
      B = this.picker.get("linkTo").data(h.qdatepicker.ROOT_KEY);
      this.picker.args.sDay = D;
      I = B.activeEl.val();
      H = c(I);
      L = H ? this.picker.args.formatDate(H.endDate) : I;
      if (B) {
        if (typeof(B.activeEl.val()) != "undefined" && E == L) {
          K = this.addRoundClass("BACK");
          this.picker.args.endDay = L;
        }
      }
      if (M < parseInt(L.replace(/-/g, "")) && M > G) {
        K = this.addRoundClass("AREAR");
      }
    } else {
      if (this.picker.get("refObj")) {
        A = this.picker.get("refObj").data(h.qdatepicker.ROOT_KEY);
        I = A.activeEl.val();
        H = c(I);
        L = H ? this.picker.args.formatDate(H.startDate) : I;
        D = J ? this.picker.args.formatDate(J.endDate) : C;
        G = parseInt(D.replace(/-/g, ""), 10);
        if (typeof(this.picker.activeEl.val()) != "undefined" && E == D) {
          K = this.addRoundClass("BACK");
          this.picker.args.endDay = D;
        }
        if (A) {
          if (typeof(A.activeEl.val()) != "undefined" && E == L) {
            K = this.addRoundClass("FROM");
            this.picker.args.sDay = L;
          }
        }
        if (M > parseInt(L.replace(/-/g, "")) && M < G) {
          K = this.addRoundClass("AREAR");
        }
      } else {
        if (J && M > G) {
          L = parseInt(this.picker.args.formatDate(J.endDate).replace(/-/g, ""));
          if (M < L) {
            K = this.addRoundClass("AREAR");
          } else {
            if (M == L) {
              K = this.addRoundClass("FROM");
              this.picker.args.endDay = this.picker.args.formatDate(J.endDate);
            }
          }
          this.picker.args.sDay = this.picker.args.formatDate(J.startDate);
        }
      }
    }
    if (f[E]) {
      K += " holi";
    }
    return h.trim(K);
  }});
  function a(B, A) {
    if (!this.init) {
      return new a(B, A);
    } else {
      return this.init(B, A);
    }
  }

  window.QDP = {};
  h.each(["select", "change", "_trigger", "fuzzyselect"], function (B, A) {
    window.QDP[A] = function () {
      if (!arguments[0]) {
        return;
      }
      var C = w(arguments[0]);
      if (C && C[A]) {
        if (A === "select" || A === "fuzzyselect") {
          return C[A].apply(C, Array.prototype.slice.call(arguments));
        } else {
          return C[A].apply(C, Array.prototype.slice.call(arguments, 1));
        }
      }
    };
  });
  h.extend(a.prototype, {init: function (B, A) {
    A = A || {};
    if (A.ui) {
      if (A.ui["isUI"]) {
        this.ui = A.ui;
      } else {
        if (typeof A.ui == "string" && h.fdatepicker.uis[A.ui]) {
          this.ui = new h.fdatepicker.uis[A.ui];
        }
      }
    }
    if (!this.ui) {
      this.ui = new r();
    }
    this.ui._init(this);
    A = this.args = h.extend(true, {}, s, A || {});
    this.key = ++b;
    var C = this.ns = y + this.key;
    var D = this.activeEl = h(B);
    this.el = h('<div class="' + y + (A.customClass ? " " + A.customClass : "") + '"></div>').appendTo(this.args.container || document.body).hide();
    h(this.el).data(y, this);
    this.ui.init();
    this.lastShowedDate = null;
    this.showedDate = null;
    if (A.showOnInit) {
      this.show();
    }
    h.each(A.on || {}, function (F, E) {
      D.bind(F + "." + C, E);
    });
    return this;
  }, _trigger: function () {
    this.activeEl.triggerHandler.apply(this.activeEl, arguments);
  }, select: function () {
    if (arguments.length > 1) {
      var A = arguments[0] || window.event;
      date = arguments[1];
    } else {
      var A = A || window.event;
      date = arguments[0];
    }
    if (A) {
      var B = A.srcElement ? A.srcElement : A.target;
      if (h(B).parents("." + this.args.CLASS.calendar).data("index") === 1) {
        this.activeEl.attr("data-pos", "right");
      }
      if (h(B).parents("." + this.args.CLASS.calendar).data("index") === 0) {
        this.activeEl.attr("data-pos", "left");
      }
    }
    this.ui.select(date);
    this.hide();
    this._trigger("q-datepicker-select", [date]);
  }, setFuzzy: function (A) {
    this.isFuzzy = A;
  }, fuzzyselect: function () {
    var A = arguments[0].srcElement || arguments[0].target, C, B;
    this.activeEl.attr("data-pos", "left");
    B = h(A).data("value");
    this.activeEl.val(B);
    this.ui.fuzzyselect(arguments[1]);
    this.hide();
    if (this.get("linkTo")) {
      C = this.get("linkTo").data(h.qdatepicker.ROOT_KEY);
      C.activeEl.val(B) && C.ui.fuzzyselect(arguments[1]);
    } else {
      if (this.get("refObj")) {
        C = this.get("refObj").data(h.qdatepicker.ROOT_KEY);
        if (C.activeEl.val().indexOf("周") != -1 && B.indexOf("周") != -1) {
          return;
        }
        C.activeEl.val(B);
        C.ui.fuzzyselect(arguments[1]);
      }
    }
  }, _selectTd: function (D, C, B) {
    for (var A = parseInt(D); A < parseInt(C); A++) {
      h("td[data-sort='" + A + "']:not('.st-d')").addClass(s.CLASS.day_area_bg);
    }
  }, selectUi: function () {
    var J = this, O, A, L, K, H, B, D;
    D = J.activeEl.val();
    var F = J.args.minuteDate(new Date(D.replace(/-/g, "/")));
    var M = J.activeEl[0]["id"];
    var G = c(D);
    var C = h(".q-datepicker"), E = C.find("td");
    K = this.args;
    if (K.sDay) {
      A = K.minuteDate(new Date(K.sDay.replace(/-/g, "/")));
    }
    if (K.endDay) {
      L = K.minuteDate(new Date(K.endDay.replace(/-/g, "/")));
    }
    var N = C.find("td[data-sort='" + A + "']"), I = C.find("td[data-sort='" + L + "']");
    C.find('td:not(".st_d")').bind("mouseover", function (P) {
      if (h(this).data("info") === "disable") {
        return;
      }
      h(this).addClass(K.CLASS.day_hover);
      H = h(this).parents(".ch_sch_form");
      if (!G && H.find("[data-type = 'oneWay']").length < 1) {
        O = parseInt(h(this).attr("data-sort"));
        if (A === L && F === A && J.activeEl.attr("data-prefix") === "往" && O > L) {
          return;
        }
        if (O < L + 1 && F === A) {
          E.removeClass(K.CLASS.day_area_bg);
          N.removeClass(K.CLASS.day_selected);
          if (O === L) {
            J._selectTd(O, L);
          } else {
            J._selectTd(O + 1, L);
          }
        }
        if (O > L && F === A) {
          E.removeClass(K.CLASS.day_area_bg);
          I.removeClass(K.CLASS.day_selected + " " + s.CLASS.day_round);
        }
        if (O > A - 1 && F === L) {
          E.removeClass(K.CLASS.day_area_bg);
          I.removeClass(K.CLASS.day_selected + " " + s.CLASS.day_round);
          if (O === A) {
            J._selectTd(A, O);
          } else {
            J._selectTd(A + 1, O);
          }
        }
        if (A === L && F === A && J.activeEl.attr("data-prefix") === "返") {
          I.addClass(K.CLASS.day_selected + " " + s.CLASS.day_round);
        }
      }
    }).mouseout(function () {
      if (h(this).data("info") === "disable") {
        return;
      }
      h(this).removeClass(K.CLASS.day_hover);
      if (!G && H.find("[data-type = 'oneWay']").length < 1) {
        E.removeClass(K.CLASS.day_area_bg);
        N.addClass(K.CLASS.day_selected);
        I.addClass(K.CLASS.day_round);
        J._selectTd(A + 1, L);
      }
    });
    C.find('li:not(".st-h")').bind("mouseover", function () {
      var P = 1, Q = h(this).attr("data-range");
      H = h(this).parents(".ch_sch_form");
      if (H.find("[data-type = 'oneWay']").length < 1) {
        E.removeClass(K.CLASS.day_area_bg);
        N.removeClass(K.CLASS.day_selected);
        I.removeClass(K.CLASS.day_selected + " " + s.CLASS.day_round);
      } else {
        F && C.find("td[data-sort='" + F + "']").removeClass(K.CLASS.day_selected);
        L && I.removeClass(K.CLASS.day_selected + " " + s.CLASS.day_round);
      }
      h(this).addClass(K.CLASS.day_hover);
      J._selectTd(P + 1, Q);
      C.find("td[data-sort='" + P + "']").addClass(K.CLASS.day_selected);
      C.find("td[data-sort='" + Q + "']").addClass(K.CLASS.day_round);
    }).bind("mouseout", function () {
      var P = 1, Q = h(this).attr("data-range");
      H = h(this).parents(".ch_sch_form");
      h(this).removeClass(K.CLASS.day_hover);
      C.find("td").removeClass(K.CLASS.day_area_bg);
      if (H.find("[data-type = 'oneWay']").length < 1) {
        N.addClass(K.CLASS.day_selected);
        I.addClass(K.CLASS.day_round);
        J._selectTd(A + 1, L);
      } else {
        F && C.find("td[data-sort='" + F + "']").addClass(K.CLASS.day_selected);
        J._selectTd(A + 1, L);
        L && I.addClass(K.CLASS.day_round);
      }
      A != P && C.find("td[data-sort='" + P + "']").removeClass(K.CLASS.day_selected);
      L != Q && C.find("td[data-sort='" + Q + "']").removeClass(K.CLASS.day_round);
    });
  }, set: function (D, F, E) {
    if (!this.ui.onSet || this.ui.onSet(D, F, E) === false) {
      return;
    }
    if (typeof D === "string") {
      var G = false;
      switch (D) {
        case"container":
          this.el.appendTo(F || document.body);
          this.el.css({top: "", left: ""});
          break;
      }
      for (var C = 0, B = D.split("."), A = B.length, H = this.args; C < A && (C !== A - 1 && (H[B[C]] || (H[B[C]] = {})) || (H[B[C]] = F)); H = H[B[C]], C++) {
      }
    }
    if (E && this.visible()) {
      this._show(this.showedDate);
    }
  }, get: function (D) {
    for (var C = 0, E = this.args, B = D.split("."), A = B.length; C < A && (E = E[B[C]]); C++) {
    }
    return E;
  }, change: function (C) {
    var B = typeof C === "string" ? p(C, this.showedDate) : C;
    var A = this.showedDate;
    this.lastShowedDate = this.showedDate;
    this.showedDate = B;
    this.ui.change(A, B, C);
    this._trigger("q-datepicker-change", [A, B, C]);
  }, show: function (A) {
    var C, B = this.get("minDate"), D = this.get("maxDate");
    if (!A) {
      C = window.SERVER_TIME || new Date();
    } else {
      C = A;
    }
    if (B && C.getTime() < B.getTime()) {
      C.setTime(B.getTime());
    } else {
      if (D && C.getTime() > D.getTime()) {
        C.setTime(D.getTime());
      }
    }
    this.ui.onBeforeDraw(C);
    this._show.call(this, C);
    this._trigger("q-datepicker-show", [A]);
  }, _show: function (A) {
    this.lastShowedDate = this.showedDate;
    this.showedDate = A;
    if (this.ui.draw(A) !== false) {
    }
    this.el.show();
  }, hide: function () {
    if (this.visible()) {
      this.el.hide();
      this._trigger("q-datepicker-hide");
    }
  }, dispose: function () {
    this.ui.dispose();
    this.el.remove();
    this.activeEl.unbind("." + this.ns);
    this._trigger("q-datepicker-dispose");
  }, visible: function () {
    return this.el.is(":visible");
  }, getContainer: function () {
    return this.el;
  }});
  var g = {"+M": function (B, C) {
    var A = B.getDate();
    B.setMonth(B.getMonth() + C);
    if (B.getDate() !== A) {
      B.setDate(0);
    }
  }, "-M": function (B, C) {
    var A = B.getDate();
    B.setMonth(B.getMonth() - C);
    if (B.getDate() !== A) {
      B.setDate(0);
    }
  }, "+D": function (A, B) {
    A.setDate(A.getDate() + B);
  }, "-D": function (A, B) {
    A.setDate(A.getDate() - B);
  }, "+Y": function (A, B) {
    A.setFullYear(A.getFullYear() + B);
  }, "-Y": function (A, B) {
    A.setFullYear(A.getFullYear() - B);
  }};
  h.extend(h.fdatepicker, {uis: [], createUI: function (B, D) {
    var C = D && h.fdatepicker.uis[D] ? h.fdatepicker.uis[D] : r;
    var A = function () {
    };
    h.extend(A, C);
    h.extend(A.prototype = {}, C.prototype);
    if (B) {
      h.fdatepicker.uis[B] = A;
      A.prototype.name = B;
    }
    return A;
  }, calcTime: function (G, B) {
    G = (G || "").toString();
    var E;
    if (B) {
      E = new Date(B.getTime());
    } else {
      E = new Date();
      var F = G.match(/^\d+/);
      if (F) {
        E.setTime(F[0] * 1);
      }
    }
    var D = /([+-])(\d+)([MDY])/g, A;
    while (A = D.exec(G)) {
      var C = A[1] + A[3];
      if (g[C]) {
        g[C](E, A[2] * 1);
      }
    }
    return E;
  }});
  h.fdatepicker.createUI("qunar").implement({init: function () {
    this.parent.apply(this, arguments);
    var B = this, C = this.picker;
    var E = C.get("customActiveClass");
    var D = this.triggerEl = C.activeEl.wrap('<div class="qunar-dp' + (E ? " " + E : "") + '"></div>').before('<div class="dp-prefix"></div><div class="dp-info"><b/><span class="dp-text"></span></div>').parent();
    var A = this.picker.args.prefix || C.activeEl.data("prefix");
    if (A) {
      D.find(".dp-prefix").text(A);
      C.activeEl.css({"margin-left": D.find(".dp-prefix").outerWidth(true) + "px"});
    } else {
      D.find(".dp-prefix").remove();
    }
    C.set("container", D[0]);
    this.attachedEl = this.attachedEl.add(D.find(".dp-info > b , .dp-info")).add(D.find(".dp-info > b , .dp-info > .dp-text "));
    C.activeEl.attr("maxlength", 10);
    C.activeEl.addClass("textbox");
    C.activeEl.bind("keyup." + C.ns, function (F) {
      B.updateTip(B.validate.call(B));
    }).bind("blur." + C.ns, function (F) {
      B.fuzzyInput(F);
      B.autoCheck.call(B);
    });
    if (C.get("defaultDay") != null) {
      this.setDate(this.getDefaultDate());
    }
    this.updateTip(this.validate());
    this.selectedDate = null;
    this.checkLinked();
    this.forIframe(C);
  }, forIframe: function (A) {
    h(window).bind("blur." + A.ns, function () {
      A.hide();
    });
  }, getDefaultDate: function () {
    var B = this.picker;
    var A = p(B.get("defaultDay"));
    var C = B.get("minDate"), D = B.get("maxDate");
    if (C && C.getTime() > A.getTime() || D && D.getTime() < A.getTime()) {
      A = C || D;
    }
    return A;
  }, checkLinked: function (J) {
    var K = this.picker, A;
    if (!K.get("linkTo") || !(A = K.get("linkTo").data(h.fdatepicker.ROOT_KEY)) || A.ui.name.indexOf("qunar") !== 0) {
      return;
    }
    var C = (K.get("linkRules") || "").split(",");
    var F = this.getDate();
    if (F == null) {
      return;
    }
    if (J) {
      if (J.restPos && J.pos || J.restPos && !A.activeEl.attr("data-pos")) {
        A.activeEl.attr("data-pos", J.restPos);
      }
    }
    var L = {};
    h.each(["ds", "mind", "maxd"], function (O, N) {
      if (C[O]) {
        L[N] = p(C[O], F);
      }
    });
    var I = A.get("strictMinDate"), B = A.get("strictMaxDate");
    if (L.mind || I) {
      var M = (L.mind ? L.mind.getTime() : -1) > (I ? I.getTime() : -1) ? L.mind : I;
      A.set("minDate", M, false);
    }
    if (L.maxd || B) {
      var M = (L.maxd ? L.maxd.getTime() : Number.MAX_VALUE) > (B ? B.getTime() : Number.MAX_VALUE) ? B : L.maxd;
      A.set("maxDate", M, false);
    }
    A.set(null, null, true);
    var E = A.ui.validate();
    var H = c(K.activeEl.val()), D = c(A.activeEl.val());
    if (E && !E.success && K.get("forceCorrect") || (!H && D)) {
      A.select(L.ds);
      A.ui.drawDate = null;
      E = A.ui.validate();
    }
    !D && E && A.ui.updateTip(E);
    var G = "Y";
    return G;
  }, checkRefObj: function (H) {
    var I = this.picker, A;
    if (!I.get("refObj") || !(A = I.get("refObj").data(h.fdatepicker.ROOT_KEY)) || A.ui.name.indexOf("qunar") !== 0) {
      return;
    }
    if (!c(A.activeEl.val())) {
      return;
    }
    var C = (I.get("linkRules") || "").split(",");
    var E = this.getDate();
    if (E == null) {
      return;
    }
    if (H) {
      if (H.restPos && H.pos || H.restPos && !A.activeEl.attr("data-pos")) {
        A.activeEl.attr("data-pos", H.restPos);
      }
    }
    var J = {};
    h.each(["ds", "mind", "maxd"], function (M, L) {
      if (C[M]) {
        J[L] = p(C[M], E);
      }
    });
    var G = A.get("strictMinDate"), B = A.get("strictMaxDate");
    if (J.mind || G) {
      var K = (J.mind ? J.mind.getTime() : -1) > (G ? G.getTime() : -1) ? J.mind : G;
      A.set("minDate", K, false);
    }
    if (J.maxd || B) {
      var K = (J.maxd ? J.maxd.getTime() : Number.MAX_VALUE) > (B ? B.getTime() : Number.MAX_VALUE) ? B : J.maxd;
      A.set("maxDate", K, false);
    }
    A.set(null, null, true);
    A.activeEl.val(this.picker.args.today());
    var D = A.ui.validate();
    if (D && !D.success && I.get("forceCorrect")) {
      A.select(J.ds);
      A.ui.drawDate = null;
      D = A.ui.validate();
    }
    D && A.ui.updateTip(D);
    var F = "Y";
    return F;
  }, select: function (B, C) {
    var A = this.picker;
    this.parent.apply(this, arguments);
    this.selectedDate = B;
    if (!C) {
      this.autoCheck();
    }
  }, fuzzyInput: function (A) {
    var E, C = A.target.value, B, D = c(C);
    if (D && D.valid) {
      this.fuzzyselect();
      E = this.picker.get("linkTo") || this.picker.get("refObj");
      B = E && (!c(E.val()) || E.val().indexOf("周") == -1 || C.indexOf("周") == -1);
      B && E.data("q-datepicker").ui.setFuzzyDate(C);
    }
  }, fuzzyselect: function (A, B) {
    this.selectedDate = A;
    this.showText("");
    if (!B) {
      this.autoCheck();
    }
  }, setFuzzyDate: function (A) {
    var C = c(A), B = this.picker.activeEl.val();
    if (C) {
      this.picker.activeEl.val(A);
      this.fuzzyselect(C.startDate);
    } else {
      if (!c(B) && this.picker.args.parseDate(B).getTime() >= this.picker.args.parseDate(A).getTime()) {
        return;
      } else {
        B = this.picker.args.plus(this.picker.args.parseDate(A), 3);
        this.picker.activeEl.val(this.picker.args.formatDate(B));
        this.autoCheck();
      }
    }
  }, showText: function (B) {
    var A = this.triggerEl.find(".dp-text");
    A.removeClass("errtext").html(B);
  }, showErrText: function (B) {
    var A = this.triggerEl.find(".dp-text");
    A.addClass("errtext").html(B);
  }, autoCheck: function () {
    var A = this.picker, E, C;
    var D = A.activeEl.attr("data-pos");
    C = A.activeEl.val();
    E = c(C);
    if (E && E.valid) {
      this.checkLinked({pos: A.args.pos, restPos: D});
      A.args.pos = "";
      return;
    }
    var B = this.validate();
    if (!B.success && A.get("forceCorrect")) {
      this.setDate(this.getDefaultDate());
      this.updateTip(this.validate());
    } else {
      if (B.formatted) {
        A.activeEl.val(B.formatted);
      }
      this.updateTip(B);
    }
    this.checkLinked({pos: A.args.pos, restPos: D});
    this.checkRefObj({pos: A.args.pos, restPos: D});
    A.args.pos = "";
  }, updateTip: function (A) {
    if (!this.picker.get("showTip")) {
      return;
    }
    if (!A.success) {
      this.showErrText(A.errmsg);
    } else {
      this.showText(A.daytip);
    }
  }, validate: function () {
    var H = this.picker;
    var D = this.picker.activeEl.val();
    var E = this.getDate();
    var J = this;
    if (E && this.selectedDate && this.selectedDate.getTime() != E.getTime()) {
      this.selectedDate = null;
    }
    var G = "";
    if (E == null) {
      G = H.get("LANG.ERR_FORMAT");
      H._trigger("q-datepicker-error", ["FORMAT", D]);
    } else {
      var F = H.get("minDate"), A = H.get("maxDate");
      if (F && F.getTime() > E.getTime() || A && A.getTime() < E.getTime()) {
        G = H.get("LANG.OUT_OF_RANGE");
        H.args.pos = "change";
        H._trigger("q-datepicker-error", ["RANGE", D]);
      }
    }
    var B = {success: !G, errmsg: G, formatted: null, daytip: null};
    if (B.success) {
      var C = H.get("formatDate")(E), I;
      switch (H.args.minuteDate(E)) {
        case 0:
          I = "今天";
          break;
        case 1:
          I = "明天";
          break;
        case 2:
          I = "后天";
          break;
        default:
          I = "周" + H.get("LANG.day_names")[E.getDay()];
          break;
      }
      B.daytip = o[C] ? o[C]["holidayName"] : I;
      B.formatted = C;
    }
    return B;
  }, addRoundClass: function (A) {
    if (A == "FROM") {
      return this.picker.get("CLASS")["day_selected"];
    } else {
      if (A == "BACK") {
        return this.picker.get("CLASS")["day_round"];
      } else {
        if (A == "AREAR") {
          return this.picker.get("CLASS")["day_area_bg"];
        }
      }
    }
  }});
  h.fn.fdatepicker = function () {
    if (this[0]) {
      if (arguments.length > 1 && this.data(y)) {
        var B = this.data(y);
        if (arguments[0] === "option" || arguments[0] === "setting") {
          return arguments.length > 2 ? B.set(arguments[1], arguments[2]) : B.get(arguments[1]);
        }
      } else {
        if (arguments.length <= 1) {
          if (this.data(y)) {
            this.data(y).dispose();
            this.removeData(y);
          }
          var A = new a(this[0], arguments[0]);
          this.data(y, A);
        }
      }
    }
    return this;
  };
  p = h.fdatepicker.calcTime;
})(jQuery);
(function (g, b) {
  var d = g.jQuery, h = g.document;
  var f = "YSELECTOR", i = ".SELECTOR_EVENT", c = "hover", e = d.browser.msie && d.browser.version === "6.0";
  var a = function () {
  };
  a.options = {emptyHidden: false, maxRows: 10, index: null, direction: "bottom", onchange: function () {
  }, onselect: function (j) {
    return j || "";
  }};
  a.prototype = {_init: function (k) {
    var j = this;
    j._setOptions(k || {});
    j._bindEvents();
  }, _bindEvents: function () {
    var l = this, k = l.option("jquery"), m = false;

    function j(n) {
      if (l.option("disable")) {
        return;
      }
      if (m) {
        l._hide();
      } else {
        l._show();
      }
      m = !m;
    }

    k.delegate(".yselector_input", "click" + i, j).delegate(".yselector_arraw", "mousedown" + i, function (n) {
      l.option("input").focus();
      n.preventDefault();
      if (this.setCapture) {
        this.setCapture();
      }
      j(n);
    }).delegate(".yselector_arraw", "click" + i, function (n) {
      if (this.releaseCapture) {
        this.releaseCapture();
      }
    }).delegate(".yselector_input", "focusout" + i, function () {
      if (m) {
        l._hide();
        m = false;
      }
      var o = l.val(), n = l._getByValue(o);
      d(d.fn.yselector.events).trigger("blur", [l, n, l.option("holder")]);
    }).delegate(".yselector_suggest ul", "mousedown" + i, function (p) {
      p.preventDefault();
      if (this.setCapture) {
        this.setCapture();
      }
      var o = p.target;
      if (o.tagName !== "A") {
        return;
      }
      var n = d(o).data("index");
      l.index(n);
      j(p);
    }).delegate(".yselector_suggest ul", "click" + i, function (n) {
      if (this.releaseCapture) {
        this.releaseCapture();
      }
    }).delegate(".yselector_suggest ul", "mouseenter" + i, function (n) {
      l._cur().removeClass(c);
    }).delegate(".yselector_input", "keydown" + i, function (o) {
      if (l.option("disable")) {
        return;
      }
      var n = o.keyCode;
      if (n === 37 || n === 38) {
        l.previous();
        return false;
      } else {
        if (n === 39 || n === 40) {
          l.next();
          return false;
        } else {
          if (n === 13) {
            j(o);
          } else {
            if (n === 8) {
              return false;
            }
          }
        }
      }
    });
  }, _cur: function (k) {
    var j = this, l = (k == null) ? j.option("index") : k, m = j.option("suggest").find("a:eq(" + l + ")");
    return m;
  }, _drawHtml: function () {
    var k = this;
    var m = ['<div class="yselector">', '<div class="yselector_box">', '<div class="yselector_arraw"><b></b></div>', '<span class="yselector_input" tabindex="0"></span>', "</div>", '<div style="display:none;" class="yselector_suggest">', "<ul></ul>", "</div>", "</div>"];
    var j = d(m.join("\n")), l = k.option("holder").hide();
    l.after(j);
    k.option("jquery", j);
    k.option("suggest", d(".yselector_suggest", j));
    k.option("input", d(".yselector_input", j));
  }, _drawSuggest: function () {
    var k = [], o, m = this, p = m.option("data");
    for (var n = 0, j = p.length; n < j; n++) {
      o = p[n];
      k.push('<li><a data-value="' + o.value + '" hidefocus="on" data-index="' + n + '"');
      k.push(' onclick="return false;" href="javascript:;" tabindex="-1">' + o.text + "</a></li>");
    }
    m.option("suggest").html("<ul>" + k.join("\n") + "</ul>");
  }, _setOptions: function (o) {
    var k = this;
    k.options = d.extend({}, a.options, o);
    var j = o.rawSelect, m = j.options, l = j.selectedIndex, n;
    var p = function () {
      var s = [];
      for (var r = 0, q = m.length; r < q; r++) {
        n = m[r];
        s.push({value: n.value || n.text, text: n.text});
      }
      return s;
    };
    k.option("holder", d(j));
    k.option("index", o.index != null ? o.index : l);
    k._drawHtml();
    k.setOptions(p());
    d(j).bind("update", function () {
      k.setOptions(p());
    });
  }, _getByValue: function (p, m) {
    if (!p) {
      return;
    }
    var o = this.option("data"), n;
    m = m || "value";
    for (var k = 0, j = o.length; k < j; k++) {
      n = o[k];
      if (n[m] == p) {
        return n;
      }
    }
  }, _setByObject: function (p, o) {
    p = p || {};
    if (!o && this.option("index") === p.index) {
      return;
    }
    var k = this, n = k.option("onselect"), l = k.option("onchange");
    var q = n ? n(p.text) : (p.text || "");
    k.option("value", p.value || "");
    k.option("text", q);
    k.option("index", p.index || 0);
    var m = k.option("holder"), j = k.option("input");
    if (m) {
      m[0].selectedIndex = p.index;
    }
    if (j) {
      k.option("input").text(q);
    }
    if (l) {
      l.call(k, p);
    }
    d(d.fn.yselector.events).trigger("change", [k, p, k.option("holder")]);
  }, _triggerClass: function (m, l) {
    var k = this;
    if (m === l) {
      return;
    }
    k._cur(m).removeClass(c);
    k._cur(l).addClass(c);
  }, _show: function () {
    var l = this, q = l.option("suggest"), m = l.option("index"), p = l.option("direction");
    l._drawSuggest();
    var n = q.find("a");
    n.eq(m).addClass(c);
    q.show();
    var k = l.option("maxRows");
    var j = Math.min(n.size(), k) * n.height();
    var o = p === "top" ? 0 - j - l.option("jquery").height() : 0;
    q.find("ul").css("height", j).css("top", o);
  }, _hide: function () {
    this.option("suggest").hide();
  }, setOptions: function (q) {
    var o = this, n = o.option("jquery");
    q = q || [];
    var j = o.option("holder")[0];
    j.length = 0;
    for (var p = 0, k = q.length, m; p < k; p++) {
      m = q[p];
      m.index = p;
      j.options.add(new Option(m.text, m.value));
    }
    o.option("data", q);
    if (!q.length && o.option("emptyHidden")) {
      n.hide();
    } else {
      n.show();
    }
    o._setByObject(q[o.option("index")] || q[0], true);
  }, first: function () {
    return this.option("data")[0] || {};
  }, option: function (j, k) {
    if (k != null) {
      this.options[j] = k;
    } else {
      return this.options[j];
    }
  }, previous: function () {
    var j = this, k = j.index() - 1;
    if (k < 0) {
      k = j.option("data").length + k;
    }
    j.index(k);
  }, next: function () {
    var j = this;
    j.index(j.option("index") + 1);
  }, index: function (l) {
    var j = this;
    if (l == null) {
      return j.option("index");
    }
    var m = j.option("data"), n = m[l], k = j.option("index");
    if (!n) {
      n = j.first();
      l = 0;
    }
    j._setByObject(n);
  }, val: function (l, k) {
    var j = this;
    if (l == null) {
      return j.option("value");
    }
    var m = j._getByValue(l);
    if (m == null) {
      m = j.first();
    }
    j._setByObject(m, k);
  }, text: function (l) {
    var j = this;
    if (l == null) {
      return j.option("text");
    }
    var k = j._getByValue(l, "text");
    if (k == null) {
      k = j.first();
    }
    j._setByObject(k);
  }, disable: function () {
    this.option("jquery").addClass("disble");
    this.option("disable", true);
  }, enable: function () {
    this.option("jquery").removeClass("disble");
    this.option("disable", false);
  }};
  d.fn.extend({yselector: function (j) {
    d.fn.yselector.events = {};
    this.each(function (l, m) {
      var k = d(this);
      var n = k.data(f);
      if (!n) {
        j = j || {};
        j.rawSelect = k[0];
        n = new a();
        k.data(f, n);
        n._init(j);
      }
      return n;
    });
    return this;
  }});
})(this);
(function (g) {
  if (!g.bui) {
    g.bui = {};
  }
  var b = {};
  var a = {};
  var c = /^\d+$/;
  jQuery.expr[":"].focus = function (h) {
    return h === document.activeElement && (h.type || h.href);
  };
  function e(h) {
    if (typeof h == "string") {
      if (c.test(h)) {
        return parseInt(h, 10);
      }
    }
    return h;
  }

  function d(h, i) {
    if (h.compareDocumentPosition) {
      return h === i || !!(h.compareDocumentPosition(i) & 16);
    }
    if (h.contains && i.nodeType === 1) {
      return h.contains(i) && h !== i;
    }
    while ((i = i.parentNode)) {
      if (i === h) {
        return true;
      }
    }
    return false;
  }

  g.RegisterUI = function (h, i) {
    if (b[h]) {
      return;
    }
    i = i || {};
    b[h] = function (k) {
      var j = this;
      this.el = k;
      this.$el = g(k);
      this._options = {};
      this._plugins = {};
      g.each(i.propertychange || {}, function (m, l) {
        j.on(m + "_changed", l);
      });
      g.each(i.properties || {}, function (m, l) {
        j._options[m] = l;
      });
    };
    b[h].prototype = g.extend({options: function (k) {
      var j = this;
      g.each(k, function (l, m) {
        j.set(l, m);
      });
    }, dom: function () {
      return this.el;
    }, plugins: function (j, k) {
      if (k) {
        this._plugins[j] = k;
      } else {
        return this._plugins[j];
      }
    }, data: function (j, k) {
      if (arguments.length == 1) {
        return this.get(j) || this.$el.data(h + "-" + j);
      } else {
        this.$el.data(h + "-" + j, k);
        this.set(j, k);
      }
    }, set: function (j, l, k) {
      l = e(l);
      var m = {name: j, new_value: l, old_value: this.get(j)};
      if (k != true) {
        g(this).trigger(j + "_before_change", [m]);
      }
      this._options[j] = m.new_value;
      if (k != true) {
        g(this).trigger(j + "_changed", [l]);
      }
    }, get: function (j) {
      return this._options[j];
    }, on: function (j, k) {
      g(this).bind(j, k);
    }, un: function (j) {
      g(this).unbind(j);
    }, fire: function () {
      var j = g(this);
      j.trigger.apply(j, Array.prototype.slice.apply(arguments));
    }}, i);
    g.fn[h] = function (l) {
      l = l || {};
      if (g.isPlainObject(l)) {
        return g.each(this, function () {
          var o = g(this).data(h);
          if (!o) {
            var p = new b[h](this);
            g(this).data(h, p);
            p.options(l);
            p.initialize();
          } else {
            g(this).data(h).options(l);
          }
        });
      } else {
        if (typeof l == "string") {
          var j = arguments[0];
          var k = Array.prototype.slice.call(arguments, 1);
          var m = g(this).data(h);
          if (g.isFunction(m[j])) {
            return m[j].apply(m, k);
          }
        }
      }
      return this;
    };
  };
  g.RegisterPlugin = function (i, m, l, k) {
    if (!b[i]) {
      alert("not found UI[" + i + "]");
      return;
    }
    var j = a[i] = a[i] || {};
    var h = j[m] = j[m] || {};
    h[l] = k;
  };
  g.usePlugin = function (i, h) {
    g.each(a[h], function (k, j) {
      g.each(j, function (l, n) {
        if (i.data(k) === l) {
          var m = function () {
            this.ui = i;
            this.initialize();
          };
          m.prototype = n;
          i.plugins(k, new m());
        }
      });
    });
  };
  var f = g.fn.val;
  jQuery.fn.val = function (h) {
    var i = this[0];
    if (i && i.qcbox) {
      if (h != null) {
        if (g.trim(h) == "") {
          i.qcbox.showPlaceHolder();
        } else {
          i.qcbox.hidePlaceHolder();
        }
      }
    }
    return f.apply(this, Array.prototype.slice.apply(arguments));
  };
  g.RegisterUI("qcbox", {initialize: function () {
    var j = this;
    var l = this.$el;
    l[0].qcbox = this;
    var n = null;
    var m = this.data("customclass");
    var h = this.$wrap = l.wrap('<div class="qunar-qcbox' + (m ? " " + m : "") + '"></div>').before('<div class="qcbox-placeholder"></div>').before('<div class="qcbox-prefix"></div><div class="qcbox-info"><b /></div>').after('<div class="qcbox-fixed"></div>').parent();
    var k = this.$fixed = h.find(".qcbox-fixed");
    var i = this.$handler = h.find(".qcbox-info b");
    l.addClass("textbox");
    if (this.data("hideicon")) {
      i.hide();
    }
    h.click(function (o) {
      j.fire("qcbox-focus");
    });
    g(document.body).bind("mouseup", function (o) {
      if (g(o.target).closest(".qunar-qcbox").length == 0) {
        j.fire("qcbox-blur");
      }
    });
    h.mouseup(function (o) {
      l.focus();
    });
    l.bind("blur", function () {
      j.resetPlaceHolder();
    });
    l.bind("focus", function () {
      j.hidePlaceHolder();
      this.select();
    });
    l.keyup(function (o) {
      switch (o.keyCode) {
        case 9:
          h.find(".qcbox-placeholder").hide();
          break;
        default:
          break;
      }
    });
    this._resetWidth();
    g.usePlugin(j, "qcbox");
    this._resetHotcity();
    this._resetPlaceHolder();
  }, _resetHotcity: function () {
    var n = this.plugins("hotcity");
    if (!n) {
      return;
    }
    var j = 0;
    var m = this;
    var l = this.$el;
    var i = this.$wrap;
    n.attachedEl = n.attachedEl || new g();
    this.$el.keydown(function (o) {
      k();
    });
    n.attachedEl = n.attachedEl.add(i.find(".qcbox-info > b , .qcbox-info")).add(i.find(".qcbox-info > b , .qcbox-info > .qcbox-text ").add(i.find(".qcbox-placeholder")));
    g(document).bind("mouseup", function (p) {
      var o;
      if ((l[0] === p.target && (o = 1)) || ~n.attachedEl.index(p.target) && (o = 2)) {
        if (!n.$hotcity || !n.$hotcity.is(":visible")) {
          h();
        } else {
          k();
        }
        if (o == 2) {
          l.focus();
        }
        return;
      }
      if (!g(p.target).data("hotcity-nogo") && g(p.target).parents("[data-hotcity-nogo]").length == 0) {
        k();
      }
    });
    function h() {
      var o = m.$el;
      var p = m.$fixed;
      p.empty();
      n.$hotcity = p.append("<div class='hotcity'><div>").find(".hotcity");
      n.initializeStruct();
      g(n).trigger("hotcity-preshow", [n]);
      n.$hotcity.show();
      j = 1;
      g(n).trigger("hotcity-show");
    }

    function k() {
      if (typeof n == "undefined" || !n.$hotcity) {
        return;
      }
      n.$hotcity.hide();
      j = 0;
      g(n).trigger("hotcity-hide");
    }

    n.showHotcity = h;
    n.hideHotcity = k;
  }, _resetPlaceHolder: function () {
    var i = this;
    var l = this.$wrap.find(".qcbox-placeholder");

    function k() {
      var m = i.$el.val();
      if (g.trim(m) == "") {
        h();
      } else {
        j();
      }
    }

    function h() {
      l.text(i.data("placeholder"));
      l.show();
    }

    function j() {
      l.hide();
    }

    k();
    this.showPlaceHolder = h;
    this.hidePlaceHolder = j;
    this.resetPlaceHolder = k;
  }, _resetWidth: function () {
    var j = this.$el;
    var h = this.$wrap;
    var i = this.data("prefix");
    if (i) {
      h.find(".qcbox-prefix").text(i);
      j.css({"margin-left": h.find(".qcbox-prefix").outerWidth(true) + "px"});
    } else {
      h.find(".qcbox-prefix").remove();
    }
    h.find(".qcbox-placeholder").css({width: j.width(), left: j.css("margin-left"), "padding-left": j.css("padding-left"), height: j.height(), "line-height": j.height() + "px"});
  }});
})(jQuery);
(function (f) {
  var g = (function () {
    var n = "data-detect-oninput", k = {}, m = {}, o = 1, p = 1;
    var q = function (t, v, u, s) {
      if (t.addEventListener) {
        t.addEventListener(v, u, false);
      } else {
        if (t.attachEvent) {
          t.attachEvent("on" + v, u);
        }
      }
      (k[s] || (k[s] = [])).push({t: v, h: u});
    };
    var r = function (v, s) {
      if (!k[s]) {
        return;
      }
      for (var u = 0, t; t = k[s][u]; u++) {
        if (v.removeEventListener) {
          v.removeEventListener(t.t, t.h, false);
        } else {
          if (v.detachEvent) {
            v.detachEvent("on" + t.t, t.h);
          }
        }
      }
      delete k[s];
    };
    var l = function (u, v) {
      var t = u.value;
      var s = function () {
        var w;
        if ((w = u.value) !== t) {
          if (s._sleep !== true) {
            v.call(u, w, t);
          }
          t = u.value;
        }
      };
      return s;
    };
    var j = navigator.userAgent.toLowerCase();
    return{version: "1.3", bind: function (t, x) {
      var u, s = x[n];
      if (!s) {
        x[n] = s = o++;
      }
      if (!(u = t.getAttribute(n))) {
        t.setAttribute(n, u = "" + p++);
      }
      var v = l(t, x);
      if ("oninput" in t && !/msie\s9/.test(j) && !/opera/.test(j)) {
        q(t, "input", v, s);
      } else {
        var w;
        q(t, "focus", function () {
          if (!w) {
            w = setInterval(v, 100);
          }
        }, s);
        q(t, "blur", function () {
          if (w) {
            clearInterval(w);
            w = null;
          }
        }, s);
      }
      m[s] = {eid: u, checker: v};
      return t;
    }, unbind: function (s, t) {
      if (t[n]) {
        r(s, t[n]);
        delete m[t[n]];
      }
      return s;
    }, set: function (t, y) {
      var v = t.getAttribute(n);
      if (v) {
        var x = [];
        for (var u in m) {
          if (m[u]["eid"] === v) {
            x.push(m[u]["checker"]);
            m[u]["checker"]._sleep = true;
          }
        }
        t.value = y;
        for (var w = 0, s = x.length; w < s; w++) {
          x[w].call(t);
          x[w]._sleep = false;
        }
      } else {
        t.value = y;
      }
    }};
  })();
  f.qsuggest = {version: "1.2"};
  var i = f.qsuggest.ROOT_KEY = "q-suggest";
  var d = 0;
  var c = {ajax: {url: null, cache: false, success: function () {
  }}, reader: function (j) {
    return j;
  }, loader: function (j) {
    return j;
  }, max: 10, min: 1, container: null, delay: 100, rdelay: 1000, requestWithNothing: false, trimQuery: true, autoSelect: true, css: {"z-index": 500}, setValue: function (j) {
    return j;
  }, render: function (j) {
    return String(j).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }, exattr: function (j) {
    return j;
  }};

  function b(j) {
    var k = j.offset();
    k.top += j.outerHeight();
    return k;
  }

  function h(j) {
    return j.closest("table").data("data")[j.attr("data-ind") * 1];
  }

  function a(r) {
    var s = this;
    var o = s.visible();
    var l = r.keyCode;
    if (l === 40 && !o) {
      s.show();
      return;
    }
    var j = s.el.find("tr");
    var q = j.filter(".active");
    switch (l) {
      case 38:
      case 40:
        if (o) {
          s._excludeEl = s._mouseFocus;
          q.removeClass("active");
          var k = r.keyCode === 38 ? q.prev() : q.next();
          if (k.size() === 0) {
            k = j.filter(l === 38 ? ":last" : ":first");
          }
          var m = s.args.getData || h;
          var n = m(k);
          s.setValue(n);
          k.addClass("active");
          r.preventDefault();
          s._trigger("q-suggest-user-action", [r.type, n, l]);
        }
        break;
      case 13:
      case 27:
        if (o) {
          s.hide();
          s._trigger("q-suggest-user-action", [r.type, s.getValue(), l]);
        }
        break;
      case 18:
      case 9:
        break;
      default:
    }
  }

  function e(k, j) {
    if (!this.init) {
      return new qsuggest(k, j);
    } else {
      return this.init(k, j);
    }
  }

  f.extend(e.prototype, {init: function (m, l) {
    this.key = ++d;
    var n = this.ns = i + this.key;
    l = this.args = f.extend(true, {}, c, l || {});
    var o = this.activeEl = f(m);
    var k = this;
    this.el = f('<div class="' + i + (l.customClass ? " " + l.customClass : "") + '"></div>').appendTo(l.container || document.body).hide();
    this.el.data(i, this);
    this._handler = null;
    this._ajaxHandler = null;
    this._excludeEl = null;
    this._mouseFocus = null;
    this._last = [];
    this._cache = {};
    this._value = null;
    f.each(l.on || {}, function (q, p) {
      o.bind(q + "." + n, p);
    });
    if (l.css) {
      this.el.css(k.args.css);
    }
    var k = this;
    var j = false;
    o.bind("keydown." + n, function (p) {
      var q = p.keyCode;
      if (q >= 229) {
        j = true;
      }
    });
    g.bind(o[0], function () {
      k._trigger("q-suggest-inputChange");
      k.show();
    });
    o.bind("keydown." + n, function (p) {
      if (j) {
        j = false;
        return;
      }
      var q = k.args.keyevent || a;
      q.call(k, p);
      j = false;
    });
    o.bind("blur." + n, function (q) {
      if (k.visible()) {
        var s = k.el.find("tr.active");
        if (s.length > 0) {
          var p = k.args.getData || h;
          if (k.args.autoSelect) {
            var r = p(s);
            r && k.setValue(r);
          }
        } else {
          k._trigger("q-suggest-noresult", [o]);
        }
        k.hide();
      }
    });
    f("tr", this.el[0]).live("mouseover." + n + " mouseout." + n + " mousedown." + n, function (q) {
      var s = f.nodeName(q.target, "tr") ? f(q.target) : f(q.target).parents("tr").eq(0);
      if (f(s[0]).attr("data-sug_type") == 1) {
        q.preventDefault();
        return;
      }
      var r = s[0] != k._excludeEl;
      if (q.type === "mouseover") {
        if (r) {
          s.parents().children().removeClass("active");
          s.addClass("active");
          k._excludeEl = null;
        }
        k._mouseFocus = s[0];
      } else {
        if (q.type === "mouseout") {
          k._mouseFocus = null;
        } else {
          var p = k.args.getData || h;
          k.setValue(p(s));
          k.hide();
          k._trigger("q-suggest-user-action", [q.type, k.getValue(), null]);
        }
      }
    });
    return this;
  }, req: function () {
    var j = this;
    if (j._handler) {
      clearTimeout(j._handler);
    }
    if (j._timeoutHandler) {
      clearTimeout(j._timeoutHandler);
      j._timeoutHandler = null;
    }
    if (j._ajaxHandler) {
      j._ajaxHandler = null;
    }
    j._handler = setTimeout(function () {
      var l = j.activeEl.val(), p = j.args.loader(l), o = null, k;
      if (j.args.trimQuery) {
        p = f.trim(p);
      }
      if (!p && !j.args.requestWithNothing) {
        j.draw(null);
        return;
      }
      if (j._last && j._last[0] === p) {
        j.draw(j._last[1]);
        return;
      }
      if (j._last && j._last[0] == p) {
        o = j._last;
      } else {
        if (j.args.cache && j._cache[p]) {
          o = j._cache[p];
        }
      }
      var m = typeof j.args.ajax.url == "function" ? j.args.ajax.url() : j.args.ajax.url;
      if (o) {
        j.draw((j._last = o)[1]);
      } else {
        if (!m) {
          j.draw(null);
        } else {
          m = m.replace(/\*([^*]+)$/, encodeURIComponent(p) + "$1");
          var n = j.args.ajax.success;
          j._timeoutHandler = setTimeout(function () {
            j.hide();
          }, j.args.rdelay);
          j._ajaxHandler = f.ajax(f.extend({}, j.args.ajax, {url: m, success: function (s, q) {
            clearTimeout(j._timeoutHandler);
            j._timeoutHandler = null;
            j._ajaxHandler = null;
            if (l !== j.activeEl.val()) {
              return;
            }
            var r = j.args.reader.call(j, s, q);
            if (j.type(r) === "Array") {
              j.draw(r, s);
              j._last = j._cache[p] = [p, r, q];
            }
            n.apply(this, arguments);
          }}));
        }
      }
    }, j.args.delay);
  }, type: function (j) {
    return Object.prototype.toString.call(j).slice(8, -1);
  }, show: function () {
    this.req();
  }, hide: function () {
    if (this.visible()) {
      this.el.hide();
      this._trigger("q-suggest-hide");
    }
  }, draw: function (m, v) {
    this.el.empty();
    var l = this.args.min, q = this.args.max, n = m ? m.length : 0;
    if (!m || !n || n < l) {
      this.hide();
      return;
    }
    var t = {country: "中国", txt: "所有地点", val: "所有地点", type: 0};
    if (this.args.allPlace && m[n - 1].val != t.val) {
      m.push(t);
    }
    var s = [], j = this.args.render, p = this.args.exattr, u = true;
    s.push('<table cellspacing="0" cellpadding="2"><tbody>');
    f.each(m, function (r, o) {
      if (r >= q) {
        return false;
      }
      var w = "";
      if (o.type !== 1 && u) {
        u = false;
        w = ' class="active';
      }
      if (o.exClass) {
        w = w ? w + " " + o.exClass + '" ' : ' class="' + o.exClass + '" ';
      } else {
        w = w ? w + '" ' : "";
      }
      s.push("<tr", w, ' data-ind="', r, '" ', p(o), "><td>", j(o), "</td></tr>");
    });
    s.push("</tbody></table>");
    this._trigger("q-suggest-beforeshow", [this.el, v]);
    var k = f(s.join("")).appendTo(this.el).data("data", m);
    if (!this.args.container) {
      this.el.css(b(this.activeEl));
    }
    this.el.show();
    this._trigger("q-suggest-show", [m]);
  }, dispose: function () {
    this._trigger("q-suggest-dispose");
    this.activeEl.unbind("." + this.ns);
    f(window).unbind("." + this.ns);
    this.el.remove();
  }, visible: function () {
    return this.el.is(":visible");
  }, _trigger: function () {
    this.activeEl.triggerHandler.apply(this.activeEl, arguments);
  }, setValue: function (j) {
    g.set(this.activeEl[0], j);
    this._value = j;
    this._setExtData();
    this._trigger("q-suggest-setvalue", [j, this.activeEl]);
  }, _setExtData: function () {
    var j = this.args.getExtData ? this.args.getExtData(this.el.find("tr.active")) : {};
    this._trigger("q-suggest-setextdata", [j, this.activeEl]);
  }, getValue: function () {
    return this._value;
  }, set: function (m, n) {
    var o = false;
    switch (m) {
      case"container":
        this.el.appendTo(n || document.body);
        this.el.css({top: "", left: ""});
        break;
    }
    if (!o) {
      for (var l = 0, k = m.split("."), j = k.length, p = this.args; l < j && (l !== j - 1 && (p[k[l]] || (p[k[l]] = {})) || (p[k[l]] = n)); p = p[k[l]], l++) {
      }
    }
    return n;
  }, get: function (m) {
    for (var l = 0, n = this.args, k = m.split("."), j = k.length; l < j && (n = n[k[l]]); l++) {
    }
    return n;
  }});
  f.fn.qsuggest = function () {
    var j = arguments;
    if (arguments.length > 1 && this.data(i)) {
      var k = null;
      if (arguments[0] === "option" || arguments[0] === "setting") {
        this.each(function (o, n) {
          var m = f(n);
          var l = this.data(i);
          if (l) {
            k = k || (j.length > 2 ? l.set(j[1], j[2]) : l.get(j[1]));
          }
        });
      }
      return k;
    } else {
      if (arguments.length <= 1) {
        this.each(function (o, n) {
          var m = f(n);
          if (m.data(i)) {
            m.data(i).dispose();
            m.removeData(i);
          }
          var l = new e(n, j[0]);
          m.data(i, l);
        });
      }
    }
    return this;
  };
})(jQuery);
(function (e) {
  e.qhistory = {};
  var i = null;
  var j = null;
  var d = "#js_ifrmHistory";
  var h = "http://history.qunar.com/history/newhistory.html";

  function g(m) {
    var l = m.contentWindow.QunarHistory;
    i = a(l);
    j = f(l);
  }

  function a(l) {
    var r = l.findEntries("SF");
    var q = l.findEntries("DL");
    var t = [], p = [], s = [], m = [];
    e.each(r, function (u, v) {
      if (b(v)) {
        t.push(k(v));
        return false;
      }
    });
    e.each(r, function (u, v) {
      if (!b(v)) {
        p.push(k(v));
        return false;
      }
    });
    e.each(q, function (u, v) {
      v.roundtrip = true;
      if (b(v)) {
        s.push(k(v));
        return false;
      }
    });
    e.each(q, function (u, v) {
      v.roundtrip = true;
      if (!b(v)) {
        m.push(k(v));
        return false;
      }
    });
    var o = [], n = [];
    o = o.concat(p).concat(m);
    n = n.concat(t).concat(s);
    o.sort(function (v, u) {
      return parseInt(u.timestamp, 10) - parseInt(v.timestamp, 10);
    });
    n.sort(function (v, u) {
      return parseInt(u.timestamp, 10) - parseInt(v.timestamp, 10);
    });
    return{domesticFirst: o[0], interFirst: n[0]};
  }

  function f(l) {
    return{HL: l.findEntries("HL")[0], HDL: l.findEntries("HDL")[0], HBL: l.findEntries("HBL")[0], HLL: l.findEntries("HLL")[0], HTL: l.findEntries("HTL")[0]};
  }

  function b(p) {
    var m = p.fromCountry;
    var o = p.toCountry;
    var n = m;
    var l = o;
    if (~m.indexOf("-")) {
      n = m.split("-")[0];
      l = m.split("-")[1];
    }
    p.fromCountry = n;
    p.toCountry = l;
    return c(n) !== "中国" || c(l) !== "中国";
  }

  function c(l) {
    return decodeURIComponent(l);
  }

  function k(l) {
    e.each(l, function (n, m) {
      l[n] = c(m);
    });
    return l;
  }

  e.qhistory.init = function (l) {
    var m = e(l.frameid || d);
    m.attr("src", l.src || h);
    m.bind("load", function () {
      g(m[0]);
      var n = {flight: i, hotel: j};
      var o = l.success || function () {
      };
      o(n);
    });
  };
})(jQuery);
(function () {
  var a = {};
  $.qload = function (c, d) {
    var b = ["http://qunarzz.com/home/prd/scripts/geilivible/release/", c, "-", QZZVERSION, ".js"].join("");
    if (a[c]) {
      return;
    }
    $.ajax({url: b, dataType: "script", cache: true, success: function () {
      a[c] = true;
      d();
    }});
  };
})();
var Hogan = {};
(function (j, h) {
  j.Template = function (o, p, n, m) {
    this.r = o || this.r;
    this.c = n;
    this.options = m;
    this.text = p || "";
    this.buf = (h) ? [] : "";
  };
  j.Template.prototype = {r: function (o, n, m) {
    return"";
  }, v: c, t: e, render: function b(o, n, m) {
    return this.ri([o], n || {}, m);
  }, ri: function (o, n, m) {
    return this.r(o, n, m);
  }, rp: function (o, q, p, m) {
    var n = p[o];
    if (!n) {
      return"";
    }
    if (this.c && typeof n == "string") {
      n = this.c.compile(n, this.options);
    }
    return n.ri(q, p, m);
  }, rs: function (p, o, q) {
    var m = p[p.length - 1];
    if (!g(m)) {
      q(p, o, this);
      return;
    }
    for (var n = 0; n < m.length; n++) {
      p.push(m[n]);
      q(p, o, this);
      p.pop();
    }
  }, s: function (s, n, q, o, t, m, p) {
    var r;
    if (g(s) && s.length === 0) {
      return false;
    }
    if (typeof s == "function") {
      s = this.ls(s, n, q, o, t, m, p);
    }
    r = (s === "") || !!s;
    if (!o && r && n) {
      n.push((typeof s == "object") ? s : n[n.length - 1]);
    }
    return r;
  }, d: function (q, n, p, r) {
    var s = q.split("."), t = this.f(s[0], n, p, r), m = null;
    if (q === "." && g(n[n.length - 2])) {
      return n[n.length - 1];
    }
    for (var o = 1; o < s.length; o++) {
      if (t && typeof t == "object" && s[o] in t) {
        m = t;
        t = t[s[o]];
      } else {
        t = "";
      }
    }
    if (r && !t) {
      return false;
    }
    if (!r && typeof t == "function") {
      n.push(m);
      t = this.lv(t, n, p);
      n.pop();
    }
    return t;
  }, f: function (q, m, p, r) {
    var t = false, n = null, s = false;
    for (var o = m.length - 1; o >= 0; o--) {
      n = m[o];
      if (n && typeof n == "object" && q in n) {
        t = n[q];
        s = true;
        break;
      }
    }
    if (!s) {
      return(r) ? false : "";
    }
    if (!r && typeof t == "function") {
      t = this.lv(t, m, p);
    }
    return t;
  }, ho: function (s, m, p, r, o) {
    var q = this.c;
    var n = this.options;
    n.delimiters = o;
    var r = s.call(m, r);
    r = (r == null) ? String(r) : r.toString();
    this.b(q.compile(r, n).render(m, p));
    return false;
  }, b: (h) ? function (m) {
    this.buf.push(m);
  } : function (m) {
    this.buf += m;
  }, fl: (h) ? function () {
    var m = this.buf.join("");
    this.buf = [];
    return m;
  } : function () {
    var m = this.buf;
    this.buf = "";
    return m;
  }, ls: function (n, u, r, o, m, p, v) {
    var q = u[u.length - 1], s = null;
    if (!o && this.c && n.length > 0) {
      return this.ho(n, q, r, this.text.substring(m, p), v);
    }
    s = n.call(q);
    if (typeof s == "function") {
      if (o) {
        return true;
      } else {
        if (this.c) {
          return this.ho(s, q, r, this.text.substring(m, p), v);
        }
      }
    }
    return s;
  }, lv: function (q, o, p) {
    var n = o[o.length - 1];
    var m = q.call(n);
    if (typeof m == "function") {
      m = e(m.call(n));
      if (this.c && ~m.indexOf("{\u007B")) {
        return this.c.compile(m, this.options).render(n, p);
      }
    }
    return e(m);
  }};
  var i = /&/g, d = /</g, a = />/g, l = /\'/g, k = /\"/g, f = /[&<>\"\']/;

  function e(m) {
    return String((m === null || m === undefined) ? "" : m);
  }

  function c(m) {
    m = e(m);
    return f.test(m) ? m.replace(i, "&amp;").replace(d, "&lt;").replace(a, "&gt;").replace(l, "&#39;").replace(k, "&quot;") : m;
  }

  var g = Array.isArray || function (m) {
    return Object.prototype.toString.call(m) === "[object Array]";
  };
})(typeof exports !== "undefined" ? exports : Hogan, true);
(function (n) {
  var f = /\S/, j = /\"/g, o = /\n/g, k = /\r/g, u = /\\/g, a = {"#": 1, "^": 2, "/": 3, "!": 4, ">": 5, "<": 6, "=": 7, _v: 8, "{": 9, "&": 10};
  n.scan = function m(G, B) {
    var O = G.length, y = 0, D = 1, x = 2, z = y, C = null, Q = null, P = "", J = [], F = false, N = 0, K = 0, H = "{{", M = "}}";

    function L() {
      if (P.length > 0) {
        J.push(new String(P));
        P = "";
      }
    }

    function A() {
      var S = true;
      for (var R = K; R < J.length; R++) {
        S = (J[R].tag && a[J[R].tag] < a._v) || (!J[R].tag && J[R].match(f) === null);
        if (!S) {
          return false;
        }
      }
      return S;
    }

    function I(U, R) {
      L();
      if (U && A()) {
        for (var S = K, T; S < J.length; S++) {
          if (!J[S].tag) {
            if ((T = J[S + 1]) && T.tag == ">") {
              T.indent = J[S].toString();
            }
            J.splice(S, 1);
          }
        }
      } else {
        if (!R) {
          J.push({tag: "\n"});
        }
      }
      F = false;
      K = J.length;
    }

    function E(V, S) {
      var U = "=" + M, R = V.indexOf(U, S), T = q(V.substring(V.indexOf("=", S) + 1, R)).split(" ");
      H = T[0];
      M = T[1];
      return R + U.length - 1;
    }

    if (B) {
      B = B.split(" ");
      H = B[0];
      M = B[1];
    }
    for (N = 0; N < O; N++) {
      if (z == y) {
        if (w(H, G, N)) {
          --N;
          L();
          z = D;
        } else {
          if (G.charAt(N) == "\n") {
            I(F);
          } else {
            P += G.charAt(N);
          }
        }
      } else {
        if (z == D) {
          N += H.length - 1;
          Q = a[G.charAt(N + 1)];
          C = Q ? G.charAt(N + 1) : "_v";
          if (C == "=") {
            N = E(G, N);
            z = y;
          } else {
            if (Q) {
              N++;
            }
            z = x;
          }
          F = N;
        } else {
          if (w(M, G, N)) {
            J.push({tag: C, n: q(P), otag: H, ctag: M, i: (C == "/") ? F - M.length : N + H.length});
            P = "";
            N += M.length - 1;
            z = y;
            if (C == "{") {
              if (M == "}}") {
                N++;
              } else {
                r(J[J.length - 1]);
              }
            }
          } else {
            P += G.charAt(N);
          }
        }
      }
    }
    I(F, true);
    return J;
  };
  function r(x) {
    if (x.n.substr(x.n.length - 1) === "}") {
      x.n = x.n.substring(0, x.n.length - 1);
    }
  }

  function q(x) {
    if (x.trim) {
      return x.trim();
    }
    return x.replace(/^\s*|\s*$/g, "");
  }

  function w(x, B, z) {
    if (B.charAt(z) != x.charAt(0)) {
      return false;
    }
    for (var A = 1, y = x.length; A < y; A++) {
      if (B.charAt(z + A) != x.charAt(A)) {
        return false;
      }
    }
    return true;
  }

  function b(D, A, y, C) {
    var x = [], B = null, z = null;
    while (D.length > 0) {
      z = D.shift();
      if (z.tag == "#" || z.tag == "^" || e(z, C)) {
        y.push(z);
        z.nodes = b(D, z.tag, y, C);
        x.push(z);
      } else {
        if (z.tag == "/") {
          if (y.length === 0) {
            throw new Error("Closing tag without opener: /" + z.n);
          }
          B = y.pop();
          if (z.n != B.n && !g(z.n, B.n, C)) {
            throw new Error("Nesting error: " + B.n + " vs. " + z.n);
          }
          B.end = z.i;
          return x;
        } else {
          x.push(z);
        }
      }
    }
    if (y.length > 0) {
      throw new Error("missing closing tag: " + y.pop().n);
    }
    return x;
  }

  function e(A, y) {
    for (var z = 0, x = y.length; z < x; z++) {
      if (y[z].o == A.n) {
        A.tag = "#";
        return true;
      }
    }
  }

  function g(B, z, y) {
    for (var A = 0, x = y.length; A < x; A++) {
      if (y[A].c == B && y[A].o == z) {
        return true;
      }
    }
  }

  n.generate = function (x, A, y) {
    var z = 'var _=this;_.b(i=i||"");' + t(x) + "return _.fl();";
    if (y.asString) {
      return"function(c,p,i){" + z + ";}";
    }
    return new n.Template(new Function("c", "p", "i", z), A, n, y);
  };
  function v(x) {
    return x.replace(u, "\\\\").replace(j, '\\"').replace(o, "\\n").replace(k, "\\r");
  }

  function i(x) {
    return(~x.indexOf(".")) ? "d" : "f";
  }

  function t(y) {
    var B = "";
    for (var A = 0, z = y.length; A < z; A++) {
      var x = y[A].tag;
      if (x == "#") {
        B += h(y[A].nodes, y[A].n, i(y[A].n), y[A].i, y[A].end, y[A].otag + " " + y[A].ctag);
      } else {
        if (x == "^") {
          B += s(y[A].nodes, y[A].n, i(y[A].n));
        } else {
          if (x == "<" || x == ">") {
            B += d(y[A]);
          } else {
            if (x == "{" || x == "&") {
              B += c(y[A].n, i(y[A].n));
            } else {
              if (x == "\n") {
                B += l('"\\n"' + (y.length - 1 == A ? "" : " + i"));
              } else {
                if (x == "_v") {
                  B += p(y[A].n, i(y[A].n));
                } else {
                  if (x === undefined) {
                    B += l('"' + v(y[A]) + '"');
                  }
                }
              }
            }
          }
        }
      }
    }
    return B;
  }

  function h(y, C, B, A, x, z) {
    return"if(_.s(_." + B + '("' + v(C) + '",c,p,1),c,p,0,' + A + "," + x + ',"' + z + '")){_.rs(c,p,function(c,p,_){' + t(y) + "});c.pop();}";
  }

  function s(x, z, y) {
    return"if(!_.s(_." + y + '("' + v(z) + '",c,p,1),c,p,1,0,0,"")){' + t(x) + "};";
  }

  function d(x) {
    return'_.b(_.rp("' + v(x.n) + '",c,p,"' + (x.indent || "") + '"));';
  }

  function c(y, x) {
    return"_.b(_.t(_." + x + '("' + v(y) + '",c,p,0)));';
  }

  function p(y, x) {
    return"_.b(_.v(_." + x + '("' + v(y) + '",c,p,0)));';
  }

  function l(x) {
    return"_.b(" + x + ");";
  }

  n.parse = function (y, z, x) {
    x = x || {};
    return b(y, "", [], x.sectionTags || []);
  }, n.cache = {};
  n.compile = function (A, x) {
    x = x || {};
    var z = A + "||" + !!x.asString;
    var y = this.cache[z];
    if (y) {
      return y;
    }
    y = this.generate(this.parse(this.scan(A, x.delimiters), A, x), A, x);
    return this.cache[z] = y;
  };
})(typeof exports !== "undefined" ? exports : Hogan);
if (typeof define === "function" && define.amd) {
  define(Hogan);
}
function trackAction(c, b, a) {
  var d = "/track.htm?action=" + c + "&t=" + Date.parse(new Date());
  if (b) {
    d += "&rId=" + b;
  } else {
    if (trackAction.rid) {
      d += "&rId=" + trackAction.rid;
    }
  }
  if (a) {
    d = d.replace("track.htm", "timetrack.htm");
  }
  new Image().src = d;
}
function trackHotelCityBox(a, b) {
  new Image().src = "http://www.qunar.com/track.htm?_=" + new Date().getTime() + "&hotel=citybox&q=" + encodeURIComponent(a) + "&c=" + b;
}
function gaClk(b) {
  var g = window.QNRGA, h = +new Date();
  if (window.location.protocol.indexOf("https") >= 0 || !g) {
    return false;
  }
  if (typeof b === "string") {
    b = {a: b, t: h};
  }
  if (g.clk) {
    g.clk(b);
  } else {
    g = new g();
    g.add("utmwv", "0.1");
    g.add("t", Math.random());
    g.add("utmsr", screen.width + "*" + screen.height);
    g.add("utmasr", screen.availWidth + "*" + screen.availHeight);
    g.add("utmr", document.referrer || "-1");
    g.add("utmp", window.location.href.toString());
    g.add("utmhn", window.location.host.toString());
    g.add("s", window._ba_utm_s || null);
    if (window._ba_utm_ex) {
      var e = window._ba_utm_ex;
      for (var f in e) {
        g.add(f, e[f]);
      }
    }
    b = b || {};
    for (var f in b) {
      g.add(f, b[f]);
    }
    var i = [];
    var a = g.param;
    for (var c in a) {
      i.push(c + "=" + encodeURIComponent(a[c]));
    }
    i = i.join("&");
    var d = new Image();
    d.src = "http://bc.qunar.com/clk?" + i;
  }
}
function gaNotClk(e) {
  var d = window.QNRGA, c = +new Date();
  if (window.location.protocol.indexOf("https") >= 0 || !d) {
    return false;
  }
  if (typeof e === "string") {
    e = {a: e, t: c};
  }
  d = new d();
  d.add("utmwv", "0.1");
  d.add("t", Math.random());
  d.add("utmsr", screen.width + "*" + screen.height);
  d.add("utmasr", screen.availWidth + "*" + screen.availHeight);
  d.add("utmr", document.referrer || "-1");
  d.add("utmp", window.location.href.toString());
  d.add("utmhn", window.location.host.toString());
  d.add("s", window._ba_utm_s || null);
  if (window._ba_utm_ex) {
    var b = window._ba_utm_ex;
    for (var a in b) {
      d.add(a, b[a]);
    }
  }
  e = e || {};
  for (var a in e) {
    d.add(a, e[a]);
  }
  d.send();
}
var Cookie = {originalString: document.cookie, read: function () {
  this.originalString = document.cookie;
}, _getCookieHash: function () {
  var c = this.originalString.split(";");
  var b = {};
  for (var a = 0; a < c.length; a++) {
    if (c[a].indexOf("=") != -1) {
      b[c[a].split("=")[0].replace(/(^\s*)/g, "").replace(/(\s*$)/g, "")] = unescape(c[a].split("=")[1]).replace(/(^\s*)/g, "").replace(/(\s*$)/g, "");
    }
  }
  return b;
}, setCookie: function (e, f, d, a, b) {
  var c = e + "=" + escape(f);
  if (d) {
    c += "; expires=" + d.toGMTString();
  }
  if (a) {
    c += "; domain=" + a;
  }
  if (b) {
    c += "; path=" + b;
  }
  document.cookie = c;
  this.originalString = document.cookie;
  this.values = this._getCookieHash();
}, deleteCookie: function (b) {
  var a = new Date(1);
  document.cookie = b + "=;expires=" + a.toGMTString();
  this.originalString = document.cookie;
  this.values = this._getCookieHash();
}, refresh: function () {
  this.read();
  Cookie.values = Cookie._getCookieHash();
}};
Cookie.values = Cookie._getCookieHash();
if (typeof(QNR) === "undefined") {
  QNR = {};
}
QNR.FlightSearchBoxConf = {hotCity: {domesticfrom: [
  {title: "热门", key: "domesticfrom"},
  {title: "ABCDE", key: "ABCDE"},
  {title: "FGHJ", key: "FGHJ"},
  {title: "KLMNP", key: "KLMNP"},
  {title: "QRSTW", key: "QRSTW"},
  {title: "XYZ", key: "XYZ"}
], domesticto: [
  {title: "热门", key: "domesticto"},
  {title: "ABCDE", key: "ABCDE"},
  {title: "FGHJ", key: "FGHJ"},
  {title: "KLMNP", key: "KLMNP"},
  {title: "QRSTW", key: "QRSTW"},
  {title: "XYZ", key: "XYZ"}
], interfrom: [
  {title: "热门", key: "interfrom"},
  {title: "ABCDE", key: "ABCDE"},
  {title: "FGHJ", key: "FGHJ"},
  {title: "KLMNP", key: "KLMNP"},
  {title: "QRSTW", key: "QRSTW"},
  {title: "XYZ", key: "XYZ"},
  {title: "国际·港澳台", key: "国际·港澳台_country"}
], interto: [
  {title: "热门城市和国家", key: "国际·港澳台_country"},
  {title: "亚洲/大洋洲", key: "亚洲/大洋洲"},
  {title: "美洲", key: "美洲"},
  {title: "欧洲", key: "欧洲"},
  {title: "非洲", key: "非洲"},
  {title: "国内", key: "domesticfrom"}
], multifrom: [
  {title: "热门", key: "interfrom"},
  {title: "ABCDE", key: "ABCDE"},
  {title: "FGHJ", key: "FGHJ"},
  {title: "KLMNP", key: "KLMNP"},
  {title: "QRSTW", key: "QRSTW"},
  {title: "XYZ", key: "XYZ"},
  {title: "国际·港澳台", key: "国际·港澳台"}
], multito: [
  {title: "热门城市", key: "国际·港澳台"},
  {title: "亚洲/大洋洲", key: "亚洲/大洋洲"},
  {title: "美洲", key: "美洲"},
  {title: "欧洲", key: "欧洲"},
  {title: "非洲", key: "非洲"},
  {title: "国内", key: "domesticfrom"}
], data: {domesticfrom: {cityList: [
  {name: "上海", country: "中国"},
  {name: "北京", country: "中国"},
  {name: "广州", country: "中国"},
  {name: "昆明", country: "中国"},
  {name: "西安", country: "中国"},
  {name: "成都", country: "中国"},
  {name: "深圳", country: "中国"},
  {name: "厦门", country: "中国"},
  {name: "乌鲁木齐", country: "中国"},
  {name: "南京", country: "中国"},
  {name: "重庆", country: "中国"},
  {name: "杭州", country: "中国"},
  {name: "大连", country: "中国"},
  {name: "长沙", country: "中国"},
  {name: "海口", country: "中国"},
  {name: "哈尔滨", country: "中国"},
  {name: "青岛", country: "中国"},
  {name: "沈阳", country: "中国"},
  {name: "三亚", country: "中国"},
  {name: "济南", country: "中国"},
  {name: "武汉", country: "中国"},
  {name: "郑州", country: "中国"},
  {name: "贵阳", country: "中国"},
  {name: "南宁", country: "中国"},
  {name: "福州", country: "中国"},
  {name: "天津", country: "中国"},
  {name: "长春", country: "中国"},
  {name: "太原", country: "中国"},
  {name: "南昌", country: "中国"},
  {name: "丽江", country: "中国"}
], title: "热门城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, domesticto: {cityList: [
  {name: "上海", country: "中国"},
  {name: "北京", country: "中国"},
  {name: "广州", country: "中国"},
  {name: "昆明", country: "中国"},
  {name: "西安", country: "中国"},
  {name: "成都", country: "中国"},
  {name: "深圳", country: "中国"},
  {name: "厦门", country: "中国"},
  {name: "乌鲁木齐", country: "中国"},
  {name: "南京", country: "中国"},
  {name: "重庆", country: "中国"},
  {name: "杭州", country: "中国"},
  {name: "大连", country: "中国"},
  {name: "长沙", country: "中国"},
  {name: "海口", country: "中国"},
  {name: "哈尔滨", country: "中国"},
  {name: "青岛", country: "中国"},
  {name: "沈阳", country: "中国"},
  {name: "三亚", country: "中国"},
  {name: "济南", country: "中国"},
  {name: "武汉", country: "中国"},
  {name: "郑州", country: "中国"},
  {name: "贵阳", country: "中国"},
  {name: "南宁", country: "中国"},
  {name: "福州", country: "中国"},
  {name: "天津", country: "中国"},
  {name: "南昌", country: "中国"},
  {name: "丽江", country: "中国"},
  {name: "香港", country: "中国"},
  {name: "台北", country: "中国"}
], title: "热门城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, interfrom: {cityList: [
  {name: "上海", country: "中国"},
  {name: "北京", country: "中国"},
  {name: "香港", country: "中国"},
  {name: "厦门", country: "中国"},
  {name: "重庆", country: "中国"},
  {name: "广州", country: "中国"},
  {name: "成都", country: "中国"},
  {name: "昆明", country: "中国"},
  {name: "曼谷", country: "泰国"},
  {name: "南京", country: "中国"},
  {name: "杭州", country: "中国"},
  {name: "深圳", country: "中国"},
  {name: "首尔", country: "韩国"},
  {name: "沈阳", country: "中国"},
  {name: "澳门", country: "中国澳门"},
  {name: "新加坡", country: "新加坡"},
  {name: "武汉", country: "中国"},
  {name: "天津", country: "中国"},
  {name: "青岛", country: "中国"},
  {name: "西安", country: "中国"},
  {name: "大连", country: "中国"},
  {name: "台北", country: "中国"},
  {name: "东京", country: "日本"},
  {name: "吉隆坡", country: "马来西亚"},
  {name: "南宁", country: "中国"},
  {name: "福州", country: "中国"},
  {name: "普吉", country: "泰国"},
  {name: "长沙", country: "中国"},
  {name: "哈尔滨", country: "中国"},
  {name: "悉尼", country: "澳大利亚"}
], title: "热门城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, ABCDE: {charSort: true, cityList: [
  {"char": "A", list: [
    {name: "阿里", country: "中国"},
    {name: "阿尔山", country: "中国"},
    {name: "安庆", country: "中国"},
    {name: "阿勒泰", country: "中国"},
    {name: "安康", country: "中国"},
    {name: "鞍山", country: "中国"},
    {name: "安顺", country: "中国"},
    {name: "阿克苏", country: "中国"},
    {name: "阿拉善左旗", country: "中国"},
    {name: "阿拉善右旗", country: "中国"}
  ]},
  {"char": "B", list: [
    {name: "包头", country: "中国"},
    {name: "北海", country: "中国"},
    {name: "北京", country: "中国"},
    {name: "百色", country: "中国"},
    {name: "保山", country: "中国"},
    {name: "博乐", country: "中国"},
    {name: "毕节", country: "中国"},
    {name: "巴彦淖尔", country: "中国"}
  ]},
  {"char": "C", list: [
    {name: "长治", country: "中国"},
    {name: "池州", country: "中国"},
    {name: "长春", country: "中国"},
    {name: "常州", country: "中国"},
    {name: "昌都", country: "中国"},
    {name: "朝阳", country: "中国"},
    {name: "常德", country: "中国"},
    {name: "长白山", country: "中国"},
    {name: "成都", country: "中国"},
    {name: "重庆", country: "中国"},
    {name: "长沙", country: "中国"},
    {name: "赤峰", country: "中国"}
  ]},
  {"char": "D", list: [
    {name: "大同", country: "中国"},
    {name: "大连", country: "中国"},
    {name: "东营", country: "中国"},
    {name: "大庆", country: "中国"},
    {name: "丹东", country: "中国"},
    {name: "大理", country: "中国"},
    {name: "敦煌", country: "中国"},
    {name: "达州", country: "中国"},
    {name: "稻城", country: "中国"}
  ]},
  {"char": "E", list: [
    {name: "恩施", country: "中国"},
    {name: "鄂尔多斯", country: "中国"},
    {name: "二连浩特", country: "中国"},
    {name: "额济纳旗", country: "中国"}
  ]}
], title: "拼音A-E城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, FGHJ: {charSort: true, cityList: [
  {"char": "F", list: [
    {name: "佛山", country: "中国"},
    {name: "福州", country: "中国"},
    {name: "阜阳", country: "中国"},
    {name: "抚远", country: "中国"}
  ]},
  {"char": "G", list: [
    {name: "贵阳", country: "中国"},
    {name: "桂林", country: "中国"},
    {name: "广州", country: "中国"},
    {name: "广元", country: "中国"},
    {name: "格尔木", country: "中国"},
    {name: "赣州", country: "中国"},
    {name: "固原", country: "中国"}
  ]},
  {"char": "H", list: [
    {name: "哈密", country: "中国"},
    {name: "呼和浩特", country: "中国"},
    {name: "黑河", country: "中国"},
    {name: "海拉尔", country: "中国"},
    {name: "哈尔滨", country: "中国"},
    {name: "海口", country: "中国"},
    {name: "黄山", country: "中国"},
    {name: "杭州", country: "中国"},
    {name: "邯郸", country: "中国"},
    {name: "合肥", country: "中国"},
    {name: "黄龙", country: "中国"},
    {name: "汉中", country: "中国"},
    {name: "和田", country: "中国"},
    {name: "淮安", country: "中国"}
  ]},
  {"char": "J", list: [
    {name: "鸡西", country: "中国"},
    {name: "晋江", country: "中国"},
    {name: "锦州", country: "中国"},
    {name: "景德镇", country: "中国"},
    {name: "嘉峪关", country: "中国"},
    {name: "井冈山", country: "中国"},
    {name: "济宁", country: "中国"},
    {name: "九江", country: "中国"},
    {name: "佳木斯", country: "中国"},
    {name: "济南", country: "中国"},
    {name: "加格达奇", country: "中国"},
    {name: "金昌", country: "中国"},
    {name: "揭阳", country: "中国"}
  ]}
], title: "拼音F-J城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, KLMNP: {charSort: true, cityList: [
  {"char": "K", list: [
    {name: "喀什", country: "中国"},
    {name: "昆明", country: "中国"},
    {name: "康定", country: "中国"},
    {name: "克拉玛依", country: "中国"},
    {name: "库尔勒", country: "中国"},
    {name: "库车", country: "中国"},
    {name: "喀纳斯", country: "中国"},
    {name: "凯里", country: "中国"}
  ]},
  {"char": "L", list: [
    {name: "兰州", country: "中国"},
    {name: "洛阳", country: "中国"},
    {name: "丽江", country: "中国"},
    {name: "荔波", country: "中国"},
    {name: "林芝", country: "中国"},
    {name: "柳州", country: "中国"},
    {name: "泸州", country: "中国"},
    {name: "连云港", country: "中国"},
    {name: "黎平", country: "中国"},
    {name: "连城", country: "中国"},
    {name: "拉萨", country: "中国"},
    {name: "临沧", country: "中国"},
    {name: "临沂", country: "中国"},
    {name: "吕梁", country: "中国"}
  ]},
  {"char": "M", list: [
    {name: "芒市", country: "中国"},
    {name: "牡丹江", country: "中国"},
    {name: "满洲里", country: "中国"},
    {name: "绵阳", country: "中国"},
    {name: "梅县", country: "中国"},
    {name: "漠河", country: "中国"}
  ]},
  {"char": "N", list: [
    {name: "南京", country: "中国"},
    {name: "南充", country: "中国"},
    {name: "南宁", country: "中国"},
    {name: "南阳", country: "中国"},
    {name: "南通", country: "中国"},
    {name: "南昌", country: "中国"},
    {name: "那拉提", country: "中国"},
    {name: "宁波", country: "中国"}
  ]},
  {"char": "P", list: [
    {name: "攀枝花", country: "中国"},
    {name: "普洱", country: "中国"}
  ]}
], title: "拼音K-P城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, QRSTW: {charSort: true, cityList: [
  {"char": "Q", list: [
    {name: "衢州", country: "中国"},
    {name: "黔江", country: "中国"},
    {name: "秦皇岛", country: "中国"},
    {name: "庆阳", country: "中国"},
    {name: "且末", country: "中国"},
    {name: "齐齐哈尔", country: "中国"},
    {name: "青岛", country: "中国"}
  ]},
  {"char": "R", list: [
    {name: "日喀则", country: "中国"}
  ]},
  {"char": "S", list: [
    {name: "深圳", country: "中国"},
    {name: "石家庄", country: "中国"},
    {name: "三亚", country: "中国"},
    {name: "沈阳", country: "中国"},
    {name: "上海", country: "中国"},
    {name: "神农架", country: "中国"}
  ]},
  {"char": "T", list: [
    {name: "唐山", country: "中国"},
    {name: "铜仁", country: "中国"},
    {name: "塔城", country: "中国"},
    {name: "腾冲", country: "中国"},
    {name: "台州", country: "中国"},
    {name: "天水", country: "中国"},
    {name: "天津", country: "中国"},
    {name: "通辽", country: "中国"},
    {name: "吐鲁番", country: "中国"},
    {name: "太原", country: "中国"}
  ]},
  {"char": "W", list: [
    {name: "威海", country: "中国"},
    {name: "武汉", country: "中国"},
    {name: "梧州", country: "中国"},
    {name: "文山", country: "中国"},
    {name: "无锡", country: "中国"},
    {name: "潍坊", country: "中国"},
    {name: "武夷山", country: "中国"},
    {name: "乌兰浩特", country: "中国"},
    {name: "温州", country: "中国"},
    {name: "乌鲁木齐", country: "中国"},
    {name: "万州", country: "中国"},
    {name: "乌海", country: "中国"}
  ]}
], title: "拼音Q-W城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, XYZ: {charSort: true, cityList: [
  {"char": "X", list: [
    {name: "兴义", country: "中国"},
    {name: "西昌", country: "中国"},
    {name: "厦门", country: "中国"},
    {name: "香格里拉", country: "中国"},
    {name: "西安", country: "中国"},
    {name: "西宁", country: "中国"},
    {name: "襄阳(中国)", country: "中国"},
    {name: "锡林浩特", country: "中国"},
    {name: "西双版纳", country: "中国"},
    {name: "徐州", country: "中国"}
  ]},
  {"char": "Y", list: [
    {name: "义乌", country: "中国"},
    {name: "永州", country: "中国"},
    {name: "榆林", country: "中国"},
    {name: "扬州", country: "中国"},
    {name: "延安", country: "中国"},
    {name: "运城", country: "中国"},
    {name: "烟台", country: "中国"},
    {name: "银川", country: "中国"},
    {name: "宜昌", country: "中国"},
    {name: "宜宾", country: "中国"},
    {name: "宜春", country: "中国"},
    {name: "盐城", country: "中国"},
    {name: "延吉", country: "中国"},
    {name: "玉树", country: "中国"},
    {name: "伊宁", country: "中国"},
    {name: "伊春", country: "中国"}
  ]},
  {"char": "Z", list: [
    {name: "珠海", country: "中国"},
    {name: "昭通", country: "中国"},
    {name: "张家界", country: "中国"},
    {name: "舟山", country: "中国"},
    {name: "郑州", country: "中国"},
    {name: "中卫", country: "中国"},
    {name: "芷江", country: "中国"},
    {name: "湛江", country: "中国"},
    {name: "遵义", country: "中国"},
    {name: "张掖", country: "中国"},
    {name: "张家口", country: "中国"}
  ]}
], title: "拼音X-Z城市", desc: "可直接输入中文名/拼音/英文名/三字码"}, "国际·港澳台": {cityList: [
  {name: "香港", country: "中国香港"},
  {name: "曼谷", country: "泰国"},
  {name: "新加坡", country: "新加坡"},
  {name: "马尼拉", country: "菲律宾"},
  {name: "墨尔本", country: "澳大利亚"},
  {name: "首尔", country: "韩国"},
  {name: "澳门", country: "中国澳门"},
  {name: "吉隆坡", country: "马来西亚"},
  {name: "旧金山", country: "美国"},
  {name: "暹粒", country: "柬埔寨"},
  {name: "台北", country: "中国台湾"},
  {name: "普吉", country: "泰国"},
  {name: "大阪", country: "日本"},
  {name: "巴厘岛", country: "印度尼西亚"},
  {name: "伦敦", country: "英国"},
  {name: "东京", country: "日本"},
  {name: "胡志明市", country: "越南"},
  {name: "纽约", country: "美国"},
  {name: "高雄", country: "中国台湾"},
  {name: "釜山", country: "韩国"},
  {name: "洛杉矶", country: "美国"},
  {name: "悉尼", country: "澳大利亚"},
  {name: "苏梅岛", country: "泰国"},
  {name: "济州岛", country: "韩国"},
  {name: "温哥华", country: "加拿大"},
  {name: "清迈", country: "泰国"},
  {name: "加德满都", country: "尼泊尔"},
  {name: "雅加达", country: "印度尼西亚"},
  {name: "金边", country: "柬埔寨"},
  {name: "迪拜", country: "阿拉伯联合酋长国"}
], title: "热门国际城市", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "国际·港澳台_country": {fuzzyArea: true, cityList: [
  {name: "香港", country: "中国香港"},
  {name: "曼谷", country: "泰国"},
  {name: "新加坡", country: "新加坡"},
  {name: "马尼拉", country: "菲律宾"},
  {name: "墨尔本", country: "澳大利亚"},
  {name: "首尔", country: "韩国"},
  {name: "澳门", country: "中国澳门"},
  {name: "吉隆坡", country: "马来西亚"},
  {name: "旧金山", country: "美国"},
  {name: "暹粒", country: "柬埔寨"},
  {name: "台北", country: "中国台湾"},
  {name: "普吉", country: "泰国"},
  {name: "大阪", country: "日本"},
  {name: "巴厘岛", country: "印度尼西亚"},
  {name: "伦敦", country: "英国"},
  {name: "东京", country: "日本"},
  {name: "胡志明市", country: "越南"},
  {name: "纽约", country: "美国"},
  {name: "高雄", country: "中国台湾"},
  {name: "釜山", country: "韩国"},
  {name: "洛杉矶", country: "美国"},
  {name: "悉尼", country: "澳大利亚"},
  {name: "苏梅岛", country: "泰国"},
  {name: "济州岛", country: "韩国"},
  {name: "温哥华", country: "加拿大"},
  {name: "清迈", country: "泰国"},
  {name: "加德满都", country: "尼泊尔"},
  {name: "雅加达", country: "印度尼西亚"},
  {name: "金边", country: "柬埔寨"},
  {name: "迪拜", country: "阿拉伯联合酋长国"}
], countryList: [
  {name: "中国", country: "中国"},
  {name: "韩国", country: "韩国"},
  {name: "泰国", country: "泰国"},
  {name: "美国", country: "美国"},
  {name: "加拿大", country: "加拿大"},
  {name: "日本", country: "日本"},
  {name: "澳大利亚", country: "澳大利亚"},
  {name: "英国", country: "英国"},
  {name: "法国", country: "法国"},
  {name: "马来西亚", country: "马来西亚"}
], title: "热门国际城市", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "热门城市和国家": {fuzzyArea: true, cityList: [
  {name: "香港", country: "中国香港"},
  {name: "曼谷", country: "泰国"},
  {name: "新加坡", country: "新加坡"},
  {name: "马尼拉", country: "菲律宾"},
  {name: "墨尔本", country: "澳大利亚"},
  {name: "首尔", country: "韩国"},
  {name: "澳门", country: "中国澳门"},
  {name: "吉隆坡", country: "马来西亚"},
  {name: "旧金山", country: "美国"},
  {name: "暹粒", country: "柬埔寨"},
  {name: "台北", country: "中国台湾"},
  {name: "普吉", country: "泰国"},
  {name: "大阪", country: "日本"},
  {name: "巴厘岛", country: "印度尼西亚"},
  {name: "伦敦", country: "英国"},
  {name: "东京", country: "日本"},
  {name: "胡志明市", country: "越南"},
  {name: "纽约", country: "美国"},
  {name: "高雄", country: "中国台湾"},
  {name: "釜山", country: "韩国"},
  {name: "洛杉矶", country: "美国"},
  {name: "悉尼", country: "澳大利亚"},
  {name: "苏梅岛", country: "泰国"},
  {name: "济州岛", country: "韩国"},
  {name: "温哥华", country: "加拿大"},
  {name: "清迈", country: "泰国"},
  {name: "加德满都", country: "尼泊尔"},
  {name: "雅加达", country: "印度尼西亚"},
  {name: "金边", country: "柬埔寨"},
  {name: "迪拜", country: "阿拉伯联合酋长国"}
], countryList: [
  {name: "中国", country: "中国"},
  {name: "韩国", country: "韩国"},
  {name: "泰国", country: "泰国"},
  {name: "美国", country: "美国"},
  {name: "加拿大", country: "加拿大"},
  {name: "日本", country: "日本"},
  {name: "澳大利亚", country: "澳大利亚"},
  {name: "英国", country: "英国"},
  {name: "法国", country: "法国"},
  {name: "马来西亚", country: "马来西亚"}
], title: "热门城市和国家", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "亚洲/大洋洲": {cityList: [
  {name: "香港", country: "中国香港"},
  {name: "新加坡", country: "新加坡"},
  {name: "首尔", country: "韩国"},
  {name: "曼谷", country: "泰国"},
  {name: "吉隆坡", country: "马来西亚"},
  {name: "东京", country: "日本"},
  {name: "台北", country: "中国台湾"},
  {name: "悉尼", country: "澳大利亚"},
  {name: "澳门", country: "中国澳门"},
  {name: "普吉", country: "泰国"},
  {name: "墨尔本", country: "澳大利亚"},
  {name: "胡志明市", country: "越南"},
  {name: "大阪", country: "日本"},
  {name: "巴厘岛", country: "印度尼西亚"},
  {name: "马尼拉", country: "菲律宾"},
  {name: "河内", country: "越南"},
  {name: "加德满都", country: "尼泊尔"},
  {name: "金边", country: "柬埔寨"},
  {name: "雅加达", country: "印度尼西亚"},
  {name: "马累", country: "马尔代夫"},
  {name: "暹粒", country: "柬埔寨"},
  {name: "迪拜", country: "阿拉伯联合酋长国"},
  {name: "釜山", country: "韩国"},
  {name: "名古屋", country: "日本"},
  {name: "奥克兰", country: "新西兰"},
  {name: "布里斯班", country: "澳大利亚"},
  {name: "槟城", country: "马来西亚"},
  {name: "高雄", country: "中国台湾"},
  {name: "新德里", country: "印度"},
  {name: "济州岛", country: "韩国"}
], title: "亚洲/大洋洲热门城市", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "美洲": {cityList: [
  {name: "纽约", country: "美国"},
  {name: "洛杉矶", country: "美国"},
  {name: "多伦多", country: "加拿大"},
  {name: "温哥华", country: "加拿大"},
  {name: "旧金山", country: "美国"},
  {name: "芝加哥", country: "美国"},
  {name: "华盛顿", country: "美国"},
  {name: "西雅图", country: "美国"},
  {name: "波士顿", country: "美国"},
  {name: "底特律", country: "美国"},
  {name: "亚特兰大", country: "美国"},
  {name: "蒙特利尔", country: "加拿大"},
  {name: "休斯敦", country: "美国"},
  {name: "火奴鲁鲁", country: "美国"},
  {name: "达拉斯", country: "美国"},
  {name: "拉斯维加斯", country: "美国"},
  {name: "费城", country: "美国"},
  {name: "圣保罗（巴西）", country: "巴西"},
  {name: "明尼阿波利斯", country: "美国"},
  {name: "渥太华", country: "加拿大"},
  {name: "凤凰城", country: "美国"},
  {name: "墨西哥", country: "墨西哥"},
  {name: "迈阿密", country: "美国"},
  {name: "丹佛", country: "美国"},
  {name: "奥兰多", country: "美国"},
  {name: "卡尔加里", country: "加拿大"},
  {name: "埃德蒙顿", country: "加拿大"},
  {name: "布宜诺斯艾利斯", country: "阿根廷"},
  {name: "里约热内卢", country: "巴西"},
  {name: "匹兹堡", country: "美国"}
], title: "美洲热门城市", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "欧洲": {cityList: [
  {name: "伦敦", country: "英国"},
  {name: "巴黎", country: "法国"},
  {name: "法兰克福", country: "德国"},
  {name: "莫斯科", country: "俄罗斯"},
  {name: "阿姆斯特丹", country: "荷兰"},
  {name: "罗马（意大利）", country: "意大利"},
  {name: "米兰", country: "意大利"},
  {name: "马德里", country: "西班牙"},
  {name: "慕尼黑", country: "德国"},
  {name: "柏林", country: "德国"},
  {name: "斯德哥尔摩", country: "瑞典"},
  {name: "伊斯坦布尔", country: "土耳其"},
  {name: "伯明翰（英国）", country: "英国"},
  {name: "巴塞罗那(西班牙)", country: "西班牙"},
  {name: "雅典", country: "希腊"},
  {name: "哥本哈根", country: "丹麦"},
  {name: "苏黎世", country: "瑞士"},
  {name: "布鲁塞尔", country: "比利时"},
  {name: "赫尔辛基", country: "芬兰"},
  {name: "爱丁堡", country: "英国"},
  {name: "维也纳", country: "奥地利"},
  {name: "格拉斯哥（英国）", country: "英国"},
  {name: "日内瓦", country: "瑞士"},
  {name: "圣彼得堡", country: "俄罗斯"},
  {name: "都柏林(爱尔兰)", country: "爱尔兰"},
  {name: "汉堡", country: "德国"},
  {name: "杜塞尔多夫", country: "德国"},
  {name: "布拉格", country: "捷克"},
  {name: "布达佩斯", country: "匈牙利"},
  {name: "基辅", country: "乌克兰"}
], title: "欧洲热门城市", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "非洲": {cityList: [
  {name: "开罗", country: "埃及"},
  {name: "约翰内斯堡", country: "南非"},
  {name: "内罗毕", country: "肯尼亚"},
  {name: "开普敦", country: "南非"},
  {name: "毛里求斯", country: "毛里求斯"},
  {name: "拉各斯", country: "尼日利亚"},
  {name: "喀土穆", country: "苏丹"},
  {name: "亚的斯亚贝巴", country: "埃塞俄比亚"},
  {name: "阿克拉", country: "加纳"},
  {name: "达累斯萨拉姆", country: "坦桑尼亚"},
  {name: "塞舌尔", country: "塞舌尔共和国"},
  {name: "阿尔及尔", country: "阿尔及利亚"},
  {name: "的黎波里", country: "利比亚"},
  {name: "阿布贾", country: "尼日利亚"},
  {name: "卡萨布兰卡", country: "摩洛哥"},
  {name: "突尼斯", country: "突尼斯"}
], title: "非洲热门城市", desc: "可直接输入中文名/拼音/英文名/三字码", cls: "inter"}, "国内": {cityList: [
  {name: "上海", country: "中国"},
  {name: "北京", country: "中国"},
  {name: "广州", country: "中国"},
  {name: "昆明", country: "中国"},
  {name: "西安", country: "中国"},
  {name: "成都", country: "中国"},
  {name: "深圳", country: "中国"},
  {name: "厦门", country: "中国"},
  {name: "乌鲁木齐", country: "中国"},
  {name: "南京", country: "中国"},
  {name: "重庆", country: "中国"},
  {name: "杭州", country: "中国"},
  {name: "大连", country: "中国"},
  {name: "长沙", country: "中国"},
  {name: "海口", country: "中国"},
  {name: "哈尔滨", country: "中国"},
  {name: "青岛", country: "中国"},
  {name: "沈阳", country: "中国"},
  {name: "三亚", country: "中国"},
  {name: "济南", country: "中国"},
  {name: "武汉", country: "中国"},
  {name: "郑州", country: "中国"},
  {name: "贵阳", country: "中国"},
  {name: "南宁", country: "中国"},
  {name: "福州", country: "中国"},
  {name: "天津", country: "中国"},
  {name: "长春", country: "中国"},
  {name: "石家庄", country: "中国"},
  {name: "太原", country: "中国"},
  {name: "兰州", country: "中国"}
], title: "热门国内城市", desc: "可直接输入中文名/拼音/英文名/三字码"}}}, specPlace: ["所有地点", "中国", "日本", "泰国", "马来西亚", "韩国", "英国", "美国", "澳大利亚", "加拿大", "法国", "德国", "俄罗斯", "菲律宾", "印度", "新西兰", "西班牙", "意大利"]};
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.FlightSearchBox = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="e_csh_sch_flpn">\r');
  a.b("\n" + b);
  a.b('    <div class="ch_search_tab">\r');
  a.b("\n" + b);
  a.b('        <div class="rt_link"><a href="http://user.qunar.com/flight_toolbox.jsp?catalog=ownorders&from=qunarindexP1" target="_blank">出票状态查询</a> | <a href="http://user.qunar.com/flight_toolbox.jsp?catalog=ownorders&from=tuigai" target="_blank">退票改签</a></div>\r');
  a.b("\n" + b);
  a.b('        <ul class="ul_search_tab">\r');
  a.b("\n" + b);
  a.b('            <li class="cur" id="js_domestic_tab"><a href="#" onclick="return false;">国内机票</a></li>\r');
  a.b("\n" + b);
  a.b('            <li id="js_inter_tab"><a href="#" onclick="return false;">国际·港澳台机票</a></li>\r');
  a.b("\n" + b);
  a.b('            <li id="js_tj_tab"><i class="ico_hurryup"></i><a href="#" onclick="return false;">特价机票</a></li>\r');
  a.b("\n" + b);
  a.b("        </ul>\r");
  a.b("\n" + b);
  a.b("    </div>\r");
  a.b("\n" + b);
  a.b('    <div class="ch_sch_form ch_sch_flt_bf clrfix" id="js_flighttype_tab_domestic">\r');
  a.b("\n" + b);
  a.b('        <form action="/twell/flight/Search.jsp" method="get" id="js_flight_domestic_searchbox">\r');
  a.b("\n" + b);
  a.b('            <input type="hidden" value="qunarindex" name="from" />\r');
  a.b("\n" + b);
  a.b('            <div class="crl_group">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                <div class="controls">\r');
  a.b("\n" + b);
  a.b('                    <div class="b_hongbao_lst js_hongbao">\r');
  a.b("\n" + b);
  a.b("                        全场买机票抢200元红包！\r");
  a.b("\n" + b);
  a.b('                            <div class="p_tips_wrap p_tips_blue" style="display:none;">\r');
  a.b("\n" + b);
  a.b('                                <div class="p_tips_arr p_tips_arr_l">\r');
  a.b("\n" + b);
  a.b('                                    <p class="arr_o"></p>\r');
  a.b("\n" + b);
  a.b('                                    <p class="arr_i"></p>\r');
  a.b("\n" + b);
  a.b("                                </div>\r");
  a.b("\n" + b);
  a.b('                                <div class="p_tips_content">\r');
  a.b("\n" + b);
  a.b("                                    <p>登录用户购票支付成功后即可领用200元红包，<br/>在去哪儿旅行客户端预订五星级酒店直接抵用！</p>\r");
  a.b("\n" + b);
  a.b("                                </div>\r");
  a.b("\n" + b);
  a.b("                            </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_searchtype_oneway" hidefocus="on">\r');
  a.b("\n" + b);
  a.b('                        <input name="searchType" type="radio" class="inp_rad js-searchtype-oneway" value="OnewayFlight" checked="checked" id="js_searchtype_oneway" />\r');
  a.b("\n" + b);
  a.b("                        单程</label>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_searchtype_roundtrip" hidefocus="on">\r');
  a.b("\n" + b);
  a.b('                        <input name="searchType" type="radio" class="inp_rad js-searchtype-roundtrip" value="RoundTripFlight" id="js_searchtype_roundtrip" />\r');
  a.b("\n" + b);
  a.b("                        往返</label>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_1">\r');
  a.b("\n" + b);
  a.b('                    <a class="lnk_change js-exchagne-city" href="#" title="调换出发地和目的地">换</a>\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">出发</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity" style="z-index: 40;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="fromCity" class="cinput" data-qcbox-placeholder="');
  a.b(a.v(a.f("placeholder", e, d, 0)));
  a.b('" data-qcbox-prefix="从" data-qcbox-suggest="flight-fromcity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">到达</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity" style="z-index: 30;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="toCity" class="cinput" data-qcbox-placeholder="');
  a.b(a.v(a.f("placeholder", e, d, 0)));
  a.b('" data-qcbox-prefix="到" data-qcbox-suggest="flight-tocity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_2">\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">日期</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate fromD" style="z-index: 20;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" id="js_domestic_fromdate" value="" name="fromDate" class="cinput" autocomplete="off" maxlength="10" data-prefix="往" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls js-backdate" style="visibility:hidden;">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate toD" style="z-index: 10;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" id="js_domestic_todate" value="" name="toDate" class="cinput" autocomplete="off" maxlength="10" data-prefix="返" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group crl_group_submit">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                <div class="controls"> <span class="p_btn">&nbsp;<button type="submit" class="btn_search"></button></span>\r');
  a.b("\n" + b);
  a.b('                    <div class="p_text">\r');
  a.b("\n" + b);
  a.b('                        <div class="flight_ad js-searchbox-ad"></div>\r');
  a.b("\n" + b);
  a.b('                        <p class="linenum">\r');
  a.b("\n" + b);
  a.b('                            <span id="js_alsosearch_domestic"></span>\r');
  a.b("\n" + b);
  a.b('                            可实时搜索&nbsp;<span class="highlight">10万</span>&nbsp;条国内国际航线\r');
  a.b("\n" + b);
  a.b("                        </p>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b("        </form>\r");
  a.b("\n" + b);
  a.b("    </div>\r");
  a.b("\n" + b);
  a.b('    <div class="ch_sch_form ch_sch_flt_bf clrfix" style="display:none" id="js_flighttype_tab_inter">\r');
  a.b("\n" + b);
  a.b('        <form action="/twell/flight/Search.jsp" id="js_flight_international_searchbox" method="get">\r');
  a.b("\n" + b);
  a.b('            <input type="hidden" value="qunarindex" name="from" />\r');
  a.b("\n" + b);
  a.b('            <div class="crl_group">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                <div class="controls pos-rel">\r');
  a.b("\n" + b);
  a.b('                    <div class="b_hongbao_lst js_hongbao">\r');
  a.b("\n" + b);
  a.b("                        全场买机票抢200元红包！\r");
  a.b("\n" + b);
  a.b('                            <div class="p_tips_wrap p_tips_blue" style="display:none;">\r');
  a.b("\n" + b);
  a.b('                                <div class="p_tips_arr p_tips_arr_l">\r');
  a.b("\n" + b);
  a.b('                                    <p class="arr_o"></p>\r');
  a.b("\n" + b);
  a.b('                                    <p class="arr_i"></p>\r');
  a.b("\n" + b);
  a.b("                                </div>\r");
  a.b("\n" + b);
  a.b('                                <div class="p_tips_content">\r');
  a.b("\n" + b);
  a.b("                                    <p>登录用户购票支付成功后即可领用200元红包，<br/>在去哪儿旅行客户端预订五星级酒店直接抵用！</p>\r");
  a.b("\n" + b);
  a.b("                                </div>\r");
  a.b("\n" + b);
  a.b("                            </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_intersearchtype_oneway" hidefocus="on">\r');
  a.b("\n" + b);
  a.b('                        <input name="searchType" type="radio" value="OnewayFlight" class="inp_rad js-searchtype-oneway" id="js_intersearchtype_oneway" />\r');
  a.b("\n" + b);
  a.b("                        单程</label>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_intersearchtype_roundtrip" hidefocus="on">\r');
  a.b("\n" + b);
  a.b('                        <input name="searchType" type="radio" value="RoundTripFlight" class="inp_rad js-searchtype-roundtrip" checked="checked" id="js_intersearchtype_roundtrip" />\r');
  a.b("\n" + b);
  a.b("                        往返</label>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_intersearchtype_multitrip" hidefocus="on"><input class="inp_chk inp_rad js-searchtype-multitrip" type="radio" name="searchType" value="MultiTripFlight" id="js_intersearchtype_multitrip"/> 多程（<span id="hoverInfo">含缺口</span>）</label>\r');
  a.b("\n" + b);
  a.b('                    <div class="morline-point" style="display:none;" id="morlinePoint">      \r');
  a.b("\n" + b);
  a.b("                        <p>“缺口程”机票指的是三地或四地之间的机票行程，举例如下：</p>\r");
  a.b("\n" + b);
  a.b("                        <p>1.由城市A到达城市B，再由C城市到达A。</p>\r");
  a.b("\n" + b);
  a.b("                        <p>2.由城市A到达城市B，再由B城市到达C。</p>\r");
  a.b("\n" + b);
  a.b("                        <p>3.由城市A到达城市B，再由C城市到达D。</p>\r");
  a.b("\n" + b);
  a.b('                        <div class="arrow-down"></div>\r');
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group" id="js_ow_rt_triplist">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_1">\r');
  a.b("\n" + b);
  a.b('                    <a class="lnk_change js-exchagne-city" href="#" title="调换出发地和目的地">换</a>\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">出发</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity" style="z-index: 40;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="fromCity" class="cinput" data-qcbox-placeholder="');
  a.b(a.v(a.f("placeholder", e, d, 0)));
  a.b('" data-qcbox-prefix="从" data-qcbox-suggest="flight-fromcity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">到达</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity" style="z-index: 30;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="toCity" class="cinput" data-qcbox-placeholder="');
  a.b(a.v(a.f("placeholder", e, d, 0)));
  a.b('" data-qcbox-prefix="到" data-qcbox-suggest="flight-tocity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_2">\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">日期</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate fromD" style="z-index: 20;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" id="fromDate" name="fromDate" class="cinput" autocomplete="off" maxlength="10" data-prefix="往" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls js-backdate">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate toD" style="z-index: 10;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" id="toDate" name="toDate" class="cinput" autocomplete="off" maxlength="10" data-prefix="返" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  a.b("            <!--多程模块 Changed:添加多程模块-->\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group more-line" id="js_multi_triplist">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_1" id="js_trips_list">                                           \r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">第<span>1</span>程</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls" style="z-index: 102;">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity">\r');
  a.b("\n" + b);
  a.b('                             <input type="text" value="" name="fromCityMulti" class="cinput" data-qcbox-placeholder="出发地" data-qcbox-prefix="从" data-qcbox-suggest="flight-fromcity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity">\r');
  a.b("\n" + b);
  a.b('                             <input type="text" value="" name="toCityMulti" class="cinput" data-qcbox-placeholder="目的地" data-qcbox-prefix="到" data-qcbox-suggest="flight-tocity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate fromD">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="fromDateMulti" class="cinput" autocomplete="off" maxlength="10" data-prefix="往" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <div class="clear"></div>\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">第<span>2</span>程</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls" style="z-index: 101;">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity">\r');
  a.b("\n" + b);
  a.b('                             <input type="text" value="" name="fromCityMulti" class="cinput" data-qcbox-placeholder="出发地" data-qcbox-prefix="从" data-qcbox-suggest="flight-fromcity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity">\r');
  a.b("\n" + b);
  a.b('                             <input type="text" value="" name="toCityMulti" class="cinput" data-qcbox-placeholder="目的地" data-qcbox-prefix="到" data-qcbox-suggest="flight-tocity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate fromD">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="fromDateMulti" class="cinput" autocomplete="off" maxlength="10" data-prefix="往" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div> \r");
  a.b("\n" + b);
  a.b('                    <div class="clear"></div>                        \r');
  a.b("\n" + b);
  a.b("                </div>                                 \r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b("            <!--//多程模块-->\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group crl_group_submit" id="js_submit_module">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                <div class="controls"> <span class="p_btn">&nbsp;<button type="submit" class="btn_search"></button></span>\r');
  a.b("\n" + b);
  a.b('                    <div class="p_text">\r');
  a.b("\n" + b);
  a.b('                        <div class="flight_ad js-searchbox-ad"></div>\r');
  a.b("\n" + b);
  a.b('                        <p class="linenum">\r');
  a.b("\n" + b);
  a.b('                            <span class="add-moreline"><a id="js_addtrip" href="javascript:void(0);">添加更多航程</a></span>\r');
  a.b("\n" + b);
  a.b('                            <span id="js_alsosearch_inter"></span>\r');
  a.b("\n" + b);
  a.b('                            <span id="js_realtime_info">可实时搜索&nbsp;<span class="highlight">10万</span>&nbsp;条国内国际航线</span></p>\r');
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b("        </form>\r");
  a.b("\n" + b);
  a.b("    </div>\r");
  a.b("\n" + b);
  a.b('    <div class="ch_sch_form ch_sch_flt_bf ch_sch_flt_lp clrfix" style="display:none;" id="js_flighttype_tab_tj">\r');
  a.b("\n" + b);
  a.b('        <form action="/twell/flight/Search.jsp" method="get" id="js_flight_tj_searchbox">\r');
  a.b("\n" + b);
  a.b('            <input type="hidden" value="qunarindex" name="from" />\r');
  a.b("\n" + b);
  a.b('            <input type="hidden" name="searchType" value="DealsFlight" />\r');
  a.b("\n" + b);
  a.b('            <input type="hidden" name="drange" value="15" />\r');
  a.b("\n" + b);
  a.b('            <div class="crl_group">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                <div class="controls">\r');
  a.b("\n" + b);
  a.b('                    <div class="b_hongbao_lst js_hongbao">\r');
  a.b("\n" + b);
  a.b("                        全场买机票抢200元红包！\r");
  a.b("\n" + b);
  a.b('                            <div class="p_tips_wrap p_tips_blue" style="display:none;">\r');
  a.b("\n" + b);
  a.b('                                <div class="p_tips_arr p_tips_arr_l">\r');
  a.b("\n" + b);
  a.b('                                    <p class="arr_o"></p>\r');
  a.b("\n" + b);
  a.b('                                    <p class="arr_i"></p>\r');
  a.b("\n" + b);
  a.b("                                </div>\r");
  a.b("\n" + b);
  a.b('                                <div class="p_tips_content">\r');
  a.b("\n" + b);
  a.b("                                    <p>登录用户购票支付成功后即可领用200元红包，<br/>在去哪儿旅行客户端预订五星级酒店直接抵用！</p>\r");
  a.b("\n" + b);
  a.b("                                </div>\r");
  a.b("\n" + b);
  a.b("                            </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_searchtype_domestic" hidefocus="on">\r');
  a.b("\n" + b);
  a.b('                        <input name="search" type="radio" class="inp_rad js-searchtype-domestic" value="domestic" checked="checked" id="js_searchtype_domestic" />\r');
  a.b("\n" + b);
  a.b("                        国内航线</label>\r");
  a.b("\n" + b);
  a.b('                    <label class="lal_rdo" for="js_searchtype_international" hidefocus="on">\r');
  a.b("\n" + b);
  a.b('                        <input name="search" type="radio" class="inp_rad js-searchtype-international" value="international" id="js_searchtype_international" />\r');
  a.b("\n" + b);
  a.b("                        国际·港澳台航线</label>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_1">\r');
  a.b("\n" + b);
  a.b('                    <a class="lnk_change js-exchagne-city" href="#" title="调换出发地和目的地">换</a>\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">出发</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity" style="z-index: 40;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="fromCity" class="cinput" data-qcbox-placeholder="');
  a.b(a.v(a.f("placeholder", e, d, 0)));
  a.b('" data-qcbox-prefix="从" data-qcbox-suggest="flight-fromcity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">到达</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qcity" style="z-index: 30;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" value="" name="toCity" class="cinput" data-qcbox-placeholder="');
  a.b(a.v(a.f("placeholder", e, d, 0)));
  a.b('" data-qcbox-prefix="到" data-qcbox-suggest="flight-tocity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />\r');
  a.b("\n" + b);
  a.b('                            <div class="qsuggest-contaier js-suggestcontainer"></div>\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b('                <div class="crl_sp2_2">\r');
  a.b("\n" + b);
  a.b('                    <div class="crl_lab">日期</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate fromD" style="z-index: 20;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" id="js_domestic_fromdate" value="" name="fromDate" class="cinput" autocomplete="off" maxlength="10" data-prefix="往" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b('		    		<div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                    <div class="controls js-backdate" style="visibility:hidden;">\r');
  a.b("\n" + b);
  a.b('                        <div class="qcbox qdate toD" style="z-index: 10;">\r');
  a.b("\n" + b);
  a.b('                            <input type="text" id="js_domestic_todate" value="" name="toDate" class="cinput" autocomplete="off" maxlength="10" data-prefix="返" />\r');
  a.b("\n" + b);
  a.b("                        </div>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b('            <div class="crl_group crl_group_submit">\r');
  a.b("\n" + b);
  a.b('                <div class="crl_lab">&nbsp;</div>\r');
  a.b("\n" + b);
  a.b('                <div class="controls"> <span class="p_btn">&nbsp;<button type="submit" class="btn_search"></button></span>\r');
  a.b("\n" + b);
  a.b('                    <div class="p_text">\r');
  a.b("\n" + b);
  a.b('                        <div class="flight_ad js-searchbox-ad"></div>\r');
  a.b("\n" + b);
  a.b('                        <p class="linenum">\r');
  a.b("\n" + b);
  a.b('                            <span id="js_alsosearch_domestic"></span>\r');
  a.b("\n" + b);
  a.b('                            可实时搜索&nbsp;<span class="highlight">10万</span>&nbsp;条国内国际航线\r');
  a.b("\n" + b);
  a.b("                        </p>\r");
  a.b("\n" + b);
  a.b("                    </div>\r");
  a.b("\n" + b);
  a.b("                </div>\r");
  a.b("\n" + b);
  a.b("            </div>\r");
  a.b("\n" + b);
  a.b("        </form>\r");
  a.b("\n" + b);
  a.b("    </div>\r");
  a.b("\n" + b);
  a.b('    <div class="ch_agt_inf">\r');
  a.b("\n" + b);
  a.b('        <abbr id="ifrCataAd" style="display:none;" data-type="qad" data-query="f=s&cur_page_num=0&rep=1&tag=99&vataposition=QNR_MzQ%3D_CN&vatacon=&rows=1&qtype=js&vataframe=bannerDefault" data-style="width:100%;" data-lazyAD="1"></abbr>\r');
  a.b("\n" + b);
  a.b('        <abbr id="flightSearchBoxAd" style="display:none;" data-type="qad" data-query="f=s&cur_page_num=0&rep=1&tag=99&vataposition=QNR_Mjg%3D_CN&vatacon=&rows=1&qtype=js&vataframe=bannerDefault" data-style="width:100%;"></abbr>\r');
  a.b("\n" + b);
  a.b("    </div>\r");
  a.b("\n" + b);
  a.b("</div>\r");
  a.b("\n");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.MultiFlightSearchBox = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="crl_lab">第<span>');
  a.b(a.v(a.f("trip", e, d, 0)));
  a.b("</span>程</div>");
  a.b("\n" + b);
  a.b('<div class="controls" style="z-index: ');
  a.b(a.v(a.f("zindex", e, d, 0)));
  a.b(';">');
  a.b("\n" + b);
  a.b('    <div class="qcbox qcity">');
  a.b("\n" + b);
  a.b('         <input type="text" name="fromCityMulti" class="cinput" data-qcbox-placeholder="出发地" data-qcbox-prefix="从" data-qcbox-suggest="flight-fromcity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />');
  a.b("\n" + b);
  a.b('        <div class="qsuggest-contaier js-suggestcontainer"></div>');
  a.b("\n" + b);
  a.b("    </div>");
  a.b("\n" + b);
  a.b('    <div class="qcbox qcity">');
  a.b("\n" + b);
  a.b('         <input type="text" name="toCityMulti" class="cinput" data-qcbox-placeholder="目的地" data-qcbox-prefix="到" data-qcbox-suggest="flight-tocity" data-qcbox-hotcity="flight" autocomplete="off" x-webkit-speech="x-webkit-speech" />');
  a.b("\n" + b);
  a.b('        <div class="qsuggest-contaier js-suggestcontainer"></div>');
  a.b("\n" + b);
  a.b("    </div>");
  a.b("\n" + b);
  a.b('    <div class="qcbox qdate fromD">');
  a.b("\n" + b);
  a.b('        <input type="text" name="fromDateMulti" class="cinput" autocomplete="off" maxlength="10" data-prefix="往" />');
  a.b("\n" + b);
  a.b("    </div>");
  a.b("\n" + b);
  a.b('    <div class="clo-icon-btn" id="delete');
  a.b(a.v(a.f("trip", e, d, 0)));
  a.b('"></div>');
  a.b("\n" + b);
  a.b("</div>");
  a.b("\n" + b);
  a.b('<div class="clear"></div>');
  a.b("\n");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.FlightHotCity = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="hint"');
  if (a.s(a.f("width", e, d, 1), e, d, 0, 27, 53, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b(' style="width:');
      f.b(f.v(f.f("width", h, g, 0)));
      f.b('px"');
    });
    e.pop();
  }
  a.b(' data-hotcity-nogo="true">');
  a.b("\n" + b);
  a.b('    <img class="closeImg js_close_flight_hotcity" src="http://simg4.qunarzz.com/site/images/new_main/Button_Hotcity_Close.gif"><div id="js_t-');
  a.b(a.v(a.f("type", e, d, 0)));
  a.b("-flight-hotcity-");
  a.b(a.v(a.f("cityType", e, d, 0)));
  a.b('" class="b_hct_tit">热门城市(可直接输入中文名/拼音/英文名/三字码)</div>');
  a.b("\n" + b);
  a.b('    <div class="b_hct_nav">');
  a.b("\n" + b);
  if (a.s(a.f("sort", e, d, 1), e, d, 0, 364, 495, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('        <span data-key="');
      f.b(f.v(f.f("key", h, g, 0)));
      f.b('" data-tab="');
      f.b(f.v(f.f("type", h, g, 0)));
      f.b("-flight-hotcity-");
      f.b(f.v(f.f("cityType", h, g, 0)));
      f.b('" data-tab-id="dfh-');
      f.b(f.v(f.f("tab", h, g, 0)));
      f.b('">');
      f.b(f.v(f.f("tab", h, g, 0)));
      f.b("</span>");
      f.b("\n");
    });
    e.pop();
  }
  a.b("    </div>");
  a.b("\n" + b);
  if (a.s(a.f("sort", e, d, 1), e, d, 0, 529, 646, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('    <div data-panel="');
      f.b(f.v(f.f("type", h, g, 0)));
      f.b("-flight-hotcity-");
      f.b(f.v(f.f("cityType", h, g, 0)));
      f.b('" data-panel-id="dfh-');
      f.b(f.v(f.f("tab", h, g, 0)));
      f.b('" class="b_hct_lst"></div>');
      f.b("\n");
    });
    e.pop();
  }
  a.b("</div>");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.FlightHotCityList = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  if (a.s(a.f("charSort", e, d, 1), e, d, 0, 13, 262, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      if (f.s(f.f("cityList", h, g, 1), h, g, 0, 27, 248, "{{ }}")) {
        f.rs(h, g, function (k, j, i) {
          if (i.s(i.f("char", k, j, 1), k, j, 0, 37, 238, "{{ }}")) {
            i.rs(k, j, function (n, m, l) {
              l.b('<dl class="e_hct_lst">');
              l.b("\n" + b);
              l.b("	<dt>");
              l.b(l.v(l.f("char", n, m, 0)));
              l.b("</dt>");
              l.b("\n" + b);
              l.b("	<dd>");
              l.b("\n" + b);
              l.b("		<ul>");
              l.b("\n" + b);
              if (l.s(l.f("list", n, m, 1), n, m, 0, 108, 204, "{{ }}")) {
                l.rs(n, m, function (r, q, o) {
                  o.b('		    <li><a class="js-hotcitylist" data-country="');
                  o.b(o.v(o.f("country", r, q, 0)));
                  o.b('" href="#">');
                  o.b(o.v(o.f("name", r, q, 0)));
                  o.b("</a></li>");
                  o.b("\n");
                });
                n.pop();
              }
              l.b("		</ul>");
              l.b("\n" + b);
              l.b("	</dd>");
              l.b("\n" + b);
              l.b("</dl>");
              l.b("\n");
            });
            k.pop();
          }
        });
        h.pop();
      }
    });
    e.pop();
  }
  a.b("\n" + b);
  if (!a.s(a.f("charSort", e, d, 1), e, d, 1, 0, 0, "")) {
    a.b("<ul>");
    a.b("\n" + b);
    if (a.s(a.f("cityList", e, d, 1), e, d, 0, 310, 397, "{{ }}")) {
      a.rs(e, d, function (h, g, f) {
        f.b('	<li><a class="js-hotcitylist" data-country="');
        f.b(f.v(f.f("country", h, g, 0)));
        f.b('" href="#">');
        f.b(f.v(f.f("name", h, g, 0)));
        f.b("</a></li>");
        f.b("\n");
      });
      e.pop();
    }
    a.b("</ul>");
    a.b("\n");
  }
  a.b("\n" + b);
  if (a.s(a.f("fuzzyArea", e, d, 1), e, d, 0, 446, 615, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('<span class="fuzzy_area_line"></span>');
      f.b("\n" + b);
      f.b("<ul>");
      f.b("\n" + b);
      if (f.s(f.f("countryList", h, g, 1), h, g, 0, 506, 592, "{{ }}")) {
        f.rs(h, g, function (k, j, i) {
          i.b('	<li><a class="js-hotcitylist" data-country="');
          i.b(i.v(i.f("country", k, j, 0)));
          i.b('" href="#">');
          i.b(i.v(i.f("name", k, j, 0)));
          i.b("</a></li>");
          i.b("\n");
        });
        h.pop();
      }
      f.b("</ul>");
      f.b("\n");
    });
    e.pop();
  }
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.MainSliderShowBox = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b("<!-- \r");
  a.b("\n" + b);
  a.b("data structure: \r");
  a.b("\n" + b);
  a.b("sliders: [\r");
  a.b("\n" + b);
  a.b("{\r");
  a.b("\n" + b);
  a.b('	title: "cxcxc"\r');
  a.b("\n" + b);
  a.b('	subtitile: "cafda",\r');
  a.b("\n" + b);
  a.b('	desc: "dfasdfa"\r');
  a.b("\n" + b);
  a.b("}\r");
  a.b("\n" + b);
  a.b("],\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  a.b("tailTitleFn: fn,\r");
  a.b("\n" + b);
  a.b("tailSubTitleFn: fn,\r");
  a.b("\n" + b);
  a.b("tailDescFn: fn\r");
  a.b("\n" + b);
  a.b("-->\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  a.b('<div class="e_pic_wrap">\r');
  a.b("\n" + b);
  a.b("	<ul>\r");
  a.b("\n" + b);
  if (a.s(a.f("sliders", e, d, 1), e, d, 0, 214, 813, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('	<li style="position: relative;">\r');
      f.b("\n" + b);
      f.b('		<a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank">\r');
      f.b("\n" + b);
      f.b('			<img width="728" height="215" alt="" src="');
      f.b(f.v(f.f("imgurl", h, g, 0)));
      f.b('">\r');
      f.b("\n" + b);
      f.b("		</a>\r");
      f.b("\n" + b);
      f.b('		<div class="e_flt_inf">\r');
      f.b("\n" + b);
      f.b('			<h2><a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank" title="');
      f.b(f.v(f.f("tailTitleFn", h, g, 0)));
      f.b('">');
      f.b(f.v(f.f("title_tailed", h, g, 0)));
      f.b("</a></h2>\r");
      f.b("\n" + b);
      f.b('			<h3><a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank" title="');
      f.b(f.v(f.f("tailSubTitleFn", h, g, 0)));
      f.b('">');
      f.b(f.v(f.f("subtitle_tailed", h, g, 0)));
      f.b("</a></h3>\r");
      f.b("\n" + b);
      f.b('			<p class="t_info" title="');
      f.b(f.v(f.f("tailDescFn", h, g, 0)));
      f.b('"><a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank">');
      f.b(f.v(f.f("desc_tailed", h, g, 0)));
      f.b('</a><a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" class="l_view">去看看</a></p>\r');
      f.b("\n" + b);
      f.b("		</div>\r");
      f.b("\n" + b);
      f.b('		<div class="e_bg_flt"> </div>\r');
      f.b("\n" + b);
      f.b("	</li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("	</ul>\r");
  a.b("\n" + b);
  a.b("</div>\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  a.b('<div class="e_prevnext">\r');
  a.b("\n" + b);
  a.b('    <div class="btn_prev"><a href="javascript: void 0;"></a></div>\r');
  a.b("\n" + b);
  a.b('    <div class="btn_next"><a href="javascript: void 0;"></a></div>\r');
  a.b("\n" + b);
  a.b("</div>\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  if (a.s(a.f("fixed_anchor_fn", e, d, 1), e, d, 0, 1037, 1122, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('<div class="e_sep"><a href="');
      f.b(f.v(f.f("fixedurl", h, g, 0)));
      f.b('" target="_blank">');
      f.b(f.v(f.f("fixedname", h, g, 0)));
      f.b("</a></div>\r");
      f.b("\n");
    });
    e.pop();
  }
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.HotTuan = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="e_hot_tit">\r');
  a.b("\n" + b);
  a.b('    <div class="rt_lnk">\r');
  a.b("\n" + b);
  a.b('        <div class="cs">\r');
  a.b("\n" + b);
  a.b('            <input type="hidden" value="机票产品" name="categories" id="adviceCategories" />\r');
  a.b("\n" + b);
  a.b("            \r");
  a.b("\n" + b);
  a.b("            <select id='tuanCitySelector' style=\"display: none;\">\r");
  a.b("\n" + b);
  if (a.s(a.f("cities", e, d, 1), e, d, 0, 275, 365, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('                <option data-city="');
      f.b(f.v(f.f("cityname", h, g, 0)));
      f.b('">');
      f.b(f.v(f.f("cityname", h, g, 0)));
      f.b("</option>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("            </select>\r");
  a.b("\n" + b);
  a.b("            \r");
  a.b("\n" + b);
  a.b("        </div>\r");
  a.b("\n" + b);
  a.b('        <div class="m_tab_sel">\r');
  a.b("\n" + b);
  a.b("            <ul>\r");
  a.b("\n" + b);
  if (a.s(a.d("initcity.tuanproducts", e, d, 1), e, d, 0, 524, 728, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b('                <li class="" data-moreurl="');
      f.b(f.v(f.f("moreurl", h, g, 0)));
      f.b('" data-tab="city" data-tab-id="city-');
      f.b(f.v(f.f("categoryname", h, g, 0)));
      f.b('" data-tab-active="cur"><a href="javascript:void 0;">');
      f.b(f.v(f.f("categoryname", h, g, 0)));
      f.b("</a></li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("            </ul>\r");
  a.b("\n" + b);
  a.b("        </div>\r");
  a.b("\n" + b);
  a.b('        <a href="');
  a.b(a.v(a.f("moreurl0", e, d, 0)));
  a.b('" class="lnk_more" target="_blank">更多</a></div>\r');
  a.b("\n" + b);
  a.b("    <h3>热门团购排行</h3>\r");
  a.b("\n" + b);
  a.b("</div>\r");
  a.b("\n" + b);
  a.b("\r");
  a.b("\n" + b);
  a.b('<div class="e_hot_cont" data-city="');
  a.b(a.v(a.d("initcity.cityname", e, d, 0)));
  a.b('">\r');
  a.b("\n" + b);
  a.b('    <ul class="ul_hot_tuan clrfix" data-panel="city" data-panel-id="city-');
  a.b(a.v(a.d("initcity.currentPoduct.categoryname", e, d, 0)));
  a.b('" data-moreurl="');
  a.b(a.v(a.d("initcity.currentPoduct.moreurl", e, d, 0)));
  a.b('">\r');
  a.b("\n" + b);
  if (a.s(a.d("initcity.currentPoduct.categoryvalue", e, d, 1), e, d, 0, 1175, 2046, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b("        <li>\r");
      f.b("\n" + b);
      f.b('            <div class="h_img"> <a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank"><img src="');
      f.b(f.v(f.f("image", h, g, 0)));
      f.b('" alt="" width="162" height="110" title="');
      f.b(f.v(f.f("tailTitleFn", h, g, 0)));
      f.b('" /></a>');
      if (!f.s(f.f("adText", h, g, 1), h, g, 1, 0, 0, "")) {
        f.b('<a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" target="_blank"><em class="m_disct" data-discount="');
        f.b(f.v(f.f("discount", h, g, 0)));
        f.b('"><b>6</b>.5折</em></a>');
      }
      f.b(" </div>\r");
      f.b("\n" + b);
      if (!f.s(f.f("adText", h, g, 1), h, g, 1, 0, 0, "")) {
        f.b('                <div class="h_inf"> <a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" title="');
        f.b(f.v(f.f("tailTitleFn", h, g, 0)));
        f.b('" target="_blank">');
        f.b(f.v(f.f("title_tailed", h, g, 0)));
        f.b("</a> </div>\r");
        f.b("\n" + b);
        f.b('                <div class="h_prc"> <a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" target="_blank"><span class="prc"><b>&yen;</b>');
        f.b(f.v(f.f("price_new", h, g, 0)));
        f.b('</span></a> 市场价：&yen;<em class="t_c">');
        f.b(f.v(f.f("price_old", h, g, 0)));
        f.b("</em> </div>\r");
        f.b("\n");
      }
      if (f.s(f.f("adText", h, g, 1), h, g, 0, 1883, 2010, "{{ }}")) {
        f.rs(h, g, function (k, j, i) {
          i.b('                <div class="h_inf"> <a href="');
          i.b(i.v(i.f("anchorTarget", k, j, 0)));
          i.b('" title="" target="_blank">');
          i.b(i.t(i.f("adText", k, j, 0)));
          i.b("</a> </div>\r");
          i.b("\n");
        });
        h.pop();
      }
      f.b("        </li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("    </ul>\r");
  a.b("\n" + b);
  a.b("</div>");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.HotTuan_Panel = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="e_hot_cont" data-city="');
  a.b(a.v(a.f("cityname", e, d, 0)));
  a.b('">\r');
  a.b("\n" + b);
  a.b('    <ul class="ul_hot_tuan clrfix" data-panel="city" data-panel-id="city-');
  a.b(a.v(a.d("currentPoduct.categoryname", e, d, 0)));
  a.b('" data-moreurl="');
  a.b(a.v(a.d("currentPoduct.moreurl", e, d, 0)));
  a.b('">\r');
  a.b("\n" + b);
  if (a.s(a.d("currentPoduct.categoryvalue", e, d, 1), e, d, 0, 239, 1110, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b("        <li>\r");
      f.b("\n" + b);
      f.b('            <div class="h_img"> <a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank"><img src="');
      f.b(f.v(f.f("image", h, g, 0)));
      f.b('" alt="" width="162" height="110" title="');
      f.b(f.v(f.f("tailTitleFn", h, g, 0)));
      f.b('" /></a>');
      if (!f.s(f.f("adText", h, g, 1), h, g, 1, 0, 0, "")) {
        f.b('<a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" target="_blank"><em class="m_disct" data-discount="');
        f.b(f.v(f.f("discount", h, g, 0)));
        f.b('"><b>6</b>.5折</em></a>');
      }
      f.b(" </div>\r");
      f.b("\n" + b);
      if (!f.s(f.f("adText", h, g, 1), h, g, 1, 0, 0, "")) {
        f.b('                <div class="h_inf"> <a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" title="');
        f.b(f.v(f.f("tailTitleFn", h, g, 0)));
        f.b('" target="_blank">');
        f.b(f.v(f.f("title_tailed", h, g, 0)));
        f.b("</a> </div>\r");
        f.b("\n" + b);
        f.b('                <div class="h_prc"> <a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" target="_blank"><span class="prc"><b>&yen;</b>');
        f.b(f.v(f.f("price_new", h, g, 0)));
        f.b('</span></a> 市场价：&yen;<em class="t_c">');
        f.b(f.v(f.f("price_old", h, g, 0)));
        f.b("</em> </div>\r");
        f.b("\n");
      }
      if (f.s(f.f("adText", h, g, 1), h, g, 0, 947, 1074, "{{ }}")) {
        f.rs(h, g, function (k, j, i) {
          i.b('                <div class="h_inf"> <a href="');
          i.b(i.v(i.f("anchorTarget", k, j, 0)));
          i.b('" title="" target="_blank">');
          i.b(i.t(i.f("adText", k, j, 0)));
          i.b("</a> </div>\r");
          i.b("\n");
        });
        h.pop();
      }
      f.b("        </li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("    </ul>\r");
  a.b("\n" + b);
  a.b("</div>");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.HotTuan_Tab = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<ul class="ul_hot_tuan clrfix" data-panel="city" data-panel-id="city-');
  a.b(a.v(a.f("categoryname", e, d, 0)));
  a.b('" data-moreurl="');
  a.b(a.v(a.f("moreurl", e, d, 0)));
  a.b('">\r');
  a.b("\n" + b);
  if (a.s(a.f("categoryvalue", e, d, 1), e, d, 0, 135, 959, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b("    <li>\r");
      f.b("\n" + b);
      f.b('        <div class="h_img"> <a href="');
      f.b(f.v(f.f("anchorTarget", h, g, 0)));
      f.b('" target="_blank"><img src="');
      f.b(f.v(f.f("image", h, g, 0)));
      f.b('" alt="" width="162" height="110" title="');
      f.b(f.v(f.f("tailTitleFn", h, g, 0)));
      f.b('" /></a>');
      if (!f.s(f.f("adText", h, g, 1), h, g, 1, 0, 0, "")) {
        f.b('<a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" target="_blank"><em class="m_disct" data-discount="');
        f.b(f.v(f.f("discount", h, g, 0)));
        f.b('"><b>6</b>.5折</em></a>');
      }
      f.b(" </div>\r");
      f.b("\n" + b);
      if (!f.s(f.f("adText", h, g, 1), h, g, 1, 0, 0, "")) {
        f.b('            <div class="h_inf"> <a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" title="');
        f.b(f.v(f.f("tailTitleFn", h, g, 0)));
        f.b('" target="_blank">');
        f.b(f.v(f.f("title_tailed", h, g, 0)));
        f.b("</a> </div>\r");
        f.b("\n" + b);
        f.b('            <div class="h_prc"> <a href="');
        f.b(f.v(f.f("anchorTarget", h, g, 0)));
        f.b('" target="_blank"><span class="prc"><b>&yen;</b>');
        f.b(f.v(f.f("price_new", h, g, 0)));
        f.b('</span></a> 市场价：&yen;<em class="t_c">');
        f.b(f.v(f.f("price_old", h, g, 0)));
        f.b("</em> </div>\r");
        f.b("\n");
      }
      if (f.s(f.f("adText", h, g, 1), h, g, 0, 815, 934, "{{ }}")) {
        f.rs(h, g, function (k, j, i) {
          i.b('            <div class="h_inf"> <a href="');
          i.b(i.v(i.f("anchorTarget", k, j, 0)));
          i.b('" title="" target="_blank">');
          i.b(i.t(i.f("adText", k, j, 0)));
          i.b("</a> </div>\r");
          i.b("\n");
        });
        h.pop();
      }
      f.b("    </li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("</ul>");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.PackageCross = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="b_hot_cross">\r');
  a.b("\n" + b);
  a.b('	<div class="e_hot_tit">\r');
  a.b("\n" + b);
  a.b('		<div class="rt_lnk"><a target="_blank" href="javascript:void(0)" class="lnk_change"><i class="arrow"></i>换一换</a></div>\r');
  a.b("\n" + b);
  a.b('		<h3><b class="highlight">免费领取</b>旅游度假代金券，抢到就省</h3>\r');
  a.b("\n" + b);
  a.b("	</div>\r");
  a.b("\n" + b);
  a.b('	<div class="e_hot_cont">\r');
  a.b("\n" + b);
  a.b('		<ul class="ul_cross clrfix">\r');
  a.b("\n" + b);
  if (a.s(a.f("list", e, d, 1), e, d, 0, 309, 761, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b("			<li>\r");
      f.b("\n" + b);
      f.b('				<div class="box_img">\r');
      f.b("\n" + b);
      f.b('					<a target="_blank" href="');
      f.b(f.v(f.f("url", h, g, 0)));
      f.b('">\r');
      f.b("\n" + b);
      f.b('						<img width="162" height="108" src="');
      f.b(f.v(f.f("image", h, g, 0)));
      f.b('" />\r');
      f.b("\n" + b);
      f.b("						<p>");
      f.b(f.v(f.f("name", h, g, 0)));
      f.b("</p>\r");
      f.b("\n" + b);
      f.b("					</a>\r");
      f.b("\n" + b);
      f.b("				</div>\r");
      f.b("\n" + b);
      f.b('				<div class="coupon">\r');
      f.b("\n" + b);
      f.b('					<p class="spe">\r');
      f.b("\n" + b);
      f.b('						<a target="_blank" href="');
      f.b(f.v(f.f("url", h, g, 0)));
      f.b('">立即领取</a>\r');
      f.b("\n" + b);
      f.b("						<span><b>&yen;</b>");
      f.b(f.v(f.f("price", h, g, 0)));
      f.b("</span>\r");
      f.b("\n" + b);
      f.b("					</p>\r");
      f.b("\n" + b);
      f.b('					<p class="desc">');
      f.b(f.v(f.f("name", h, g, 0)));
      f.b("专用优惠券</p>\r");
      f.b("\n" + b);
      f.b('					<p class="date">有效日期:');
      f.b(f.v(f.f("dateFrom", h, g, 0)));
      f.b("-");
      f.b(f.v(f.f("dateTo", h, g, 0)));
      f.b("</p>\r");
      f.b("\n" + b);
      f.b("				</div>\r");
      f.b("\n" + b);
      f.b("			</li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("			<li>\r");
  a.b("\n" + b);
  a.b('				<div class="box_img">\r');
  a.b("\n" + b);
  a.b('					<a target="_blank" href="');
  a.b(a.v(a.d("common.url", e, d, 0)));
  a.b('">\r');
  a.b("\n" + b);
  a.b('						<img width="162" height="108" src="');
  a.b(a.v(a.d("common.image", e, d, 0)));
  a.b('" />\r');
  a.b("\n" + b);
  a.b("						<p>通用</p>\r");
  a.b("\n" + b);
  a.b("					</a>								\r");
  a.b("\n" + b);
  a.b("				</div>\r");
  a.b("\n" + b);
  a.b('				<div class="coupon subcoupon">\r');
  a.b("\n" + b);
  a.b('					<p class="spe">\r');
  a.b("\n" + b);
  a.b('						<a target="_blank" href="');
  a.b(a.v(a.d("common.url", e, d, 0)));
  a.b('">立即领取</a>\r');
  a.b("\n" + b);
  a.b("						<span><b>&yen;</b>");
  a.b(a.v(a.d("common.price", e, d, 0)));
  a.b("</span>\r");
  a.b("\n" + b);
  a.b("					</p>\r");
  a.b("\n" + b);
  a.b('					<p class="desc">全场通用优惠券</p>\r');
  a.b("\n" + b);
  a.b('					<p class="date">有效日期:');
  a.b(a.v(a.d("common.dateFrom", e, d, 0)));
  a.b("-");
  a.b(a.v(a.d("common.dateTo", e, d, 0)));
  a.b("</p>\r");
  a.b("\n" + b);
  a.b("				</div>\r");
  a.b("\n" + b);
  a.b("			</li>\r");
  a.b("\n" + b);
  a.b("		</ul>\r");
  a.b("\n" + b);
  a.b("	</div>\r");
  a.b("\n" + b);
  a.b("</div>");
  return a.fl();
});
if (typeof QTMPL === "undefined") {
  var QTMPL = {};
}
QTMPL.PackageList = new Hogan.Template(function (e, d, b) {
  var a = this;
  a.b(b = b || "");
  a.b('<div class="b_hot_cross">\r');
  a.b("\n" + b);
  a.b('	<div class="e_hot_tit">\r');
  a.b("\n" + b);
  a.b('		<div class="rt_lnk"><a target="_blank" href="');
  a.b(a.v(a.f("moreUrl", e, d, 0)));
  a.b('" class="lnk_more">查看更多&gt;&gt;</a></div>\r');
  a.b("\n" + b);
  a.b("		<h3>猜你喜欢</h3>\r");
  a.b("\n" + b);
  a.b("	</div>\r");
  a.b("\n" + b);
  a.b('	<div class="e_hot_cont">\r');
  a.b("\n" + b);
  a.b('		<ul class="ul_cross clrfix">\r');
  a.b("\n" + b);
  if (a.s(a.f("data", e, d, 1), e, d, 0, 251, 732, "{{ }}")) {
    a.rs(e, d, function (h, g, f) {
      f.b("			<li>\r");
      f.b("\n" + b);
      f.b('				<div class="box_img">\r');
      f.b("\n" + b);
      f.b('					<a target="_blank" href="http://dujia.qunar.com');
      f.b(f.v(f.f("url", h, g, 0)));
      f.b('">\r');
      f.b("\n" + b);
      f.b('						<img width="162" height="108" src="');
      f.b(f.v(f.f("image", h, g, 0)));
      f.b('">\r');
      f.b("\n" + b);
      f.b("						<h6>");
      f.b(f.v(f.f("lineDes", h, g, 0)));
      f.b("</h6>\r");
      f.b("\n" + b);
      f.b("					</a>								\r");
      f.b("\n" + b);
      f.b("				</div>\r");
      f.b("\n" + b);
      f.b('				<div class="title"><a target="_blank" href="http://dujia.qunar.com');
      f.b(f.v(f.f("url", h, g, 0)));
      f.b('">');
      f.b(f.v(f.f("title", h, g, 0)));
      f.b("</a></div>\r");
      f.b("\n" + b);
      f.b('				<div class="price">\r');
      f.b("\n" + b);
      f.b('					<span class="raw"><b>&yen;</b>');
      f.b(f.v(f.f("price", h, g, 0)));
      f.b("</span>\r");
      f.b("\n" + b);
      f.b('					市场价：<span class="market"><b>&yen;</b>');
      f.b(f.v(f.f("origPrice", h, g, 0)));
      f.b("</span>\r");
      f.b("\n" + b);
      f.b("				</div>\r");
      f.b("\n" + b);
      f.b("			</li>\r");
      f.b("\n");
    });
    e.pop();
  }
  a.b("		</ul>\r");
  a.b("\n" + b);
  a.b("	</div>\r");
  a.b("\n" + b);
  a.b("</div>");
  return a.fl();
});
var FlightSuggest = (function (f) {
  var c = false;
  var j = null;
  var i;

  function h(p, n, k, o, m) {
    var l = [];
    if (p) {
      l = d(p, m);
      if (p.result && p.result.length > 0) {
        j = f.extend({}, p);
      }
    }
    if (l.length === 0) {
      if (j) {
        j.userInput = p.userInput;
        l = l.concat(d(j, m));
      } else {
        l = [0];
        k._trigger("q-suggest-noresult", [o]);
      }
    }
    return l;
  }

  var b = function (n, l) {
    var m = n.type, k = n.display;
    if (k.indexOf(i) != -1) {
      l = new RegExp("(" + i + ")", "i");
    }
    k = k.replace(l, '<span class="keyString">$1</span>');
    if (m === 4) {
      k = "·邻近机场：" + k;
    } else {
      if (m === 9) {
        k = "·相关城市：" + k;
      }
    }
    if (n.length) {
      k += ("-" + n.length + "公里");
    }
    if (m === 1) {
      k += "-该城市没有机场";
    } else {
      if (m === 2) {
        k += "-该地区的机场有";
      } else {
        if (m === 6) {
          k += "-该景点没有机场";
        } else {
          if (m === 7) {
            k += "-该目的地为省份";
          } else {
            if (m === 8) {
              k += "-该目的地为国家";
            }
          }
        }
      }
    }
    return k;
  };

  function d(p, m) {
    var r = p.result || [], s = [], l = p.userInput, k = new RegExp("(" + l + ")", "i"), t = m ? "167" : "1678", u = new RegExp("[" + t + "]");
    for (var o = 0, q = r.length; o < q; o += 1) {
      var n = r[o];
      s.push({txt: b(n, k), val: n.key, type: u.test(n.type) ? 1 : 0, country: n.country});
    }
    return s;
  }

  function g(m) {
    var l = m.closest("table").data("data"), k = l[m.attr("data-ind") * 1];
    return k;
  }

  function e(k, l) {
    var r = l.visible();
    var n = k.keyCode;
    if (n === 40 && !r) {
      l.show();
      return;
    }
    if (!r) {
      return;
    }
    var p = l.el.find('tr[data-sug_type="0"]');
    var q = p.filter(".active");
    switch (n) {
      case 38:
      case 40:
        l._excludeEl = l._mouseFocus;
        var m = p.index(q);
        m = k.keyCode === 38 ? m - 1 : m + 1;
        if (m >= p.length) {
          m = 0;
        }
        if (m < 0) {
          m = p.length - 1;
        }
        q.removeClass("active");
        q = p.eq(m);
        var o = "";
        if (q.length > 0) {
          o = g(q);
          l.setValue(o.val);
          q.addClass("active");
        }
        k.preventDefault();
        l._trigger("q-suggest-user-action", [k.type, o.val, n]);
        break;
      case 13:
        if (q.length > 0) {
          var o = "";
          o = g(q);
          l.setValue(o.val);
          trackAction("QH|HCT|suggest|" + o.val);
        }
      case 27:
        l.hide();
        l._trigger("q-suggest-user-action", [k.type, l.getValue(), n]);
        break;
      case 18:
      case 9:
        break;
    }
  }

  function a() {
  }

  f.extend(a.prototype, {init: function (l) {
    var k = this;
    f.RegisterPlugin("qcbox", "suggest", l.name, {initialize: function () {
      var m = this.ui.$el;
      m.qsuggest({ajax: {url: "http://www.qunar.com/suggest/livesearch2.jsp?lang=zh&q=*&sa=true&ver=1&callback=?", dataType: "jsonp", cache: false}, delay: 200, allPlace: l.allPlace, render: function (n) {
        return n.txt;
      }, reader: function (n) {
        return h(n, l.tiptext, this, m, this.args.allPlace);
      }, loader: function (n) {
        return n.replace(/\s/g, "");
      }, container: l.container, exattr: function (n) {
        return"data-sug_type=" + n.type;
      }, keyevent: function (n) {
        e(n, this);
      }, getData: function (p) {
        var o = p.closest("table").data("data"), n = o[p.attr("data-ind") * 1];
        return n.val;
      }, getExtData: function (p) {
        if (p.length < 1) {
          return{};
        }
        var o = p.closest("table").data("data"), n = o[p.attr("data-ind") * 1];
        return n;
      }, on: {"q-suggest-show": function () {
        m.bind("keydown.kd", function (n) {
          (n.keyCode == 13) && n.preventDefault();
        });
      }, "q-suggest-setextdata": function (n, p, o) {
        o.data("country", p.country);
        o.data("valided", true);
      }, "q-suggest-setvalue": function (n, p, o) {
        f(k).trigger("setvalue", [o]);
      }, "q-suggest-noresult": function (n, o) {
        o.data("country", null);
        o.data("valided", false);
        f(k).trigger("setvalue", [o]);
      }, "q-suggest-hide": function (n) {
        m.unbind("keydown.kd");
      }, "q-suggest-beforeshow": function (n, q, o) {
        if (!!o && !!o.c) {
          var p = ['<div class="qcity_guess">你要找的是不是<span class="hl">', o.userInput, "</span></div>"];
          q.append(p.join(""));
        }
        if (o && o.result.length == 0) {
          var p = ['<div class="qcity_guess">找不到<span class="hl">', i, "</span></div>"];
          q.append(p.join(""));
        }
      }, "q-suggest-user-action": function (n, p, o) {
        if (p == "mousedown") {
          trackAction("QH|HCT|suggest|" + o);
        }
      }, "q-suggest-inputChange": function (n) {
        i = m.val().replace(/\s+/g, " ");
        i = i.replace(/^\s+/, "");
        i = i.replace(/\s+$/, "");
      }}});
    }});
  }, isvalid: function () {
    return c;
  }});
  return a;
})(jQuery);
var FlightHotCity = (function (b) {
  var f = ".js_close_flight_hotcity";
  var i = QNR.FlightSearchBoxConf.hotCity;
  var h = 360;

  function g(m) {
    var l = i[m.type];
    var n = i.data;
    var j = [];
    b.each(l, function (o, q) {
      var p = {key: q.key, tab: q.title, title: n[q.key].title};
      j.push(p);
    });
    var k = QTMPL.FlightHotCity.render({sort: j, type: m.type, cityType: m.cityType, width: m.width});
    return b(k);
  }

  function e(l, j) {
    var k = l.type + "-flight-hotcity-" + l.cityType;
    b(b.tabs).bind(k + "-change", function (o, n, q, r) {
      var p = q.data("key");
      var m = r;
      d(i.data[p], m);
    });
    b(j).bind("hotcity-show", function () {
      b(l).trigger("hotcity-show");
    });
    c(l, j);
  }

  function c(k, j) {
    j.$hotcity.delegate("a.js-hotcitylist", "click", function (l) {
      l.preventDefault();
      var m = j.ui.$el.data("q-suggest");
      if (m) {
        m.setValue(b(this).text());
      } else {
        j.ui.$el.val(b(this).text());
      }
      j.ui.$el.data("country", b(this).data("country"));
      j.ui.$el.data("valided", true);
      b(k).trigger("setvalue", [j.ui.$el]);
      b(k).trigger("hotcity-select", [b(this).text()]);
      j.hideHotcity();
    });
  }

  function d(l, j) {
    if (j.html()) {
      return;
    }
    var k = QTMPL.FlightHotCityList.render(l);
    j.html(k);
  }

  function a() {
    this.cityType = null;
    this.$dom = null;
    this.data = {};
  }

  b.extend(a.prototype, {init: function (j) {
    var k = this;
    b.RegisterPlugin("qcbox", "hotcity", "flight", {initialize: function () {
      k.cityType = j.cityType;
      k.data = j.data;
      k.type = j.type;
      k.defaultTab = j.defaultTab;
      k.width = j.width || h;
    }, initializeStruct: function () {
      var m = this.ui.$el, n = this.ui, l = this;
      k.$dom = g(k);
      this.$hotcity.append(k.$dom);
      k.$dom.find(f).click(function () {
        l.hideHotcity();
      });
      e(k, l);
      b.tabs.init(k.$dom);
    }});
  }, switchCity: function (j) {
    this.type = j.type;
    this.width = j.width || h;
  }});
  return a;
})(jQuery);
AlsoSearch = (function () {
  function b(i) {
    return document.getElementById(i);
  }

  function h(i) {
    return["http://clk.qunar.com/q?k=", i.s || "", "&e=", i.e].join("");
  }

  function e(j) {
    var k = document.createElement("script"), i = document.getElementsByTagName("head")[0];
    k.charset = "utf-8";
    k.async = true;
    k.src = j;
    i.insertBefore(k, i.lastChild);
  }

  function a() {
    if (!a._singleton) {
      a._singleton = this;
      this.init();
    }
    return a._singleton;
  }

  a.prototype = {init: function () {
    this._status = 0;
    this._calls = [];
    this._url = "http://a.qunar.com/vataplan?f=s&cur_page_num=0&rep=1&tag=99&vataposition=QNR_OTU%3D_CN&vatacon=&rows=10&callback=";
  }, getData: function (i) {
    if (this._status === 2) {
      i(this.$data);
    } else {
      this._calls.push(i);
      if (this._status === 0) {
        this._loadData();
      }
    }
  }, _dataReady: function () {
    this._status = 2;
    var l = this._calls;
    for (var k = 0, j = l.length; k < j; k++) {
      l[k](this.$data);
    }
  }, _loadData: function () {
    var i = this, j = "also_search_" + (new Date()).valueOf();
    window[j] = function (m) {
      i.$data = m && m.key_data || [];
      var q = "", p, o;
      for (var l = 0, k = i.$data.length; l < k; l++) {
        q = i.$data[l].description;
        p = q.split("||");
        o = {show: p[1] || "yes", city: p[0] ? p[0].split(",") : []};
        i.$data[l].description = o;
      }
      i._dataReady();
      try {
        delete window[j];
      } catch (n) {
      }
    };
    i._status = 1;
    e(this._url + j);
  }};
  a.prototype.constructor = a;
  function f() {
    var i = window.external && window.external.max_version;
    return i || /maxthon/i.test(navigator.userAgent);
  }

  var d = f();
  var c = 0;
  var g = function (j, i) {
    this.id = j;
    this._cks_key = "check_" + (c++);
    this.opts = i || {};
    this.init();
  };
  g.prototype = {init: function () {
    this._dc = new a();
  }, _findAD: function (k, j) {
    var i = this;
    if (!k || d) {
      j([]);
      return;
    }
    if (k === i._nowKey) {
      return;
    }
    i._nowKey = k;
    this._dc.getData(function (r) {
      if (i._nowKey !== k) {
        return;
      }
      if (i._lastKey !== k) {
        i.$curAD = null;
      }
      i._lastKey = i._nowKey;
      i._nowKey = null;
      var q, p = [], n, m;
      var s = i.opts.getCountry.call(i);
      for (var o = 0, l = r.length; o < l; o++) {
        q = r[o].description.city;
        for (n = 0, m = q.length; n < m; n++) {
          if ((s == "中国" && q[n] == "国内全部") || (s !== "中国" && q[n] == "国际全部") || (q[n] === k)) {
            p.push(r[o]);
            return j(p);
          }
        }
      }
      j([]);
    });
  }, toggle: function (k) {
    var i = this;
    var j = this.opts.getKey.call(this);
    i._findAD(j, function (l) {
      i._show(l, k);
    });
  }, _show: function (l, k) {
    var j = 0;
    if (l.length > 1) {
      j = Math.floor(Math.random() * l.length);
    }
    var i = l[j];
    this.$last_AD = this.$curAD;
    this.$curAD = i;
    this._render(i);
    this._bindEvent();
    this.opts.onChange && this.opts.onChange.call(this, !!i);
    k && k.call(this, !!i);
  }, _render: function (i) {
    var m = this.opts, p = this.id;
    var k = b(m.container);
    var j = this._cks_key;
    if (!k) {
      return;
    }
    if (i) {
      if (this.$last_AD === i) {
        i[j] = this.$last_AD[j];
      } else {
        i[j] = i.description.show === "yes" ? true : false;
      }
      var o = i[j] ? 'checked="checked"' : "";
      var n = i.title.split("||");
      var l = ['<label class="chk_lab" for="alsosearchchk_', p, '">', '<input name="" autocomplete="off" id="alsosearchchk_', p, '" type="checkbox" ', o, ' class="inp_chk" />', n[1], n[0], "</label>"].join("");
      if (k) {
        k.innerHTML = l;
        k.style.display = "inline";
      }
    } else {
      k.style.display = "none";
      k.innerHTML = "";
    }
  }, _bindEvent: function () {
    var i = b(this.opts.container), k, j = this;
    if (i) {
      k = i.getElementsByTagName("input")[0];
      k && (k.onclick = function () {
        j.$curAD[j._cks_key] = this.checked;
      });
    }
    i = k = null;
  }, getAdUrl: function () {
    if (!this.$curAD || !this.$curAD[this._cks_key]) {
      return"";
    }
    return h(this.$curAD);
  }, action: function () {
    if (!this.$curAD || !this.$curAD[this._cks_key]) {
      return false;
    }
    try {
      var m = window.screen.availHeight * 1;
      var l = window.screen.availWidth * 1;
      var k = window.open("about:blank", "qunar", "scrollbars=yes,location=yes,menubar=yes,resizable=yes,status=yes,titlebar=yes,toolbar=yes,width=" + Math.round(l) + ",height=" + Math.round(m));
      k.blur();
      k.opener.focus();
      k.location = h(this.$curAD);
    } catch (j) {
    }
  }, isActive: function () {
    return !!this.$curAD;
  }};
  g.prototype.constructor = g;
  return g;
})();
var BaseFlightSearchBox = (function (g) {
  var t = "input[name=fromCity]";
  var x = "input[name=toCity]";
  var w = "input[name=fromDate]";
  var e = "input[name=toDate]";
  var r = ".js-exchagne-city";
  var p = "input[name=from]";
  var u = "#js_searchtype_domestic";
  var y = "#js_searchtype_international";
  var f = "input[name=search]";
  var j = "input[name=drange]";
  var c = ".js-searchtype-oneway";
  var k = ".js-searchtype-roundtrip";
  var m = ".js-searchtype-multitrip";
  var q = ".js-suggestcontainer";
  var h = ".js-backdate";
  var a = 3630;

  function b(A) {
    return A.prevAll(".dp-prefix");
  }

  function d(A) {
    A.fdatepicker("setting", "linkTo", null);
  }

  function i(A, C) {
    A.fdatepicker("setting", "linkTo", C);
    C.data("q-datepicker").ui.setFuzzyDate(A.val());
    var B = A.data("q-datepicker").ui;
    B.checkLinked({pos: B.picker.args.pos, restPos: 0});
  }

  function s(A) {
    return A !== "";
  }

  function o(C) {
    var C = new Date(C);
    var B = window.SERVER_TIME || new Date();
    if (C.getTime() < B.getTime()) {
      C = new Date(B.getTime() + 2 * 24 * 60 * 60 * 1000);
    }
    var E = C.getFullYear();
    var A = C.getMonth() + 1;
    var D = C.getDate();
    A = A < 10 ? ("0" + A) : A;
    D = D < 10 ? ("0" + D) : D;
    return[E, A, D].join("-");
  }

  function z(B) {
    var A = B.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return A ? new Date(A[1], A[2] * 1 - 1, A[3]) : null;
  }

  function n(A, B) {
    g.each(B, function (D, C) {
      if (D === "value") {
        var E = A.data("q-suggest");
        if (E) {
          E.setValue(C);
        }
        A.val(C);
      } else {
        switch (D) {
          case"country":
            A.data("country", C);
            break;
          case"valided":
            A.data("valided", C);
            break;
        }
      }
    });
  }

  function v(A) {
    return g.extend({}, A.data(), {value: g.trim(A.val())});
  }

  function l() {
  }

  g.extend(l.prototype, {init: function (D) {
    var B = this;
    if (B._inited) {
      return;
    }
    var A = g(D.form);
    var E = D.hotcity;
    var C = D.delay || null;
    B.isFuzzy = D.isFuzzy;
    B.placeHolder = D.placeHolder;
    B.form = D.form;
    B.$form = A;
    B.$toDate = A.find(e);
    B.$fromDate = A.find(w);
    B.$fromCity = A.find(t);
    B.$toCity = A.find(x);
    B.$backdate = A.find(h);
    B.$onewayRadio = g(c, A);
    B.$roundtripRadio = g(k, A);
    B.$multitripRadio = g(m, A);
    B.$tjDomesticRadio = g(u, A);
    B.$tjInternationalRadio = g(y, A);
    B.$tjSearchRadio = g(f, A);
    B.$tjDateRange = g(j, A);
    B.$exchange = g(r, A);
    B.$from = g(p, A);
    B.alsosearch = D.alsosearch;
    B._initCityInput(E);
    B._initDatePicker(C);
    B._bindEvents();
    B.$toDatePrefix = b(B.$toDate);
    B.$fromDatePrefix = b(B.$fromDate);
    B._inited = true;
    g(B).trigger("initialized");
    B.$onewayRadio.trigger("click");
    B.imfs = D.imfs;
    return B;
  }, _searchType: function () {
    var A = this.$onewayRadio[0];
    if (A) {
      return this.$onewayRadio[0].checked ? "oneway" : "roundtrip";
    }
  }, _tjSearchType: function () {
    var A = this.$tjDomesticRadio[0];
    if (A) {
      return this.$tjDomesticRadio[0].checked ? "domestic" : "international";
    }
  }, _initCityInput: function (C) {
    var I = this;
    var A = I.$fromCity.nextAll(q);
    var J = I.$toCity.nextAll(q);
    var F = I.$fromCity, D = I.$toCity;
    var E = new FlightHotCity();
    var H = new FlightHotCity();
    var B = new FlightSuggest();
    var G = new FlightSuggest();
    I.fromHotCity = E;
    I.toHotCity = H;
    F.data("qcbox-placeholder", I.placeHolder);
    D.data("qcbox-placeholder", I.placeHolder);
    g.each([E, H, B, G], function (K, L) {
      g(L).bind("setvalue", function (M, N) {
        I._clearError(N);
        g(I).trigger("boxchange");
        g(I).trigger("citychange");
      });
    });
    g(E).bind("hotcity-show", function () {
      try {
        I.$fromCity.data("q-suggest").hide();
      } catch (K) {
      }
      trackAction("QH|HCT|open");
    });
    g(H).bind("hotcity-show", function () {
      try {
        I.$toCity.data("q-suggest").hide();
      } catch (K) {
      }
      trackAction("QH|HCT|open");
    });
    g.each([E, H], function (K, L) {
      g(L).bind("hotcity-select", function (M, N) {
        trackAction("QH|HCT|select|" + encodeURIComponent(N));
      });
    });
    E.init({type: C.fromtype, cityType: "from", defaultTab: C.fromDefaultTab, width: C.hotcityWidth});
    B.init({name: "flight-fromcity", container: A, tiptext: F.data("qcbox-placeholder"), allPlace: this.isFuzzy});
    F.qcbox();
    H.init({type: C.totype, cityType: "to", defaultTab: C.toDefaultTab, width: C.hotcityWidth});
    G.init({name: "flight-tocity", container: J, tiptext: D.data("qcbox-placeholder"), allPlace: this.isFuzzy});
    D.qcbox();
  }, _initDatePicker: function (H) {
    var L = this;
    var C = typeof SERVER_TIME !== "undefined" ? SERVER_TIME : new Date(), G = new Date(C.getFullYear(), C.getMonth(), C.getDate()), B = new Date(C.getFullYear(), C.getMonth(), C.getDate() + a);
    var K = H ? H.fromDateDelay : 2;
    toDateDelay = H ? H.toDateDelay : 5;
    var D = new Date(C.getFullYear(), C.getMonth(), C.getDate() + K), J = new Date(C.getFullYear(), C.getMonth(), C.getDate() + toDateDelay);
    var F = L.$fromDate, A = L.$toDate;
    var E = A.fdatepicker({ui: "qunar", refObj: F, defaultDay: J.valueOf(), maxDate: B, on: {"q-datepicker-select": function () {
      g(L).trigger("boxchange");
    }, "q-datepicker-show": function () {
      trackAction("QH|DP|open");
    }}});
    var I = F.fdatepicker({ui: "qunar", linkRules: "+3D,+0D", minDate: G, maxDate: B, linkTo: E, defaultDay: D.valueOf(), on: {"q-datepicker-select": function () {
      g(L).trigger("boxchange");
    }, "q-datepicker-show": function () {
      trackAction("QH|DP|open");
    }}});
    if (this.isFuzzy) {
      F.data("q-datepicker").setFuzzy(true);
      A.data("q-datepicker").setFuzzy(true);
    }
  }, parseDate: function (A) {
    return z(A);
  }, _bindEvents: function () {
    var A = this;
    A._submitCheck();
    A._bindExChangeCityEvent();
    A._bindSearchTypeChangeEvent();
    A._bindAlsoSearch();
  }, _checkAlsoSearch: function (C, D) {
    clearTimeout(this._also_timer);
    var A = this;

    function B() {
      var G = A.alsosearch || [];
      if (G.length == 0) {
        C && C(null);
        return;
      }
      var F = 0, E = G.length, H = function (J) {
        if (J) {
          C && C(G[F - 1]);
        } else {
          var I = G[F++];
          if (I) {
            I.toggle(H);
          } else {
            C && C(null);
          }
        }
      };
      H(false);
    }

    if (D) {
      B();
    } else {
      this._also_timer = setTimeout(B, 10);
    }
  }, _bindAlsoSearch: function () {
    var A = this;
    var B = A.alsosearch;
    if (!B) {
      return;
    }
    g(A).bind("boxchange", function () {
      A._checkAlsoSearch();
    });
  }, _bindExChangeCityEvent: function () {
    var A = this;
    A.$exchange.click(function (B) {
      var C = A.getToCity();
      A.setToCity(A.getFromCity());
      A.setFromCity(C);
      trackAction("QH|FC|change");
      B.preventDefault();
    });
  }, _bindSearchTypeChangeEvent: function () {
    var C = this;
    var B = C.$form, A = C.$fromDate, D = C.$toDate;
    C.$onewayRadio.click(function () {
      d(A);
      A.attr("data-type", "oneWay");
      C.$backdate.hide();
    });
    C.$roundtripRadio.click(function () {
      i(A, D);
      A.attr("data-type", "");
      C.$backdate.show();
    });
    g(C).trigger("searchtypechagne");
  }, _showError: function (C, D) {
    var B = this;
    var A;
    switch (C) {
      case"from":
        A = B.$fromCity;
        break;
      case"to":
        A = B.$toCity;
        break;
    }
    if (!A.data("org-placeholder")) {
      A.data("org-placeholder", A.data("qcbox-placeholder"));
    }
    A.data("qcbox-placeholder", D);
    A.val("");
    A.parent().parent().addClass("qcbox_err");
  }, _clearError: function (A) {
    A.data("qcbox-placeholder", A.data("org-placeholder"));
    A.parent().parent().removeClass("qcbox_err");
  }, _checkCity: function (B, C) {
    var A = this;
    var D = C.value;
    if (s(D) && !C.valided) {
      return false;
    }
    return true;
  }, _submitCheck: function () {
    var A = this;
    A.$form.submit(function (J) {
      var I = A.getFromCity(), F = A.getToCity();
      var C = true;
      var G = I.value;
      var D = F.value;
      var B = A.$tjDateRange.val();
      if (A.$multitripRadio.length && A.$multitripRadio[0].checked) {
        C = A.imfs.submitCheck();
        if (C) {
          var E = A.imfs.getMultiValue();
          A.$toCity.val(E.toCity);
          A.$fromDate.val(E.fromDate);
          A.$fromCity.val(E.fromCity);
        }
        return C;
      }
      if (!A._checkCity("from", I)) {
        I.qcbox.$el.trigger("mouseup");
        C = false;
      } else {
        if (!A._checkCity("to", F)) {
          F.qcbox.$el.trigger("mouseup");
          C = false;
        }
      }
      if ((G === D) && s(G) && g.inArray(G, QNR.FlightSearchBoxConf.specPlace) == -1) {
        A._showError("to", "不能和出发地相同");
        C = false;
      }
      if (encodeURIComponent(G) === "%E6%9E%97%E6%B5%A9" && encodeURIComponent(D) === "%E6%B0%B8%E8%83%9C") {
        A._showError("from", decodeURIComponent("%E5%AF%B9%E4%B8%8D%E8%B5%B7"));
        A._showError("to", decodeURIComponent("%E4%BB%96%E4%BB%AC%E6%98%AF%E5%86%A4%E5%AE%B6"));
        C = false;
      }
      if (!C) {
        return false;
      }
      var H = {fd: A.fromDate(), td: A.toDate(), fromCity: G, toCity: D, search: A._tjSearchType(), drange: B, type: A._type, searchType: A._searchType()};
      var K = window.searchCaution;
      if (K.check(H)) {
        K.show();
        return false;
      }
      A._checkAlsoSearch(function (L) {
        if (L) {
          var P = L.getAdUrl();
          if (P) {
            var Q = window.screen.availHeight * 1;
            var O = window.screen.availWidth * 1;
            var N = "qunar_" + (new Date()).valueOf();
            var M = window.open("about:blank", N, "scrollbars=yes,location=yes,menubar=yes,resizable=yes,status=yes,titlebar=yes,toolbar=yes,width=" + Math.round(O) + ",height=" + Math.round(Q));
            if (g.browser.msie && g.browser.version == "6.0" && !g.support.style) {
              M.blur();
              M.opener.focus();
              M.location = P;
            } else {
              J.preventDefault();
              A.$form.attr("target", N);
              setTimeout(function () {
                A.$form[0].submit();
                setTimeout(function () {
                  location.href = P;
                }, 10);
              }, 10);
            }
          }
        }
      }, true);
    });
  }, getId: function () {
    return this.form;
  }, setFromCity: function (A) {
    n(this.$fromCity, A);
    this._clearError(this.$fromCity);
    g(this).trigger("boxchange");
    return this;
  }, getFromCity: function () {
    return v(this.$fromCity);
  }, setToCity: function (A) {
    n(this.$toCity, A);
    this._clearError(this.$toCity);
    g(this).trigger("boxchange");
    return this;
  }, getToCity: function () {
    return v(this.$toCity);
  }, fromDate: function (A) {
    if (A == null) {
      return this.$fromDate.val();
    } else {
      this.$fromDate.data("q-datepicker").select(z(A));
      g(this).trigger("boxchange");
    }
    return this;
  }, toDate: function (A) {
    if (A == null) {
      return this.$toDate.val();
    } else {
      this.$toDate.data("q-datepicker").select(z(A));
      g(this).trigger("boxchange");
    }
    return this;
  }, fromParam: function (A) {
    if (A == null) {
      return this.$from.val();
    } else {
      this.$from.val(A);
    }
    return this;
  }, getDom: function () {
    return this.$form;
  }, fill: function (B) {
    if (!B) {
      return;
    }
    var A = this;
    A.setFromCity({value: B.fromCity, country: B.fromCountry, valided: true});
    A.setToCity({value: B.toCity, country: B.toCountry, valided: true});
    trackAction("QH|HCT|history|" + encodeURIComponent(B.fromCity));
    trackAction("QH|HCT|history|" + encodeURIComponent(B.toCity));
    A.fromDate(o(B.fromDate));
    if (B.roundtrip) {
      A.toDate(o(B.toDate));
      A.$roundtripRadio.attr("checked", "checked");
      A.$roundtripRadio.trigger("click");
    } else {
      A.$onewayRadio.attr("checked", "checked");
      A.$onewayRadio.trigger("click");
    }
  }});
  return l;
})(jQuery);
var BaseMultiFlightSearchBox = (function (h) {
  var u = "input[name=fromCityMulti]";
  var z = "input[name=toCityMulti]";
  var y = "input[name=fromDateMulti]";
  var f = "input[name=toDateMulti]";
  var b = "input[name=fromCity]";
  var v = "input[name=toCity]";
  var g = "input[name=fromDate]";
  var s = ".js-exchagne-city";
  var q = "input[name=from]";
  var m = ".js-searchtype-deals";
  var d = ".js-searchtype-oneway";
  var k = ".js-searchtype-roundtrip";
  var n = ".js-searchtype-multitrip";
  var r = ".js-suggestcontainer";
  var i = ".js-backdate";
  var a = 363;
  var x = h("#js_searchbox_flight");

  function c(B) {
    return B.prevAll(".dp-prefix");
  }

  function e(B) {
    B.qdatepicker("setting", "linkTo", null);
    B.data("q-datepicker").select(A(B.val()));
  }

  function j(B, C) {
    B.qdatepicker("setting", "linkTo", C);
    B.data("q-datepicker").select(A(B.val()));
  }

  function t(B) {
    return B !== "";
  }

  function p(D) {
    var D = new Date(D.replace(/-/g, "/"));
    var C = window.SERVER_TIME || new Date();
    if (D.getTime() < C.getTime()) {
      D = new Date(C.getTime() + 2 * 24 * 60 * 60 * 1000);
    }
    var F = D.getFullYear();
    var B = D.getMonth() + 1;
    var E = D.getDate();
    B = B < 10 ? ("0" + B) : B;
    E = E < 10 ? ("0" + E) : E;
    return[F, B, E].join("-");
  }

  function A(C) {
    var B = C.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return B ? new Date(B[1], B[2] * 1 - 1, B[3]) : null;
  }

  function o(B, C) {
    h.each(C, function (E, D) {
      if (E === "value") {
        var F = B.data("q-suggest");
        if (F) {
          F.setValue(D);
        }
        B.val(D);
      } else {
        switch (E) {
          case"country":
            B.data("country", D);
            break;
          case"valided":
            B.data("valided", D);
            break;
        }
      }
    });
  }

  function w(B) {
    return h.extend({}, B.data(), {value: h.trim(B.val())});
  }

  function l() {
  }

  h.extend(l.prototype, {init: function (D) {
    var C = this;
    if (C._inited) {
      return;
    }
    this.tripCount = 2;
    this.trip_zh = ["一", "二", "三", "四", "五", "六"];
    var B = h(D.form);
    this.hotCityConfig = D.hotcity;
    this.delay = D.delay || null;
    C.moreSearboxArr = [];
    C.form = D.form;
    C.$form = B;
    C.$toDate = B.find(f);
    C.$fromDate = B.find(y);
    C.$fromCity = B.find(u);
    C.$toCity = B.find(z);
    C.$backdate = B.find(i);
    C.$onewayRadio = h(d, B);
    C.$roundtripRadio = h(k, B);
    C.$multitripRadio = h(n, B);
    C.$dealsRadio = h(m, B);
    C.$exchange = h(s, B);
    C.$from = h(q, B);
    C.alsosearch = D.alsosearch;
    C.placeHolder = {};
    for (var E = 0; E < C.$fromCity.length; E++) {
      C._initCityInput(this.hotCityConfig, C.$fromCity.eq(E), C.$toCity.eq(E));
      C._initDatePicker(this.delay, C.$fromDate.eq(E));
      E == 1 && j(C.$fromDate.eq(0), C.$fromDate.eq(1));
    }
    C._bindEvents();
    C.$toDatePrefix = c(C.$toDate);
    C.$fromDatePrefix = c(C.$fromDate);
    C._inited = true;
    h(C).trigger("initialized");
    C.$onewayRadio.trigger("click");
    return C;
  }, _initCityInput: function (D, G, E) {
    var J = this;
    var B = G.nextAll(r);
    var K = E.nextAll(r);
    var F = new FlightHotCity();
    var I = new FlightHotCity();
    var C = new FlightSuggest();
    var H = new FlightSuggest();
    h.each([F, I, C, H], function (L, M) {
      h(M).bind("setvalue", function (N, O) {
        J._clearError(O);
        h(J).trigger("boxchange");
        h(J).trigger("citychange");
      });
    });
    h(F).bind("hotcity-show", function () {
      try {
        G.data("q-suggest").hide();
      } catch (L) {
      }
      trackAction("QH|HCT|open");
    });
    h(I).bind("hotcity-show", function () {
      try {
        E.data("q-suggest").hide();
      } catch (L) {
      }
      trackAction("QH|HCT|open");
    });
    h.each([F, I], function (L, M) {
      h(M).bind("hotcity-select", function (N, O) {
        trackAction("QH|HCT|select|" + encodeURIComponent(O));
      });
    });
    F.init({type: D.fromtype, cityType: "from", defaultTab: D.fromDefaultTab, width: D.hotcityWidth});
    C.init({name: "flight-fromcity", container: B, tiptext: G.data("qcbox-placeholder")});
    G.qcbox();
    I.init({type: D.totype, cityType: "to", defaultTab: D.toDefaultTab, width: D.hotcityWidth});
    H.init({name: "flight-tocity", container: K, tiptext: E.data("qcbox-placeholder")});
    E.qcbox();
    J.setCityData(G, {value: "", country: "", valided: true});
    J.setCityData(E, {value: "", country: "", valided: true});
  }, _initDatePicker: function (G, F) {
    var K = this;
    var C = typeof SERVER_TIME !== "undefined" ? SERVER_TIME : new Date(), E = new Date(C.getFullYear(), C.getMonth(), C.getDate()), B = new Date(C.getFullYear(), C.getMonth(), C.getDate() + a);
    var J = G ? G.fromDateDelay : 2;
    toDateDelay = G ? G.toDateDelay : 5;
    var D = new Date(C.getFullYear(), C.getMonth(), C.getDate() + J), I = new Date(C.getFullYear(), C.getMonth(), C.getDate() + toDateDelay);
    var H = F.qdatepicker({ui: "qunar", linkRules: "+3D,+0D", minDate: E, maxDate: B, linkTo: null, single: true, defaultDay: D.valueOf(), on: {"q-datepicker-select": function () {
      h(K).trigger("boxchange");
    }, "q-datepicker-show": function () {
      trackAction("QH|DP|open");
    }}});
  }, parseDate: function (B) {
    return A(B);
  }, _bindEvents: function () {
    var B = this;
    B._bindSearchTypeChangeEvent();
    B._bindHoverInfoEvent();
    B._bindAddTripEvent();
  }, _bindSearchTypeChangeEvent: function () {
    var I = this;
    var J = I.$form, E = I.$fromDate, D = I.$toDate, H = h("#js_ow_rt_triplist"), C = h("#js_multi_triplist"), G = h("#js_addtrip"), F = h("#js_realtime_info"), B = h("#js_submit_module");
    I.$onewayRadio.click(function () {
      H.show();
      F.show();
      C.hide();
      G.hide();
      B.removeClass("more-line-btn");
    });
    I.$roundtripRadio.click(function () {
      H.show();
      F.show();
      C.hide();
      G.hide();
      B.removeClass("more-line-btn");
    });
    I.$multitripRadio.click(function () {
      H.hide();
      C.show();
      G.show();
      F.hide();
      B.addClass("more-line-btn");
      x.addClass("e_csh_sch_fl_mor");
    });
    h(I).trigger("searchtypechagne");
  }, _bindHoverInfoEvent: function () {
    var C = h("#morlinePoint");
    var B = h("#hoverInfo");
    B.bind("mouseover", function () {
      C.show();
    });
    B.bind("mouseout", function () {
      C.hide();
    });
  }, _bindAddTripEvent: function () {
    var C = this, B = C.$form;
    C.zindexCount = 0;
    h("#js_addtrip").click(function () {
      C.tripCount++;
      C.zindexCount++;
      var I = h(QTMPL.MultiFlightSearchBox.render({trip: C.tripCount, zindex: 100 - C.zindexCount}));
      h("#js_trips_list").append(I);
      var F = C.tripCount - 1, G = B.find(u).eq(F), E = B.find(z).eq(F), H = B.find(y);
      $fromDate = H.eq(F);
      C._initCityInput(C.hotCityConfig, G, E);
      C._initDatePicker(C.delay, $fromDate);
      j(H.eq(F - 1), $fromDate);
      var D = h("#delete" + C.tripCount);
      C.moreSearboxArr.push({trip: C.tripCount, sbox: I, deleEle: D});
      C._bindDeleteTripEvent(D);
      C.tripCount == 6 && h("#js_addtrip").hide();
    });
  }, _bindDeleteTripEvent: function (C) {
    var B = this;
    C.click(function () {
      var D = parseInt(C[0].id.charAt(6), 10) - 3;
      B.moreSearboxArr[D].sbox.remove();
      B._updateLink(D);
      B._updateTrips(D);
      B.tripCount--;
      B.tripCount < 6 && h("#js_addtrip").show();
    });
  }, _updateTrips: function (C) {
    var B = this;
    B.moreSearboxArr.splice(C, 1);
    for (var D = C; D < B.moreSearboxArr.length; D++) {
      var F = D + 3;
      B.moreSearboxArr[D].trip = F;
      B.moreSearboxArr[D].sbox.find("span")[0].innerHTML = F;
      var E = B.moreSearboxArr[D].sbox.find(".qcbox");
      B.moreSearboxArr[D].deleEle[0].id = "delete" + F;
    }
  }, _updateLink: function (B) {
    B += 2;
    var C = this.$form.find(y);
    if (B < this.tripCount - 1) {
      j(C.eq(B - 1), C.eq(B));
    }
  }, _showError: function (E, F, D) {
    var C = this;
    var B;
    switch (E) {
      case"from":
        B = C.$form.find(u).eq(D);
        break;
      case"to":
        B = C.$form.find(z).eq(D);
        break;
    }
    if (!B.data("org-placeholder")) {
      B.data("org-placeholder", B.data("qcbox-placeholder"));
    }
    B.data("qcbox-placeholder", F);
    B.val("");
    B.parent().parent().addClass("qcbox_err");
  }, _clearError: function (B) {
    B.data("qcbox-placeholder", B.data("org-placeholder"));
    B.parent().parent().removeClass("qcbox_err");
  }, _checkCity: function (C, D) {
    var B = this;
    var E = D.value;
    if (t(E) && !D.valided) {
      return false;
    }
    return true;
  }, submitCheck: function () {
    var K = this, B = K.$form;
    var C = B.find(u), H = B.find(z);
    var J, G, I, E, D = true;
    for (var F = 0; F < C.length; F++) {
      J = K.getCityData(C.eq(F));
      G = K.getCityData(H.eq(F));
      I = J.value;
      E = G.value;
      if (!t(I) || !K._checkCity("from", J)) {
        J.qcbox.$el.trigger("mouseup");
        D = false;
        break;
      } else {
        if (!t(E) || !K._checkCity("to", G)) {
          G.qcbox.$el.trigger("mouseup");
          D = false;
          break;
        }
      }
      if ((I === E) && t(I)) {
        K._showError("to", "不能和出发地相同", F);
        D = false;
        break;
      }
    }
    return D;
  }, getId: function () {
    return this.form;
  }, setFromCity: function (B) {
    this.setCityData(this.$fromCity.eq(0), B);
  }, setCityData: function (B, C) {
    o(B, C);
    this._clearError(B);
    h(this).trigger("boxchange");
    return this;
  }, getCityData: function (B) {
    return w(B);
  }, fromDate: function (B) {
    if (B == null) {
      return this.$fromDate.val();
    } else {
      this.$fromDate.data("q-datepicker").select(A(B));
      h(this).trigger("boxchange");
    }
    return this;
  }, toDate: function (B) {
    if (B == null) {
      return this.$toDate.val();
    } else {
      this.$toDate.data("q-datepicker").select(A(B));
      h(this).trigger("boxchange");
    }
    return this;
  }, fromParam: function (B) {
    if (B == null) {
      return this.$from.val();
    } else {
      this.$from.val(B);
    }
    return this;
  }, getDom: function () {
    return this.$form;
  }, fill: function (C) {
    if (!C) {
      return;
    }
    var B = this;
    B.setCityData(B.$fromCity.eq(0), {value: C.fromCity, country: C.fromCountry, valided: true});
    B.setCityData(B.$toCity.eq(0), {value: C.toCity, country: C.toCountry, valided: true});
    trackAction("QH|HCT|history|" + encodeURIComponent(C.fromCity));
    trackAction("QH|HCT|history|" + encodeURIComponent(C.toCity));
    B.fromDate(p(C.fromDate));
  }, getMultiValue: function () {
    var H = h(u), D = h(z), F = h(y);
    var G = [], E = [], C = [];
    for (var B = 0; B < H.length; B++) {
      G.push(H[B].value);
      E.push(D[B].value);
      C.push(F[B].value);
    }
    return{fromCity: G.join(","), toCity: E.join(","), fromDate: C.join(",")};
  }});
  return l;
})(jQuery);
var DomesticFlightSearchBox = (function (b) {
  function a() {
    this._cityTempData = {from: {}, to: {}};
    this._type = "国内";
  }

  b.extend(a.prototype, BaseFlightSearchBox.prototype, {changeSerchType: function () {
    var k = this, e = k.$fromDatePrefix, d = k.$toDatePrefix, g = k.$fromDate, c = k.$toDate, i = k.$fromCity, f = k.$toCity;
    var h = {fromDate: g.val(), toDate: c.val()};
    k.$onewayRadio.click(function () {
      e.html("往");
      d.html("返");
      k._restoreCity();
    });
    k.$roundtripRadio.click(function () {
      e.html("往");
      d.html("返");
      k.$backdate.css({visibility: "visible"});
      k._restoreCity();
    });
    function j(l) {
      g.data("q-datepicker").setFuzzy(l);
      c.data("q-datepicker").setFuzzy(l);
      i.data("q-suggest").args.allPlace = l;
      f.data("q-suggest").args.allPlace = l;
    }
  }, _saveCityAndClear: function () {
    var c = this, d = c._cityTempData;
    d.from = b.extend({}, c.getFromCity());
    d.to = b.extend({}, c.getToCity());
    c._setPlaceHolder(c.$fromCity, "出发地(可不填)");
    c._setPlaceHolder(c.$toCity, "目的地(可不填)");
    c.setFromCity({value: "", country: "", valided: true}).setToCity({value: "", country: "", valided: true});
  }, _restoreCity: function () {
    var c = this;
    var d = c._cityTempData;
    c._setPlaceHolder(c.$fromCity, c.placeHolder);
    c._setPlaceHolder(c.$toCity, c.placeHolder);
    c.setFromCity(d.from);
    c.setToCity(d.to);
  }, _setPlaceHolder: function (c, d) {
    c.data("org-placeholder", d);
    c.data("qcbox-placeholder", d);
  }});
  return a;
})(jQuery);
var InterFlightSearchBox = (function (c) {
  var b = "#js_inter_backdate";

  function a() {
    this._type = "国际";
  }

  c.extend(a.prototype, BaseFlightSearchBox.prototype, {backdatepanel: function () {
    return c(b);
  }});
  return a;
})(jQuery);
var InterMultiFlightSearchBox = (function (c) {
  var b = "#js_inter_backdate";

  function a() {
  }

  c.extend(a.prototype, BaseMultiFlightSearchBox.prototype, {backdatepanel: function () {
    return c(b);
  }});
  return a;
})(jQuery);
var TJFlightSearchBox = (function (b) {
  function a() {
    this._type = "特价";
  }

  b.extend(a.prototype, BaseFlightSearchBox.prototype, {changeSerchType: function () {
    var c = this;
    c.$tjSearchRadio.bind("change", function (f) {
      var d = b(this).val();
      switch (d) {
        case"domestic":
          c.fromHotCity.switchCity({type: "domesticfrom"});
          c.toHotCity.switchCity({type: "domesticto"});
          break;
        case"international":
          c.fromHotCity.switchCity({type: "multifrom", width: 450});
          c.toHotCity.switchCity({type: "multito", width: 450});
          break;
      }
    });
  }});
  return a;
})(jQuery);
var FlightSearchBox = (function (f) {
  var x = false;
  var A = null;
  var v = "#js_inter_tab";
  var u = "#js_domestic_tab";
  var p = "#js_tj_tab";
  var j = "#js_flighttype_tab_domestic";
  var B = "#js_flighttype_tab_inter";
  var g = "#js_flighttype_tab_tj";
  var y = null;
  var m = new DomesticFlightSearchBox();
  var t = new InterFlightSearchBox();
  var n = new InterMultiFlightSearchBox();
  var q = new TJFlightSearchBox();
  var w = r().from;
  var o = null;
  var c = false;
  var b = false;
  var s = "#js_flight_domestic_searchbox";
  var l = "#js_flight_international_searchbox";
  var e = "#js_flight_tj_searchbox";

  function d(I) {
    var D = f(v), E = f(u), G = f(B), H = f(j), C = f(p), F = f(g);
    D.click(function () {
      D.addClass("cur");
      E.removeClass("cur");
      C.removeClass("cur");
      G.show();
      H.hide();
      F.hide();
      if (!c) {
        z();
        c = true;
      }
    });
    E.click(function () {
      E.addClass("cur");
      D.removeClass("cur");
      C.removeClass("cur");
      H.show();
      G.hide();
      F.hide();
    });
    C.click(function (J) {
      C.addClass("cur");
      D.removeClass("cur");
      E.removeClass("cur");
      F.show();
      G.hide();
      H.hide();
      if (!b) {
        k();
        b = true;
      }
    });
  }

  function h() {
    var C = m;
    if (IP_ADDRESS) {
      C.setFromCity({value: IP_ADDRESS, valided: true});
    }
    C.fromParam(w);
  }

  function r() {
    var E = {};
    var C = window.location.search.replace("?", "");
    var D = C.split("&");
    f.each(D, function (J, I) {
      var F = I.split("=");
      var H = F[0], G = F[1];
      E[H] = G || "";
    });
    return E;
  }

  function k() {
    var C = q;
    f(C).on("initialized", function () {
      C.changeSerchType();
    });
    C.init({form: e, hotcity: {fromtype: "domesticfrom", totype: "domesticto", fromDefaultTab: "热门", toDefaultTab: "热门"}, isFuzzy: false, placeHolder: "城市名（可不填）"});
  }

  function i() {
    var D = m;
    var C = new AlsoSearch("domestic", {container: "js_alsosearch_domestic", getKey: function () {
      return D.getToCity().value;
    }, getCountry: function () {
      return D.getToCity().country;
    }});
    f(D).bind("initialized", function () {
      D.changeSerchType();
    });
    D.init({form: s, hotcity: {fromtype: "domesticfrom", totype: "domesticto", fromDefaultTab: "热门", toDefaultTab: "热门"}, alsosearch: [C], isFuzzy: true, placeHolder: "输入国家/城市"});
  }

  function z() {
    var E = t;
    var D = n;
    var C = new AlsoSearch("domestic_inter", {container: "js_alsosearch_inter", getKey: function () {
      return E.getToCity().value;
    }, getCountry: function () {
      return E.getToCity().country;
    }});
    E.init({form: l, hotcity: {fromtype: "interfrom", totype: "interto", fromDefaultTab: "热门", toDefaultTab: "国际热门", hotcityWidth: 450}, alsosearch: [C], delay: {fromDateDelay: 15, toDateDelay: 22}, imfs: D, isFuzzy: true, placeHolder: "输入国家/城市"});
    D.init({form: l, hotcity: {fromtype: "multifrom", totype: "multito", fromDefaultTab: "热门", toDefaultTab: "国际热门", hotcityWidth: 450}, alsosearch: [C], delay: {fromDateDelay: 15, toDateDelay: 22}});
    if (IP_ADDRESS) {
      E.setFromCity({value: IP_ADDRESS, valided: true});
      D.setFromCity({value: IP_ADDRESS, valided: true});
    }
    E.fromParam(w);
    if (o && o.interFirst) {
      E.fill(o.interFirst);
      D.fill(o.interFirst);
    }
    var F = new InterAutoDateHelper("js_flight_international_searchbox");
    F.$jq(E);
    E.$fromCity.css("margin-left", "16px");
    E.$toCity.css("margin-left", "16px");
    E.$fromDate.css("margin-left", "16px");
    E.$toDate.css("margin-left", "16px");
  }

  function a() {
  }

  f.extend(a.prototype, {init: function (C) {
    if (x) {
      return;
    }
    A = f(C);
    var D = QTMPL.FlightSearchBox.render({placeholder: "城市名"});
    A.html(D);
    i(this);
    d(this);
    h();
    x = true;
    return A;
  }, parseHistory: function (E) {
    if (!E) {
      return;
    }
    o = E;
    var D = o.domesticFirst;
    var C = o.interFirst;
    D && m.fill(o.domesticFirst);
    if (!y) {
      y = f(v);
    }
    if (C && (!D || (parseInt(C.timestamp, 10) - parseInt(D.timestamp, 10) > 0))) {
      f(B).show();
      y.trigger("click");
    }
  }});
  return a;
})(jQuery);
function InterAutoDateHelper(a) {
  this.formId = a;
}
InterAutoDateHelper.prototype._init = function () {
  var a = this.formId;
  this.url = "http://rc.flight.qunar.com/rtripdate?";
  this.isAuto = false;
  this.fromCity = document.getElementById(a).fromCity;
  this.toCity = document.getElementById(a).toCity;
  if (this.toCity.value === "") {
    this.isAuto = true;
  }
  this.fromDate = document.getElementById(a).fromDate;
  this.toDate = document.getElementById(a).toDate;
};
InterAutoDateHelper.prototype.$jsex = function (b) {
  this._init();
  var a = this;
  $jex.event.bind(this.fromDate, "focus", function () {
    a.isAuto = false;
  });
  $jex.event.bind(this.toDate, "focus", function () {
    a.isAuto = false;
  });
  if (this.isAuto) {
    this._getAutoDate(b);
  }
};
InterAutoDateHelper.prototype._getAutoDate = function (b) {
  var a = this;
  $jex.event.bind(b, "citychange", function () {
    if (a.isAuto) {
      if (!!a.toCity.value) {
        var e = a.fromCity.value;
        var d = a.toCity.value;
        var c = a.url + "dpt=" + encodeURIComponent(e) + "&arr=" + encodeURIComponent(d);
        $jex.jsonp(c, function (h) {
          var g = h.go_date;
          var f = h.back_date;
          b.fromDate.setValue(g);
          b.toDate.setValue(f);
        });
        $jex.event.clear(b, "citychange");
      }
    }
  });
};
InterAutoDateHelper.prototype.$jq = function (b) {
  this._init();
  var a = this;
  jQuery(this.fromDate).bind("focus", function () {
    a.isAuto = false;
  });
  jQuery(this.toDate).bind("focus", function () {
    a.isAuto = false;
  });
  if (this.isAuto) {
    this._$getAutoDate(b);
  }
};
InterAutoDateHelper.prototype._$getAutoDate = function (b) {
  var a = this;
  jQuery(b).bind("citychange", function () {
    if (a.isAuto) {
      var e = a.fromCity.value;
      var d = a.toCity.value;
      if (d != "") {
        a.isAuto = false;
      } else {
        return;
      }
      var c = a.url + "dpt=" + encodeURIComponent(e) + "&arr=" + encodeURIComponent(d) + "&callback=?";
      jQuery.getJSON(c, function (h) {
        var g = h.go_date;
        var f = h.back_date;
        jQuery(a.fromDate).data("q-datepicker").select(new Date(g.replace(/-/g, "/")));
        jQuery(a.toDate).data("q-datepicker").select(new Date(f.replace(/-/g, "/")));
      });
    }
  });
};
(function () {
  var d = window.SERVER_TIME;
  var a = new Date(d.getTime() + 1000 * 60 * 60 * 24 * 363);
  var b;
  var c = "http://flight.qunar.com/twell/flight/Search.jsp?";
  window.searchCaution = function () {
    var k = $.ui.dialog({width: 522}), i = {};
    var n = function (t) {
      var s = t || {};
      var r = "";
      if (t.round) {
        r = "<p>" + (t.type === "特价" ? "从" : "去程") + '：&nbsp;<span class="fb">' + t.departureDate + "</span></p>";
        r = r + "<p>" + (t.type === "特价" ? "到" : "回程") + '：&nbsp;<span class="fb">' + t.arrivalDate + "</span>&nbsp;&nbsp;马上为您显示搜索结果。</p>";
      } else {
        r = "<p>" + (t.type === "特价" ? "从" : "去程") + '：&nbsp;<span class="fb">' + t.departureDate + "</span>&nbsp;&nbsp;马上为您显示搜索结果。</p>";
      }
      return r;
    };
    var f = function (s) {
      var r = '<div class="p_lyr_ct" style="width:522px;"><div class="lyr_in"> <a id="search-caution-close" class="btn_close" href="javascript:;"></a><div class="lyr_ct" style="width: 450px;"><div class="b_alt_day"><div class="p1">目前<span class="fb">' + (s.type === "特价" ? "特价" : (s.fromCity + '</span>到<span class="fb">' + s.toCity)) + '</span>机票最远支持搜索以下日期的航班：</div><div class="p2">' + n(s) + '</div><div class="p_btn"><a href="' + s.href + '" class="btn_sure_bl" id="search-caution-ok"><span>确&nbsp;定</span></a></div></div><div class="b_alt_dode clearfix"><a href="http://app.qunar.com/" target="_blank"><p class="m_code_img"><img src="http://simg4.qunarzz.com/site/images/flight/home/img_qnkhd.png"></p><p class="m_code_rt"><span class="h1">为您提供更多航班搜索，<br>我们一直在努力！</span><span class="h3">扫描或点击下载去哪儿旅行客户端</span></p></a></div></div></div></div>';
      return r;
    };
    var m = function () {
      p();
    };
    var p = function () {
      k.hide();
    };
    var j = function () {
      $("#search-caution-close").click(p);
      $("#search-caution-ok").click(m);
    };
    var e = function (s, r) {
      return Math.min(s, r);
    };

    function h(t) {
      var s = "";
      for (var r in t) {
        s += "&" + r + "=" + t[r];
      }
      return c + s;
    }

    var q = {oneway: "OnewayFlight", roundtrip: "RoundTripFlight"};

    function l(r) {
      var s = {fromCity: r.fromCity, toCity: r.toCity, fromDate: r.fd};
      if (r.td) {
        s.toDate = r.td;
      }
      s.from = "qunarindex";
      s.searchType = r.type === "特价" ? "DealsFlight" : q[r.searchType];
      return s;
    }

    function g(s) {
      try {
        new Image().src = "http://flight.qunar.com/site/track.htm?action=" + s + "&t=" + Math.random();
      } catch (r) {
      }
    }

    var o = function (t, r) {
      var v = r || "-";
      var u = t.getMonth() + 1;
      var s = t.getDate();
      u < 10 && (u = "0" + u);
      s < 10 && (s = "0" + s);
      return t.getFullYear() + v + u + v + s;
    };
    i.check = function (t) {
      b = a;
      this.data = {};
      this.data.fromCity = t.fromCity;
      this.data.toCity = t.toCity;
      var r = false;
      var s = new Date(t.fd.replace(/-/g, "/"));
      var v = new Date(t.td.replace(/-/g, "/"));
      if (t.searchType === "oneway") {
        if (s > b) {
          r = true;
          this.data.type = t.type;
          this.data.round = false;
          this.data.departureDate = o(b);
          var u = l(t);
          u.fromDate = this.data.departureDate;
          this.data.href = h(u);
        }
      } else {
        if (t.searchType === "roundtrip") {
          if (s > b || v > b) {
            r = true;
            this.data.type = t.type;
            this.data.round = true;
            this.data.departureDate = o(new Date(e(s, b)));
            this.data.arrivalDate = o(new Date(e(v, b)));
            var u = l(t);
            u.fromDate = this.data.departureDate;
            u.toDate = this.data.arrivalDate;
            this.data.href = h(u);
          }
        } else {
          if (s > b) {
            r = true;
            this.data.type = t.type;
            this.data.departureDate = o(b);
            var u = l(t);
            u.fromDate = this.data.departureDate;
            u.drange = t.drange;
            u.search = t.search;
            this.data.href = h(u);
          }
        }
      }
      return r;
    };
    i.show = function () {
      var s = f(this.data);
      k.setContent(s);
      k.show();
      k.setMiddle();
      j();
      var r = ["FL", "EQR"].join("|");
      g(r);
    };
    return i;
  }();
})();
var MainSliderShowBox = (function (e) {
  var j = document;
  var h = ".";
  var i = "http://tuan.qunar.com/api/indexdata.php?";
  var g = 4000;
  var a = "b_pic_csl", f = "js_b_mainslider", d = "e_pic_wrap", b = "e_flt_inf";

  function k(m, l) {
    e.qClass.base(this, m, l);
    this.triggerDeactivedCls = "deactive";
  }

  e.extend(e.fn.able, {MainSlideable: k});
  e.qClass.inherits(k, e.able.Switchable);
  e.extend(k.prototype, {_parseStructure: function () {
    e.qClass.base(this, "_parseStructure");
    this.$panels = this.$container.find(".e_pic_wrap li");
    this.$panel_aff = this.$container.find("." + b);
    this.$triggers = this.$container.find(".e_prevnext");
    this.$preBtn = this.$triggers.find(".btn_prev");
    this.$nextBtn = this.$triggers.find(".btn_next");
    this.viewLength = this.$panels.length / this.config.step;
  }, _init: function () {
    var l = this;
    e.qClass.base(this, "_init");
    var m;
    (m = function () {
      if (this.switchTimer) {
        clearInterval(this.switchTimer);
      }
      this.switchTimer = setInterval(function () {
        l.next();
      }, g);
    }).call(l);
    this.$container.hover(function () {
      if (l.switchTimer) {
        clearInterval(l.switchTimer);
        delete l.switchTimer;
      }
    }, function () {
      e.proxy(m, l)();
    });
  }, _switchTrigger: function () {
  }, _bindTriggers: function () {
    var l = this;
    this.$preBtn.click(function (m) {
      l.prev();
    });
    this.$nextBtn.click(function (m) {
      l.next();
    });
  }});
  e.fn.mainSlideable = function (l) {
    var n = this;
    var m = n.data("mainSlideables");
    n.data("mainSlideables", m ? m : []);
    return n.each(function () {
      n.data("mainSlideables").push(new k(e(this), l));
    });
  };
  function c() {
    this.moduleName = "MainSliderShowBox";
    this.$container = e("#js_b_mainslider");
    this.url = i;
  }

  e.qClass.inherits(c, e.qWidget);
  e.extend(c.prototype, {format: function (m) {
    function l(o, p) {
      return function () {
        return this[o].length > p ? this[o] : "";
      };
    }

    m.fixedname = m.fixed_anchor[1];
    m.fixedurl = m.fixed_anchor[0];
    e.each(m.sliders, function (n, o) {
      e.each([
        ["title", 11],
        ["subtitle", 14],
        ["desc", "45"]
      ], function (q, p) {
        o[p[0]].length > p[1] && (o[p[0] + "_tailed"] = o[p[0]].substring(0, p[1]) + "...") || (o[p[0] + "_tailed"] = o[p[0]]);
      });
    });
    m.fixed_anchor_fn = function () {
      return function (o, n) {
        return n(o);
      };
    };
    m.tailTitleFn = l("title", 11);
    m.tailSubTitleFn = l("subtitle", 14);
    m.tailDescFn = l("desc", 45);
    return m;
  }, getUrl: function () {
    return this.url + "type=ppt&callback=?";
  }, isSuccessStatus: function (l) {
    return l.ret == 1 && l.data.sliders instanceof Array && l.data.sliders.length > 0;
  }, setupBoxView: function () {
    this.$container.find(".e_pic_wrap li").each(function (l, m) {
      if (l != 0) {
        e(this).hide();
      }
    });
  }, bindEvent: function () {
    this.$mSliderBox = this.$container.mainSlideable({panelCls: d, effect: "scrollx", circle: true, viewSize: [728, 215]});
  }});
  return c;
})(jQuery);
var HotTuanBox = (function (b) {
  var f = ".", g = {tuan: "http://tuan.qunar.com/api/indextuan_v4.php?", cross: "http://tuan.qunar.com/api/indexcross.php", list: "http://dujia.qunar.com/apis/indexVoucherRoutes.jsp?des="}, e = "QN101", i = {url: "http://dujia.qunar.com/p/generalVoucher?cross="}, a = "b_hot_wrap", j = "js_b_hottuan", h = "tuanCitySelector";
  var c = {formatDate: function (l) {
    var k = new Date(l.replace(/-/g, "/"));
    return k.getMonth() + 1 + "月" + k.getDate() + "日";
  }};

  function d() {
    this.$container = b("#" + j);
    this.type = "tuan";
    if (Cookie && Cookie.values && (e in Cookie.values)) {
      this.url = g.list + encodeURIComponent(Cookie.values[e].slice(1));
      this.type = "list";
      if (Cookie.values[e]) {
        this.moreUrl = "http://dujia.qunar.com/pq/list_" + encodeURIComponent(Cookie.values[e].slice(1));
      } else {
        this.moreUrl = "http://dujia.qunar.com/p/list";
      }
    } else {
      if (/ex_track=.+/.test(window.location.href)) {
        this.url = g.cross + window.location.search;
      } else {
        this.url = g.tuan;
      }
    }
  }

  b.qClass.inherits(d, b.qWidget);
  b.extend(d.prototype, {format: function (k) {
    try {
      var m = {cities: []};
      if (!k.type) {
        if (this.type == "tuan") {
          k = {type: "tuan", data: k};
        } else {
          if (this.type == "list") {
            k = {type: "list", moreUrl: this.moreUrl, data: k};
          }
        }
      }
      this.type = k.type;
      if (this.type == "tuan") {
        this.moduleName = "HotTuan";
        this.modeldata = this.formatTuan(k.data);
      } else {
        if (this.type == "coupon") {
          this.moduleName = "PackageCross";
          this.modeldata = this.formatCoupon(k);
        } else {
          if (this.type == "list") {
            this.moduleName = "PackageList";
            this.modeldata = this.formatList(k);
          }
        }
      }
      return this.modeldata;
    } catch (l) {
      window.console && window.console.log(l);
      this.moduleName = "HotTuan";
      this.type = "tuan";
      this.modeldata = m;
    }
  }, formatTuan: function (k) {
    var l = {cities: []};
    b.each(k, function (m, o) {
      if (m == "initcity") {
        return;
      }
      b.each(o, function (p, r) {
        var q = {};
        b.each(r, function (s, t) {
          if (s == "moreurl") {
            q.moreurl = t;
            return;
          }
          q.categoryname = s;
          q.categoryvalue = t;
          b.each(t, function (u, v) {
            v.title = v.title || "";
            v.title.length > 24 && (v.title_tailed = v.title.substring(0, 23) + "...") || (v.title_tailed = v.title);
          });
          q.tailTitleFn = function () {
            return this.title.length > 24 ? this.title : "";
          };
        });
        o[p] = q;
      });
      var n = {cityname: m, tuanproducts: o};
      l.cities.push(n);
      if (k.initcity == m) {
        l.initcity = n;
        l.initcity.currentPoduct = l.initcity.tuanproducts[0];
        l.moreurl0 = l.initcity.currentPoduct.moreurl;
      }
    });
    if (!("initcity" in l)) {
      l.initcity = l.cities[0];
      if (l.initcity) {
        l.initcity.currentPoduct = l.initcity.tuanproducts[0];
        l.moreurl0 = l.initcity.currentPoduct.moreurl;
      }
    }
    return l;
  }, formatCoupon: function (k) {
    this.couponList = {current: 0, data: k.citys || []};
    b.each(this.couponList.data, function () {
      this.url = "http://dujia.qunar.com/pq/list_" + encodeURIComponent(this.name) + "?cross=" + encodeURIComponent(this.name);
    });
    i.dateTo = c.formatDate(k.dateTo);
    i.dateFrom = c.formatDate(k.dateFrom);
    i.price = k.commonPrice;
    i.image = k.commonImage;
    return this.getNextCouponData();
  }, getNextCouponData: function () {
    var o = this.couponList.current;
    var m = this.couponList.data;
    var n = m.length - (o + 1) * 3;
    n = n < 0 ? -n : 0;
    var l = m.slice(o * 3 - n, o * 3 + 3 - n);
    var k = {common: i, list: []};
    b.each(l, function () {
      k.list.push(b.extend({}, this, {dateFrom: i.dateFrom, dateTo: i.dateTo}));
    });
    if (parseInt((m.length + 2) / 3) > o + 1) {
      this.couponList.current++;
    } else {
      this.couponList.current = 0;
    }
    return k;
  }, couponList: false, formatList: function (l) {
    var m = b.extend({data: []}, l);
    if (m.data.length < 4) {
      m.data = [];
    }
    for (var k = 0; k < m.data.length; k++) {
      if (m.data[k].dep) {
        m.data[k].lineDes = m.data[k].dep + "-" + m.data[k].des;
      } else {
        m.data[k].lineDes = m.data[k].des + "当地游";
      }
    }
    return m;
  }, sliceModelData: function (n, k, m) {
    var l = null;
    b.each(n, function (o, p) {
      if (p[k] == m) {
        l = p;
        return false;
      }
    });
    return l;
  }, _setupTuanDiscount: function (k) {
    b(k).find("em.m_disct").each(function (l, q) {
      var p = b(this).data("discount") + "", o = p.split("."), n = (o[1] ? ("." + o[1]) : "") + "折", m = o[0];
      p = "<b>" + m + "</b>" + n;
      b(this).html(p);
    });
  }, setupBoxView: function () {
    if (this.type == "tuan") {
      this.setupTuanBoxView();
    } else {
      if (this.type == "coupon") {
      } else {
        if (this.type == "list") {
        }
      }
    }
  }, setupTuanBoxView: function () {
    var m = this.$container.find("div.m_tab_sel ul");
    b(m[0].firstChild).addClass("cur");
    var o = this.$container.find("div[data-city]").each(function () {
      b(this).hide();
    });
    var l = this.$container.find("div[data-city='" + this.modeldata.initcity.cityname + "']");
    var n = l[0].children[0];
    b(n.children[3]).addClass("last");
    var k = l[0].children.length;
    while (k--) {
      k == 0 && (l[0].children[k].style.display = "block") || (l[0].children[k].style.display = "none");
    }
    l.show();
    this._setupTuanDiscount(n);
  }, bindEvent: function () {
    if (this.type == "tuan") {
      this.bindTuanEvents();
    } else {
      if (this.type == "coupon") {
        this.bindCouponEvents();
      } else {
        if (this.type == "list") {
          this.bindListEvents();
        }
      }
    }
  }, bindListEvents: function () {
  }, bindCouponEvents: function () {
    var k = this.$container.find(".lnk_change");
    k.bind("click", b.proxy(function (n) {
      n.preventDefault();
      var m = this.getNextCouponData();
      var l = QTMPL[this.moduleName].render(m);
      this.render(l);
      this.setupBoxView();
      this.bindEvent();
    }, this));
  }, bindTuanEvents: function () {
    var m = this;
    var l = b("#tuanCitySelector");
    var k = 0;
    l.children("option").each(function (n, o) {
      if (b(o).text() == m.modeldata.initcity.cityname) {
        k = n;
        return false;
      }
    });
    l.yselector({index: k, onchange: function (o) {
      var u;
      var r = "";
      var n;
      var q;
      m.$container.find("div[class='e_hot_cont'][data-city]:visible").hide();
      u = m.$container.find("div[class='e_hot_cont'][data-city='" + o.value + "']");
      var s = m.currentcity = m.sliceModelData(m.modeldata.cities, "cityname", o.value);
      !("currentPoduct" in m.currentcity) && (m.currentcity.currentPoduct = m.currentcity.tuanproducts[0]);
      if (u.length == 0) {
        var p = QTMPL.HotTuan_Panel.render(s);
        u = b(p);
        m.$container.append(u);
      }
      n = s.currentPoduct.moreurl;
      b.each(s.tuanproducts, function (x, w) {
        var v = '<li class="" data-tab="city" data-tab-id="city-{{catname}}" data-tab-active="cur"	data-moreurl="{{moreurl}}"><a href="javascript:void 0;">{{catname}}</a></li>';
        r += v.replace(/({{catname}})|({{moreurl}})/g, function () {
          var y = arguments[1] == "{{catname}}" ? w.categoryname : w.moreurl;
          return y;
        });
      });
      var t;
      (t = m.$container.find(".m_tab_sel ul").html(r)).parent().next("a").attr("href", n);
      t.children("li").each(function (v, w) {
        if (v == 0) {
          b(this).addClass("cur");
          return false;
        }
      });
      q = u.children("ul");
      q.each(function (w, x) {
        var v;
        w != 0 && b(this).hide();
        w == 0 && (b(x).show(), m._setupTuanDiscount(x), v = x.children.length, b(x.children[v - 1]).addClass("last"));
      });
      u.show();
    }});
    b(b.tabs).bind("city-change", function (o, n, p, q, r) {
      m.$container.find("a.lnk_more").attr("href", p.data("moreurl"));
    });
    this.hover_timer = null;
    this.$container.delegate("li[data-tab='city']", "mouseenter", function (n) {
      var o = this;
      m.hover_timer = setTimeout(function () {
        var s = b(o), r = s.data("tab"), p = s.data("tab-id"), t = s.data("tab-active"), x = m.$container.find("[data-city=" + l.data("YSELECTOR").text() + "]"), u = x.children("ul[data-panel-id='" + p + "']");
        if (u.length != 0) {
          b.tabs.changeTab(m.$container, r, p, t);
        } else {
          var v = m.currentcity.currentPoduct = m.sliceModelData(m.currentcity.tuanproducts, "categoryname", p.split("-")[1]);
          var y = QTMPL.HotTuan_Tab.render(v);
          x.append((u = b(y)));
          b.tabs.changeTab(m.$container, r, p, t);
        }
        var q = u[0].children.length;
        b(u[0].children[q - 1]).addClass("last");
        m._setupTuanDiscount(u[0]);
        delete m.hover_timer;
      }, 250);
      n.stopPropagation();
    }).delegate("li[data-tab='city']", "mouseleave", function (n) {
      if (m.hover_timer) {
        clearTimeout(m.hover_timer);
        delete m.hover_timer;
      }
    });
  }});
  return d;
})(jQuery);
(function (X) {
  if (typeof X.QNR === "undefined") {
    X.QNR = {};
  }
  QNR._AD = {};
  var ai = "getElementsByTagName";
  var ad = X, $doc = ad.document, P = $doc.body, $head = $doc[ai]("head")[0], S = "qunar.com", D = false, ak = 0, j, O, al, q, T, o, v;
  try {
    $doc.domain = S;
  } catch (ah) {
  }
  var W = function () {
    var at = ad.navigator, ap = "application/x-shockwave-flash";
    var an = false, am, aq;
    var ao = (at.mimeTypes && at.mimeTypes[ap]) ? at.mimeTypes[ap].enabledPlugin : 0;
    if (ao) {
      aq = ao.description;
      if (parseInt(aq.substring(aq.indexOf(".") - 2), 10) >= 8) {
        an = true;
      }
    } else {
      if (ad.ActiveXObject) {
        try {
          am = new ad.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
          if (am) {
            an = true;
          }
        } catch (ar) {
        }
      }
    }
    W = function () {
      return an;
    };
    ao = am = aq = at = null;
    return an;
  };

  function u(an, av, az, aw) {
    var e, ay = av.document, ap = ay.getElementById(an);
    if (ap) {
      az.id = an;
      if (/MSIE/i.test(navigator.appVersion)) {
        var ax = [];
        ax.push('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"');
        for (var au in az) {
          if (az.hasOwnProperty(au)) {
            au = au.toLowerCase();
            if (au === "data") {
              aw.movie = az[au];
            } else {
              if (au === "styleclass") {
                ax.push(' class="', az[au], '"');
              } else {
                if (au !== "classid") {
                  ax.push(" ", au, '="', az[au], '"');
                }
              }
            }
          }
        }
        ax.push(">");
        for (var at in aw) {
          if (aw.hasOwnProperty(at)) {
            ax.push('<param name="', at, '" value="', aw[at], '" />');
          }
        }
        ax.push("</object>");
        ap.outerHTML = ax.join("");
        e = ay.getElementById(az.id);
      } else {
        var ao = ay.createElement("object");
        ao.style.outline = "none";
        ao.setAttribute("type", "application/x-shockwave-flash");
        for (var ar in az) {
          if (az.hasOwnProperty(ar)) {
            ar = ar.toLowerCase();
            if (ar === "styleclass") {
              ao.setAttribute("class", az[ar]);
            } else {
              if (ar !== "classid") {
                ao.setAttribute(ar, az[ar]);
              }
            }
          }
        }
        for (var aq in aw) {
          if (aw.hasOwnProperty(aq) && aq.toLowerCase() !== "movie") {
            var am = ay.createElement("param");
            am.setAttribute("name", aq);
            am.setAttribute("value", aw[aq]);
            ao.appendChild(am);
          }
        }
        ap.parentNode.replaceChild(ao, ap);
        e = ao;
      }
      if (an === "banner_dynamic_left" && typeof X.codeReheight === "function") {
        X.codeReheight();
      }
    }
    return e;
  }

  function H(ao, an, am, e) {
    if (!W()) {
      return null;
    }
    return u(ao, an, am, e);
  }

  function G(e) {
    return $doc.getElementById(e);
  }

  function f(am, e) {
    return am.getAttribute("data-" + e);
  }

  var w = (function () {
    var e = ["type", "style", "query", "main"], an = {};

    function am(at) {
      var ar = {}, ap;
      if (!at) {
        return{};
      }
      ar.id = at.id;
      for (var aq = 0, ao = e.length; aq < ao; aq++) {
        ap = e[aq];
        ar[ap] = f(at, ap);
      }
      if (ar.type === "qde_text") {
        ar.adurl = f(at, "adurl");
      }
      return ar;
    }

    return function (ao) {
      var aq, ap;
      if (typeof ao === "string") {
        aq = ao;
      } else {
        aq = ao.id;
        ap = ao;
      }
      if (!an[aq]) {
        an[aq] = am(ap || G(aq));
      }
      return an[aq];
    };
  })();
  var J = "qde.qunar.com", k = "a.qunar.com";
  var i = String(+new Date()) + parseInt(Math.random() * 10000000, 10);

  function B(an) {
    var am = [];
    for (var e in an) {
      am.push(e + "=" + encodeURIComponent(an[e]));
    }
    return am.join("&");
  }

  function a(ao) {
    var e = J, an = "/js.ng/";
    if (ao.type === "qde_text") {
      an = ao.adurl ? "/" + ao.adurl + "?" : "/qadjs14_css.nghtml?";
    }
    var ap = i;
    if (ao.id === QNR.AD.__cur_qde_ad) {
      i = String(+new Date()) + parseInt(Math.random() * 10000000, 10);
    }
    var am = ["http://", e, an, "framId=", ao.id, "&", ao.query, "&tile=", ap];
    if (o) {
      am.push("&city=", o);
    }
    if (D) {
      am.push("&adtest=beta");
    }
    if (q) {
      am.push(q);
    }
    return am.join("");
  }

  function E(e) {
    return ac(e.id).urlPath(e);
  }

  function g(am) {
    var e = "";
    switch (am.type) {
      case"qde":
      case"qde_text":
        e = a(am);
        break;
      case"qad":
        e = E(am);
        break;
      default:
        break;
    }
    return e;
  }

  function V() {
    return $doc.createElement("div");
  }

  function y() {
    var e = $doc.createElement("iframe");
    e.setAttribute("height", 0);
    e.setAttribute("frameBorder", 0);
    e.setAttribute("scrolling", "no");
    e.style.display = "none";
    return e;
  }

  function x(am, e) {
    if (e && e.parentNode) {
      e.parentNode.insertBefore(am, e);
    }
  }

  function I(am, e) {
    var an = am === "div" ? V() : y();
    if (e && e.style) {
      an.style.cssText = e.style;
    }
    if (am === "iframe") {
      an.style.display = "none";
    }
    return an;
  }

  function n(ao, am) {
    am = am || "div";
    var e = w(ao), an = I(am, e);
    return an;
  }

  function aj(an) {
    var am = n(an, "div"), e = G(an);
    if (e && e.parentNode) {
      e.parentNode.insertBefore(am, e);
    }
    return am;
  }

  function s(e) {
    var am = $doc.createElement("script");
    am.charset = "utf-8";
    am.async = true;
    am.src = e;
    $head.insertBefore(am, $head.lastChild);
  }

  var d;

  function K(e) {
    if (!d) {
      d = V();
      d.style.display = "none";
      document.body.appendChild(d);
    }
    d.appendChild(e);
  }

  var Z;

  function Y() {
    if (Z) {
      return Z;
    }
    var ao = $doc[ai]("abbr"), an = [];
    for (var am = 0, e = ao.length; am < e; am++) {
      if (f(ao[am], "type") && f(ao[am], "lazyAD") !== "1") {
        an.push(ao[am]);
      }
    }
    return an;
  }

  function r(ao, am) {
    ao = ao || [];
    am = am || {};
    var ar = {}, av, at, ap, e = /chan=([a-z_]+)/, au;
    for (var aq = 0, an = ao.length; aq < an; aq++) {
      av = ao[aq];
      at = w(av);
      if (at.type === "qad") {
        at.callback = QNR.AD.getCallbackName(at.id, true);
      }
      ap = g(at);
      if (!O && at.type === "qde") {
        au = e.exec(ap);
        if (au && au[1]) {
          O = au[1];
        }
      }
      if (ap) {
        ar[at.id] = ap;
      }
    }
    return{ads: ar, domain: S};
  }

  var c;

  function p() {
    if (c) {
      setTimeout(function () {
        if (c) {
          c.parentNode.removeChild(c);
          c = null;
        }
      }, 0);
    }
  }

  function z(ao) {
    var an = $doc.createElement("div");
    an.style.display = "none";
    var am = [];
    j = "http://vata.qunar.com/vata?chan=" + (O || ""), am.push('<form name="vata_main_form" target="vata_main_frame" action="' + j + '" method="POST">');
    ao.ads = ao.ads || {};
    for (var e in ao.ads) {
      if (ao.ads.hasOwnProperty(e)) {
        am.push('<input type="text" name="', e, '" value="', ao.ads[e], '" />');
      }
    }
    am.push("</form>");
    am.push("<iframe src='' name='vata_main_frame' id='vata_main_frame'></iframe>");
    an.innerHTML = am.join("");
    c = an;
    K(an);
    if (/MSIE/i.test(navigator.appVersion)) {
      G("vata_main_frame").src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"" + S + "\\\";parent.document.vata_main_form.submit();<\\\\/script>\\');document.close();};<\/script>'";
    } else {
      $doc.vata_main_form.submit();
    }
  }

  function h(an) {
    var aq = Y();
    var ar = [], ap, at = function (au) {
      ap = f(au, "type");
      if (ap === "qde_auto") {
        t(au);
      } else {
        if (ak === 1 || ap === "qde_text") {
          ae(au, an || {});
        } else {
          ar.push(au);
        }
      }
    };
    for (var ao = 0, am = aq.length; ao < am; ao++) {
      at(aq[ao]);
    }
    var e = ar.length;
    if (e == 1) {
      ae(ar[0], an || {});
    } else {
      if (e > 1) {
        Z = ar;
        z(r(ar, an));
      }
    }
  }

  function Q(am, e) {
    if (am.attachEvent) {
      am.attachEvent("onload", e);
    } else {
      am.onload = e;
    }
  }

  function U(am, ap) {
    if (am == null || am != am.window) {
      return false;
    }
    var an = am.frameElement;
    var e = am.document.body;
    var ao = function (ar) {
      an.style.display = "";
      var aq = e.offsetHeight;
      if (!ar) {
        Q(am, function () {
          ao(true);
        });
      }
      if (aq == 0) {
        an.style.display = "none";
      } else {
        an.style.height = aq + "px";
        ap && ap();
      }
    };
    ao();
  }

  var F = {};
  var ag = /MSIE 6\.0/.test(navigator.userAgent);

  function l(ao, e) {
    var an = F[e];
    var am = an && an.join("") || "";
    if (am) {
      an.length = 0;
      ao.write(am);
    } else {
      N(e, false);
    }
  }

  var A = {};

  function M(an, e) {
    var am = A[e] || 0;
    A[e] = "";
    am && an.write(am);
  }

  function L(e, am) {
    e = e || "ad_queue_all";
    if (!F[e]) {
      F[e] = [];
    }
    F[e].push(am);
  }

  function C(e) {
    return al + (ag ? ("&rnd=" + e) : "") + "#" + e;
  }

  function ab(ao, am, an, ap) {
    var e = [];
    if (ao) {
      e[e.length] = "<style>" + ao + "</style>";
    }
    if (am) {
      e[e.length] = am.replace(/(scr)_(ipt)/gi, "$1$2");
    }
    if (an) {
      e[e.length] = '<script type="text/javascript">' + an + "<\/script>";
    }
    if (ap) {
      e[e.length] = '<script type="text/javascript" src="' + ap + '"><\/script>';
    }
    return e.join("");
  }

  function af(e, ap) {
    var am = C(e), ao = n(e, "iframe");
    ao.src = am;
    if (ap == 1) {
      K(ao);
    } else {
      var an = G(e);
      x(ao, an);
    }
  }

  function aa(e, ap, an) {
    var am = G(e), ao = n(e, "iframe");
    ao.style.display = "";
    ao.src = ap;
    ao.id = an || e;
    am.parentNode.replaceChild(ao, am);
  }

  function t(am) {
    var e = am.getAttribute("data-src");
    if (e) {
      aa(am.id, e);
    }
  }

  function ae(aq) {
    var am = w(aq), ao = am.id, an, e, ap = "";
    if (!ao) {
      return;
    }
    if (am.type === "qad") {
      am.callback = QNR.AD.getCallbackName(ao);
      e = g(am);
      if (e) {
        s(e);
      }
    } else {
      e = g(am);
      if (!e) {
        return;
      }
      if (am.type === "qde_text") {
        ap = "call_show=1;";
        an = ab("", "", ap, e);
        L(ao, an);
      } else {
        an = '<script type="text/javascript" src="' + e + '"><\/script>';
        A[ao] = an;
      }
      af(ao, 0);
    }
  }

  function m(aq, at, ao, au, e, am) {
    if (ao === '<div style="display:none"></div>') {
      return;
    }
    var ar = G(aq), ap = "", an = false;
    if (!ar) {
      return;
    }
    an = ao && /top.QNR.AD.run_in_content/.test(ao);
    if (an) {
      am = 1;
    }
    if (!an) {
      N(aq, true);
    }
    if (ak === 1) {
      if (am != 1) {
        au = au || "";
        au = "call_show = 1;" + au;
      }
      ap = ab(at, ao, au, e);
      if (an) {
        ap = ap + "<script>writeContent(document,Current_ad_id);<\/script>";
      }
      L(aq, ap);
      return;
    }
    if (am == 1) {
      ap = ab(at, ao, au, e);
      if (ap) {
        ap = '<script type="text/javascript">Current_ad_id = "' + aq + '";<\/script>' + ap;
      }
    } else {
      au = "call_show=1;" + au;
      ap = ab(at, ao, au, e);
      am = 0;
    }
    L(aq, ap);
    af(aq, am);
  }

  function N(e, an) {
    var am = QNR.AD._DE;
    if (e) {
      if (am[e]) {
        am[e](an);
        delete am[e];
      }
      return;
    }
    for (var ao in am) {
      am[ao](false);
    }
    QNR.AD._DE = {};
  }

  function R(e) {
    this.$aid = e;
    this.params = {};
  }

  R.prototype = {constructor: R, createCall: function (e) {
    var am = this;
    QNR._AD[this.$aid] = function (an) {
      e(an, am);
    };
  }, createDiv: function () {
    return aj(this.$aid);
  }, set: function (e, am) {
    this.params[e] = am;
    return this;
  }, getId: function () {
    return this.$aid;
  }, run_in_iframe: function (e, am) {
    if (typeof am == "undefined") {
      am = 1;
    }
    QNR.AD.add_AD_iframe(this.$aid, e, am);
  }, urlPath: function (an) {
    var am = ["http://", k, "/vataplan?", "framId=", an.id, "&", an.query, "&callback=", an.callback, "&tile=", i];
    if (T) {
      am.push(T);
    }
    var e = B(this.params);
    e && am.push("&", e);
    if (o) {
      am.push("&city=", o);
    }
    return am.join("");
  }, load: function () {
    QNR.AD.loadOneAD(this.$aid);
  }};
  var b = {};

  function ac(am, e) {
    if (!b[am]) {
      b[am] = new R(am);
    }
    e && e(b[am]);
    return b[am];
  }

  QNR.AD = {version: "4.3", _AD: {}, _DE: {}, run_in_content: m, run_queue_list: function () {
    var e = "ad_queue_all";
    var an = F[e];
    var am = an && an.join("") || "";
    if (am) {
      an.length = 0;
      am += '<script type="text/javascript">writeContent(document,"ad_queue_all");<\/script>';
      L(e, am);
      af(e, 1);
    }
    p();
    N();
  }, writeHeadScript: M, create_div_container: aj, writeContent: l, $inject_flash: H, createAdFrame: aa, createQAd: ac, add_AD_iframe: function (e, an, am) {
    if (!an) {
      return;
    }
    if (am) {
      an = an + '<script type="text/javascript">call_show=1;<\/script>';
    }
    L(e, an);
    af(e, 0);
  }, init: function (e) {
    D = e.debug || false;
    ak = e.type || "";
    if (ag) {
      ak = 1;
    }
    o = e.ip || "";
    q = e.qde_plus || "";
    T = e.qad_plus || "";
    al = e.blank_html || "";
    v = e;
    if (D) {
      J = "qdebeta.qunar.com";
    }
    h(e);
  }, show: function (am, e) {
    U(am, function () {
      QNR.AD.callWinShowFun(e, am);
    });
  }, getCallbackName: function (e, am) {
    return(am ? "parent." : "") + "QNR._AD." + e;
  }, callWinShowFun: function (e, ao) {
    var am = e + "_win_", an = QNR._AD[am];
    if (an) {
      an(e, ao);
    }
  }, createWinShowCall: function (e, an) {
    var am = e + "_win_";
    QNR._AD[am] = an;
  }, createCallback: function (am, an) {
    var e = ac(am);
    e.createCall(function (ap) {
      var ao = e.createDiv();
      an(ao, ap);
    });
  }, createQdeCallback: function (e, am) {
    QNR.AD._DE[e] = function (an) {
      am(an, e);
    };
  }, callBackQDE: N, change_one_async: function () {
    var e = v;
    e.type = 1;
    QNR.AD.init(e);
    p();
  }, loadOneAD: function (am) {
    var e = G(am);
    if (e) {
      ae(e);
    }
  }};
})(this);
if (typeof QNR === "undefined") {
  var QNR = {};
}
QNR.ips = (function (f) {
  var h = f.document, e = location.search.match(/debug=city=([^&#]+)/), i = e ? decodeURI(e[1]) : null, g = 0, b = [];

  function a(l, m) {
    b.push(l);
    if (g) {
      return;
    }
    var j = h.createElement("script");
    d.callback = function (n) {
      if (i !== null) {
        return;
      }
      i = n.city || "";
      c();
      j.parentNode.removeChild(j);
    };
    j.type = "text/javascript";
    j.charset = "utf-8";
    j.src = "http://ws.qunar.com/ips.jcp?callback=QNR.ips.callback&_=" + (+new Date);
    j.async = true;
    var k = h.getElementsByTagName("head");
    container = k ? k[0] : document.documentElement;
    container.insertBefore(j, container.firstChild);
    g = 1;
    setTimeout(function () {
      d.callback({});
    }, m || 2000);
  }

  function c() {
    for (var k = 0, j = b.length; k < j; k++) {
      b[k].call(null, i);
    }
    b.length = 0;
  }

  function d(j, k) {
    j = j || function () {
    };
    if (i !== null) {
      j.call(null, i);
    } else {
      a(j, k);
    }
  }

  return d;
})(this);
(function () {
  function a(i) {
    return document.getElementById(i);
  }

  QNR.AD.getIpAddress = function (i) {
    QNR.ips(i);
  };
  QNR.AD.createWinShowCall("ifmRightTextlink", function (i, j) {
    h();
  });
  QNR.AD.createCallback("ifrCataAd", function (j, l) {
    j.style.display = "none";
    var i = l && l.key_data && l.key_data.length;
    if (!i) {
      return;
    }
    var k = l.key_data[0].description;
    k = k.replace(/(st)_(yle)/ig, "$1$2");
    QNR.AD.add_AD_iframe("ifrCataAd", k, 1);
  });
  function f(k, l, q) {
    var j = q && q.key_data && q.key_data.length;
    l.style.display = "none";
    if (!j) {
      return;
    }
    var o = ['<div class="topicLink">'], q = q.key_data, m, p;
    for (var n = 0; n < j; n++) {
      p = q[n];
      m = ["http://clk.qunar.com/q?k=", p.s || "", "&e=", p.e].join("");
      o.push('<p><a href="', m, '" target="_blank" title="', p.title + '">', p.description, "</a></p>");
    }
    o.push("</div>");
    o = o.join("");
    $(".js-searchbox-ad").html(o);
  }

  QNR.AD.createCallback("flightSearchBoxAd", function (i, j) {
    f("flightSearchBoxAd", i, j);
  });
  function h() {
    var i = a("ifmRightTextlink_head");
    if (i) {
      i.style.display = "block";
    }
    i = a("ifmRightTextlink_foot");
    if (i) {
      i.style.display = "block";
    }
  }

  QNR.AD.createCallback("QAD_fineBiz", function (j, l) {
    var m = $(j), i = l && l.key_data && l.key_data.length;
    if (!i) {
      return;
    }
    var k = l.key_data[0].description;
    m.html(k);
    $("#QAD_fineBiz").remove();
  });
  function c(i) {
    i("");
  }

  function e(i) {
    i("");
  }

  var b = {};

  function g(i) {
    return ~location.search.indexOf(i);
  }

  b.type = g("debug=type=open") ? 1 : 0;
  b.debug = g("adtest=beta");
  b.blank_html = "http://www.qunar.com/vataframe/b.html?_=20120830";
  b.qde_plus = "";
  var d = function () {
    QNR.AD.isInited = false;
    (QNR.AD.getIpAddress || c)(function (i) {
      b.ip = encodeURIComponent(i);
      (QNR.AD.getAdsQuery || e)(function (j) {
        b.qde_plus = j;
        if (g("debug=charge=true")) {
          b.qde_plus += "&cm=charged";
        }
        QNR.AD.init(b);
        QNR.AD.isInited = true;
        if (QNR.AD.initCallBack) {
          QNR.AD.initCallBack();
          QNR.AD.initCallBack = null;
        }
      });
    });
  };
  setTimeout(d, 150);
})();
(function (d) {
  document.domain = "qunar.com";
  function m() {
    var x = new FlightSearchBox();
    x.init("#js_searchbox_flight");
    var y = false;
    d("#js_searchbox_flight").on("mouseover", ".js_hongbao", function () {
      d(this).find(".p_tips_wrap").show();
    }).on("mouseout", ".js_hongbao", function () {
      d(this).find(".p_tips_wrap").hide();
    });
    d("#js_nva_cgy a").click(function (E) {
      E.preventDefault();
    });
    var B = d("#js_searchbox");
    var v = B.find(".js-searchnav");
    var D = B.find(".js-searchbox-panel");
    var C = j();
    var u = C.tab ? C.tab : "flight";
    var w = C.from ? C.from : null;
    var t = null;
    if (C.ex_track && C.ex_track === "auto_4efe832e") {
      u = "hotel";
      t = "f_sg";
    }
    if (w && w === "mobile") {
      Cookie.setCookie("QN163", 1, null, ".qunar.com", "/");
    } else {
      Cookie.setCookie("QN163", 0, null, ".qunar.com", "/");
    }
    function z() {
      if (!y) {
        if (!QNR.AD.isInited) {
          QNR.AD.initCallBack = function () {
            QNR.AD.loadOneAD("ifrCataAd");
            y = true;
          };
        } else {
          QNR.AD.loadOneAD("ifrCataAd");
          y = true;
        }
      }
    }

    v.click(function () {
      v.removeClass("cur");
      d(this).addClass("cur");
      var E = d(this).attr("data-for");
      D.hide();
      var F = d("#js_searchbox_" + E);
      F.show();
      switch (E) {
        case"flight":
          z();
          trackAction("QH|SB|flight");
          gaClk("tab_flight");
          break;
        case"hotel":
          d.qload("hotel", function () {
            r(F, w, t);
          });
          trackAction("QH|SB|hotel");
          gaClk("tab_hotel");
          break;
        case"tuan":
          d.qload("tuan", function () {
            f(F);
          });
          trackAction("QH|SB|tuan");
          gaClk("tab_tuan");
          break;
        case"piao":
          d.qload("piao", function () {
            g(F);
          });
          trackAction("QH|SB|piao");
          gaClk("tab_piao");
          break;
        case"package":
          d.qload("package", function () {
            l(F);
          });
          trackAction("QH|SB|package");
          gaClk("tab_package");
          break;
        case"mobile":
          d.qload("mobile", function () {
            k(F);
          });
          trackAction("QH|SB|mobile");
          gaClk("tab_mobile");
          break;
      }
    });
    o(x);
    var A = {flight: true, hotel: true, tuan: true, piao: true, "package": true, mobile: true};
    if (QNR.AD) {
      QNR.AD.initCallBack = null;
    }
    if (u && u !== "flight" && A[u]) {
      h(u, B);
    }
    if (u === "flight" || !A[u]) {
      z();
    }
  }

  function r(w, t, u) {
    var v = new HotelSearchBox();
    v.init(w);
    if (t || u) {
      v.setExtraFromParam(u);
      v.setUrlFromParam(t);
      v.initSearchBoxFromParam();
    }
  }

  function f(t) {
    TuanLoader.load(t);
  }

  function g(t) {
    PiaoLoader.load(t);
  }

  function l(t) {
    PackageLoader.load(t);
  }

  function k(t) {
    new Mobile().init(t);
  }

  function o(t) {
    d.qhistory.init({success: function (u) {
      t.parseHistory(u.flight);
    }});
  }

  function e() {
    var t = new MainSliderShowBox();
    t.init();
  }

  function c() {
    var t = new HotTuanBox();
    t.init();
  }

  function a() {
    var t = new QuarterHotBox();
    t.init();
  }

  function i() {
    var t = new StrategyBox();
    t.init();
  }

  function b() {
    var t = new HotelNewModBox();
    t.init();
    t.bindEvent();
  }

  function q() {
    var t = new HotPiaoBox();
    t.init();
  }

  function s() {
    var t = new TravellerBox();
    t.init();
  }

  function n() {
  }

  function h(v, u) {
    var t = u.find("li[data-for='" + v + "']");
    t.click();
  }

  function p(v) {
    var w = {};
    if (v) {
      var A = v.charAt(0) === "?" || v.charAt(0) === "#" ? v.substr(1) : v;
      var u = A.split("&");
      for (var x = 0, t = u.length; x < t; x++) {
        var z = u[x].indexOf("=");
        if (z > 0) {
          try {
            w[decodeURIComponent(u[x].substr(0, z))] = decodeURIComponent(u[x].substr(z + 1));
          } catch (y) {
          }
        }
      }
    }
    return w;
  }

  function j() {
    var t = p(location.search);
    var v = p(location.hash);
    var u = d.extend({}, v, t);
    return u;
  }

  d(function () {
    m();
  });
  e();
  c();
  d.qload("patch", function () {
    a();
    i();
    b();
    q();
    s();
  });
})(jQuery);
$(function () {
  if (h()) {
    return;
  }
  var f = 0, a = "banner_dynamic_left", c = 6, d;
  var k = $('<div class="q_side_code"><a class="close" href="javascript:void(0)"></a><a href="http://phone.qunar.com/?from=qunarindex" class="click-area"></a></div>');

  function g() {
    $(".q_page").append(e());
    k.find(".close").click(function () {
      k.remove();
      b();
    });
    i(k);
  }

  function e(l) {
    var m = l ? c + "px" : (j() || c) + "px";
    return k.css("top", m);
  }

  function i() {
    d = setInterval(function () {
      if (f++ > 20 || typeof closeFlash === "function" && typeof openFlash === "function") {
        clearInterval(d);
        var m = typeof closeFlash === "function" ? closeFlash : function () {
        }, l = typeof openFlash === "function" ? openFlash : function () {
        };
        closeFlash = function () {
          m();
          e(true);
        };
        openFlash = function () {
          l();
          e();
        };
      }
    }, 200);
  }

  function b() {
    if (window.sessionStorage) {
      window.sessionStorage.homeCodeClose = true;
    }
  }

  function h() {
    if (window.sessionStorage) {
      return window.sessionStorage.homeCodeClose || false;
    } else {
      return false;
    }
  }

  function j() {
    return $("#" + a).length ? $("#" + a)[0].height : 0;
  }

  g();
  window.codeReheight = e;
});