<template>
    <div>
        <quill-editor 
            class="rich-editor" 
            ref="myTextEditor" 
            v-model="editValue" 
            :options="editorOption" 
            :config="editorOption"
        />
    </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
    components: {
        quillEditor
    },
    props: {
        value: {
            required: true,
            type: String,
        },
        placeholder: {},
        canUploadPic: Boolean,
    },
    computed: {
        editValue: {
            get: function() {
                return this.value;
            },
            set: function(val) {
                this.$emit("update:value", val);
            }
        }
    },
    data() {
        return {
            //富文本配置数据
            editorOption: {
                placeholder: this.placeholder || "",
                modules: {
                    toolbar: [
                        [
                            { 'size': ['small', false, 'large', 'huge'] },
                            { 'color': [] },
                            { 'background': [] },
                            'bold',
                            'italic',
                            'underline',
                            'strike',
                            { 'indent': '-1' },
                            { 'indent': '+1' },
                            { 'align': [] },
                            { 'list': 'ordered' },
                            { 'list': 'bullet' },
                            'code-block',
                            'clean',
                            'link',
                            this.canUploadPic ? 'image':'',
                        ],
                    ]
                }
            },
        }
    },
    created() {

    },
    methods: {

    }
}
</script>
<style lang="less">
.rich-editor .ql-editor {
    min-height: 120px !important;
    max-height: 400px;
}

.rich-editor .ql-toolbar {
    height: 2.5rem;
    line-height: 1rem;
}

.rich-editor .ql-editor.ql-blank::before {
    font-style: normal;
    color: #C0C4CC;
}
</style>
