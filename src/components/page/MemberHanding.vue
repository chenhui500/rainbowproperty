<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">

        <div class="container">

            <div class="handle-box">

                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                    <el-option key="1" label="请选择" value=""></el-option>
                    <el-option key="2" label="会员姓名" value="user_name"></el-option>
                    <el-option key="3" label="会员联系电话" value="user_phone"></el-option>
                    <el-option key="3" label="邀请人（业务员）姓名" value="invite_name"></el-option>
                    <el-option key="3" label="邀请人（业务员）电话" value="invite_phone"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="user_name" label="会员姓名">
                </el-table-column>
                <el-table-column prop="user_phone" label="会员联系电话">
                </el-table-column>
                <el-table-column prop="user_address" label="会员地址">
                </el-table-column>
                <el-table-column prop="user_type" label="用户类型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.user_type=='1'">
                            业务员
                        </div>
                        <div v-else>会员</div>
                    </template>

                </el-table-column>
                <el-table-column prop="user_grade" label="用户等级">
                    <template slot-scope="scope">
                        <div v-if="scope.row.user_grade=='1'">
                            青铜会员
                        </div>
                        <div v-if="scope.row.user_grade=='2'">
                            白银会员
                        </div>
                        <div v-if="scope.row.user_grade=='3'">
                            黄金会员
                        </div>
                        <div v-if="scope.row.user_grade=='4'">
                            铂金会员
                        </div>
                        <div v-if="scope.row.user_grade=='5'">
                            钻石会员
                        </div>
                    </template>

                </el-table-column>
                <el-table-column prop="invite_name" label="邀请人（业务员）姓名">
                </el-table-column>
                <el-table-column prop="invite_phone" label="邀请人（业务员）电话">
                </el-table-column>
                <el-table-column prop="create_time" label="注册时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">

                        <el-button type="text" icon="el-icon-edit" @click="editUser(scope.$index)">
                            编辑
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


        <!-- Form -->
        <el-dialog title="" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest">

                <el-form :model="form" label-width="180px" ref="ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <div style="padding-top: 15px; padding-bottom:15px;text-align: center;font-size: 20px;">
                                会员详情
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名:" prop="user_name">
                                {{form.user_name}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系方式:" prop="user_phone">
                                {{form.user_phone}}
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="电话:" prop="user_address">
                                {{form.user_address}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <!--推荐人-->
                    <div v-if="form.user_type==0">

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="邀请人姓名:" prop="invite_name">
                                    {{form.invite_name}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="邀请人电话:" prop="invite_phone">
                                    {{form.invite_phone}}
                                </el-form-item>
                            </el-col>

                        </el-row>
                    </div>

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="会员等级:" prop="user_grade">
                                <template>
                                    <el-radio v-model="form.user_grade" label="1">青铜会员</el-radio>
                                    <el-radio v-model="form.user_grade" label="2">白银会员</el-radio>
                                    <el-radio v-model="form.user_grade" label="3">黄金会员</el-radio>
                                    <el-radio v-model="form.user_grade" label="4">铂金会员</el-radio>
                                    <el-radio v-model="form.user_grade" label="5">钻石会员</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>

            <div slot="footer" class="dialog-footer">

                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>

            </div>

        </el-dialog>

    </div>
</template>

<script>

    import * as api from '@/api/index.js';
    import moment from 'moment';

    export default {
        data() {
            return {
                dialogFormVisible: false,
                resource: '',
                dialogVisible: false,
                showFlag: false,
                tableData: [],
                cur_page: 1,
                select_cate: '',
                select_word: '',
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    _id: "",
                    user_name: "",
                    user_phone: "",
                    user_address: "",
                    openid: "",
                    user_type: "1",
                    invite_name: "",
                    invite_phone: "",
                    create_time: "",
                    user_grade: ""
                },
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

            // 初始化数据
            getData() {
                //获取所有的数据
                api.getUserList(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            //取消
            closeDistribution() {
                this.getData();
                this.editVisible = false;
            },
            //弹出详情编辑框
            editUser(index) {
                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    _id: item._id,
                    user_name: item.user_name,
                    user_phone: item.user_phone,
                    user_address: item.user_address,
                    invite_name: item.invite_name,
                    invite_phone: item.invite_phone,
                    create_time: item.create_time,
                    user_grade: item.user_grade,
                    user_type: item.user_type
                }
                this.editVisible = true;
            },
            saveEdit(){
                var id = this.form._id;
                var user_grade=this.form.user_grade
                //更新参数
                var param = {
                    uid: id,
                    user_grade: user_grade
                };
                //执行更新方法
                api.updateUserGrade(param)
                    .then(res => {
                        res.data.success
                        if(res.data.success){
                            this.editVisible = false;
                            this.$message.success("修改成功");
                        }else{
                            this.$message.error("修改不成功");
                        }

                    });
            },
            //搜索
            search() {
                this.is_search = true;
                //选择请选择查询全部否则按条件查询
                if ("" == this.select_cate) {
                    this.getData();
                } else {
                    var selectCate = this.select_cate;//下拉框值
                    var selectWord = this.select_word;//输入框的值
                    var param = {
                        [selectCate]: selectWord
                    }
                    //请求搜索接口
                    api.getUserList(this.cur_page, this.pageSize, param)
                        .then(res => {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        })
                }
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
