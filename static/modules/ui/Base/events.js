/**
 * 自定义时间，实现观察者模式
 * @type {Object}
 */
var events={
    on:function(type,handler){//添加自定义事件
        if(typeof type !== 'string' || typeof handler !== 'function'){
            throw new Error('参数错误！') 
        }
        if(!this.eventHandler){
            this.eventHandler={};
        }
        if(!this.eventHandler[type]){
            this.eventHandler[type]=[];
        }
        //如果hander是一个函数
        if(typeof handler=='function'){
            //不添加重复
            var isRepeat=false;
            for(var i=0;i<this.eventHandler[type].length;i++){
                (this.eventHandler[type][i]==handler)&&(isRepeat=true);
            }
            isRepeat||this.eventHandler[type].push(handler);
        }
        //连缀
        return this;
    },
    once:function(type,handler){
        var self = this;
        function onceFn(){
            self.off(type,arguments.callee);
            handler();
        }
        this.on(type,onceFn);
        //连缀
        return this;
    },
    off:function(type,handler){//解绑自定义事件
        if(!this.eventHandler) return this;
        //没有参数的话，删除当前对象的所有事件
        if(arguments.length==0){
            this.eventHandler={};
        }
        if(this.eventHandler[type] instanceof Array){
            //如果参数只有一个
            if(arguments.length==1){
                this.eventHandler[type]=[];
            }
            //如果第二各参数是函数
            if(typeof handler=='function'){
                for(var i=0;i<this.eventHandler[type].length;i++){
                    if(this.eventHandler[type][i]==handler){
                        this.eventHandler[type].splice(i,1);
                        break;
                    }
                }
            }
        }
        //连缀
        return this;
    },
    trigger:function(type){//调用自定义事件
        if(!this.eventHandler) return this;
        if(this.eventHandler[type] instanceof Array){
            for(var i=0;i<this.eventHandler[type].length;i++){
                this.eventHandler[type][i].apply(this,[].slice.call(arguments,1));
            }
        }
        //连缀
        return this;
    },
    //追踪是一个多对多的关系
    //在本对象上追踪别的对象上监听的事件，好处在于可以，一并移除本对象所关心的所有对象的所有事件
    listenTo:function(obj,type,handler){
        if(!obj||typeof obj.on !== 'function'){
            return this;
        }
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        //被追踪对象会设置一个uid，以便查找某个追踪对象
        var id = uniqueId();
        obj.on(type, handler);
        //将本次追踪放到listeningTo中去
        listeningTo[id]={
            obj:obj,
            type:type,
            handler:handler
        };
        
        return this;    
    },
    listenToOnce:function(obj,type,handler){
        var self = this;
        function onceFn(){
            self.stopListening(obj,type,arguments.callee);
            handler();
        }
        this.listenTo(obj,type,onceFn);
        //连缀
        return this;
    },
    stopListening:function(obj,type,handler){
        var listeningTo = this._listeningTo;
        var toOffArr;
        if (!listeningTo) {
            return this;
        }
        //一层一层过滤掉要解除的追踪事件
        //解除所有被追踪对象的追踪事件什么都不用做
        
        //解除特定被追踪对象的所有追踪事件
        if(typeof obj === 'object'){
            toOffArr = {};
            for(var i in listeningTo){
                if(listeningTo[i].obj===obj){
                    toOffArr[i]=listeningTo[i];
                }
            }
            listeningTo=toOffArr;
            //解除特定被追踪对象的特定类型的追踪事件
            if(typeof type ==='string'){
                toOffArr = {};
                for(var i in listeningTo){
                    if(listeningTo[i].type===type){
                        toOffArr[i]=listeningTo[i];
                    }
                }
                listeningTo=toOffArr;
                //解除特定被追踪对象的特定类型的特定追踪事件
                if(typeof handler ==='function'){
                    toOffArr = {};
                    for(var i in listeningTo){
                        if(listeningTo[i].handler===handler){
                            toOffArr[i]=listeningTo[i];
                        }
                    }
                    listeningTo=toOffArr;
                }
            }
        }

        for(var i in listeningTo){
            var listeningToObj=listeningTo[i];
            //解除事件绑定
            listeningToObj.obj.off(listeningToObj.type,listeningToObj.handler);
            //删除listeningTo对应对象
            delete this._listeningTo[i];
        }
        return this;
    }
};
module.exports=events;