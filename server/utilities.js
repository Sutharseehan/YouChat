function processMessage(payload) {
    try {
        return JSON.parse(payload)
    } catch (error) {
        return null
    }
}

module.exports = processMessage