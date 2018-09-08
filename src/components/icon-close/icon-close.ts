Component({
  properties: {
    icon: {
      type: String,
      value: '/images/icon-remove-red.png'
    },
    iconSize: {
      type: Number,
      value: 28
    }
  },
  methods: {
    handleClose() {
      this.triggerEvent('close');
    }
  }
});
