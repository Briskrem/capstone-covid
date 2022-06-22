
$('.stateChartButton').on('click', extract)

async function extract(e){
    e.preventDefault()
    $('canvas').remove()
    $('<canvas></canvas>').attr('id', 'myChart').appendTo('.chartBox')


    stateInput1 = $('input[name="state1"]').val()
    stateInput2 = $('input[name="state2"]').val()
    stateInput3 = $('input[name="state3"]').val()
    stateInput4 = $('input[name="state4"]').val()
    stateInput5 = $('input[name="state5"]').val()
    
    stateArrayData = []
    let stateArray = [stateInput1, stateInput2, stateInput3, stateInput4, stateInput5]
    
    $('.delete-button').remove()
    $('.save-button').remove()
    $.ajax({
        url: '/charts/delete',
        success: function(data){
            console.log(data)
            if(data['result'] == 'no'){
                $('.delete-button').remove()
                $('<button>SAVE</button>').addClass('save-button').appendTo('#charts-intro .button-container');                          
                $('.save-button').on('click', stateSave)
                console.log('database has room for a chart')
            }else{
                if(data['result'] == 'yes'){
                    $('.save-button').remove()
                    $('<button>DELETE</button>').addClass('delete-button').appendTo('#charts-intro .button2-container');
                    $('.delete-button').on('click', removeChart)
                    console.log('chart already exist, no more space!!!!')
                }
            }
        }   
            
    })
    
    stateArray.forEach(state => {
        stateArrayData.push(axios.get(`/search/advanced/${state}`))
        
    });
    Promise.all(stateArrayData)
    .then(responses => {
        // console.log(responses)
        createChart(responses)
    });
}



function createChart(array){
    stateArraySaved = [array[0].data.state, array[1].data.state, array[2].data.state, array[3].data.state, array[4].data.state]
    // console.log(stateArraySaved)
    // saveStates(stateArraySaved)
    state1 = array[0].data.actuals.cases
    state2 = array[1].data.actuals.cases
    state3 = array[2].data.actuals.cases
    state4 = array[3].data.actuals.cases
    state5 = array[4].data.actuals.cases
    // console.log(array[0].data.state)

    //setup block
    const data = {
        labels: [array[0].data.state, array[1].data.state, array[2].data.state, array[3].data.state, array[4].data.state],
        datasets: [{
            label: '# of Votes',
            data: [state1, state2, state3, state4, state5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    //config block
    const config = {
        type: 'pie',
        data,
        options: {}
    };
    
    //render block
    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    )
    
}

// function saveStates(array){
//     $.ajax({
//         url: '/charts/delete',
//         success: function(data){
//             console.log(data)
//             if(data['result'] == 'no'){
//                 console.log('yakkkkkkkkkkkkkk')
//                 $('.delete-button').remove()
//                 $('<button>SAVE</button>').addClass('save-button').appendTo('#charts-intro .button-container');
                
    
//             }
//         }
//     })
// }

async function stateSave(e){
    
    e.preventDefault()
    console.log('stateSAVE')
    console.log(stateArraySaved[0])
    posted = await axios({
        url:'/charts/add',
        method: 'POST',
        data: {
            "state1": stateArraySaved[0],
            "state2": stateArraySaved[1],
            "state3": stateArraySaved[2],
            "state4": stateArraySaved[3],
            "state5": stateArraySaved[4]
        }
    })
    $('.save-button').remove()
    $('<button>DELETE</button>').addClass('delete-button').appendTo('#charts-intro .button2-container');
    $('.delete-button').on('click', removeChart)
}


async function removeChart(){
    posted = await axios({
        url:'/charts/delete',
        method: 'DELETE'
    })
    console.log(posted)
    $('.delete-button').remove()
    $('<button>SAVE</button>').addClass('save-button').appendTo('#charts-intro .button-container');
    $('<button>SAVE</button>').on('click', stateSave )
}