var URL;
if((/(192\.168\.1\.)|(localhost)/).test(window.location.href)){
    URL = 'http://192.168.1.50:9091';
}else{
    URL = 'http://webapp.xiaoshutou.com';
}

var vm = new Vue({
    el: '.wrap',
    data: {
        message: {}
    },
    computed: {
        thisTitle: function(){
            if(window.location.href.indexOf('name=') != -1){
                return decodeURIComponent(window.location.href.match(/name=[^&]+/)[0].split('=')[1]);
            }
        },
        areId: function(){
            if(window.location.href.indexOf('areId=') != -1){
                return window.location.href.match(/areId=[^&]+/)[0].split('=')[1];
            }
        }
    },
    methods: {
        toast: function (msg) {
            if (!msg)return;
            $('#toast-message').remove();
            var str = $('<div id="toast-message">' + msg + '</div>');
            str.appendTo($('body'));
            str.stop().fadeOut(3000);
        },
        requestFun: function (url,params) {
            var _this = this;
            var deferred = $.Deferred();
            $.post(URL + url,{encryptData:JSON.stringify({data:params})},function(data){
                if(data&&data.data&&data.data.resultCode != '0000'){
                    _this.toast(data.data.resultMessage);
                }else if(data.data.resultData&&data.data.resultData.brokerfeeResult){
                    deferred.resolve(data.data.resultData);
                }else{
                    _this.toast('暂无数据');
                }

            },'json');

            return deferred.promise();
        }
    },
    created: function(){
        var _this = this;
        var fpId = sessionStorage.getItem('fpId');
        if(!fpId){
            _this.toast('暂无数据');
            return
        }
        var params = {"fpId":fpId,"areId":_this.areId};

        _this.requestFun( '/business/h5/getBrokerFeeOne',params).then(function(data){
            _this.message = data.brokerfeeResult[0].productfee;
        })
    }
});