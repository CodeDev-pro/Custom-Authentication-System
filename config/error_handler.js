const error = {
    success: false,
    message: "",
    data: {}
}

const handleResponse = (message, success, {...others}) => {
    return {
        success,
        message,
        data: {...others}
    }
}

module.exports.handleResponse = handleResponse;