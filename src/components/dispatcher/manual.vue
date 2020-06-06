<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex xs12>
          <h2 class="#40C4FF--text">请输入您想要发布疫情数据的城市，您可以不输入此对话框来发布全省信息</h2>
        </v-flex>
      </v-layout>
      <v-text-field
          label="请输入城市名称以更新此城市具体数据"
          single-line
          outlined
        ></v-text-field>
      <v-layout row>
        <v-flex xs12>
          <h2 class="#40C4FF--text">请输入与疫情有关的各项数据</h2>
        </v-flex>
      </v-layout>
      <v-row>

        <v-col cols="12" sm="6">
          <v-text-field
            label="新增确诊"
            single-line
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="新增疑似"
            single-line
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="新增死亡"
            single-line
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="新增无症状感染"
            single-line
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="新增治愈"
            single-line
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="新增境外输入"
            single-line
            outlined
          ></v-text-field>
        </v-col>
        <v-btn height="20" width="525" text disabled></v-btn>
        <v-btn height="40" width="125" color="#D1C4E9" class="#FFFFFF-text">
            确认
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    dropdown_font: ['Arial', 'Calibri', 'Courier', 'Verdana']
  })
}
</script>
