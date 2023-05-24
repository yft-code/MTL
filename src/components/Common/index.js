import Vue from 'vue'
import SelfCascader from './SelfCascader.vue'
import SelfDialog from './SelfDialog.vue'
import SelfFormItem from './SelfFormItem.vue'
import SelfRichEditor from './SelfRichEditor.vue'
import SelfTable from './SelfTable.vue'
import SelfConfirm from './SelfConfirm.vue'
import SelfPopo from './SelfPopo.vue'
import SelfPictureShow from './SelfPictureShow.vue'
import SelfPersonSelect from './SelfPersonSelect.vue'
import PictureView from './PictureView.vue'

const ConfirmBox = Vue.extend(SelfConfirm);

const common = {
    install: function (Vue) {
        Vue.component('SelfCascader', SelfCascader);
        Vue.component('SelfDialog', SelfDialog);
        Vue.component('SelfFormItem', SelfFormItem);
        Vue.component('SelfRichEditor', SelfRichEditor);
        Vue.component('SelfTable', SelfTable);
        Vue.component('SelfPopo', SelfPopo);
        Vue.component('SelfPictureShow', SelfPictureShow);
        Vue.component('SelfPersonSelect', SelfPersonSelect);
        Vue.component('PictureView', PictureView);
        Vue.prototype.$selfConfirm = common.confirmMethod
    }
}

common.confirmMethod = function (content, title, options) {
    if (title === undefined) {
        title = '';
    }
    options = Object.assign({
        title: title,
        content: content,
    }, options);
    let instance = new ConfirmBox({
        data: options
    }).$mount();
    document.body.appendChild(instance.$el);
    return instance.confirm();
}

export default common;