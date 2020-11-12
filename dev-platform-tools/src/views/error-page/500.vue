<!--
 * @Author: Marlon
 * @Date: 2020-07-10 09:14:01
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-10 09:19:26
 * @Description: 
--> 
<template>
  <error-content code="500" desc="Oh~~鬼知道服务器经历了什么~" :src="src"/>
</template>

<script>
import error404 from '@/assets/img/error-page/error-500.svg'
import errorContent from './error-content.vue'
export default {
  name: 'error_500',
  components: {
    errorContent
  },
  data () {
    return {
      src: error404
    }
  }
}
</script>
