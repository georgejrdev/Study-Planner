import * as utils from "../../utils.js"

export async function renderAllTexts(){
    const textListDiv = document.getElementById("text-list-content")

    const response = await window.api.db.global.find(true, "SELECT texts.id, texts.title, texts.text, texts.date, subjects.name AS subject_name FROM texts LEFT JOIN subjects ON texts.subjects_id = subjects.id")

    if (response.status === true) {
        const texts = response.data
        let number = 0

        texts.forEach(text => {
            const textDiv = document.createElement("div")
            textDiv.classList.add("item")
            textDiv.classList.add("text-list-item")
            textDiv.setAttribute("onclick", `viewText(${text.id})`)

            if (number == 0) {
                textDiv.classList.add("even")
                number = 1
            } else {
                textDiv.classList.add("odd")
                number = 0
            }

            const textName = document.createElement("p")
            textName.classList.add("text-list-item-title")
            textName.innerText = text.title

            const textDate = document.createElement("p")
            textDate.classList.add("text-list-item-date")
            textDate.innerText = utils.formateDateToBrazilianFormat(text.date)

            const textSubject = document.createElement("p")
            textSubject.classList.add("text-list-item-subject")
            textSubject.innerText = text.subject_name

            textDiv.appendChild(textName)
            textDiv.appendChild(textDate)
            textDiv.appendChild(textSubject)
            textListDiv.appendChild(textDiv)
        })
    }
}