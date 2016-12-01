'use strict';
import angular from 'angular';
import jquery from 'jquery';

let apiUrl = 'http://504080.com/api/v1/directories/enquiry-types';
var module = angular.module('myApp', []);

module.controller('myCtrl', [ '$scope', '$http', function($scope, $http) {

    // Email REGex
     $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;


    // create a blank object to handle form data.
    $scope.formData = {};

    // jQuery will handle fileread
    let files = [];
    function readURL(input) {

        if (input.files && input.files[0]) {
            let selectedFile = input.files[0];
            let ext = selectedFile.name.split(".");
            ext = ext[ext.length-1].toLowerCase();
            let arrayExtensions = ["jpg" , "jpeg", "png"];

            // if it's not image - show error (but we check it in html input)
            if (arrayExtensions.lastIndexOf(ext) == -1) {
                $('#image-upload-box .error').addClass('show');
                return;
            }

            // If file size more than 5 MB drop error
            if(selectedFile.size > 5242880)
            {
                $('#image-upload-box .error').addClass('show');
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {

                var img = new Image;

                img.onload = function() {

                    // If image less than 300x300 or filesize more than 5MB -  drop error
                    if(img.width < 300 || img.height < 300 || selectedFile.size > 5242880)
                    {
                        $('#image-upload-box .error').show(); // display error
                    }
                    else {

                        // show preview if everything is ok
                        $('#image-upload-box .error').hide(); // hide errors if there were

                        let $element = $(document.createElement('div'));
                        let div = document.createElement('div');
                        $element.addClass('image-preview').css('background-image','url('+e.target.result+')');
                        $element.append($(document.createElement('div')).addClass('del').append($(document.createElement('div')).addClass('line')).append($(document.createElement('div')).addClass('line')));
                        $('.del', $element).click(function(){
                            let $elementToRemove = $(this).parent();
                            files.splice($('.image-preview').index($elementToRemove), 1);
                            $(this).parent().remove();
                            console.dir(files);
                        });
                        files.push(selectedFile);
                        document.getElementById('image-upload').value = ''; // clear value so same file can be selected
                        $('#image-upload-box').before($element);
                    }
                }
                img.src = reader.result;
            }
            reader.readAsDataURL(selectedFile);
        }
    }

    // Handle file input
    $("#image-upload").change(function(){
        readURL(this);
    });

    // Handle click on box
    $('#click-area').click(function(){
        document.getElementById('image-upload').click();
    });


    $http({
        method : "GET",
        url : apiUrl
    }).success(function(response) {
        if (response.errors) {
            // Showing errors.
            $scope.errors = response.errors;
        } else {
            $scope.options = response.data;
            $scope.selectedOption = response.data[0];
        }
    });

    // calling submit function.
    $scope.submitForm = function() {

        // fill selected enquiry_type if not Other
        if($scope.selectedOption.name != "Other") {
            $scope.formData.enquiry_type = $scope.selectedOption.name;
        }
        //Convert our object to formdata
        $scope.formData.files = files;
        console.log($scope.formData);
        // send our form data
        $http({
            method  : 'POST',
            //url     : 'http://192.168.88.242:8080', // TODO: не забыть поменять
            url     : 'http://504080.com/api/v1/support',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }, // server accept only post the value as a FORM post. NOT json type
            data    : $scope.formData, // our js object
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(response) {
            console.log('success');

            // Your form has been sent
            $('#thank-you').show("slow");
            setTimeout(function(){
                $('#thank-you').hide("slow");
            }, 2000);

            // clearform fixes
            $('#supportForm').find("input, textarea").val(""); // clear values
            $('#supportForm .image-preview').remove(); // clear previews
            $scope.formData.description = ""; // clear calculated field
            files = []; // clear array of files



            if (response.errors) {
                // Showing errors.
                $scope.errors = response.errors;
                console.log('error');
                console.log(response.errors);
            } else {
                console.log(response.message);
                $scope.message = response.message;
            }
            $(this).closest('form').find("input[type=text], textarea").val("");
        }).error(function(response){
            console.log('error');
            console.log(response.errors);
            $scope.errors = response.errors;
        });
    };
}]);
