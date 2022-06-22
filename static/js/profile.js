$('.chartBox').hide()

// $('.settings-options').hide()
// $('.settings-btn').on('click', function(e){
//     console.log('jjj')
//     if($('.settings-options').hasClass('hidding')){
//         console.log('1')
//         $('.settings-options').toggleClass('showing').show()
        
//     }else if($('.settings-options').hasClass('showing')){
//         console.log('2')
//         $('.settings-options').toggleClass('hidding').hide()
        
//     }
// })

$('.sidebar-btn').on('click', function(e){
    e.preventDefault()
    $('.sidebar-btn').toggleClass('sidebar-btnc');
    $('.sidebar').toggleClass('side')
    $('body').toggleClass('boody')
    $('.sidebar').toggleClass('xx')
})

$('.view-saved-charts').on('click', async function(e){
    e.preventDefault()
    $('.chartBox').show()
    myCharts = document.querySelectorAll('#myChart')
    myCharts1 = Array.from(myCharts)
    console.log(myCharts1)
    console.log('jjjjjjjjjjjj')
    userCharts = await axios.get('/charts/user')
    console.log('coookie')
    console.log(userCharts)
    console.log(userCharts.data)

    for(let chart of userCharts.data){
        if(chart == userCharts.data[0]){
        createChart1(chart)
        }
        if(chart == userCharts.data[1]){
            createChart2(chart)
        }   
        
    }
    
})




function createChart1(obj){
    
    console.log(obj)

    //setup block
    const data = {
        labels: [obj[0].state, obj[1].state, obj[2].state, obj[3].state, obj[4].state],
        datasets: [{
            label: '# of Votes',
            data: [obj[0].actuals.cases, obj[1].actuals.cases, obj[2].actuals.cases, obj[3].actuals.cases, obj[4].actuals.cases],
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


function createChart2(obj){
    
    console.log(obj)

    //setup block
    const data = {
        labels: [obj[0].state, obj[1].state, obj[2].state, obj[3].state, obj[4].state],
        datasets: [{
            label: '# of Votes',
            data: [obj[0].actuals.cases, obj[1].actuals.cases, obj[2].actuals.cases, obj[3].actuals.cases, obj[4].actuals.cases],
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