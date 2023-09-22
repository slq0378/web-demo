<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-alert show-icon title="添加商品信息" type="warning" :closable="false"></el-alert>
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="商品信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="商品信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input placeholder="请输入商品名称" v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input placeholder="请输入商品价格" type="number" v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input placeholder="请输入商品数量" type="number" v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input placeholder="请输入商品重量" type="number" v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader v-model="addForm.goods_cat" style="width:100%;" :options="cateList" :props="cateProps" @change="cateChange"></el-cascader>
                    </el-form-item>

                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id"></el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                </el-tab-pane>
            </el-tabs>
        </el-form>

    </el-card>

</div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '0',
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_cat: []
            },
            addFormRules: {
                goods_name: [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: 'blur'
                }],
                goods_price: [{
                    required: true,
                    min: 0,
                    message: '请输入商品价格',
                    trigger: 'blur'
                }],
                goods_number: [{
                    required: true,
                    min: 0,
                    message: '请输入商品数量',
                    trigger: 'blur'
                }],
                goods_weight: [{
                    required: true,
                    min: 0,
                    message: '请输入商品重量',
                    trigger: 'blur'
                }],
                goods_cat: [{
                    required: true,
                    message: '请选择分类',
                    trigger: 'blur'
                }]
            },
            cateList: [],
            selectedKeys: [],
            cateProps: {
                expandTrigger: "hover",
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },
            // 参数
            manyTableData: []
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length > 2) {
                return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
            }
            return ''
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
            } = await this.$http.get('categories')
            console.log('categories', res)
            if (res.meta.status !== 200) {
                return this.$message.error('请求分类列表失败')
            }
            this.$message.success('请求分类列表成功')
            this.cateList = res.data
        },
        cateChange(value) {
            console.log("cateChange", value)
            if (value.length > 2) {

            } else {
                this.addForm.goods_cat = []
            }
        },
        beforeTabLeave(newTabIndex, oldTabIndex) {
            // console.log('beforeTabLeave source:', oldTabIndex);
            if (oldTabIndex === '0' && this.addForm.goods_cat.length < 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
            return true
        },
        async tabClicked() {
            console.log(this.activeIndex);
            if (this.activeIndex === '1') {
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: 'many'
                    }
                })
                console.log('attributes', res)
                if (res.meta.status !== 200) {
                    return this.$message.error('请参数列表失败')
                }
                this.$message.success('请求参数列表成功')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
                })
                this.manyTableData = res.data
            }
        },
        getParamList() {

        }
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

.el-steps {
    margin: 15px;
}

.el-step__title {
    font-size: 13px;
}
</style>
