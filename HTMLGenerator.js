
function GenerateSelectMenu(ID, Content){
    const selectList = document.getElementById(ID);

    for (let i = 0; i < Content.length; i++) {
        let option = document.createElement("option");
        option.value = Content[i];
        option.text = Content[i];
        selectList.appendChild(option);
    }
}