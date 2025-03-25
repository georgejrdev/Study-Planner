const VERSION = "2.0.0"
const RELEASES_URL = "https://api.github.com/repos/georgejrdev/Study-Planner/releases"

function getVersion() {
    return VERSION
}


function getReleasesUrl() {
    return RELEASES_URL
}

module.exports = {
    getVersion,
    getReleasesUrl,
}
