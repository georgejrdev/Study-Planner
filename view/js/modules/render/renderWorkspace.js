export async function renderWorkspaces(){
    const selectNewWorkspaces = document.getElementById("workspace-selector")
    
    const responseWorkspaces = await window.api.db.global.find(false, "SELECT * FROM workspaces")
    const workspaces = responseWorkspaces.data

    const responseCurrentWorkspaces = await window.api.db.global.find(false, "SELECT * FROM current_workspace DESC LIMIT 1")
    const currentWorkspace = responseCurrentWorkspaces.data

    workspaces.forEach(workspace => {
        const option = document.createElement("option")
        option.value = workspace.id
        option.innerText = `Workspace atual: ${workspace.name} | Clique para mudar`

        if (workspace.id == currentWorkspace[0].workspace_id) {
            option.selected = true
        }

        selectNewWorkspaces.appendChild(option)
    })
}