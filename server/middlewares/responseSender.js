module.exports = function (req, res, next) {
    const message = req.sendingData

    const status = req.status || 200
    const messageBody = {
        data: message,
        status,
        success: true
    }
    res.status(status).send(messageBody)
} 