/**
 * 错误提示弹窗
 */
var prompt={
  $tipBox:$('<div class="prompt"></div>'),
  init:function(cont){
      var $this = this;
      $this.$tipBox.show();
      $this.$tipBox.html(cont).appendTo('body');
      setTimeout(function() {
        $this.$tipBox.hide();
      }, 2000);
  }
}
module.exports=prompt;