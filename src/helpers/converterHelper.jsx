export function Currencies(nStr, type=0, nflag = 0){
    if(nflag == 1){
        nStr = nStr.replace(/^([-].+?\.\d+).+/g, "$1").replace(/[^\d.-]+/g, "");
    }
    console.log(nStr);
    if(type == 0){
        nStr += '';
        nStr    = nStr.replace(/,/,'');
        let x   = nStr.split('.');
        let x1  = x[0];
        let x2  = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    else{
        nStr += '';
        nStr    = nStr.replace(/[\.]/,'');
        let x   = nStr.split(',');
        let x1  = x[0];
        let x2  = x.length > 1 ? ',' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;       
    }
}

export function NumericalOnly(nStr){
    return nStr.replace(/(\D)/g, "");
}

export function IntlCurrency(nStr, format = 'id-ID'){
    const Cur = new Intl.NumberFormat(format, {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
    const reform = Cur.format(nStr);
    return reform;
}