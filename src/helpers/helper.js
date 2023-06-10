import moment from 'moment'

export const convertDateFormat = (date, fromFormat = 'ddd MMM D YYYY HH:mm:ss ZZ', toFormat = 'YYYY-MM-DD') => {
    const s = moment(date, fromFormat).format(toFormat);
    return s;
}

export const removeTags = (str) => {
    if ((str === null) || (str === ''))
        return '';
    else
        str = str.toString();

    return str.replace(/(<([^>]+)>)/ig, '');
}

export const isURL = (s) => {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
 }

 export const convertToIntIfString = (x) => {
    if (typeof x == 'string')
        return parseInt(x)
    else
        return x
 }

// export const isURL = (url) => {
//     const strRegex = "^((https|http|ftp|rtsp|mms)://)"
//         + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" 
//         + "(([0-9]{1,3}.){3}[0-9]{1,3}" 
//         + "|" 
//         + "([0-9a-z_!~*'()-]+.)*" 
//         + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." 
//         + "[a-z]{2,6})" 
//         + "(:[0-9]{1,4})?" 
//         + "((/?)|" 
//         + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";

//         var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)? (\/|\/([\w#!:.?+=&%@!\-\/]))?/
//     const re = new RegExp(strRegex);
//     return re.test(url);
// }

