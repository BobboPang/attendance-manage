$(document).ready(function () {
$('#success-tips').hide();
    $('#btn-add-face').click(function () {
        console.log('11111')
        var form_data = new FormData($('#form-data')[0]);
        if (!form_data.get('name')) {
            $('#alert').text("请输入学生姓名!");
            return;
        }
        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/add_face',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                $('#success-tips').show();
                console.log('Success!');
            },
        });
    });
     $('#btn-predict').click(function () {
        console.log('222')
        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: {},
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
//                $('#success-tips').show();
                console.log('Success!');
            },
        });
    });
})