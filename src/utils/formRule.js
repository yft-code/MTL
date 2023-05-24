var formRule = {
    //必填字符串
    validateStr(rule, value, callback) {
        if (value == undefined || value == null || value === "") {
            return callback(new Error('必填项不能为空'));
        } else if (value.trim() == "") {
            return callback(new Error('必填项不能为空'));
        } else {
            callback();
        }
    },
    //必填非负整数
    necessaryIntNumber(rule, value, callback) {
        if (/^\d+$/.test(value)) {
            //是整数
            callback();
        } else if (value == undefined || value == null || value === "") {
            return callback(new Error('必填项不能为空'));
        } else {
            return callback(new Error('必须为整数！'));
        }
    },
    //必填非负数规则
    necessaryPosFloatNumber(rule, value, callback) {
        if (value == undefined || value == null || value === "") {
            return callback(new Error('必填项不能为空'));
        } else if (isNaN(value)) {
            return callback(new Error('必须为数字！'));
        } else if (value < 0) {
            return callback(new Error('不得为负数！'));
        } else {
            callback();
        }
    },
}
export default formRule

