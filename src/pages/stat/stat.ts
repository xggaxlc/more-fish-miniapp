import { observer, statStore, userStore } from '@store';
import { pullDownRefresh, autoLoading, sleep } from '@utils';
import * as dayjs from 'dayjs';
const echarts = require('../../components/ec-canvas/echarts');

function echartInit(data = []) {
  return (canvas, width, height) => {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });

    const option = {
      backgroundColor: "#ffffff",
      color: data.map(item => item.color),
      series: [{
        label: {
          formatter: [
            '{a|{b}}',
            '{a|{d}%}'
          ].join('\n'),
          rich: {
            a: {
              color: '#666666',
              lineHeight: 16,
              fontSize: 12
            },
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 25,
          smooth: false
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['50%', '70%'],
        data: data.map(item => {
          const name = item._id;
          return {
            value: item.amount,
            name: name.length > 4 ? name.slice(0, 4) + '...' : name
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
}


observer({

  _needCurrentBookId: true,

  props: {
    statStore,
    userStore
  },

  data: {
    ec: {
      lazyLoad: true
    }
  },

  onLoad() {
    return this.fetchData();
  },

  async fetchData() {
    await statStore.fetchData();
    sleep(100).then(() => this.selectComponent('#canvas-pie').init(echartInit(statStore.data)));
  },

  toggleMode(e) {
    const yearMode = e.currentTarget.dataset.mode === 'year';
    if (yearMode !== statStore.form.yearMode) {
      statStore.updateForm({ yearMode });
      autoLoading(this.fetchData());
    }
  },

  handleDateChange(e) {
    const value = e.detail.value;
    const $time = statStore.form.yearMode ? dayjs().set('year', value) : dayjs(value);
    const { year: formYear, month: formMonth } = statStore.form;
    const year = $time.year();
    const month = $time.month();
    if (year !== formYear || month !== formMonth) {
      statStore.updateForm({ year, month });
      autoLoading(this.fetchData());
    }
  },

  onPullDownRefresh() {
    return pullDownRefresh(this.fetchData());
  },
});
