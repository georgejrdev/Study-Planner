async function handleUpdate(){
    await window.api.program.update()
}

function hideUpdateProgram(){
    document.getElementById("update-available").style.display = "none"
}