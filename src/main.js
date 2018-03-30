/*global $*/
import React from 'react';
import ReactDOM from 'react-dom';
import ListTudu from './List';


document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        React.createElement(ListTudu),
        document.getElementById('list')
    );
    
    /*Fix Title in Top*/
    $(window).scroll(function(){
        if ($(this).scrollTop() > 90) {
            $('.title-list-container').addClass('fixed');
		    $('.list').css({'margin-top':'44px'});
		    $('.settings').css({'display':'none'});
        } else {
            $('.title-list-container').removeClass('fixed');
            $('.list').css({'margin-top':'0px'});
            $('.settings').css({'display':'block'});
        }
    });
  
    /*Hide Shaking*/
    $('.trash-shake').css({
        opacity:0
    });
    $('.check-shake').css({
        opacity:0
    });
    
    /*Cancel Editing*/
    $("#overlay-after, #overlay-before").click(function() {
        $('.editing').removeClass('editing');
        $('body').css({overflow:'auto'});
        
        /*Remove Overlay*/
        $('#overlay-after').css({
            display: 'none'
        });
        $('#overlay-before').css({
            display: 'none'
        });
        const defaultCSSDelete = {
            'position': 'absolute',
            'right': '-60px',
            'width': '60px',
            'height': '60px',
            'background-color': '#f44242',
            'margin-top': '-61px',
            'transition': 'right 0s ease-out',
            'transition': 'width 0s ease-out'
        };
        const defaultCSSMark = {
            'position': 'absolute',
            'right': '-60px',
            'width': '60px',
            'height': '60px',
            'background-color': '#022d1f',
            'margin-top': '-61px',
            'transition': 'right 0s ease-out',
            'transition': 'width 0s ease-out'
        };
        /*Go Back Actions*/
        $('.task:not(.done)').siblings('.markTaskIcon, .deleteTaskIcon').css({
            opacity: 1,
            'pointer-events': 'auto'
        });
        
        /*Go Back Confirm Action(SWIPE)*/
        $('.task:not(.done)').siblings('.swipe-delete').each(function() {
            $(this).css(defaultCSSDelete);
            setTimeout(function(){
                $(this).css({
                    'transition': 'right .3s ease-out',
                    'transition': 'width .4s ease-out'    
                });
            }.bind(this),400); 
        });
        $('.task:not(.done)').siblings('.swipe-mark:not(.done)').each(function() {
            $(this).css(defaultCSSMark);
            $(this).find('svg').css({fill:'rgb(255,255,255)'})
            setTimeout(function(){
                $(this).css({
                    'transition': 'right .3s ease-out',
                    'transition': 'width .3s ease-out'    
                });
            }.bind(this),400); 
        });
    });
});
