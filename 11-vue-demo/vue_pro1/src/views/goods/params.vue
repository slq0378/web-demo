<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-alert show-icon title="只允许第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
        <el-row class="select">
            <el-col>
                <span class="">选择商品分类：</span>
                <el-cascader v-model="selectedKeys" :options="cateList" :props="cateProps" @change="cateChange"></el-cascader>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="动态参数" name="many">
                <!-- 动态参数 -->
                <el-button type="primary" :disabled="disableButton" @click="addDialogVisible = true">添加参数</el-button>
                <el-table :data="manyTableData" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag closable v-for="(subTitle,index) in scope.row.attr_vals" :key="index" @close="removeTag(scope.row,index)">{{subTitle}}</el-tag>
                            <el-input v-if="scope.row.showInputTag" v-model="scope.row.inputValue" class="input-tag" @blur="inputConfirm(scope.row)" @keydown.enter.native="inputConfirm(scope.row)"></el-input>
                            <el-button size="small" v-else @click="scope.row.showInputTag = true">+ new tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <!-- 静态参数 -->
                <el-button type="primary" :disabled="disableButton" @click="addDialogVisible = true">添加属性</el-button>
                <el-table :data="onlyTableData" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag closable v-for="(subTitle,index) in scope.row.attr_vals" :key="index" @close="removeTag(scope.row,index)">{{subTitle}}</el-tag>
                            <el-input v-if="scope.row.showInputTag" v-model="scope.row.inputValue" class="input-tag" @blur="inputConfirm(scope.row)" @keydown.enter.native="inputConfirm(scope.row)"></el-input>
                            <el-button size="small" v-else @click="scope.row.showInputTag = true">+ new tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <el-dialog :title="'添加'+ titleText" :visible.sync="addDialogVisible" width="50%" @close="addParamClose">
        <el-form :model="addParamForm" :rules="addParamFormRules" ref="addParamFormRef" label-width="80px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addParamForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParamConfirm">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑参数" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editParamForm" :rules="editParamFormRules" ref="editParamFormRef" label-width="80px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editParamForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParamConfirm">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                type: "3", // 值：1，2，3 分别表示显示一层二层三层分类列表,默认3
            },
            total: 0,
            cateList: [
                //     {
                //     cat_deleted: false,
                //     cat_id: 1335,
                //     cat_level: 0,
                //     cat_name: '智能设备',
                //     cat_pid: 0
                // }
            ],
            paramsList: [
                //     {
                //     "attr_id": 1,
                //     "attr_name": "cpu",
                //     "cat_id": 22,
                //     "attr_sel": "only",
                //     "attr_write": "manual",
                //     "attr_vals": "ffff"
                // }
            ],
            cateProps: {
                expandTrigger: "hover",
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },
            selectedKeys: [], // 选中数组
            selectCateId: "",
            // 添加
            addDialogVisible: false,
            addParamForm: {
                attr_name: "",
            },
            addParamFormRules: {
                attr_name: [{
                    required: true,
                    message: "请输入参数名称",
                }, ],
            },
            activeName: 'many',
            manyTableData: [],
            onlyTableData: [],
            selectedEditRole: false,
            selectedEditRole: {},
            // 编辑
            editDialogVisible: false,
            editParamForm: {
                attr_name: "",
            },
            editParamFormRules: {
                attr_name: [{
                    required: true,
                    message: "请输入参数名称",
                }, ],
            }
        }
    },
    created() {
        this.getCateList()
    },
    computed: {
        disableButton() {
            if (this.selectedKeys.length !== 3) {
                return true
            }
            return false
        },
        titleText() {
            if (this.activeName == 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        }
    },
    methods: {
        async getCateList() {
            // 请求分类列表
            const {
                data: res
            } = await this.$http.get("categories", {
                params: this.queryInfo,
            })
            console.log("cateList", res)
            if (res.meta.status !== 200) {
                return this.$message.error("请求分类列表失败")
            }
            this.$message.success("请分类列表成功")
            this.total = res.data.total
            // this.queryInfo.pagenum = res.data.pagenum
            this.cateList = res.data
            // if (res.data.length > 0) {
            //     // this.getParamsList(res.data[0].cat_id)
            //     this.children1 = res.data[0].children
            // }
        },
        // 请求参数列表
        async getParamsList() {
            const {
                data: res
            } = await this.$http.get(
                `categories/${this.selectCateId}/attributes`, {
                    params: {
                        sel: this.activeName, //only many
                    },
                }
            )
            console.log("attributes", res)
            if (res.meta.status !== 200) {
                return this.$message.error("请求参数列表失败")
            }
            this.$message.success("请求参数列表成功")
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 文本框输入值
                item.showInputTag = false
                item.inputValue = ''
            })
            if (this.activeName == 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
        },
        async clickParamsItem(row) {
            console.log("clickCate", row)
            const {
                data: res
            } = await this.$http.get(
                `categories/${this.selectCateId}/attributes/${row.attr_id}`, {
                    params: {
                        attr_sel: "only", //only many
                        attr_vals: "",
                    },
                }
            )
            console.log("attributes222", res)
            if (res.meta.status !== 200) {
                return this.$message.error("请求参数列表失败")
            }
            this.$message.success("请求参数列表成功")
            this.paramDetail = res.data

        },
        cateChange(value) {
            console.log("cateChange", value)
            if (value.length > 2) {
                this.selectCateId = value[value.length - 1]
                this.getParamsList()
            } else {
                this.selectedKeys = []
                this.manyTableData = []
                this.onlyTableData = []
            }
        },
        async editRole(role) {
            this.selectedEditRole = role

            const {
                data: res
            } = await this.$http.get(`categories/${this.selectCateId}/attributes/${role.attr_id}`, {
                attr_sel: this.activeName
            })
            console.log('editRole', res)
            if (res.meta.status !== 200) {
                this.$message('查询参数失败！')
                return
            }
            this.$message({
                type: 'success',
                message: '查询参数成功!'
            })
            this.editParamForm = res.data

            this.editDialogVisible = true

        },
        // 删除参数
        async deleteRole(role) {
            console.log('role', role)
            const deleteResult = await this.$confirm(
                "此操作将永久删除该参数, 是否继续?",
                "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch(() => {})
            if (deleteResult === "confirm") {
                const {
                    data: res
                } = await this.$http.delete(
                    `categories/${this.selectCateId}/attributes/${role.attr_id}`
                )
                console.log("delete", res)
                if (res.meta.status !== 200) {
                    this.$message("删除参数失败！")
                    return
                }
                this.$message({
                    type: "success",
                    message: "删除参数成功!",
                })
                this.getParamsList()
            }
        },
        // 添加参数
        addParams() {
            console.log("this.selectCateId", this.selectCateId)
            this.addDialogVisible = true
        },
        addParamClose() {
            this.$refs.addParamFormRef.resetFields()
        },
        addParamConfirm() {
            // this.dialogVisible = false
            const vm = this
            this.$refs.addParamFormRef.validate(async (valid) => {
                if (!valid) return
                // 添加参数
                const {
                    data: res
                } = await this.$http.post(
                    `categories/${this.selectCateId}/attributes`, {
                        attr_name: this.addParamForm.attr_name,
                        attr_sel: this.activeName
                    }
                )
                console.log(res)
                if (res.meta.status !== 201) {
                    this.$message.error("添加参数失败！")
                    return
                }
                this.$message.success("添加参数成功！")
                this.addDialogVisible = false

                this.getParamsList()
                this.addParamForm.attr_name = ""
            })
        },
        // tabClick
        tabClick() {
            console.log('tabClick', this.activeName);
            if (this.selectedKeys.length > 2) {
                this.getParamsList()
            } else {
                this.manyTableData = []
                this.onlyTableData = []
            }
        },
        //编辑
        editParams() {
            console.log("this.selectCateId", this.selectCateId)
            this.addDialogVisible = true
        },
        editDialogClose() {
            this.$refs.editParamFormRef.resetFields()
        },
        editParamConfirm() {
            // this.dialogVisible = false
            const vm = this
            this.$refs.editParamFormRef.validate(async (valid) => {
                if (!valid) return
                // 添加参数
                const {
                    data: res
                } = await this.$http.put(
                    `categories/${this.selectCateId}/attributes/${this.editParamForm.attr_id}`, {
                        attr_name: this.editParamForm.attr_name,
                        attr_sel: this.activeName
                    }
                )
                console.log(res)
                if (res.meta.status !== 200) {
                    this.$message.error("添加参数失败！")
                    return
                }
                this.$message.success("添加参数成功！")

                this.getParamsList()
                this.editParamForm.attr_name = ""
                this.editDialogVisible = false
            })
        },
        // 删除参数
        removeTag(item, index) {
            console.log('removeTag', item, index);
            item.attr_vals.splice(index, 1)
            this.saveAttr(item)
        },
        // 添加标签
        async inputConfirm(item) {
            if (item.inputValue.trim().length === 0) {
                item.inputValue = ''
                item.showInputTag = false
                return
            }
            console.log('inputConfirm', item);
            // 
            item.attr_vals.push(item.inputValue.trim())

            this.saveAttr(item)
        },
        async saveAttr(item) {
            // 添加参数
            const {
                data: res
            } = await this.$http.put(
                `categories/${this.selectCateId}/attributes/${item.attr_id}`, {
                    attr_name: item.attr_name,
                    attr_sel: this.activeName,
                    attr_vals: item.attr_vals.join(' ')
                }
            )
            console.log('saveAttr', res)
            if (res.meta.status !== 200) {
                this.$message.error("修改过参数失败！")
                return
            }
            this.$message.success("修改参数成功！")
        }
    },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
}

.box-card {}

.select {
    margin-top: 15px;
}

.select span {
    line-height: 40px;
}

.select .el-cascader {
    width: 50%;
}

.el-table {

    .el-tag,
    .el-button,
    .el-input {
        margin: 5px 10px;
    }

}

.el-tab-pane>.el-button {
    margin-bottom: 15px;
}

.input-tag {
    width: 120px;
}
</style>
