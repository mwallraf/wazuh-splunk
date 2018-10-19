define([
  '../../module',
  "splunkjs/mvc",
  "splunkjs/mvc/utils",
  "splunkjs/mvc/tokenutils",
  "underscore",
  "jquery",
  "splunkjs/mvc/simplexml",
  "splunkjs/mvc/simplexml/dashboardview",
  "splunkjs/mvc/simplexml/element/chart",
  "splunkjs/mvc/simplexml/element/table",
  "splunkjs/mvc/simpleform/formutils",
  "splunkjs/mvc/simplexml/searcheventhandler",
  "splunkjs/mvc/simpleform/input/timerange",
  "splunkjs/mvc/simplexml/element/map",
  "splunkjs/mvc/searchmanager",
  "splunkjs/mvc/simplexml/urltokenmodel"
], function (
  controllers,
  mvc,
  utils,
  TokenUtils,
  _,
  $,
  DashboardController,
  Dashboard,
  ChartElement,
  TableElement,
  FormUtils,
  SearchEventHandler,
  TimeRangeInput,
  MapElement,
  SearchManager,
  UrlTokenModel) {
    'use strict'
    
    controllers.controller('osqueryCtrl', function ($scope, $notificationService, $currentDataService, $state, osquery) {
      const vm = this
      const epoch = (new Date).getTime()
      vm.osqueryWodle = null
      try {
      $currentDataService.addFilter(`{"rule.groups":"osquery", "implicit":true}`)
      const wodles = osquery.data.data.wmodules
      vm.osqueryWodle = wodles.filter(item => item.osquery)[0].osquery
      } catch (err) {
        $notificationService.showSimpleToast('Cannot load wodle configuration. Osquery not configured.')
      }
      // Create token namespaces
      const urlTokenModel = new UrlTokenModel({ id: 'tokenModel' + epoch })
      mvc.Components.registerInstance('url' + epoch, urlTokenModel)
      const defaultTokenModel = mvc.Components.getInstance('default', { create: true })
      const submittedTokenModel = mvc.Components.getInstance('submitted', { create: true })
      let filters = $currentDataService.getSerializedFilters()
      const baseUrl = $currentDataService.getBaseUrl()
      const launchSearches = () => {
        filters = $currentDataService.getSerializedFilters()
        $state.reload();
      }
      
      $scope.$on('deletedFilter', () => {
        launchSearches()
      })
      
      $scope.$on('barFilter', () => {
        launchSearches()
      })
      
      let search9 = ''
      let element9 = ''
      
      
      urlTokenModel.on('url:navigate', function () {
        defaultTokenModel.set(urlTokenModel.toJSON())
        if (!_.isEmpty(urlTokenModel.toJSON()) && !_.all(urlTokenModel.toJSON(), _.isUndefined)) {
          submitTokens()
        } else {
          submittedTokenModel.clear()
        }
      })
      
      // Initialize tokens
      defaultTokenModel.set(urlTokenModel.toJSON())
      
      function submitTokens() {
        // Copy the contents of the defaultTokenModel to the submittedTokenModel and urlTokenModel
        FormUtils.submitForm({ replaceState: pageLoading })
      }
      
      function setToken(name, value) {
        defaultTokenModel.set(name, value)
        submittedTokenModel.set(name, value)
      }
      
      function unsetToken(name) {
        defaultTokenModel.unset(name)
        submittedTokenModel.unset(name)
      }
      
      submittedTokenModel.on("change:authSuccessToken", (model, authSuccessToken, options) => {
        const tokHTMLJS = submittedTokenModel.get("authSuccessToken")
        if (typeof tokHTMLJS !== 'undefined' && tokHTMLJS !== 'undefined') {
          vm.authSuccess = tokHTMLJS
          if (!$scope.$$phase) $scope.$digest()
        }
      })
      
      let pageLoading = true
      let input1
      let alertsOverTime
      let alertsOverTimeSearch
      let alertsEvolution
      let alertsEvolutionSearch
      let topPacks
      let topPacksSearch
      let topRules
      let topRulesSearch
      let mostCommonEvents
      let mostCommonEventsSearch
      
      
      /**
      * When controller is destroyed
      */
      $scope.$on('$destroy', () => {
        input1 = null
        alertsOverTime = null
        alertsOverTimeSearch = null
        alertsEvolution = null
        alertsEvolutionSearch = null
        topPacks = null
        topPacksSearch = null
        topRules = null
        topRulesSearch = null
        mostCommonEvents = null
        mostCommonEventsSearch = null
      })
      
      
      alertsOverTimeSearch = new SearchManager({
        "id": `alertsOverTimeSearch${epoch}`,
        "cancelOnUnload": true,
        "earliest_time": "$when.earliest$",
        "sample_ratio": 1,
        "status_buckets": 0,
        "latest_time": "$when.latest$",
        "search": `${filters} sourcetype=wazuh | timechart span=1h count`,
        "app": utils.getCurrentApp(),
        "auto_cancel": 90,
        "preview": true,
        "tokenDependencies": {
        },
        "runWhenTimeIsUndefined": false
      }, { tokens: true, tokenNamespace: "submitted" })
      
      alertsEvolutionSearch = new SearchManager({
        "id": `alertsEvolutionSearch${epoch}`,
        "cancelOnUnload": true,
        "earliest_time": "$when.earliest$",
        "sample_ratio": 1,
        "status_buckets": 0,
        "latest_time": "$when.latest$",
        "search": `${filters} sourcetype=wazuh | timechart span=1h limit=5 useother=f count by agent.name`,
        "app": utils.getCurrentApp(),
        "auto_cancel": 90,
        "preview": true,
        "tokenDependencies": {
        },
        "runWhenTimeIsUndefined": false
      }, { tokens: true, tokenNamespace: "submitted" })
      
      mostCommonEventsSearch = new SearchManager({
        "id": `mostCommonEventsSearch${epoch}`,
        "cancelOnUnload": true,
        "earliest_time": "$when.earliest$",
        "sample_ratio": 1,
        "status_buckets": 0,
        "latest_time": "$when.latest$",
        "search": `${filters} sourcetype=wazuh  | top data.osquery.name limit=5`,
        "app": utils.getCurrentApp(),
        "auto_cancel": 90,
        "preview": true,
        "tokenDependencies": {
        },
        "runWhenTimeIsUndefined": false
      }, { tokens: true, tokenNamespace: "submitted" })
      
      topPacksSearch = new SearchManager({
        "id": `topPacksSearch${epoch}`,
        "cancelOnUnload": true,
        "earliest_time": "$when.earliest$",
        "sample_ratio": 1,
        "status_buckets": 0,
        "latest_time": "$when.latest$",
        "search": `${filters} sourcetype=wazuh  | top "data.osquery.pack" limit=5`,
        "app": utils.getCurrentApp(),
        "auto_cancel": 90,
        "preview": true,
        "tokenDependencies": {
        },
        "runWhenTimeIsUndefined": false
      }, { tokens: true, tokenNamespace: "submitted" })
      
      topRulesSearch = new SearchManager({
        "id": `topRulesSearch${epoch}`,
        "cancelOnUnload": true,
        "earliest_time": "$when.earliest$",
        "sample_ratio": 1,
        "status_buckets": 0,
        "latest_time": "$when.latest$",
        "search": `${filters} sourcetype=wazuh  | top rule.id, rule.description limit=5`,
        "app": utils.getCurrentApp(),
        "auto_cancel": 90,
        "preview": true,
        "tokenDependencies": {
        },
        "runWhenTimeIsUndefined": false
      }, { tokens: true, tokenNamespace: "submitted" })
      
      //
      // DASHBOARD EDITOR
      //
      
      new Dashboard({
        id: 'dashboard' + epoch,
        el: $('.dashboard-body'),
        showTitle: true,
        editable: false
      }, { tokens: true }).render()
      
      
      topPacks = new TableElement({
        "id": `topPacks${epoch}`,
        "dataOverlayMode": "none",
        "drilldown": "cell",
        "percentagesRow": "false",
        "rowNumbers": "false",
        "totalsRow": "false",
        "wrap": "true",
        "managerid": `topPacksSearch${epoch}`,
        "el": $('#topPacks')
      }, { tokens: true, tokenNamespace: "submitted" }).render()
      
      topRules = new TableElement({
        "id": `topRules${epoch}`,
        "dataOverlayMode": "none",
        "drilldown": "cell",
        "percentagesRow": "false",
        "rowNumbers": "false",
        "totalsRow": "false",
        "wrap": "true",
        "managerid": `topRulesSearch${epoch}`,
        "el": $('#topRules')
      }, { tokens: true, tokenNamespace: "submitted" }).render()
      
      /* topRule.on("click", function (e) {
        if (e.field !== undefined) {
          e.preventDefault()
          const url = TokenUtils.replaceTokenNames(`${baseUrl}/app/SplunkAppForWazuh/search?q=${filters} sourcetype=wazuh |stats count sparkline by rule.id, rule.description, rule.groups, rule.level | sort count DESC | head 10 | rename rule.id as \"Rule ID\", rule.description as \"Description\", rule.level as Level, count as Count, rule.groups as \"Rule group\"&earliest=$when.earliest$&latest=$when.latest$`, _.extend(submittedTokenModel.toJSON(), e.data), TokenUtils.getEscaper('url'), TokenUtils.getFilters(mvc.Components))
          utils.redirect(url, false, "_blank")
        }
      }) */
      
      //
      // VIEWS: FORM INPUTS
      //
      
      alertsOverTime = new ChartElement({
        "id": `alertsOverTime${epoch}`,
        "charting.legend.placement": "right",
        "charting.drilldown": "none",
        "refresh.display": "progressbar",
        "charting.chart": "area",
        "charting.axisLabelsX.majorLabelStyle.rotation": "-90",
        "trellis.enabled": "0",
        "resizable": true,
        "trellis.scales.shared": "1",
        "charting.axisTitleX.visibility": "visible",
        "charting.axisTitleY.visibility": "visible",
        "charting.axisTitleY2.visibility": "visible",
        "managerid": `alertsOverTimeSearch${epoch}`,
        "el": $('#alertsOverTime')
      }, { tokens: true, tokenNamespace: "submitted" }).render()
      
      alertsEvolution = new ChartElement({
        "id": `alertsEvolution${epoch}`,
        "charting.legend.placement": "right",
        "charting.drilldown": "none",
        "refresh.display": "progressbar",
        "charting.chart": "area",
        "charting.axisLabelsX.majorLabelStyle.rotation": "-90",
        "trellis.enabled": "0",
        "resizable": true,
        "trellis.scales.shared": "1",
        "charting.axisTitleX.visibility": "visible",
        "charting.axisTitleY.visibility": "visible",
        "charting.axisTitleY2.visibility": "visible",
        "managerid": `alertsEvolutionSearch${epoch}`,
        "el": $('#alertsEvolution')
      }, { tokens: true, tokenNamespace: "submitted" }).render()
      
      mostCommonEvents = new ChartElement({
        "id": `mostCommonEvents${epoch}`,
        "trellis.size": "large",
        "charting.axisY2.scale": "inherit",
        "charting.chart.showDataLabels": "none",
        "charting.chart.stackMode": "default",
        "resizable": true,
        "charting.axisTitleY2.visibility": "visible",
        "charting.drilldown": "none",
        "charting.chart": "pie",
        "charting.layout.splitSeries.allowIndependentYRanges": "0",
        "charting.chart.nullValueMode": "gaps",
        "trellis.scales.shared": "1",
        "charting.layout.splitSeries": "0",
        "charting.axisTitleX.visibility": "visible",
        "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
        "charting.chart.style": "shiny",
        "charting.axisTitleY.visibility": "visible",
        "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
        "charting.chart.bubbleMinimumSize": "10",
        "charting.axisX.scale": "linear",
        "trellis.enabled": "0",
        "charting.axisY2.enabled": "0",
        "charting.legend.placement": "right",
        "charting.chart.bubbleSizeBy": "area",
        "charting.axisLabelsX.majorLabelStyle.rotation": "0",
        "charting.chart.bubbleMaximumSize": "50",
        "charting.chart.sliceCollapsingThreshold": "0.01",
        "charting.axisY.scale": "linear",
        "managerid": `mostCommonEventsSearch${epoch}`,
        "el": $('#mostCommonEvents')
      }, { tokens: true, tokenNamespace: "submitted" }).render()
      
      input1 = new TimeRangeInput({
        "id": "input1" + epoch,
        "default": { "latest_time": "now", "earliest_time": "-24h@h" },
        "searchWhenChanged": true,
        "earliest_time": "$form.when.earliest$",
        "latest_time": "$form.when.latest$",
        "el": $('#input1')
      }, { tokens: true }).render()
      
      input1.on("change", function (newValue) {
        if (newValue && input1)
        FormUtils.handleValueChange(input1)
      })
      
      DashboardController.onReady(function () {
        if (!submittedTokenModel.has('earliest') && !submittedTokenModel.has('latest')) {
          submittedTokenModel.set({ earliest: '0', latest: '' })
        }
      })
      
      // Initialize time tokens to default
      if (!defaultTokenModel.has('earliest') && !defaultTokenModel.has('latest')) {
        defaultTokenModel.set({ earliest: '0', latest: '' })
      }
      
      submitTokens()
      //
      // DASHBOARD READY
      //
      
      DashboardController.ready()
      pageLoading = false
    })
  })
  
  