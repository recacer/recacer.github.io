var created = function () {
    var _this = this;
    var url = '';
    var fpId = sessionStorage.getItem('fpId');
    $('.header').show();
    if(window.location.href.indexOf('isShare=') != -1){
        _this.bottomBtn = 'isShare';
    }
    switch (_this.type) {
        case 'fixed':
            url = '/business/getAllFixedIncomeDetail';
            break;
        case 'insurance':
            url = '/business/getDomesticInsuranceDetail';
            break;
        case 'immigrant':
            if(_this.status == 1){
                url = '/business/getImmigrantYiMinDetailId';
            }else{
                url = '/business/getImmigrantPropertyDetail';
            }

            break;
        case 'private':
            url = '/business/getPrivateEquityDetail';
            break;
        default:
            url = '/business/getSunPrivatePlacementDetail';
            break;
    }
    url&&_this.requestFun(url,{"areId":_this.areId}).then(function(data){
        _this.message = data;
        _this.changeTitle(data.artName);
    });

    //
    /*if(fpId){
        _this.requestFun('/business/getSelectIfAuthentica',{fpId:fpId}).then(function(data){
        console.log(data)
            if(data.code == '1'){
                _this.fee = true;
            }
        });
    }*/

    $('html,body').on('click','a',function(){
        if(!$(this).hasClass('blueBtn')){
            var _href = $(this).attr('href');
            _href.indexOf('?') == -1 ? $(this).attr('href',_href + '?' + $(this).text()) : null;
        }
    });
};