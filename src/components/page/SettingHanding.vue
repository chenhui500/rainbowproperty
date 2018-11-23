<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">

        <div class="container">

            <div class="handle-box">
                <el-button type="primary" @click="addReward">新 增</el-button>

            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="username" label="账号">
                </el-table-column>
                <el-table-column label="密码">
                    <template slot-scope="scope">
                        *******
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index)">
                            修改密码
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" @click="showDialog(scope.$index,false)">
                            重置密码
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" @click="showDialog(scope.$index,true)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>


        <!-- 编辑派单信息 弹出框 -->
        <el-dialog title="" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest">
                <div v-if="addVisible==true">
                    <el-form :model="form" label-width="180px" ref="ruleForm">
                        <el-row>
                            <el-col :span="24">
                                <div style="padding-top: 15px; padding-bottom:15px;text-align: center;font-size: 20px;">
                                    新增管理员账号
                                </div>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="账户:" prop="username">
                                    <el-input v-model="form.username" placeholder="请输入账号"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="密码:" prop="password">
                                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="确认密码:" prop="password">
                                    <el-input v-model="form.qrpassword" type="password"
                                              placeholder="请输入确认密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div v-else>

                    <el-form :model="form" label-width="180px" ref="ruleForm">
                        <el-row>
                            <el-col :span="24">
                                <div style="padding-top: 15px; padding-bottom:15px;text-align: center;font-size: 20px;">
                                    修改密码
                                </div>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="旧密码:" prop="oldpwd">
                                    <el-input v-model="oldpwd" type="password" placeholder="请输入旧密码"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="新密码:" prop="pwd">
                                    <el-input v-model="pwd" type="password" placeholder="请输入新密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="确认新密码:" prop="qrpwd">
                                    <el-input v-model="qrpwd" type="password" placeholder="请输入确认新密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">


                <div v-if="addVisible==true">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </div>
                <div v-else>
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </div>

            </div>

        </el-dialog>

        <el-dialog
            title="提示"
            width="30%"
            :visible.sync="dialogVisible"
            @close='closeDistribution' >

                <span  v-if="isDel==false">确定要重置密码为123456？</span>
                <span  v-if="isDel">确定要删除该账号？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" v-if="isDel==false" @click="resetPwd">确 定</el-button>
                    <el-button type="primary" v-if="isDel" @click="delAdmin">确 定</el-button>
                </span>



        </el-dialog>
    </div>
</template>

<script>

    import * as api from '@/api/index.js';
    import moment from 'moment';
    import md5 from "js-md5";

    export default {
        data() {
            return {
                dialogVisible: false,
                tableData: [],
                cur_page: 1,
                editVisible: false,
                addVisible: true,
                isDel:false,
                form: {
                    _id: "",
                    username: "",
                    password: "",
                    qrpassword: "",
                    oldpassword: ""
                },
                oldpwd: "",
                pwd: "",
                qrpwd: "",
                total: 10,
                currentPage: 1,
                pageSize: 10,
                idx: -1
            }
        },
        created() {
            this.getData();
        },


        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            //初始化数据
            getData() {
                //获取所有的数据
                api.getAdminList(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            //弹出新增框
            addReward() {
                this.oldpwd = "";
                this.pwd = "";
                this.qrpwd = "";
                this.form.username = "";
                this.form.password = "";
                this.form.qrpassword = "";
                this.editVisible = true;
                this.addVisible = true;
            },


            //取消
            closeDistribution() {
                this.getData();
                this.editVisible = false;
                this.addVisible = false;
            },

            // 保存编辑
            saveEdit() {
                var id = this.form._id;
                var oldpwd = md5(this.oldpwd);
                var oldpassword = this.form.oldpassword;
                var password = this.pwd;
                var qrpassword = this.qrpwd;
                if (oldpwd == oldpassword) {
                    if (password == "" || qrpassword == "") {
                        this.$message.error("密码不能为空");
                    } else {
                        if (password == qrpassword) {
                            //更新参数
                            var param = {
                                adminid: id,
                                password: password
                            };
                            //执行更新方法
                            api.updateAdminUser(param)
                                .then(res => {
                                    res.data.success
                                    if (res.data.success) {
                                        this.editVisible = false;
                                        this.$message.success("修改成功");
                                    } else {
                                        this.$message.error("修改不成功");
                                    }

                                });
                        } else {
                            this.$message.error("两次密码不一致，请重新输入");
                        }
                    }

                } else {
                    this.$message.error("旧密码不正确，请重新输入");
                }

            },
            //保存新增
            saveAdd() {

                var username = this.form.username
                var password = this.form.password
                var qrpassword = this.form.qrpassword

                if (password == "" || qrpassword == "") {
                    this.$message.error("密码不能为空");
                } else {
                    if (password == qrpassword) {
                        //参数
                        var param = {
                            username: username,
                            password: password
                        };
                        //执行新增方法
                        api.addAdminUser(param)
                            .then(res => {
                                res.data.success
                                if (res.data.success) {
                                    this.editVisible = false;
                                    this.$message.success("添加成功");
                                } else {
                                    this.$message.error("添加不成功");
                                }

                            });
                    } else {
                        this.$message.error("两次密码不一致，请重新输入");

                    }
                }


            },
            //弹出详情编辑框
            orderEdit(index) {
                this.idx = index;
                const item = this.tableData[index];
                this.form._id = item._id;
                this.form.oldpassword = item.password
                this.editVisible = true;
                this.addVisible = false;
            },
            //删除账号
            delAdmin(){
                var index = this.idx;
                const item = this.tableData[index];
                //参数
                var param = {
                    adminid: item._id
                };
                //执行新增方法
                api.delAdminUser(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.dialogVisible = false;
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error("删除不成功");
                        }

                    });
            },
            //显示确认删除提示
            showDialog(index,isDelFlag) {
                this.idx = index;
                this.dialogVisible = true;
                this.isDel=isDelFlag;
            },
            //重置密码
            resetPwd() {
                var index = this.idx;
                const item = this.tableData[index];
                //参数
                var param = {
                    adminid: item._id,
                    password:"123456"
                };
                //执行新增方法
                api.updateAdminUser(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.dialogVisible = false;
                            this.$message.success("重置密码成功");
                        } else {
                            this.$message.error("重置密码不成功");
                        }

                    });
            },
            //选择查询类别
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },

    }

</script>

<style scoped>

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .big-modal img {
        display: inline-block;
        width: 80%;
        height: 80%;
    }

    hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
