function getCurrentMonthDays() {
    let days = []
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1

    let totalDays = new Date(year, month, 0).getDate()

    for (let day = 1; day <= totalDays; day++) {
        let date = new Date(year, month - 1, day)
        let formattedDate = date.toISOString().split("T")[0] 
        days.push(formattedDate)
    }

    let initDay = new Date(year, month - 1, 1).getDay()

    return { initDay, days }
}

export async function renderAbsences(){
    const absencesDiv = document.getElementById("absences-content")

    const response = await window.api.db.global.find(true, "SELECT * FROM absences")

    if (response.status === true) {
        const absences = response.data
        const { initDay, days } = getCurrentMonthDays()

        for (let i = 0; i < initDay; i++) {
            const emptyDay = document.createElement("div")
            emptyDay.classList.add("absence-day")
            emptyDay.classList.add("empty-day")
            absencesDiv.appendChild(emptyDay)
        }

        let dayNumber = 1

        days.forEach(day => {
            const dayDiv = document.createElement("div")
            dayDiv.classList.add("absence-day")

            const dayText = document.createElement("p")
            dayText.classList.add("absence-day-text")
            dayText.innerText = dayNumber
            dayNumber++
            
            let create = true

            for (let i = 0; i < absences.length; i++) {
                const absence = absences[i]
                if (absence.date == day) {
                    dayDiv.classList.add("absence-day-checked")
                    create = false
                    break
                }
            } 

            dayDiv.setAttribute("onclick", `handleAbsence(${create},'${day}')`)
            dayDiv.appendChild(dayText)

            absencesDiv.appendChild(dayDiv)
        })

        const absenceNumber = document.createElement("p")
        absenceNumber.classList.add("absence-number")
        absenceNumber.innerText = `Faltas totais: ${absences.length}`
        absencesDiv.appendChild(absenceNumber)
    }
}