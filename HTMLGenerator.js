
function GenerateSelectMenu(ID, Content){
    const myParent = document.body;

    const selectList = document.createElement("select");
    selectList.id = ID;
    myParent.appendChild(selectList);

    for (let i = 0; i < Content.length; i++) {
        let option = document.createElement("option");
        option.value = Content[i];
        option.text = Content[i];
        selectList.appendChild(option);
    }
}