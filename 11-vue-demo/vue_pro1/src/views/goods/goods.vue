<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="10">
                <el-input placeholder="请输入 " v-model="queryInfo.query" clearable @clear="clearClick">
                    <el-button slot="append" type="primary" @click="getGoodsList" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="14">
                <el-button type="primary" @click="addGoodsClick" icon="el-icon-search">添加商品</el-button>
            </el-col>
        </el-row>
        <el-table :data="goodsList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" width="120px" label="商品价格(元)"></el-table-column>
            <el-table-column prop="goods_weight" width="100px" label="商品重量"></el-table-column>
            <el-table-column width="160px" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.add_time | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCateClose">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <el-cascader v-model="selectedKeys" clearable :options="parentgoodsList" :props="cateProps" @change="parentCateChange">
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
                query: '', // 值：1，2，3 分别表示显示一层二层三层分类列表,默认3
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            goodsList: [{
                add_time: 1514345477,
                cat_id: null,
                cat_one_id: null,
                cat_three_id: null,
                cat_two_id: null,
                goods_id: 926,
                goods_name: "【海外购自营】黎珐(ReFa) MTG日本 CARAT铂金微电流瘦脸瘦身提拉紧致V脸美容仪 【保税仓发货】",
                goods_number: 100,
                goods_price: 1399,
                goods_state: 0,
                goods_weight: 100,
                hot_mumber: 0,
                is_promote: false,
                upd_time: 151434547,
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
            parentgoodsList: [{
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
        this.getGoodsList()
    },
    methods: {
        async getGoodsList() {
            // 请求分类列表
            const {
                data: res
            } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            console.log('goodsList', res)
            if (res.meta.status !== 200) {
                return this.$message.error('请求商品列表失败')
            }
            this.total = res.data.total

            this.goodsList = res.data.goods
        },
        clearClick() {
            this.queryInfo = {
                query: '', // 值：1，2，3 分别表示显示一层二层三层分类列表,默认3
                pagenum: 1,
                pagesize: 10
            }
            this.getGoodsList()
        },
        // 分页
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage) {
            console.log(`当前页: ${newPage}`)
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },

        // 删除商品
        async deleteGoods(item) {
            console.log('deleteCate', item)
            const deleteResult = await this.$confirm(
                '此操作将永久删除该商品, 是否继续?',
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
                    'goods/' + item.goods_id
                )
                if (res.meta.status !== 200) {
                    this.$message('删除商品失败！')
                    return
                }
                this.$message({
                    type: 'success',
                    message: '删除商品成功!'
                })
                this.getGoodsList()
            }
        },
        // 添加商品
        addGoodsClick() {
            this.$router.push('/goods/add')
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
                this.getParentgoodsList()
                this.getGoodsList()

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
        async getParentgoodsList() {
            console.log('getParentgoodsList');
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
            this.parentgoodsList = res.data
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
                this.getGoodsList()
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
