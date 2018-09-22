import { observer, statStore } from '@store';
import * as echarts from '../../components/ec-canvas/echarts';

observer({

  _needCurrentBookId: true,

  props: {
    statStore
  },

  data: {
    ec: {}
  },

  onLoad() {
    return statStore.getBudgetGroupByMonth();
  },

  async echartInit(e) {
    const { canvas, width, height } = e.detail;

    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);

    var option = {
      backgroundColor: "#ffffff",
      color: statStore.data.map(item => item.color),
      series: [{
        label: {
          normal: {
            formatter: '{b}: ({d}%)',
            fontSize: 12
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['30%', '45%'],
        data: statStore.data.map(item => {
          return {
            value: item.amount,
            name: item._id
          }
        }),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)'
          }
        }
      }]
    };

    chart.setOption(option);
    return chart;
  }
});
