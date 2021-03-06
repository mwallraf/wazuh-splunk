define([
  '../../module',
  '../../../dashboardMain',
  '../../../services/visualizations/chart/pie-chart',
  '../../../services/visualizations/chart/area-chart',
  '../../../services/visualizations/chart/column-chart',
  '../../../services/visualizations/table/table',
  '../../../services/visualizations/map/map',
  '../../../services/rawTableData/rawTableDataService'
], function(
  app,
  DashboardMain,
  PieChart,
  AreaChart,
  ColumnChart,
  Table,
  Map,
  RawTableDataService
) {
  'use strict'

  class AWS extends DashboardMain {
    /**
     * Class constructor
     * @param {*} $rootScope
     * @param {*} $scope
     * @param {*} $currentDataService
     * @param {*} $state
     * @param {*} $notificationService
     * @param {*} $reportingService
     */
    constructor(
      $urlTokenModel,
      $scope,
      $currentDataService,
      $state,
      $notificationService,
      $reportingService,
      reportingEnabled
    ) {
      super(
        $scope,
        $reportingService,
        $state,
        $currentDataService,
        $urlTokenModel
      )
      this.scope.reportingEnabled = reportingEnabled
      this.currentDataService.addFilter(
        `{"rule.groups{}":"amazon", "implicit":true}`
      )
      this.notification = $notificationService

      this.scope.expandArray = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]

      this.filters = this.getFilters()

      this.vizz = [
        /**
         * Visualizations
         */
        new AreaChart(
          'eventsBySourceVizz',
          `${this.filters} sourcetype=wazuh | timechart count by data.aws.source usenull=f`,
          'eventsBySourceVizz',
          this.scope,
          { customAxisTitleX: 'Time span' }
        ),
        new ColumnChart(
          'eventsByS3BucketsVizz',
          `${this.filters} sourcetype=wazuh | timechart count by data.aws.log_info.s3bucket usenull=f`,
          'eventsByS3BucketsVizz',
          this.scope,
          { customAxisTitleX: 'Time span' }
        ),
        new PieChart(
          'sourcesVizz',
          `${this.filters} sourcetype=wazuh | stats count BY data.aws.source`,
          'sourcesVizz',
          this.scope
        ),
        new PieChart(
          'accountsVizz',
          `${this.filters} sourcetype=wazuh | top data.aws.responseElements.instancesSet.items.instanceId`,
          'accountsVizz',
          this.scope
        ),
        new PieChart(
          's3BucketsVizz',
          `${this.filters} sourcetype=wazuh | stats count by data.aws.log_info.s3bucket`,
          's3BucketsVizz',
          this.scope
        ),
        new PieChart(
          'regionsVizz',
          `${this.filters} sourcetype=wazuh | top data.aws.awsRegion`,
          'regionsVizz',
          this.scope
        ),
        new Table(
          'top5Buckets',
          `${this.filters} sourcetype=wazuh | top data.aws.source limit=5 | rename data.aws.source as Source, count as Count, percent as Percent`,
          'top5Buckets',
          this.scope
        ),
        new Table(
          'top5Rules',
          `${this.filters} sourcetype=wazuh | top rule.id, rule.description limit=5 | rename rule.id as "Rule ID", rule.description as "Rule description", count as Count, percent as Percent`,
          'top5Rules',
          this.scope
        ),
        new RawTableDataService(
          'top5BucketsTable',
          `${this.filters} sourcetype=wazuh | top data.aws.source limit=5 | rename data.aws.source as Source, count as Count, percent as Percent`,
          'top5BucketsTableToken',
          '$result$',
          this.scope,
          'Top 5 buckets'
        ),
        new RawTableDataService(
          'top5RulesTable',
          `${this.filters} sourcetype=wazuh | top rule.id, rule.description limit=5 | rename rule.id as "Rule ID", rule.description as "Rule description", count as Count, percent as Percent`,
          'top5RulesTableToken',
          '$result$',
          this.scope,
          'Top 5 Rules'
        ),
        new Map(
          'map',
          `${this.filters} sourcetype=wazuh | stats count by data.aws.service.action.portProbeAction.portProbeDetails.remoteIpDetails.geoLocation.lat, data.aws.service.action.portProbeAction.portProbeDetails.remoteIpDetails.geoLocation.lon | rename data.aws.service.action.portProbeAction.portProbeDetails.remoteIpDetails.geoLocation.lon as "lon" | rename data.aws.service.action.portProbeAction.portProbeDetails.remoteIpDetails.geoLocation.lat as "lat" | geostats count`,
          'map',
          this.scope
        )
      ]
    }

    $onInit() {
      try {
        this.scope.startVis2Png = () =>
          this.reportingService.startVis2Png(
            'overview-aws',
            'AWS',
            this.filters,
            [
              'sourcesVizz',
              'accountsVizz',
              's3BucketsVizz',
              'regionsVizz',
              'eventsBySourceVizz',
              'eventsByS3BucketsVizz',
              'map',
              'top5Buckets',
              'top5Rules'
            ],
            {}, //Metrics
            this.tableResults
          )
      } catch (error) {
        console.error('error on init ', error)
      }
    }
  }
  app.controller('awsCtrl', AWS)
})
