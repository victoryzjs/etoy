/**
 * 删除对话框
 */
var deleteDialog={
  res: false,
  $waiteBox:$('<div class="mask"></div><div class="dialog"><div class="dialog-top">是否确认删除？</div><div class="dialog-btn clearfix"><span class="dialog-delete fl">取消</span><span class="dialog-confirm fl">删除</span></div>'),
  init:function(){
      this.$waiteBox.appendTo('body');
      return this.$waiteBox;
  }
}
module.exports=deleteDialog;