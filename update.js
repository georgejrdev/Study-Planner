const { app } = require("electron")
const path = require("path")
const fs = require("fs")
const os = require("os")
const { exec } = require("child_process")
const { getVersion, getReleasesUrl } = require("./backend/defaultValues")

const TEMP_DIR = path.join(os.tmpdir(), "update_script")
const batFilePath = path.join(TEMP_DIR, "update.bat")

const ROOT = path.resolve(__dirname, "..", "..")
const EXTRACTED_FOLDER = path.join(ROOT, "Study-Planner-win32-x64")

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
}

async function getLastRelease() {
    const releases = await fetch(getReleasesUrl())
    const data = await releases.json()

    const latestRelease = data[0]
    return {
        tag_name: latestRelease.tag_name.substring(1),
        published_at: formatDate(latestRelease.published_at)
    }
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
}

async function isNewRelease() {
    const releases = await getLastRelease()
    return releases ? isVersionNewer(getVersion(), releases.tag_name) : false
}

function isVersionNewer(localVersion, latestVersion) {
    const parts1 = localVersion.split(".").map(Number)
    const parts2 = latestVersion.split(".").map(Number)

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = i < parts1.length ? parts1[i] : 0
        const part2 = i < parts2.length ? parts2[i] : 0

        if (part2 > part1) return true
        if (part1 > part2) return false
    }
    return false
}

async function update() {
    if (await isNewRelease()) {
        const latestRelease = await getLastRelease()
        const URL_DOWNLOAD = `https://github.com/georgejrdev/Study-Planner/releases/download/v${latestRelease.tag_name}/StudyPlanner-${latestRelease.tag_name}.zip`

        const SCRIPT_BAT = `
            @echo off
            timeout 5 > nul

            taskkill /IM "Study-Planner.exe" /F > nul 2>&1
            timeout 3 > nul

            if exist "${ROOT}" (
                rmdir /s /q "${ROOT}"
            )

            mkdir "${ROOT}"

            curl -L -o "${ROOT}\\StudyPlanner.zip" "${URL_DOWNLOAD}"

            powershell -command "Expand-Archive -Path '${ROOT}\\StudyPlanner.zip' -DestinationPath '${ROOT}' -Force"

            del /f /q "${ROOT}\\StudyPlanner.zip"

            xcopy "${EXTRACTED_FOLDER}\\*" "${ROOT}" /E /H /C /Y

            if exist "${EXTRACTED_FOLDER}" (
                rmdir /s /q "${EXTRACTED_FOLDER}"
            )

            timeout 3 > nul
            start "" ${ROOT}\\Study-Planner.exe

            echo Atualização concluída!
            exit
        `

        fs.writeFileSync(batFilePath, SCRIPT_BAT)

        exec(`start "" "${batFilePath}"`, () => {
            if (app) {
                app.quit() 
            } else {
                process.exit(0)
            }
        })
    }
}

module.exports = {
    isNewRelease,
    update
}