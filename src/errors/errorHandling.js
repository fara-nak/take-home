// We can me custome error message or types here in this class
function createCustomResponse(error, message) {
    return {
        success: false,
        message: message,
        error: error.message,
    }
}

export default createCustomResponse
