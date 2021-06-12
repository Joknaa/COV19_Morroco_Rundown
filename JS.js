let Statistics01;
let Statistics02;
let RegionsStats;
let Cities;

let AllDeaths = 0;
let RegionsNames = [];
let StatsDates = [];

async function GetDataFromAPI() {
    const response = await fetch("https://cov19api1.herokuapp.com/timeline");
    return await response.json();
}

function InitialiseVariables(data) {
    Statistics01 = data.timeline.statistics;
    Statistics02 = data.timeline.statistics2;
    RegionsStats = data.timeline.Regions;
    Cities = data.timeline.villes;

    Object.keys(RegionsStats).forEach(function (day) {
        StatsDates.push(RegionsStats[day]["date"]);

        let Features = RegionsStats[day]["cas"]["features"]
        Object.keys(Features).forEach(function (attribute) {

            let Attributes = Features[attribute]["attributes"];
            RegionsNames.push(Attributes["Nom_Région_FR"]);
        })

    })
    console.log(StatsDates)
}


function GetDeaths_PerDay(Date) {
    AllDeaths = 0;
    document.getElementById("deaths").innerHTML = "";

    Object.keys(RegionsStats).forEach(function (day) {
        StatsDates.push(RegionsStats[day]["date"]);
        if (RegionsStats[day]["date"] === Date) {
            let Features = RegionsStats[day]["cas"]["features"]

            Object.keys(Features).forEach(function (attribute) {

                let Attributes = Features[attribute]["attributes"];

                RegionsNames.push(Attributes["Nom_Région_FR"]);

                document.getElementById("deaths").innerHTML += Attributes["Nom_Région_FR"] + ": " + Attributes["Deaths"] + "<br/>";
                AllDeaths += Attributes["Deaths"];
            })
        }
    })
    console.log(RegionsNames);
    console.log(StatsDates);
    document.getElementById("deaths_Sum").innerHTML = AllDeaths.toString();
}
function GetDeaths_PerSomething(Date) {
    Object.keys(RegionsStats).forEach(function (day) {
        document.getElementById("deaths").innerHTML += "<br/>------> " + RegionsStats[day]["date"] + "<br/>";

        let Features = RegionsStats[day]["cas"]["features"];
        Object.keys(Features).forEach(function (attribute) {

            let Attributes = Features[attribute]["attributes"];
            document.getElementById("deaths").innerHTML += Attributes["Nom_Région_FR"] + ": " + Attributes["Deaths"] + "<br/>";
            AllDeaths += Attributes["Deaths"];
        })
    })
    document.getElementById("deaths_Sum").innerHTML += AllDeaths;
}
