'use strict';

var _html = document.getElementsByTagName("html")[0];
_html.style.fontSize = document.documentElement.clientWidth / 750 * 100 + "px";
window.onresize = function(){
    _html.style.fontSize = document.documentElement.clientWidth / 750 * 100 + "px";
};

var URL;
var t = '';
var s = 1;
if((/(192\.168\.1\.)|(localhost)/).test(window.location.href)){
    URL = 'http://192.168.1.50:9091';
}else{
    URL = 'http://webapp.xiaoshutou.com';
}

if(sessionStorage.getItem('t')){
    window.location.href.indexOf('list.html') != -1 ? t = sessionStorage.getItem('t') : null;
}
if(sessionStorage.getItem('s') == 0){
    s = sessionStorage.getItem('s');
}
if(window.location.href.indexOf('status=') != -1){
    s = window.location.href.match(/status=[^&]+/)[0].split('=')[1];
}

var vm = new Vue({
    el: '.wrap',
    data: {
        message: '',
        curNo:1,
        loadingShow: true,
        loadFinished: false,
        defaultIndex:0,
        defaultType:t,
        bottomBtn: '',
        banner:[],
        status:s,
        fee:false
    },
    methods: {
        toast: function (msg) {
            if (!msg)return;
            $('#toast-message').remove();
            var str = $('<div id="toast-message">' + msg + '</div>');
            str.appendTo($('body'));
            str.stop().fadeOut(3000);
        },
        bannerFun: function () {
            $('.points div:eq(0)').addClass('active');
            var len = $('.imgs').find('img').length;
            if (len > 2) {
                var index = 0;
                setInterval(function () {
                    ++index;
                    $('.imgsBor').css({
                        'transition': 'all .3s',
                        'transform': 'translateX(-' + index + '00%)',
                        '-webkit-transform': 'translateX(-' + index + '00%)'
                    });
                    setTimeout(function () {
                        if (index > len - 2) {
                            index = 0;
                            $('.imgsBor').css({
                                'transition': 'all 0s',
                                'transform': 'translateX(0)',
                                '-webkit-transform': 'translateX(0)'
                            })
                        }
                        $('.points div').removeClass('active').eq(index).addClass('active')
                    }, 310);
                }, 3000);
            }
        },
        requestFun: function (url,params) {
            var _this = this;
            var deferred = $.Deferred();
            _this.loadingShow = true;
            $.post(URL + url,{encryptData:JSON.stringify({data:params})},function(data){
                _this.loadingShow = false;
                if(data&&data.data&&data.data.resultCode != '0000'){
                    _this.toast(data.data.resultMessage);
                    return
                }
                deferred.resolve(data.data.resultData);
            },'json');

            return deferred.promise();
        },
        href: function(link){
            link && (window.location.href = link);
        },
        changeTitle: function (title) {
            var $body = $('body');
            document.title = title;
            var $iframe = $('<iframe src="//m.baidu.com/favicon.ico"></iframe>').on('load', function () {
                setTimeout(function () {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body);
        },
        loadMore: function(fn,bol){
            $(window).bind("scroll",function(){
                var _h = document.documentElement.offsetHeight - document.documentElement.clientHeight;
                var _s = document.documentElement.scrollTop || document.body.scrollTop;
                if (_s > _h - 100 && bol) {
                    bol = false;
                    fn && typeof  fn == 'function' && fn();
                }
            });
        },
        shareFun: function(title,bol){
            if(bol){
                window.location.href = 'limitShare?title=' + title + '&content=' + title + '&link=' + window.location.href + '&isShare=1';
            }else{
                window.location.href = 'shareThis?title=' + title + '&content=' + title + '&link=' + window.location.href + '&isShare=1';
            }

        },
        linkNone: function(){
            this.toast('暂未开放,敬请期待!');
        }
    },
    computed: {
        type: function () {
            if(window.location.href.indexOf('type=') != -1){
                var type = window.location.href.match(/type=[^&]+/)[0].split('=')[1];
                if(type == 'insurance' || type == 'immigrant'){
                    var _class;
                    type == 'insurance' ? _class = $('.insuranceTop') : _class = $('.country');
                    var _width = 0;
                    $.each(_class.eq(0).find('div'),function(i,v){
                        _width += $(v).text().length + 1;
                    });
                    _class.css('width',_width + 1 + 'em');
                }
                return type;
            }
        },
        areId: function(){
            if(window.location.href.indexOf('areId=') != -1){
                return window.location.href.match(/areId=[^&]+/)[0].split('=')[1];
            }
        }
        /*status: function(){
            if(window.location.href.indexOf('status=') != -1){
                var status = window.location.href.match(/status=[^&]+/)[0].split('=')[1];
                sessionStorage.setItem('status',status);
                return status;
            }else if(sessionStorage.getItem('status')){
                return sessionStorage.getItem('status');
            }
        }*/
    },
    created: created
});