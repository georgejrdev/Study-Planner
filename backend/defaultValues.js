const VERSION = "1.1.0"
const DATABASE_NAME = "studyplanner"

function getVersion() {
    return VERSION
}

function getDatabaseName() {
    return DATABASE_NAME
}

module.exports = {
    getVersion,
    getDatabaseName
}
