<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="10">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearClick">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="14">
                <el-button type="primary" @click="addDialogVisible = true">
                    添加用户
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="users" style="width: 100%" border stripe>
                    <el-table-column type="index" label="#"> </el-table-column>
                    <el-table-column prop="username" label="姓名"> </el-table-column>
                    <el-table-column prop="email" label="邮箱"> </el-table-column>
                    <el-table-column prop="mobile" label="电话"> </el-table-column>
                    <el-table-column prop="role_name" label="角色"> </el-table-column>
                    <el-table-column prop="mg_state" label="状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row.id, scope.row.mg_state)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row, 1)"></el-button>
                            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleEdit(scope.$index, scope.row, 2)"></el-button>
                            <el-tooltip effect="dark" content="更改角色" placement="top-start" enterable>
                                <el-button size="mini" type="warning" icon="el-icon-setting" @click="handleEdit(scope.$index, scope.row, 3)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
            <el-form-item label="姓名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="更改角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClose">
        <div>
            <el-form>
                <el-form-item label="角色名称" label-width="80px">
                    <el-input :value="selectedEditRole.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="80px">
                    <el-input :value="selectedEditRole.roleDesc" disabled></el-input>
                </el-form-item>
                <el-form-item label="更改角色" label-width="80px">
                    <el-select v-model="selectedRoleID" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoleDialogConfirm(selectedEditRole)">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        // 自定义检验规则
        const checkEmail = (rule, value, cb) => {
            const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (reg.test(value)) {
                return cb()
            }
            cb('请输入合法的邮箱')
        }
        const checkMobile = (rule, value, cb) => {
            const regMobile =
                /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                cb()
            }
            cb('请输入正确的手机号')
        }
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            total: 0,
            userList: [],
            users: [{
                id: 500,
                role_name: '超级管理员',
                username: 'admin',
                create_time: 1486720211,
                mobile: '12345678',
                email: 'adsfad@qq.com',
                mg_state: false
            }],
            addDialogVisible: false,

            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 5,
                        message: '长度在2-5之间',
                        trigger: 'blur'
                    }
                ],
                password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 8,
                        message: '长度在6-8之间',
                        trigger: 'blur'
                    }
                ],
                email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }
                    // {
                    //     validator: checkMobile,
                    //     trigger: 'blur'
                    // }
                ]
            },
            editDialogVisible: false,
            editForm: {
                username: '',
                email: '',
                mobile: ''
            },
            editFormRules: {
                email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }
                    // {
                    //     validator: checkMobile,
                    //     trigger: 'blur'
                    // }
                ]
            },
            // 更改角色
            editRoleDialogVisible: false,
            selectedEditRole: {},
            selectedRoleID: '',
            rolesList: [],
            selectedUserInfo: {}
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            // 请求用户列表
            const {
                data: res
            } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status === 200) {
                this.total = res.data.total
                this.queryInfo.pagenum = res.data.pagenum
                this.users = res.data.users
            }
        },
        clearClick() {
            this.queryInfo.query = ''
            this.getUserList()
        },
        async searchClick() {
            console.log('searchClick', this.searchValue)
            const {
                data: res
            } = await this.$http.get('users/' + this.searchValue)
            if (res.meta.status === 200) {
                this.total = res.data.total
                this.queryInfo.pagenum = res.data.pagenum
                this.users = [res.data]
            }
        },
        async handleEdit(index, item, type) {
            console.log('handleEdit', index, item, type)
            switch (type) {
                // 编辑
                case 1: {
                    // 查询用户数据
                    const {
                        data: res
                    } = await this.$http.get('users/' + item.id)
                    if (res.meta.status === 200) {
                        this.editForm = res.data
                    }
                    this.editDialogVisible = true
                    break
                }

                // 删除
                case 2: {
                    const deleteResult = await this.$confirm(
                        '此操作将永久删除该用户, 是否继续?',
                        '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    ).catch(() => {})
                    if (deleteResult === 'confirm') {
                        const {
                            data: res
                        } = await this.$http.delete('users/' + item.id)
                        if (res.meta.status !== 200) {
                            this.$message('删除用户失败！')
                            return
                        }
                        this.$message({
                            type: 'success',
                            message: '删除用户成功!'
                        })
                        this.getUserList()
                    } else {
                        this.$message('取消删除')
                    }

                    break
                }

                // 修改角色
                case 3: {
                    const {
                        data: res
                    } = await this.$http.get('users/' + item.id)
                    console.log('用户信息',res);
                    if (res.meta.status !== 200) {
                        return this.$message.error('请求用户信息错误')
                    }
                    this.selectedUserInfo = res.data
                    this.getRoleById()
                    this.getRolesList()
                    this.editRoleDialogVisible = true

                    break
                }

                default:
                    break
            }
        },
        async stateChange(id, state) {
            console.log('stateChange', id, state)
            // 修改用户状态 users/:uId/state/:type
            const {
                data: res
            } = await this.$http.put(
                'users/' + id + '/state/' + state
            )
            if (res.meta.status === 200) {
                this.getUserList()
            }
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagenum = newSize
            this.getUserList()
        },
        handleCurrentChange(newPage) {
            console.log(`当前页: ${newPage}`)
            this.queryInfo.pagenum = newPage
        },
        addClose() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            // this.dialogVisible = false
            const vm = this
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return
                // 添加用户请求
                const {
                    data: res
                } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 200) {
                    this.$message('添加用户失败！')
                    return
                }
                this.$message('添加用户成功！')
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        editClose() {
            this.$refs.editFormRef.resetFields()
        },
        editUser() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return
                // 添加用户请求
                const {
                    data: res
                } = await this.$http.put(
                    'users/' + this.editForm.id,
                    this.editForm
                )
                if (res.meta.status !== 200) {
                    this.$message('修改用户失败！')
                    return
                }
                this.$message('修改用户成功！')
                this.editDialogVisible = false
                this.getUserList()
            })
        },
        // 更改角色
        async getRoleById() {
            const {
                data: res
            } = await this.$http.get(
                'roles/' + this.selectedUserInfo.rid
            )
            console.log('getRoleById', res)
            if (res.meta.status !== 200) {
                this.$message.error('请求角色错误')
                return
            }
            this.$message.success('请求角色成功')
            this.selectedEditRole = res.data
        },
        async getRolesList() {
            // 参数值 list 或 tree
            const {
                data: res
            } = await this.$http.get('roles')

            if (res.meta.status !== 200) {
                this.$message.error('请求权限列表错误')
                return
            }
            this.$message.success('请求权限列表成功')
            this.rolesList = res.data
        },
        editRoleDialogClose() {
            this.selectedUserInfo = {}
        },
        async editRoleDialogConfirm(role) {
            console.log('editRoleDialogConfirm',role);
            const {
                data: res
            } = await this.$http.put(
                `users/${this.selectedUserInfo.id}/role`, {
                    rid: this.selectedRoleID
                }
            )

            if (res.meta.status !== 200) {
                this.$message.error('更改角色错误')
                return
            }
            this.$message.success('更改角色成功')
            this.getUserList()
            this.editRoleDialogVisible = false
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

.box-card {
    .el-table {
        margin-top: 15px;
    }

    .el-pagination {
        margin-top: 15px;
    }
}
</style>
