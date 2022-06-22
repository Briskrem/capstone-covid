console.log('hippie')
abbreviations={'AK':'Alaska','AL':'Alabama','AR':'Arkansas','AZ':'Arizona','CA':'California','CO':'Colorado','CT':'Connecticut','DC':'District of Columbia','DE':'Delaware','FL':'Florida',
    'GA':'Georgia','HI':'Hawaii','IA':'Iowa','ID':'Idaho','IL':'Illinois','IN':'Indiana','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','MA':'Massachusetts','MD':'Maryland','ME':'Maine',
    'MI':'Michigan','MN':'Minnesota','MO':'Missouri','MS':'Mississippi','MT':'Montana','NC':'North Carolina','ND':'North Dakota','NE':'Nebraska','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico',
    'NV':'Nevada','NY':'New York','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas',
    'UT':'Utah','VA':'Virginia','VT':'Vermont','WA':'Washington','WI':'Wisconsin','WV':'West Virginia','WY':'Wyoming'
}

$('.state-button').on('click', getValue )

function getValue(e){
    e.preventDefault()
    state = $('.fo input').val()
    $.ajax({
        url:`/search/advanced/${state}`,
        success: function(data){
            console.log(data)
            createStateInfo(data)
        }
    })
}

function createStateInfo(info){
    console.log(info)
    createStateName(info)
    createStateGeneralData(info)
    createStateVaccine(info)
    createStateBeds(info)
    
    $('.state-data-container').addClass('tile');
}


function createStateName(info){
    STATE = abbreviations[info.state]
    console.log(STATE)
    $('.state-data h3').text(STATE)
}

function createStateGeneralData(info){
    $(`<li><h1>GENERAL STATISTICS</h1></li>`).appendTo('.state-general ul');
    $(`<li>Cases: ${info.actuals.cases}</li>`).appendTo('.state-general ul');
    $(`<li>Deaths: ${info.actuals.deaths}</li>`).appendTo('.state-general ul');
    $(`<li>Contact Tracers: ${info.actuals.contactTracers}</li>`).appendTo('.state-general ul');
    $(`<li>Positive Tests: ${info.actuals.positiveTests}</li>`).appendTo('.state-general ul');
    $(`<li>Negative Test: ${info.actuals.negativeTests}</li>`).appendTo('.state-general ul');
    $(`<li>New Cases: ${info.actuals.newCases}</li>`).appendTo('.state-general ul');
    $(`<li>New Deaths: ${info.actuals.newDeaths}</li>`).appendTo('.state-general ul');
    $(`<li>Infection Rate: ${info.metrics.infectionRate}</li>`).appendTo('.state-general ul');
    $(`<li>Weekly NewCases Per100k: ${info.metrics.weeklyNewCasesPer100k}</li>`).appendTo('.state-general ul');
    $(`<li>Population: ${info.population}</li>`).appendTo('.state-general ul');
    $(`<li><a href="${info.url}"> Website </li>`).appendTo('.state-general ul');
}

function createStateVaccine(info){
    $(`<li><h1>VACCINE STATISTICS</h1></li>`).appendTo('.state-vaccines ul');
    $(`<li>Additional doses: ${info.actuals.vaccinationsAdditionalDose}</li>`).appendTo('.state-vaccines ul');
    $(`<li>Completed vaccinations: ${info.actuals.vaccinationsCompleted}</li>`).appendTo('.state-vaccines ul');
    $(`<li>Initiated vaccinations: ${info.actuals.vaccinationsInitiated}</li>`).appendTo('.state-vaccines ul');
    $(`<li>Distributed Vaccines: ${info.actuals.vaccinesDistributed}</li>`).appendTo('.state-vaccines ul');    
}

function createStateBeds(info){
    $(`<li><h1>HOSPITAL BED STATISTICS</h1></li>`).appendTo('.state-beds ul');
    $(`<li>Bed capacity: ${info.actuals.hospitalBeds.capacity}</li>`).appendTo('.state-beds ul');
    $(`<li>Beds used for covid: ${info.actuals.hospitalBeds.currentUsageCovid}</li>`).appendTo('.state-beds ul');
    $(`<li>Beds currently used: ${info.actuals.hospitalBeds.currentUsageTotal}</li>`).appendTo('.state-beds ul');
    $(`<li>Weekly covid admissions: ${info.actuals.hospitalBeds.weeklyCovidAdmissions}</li>`).appendTo('.state-beds ul');
}
