'use strict';

var _html = document.getElementsByTagName("html")[0];
_html.style.fontSize = document.documentElement.clientWidth / 750 * 100 + "px";
window.onresize = function(){
    _html.style.fontSize = document.documentElement.clientWidth / 750 * 100 + "px";
};
var newdraw;
var award = {
    '1' : '苹果笔记本一台',
    '2' : 'VIP专属门票一张',
    '6' : '精美书籍一本',
    '3' : '20元课程优惠券一张',
    '5' : '豪华学习资料包一份',
    '4' : '谢谢参与'
};
function toast(txt){
    if(!txt)return;
    $('#toast-message').remove();
    var str = $('<div id="toast-message">' + txt + '</div>');
    str.appendTo($('body'));
    str.stop().fadeOut(3000);
}

//开始抽奖
var bol = true;
function startFun(){
    if(bol)return;
    $('.round').attr('class','round');
    var n = parseInt(Math.random() * 6);
    bol = true;
    newdraw.goto(n);
}

//share份额[数字没有默认],
//speed速度[单位s,最小0.1s],
//velocityCurve速度曲线[linear匀速，ease慢快慢，ease-in慢慢开始，ease-out慢慢结束，ease-in-out慢快慢等，用的是css3的速度曲线],可以不写，ease默认值；
//callback回调函数
//weeks几周[默认2周，可以不写]
function rotateFun(obj,jsn){
    this.draw = {};
    this.draw.obj = $(obj);
    this.draw.objClass = $(obj).attr("class");
    this.draw.newClass = "rotary"+"new"+parseInt(Math.random()*1000);
    var _jiaodu = parseInt(360/jsn.share);
    var _yuan = 360*(jsn.weeks || 4);
    var _str = "";
    var _speed = jsn.speed || "2s";
    var _velocityCurve = jsn.velocityCurve || "ease";
    var _this = this;
    for(var i=1;i<=jsn.share;i++){
        _str+="."+this.draw.newClass+i+"{";
        _str+="transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-ms-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-moz-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-webkit-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-o-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="transition: transform "+_speed+" "+_velocityCurve+";";
        _str+="-moz-transition: -moz-transform "+_speed+" "+_velocityCurve+";";
        _str+="-webkit-transition: -webkit-transform "+_speed+" "+_velocityCurve+";";
        _str+="-o-transition: -o-transform "+_speed+" "+_velocityCurve+";";
        _str+="}";
        _str+="."+this.draw.newClass+i+"stop{";
        _str+="transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-ms-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-moz-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-webkit-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-o-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="}";
    };
    $(document.head).append("<style>"+_str+"</style>");
    _speed = _speed.replace(/s/,"")*1000;
    this.draw.startTurningOk = false;
    this.draw.goto=function(index){
        if(_this.draw.startTurningOk){return false};
        _this.draw.obj.attr("class",_this.draw.objClass+" "+_this.draw.newClass+index);
        _this.draw.startTurningOk = true;
        setTimeout(function(){
            _this.draw.obj.attr("class",_this.draw.objClass+" "+_this.draw.newClass+index+"stop");
            if(jsn.callback){
                _this.draw.startTurningOk = false;
                jsn.callback(index);
            };
        },_speed+10);
        return _this.draw;
    };
    return this.draw;
}

window.onload = function(){
    $('.wrap').addClass('show');
    setTimeout(function(){
        toast('可以抽奖了');
        bol = false;
        newdraw = new rotateFun('.round',{
            share:6,
            speed:"3s",
            velocityCurve:"ease",
            weeks:6,
            callback:function(i){
                toast(award[i]);
                setTimeout(function(){
                    bol = false;
                },500);
            }
        });
    },1000)
};