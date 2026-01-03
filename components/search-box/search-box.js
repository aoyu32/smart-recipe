// components/search-box/search-box.js
Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '搜索食谱或食物'
    },
    buttonText: {
      type: String,
      value: '搜索'
    }
  },
  methods: {
    onInput(e) {
      const v = e.detail.value;
      this.triggerEvent('input', { value: v });
    },
    onConfirm() {
      this.triggerEvent('confirm', {});
    },
    onTapSearch() {
      this.triggerEvent('tapSearch', {});
    }
  }
});

