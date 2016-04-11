/**
 * 等待菊花
 * @type {object}
 */
var waite={
  $waiteBox:$('<div class="g-waite-box"><div class="waite-loading"></div></div>'),
  init:function(){
      this.$waiteBox.appendTo('body');
  },
  open:function(){
    this.$waiteBox.show();
  },
  close:function(){
    this.$waiteBox.hide();
  }
}
module.exports=waite;