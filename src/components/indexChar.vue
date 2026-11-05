<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-sm">交易统计</span>
        <div class="flex items-center">
          <el-check-tag v-for="(item,index) in option" :key="index" :checked="current==item.value" style="margin-right: 8px;" @click="handle(item.value)">
            {{item.text}}
          </el-check-tag>
        
        </div>
      </div>
    </template>
    <div ref="el" id="chart" style="width: 100%;height: 300px;">
      
    </div>
  </el-card>
</template>
<script setup>
import { ref,onMounted,onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getStatistics3 } from '@/api/index.js'
import {useResizeObserver} from '@vueuse/core'


const current=ref("week")
const option = [{
  text:"近一个月",
  value:"month"
},{
  text:"近一周",
  value:"week"
},{
  text:"近24小时",
  value:"hour"
}]
const handle=(type)=>{
  current.value=type
  getData()
}
var mychart=null
onMounted(()=>{
  var chartDom=document.getElementById("chart");
  mychart=new echarts.init(chartDom);
  getData()
})
onBeforeUnmount(()=>{
  if (mychart) {
    echarts.dispose(mychart)
  }
 })
function getData(){
  let option={
  xAxis: {
    type:"category",
    data:[]
  },
  yAxis: {
    type:"value"
  },
  series: [
    {
      type:"bar",
      data:[],
      showBackground:true,
      backgroundStyle:{
        color:'rgba(0,0,0,0.05)'
      }
    }
  ]
};

  mychart.showLoading()
  getStatistics3(current.value).then(res=>{
    option.xAxis.data=res.x
    option.series[0].data=res.y
    mychart.setOption(option)
  }).finally(()=>{
    mychart.hideLoading()
  })

}
const el = ref(null) 
useResizeObserver(el,(entries)=>{
  mychart && mychart.resize()
})
</script>

