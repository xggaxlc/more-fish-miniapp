import './avatar.scss';

Component({
  properties: {
    url: {
      type: String,
      value: ''
    },
    size: {
      type: Number,
      value: 120
    },
    showClose: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    handlePreview() {
      const current = this.properties.url;
      wx.previewImage({ urls: [current], current });
    },

    handleClose() {
      this.triggerEvent('close');
    }
  }
});
