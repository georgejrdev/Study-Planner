async function viewText(id){
    window.location.href = `./action/new-text.html?id=${id}`
}

function clearTextList(){
    const items = document.getElementsByClassName("text-list-item")

    while (items.length > 0) {
        items[0].remove()
    }
}

async function handleSearchText(){
    const search = document.getElementById("text-list-name").value

    if (search == "" || search == null) {
        clearTextList()
        renderAllTexts()       
        return
    }

    const response = await window.api.db.text.search(search)

    if (response.status === true) {
        clearTextList()
        const textListDiv = document.getElementById("text-list-content")
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
            textDate.innerText = formateDateToBrazilianFormat(text.date)

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

async function handleCreateText(){

    const defaultSubjectID = null
    const defaultTitle = "Untitled"
    const defaultText = ""
    const date = new Date().toISOString().slice(0, 10)

    const response = await window.api.db.text.create(defaultSubjectID, defaultTitle, defaultText, date)

    if (response.status === true) {
        window.location.href = `./action/new-text.html?id=${response.lastID}`

    } else {
        showMessage(response)
    }
}

async function handleUpdateText(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    const title = document.getElementById("file-name").value
    const text = quill.root.innerHTML
    const subjectId = (Number(document.getElementById("subject").value) === -1 ) ? null : Number(document.getElementById("subject").value)
    const response = await window.api.db.text.update(id, subjectId, title, text)

    if (response.status === false) {
        showMessage(response)
    }
}

async function handleDeleteText(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    await window.api.db.text.delete(id)
    window.history.back()
}

function changeVisibleConfirmDeleteText(){
    const confirmDelete = document.getElementById("confirm-delete")
    const visibility = (confirmDelete.style.display == "flex") ? "none" : "flex"
    confirmDelete.style.display = visibility
}



var quill

if (document.getElementById("main-new-text") != null) {
    quill = new Quill('#editor', {
        theme: 'snow'  
    })

    renderText()

    quill.on('text-change', function(delta, oldDelta, source) {
        clearTimeout(window.quillTimeout) 
        window.quillTimeout = setTimeout(() => {
            handleUpdateText()
        }, 500) 
    })
}

async function renderText(){
    const parameters = new URLSearchParams(window.location.search)
    const id = parameters.get("id")

    const response = await window.api.db.global.find(true, "SELECT * FROM texts WHERE id = ?", [id])

    if (response.status === true) {
        const text = response.data[0]
        document.getElementById("file-name").value = text.title
        
        quill.root.innerHTML = text.text
        const subjectId = (text.subjects_id == null) ? -1 : text.subjects_id
        
        const responseSubjects = await window.api.db.global.find(true, "SELECT * FROM subjects")

        if (responseSubjects.status === true) {
            const subjects = responseSubjects.data
            const selectSubjects = document.getElementById("subject")

            const defaultOption = document.createElement("option")
            defaultOption.value = -1
            defaultOption.innerText = "Disciplina"
            selectSubjects.appendChild(defaultOption)

            subjects.forEach(subject => {
                const option = document.createElement("option")
                option.value = subject.id
                option.innerText = subject.name

                if (subject.id == subjectId) {
                    option.selected = true
                }

                selectSubjects.appendChild(option)
            })
        }
    }
}



// Show Message

function showMessage(responseObject) {
    const messageElement = document.createElement("div")
    const messageText = document.createElement("p")

    const type = (responseObject.status === true) ? "success" : "error"
    const message = textMessageCode[responseObject.frontendMessageCode]

    messageElement.className = type
    messageText.innerText = message
    messageElement.appendChild(messageText)
    document.body.appendChild(messageElement)

    setTimeout(() => {
        messageElement.remove()

        if (type === "success") {
            window.location.reload()
        }

    }, 1000)
}

let textMessageCode = {
    0:"Erro ao executar a função",
    1:"Função executado com sucesso",
    2:"Erro ao criar workspace",
    3:"Sucesso ao criar workspace",
    4:"Erro ao deleter workspace",
    5:"Sucesso ao deletar workspace",
    6:"Erro ao trocar workspace",
    7:"Sucesso ao trocar workspace",
    8:"Erro ao deletar o workspace, voce precisa de no mínimo um workspace",
    9:"Erro ao criar a disciplina",
    10:"Sucesso ao criar a disciplina",
    11:"Erro ao atualizar a disciplina",
    12:"Sucesso ao atualizar a disciplina",
    13:"Erro ao deletar a disciplina",
    14:"Sucesso ao deletar a disciplina",
    15:"Erro ao registrar a nota",
    16:"Sucesso ao registrar a nota",
    17:"Erro ao atualizar a nota",
    18:"Sucesso ao atualizar a nota",
    19:"Erro ao deletar a nota",
    20:"Sucesso ao deletar a nota",
    21:"Erro ao criar tarefa",
    22:"Sucesso ao criar tarefa",
    23:"Erro ao atualizar tarefa",
    24:"Sucesso ao atualizar tarefa",
    25:"Erro ao deletar tarefa",
    26:"Sucesso ao deletar tarefa",
    27:"Erro ao registrar a falta",
    28:"Sucesso ao registrar a falta",
    29:"Erro ao deletar a falta",
    30:"Sucesso ao deletar a falta",
    31:"Erro ao criar o texto",
    32:"Sucesso ao criar o texto",
    33:"Erro ao atualizar o texto",
    34:"Sucesso ao atualizar o texto",
    35:"Erro ao deletar o texto",
    36:"Sucesso ao deletar o texto",
    1000:"Preencha todos os campos",
}

function formateDateToBrazilianFormat(SQLiteDate) {
    const [year, month, day] = SQLiteDate.split("-")
    return `${day}/${month}/${year}`
}

async function renderAllTexts(){
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
            textDate.innerText = formateDateToBrazilianFormat(text.date)

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