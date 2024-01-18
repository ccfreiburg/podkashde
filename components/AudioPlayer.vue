<template>
  <div>
    <audio ref="audio" :src="audiosrc" :preload="preload" style="display: none"></audio>
    <div class="flex flex-col">
      <div class="flex flex-row flex-nowrap">
        <div class="w-28 md:w-60 md:px-10 flex flex-row justify-around items-center">
          <button class="border-0 rounded-3xl h-6 w-6" @click="back">
            <svg viewBox="2 3 20 20" fill="currentColor" class="w-5 h-5">
              <path
                d="M 8.582 14.072 C 8.297 14.072 8.015 14.014 7.753 13.899 C 7.475 13.779 7.221 13.609 7 13.398 L 7 14.629 C 7.22 14.802 7.468 14.933 7.733 15.016 C 8.043 15.109 8.365 15.153 8.688 15.148 C 8.958 15.149 9.228 15.102 9.483 15.009 C 9.729 14.922 9.954 14.783 10.144 14.601 C 10.556 14.224 10.762 13.731 10.761 13.122 C 10.761 12.693 10.651 12.329 10.429 12.03 C 10.194 11.724 9.872 11.502 9.508 11.396 L 10.732 8.983 L 10.732 8.954 L 7.049 8.954 L 7.049 10.065 L 9.064 10.065 L 8.041 12.067 L 8.041 12.098 C 8.518 12.084 8.901 12.167 9.189 12.346 C 9.466 12.502 9.634 12.805 9.624 13.13 C 9.624 13.442 9.534 13.677 9.354 13.835 C 9.174 13.994 8.916 14.073 8.582 14.072 Z M 15.606 9.075 C 15.013 8.777 14.319 8.777 13.726 9.075 C 13.432 9.23 13.177 9.452 12.979 9.724 C 12.761 10.026 12.6 10.366 12.501 10.728 C 12.276 11.559 12.276 12.438 12.501 13.269 C 12.6 13.63 12.762 13.97 12.979 14.271 C 13.177 14.544 13.432 14.766 13.726 14.922 C 14.32 15.219 15.013 15.219 15.606 14.922 C 15.9 14.766 16.156 14.544 16.354 14.271 C 16.571 13.97 16.732 13.63 16.831 13.269 C 17.056 12.438 17.056 11.559 16.831 10.728 C 16.732 10.366 16.571 10.026 16.354 9.724 C 16.156 9.452 15.9 9.23 15.606 9.075 Z M 15.51 13.474 C 15.321 13.835 15.039 14.015 14.666 14.015 C 14.287 14.015 14 13.821 13.808 13.43 C 13.628 13.105 13.537 12.629 13.538 12 C 13.539 11.372 13.635 10.879 13.827 10.521 C 14.02 10.164 14.3 9.985 14.666 9.985 C 15.026 9.985 15.304 10.166 15.5 10.531 C 15.697 10.896 15.794 11.384 15.794 12 C 15.794 12.616 15.699 13.112 15.51 13.474 Z"
                style=""></path>
              <path
                d="M 61.804 53.519 L 60.404 53.251 C 61.696 47.016 55.5 41.771 49.252 43.81 C 45.189 45.136 42.769 49.152 43.588 53.209 C 44.462 57.55 48.734 60.435 53.234 59.795 L 52.919 58.947 L 56.64 59.377 L 54.05 61.987 L 53.727 61.114 C 48.374 62.016 43.226 58.624 42.185 53.471 C 41.132 48.248 44.671 43.191 50.09 42.176 C 50.726 42.056 51.372 41.996 52.02 41.996 C 58.318 42.011 63.034 47.566 61.804 53.519 Z"
                style="" data-bx-origin="-0.49997 -0.500225" transform="matrix(-1, 0, 0, -1, 64.000016, 63.992002)">
              </path>
            </svg>
          </button>
          <button class="mx-4 disabled:text-slate-500 border-0 rounded-3xl h-10 w-10" :disabled="!loaded"
            @click="pause">
            <svg v-if="paused" viewBox="0 0 24 24" class="h-10 w-10">
              <defs>
                <linearGradient id="gradient-ccf">
                  <stop offset="0" style="stop-color: rgb(var(--color-grad-start))"></stop>
                  <stop offset="0.36" style="stop-color: rgb(var(--color-grad-via))"></stop>
                  <stop offset="0.65" style="stop-color: rgb(var(--color-grad-end))"></stop>
                </linearGradient>
              </defs>
              <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M 16.755 11.53 L 9.701 7.069 C 9.386 6.869 9 7.127 9 7.537 L 9 16.461 C 9 16.871 9.386 17.131 9.701 16.932 L 16.755 12.47 C 16.761 12.468 16.766 12.463 16.771 12.461 C 17.082 12.248 17.075 11.73 16.755 11.53 Z"
                style="paint-order: fill; fill: url(#gradient-ccf)" data-bx-origin="0.375014 0.499992"></path>
              <ellipse style="
                  fill: none;
                  stroke: url(#gradient-ccf);
                  stroke-width: 1.5px;
                " cx="12" cy="12" rx="10" ry="10"></ellipse>
            </svg>
            <svg v-else viewBox="0 0 24 24" class="h-9 w-9">
              <defs>
                <linearGradient id="gradient-ccf">
                  <stop offset="0" style="stop-color: rgb(var(--color-grad-start))"></stop>
                  <stop offset="0.36" style="stop-color: rgb(var(--color-grad-via))"></stop>
                  <stop offset="0.65" style="stop-color: rgb(var(--color-grad-end))"></stop>
                </linearGradient>
              </defs>
              <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
              <ellipse style="
                  fill: none;
                  stroke: url(#gradient-ccf);
                  stroke-width: 1.5px;
                " cx="12" cy="12" rx="10" ry="10"></ellipse>
              <path style="fill: url(#gradient-ccf)"
                d="M 10.263 7.19 H 11.277 V 17.19 H 10.263 A 1 1 0 0 1 9.263 16.19 V 8.19 A 1 1 0 0 1 10.263 7.19 Z"
                data-bx-shape="rect 9.263 7.19 2.014 10 1 0 0 1 1@691415ba"></path>
              <path style="fill: url(#gradient-ccf)"
                d="M 13.123 7.108 H 14.123 A 1 1 0 0 1 15.123 8.108 V 16.108 A 1 1 0 0 1 14.123 17.108 H 13.123 V 7.108 Z"
                data-bx-shape="rect 13.123 7.108 2 10 0 1 1 0 1@33f88c23"></path>
            </svg>
          </button>
          <button class="border-0 rounded-3xl h-6 w-6" @click="forward">
            <svg viewBox="2 3 20 20" fill="currentColor" class="w-5 h-5">
              <path
                d="M 8.582 14.072 C 8.297 14.072 8.015 14.014 7.753 13.899 C 7.475 13.779 7.221 13.609 7 13.398 L 7 14.629 C 7.22 14.802 7.468 14.933 7.733 15.016 C 8.043 15.109 8.365 15.153 8.688 15.148 C 8.958 15.149 9.228 15.102 9.483 15.009 C 9.729 14.922 9.954 14.783 10.144 14.601 C 10.556 14.224 10.762 13.731 10.761 13.122 C 10.761 12.693 10.651 12.329 10.429 12.03 C 10.194 11.724 9.872 11.502 9.508 11.396 L 10.732 8.983 L 10.732 8.954 L 7.049 8.954 L 7.049 10.065 L 9.064 10.065 L 8.041 12.067 L 8.041 12.098 C 8.518 12.084 8.901 12.167 9.189 12.346 C 9.466 12.502 9.634 12.805 9.624 13.13 C 9.624 13.442 9.534 13.677 9.354 13.835 C 9.174 13.994 8.916 14.073 8.582 14.072 Z M 15.606 9.075 C 15.013 8.777 14.319 8.777 13.726 9.075 C 13.432 9.23 13.177 9.452 12.979 9.724 C 12.761 10.026 12.6 10.366 12.501 10.728 C 12.276 11.559 12.276 12.438 12.501 13.269 C 12.6 13.63 12.762 13.97 12.979 14.271 C 13.177 14.544 13.432 14.766 13.726 14.922 C 14.32 15.219 15.013 15.219 15.606 14.922 C 15.9 14.766 16.156 14.544 16.354 14.271 C 16.571 13.97 16.732 13.63 16.831 13.269 C 17.056 12.438 17.056 11.559 16.831 10.728 C 16.732 10.366 16.571 10.026 16.354 9.724 C 16.156 9.452 15.9 9.23 15.606 9.075 Z M 15.51 13.474 C 15.321 13.835 15.039 14.015 14.666 14.015 C 14.287 14.015 14 13.821 13.808 13.43 C 13.628 13.105 13.537 12.629 13.538 12 C 13.539 11.372 13.635 10.879 13.827 10.521 C 14.02 10.164 14.3 9.985 14.666 9.985 C 15.026 9.985 15.304 10.166 15.5 10.531 C 15.697 10.896 15.794 11.384 15.794 12 C 15.794 12.616 15.699 13.112 15.51 13.474 Z"
                style=""></path>
              <path
                d="M 21.804 10.473 L 20.404 10.741 C 21.696 16.976 15.5 22.221 9.252 20.182 C 5.189 18.856 2.769 14.84 3.588 10.783 C 4.462 6.442 8.734 3.557 13.234 4.197 L 12.919 5.045 L 16.64 4.615 L 14.05 2.005 L 13.727 2.878 C 8.374 1.976 3.226 5.368 2.185 10.521 C 1.132 15.744 4.671 20.801 10.09 21.816 C 10.726 21.936 11.372 21.996 12.02 21.996 C 18.318 21.981 23.034 16.426 21.804 10.473 Z"
                style="" data-bx-origin="-0.49997 -0.500225"></path>
            </svg>
          </button>
        </div>
        <div class="pl-6 md:pl-12 flex-grow flex flex-row items-center">
          <div class="w-10 text-xs">
            {{ currentTimeString }}
          </div>
          <div class="flex-grow pb-1 px-2">
            <input class="progressbar" type="range" id="progressRange" name="progressRange" min="0" step="1"
              :value="currentTime" :max="totalDuration" @change="setCurrentTime" />
          </div>
          <div class="text-xs w-10 text-right">{{ duration }}</div>
        </div>
      </div>
      <div class="flex flex-row justify-end text-gray-400">
        <button v-if="extendedControls" class="mx-2" @click="muted = !muted">
          <svg v-if="!muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </button>
        <div v-if="extendedControls" class="text-xs h-5 w-10 text-center">
          <input class="volumerange" v-model="volume" min=0 max=10 type="range">
        </div>
        <button v-if="extendedControls" class="text-xs mx-5 h-5 w-12 rounded-md border-2 border-gray-800"
          @click="togglePlaybackRate">
          <div class="px-1 flex flex-row justify-center">
            {{ playbackRate }} x
          </div>
        </button>
        <button v-if="extendedControls" class="mx-2">
          <a :href="audiosrc" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
            </svg>
          </a>
        </button>
        <div class="pl-4">
          <button @click="extendedControls = !extendedControls">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>

          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { durationInSecToStr } from '~~/base/Converters';
const baseVolumeValue = 7.5;

export default defineComponent({
  props: {
    file: {
      type: String,
      default: null,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
  },
  name: 'AudioPlayer',
  setup(props, ctx) {
    const totalDuration = ref(0);
    const audiosrc = ref('');
    const playbackRate = ref(1.0);
    const muted = ref(false);
    const loaded = ref(false);
    const playing = ref(false);
    const paused = ref(true);
    const currentTime = ref(0);
    const volume = ref(baseVolumeValue);
    const audio = ref<any>(undefined);
    const extendedControls = ref(false)
    watch(volume, (newValue) => {
      audio.value.volume = newValue / 10;
      if (newValue < 0.01)
        muted.value = true;
    })
    watch(muted, (newValue) => {
      audio.value.muted = newValue;
      if (!newValue && volume.value < 0.01)
        volume.value = 1
    })
    const duration = computed(() => {
      return audio.value ? durationInSecToStr(totalDuration.value) : '0:00';
    });
    const currentTimeString = computed(() => {
      return audio.value ? durationInSecToStr(currentTime.value) : '0:00';
    });
    function setCurrentTime(e) {
      audio.value.currentTime = e.target.value;
    }
    function forward() {
      audio.value.currentTime = audio.value.currentTime + 30;
    }
    function back() {
      audio.value.currentTime = audio.value.currentTime - 30;
    }
    function stop() {
      playing.value = false;
      paused.value = true;
      audio.value.pause();
      audio.value.currentTime = 0;
    }
    function play() {
      if (playing.value && !paused.value) return;
      paused.value = false;
      audio.value.play();
      playing.value = true;
    }
    function pause(event) {
      paused.value = !paused.value;
      if (paused.value) { audio.value.pause(); }
      else {
        audio.value.play();
        ctx.emit("play")
      }
    }
    function togglePlaybackRate() {
      const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
      const index = rates.indexOf(playbackRate.value)
      playbackRate.value = rates[(index + 1) % (rates.length)]
      audio.value.playbackRate = playbackRate.value
    }
    function _handleLoaded(e) {
      if (!loaded.value && audio.value.readyState >= 1 || preload.value == null) {
        if (props.autoPlay) this.play();
        loaded.value = true;
        totalDuration.value = audio.value.duration;
      }
    }
    function _handlePlayingUI(e) {
      currentTime.value = parseInt(audio.value.currentTime);
    }
    const preload = ref(null)
    onMounted(() => {
      audio.value.addEventListener('timeupdate', _handlePlayingUI);
      audio.value.addEventListener('loadeddata', _handleLoaded);
      audio.value.addEventListener('loadedmetadata', _handleLoaded);
      audio.value.addEventListener('durationchange', _handleLoaded);
      audio.value.addEventListener('canplay', _handleLoaded);
      preload.value = (isIOSDevice() ? null : "metadata")
      audiosrc.value = props.file;
    });
    onBeforeUnmount(() => {
      audio.value.removeEventListener('timeupdate', _handlePlayingUI);
      audio.value.removeEventListener('loadeddata', _handleLoaded);
      audio.value.removeEventListener('loadedmetadata', _handleLoaded);
      audio.value.removeEventListener('durationchange', _handleLoaded);
      audio.value.removeEventListener('canplay', _handleLoaded);

    });
    function isIOSDevice() {
      const isIos = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      return isIos
    }
    return {
      pause,
      forward,
      back,
      audiosrc,
      setCurrentTime,
      duration,
      currentTimeString,
      playbackRate,
      togglePlaybackRate,
      muted,
      loaded,
      playing,
      paused,
      volume,
      currentTime,
      audio,
      preload,
      totalDuration,
      extendedControls,
    };
  },
});
</script>

