<script>
import { Line, mixins } from 'vue-chartjs';
import { DateTime } from 'luxon';
import lockdownTimes from '@/assets/lockdown_data.json';
import countries from '@/assets/countries.json';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.render();
  },
  watch: {
    options: {
      handler() {
        this.render();
      },
      deep: true,
    },
  },
  data() {
    return {
      defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false,
          },
        },
        legend: {
          labels: {
            generateLabels: (chart) => {
              const { datasets } = chart.data;
              const { labels } = chart.legend.options;
              const { usePointStyle } = labels;
              const overrideStyle = labels.pointStyle;
              let labelSet = chart._getSortedDatasetMetas();
              labelSet = labelSet.filter((meta) => {
                let includeLabel = false;
                if (Object.prototype.hasOwnProperty.call(datasets[meta.index], 'label')) {
                  includeLabel = !datasets[meta.index].label.startsWith('hide_');
                }
                return includeLabel;
              });
              const labelObjects = labelSet.map((meta) => {
                const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
                const borderWidth = 2;
                let hidden = false;
                if (meta.hidden === true) {
                  hidden = true;
                }
                return {
                  text: datasets[meta.index].label,
                  fillStyle: style.backgroundColor,
                  hidden,
                  lineCap: style.borderCapStyle,
                  lineDash: style.borderDash,
                  lineDashOffset: style.borderDashOffset,
                  lineJoin: style.borderJoinStyle,
                  lineWidth: borderWidth,
                  strokeStyle: style.borderColor,
                  pointStyle: overrideStyle || style.pointStyle,
                  rotation: style.rotation,
                  // Below is extra data used for toggling the datasets
                  datasetIndex: meta.index,
                };
              }, this);
              if (!this.options.sameYearComparison) {
                labelObjects.push({
                  text: 'Low Restrictions',
                  fillStyle: 'rgba(204, 143, 143, 0.24)',
                  hidden: false,
                  lineWidth: 0,
                  datasetIndex: -1,
                  pointStyle: 'rect',
                });
                labelObjects.push({
                  text: 'High Restrictions',
                  fillStyle: 'rgba(207, 109, 109, 0.54)',
                  hidden: false,
                  lineWidth: 0,
                  datasetIndex: -1,
                  pointStyle: 'rect',
                });
              }
              return labelObjects;
            },
            ...this.options.labelsExtend,
          },
          ...this.options.legendExtend,
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: this.options.timeConfig ? this.options.timeConfig : {
              unit: 'week',
              displayFormats: {
                month: 'MMM yy',
              },
              tooltipFormat: 'dd. MMM yy',
            },
            distribution: this.options.distribution ? this.options.distribution : 'linear',
            ticks: {},
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.options.yAxis,
              padding: 2,
            },
          }],
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          enabled: true,
          mode: 'x',
        },
        annotation: {
          annotations: [],
        },
      },
    };
  },
  methods: {
    render() {
      const extendedSettings = Object.assign(this.defaultOptions, this.options);
      if (!extendedSettings.sameYearComparison) {
        extendedSettings.annotation.annotations.push(...this.movementRestrictions);
      }
      if ('yAxisOverwrite' in extendedSettings) {
        extendedSettings.scales.yAxes[0] = {
          ...extendedSettings.scales.yAxes[0],
          ...extendedSettings.yAxisOverwrite,
        };
      }
      const [min, max] = this.minMaxDate();
      extendedSettings.scales.xAxes[0].ticks.min = min;
      extendedSettings.scales.xAxes[0].ticks.max = max;
      this.renderChart(this.chartData, extendedSettings);
    },
    minMaxDate() {
      const alldata = this.chartData.datasets.map((ds) => ds.data.map((d) => d.t.toMillis()));
      const flattenedData = [].concat(...alldata);
      let timeMin = Math.min(...flattenedData);
      let timeMax = Math.max(...flattenedData);
      const buffer = (timeMax - timeMin) / (flattenedData.length / alldata.length);
      timeMin -= buffer;
      timeMax += buffer;
      return [timeMin, timeMax];
    },
  },
  computed: {
    movementRestrictions() {
      // Find country based on alpha-3 code
      const currCountry = countries.features.find(
        (cntr) => cntr.properties.alpha2 === this.options.country,
      );
      const annotations = [];
      if (typeof currCountry !== 'undefined'
        && Object.prototype.hasOwnProperty.call(lockdownTimes, currCountry.id)) {
        const lckTs = lockdownTimes[currCountry.id]['C7_Restrictions on internal movement'];
        for (let i = 0; i < lckTs.length; i++) {
          let areaColor = 'rgba(0, 0, 0, 0.0)';
          if (lckTs[i].value === 1) {
            areaColor = 'rgba(204, 143, 143, 0.24)';
          } else if (lckTs[i].value === 2) {
            areaColor = 'rgba(207, 109, 109, 0.54)';
          }

          const start = DateTime.fromISO(lckTs[i].start);
          const end = DateTime.fromISO(lckTs[i].end);

          if (lckTs[i].value !== 0) {
            annotations.push({
              drawTime: 'beforeDatasetsDraw',
              type: 'box',
              xScaleID: 'x-axis-0',
              xMin: start.toISODate(),
              xMax: end.toISODate(),
              borderColor: areaColor,
              borderWidth: 0,
              backgroundColor: areaColor,
            });
          }
        }
      }
      return annotations;
    },
  },
};
</script>
