// function processMessage(payload) {

// }

// module.exports = processMessage



const JWT_SECRET_TOKEN = "siufhsdiufhsiwuhdfiushdfiusdhfiusdh435345fidsuhfdsiuhf";

module.exports = {
    JWT_SECRET_TOKEN: JWT_SECRET_TOKEN,

    processMessage: function (payload) {
        try {
            return JSON.parse(payload)
        } catch (error) {
            return null
        }
    }
}