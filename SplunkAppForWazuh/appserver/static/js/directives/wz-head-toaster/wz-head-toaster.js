/*
 * Wazuh app - Top nav bar directive
 * Copyright (C) 2015-2019 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
define(['../module'], function(directives) {
  'use strict'
  directives.directive('wzHeadToaster', function(BASE_URL) {
    return {
      controller: function($scope, $checkDaemonsService, $restartService) {
        // Listen for show toaster
        $scope.$on('showHeadToaster', (event, data) => {
          showHeadToaster(data)
        })

        const showHeadToaster = data => {
          // data will be a object with this fields: type=string, msg=string, delay=bool, spinner=bool
          try {
            if (!$scope.wazuhNotReadyYet) {
              $scope.showHeadRestartToaster = false
              $scope.messageType = data.type
              $scope.message = data.msg
              $scope.showHeadToaster = true
              if (data.delay) {
                $scope.showSpinner = data.spinner
                setTimeout(() => {
                  $scope.showHeadToaster = false
                  $scope.showSpinner = false
                  $scope.$applyAsync()
                }, 5000)
              }
              $scope.$applyAsync()
            }
          } catch (error) {
            $scope.showHeadToaster = false
            $scope.showSpinner = false
            $scope.$applyAsync()
          }
        }

        // Listen for show restart toaster
        $scope.$on('showHeadRestartToaster', (event, data) => {
          showHeadRestartToaster(data)
        })

        const showHeadRestartToaster = data => {
          try {            
            if (!$scope.wazuhNotReadyYet) {
              $scope.showHeadToaster = false
              $scope.message = data.msg
              $scope.node = data.node
              $scope.showHeadRestartToaster = true
              $scope.$applyAsync()
            }
          } catch (error) {
            $scope.showHeadRestartToaster = false
            $scope.$applyAsync()
          }
        }

        // Listen for wazuh not ready event
        $scope.$on('wazuhNotReadyYet', (event, data) => {
          let msg = false
          $scope.showHeadToaster = false
          $scope.showHeadRestartToaster = false
          if (data && data.msg) {
            msg = data.msg
          }
          $checkDaemonsService.makePing(msg)
        })

        // Bind function to button to launche ping to check Wazuh daemons again
        $scope.checkWazuhAgain = () => {
          $checkDaemonsService.makePing()
        }

        // Close the head toaster
        $scope.closeToaster = () => {
          $scope.showHeadToaster = false
          $scope.showHeadRestartToaster = false
          $scope.$applyAsync()
        }

        // Restars the manager, cluster or node
        $scope.restartWazuh = node => restartWazuh(node)

        const restartWazuh = async (node = false) => { 
          try {
            let result = ''
            if (node) {
              result = await $restartService.restartNode(node)
            } else {
              result = await $restartService.restart()
            }
            $scope.closeToaster()
            const data = {type:'info', msg:result, delay:true, spinner:true}
            showHeadToaster(data)
          } catch (error) {
            const data = {type:'error', msg:error, delay:false, spinner:false}
            showHeadToaster(data)
          }
        }
      },
      templateUrl:
        BASE_URL +
        '/static/app/SplunkAppForWazuh/js/directives/wz-head-toaster/wz-head-toaster.html'
    }
  })
})