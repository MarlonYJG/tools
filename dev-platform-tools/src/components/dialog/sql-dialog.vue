<!--
 * @Author: Marlon
 * @Date: 2020-02-23 22:01:59
 * @LastEditors: Marlon
 * @LastEditTime: 2020-06-15 16:55:02
 * @Description: sql编辑组件
 -->
 <template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
    <textarea ref="mycode" class="codesql" v-model="code" style="height:200px;width:600px;"></textarea>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
 
 <script>
// import * as monaco from "monaco-editor";
import sqlFormatter from "sql-formatter";
// import MonacoEditor from "vue-monaco-editor";
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");

export default {
  name: "sqlEditor",
  components: {
    // MonacoEditor
  },
  data() {
    return {
      dialogVisible: false,
      code: "//按Ctrl键进行代码提示",
      options: {
        selectOnLineNumbers: false
      }
    };
  },
  methods: {
    initEditor() {
      let _this = this;
      _this.$refs.sqlContainer.innerHTML = "";
      //   _this.monacoEditor = monaco.editor.create(_this.$refs.sqlContainer, {
      //     value: "113",
      //     language: "sql",
      //     wrappingColumn: 0,
      //     wrappingIndent: "indent",
      //     autoIndent: true,
      //     folding: true,
      //     foldingStrategy: "indentation",
      //     minimap: {
      //       enabled: false
      //     }
      //   });
      //   _this.monacoEditor.onDidChangeModelContent(function(event) {
      //     console.log(_this.monacoEditor.getValue());
      //   });
      //
    },
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange(editor) {
      console.log(editor.getValue());
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs);
      let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: "text/x-sql", //选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        theme: "ambiance",
        lineWrapping: true,
        autofocus: true,
        extraKeys: { Ctrl: "autocomplete" }, //自定义快捷键
        // readOnly:true,
        undoDepth: 2000000,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers"
        ],
        foldGutter: true, // 启用行槽中的代码折叠
        autoCloseBrackets: true // 自动闭合符号
        // styleActiveLine: true // 显示选中行的样式
        // hintOptions: {
        //   //自定义提示选项
        //   tables: {
        //     users: ["name", "score", "birthDate"],
        //     countries: ["name", "population", "size"]
        //   }
        // }
      });
      console.log(CodeMirror.modes, CodeMirror.mimeModes);
      //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on("cursorActivity", function() {
        editor.showHint();
      });
    });
  }
};
</script>
 
 <style>
</style>
