var created = function () {
    var _this = this;
    var pageSize = 20;
    var pageBol = false;
    var params;
    var _title = $('.listTitle');

    var init = function(){
        $(window).unbind('scroll');
        switch (_this.type) {
            case 'fixed':
                _title.html('固定收益');
                _this.requestFun('/business/getAllFixedIncomeList',{pageIndex:_this.defaultIndex}).then(function(data){
                    if(_this.message){
                        _this.message = $.merge(_this.message,data.incomeListDto.allfixedIncomeList);
                    }else{
                        _this.message = data.incomeListDto.allfixedIncomeList;
                    }
                    loadMoreFun(data.incomeListDto.allfixedIncomeList);
                });
                break;
            case 'insurance':
                _title.html('保险');
                params = {pageIndex:_this.defaultIndex};
                _this.defaultType ? params.type = _this.defaultType : null;
                _this.requestFun('/business/getAllDomesticInsuranceList',params).then(function(data){
                    if(_this.message){
                        _this.message = $.merge(_this.message,data.incomeListDto.alldomesticInsuranceList);
                    }else{
                        _this.message = data.alldomesticInsuranceList;
                    }
                    loadMoreFun(data.alldomesticInsuranceList);
                });
                break;
            case 'immigrant':
                _title.html('移民地产');
                params = {pageIndex:_this.defaultIndex};
                _this.defaultType ? params.type = _this.defaultType : null;
                _this.status == 1 ? params.status = 1 : params.status = 0;
                _this.requestFun('/business/getImmigrantPropertyList',params).then(function(data){
                    if(_this.message){
                        _this.message = $.merge(_this.message,data.incomeListDto.allsunPrivatePlacementList);
                    }else{
                        _this.message = data.incomeListDto.allsunPrivatePlacementList;
                    }
                    loadMoreFun(data.incomeListDto.allsunPrivatePlacementList);
                });
                break;
            case 'private':
                _title.html('私募股权');
                _this.requestFun('/business/getAllPrivateEquityList',{pageIndex:_this.defaultIndex}).then(function(data){
                    if(_this.message){
                        _this.message = $.merge(_this.message,data.incomeListDto.allprivateEquityList);
                    }else{
                        _this.message = data.incomeListDto.allprivateEquityList;
                    }
                    loadMoreFun(data.incomeListDto.allprivateEquityList);
                });
                break;
            case 'sunPrivate':
                _title.html('阳光私募');
                _this.requestFun('/business/getAllSunPrivatePlacementList',{pageIndex:_this.defaultIndex}).then(function(data){
                    if(_this.message){
                        _this.message = $.merge(_this.message,data.incomeListDto.allsunPrivatePlacementList);
                    }else{
                        _this.message = data.incomeListDto.allsunPrivatePlacementList;
                    }
                    loadMoreFun(data.incomeListDto.allsunPrivatePlacementList);
                });
                break;
            default:
                _this.loadingShow = false;
                _this.toast('木有对应信息');
                break;
        }
    };

    var loadMoreFun = function(data){
        if((_this.defaultIndex == 0 && data && data.length == 0) || !data){
            return
        }
        pageBol = true;
        if(data.length >= pageSize){
            _this.defaultIndex ++;
            _this.loadMore(function(){
                init();
            },pageBol)
        }else{
            _this.loadFinished = true;
        }
    };

    init();

    _this.$watch("defaultType",function(v){
        _this.defaultIndex = 0;
        _this.message = '';
        _this.loadFinished = false;
        sessionStorage.setItem('t',v);
        init();
    });
    _this.$watch("status",function(v){
        _this.defaultIndex = 0;
        _this.message = '';
        _this.defaultType = '';
        _this.loadFinished = false;
        sessionStorage.setItem('s',v);
        init();
       setTimeout(function(){
           var _class = $('.country');
           var _width = 0;
           $.each(_class.find('div'),function(i,v){
               _width += $(v).text().length + 1;
           });
           _class.css('width',_width + 1 + 'em');
       },0)
    })
};