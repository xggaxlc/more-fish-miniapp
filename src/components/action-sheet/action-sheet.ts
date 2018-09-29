Component({
  options: {
    multipleSlots: true
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(val) {
        const event = val ? 'show' : 'hide';
        this.triggerEvent(event);
      }
    },
    mask: {
      type: Boolean,
      value: true
    },
    height: {
      type: String,
      value: 'auto'
    }
  },

  methods: {
    preventScroll() { /* 阻止滚动穿透 */ },
    handleClose() {
      this.triggerEvent('close');
    }
  }
});
