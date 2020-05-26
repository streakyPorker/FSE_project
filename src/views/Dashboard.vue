<template>

  <div class="homepage">
    <v-layout row wrap>
      <v-flex xs8 offset-xs2 class="radius">
        <v-carousel class="radius">
          <v-carousel-item
            v-for="(item,i) in slides"
            :key="i"
            :src="item.src"
            @click.native="item.func"
          >
          <div class="disc">
            {{item.discription}}
          </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </div>

</template>

<script>
// @ is an alias to /src


export default {
  data() {
    return {
      slides: [
        {
          src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587111182804&di=6f7e995d9689a114af415224d5c9827b&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20200329%2Febdc6faa5a13495b9a2ba622e057103c.jpeg',
          func:()=>{
              window.location.href="http://www.zju.edu.cn/" 
          },
          discription:"浙大官网友情链接",

        },

        {
          src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587111182804&di=6f7e995d9689a114af415224d5c9827b&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20200329%2Febdc6faa5a13495b9a2ba622e057103c.jpeg',
          func:()=>{
            window.location.href='https://www.bilibili.com/video/av75040912/'
          },
          discription:"浙江大学招生宣传片《你的名字》",
        }
        
      ],
      value:0,


    };
  },


};
</script>

<style scoped >
  .disc{
    position:absolute;
    bottom: 50px;
    width: 100%;
    text-align: center;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 1.5em;
    padding: 15px;
  }

  .radius{
    border-radius: 20px;
  }
</style>