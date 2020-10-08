
const checkObject = (obj, objString) => {

    const checkNested  = (obj, level,  ...rest) => {
        if (obj === undefined || obj === null) return false
        if (rest.length == 0 && obj.hasOwnProperty(level)) return true
        return checkNested(obj[level], ...rest)
    }

    const keyArr = objString.split('.');
    return checkNested(obj, ...keyArr);
}

const getNestedProperty = (obj, objString, replaceFalsy = false, replacementStr = null) => {

    const getNested  = (obj, level,  ...rest) => {
        if (obj === undefined || obj === null) return undefined
        if (rest.length == 0 && obj.hasOwnProperty(level)) return obj[level];
        return getNested(obj[level], ...rest)
    }

    const keyArr = objString.split('.');
    const result = getNested(obj, ...keyArr);
    if (replaceFalsy) {
        return result ? result: replacementStr;
    }
    return result;
}




module.exports = { checkObject, getNestedProperty };