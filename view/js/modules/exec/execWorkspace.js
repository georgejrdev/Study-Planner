async function selectNewWorkspace() {
    const selectOption = document.getElementById("workspace-selector").value
    
    if (selectOption === "create") {
        showCreateWorkspace()
    } else if (selectOption === "delete") {
        showDeleteWorkspace()
    } else {
        const id = Number(selectOption)
        const response = await window.api.db.workspace.change(id)

        showMessage(response)
    }
}

function showCreateWorkspace() {
    document.getElementById("create-workspace").style.display = "flex"
}

function hideCreateWorkspace() {
    document.getElementById("create-workspace").style.display = "none"
}

async function handleCreateWorkspace() {
    const name = document.getElementById("workspace-name").value
    const response = await window.api.db.workspace.create(name)

    showMessage(response)
}

async function showDeleteWorkspace() {
    document.getElementById("delete-workspace").style.display = "flex"

    const selectNewWorkspaces = document.getElementById("workspace-select-delete")
    const response = await window.api.db.global.find(false, "SELECT * FROM workspaces")
    const workspaces = response.data

    workspaces.forEach(workspace => {
        const option = document.createElement("option")
        option.value = workspace.id
        option.innerText = workspace.name
        selectNewWorkspaces.appendChild(option)
    })
}

function hideDeleteWorkspace() {
    document.getElementById("delete-workspace").style.display = "none"
}

async function handleDeleteWorkspace() {
    const id = Number(document.getElementById("workspace-select-delete").value)
    const response = await window.api.db.workspace.delete(id)

    showMessage(response)
}



// Show Message

function showMessage(responseObject) {
    const messageElement = document.createElement("div")
    const messageText = document.createElement("p")

    const type = (responseObject.status === true) ? "success" : "error"
    const message = workspaceMessageCode[responseObject.frontendMessageCode]

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

let workspaceMessageCode = {
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