<template>
    <div class="container--small">
        <ul class="tab">
            <li 
                class="tab__item"
                @click="tab = 1"
            >ログイン
            </li>
            <li
                class="tab__item"
                @click="tab = 2"
            >新規登録</li>
        </ul>
        {{ tab }}
    </div>
</template>

<script>
export default {
    data () {
        return {
            tab: 1
        }
    }
}
</script>