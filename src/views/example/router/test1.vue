<template>
    <div class="span1 center">
        <text>路由内容test1</text>
        <text>传入的路由参数： {{$route.params.id}}</text>
    </div>
</template>
<style lang="scss" src="src/css/buiweex.scss"></style>


<script>
    const globalEvent = weex.requireModule('globalEvent');

    module.exports = {
        mounted: function () {
            globalEvent.addEventListener("androidback",(e)=> {
                this.$pop();
            });
        }
    }
</script>

