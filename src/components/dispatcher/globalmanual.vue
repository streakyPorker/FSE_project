<template>
    <v-container fluid>
      <v-layout row>
        <h2 class="#40C4FF--text">点击此对话框以选择您想要发布疫情数据的省份</h2>
      </v-layout>
      <v-row
        align="center"
      >
        <v-col cols="12" sm="6">
          <v-select
            :items="items"
            attach
            label="点击选择您想要更新的省份"
            height="50"
            editable
          ></v-select>
          <v-layout row>
            <h2 class="#40C4FF--text">输入其他国家名称以发布该国家的疫情数据</h2>
          </v-layout>
          <v-text-field
            label="请输入您想要发布的其他国家的名称"
            single-line
            outlined
          ></v-text-field>
        </v-col>
        <v-text-field
          label="请输入城市名称以更新此城市具体数据，针对各省或其他国家的数据在发布时可不填写"
          single-line
          outlined
        ></v-text-field>
      </v-row>
      <v-layout row>
        <v-flex xs12>
          <h2 class="#40C4FF--text">请输入上述地区今日的以下几项疫情数据</h2>
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
        <v-btn height="20" width="770" text disabled></v-btn>
        <v-btn height="40" width="150" color="#D1C4E9" class="#FFFFFF--text">
          确认
        </v-btn>
      </v-row>
    </v-container>
</template>

<script>
export default {
  data: () => ({
    items: ['全国总体疫情数据', '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'],
    value: ['全国总体疫情数据', '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
  })
}
</script>
