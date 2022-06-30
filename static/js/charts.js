
window.removeEventListener('load', removeLoader)
$(document).ready(removeMessage)
loadData()

$('.stateChartButton').on('click', extract)

$('.toggle-button').on('click', function(e){
    $('.nav-links').toggleClass('active')
    $('header').toggleClass('active')
   
    if($('header').hasClass('active')){
        console.log('added')
        window.addEventListener('scroll', noScroll)
    }else{
        console.log('removed')
        window.removeEventListener('scroll', noScroll)
    }
})
function noScroll(){
   window.scrollTo(0,0)
}

async function loadData(e){
    $('.loader').show()
    console.log('its loading')
    window.addEventListener('scroll', noScroll)
    myCharts = document.querySelector('#myChart')
    userCharts = await axios.get('/charts/user')
    if(userCharts.data == 'None'){
        console.log('no charts')
        $('.chartBox-container').hide()
        $('.spinner').hide()
        window.removeEventListener('scroll', noScroll)
    }else{
        $('<button>DELETE</button>').addClass('delete-button').appendTo('#charts-intro .button2-container');
        $('.delete-button').on('click', removeChart)
        console.log('chart already exist, no more space!!!!')
        userCharts2 = ['on-load', userCharts.data[0][0],userCharts.data[0][1],userCharts.data[0][2],userCharts.data[0][3],userCharts.data[0][4] ]
        console.log(userCharts2)
        createChart(['on-load', userCharts])
        $('.spinner').hide()
        window.removeEventListener('scroll', noScroll)
    } 
}

async function extract(e){
    e.preventDefault()
    $('.spinner').show()
    window.addEventListener('scroll', noScroll)
    $('.chartBox-container').show()
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
        createChart(['on-search', responses])
        $('.spinner').hide()
        window.removeEventListener('scroll', noScroll)
    });
}

// The if/else statement diffrentiates between chart data saved in the db and chart data just inputed.
function createChart(array){
    var options = array[0]
    if(options == 'on-search'){
        console.log(array[0])
        stateArraySaved = [array[1][0].data.state, array[1][1].data.state, array[1][2].data.state, array[1][3].data.state, array[1][4].data.state]
        console.log(stateArraySaved)
        label1 = stateArraySaved[0]
        label2 = stateArraySaved[1]
        label3 = stateArraySaved[2]
        label4 = stateArraySaved[3]
        label5 = stateArraySaved[4]
        state1 = array[1][0].data.actuals.cases
        state2 = array[1][1].data.actuals.cases
        state3 = array[1][2].data.actuals.cases
        state4 = array[1][3].data.actuals.cases
        state5 = array[1][4].data.actuals.cases
    }else{
        console.log(array[0])
        label1 = array[1].data[0][0].state
        label2 = array[1].data[0][1].state
        label3 = array[1].data[0][2].state
        label4 = array[1].data[0][3].state
        label5 = array[1].data[0][4].state
        state1 = array[1].data[0][0].actuals.cases
        state2 = array[1].data[0][1].actuals.cases
        state3 = array[1].data[0][2].actuals.cases
        state4 = array[1].data[0][3].actuals.cases
        state5 = array[1].data[0][4].actuals.cases
        stateArraySaved = [label1,label2 ,label3 ,label4 ,label5 ]
    }

    //setup block
    console.log('jak')
    const data = {
        labels: [label1, label2, label3, label4, label5],
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

async function stateSave(e){
    e.preventDefault()
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
    location.reload()
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

    location.reload()
}

function noScroll(){
    window.scrollTo(0,0)
    console.log('no scroll')
}

function removeMessage(){
    setTimeout(function() {
        console.log('metoo')
        $('.flash-deletedMessage').fadeOut('fast')
     
    }, 3000)
}