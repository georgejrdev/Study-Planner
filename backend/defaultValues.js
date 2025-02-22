const VERSION = "1.2.0"
const DATABASE_NAME = "studyplanner"
const RELEASES_URL = "https://api.github.com/repos/georgejrdev/Study-Planner/releases"

function getVersion() {
    return VERSION
}

function getDatabaseName() {
    return DATABASE_NAME
}

function getReleasesUrl() {
    return RELEASES_URL
}

module.exports = {
    getVersion,
    getDatabaseName,
    getReleasesUrl,
}
