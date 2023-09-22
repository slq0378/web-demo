<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col>
                <el-button type="primary" @click="addCateClick">
                    添加分类
                </el-button>
            </el-col>
        </el-row>
        <zk-table ref="tableRef" border :data="cateList" :columns="columns" show-index :selection-type="false" :expand-type="false">
            <template slot="isOK" scope="scope">
                <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color: #409eff"></i>
                <i v-else class="el-icon-error" style="color: red"></i>
            </template>
            <template slot="sort" scope="scope">
                <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
            <template slot="opt" scope="scope">
                <el-button type="primary" class="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
                <el-button type="danger" class="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
            </template>
        </zk-table>
        <el-pagination @size-change="handleSizeChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCateClose">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <el-cascader v-model="selectedKeys" clearable :options="parentCateList" :props="cateProps" @change="parentCateChange">
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateConfirm">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
            <el-form-item label="分类名称">
                <el-input readonly v-model="selectedEditCate.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="新分类名称" prop="cat_name">
                <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                type: '', // 值：1，2，3 分别表示显示一层二层三层分类列表,默认3
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            cateList: [{
                cat_deleted: false,
                cat_id: 1335,
                cat_level: 0,
                cat_name: '智能设备',
                cat_pid: 0
            }],
            columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template', // 使用自定义模板
                    template: 'isOK'
                },
                {
                    label: '排序',
                    type: 'template', // 使用自定义模板
                    template: 'sort'
                },
                {
                    label: '操作',
                    type: 'template', // 使用自定义模板
                    template: 'opt'
                }
            ],
            addDialogVisible: false,
            editDialogVisible: false,
            // 添加分类
            addCateForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            addCateFormRules: {
                cat_name: [{
                    required: true,
                    message: '请输入分类名称'
                }]
            },
            parentCateList: [{
                cat_deleted: false,
                cat_id: 1335,
                cat_level: 0,
                cat_name: '智能设备',
                cat_pid: 0
            }],
            cateProps: {
                expandTrigger: 'hover',
                checkStrictly: true,
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            selectedKeys: [], // 选中数组
            // 编辑分类
            selectedEditCate: {},
            editCateForm: {
                cat_name: ''
            },
            editCateFormRules: {
                cat_name: [{
                    required: true,
                    message: '请输入分类名称'
                }]
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            // 请求分类列表
            const {
                data: res
            } = await this.$http.get('categories', {
                params: this.queryInfo
            })
            console.log('cateList', res)
            if (res.meta.status !== 200) {
                return this.$message.error('请求商品列表失败')
            }
            this.total = res.data.total
            // this.queryInfo.pagenum = res.data.pagenum
            this.cateList = res.data.result
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newPage) {
            console.log(`当前页: ${newPage}`)
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },

        // 删除分类
        async deleteCate(item) {
            console.log('deleteCate', item)
            const deleteResult = await this.$confirm(
                '此操作将永久删除该分类, 是否继续?',
                '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(() => {})
            if (deleteResult === 'confirm') {
                const {
                    data: res
                } = await this.$http.delete(
                    'categories/' + item.cat_id
                )
                if (res.meta.status !== 200) {
                    this.$message('删除分类失败！')
                    return
                }
                this.$message({
                    type: 'success',
                    message: '删除分类成功!'
                })
                this.getCateList()
            }
        },
        // 添加分类
        addCateClick() {
            this.getParentCateList()
            this.addDialogVisible = true
        },
        addCateClose() {
            this.$refs.addCateFormRef.resetFields()
        },
        addCateConfirm() {
            // this.dialogVisible = false
            const vm = this
            this.$refs.addCateFormRef.validate(async (valid) => {
                if (!valid) return
                // 添加分类
                const {
                    data: res
                } = await this.$http.post('categories', this.addCateForm)
                console.log(res);
                if (res.meta.status !== 201) {
                    this.$message.error('添加分类失败！')
                    return
                }
                this.$message.success('添加分类成功！')
                this.addDialogVisible = false
                this.getParentCateList()
                this.getCateList()

                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_name = ''
                this.selectedKeys = []
            })
        },
        parentCateChange(value) {
            console.log('parentCateChange', value);
            if (this.selectedKeys.length > 0) {
                // parentid
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
            console.log(this.addCateForm);
        },
        // 获取父级分类
        async getParentCateList() {
            console.log('getParentCateList');
            const {
                data: res
            } = await this.$http.get(
                'categories', {
                    params: {
                        type: '2'
                    }
                }
            )
            console.log('parentcate', res);
            if (res.meta.status !== 200) {
                this.$message('获取父级分类失败！')
                return
            }
            this.$message({
                type: 'success',
                message: '获取父级分类成功!'
            })
            this.parentCateList = res.data
        },
        // 编辑分类
        editCate(item) {
            console.log('editCate', item)
            this.selectedEditCate = item
            this.editDialogVisible = true
        },
        editDialogClose() {
            this.selectedEditCate = {}
             this.editCateForm.cat_name = ''
        },
        editConfirm() {
            console.log(this.editCateForm);
            const vm = this
            this.$refs.editCateFormRef.validate(async (valid) => {
                if (!valid) return
                const {
                    data: res
                } = await this.$http.put('categories/' + this.selectedEditCate.cat_id, this.editCateForm)
                console.log('编辑分类:', res);
                if (res.meta.status !== 200) {
                    this.$message.error('编辑分类失败！')
                    return
                }
                this.$message.success('编辑分类成功！')
                this.getCateList()
                this.editDialogVisible = false
                this.selectedEditCate = {}
                this.editCateForm.cat_name = ''
            })
        },

    }
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

.box-card {
    .el-table {
        margin-top: 15px;
    }

    .el-pagination {
        margin-top: 15px;
    }
}

.zk-table {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}

.el-icon-edit::before,
.el-icon-delete::before {
    margin-right: 5px;
}
</style>
