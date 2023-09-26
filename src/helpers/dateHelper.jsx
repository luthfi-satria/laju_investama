export function UTCToLocaleDate(date, format = 'intl'){
    const newDate = new Date(date);
    const getYear = newDate.toLocaleDateString('en', {year: "numeric", timeZone: 'Asia/Jakarta'});
    const getMonth = newDate.toLocaleDateString('en', {month: "2-digit", timeZone: 'Asia/Jakarta'});
    const getDate = newDate.toLocaleDateString("en", {day: "2-digit", timeZone: 'Asia/Jakarta'});
    let reformat = '';
    if(format == 'local'){
        reformat = `${getDate}-${getMonth}-${getYear}`;
    }else{
        reformat = `${getYear}-${getMonth}-${getDate}`;
    }
    return reformat;
}

export function CompareDates(startDate, endDate){
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);
    return firstDate < secondDate;
}