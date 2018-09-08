Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    color: [
      '#FF8308',
      '#A45CA1',
      '#76C398',
      '#F6BCB3',
      '#23709B',
      '#FABF44',
      '#9F72EF',
      '#D1D800',
      '#EC4497',
      '#CCDE6B',
      '#6BBFDF',
      '#6470B4',
      '#36AC37',
      '#D77A71',
      '#FFF600',
      '#53CCF9'
    ]
  },
  methods: {
    handleCancel() {
      this.triggerEvent('cancel');
    },
    handleSelect(e) {
      const color = e.currentTarget.dataset.color;
      this.triggerEvent('ok', { color });
    }
  }
});
