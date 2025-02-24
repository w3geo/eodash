<template>
  <loading-animation v-if="features.length === 0" style="height: 400px" />
  <v-row v-else>
    <template
      v-for="(element, index) in features"
    >
      <v-col v-if="!element.indicatorObject && !element.text" :key="index" cols="12">
        Error: {{ element }}
      </v-col>
      <v-col
        v-else
        :key="element.poi"
        cols="12"
        :md="element.width > 1 ? (element.width > 2 ? (element.width > 3 ? 12 : 8) : 6) : 4"
        style="position: relative;"
      >
        <div class="d-flex align-center">
          <span
            v-if="element.title" @click="redirectToPoi(element.indicatorObject)"
            style="cursor: pointer">
            {{ element.title }}
          </span>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="enableEditing"
                icon
                small
                v-on="on"
                @click="featureTitle = element.title; featurePOI = element.poi; dialog = true"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit element title</span>
          </v-tooltip>
        </div>
        <v-card
          class="pa-0 elementCard"
          style="height: 500px"
          outlined
          tile
        >
          <div
            v-if="element.text"
            class="textAreaContainer"
          >
            <div
              class="pa-5 textArea"
              v-html="convertToMarkdown(element.text)"
            ></div>
          </div>
          <indicator-map
            ref="indicatorMap"
            style="top: 0px; position: absolute;"
            v-else-if="(['all'].includes(element.indicatorObject.country) ||
            appConfig.configuredMapPois.includes(
              `${element.indicatorObject.aoiID}-${element.indicatorObject.indicator}`
            ) ||
            Array.isArray(element.indicatorObject.country)) && !element.includesIndicator"
            class="pt-0 fill-height"
            :hideCustomAreaControls="!enableEditing"
            :currentIndicator="element.indicatorObject"
            :centerProp="localCenter[element.poi]"
            :zoomProp="localZoom[element.poi]"
            @update:center="c => {localCenter[element.poi] = c}"
            @update:zoom="z => {localZoom[element.poi] = z}"
            @ready="onMapReady(element.poi)"
          />
          <indicator-data
            style="top: 0px; position: absolute;"
            v-else
            class="pa-5 chart"
            :currentIndicator="element.indicatorObject"
          />
        </v-card>
        <template v-if="enableEditing">
          <div class="buttonContainer containerRight containerTop">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="my-2"
                  :style="`background: var(--v-background-base);
                          ${element.width > 1 ? '' : 'visibility: hidden'}`"
                  fab
                  outlined
                  x-small
                  color="primary"
                  v-on="on"
                  @click="performChange('resizeFeatureShrink', element)"
                >
                  <v-icon dark>
                    mdi-arrow-collapse
                  </v-icon>
                </v-btn>
              </template>
              <span>Shrink element</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="my-2"
                  :style="`background: var(--v-background-base);
                          ${element.width < 4 ? '' : 'visibility: hidden'}`"
                  fab
                  outlined
                  x-small
                  color="primary"
                  v-on="on"
                  @click="performChange('resizeFeatureExpand', element)"
                >
                  <v-icon dark>
                    mdi-arrow-expand
                  </v-icon>
                </v-btn>
              </template>
              <span>Expand element</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="my-2"
                  fab
                  dark
                  x-small
                  color="error"
                  v-on="on"
                  @click="performChange('removeFeature', element)"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <span>Delete element</span>
            </v-tooltip>
            <v-tooltip v-if="showTooltip(element) || element.text" left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="my-2"
                  fab
                  outlined
                  x-small
                  color="primary"
                  style="background: var(--v-background-base)"
                  @click="update(element)"
                >
                  <v-icon v-if="element.mapInfo" dark>
                    mdi-map-outline
                  </v-icon>
                  <v-icon v-if="element.text" dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="element.mapInfo && showTooltip(element)">Save map position</span>
              <span v-if="!element.mapInfo">Update text</span>
            </v-tooltip>
          </div>
          <div class="buttonContainer containerRight containerBottom">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  :style="index > 0 ? '' : 'visibility: hidden'"
                  class="my-2"
                  fab
                  dark
                  x-small
                  color="primary"
                  v-on="on"
                  @click="performChange('moveFeatureUp', element)"
                >
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
              </template>
              <span>Move element left</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  :style="index < features.length - 1 ? '' : 'visibility: hidden'"
                  class="my-2"
                  fab
                  dark
                  x-small
                  color="primary"
                  v-on="on"
                  @click="performChange('moveFeatureDown', element)"
                >
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </template>
              <span>Move element right</span>
            </v-tooltip>
          </div>
        </template>
      </v-col>
    </template>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline primary--text mb-5">
          Title for dashboard element
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="changeFeatureTitleFn(featurePOI, featureTitle)">
            <v-text-field
              placeholder="Title"
              outlined
              autofocus
              v-model="featureTitle"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="changeFeatureTitleFn(featurePOI, featureTitle)"
            :disabled="!featureTitle.length"
          >
            change
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { DateTime } from 'luxon';
import IndicatorData from '@/components/IndicatorData.vue';
import IndicatorMap from '@/components/IndicatorMap.vue';
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import { loadIndicatorData } from '@/utils';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  props: {
    enableEditing: Boolean,
    popupOpen: Boolean,
  },
  components: {
    IndicatorData,
    IndicatorMap,
    LoadingAnimation,
  },
  data: () => ({
    features: [],
    dialog: false,
    featureTitle: '',
    featurePOI: null,
    localZoom: {},
    localCenter: {},
    serverZoom: {},
    serverCenter: {},
    savedPoi: null,
  }),
  computed: {
    ...mapGetters('dashboard', {
      vuexFeatures: 'features',
    }),
    ...mapState('config', [
      'appConfig',
      'baseConfig',
    ]),
    showTooltip() {
      return (element) => {
        if (this.localCenter[element.poi] && this.serverCenter[element.poi]) {
          if (this.localCenter[element.poi].lat !== this.serverCenter[element.poi].lat) {
            return true;
          }
          if (this.localCenter[element.poi].lng !== this.serverCenter[element.poi].lng) {
            return true;
          }
          if (this.localZoom[element.poi] !== this.serverZoom[element.poi]) {
            return true;
          }
        }
        return false;
      };
    },
  },
  watch: {
    vuexFeatures: {
      immediate: true,
      deep: true,
      async handler(features) {
        if (features) {
          // check if this.serverZoom is empty
          // (meaning it's the first call that must go through every time)
          let firstCall = false;
          if (Object.keys(this.serverZoom).length === 0) {
            firstCall = true;
          }
          this.features = await Promise.all(features.map(async (f) => {
            if (f.includesIndicator) {
              const convertedTimes = f.indicatorObject.time.map(
                (d) => (DateTime.isDateTime(d) ? d : DateTime.fromISO(d)),
              );
              return {
                ...f,
                indicatorObject: {
                  ...f.indicatorObject,
                  time: convertedTimes,
                },
              };
            }

            if (f.text) {
              return f;
            }

            const feature = this.$store.state.features.allFeatures
              .find((i) => this.getLocationCode(i.properties.indicatorObject) === f.poi);
            const indicatorObject = await loadIndicatorData(
              this.baseConfig,
              feature.properties.indicatorObject,
            );

            if (f.mapInfo && (firstCall || f.poi === this.savedPoi)) {
              this.$set(this.localZoom, f.poi, f.mapInfo.zoom);
              this.$set(this.localCenter, f.poi, f.mapInfo.center);
              this.$set(this.serverZoom, f.poi, f.mapInfo.zoom);
              this.$set(this.serverCenter, f.poi, f.mapInfo.center);
            }

            return {
              ...f,
              indicatorObject,
            };
          }));
        }
      },
    },
  },
  methods: {
    ...mapActions('dashboard', [
      'removeFeature',
      'addMarketingInfo',
      'resizeFeatureShrink',
      'resizeFeatureExpand',
      'moveFeatureUp',
      'moveFeatureDown',
      'changeFeatureTitle',
      'changeFeatureMapInfo',
    ]),
    onMapReady(poi) {
      setTimeout(() => {
        this.localCenter[poi].lat = this.serverCenter[poi].lat;
        this.localCenter[poi].lng = this.serverCenter[poi].lng;
        this.localZoom[poi] = this.serverZoom[poi];
      }, 1000);
    },
    // updateMapPositionChanged(poi) {
    //   if(
    //     !this.localZoom[poi] ||
    //     !this.localCenter[poi] ||
    //     !this.serverZoom[poi] ||
    //     !this.serverCenter[poi]
    //   ) return this.mapPositionChanged[poi] = false

    //   return this.mapPositionChanged[poi] = this.localZoom[poi] !== this.serverZoom[poi]
    //    || this.localCenter[poi].lat !== this.serverCenter[poi].lat
    //    || this.localCenter[poi].lng !== this.serverCenter[poi].lng;
    // },
    update(el) { // eslint-disable-line
      if (el.mapInfo) {
        this.savedPoi = el.poi;
        return this.performChange(
          'changeFeatureMapInfo',
          {
            poi: el.poi,
            zoom: this.localZoom[el.poi],
            center: this.localCenter[el.poi],
          },
        );
      }
      // TODO: Should we make sure something is returned here?
      if (el.text) this.$emit('updateTextFeature', el);
    },
    redirectToPoi(indicatorObject) {
      this.$router.push(`/?poi=${this.getLocationCode(indicatorObject)}`);
      this.$store.commit('indicators/SET_SELECTED_INDICATOR', indicatorObject);
    },
    changeFeatureTitleFn(poi, newTitle) {
      this.dialog = false;
      this.performChange(
        'changeFeatureTitle',
        { poi, newTitle },
      );
    },
    convertToMarkdown(text) {
      return this.$marked(text);
    },
    async performChange(method, params) {
      this.$emit('change');
      const changed = await this[method](params);
      if (changed !== undefined) {
        this.$emit('save');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.containerRight {
  right: -3px;
}
.containerLeft {
  left: -3px;
}
.containerTop {
  top: 10%;
}
.containerBottom {
  bottom: 10%;
}
.chart {
  background: #fff;
}
::v-deep .textArea img, ::v-deep .textArea video, ::v-deep .textArea iframe {
  max-width: 100%;
}
.elementCard {
  overflow: hidden;
}
.textAreaContainer {
  overflow-y: auto;
  height: 100%;
}
</style>
