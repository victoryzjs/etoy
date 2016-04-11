/**
 * 错误提示弹窗
 */
var tip={
  $tipBox:$('<div class="tip">请求失败</div>'),
  init:function(){
      this.$tipBox.appendTo('body');
      return this;
  },
  open:function(){
    this.$tipBox.show();
  },
  close:function(){
    this.$tipBox.hide();
  }
}
module.exports=tip;