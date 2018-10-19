/*
 AngularJS v1.7.2
 (c) 2010-2018 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(s,p){'use strict';var e="BUTTON A INPUT TEXTAREA SELECT DETAILS SUMMARY".split(" "),l=function(a,b){if(-1!==b.indexOf(a[0].nodeName))return!0};p.module("ngAria",["ng"]).info({angularVersion:"1.7.2"}).provider("$aria",function(){function a(a,g,n,k){return function(c,f,d){if(!d.hasOwnProperty("ngAriaDisable")){var h=d.$normalize(g);!b[h]||l(f,n)||d[h]||c.$watch(d[a],function(a){a=k?!a:!!a;f.attr(g,a)})}}}var b={ariaHidden:!0,ariaChecked:!0,ariaReadonly:!0,ariaDisabled:!0,ariaRequired:!0,ariaInvalid:!0,
    ariaValue:!0,tabindex:!0,bindKeydown:!0,bindRoleForClick:!0};this.config=function(a){b=p.extend(b,a)};this.$get=function(){return{config:function(a){return b[a]},$$watchExpr:a}}}).directive("ngShow",["$aria",function(a){return a.$$watchExpr("ngShow","aria-hidden",[],!0)}]).directive("ngHide",["$aria",function(a){return a.$$watchExpr("ngHide","aria-hidden",[],!1)}]).directive("ngValue",["$aria",function(a){return a.$$watchExpr("ngValue","aria-checked",e,!1)}]).directive("ngChecked",["$aria",function(a){return a.$$watchExpr("ngChecked",
    "aria-checked",e,!1)}]).directive("ngReadonly",["$aria",function(a){return a.$$watchExpr("ngReadonly","aria-readonly",e,!1)}]).directive("ngRequired",["$aria",function(a){return a.$$watchExpr("ngRequired","aria-required",e,!1)}]).directive("ngModel",["$aria",function(a){function b(b,k,c,f){return a.config(k)&&!c.attr(b)&&(f||!l(c,e))&&("hidden"!==c.attr("type")||"INPUT"!==c[0].nodeName)}function m(a,b){return!b.attr("role")&&b.attr("type")===a&&!l(b,e)}function g(a,b){var c=a.type,f=a.role;return"checkbox"===
    (c||f)||"menuitemcheckbox"===f?"checkbox":"radio"===(c||f)||"menuitemradio"===f?"radio":"range"===c||"progressbar"===f||"slider"===f?"range":""}return{restrict:"A",require:"ngModel",priority:200,compile:function(e,k){if(!k.hasOwnProperty("ngAriaDisable")){var c=g(k,e);return{post:function(f,d,h,e){function g(){return e.$modelValue}function k(a){d.attr("aria-checked",h.value==e.$viewValue)}function l(){d.attr("aria-checked",!e.$isEmpty(e.$viewValue))}var n=b("tabindex","tabindex",d,!1);switch(c){case "radio":case "checkbox":m(c,
    d)&&d.attr("role",c);b("aria-checked","ariaChecked",d,!1)&&f.$watch(g,"radio"===c?k:l);n&&d.attr("tabindex",0);break;case "range":m(c,d)&&d.attr("role","slider");if(a.config("ariaValue")){var p=!d.attr("aria-valuemin")&&(h.hasOwnProperty("min")||h.hasOwnProperty("ngMin")),q=!d.attr("aria-valuemax")&&(h.hasOwnProperty("max")||h.hasOwnProperty("ngMax")),r=!d.attr("aria-valuenow");p&&h.$observe("min",function(a){d.attr("aria-valuemin",a)});q&&h.$observe("max",function(a){d.attr("aria-valuemax",a)});
    r&&f.$watch(g,function(a){d.attr("aria-valuenow",a)})}n&&d.attr("tabindex",0)}!h.hasOwnProperty("ngRequired")&&e.$validators.required&&b("aria-required","ariaRequired",d,!1)&&h.$observe("required",function(){d.attr("aria-required",!!h.required)});b("aria-invalid","ariaInvalid",d,!0)&&f.$watch(function(){return e.$invalid},function(a){d.attr("aria-invalid",!!a)})}}}}}}]).directive("ngDisabled",["$aria",function(a){return a.$$watchExpr("ngDisabled","aria-disabled",e,!1)}]).directive("ngMessages",function(){return{restrict:"A",
    require:"?ngMessages",link:function(a,b,e,g){e.hasOwnProperty("ngAriaDisable")||b.attr("aria-live")||b.attr("aria-live","assertive")}}}).directive("ngClick",["$aria","$parse",function(a,b){return{restrict:"A",compile:function(m,g){if(!g.hasOwnProperty("ngAriaDisable")){var n=b(g.ngClick);return function(b,c,f){if(!l(c,e)&&(a.config("bindRoleForClick")&&!c.attr("role")&&c.attr("role","button"),a.config("tabindex")&&!c.attr("tabindex")&&c.attr("tabindex",0),a.config("bindKeydown")&&!f.ngKeydown&&!f.ngKeypress&&
    !f.ngKeyup))c.on("keydown",function(a){function c(){n(b,{$event:a})}var e=a.which||a.keyCode;32!==e&&13!==e||b.$apply(c)})}}}}}]).directive("ngDblclick",["$aria",function(a){return function(b,m,g){g.hasOwnProperty("ngAriaDisable")||!a.config("tabindex")||m.attr("tabindex")||l(m,e)||m.attr("tabindex",0)}}])})(window,window.angular);
    //# sourceMappingURL=angular-aria.min.js.map