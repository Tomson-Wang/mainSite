/**
 * Created by Tomson on 14-8-27.
 */
$(function () {
  $('#apply_vip').click(function () {
    if ($('#VipApply_name').val() == '') {
      alert('申请人姓名不能为空！');
      return false;
    }
    if ($('#VipApply_phone').val() == '') {
      alert('申请人电话不能为空！');
      return false;
    }
    if ($('#VipApply_mail').val() != '') {
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($('#VipApply_mail').val())) {
        alert('邮件格式不对！');
        return false;
      }
    }
    if ($('#WeddingApply_run_time').val() == '') {
      alert('请填写举办日期！');
      return false;
    }
    if ($('#city_id').val() == '0') {
      alert('请选择办理城市！');
      return false;
    }
    if ($('#VipApply_book_money').val() != '') {
      if (!/^\d+$/.test($('#VipApply_book_money').val())) {
        alert('充值金额必须是整数！');
        return false;
      }
    }
    if ($('#VipApply_verifyCode').val() == '') {
      alert('请输入验证码！');
      return false;
    }
    $('#apply-vip-form').submit(function () {
      return false;
    });
    var $t = $("#apply-vip-form");
    var queryStr = decodeURIComponent($t.formSerialize());
    var queryObj = Common.parse(queryStr);
    var mVip = {method: "open.vip.vipapply",
      params: queryObj
    };
    $.when(Common.getRequest(mVip)).then(function (data) {
      if (CU.isSucceed(data)) {
//        alert(data.id);
//        obj.id=data.id;
//        stepHan.four()
        alert("VIP注册成功！");
        $t.resetForm();
      }
    });


    $('#apply_vip').attr('disabled', 'true');
  });
  $('#type').change(function () {
    if ($('#type').val() == '1') {
      $('.company_name_type').css('display', 'none');
    } else if ($('#type').val() == '0') {
      $('.company_name_type').css('display', 'block');
    }
  });
});
