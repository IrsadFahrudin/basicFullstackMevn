<template>
    <p>Copyright {{ year }}</p>
</template>

<script>
export default{
    data() {
        return {
            year : 0,
        }
    },
    created() {
        this.year = new Date().getFullYear()
    },
    method:{
    },
}
</script>