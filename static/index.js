$(document).ready(function () {
    $('#btn-predict').click(function () {
        console.log('11111')
        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/add_face',
            data: {},
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text(' Result:  ' + data);
                console.log('Success!');
            },
        });
    });
})