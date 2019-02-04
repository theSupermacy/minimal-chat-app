export default (fn) => {
    return (req, res, next) => {
        fn(req).then(data => req.sendingData = data).catch(next)
    }
}