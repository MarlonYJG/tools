<template>
    <div :class="loading ? 'showOn' : 'showBlock'" v-loading="loading" class="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.4)">
    </div>
</template>
<script>
    export default {
        data(){
            return {
                ifShow: false,
            }
        },
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang='scss' scoped>
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
    }
    .showOn{
        display: block;
    }
    .showBlock{
        display: none;
    }
</style>