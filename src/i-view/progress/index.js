Component({
    externalClasses: ['i-class'],

    properties: {
        percent: {
            type: Number,
            value: 0
        },
        color: {
          type: String,
          value: '#2db7f5'
        },
        // normal || active || wrong || success
        status: {
            type: String,
            value: 'normal'
        },
        strokeWidth: {
            type: Number,
            value: 10
        },
        hideInfo: {
            type: Boolean,
            value: false
        }
    }
});
