import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css'

import {i18n} from './i18n.js';
import {php_url} from './config.js';

var imgfile;
const id = new URL(location).searchParams.get('id');

function Preview(f,imgSrc) {
    document.getElementById(imgSrc).src = window.URL.createObjectURL(f.files[0]);
}

let $id             = $('[name="id"]');

let $form1          = $('#form-update_user_info');
let $avatar         = $form1.find('[name="avatar"]');
let $nickname       = $form1.find('[name="name"]');

let $form2          = $('#form-update_user_baseinfo');
let $email          = $form2.find('[name="email"]');
let $username       = $form2.find('[name="username"]');
let $password       = $form2.find('[name="password"]');
let $password2      = $form2.find('[name="password2"]');
let $sub            = $form2.find('[name="sub"]');
let $current_password=$form2.find('[name="current_password"]');

let url = new URL("/user.php", php_url);
url.searchParams.set('id', id);
let profiles_url=new URL("/profiles.php",php_url);

var jqxhr = $.ajax( {
    url:url,
    data:{},
    dataType:'json'
})
.done(function(x) {
    console.log(x);
    $id.val(x.id);
    $('#cropped').html( '<img src="'+x.avatar+'">');
    //$('#cropped').attr('src',x.avatar);
    $email.val(x.email);
    $username.val(x.username);
    $nickname.val(x.name);
    $("[data-html='username']").html(x.username);
    $("[data-html='email']").html(x.email);
});


(function(){
    $nickname.change(function(){
        $('#but1').removeAttr('disabled');
    })
    $form2.find('input').change(function(){
        $('#but2').removeAttr('disabled');
    });
    $('#but1').click(function subm(){
        //$("#sub1").click();
        var formData = new FormData();

        formData.append('avatar_url', imgfile);
        formData.append('name',$nickname.val());
        formData.append('id',$id.val());

        $.ajax( {
            type:'post',
            url:profiles_url,
            data:formData,
            //dataType:'json',
            processData: false,
            contentType: false
        })
        .done(function(x){
            console.log(x);
        })
        console.log(imgfile);
    })

    $('#form-update_user_baseinfo').submit(
        function(){
            event.preventDefault();
            if($password.val()==$password2.val()){
                $("#sub2").click();
                $.ajax({
                    type:'post',
                    url:profiles_url,
                    data:{
                        id:$id.val(),
                        email:$email.val(),
                        username:$username.val(),
                        password:$password.val(),
                        current_password:$current_password.val()
                    }
                })
                    .done(function(x){
                        console.log(x);
                    })
            }
        }
    )
})();



function init() {
    function keydownFn(e) {
        if(e.which===13){
            e.preventDefault();
        }
    }
    $("input").keydown(keydownFn);
}
init();
// ==============================================截图
window.onload = function() {
    var options =
    {
        imageBox: '.imageBox',
        thumbBox: '.thumbBox',
        spinner: '.spinner',
        imgSrc: '',
    }
    var cropper = new cropbox(options);
    document.querySelector('#file').addEventListener('change', function(){
        $('#btnCrop').removeAttr('disabled');
        $('#btnZoomIn').removeAttr('disabled');
        $('#btnZoomOut').removeAttr('disabled');
        var reader = new FileReader();
        reader.onload = function(e) {
            options.imgSrc = e.target.result;
            cropper = new cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        this.files = [];
    })
    document.querySelector('#btnCrop').addEventListener('click', function(){
        $('#but1').removeAttr('disabled');
        var img = cropper.getDataURL();
        imgfile=cropper.getBlob();
        $('#upimg').val(imgfile);
        document.querySelector('#cropped').innerHTML = '<img src="'+img+'">';
    })
    document.querySelector('#btnZoomIn').addEventListener('click', function(){
        cropper.zoomIn();
    })
    document.querySelector('#btnZoomOut').addEventListener('click', function(){
        cropper.zoomOut();
    })

    $(".takephoto").on("WheelEvent",function(){return false;})

    $('.imageBox').on('mousewheel',function(){
        console.log(1);
        return false;
    })
};