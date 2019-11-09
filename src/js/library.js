const getFileExtension = (res) => {
    return res.substring(res.lastIndexOf('.') + 1, res.length) || res;
};

const resolve = (object, property, defaultValue)=>{
    try {
        const result = eval(`object${property}`);
        return result === undefined ? defaultValue : result;
    } catch (e) {
        return defaultValue
    }
};

export {
    getFileExtension,
    resolve
};
