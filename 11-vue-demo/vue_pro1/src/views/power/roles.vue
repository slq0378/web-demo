<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row class="add-role">
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>

        <el-table :data="rolesList" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="first-level" :class="['bd-bottom', 'center', index == 0 ? 'bd-top' : '']" v-for="(item, index) in scope.row.children" :key="item.id">
                        <el-col :span="5">
                            <el-tag closable @close="removeWithID(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row :class="['center', index2 == 0 ? '' : 'bd-top']" v-for="(item2, index2) in item.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag closable type="success" @close="removeWithID(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18" class="third-level">
                                    <el-tag closable @close="removeWithID(scope.row, item3.id)" v-for="(item3, index3) in item2.children" :key="item3.id" type="warning">{{ item3.authName }}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column prop="level" label="权限等级" width="300px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClose">
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
    <el-dialog title="分配权限" :visible.sync="showRightDialogVisible" width="50%" @close="rightDialogClose">
        <el-tree ref="treeRef" :data="rightsList" :props="defaultTreeProps" node-key="id" @node-click="handleNodeClick" show-checkbox default-expand-all :default-checked-keys="defKeys" @check-change="handleCheckChange">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="settingCancel">取 消</el-button>
            <el-button type="primary" @click="settingRightUser">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            rightsList: [],
            rolesList: [{
                id: 30,
                roleName: '主管',
                roleDesc: '技术负责人',
                children: [{
                    id: 101,
                    authName: '商品管理',
                    path: null,
                    children: [{
                        id: 104,
                        authName: '商品列表',
                        path: null,
                        children: [{
                            id: 105,
                            authName: '添加商品',
                            path: null
                        }]
                    }]
                }]
            }],
            showRightDialogVisible: false,
            defaultTreeProps: {
                children: 'children',
                label: 'authName'
            },
            // 默认选中
            defKeys: [],
            // 编辑角色
            editRoleDialogVisible: false,
            // 选中编辑角色
            selectedEditRole: {},
            selectedRoleID: '',
            // 选中分配角色
            selectedSettingRole:{}
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
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
        async removeWithID(role, id) {
            console.log('role', role)
            const removeResult = await this.$confirm(
                '此操作将永久删除该权限, 是否继续?',
                '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(() => {})

            if (removeResult !== 'confirm') {
                return this.$message('取消删除')
            } else {
                const {
                    data: res
                } = await this.$http.delete(
                    `roles/${role.id}/rights/${id}`
                )
                console.log(res)
                if (res.meta.status !== 200) {
                    this.$message('删除权限失败！')
                    return
                }
                this.$message({
                    type: 'success',
                    message: '删除权限成功!'
                })
                // role.children = res.data
                this.getRolesList()
            }
        },
        async showRightDialog(role) {
            console.log('showRightDialog',role);
            const {
                data: res
            } = await this.$http.get('rights/tree')
            console.log(res)
            if (res.meta.status !== 200) {
                this.$message.error('请求权限列表错误')
                return
            }
            this.$message.success('请求权限列表成功')
            this.rightsList = res.data
            this.getSelectRoleID(role, this.defKeys)
            console.log('this.defKeys', this.defKeys)
            this.showRightDialogVisible = true
            this.selectedSettingRole = role
        },
        rightDialogClose() {
            this.selectedSettingRole = {}
        },
        async settingRightUser() {
            // roles/:roleId/rights
            // getHalfCheckedKeys  所有半选中节点id数组
            // getCheckedKeys 所有选中节点id数组
            // console.log(this.$refs.treeRef.getHalfCheckedKeys());
            // console.log(this.$refs.treeRef.getCheckedKeys());
            console.log('selectedEditRole',this.selectedSettingRole);
            const checkedIDs = [...this.$refs.treeRef.getHalfCheckedKeys(),...this.$refs.treeRef.getCheckedKeys()].join(',')
            // console.log('checkedIDs',checkedIDs);
            const {
                data: res
            } = await this.$http.post(`roles/${this.selectedSettingRole.id}/rights`,{rids:checkedIDs})
            console.log('settingRightUser',res)
            if (res.meta.status !== 200) {
                this.$message.error('分配权限错误')
                return
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.showRightDialogVisible = false
            
        },
        settingCancel() {
            this.defKeys = []
            this.showRightDialogVisible = false
        },
        handleNodeClick(data) {
            console.log('handleNodeClick:',data)
        },

        // 递归获取所有选中的节点
        getSelectRoleID(node, arr) {
            // 3级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.map((item) => {
                this.getSelectRoleID(item, arr)
            })
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate)
        },
        async editRole(role) {
            this.selectedEditRole = role

            this.editRoleDialogVisible = true

        },
        async deleteRole(role) {
            console.log('role', role)
            const removeResult = await this.$confirm(
                '此操作将永久删除该角色, 是否继续?',
                '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(() => {})

            if (removeResult !== 'confirm') {
                return this.$message('取消删除')
            } else {
                const {
                    data: res
                } = await this.$http.delete(`roles/${role.id}`)
                console.log(res)
                if (res.meta.status !== 200) {
                    this.$message('删除角色失败！')
                    return
                }
                this.$message({
                    type: 'success',
                    message: '删除角色成功!'
                })

                this.rolesList
                // role.children = res.data
            }
        },
        editRoleDialogClose() {
            this.selectedEditRole = {}
            this.editRoleDialogVisible = false
        },
        async editRoleDialogConfirm(selectedRole) {
            console.log(this.selectedRoleID, selectedRole);
            this.selectedEditRole = {}

            const {
                data: res
            } = await this.$http.put(
                `roles/${this.selectedRoleID}`, {
                    roleName: selectedRole.roleName,
                    roleDesc: selectedRole.roleDesc
                }
            )
            console.log(res)
            if (res.meta.status !== 200) {
                this.$message('编辑权限失败！')
                return
            }
            this.$message({
                type: 'success',
                message: '编辑权限成功!'
            })
            this.getRolesList()
            // 更改角色
            this.editRoleDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb,
.add-role {
    margin-bottom: 15px;
}

.first-level {
    margin: 0 48px;
}

.el-tag {
    margin: 5px 0px;
}

.third-level .el-tag {
    margin: 5px;
}

.bd-bottom {
    border-bottom: 1px solid #eee;
}

.bd-top {
    border-top: 1px solid #eee;
}

.center {
    display: flex;
    align-items: center;
}
</style>
