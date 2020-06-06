<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1></v-flex>

      <v-flex xs12>
        <h2 class="#40C4FF--text">请输入您想要发布疫情数据的城市，您可以不输入此对话框来发布全省信息</h2>
      </v-flex>
    </v-layout>
    <v-text-field label="请输入城市名称以更新此城市具体数据" single-line outlined></v-text-field>
    <v-layout row>
      <v-flex xs12>
        <h2 class="#40C4FF--text">请选择您想要爬取最新数据的时间</h2>
      </v-flex>
    </v-layout>
    <v-time-picker headed color="#D1C4E9"></v-time-picker>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
