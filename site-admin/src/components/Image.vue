<template>
  <div class=" app-img ">
    <div
      v-if="dataUrl"
      :style="{ background }"
      class=" app-img__placeholder "
    >
      <img v-lazy="placeholder || dataUrl" alt="" v-bind="$attrs" />
    </div>
    <img
      v-lazy="dataUrl"
      :alt="$attrs.alt || ''"
      v-bind="$attrs"
      class=" app-img__img "
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    src: {
      type: String,
      required: true,
    },
    placeholder: String,
    background: String,
  },

  computed: {
    dataUrl() {
      const { width, height } = this.$attrs
      if (!width || !height) return ""

      // create a tiny png with matching aspect ratio as img
      const w = 100
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = (height / width) * w

      return canvas.toDataURL()
    },
  },

  mounted() {
    const { src, srcset, $el } = this
    let timeOut

    const observer = new IntersectionObserver(([entry]) => {
      const img = $el.querySelector(`.app-img__img`)
      const placeholder = $el.querySelector(`.app-img__placeholder`)

      img.onload = function() {
        delete img.onload
        $el.classList.add(`app-img--loaded`)
        if (placeholder) {
          timeOut = setTimeout(() => {
            placeholder.remove()
          }, 300)
        }
      }
      if (entry.isIntersecting) {
        // Element is in viewport
        if (!!srcset) {
          img.srcset = srcset
        }
        img.src = src
        observer.disconnect()
      }
    })
    observer.observe($el)

    this.$once("hook:beforeDestroy", () => {
      observer.disconnect()
      if (timeOut) {
        clearTimeout(timeOut)
      }
    })
  },
}
</script>

<style>
.app-img {
  display: inline-block;
  position: relative;
}

.app-img__placeholder {
  position: absolute;
  overflow: hidden;
  width: 100%;
}

.app-img__placeholder img {
  transform: scale(1.05);
  filter: blur(10px);
}

.app-img__img {
  opacity: 0;
  transition: opacity 300ms ease;
}

.app-img--loaded .app-img__img {
  opacity: 1;
}
</style>