$('#new-order-btn').on('click', function(event) {
    event.preventDefault();

    let vendor = $('#vendor').val().trim();
    let cost = $('#cost').val().trim();
    let date = $('#date-placed').val().trim()

    console.log('vendor: ', vendor + '\n' + 'cost: ', cost + '\n' + 'date: ', date)

    let newOrder = {
       vendor,
       cost,
       date
    };
    
})