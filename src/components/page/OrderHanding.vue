<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">

        <div class="container">

            <div class="handle-box">

                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                    <el-option key="1" label="请选择" value=""></el-option>
                    <el-option key="4" label="好友姓名" value="friends_name"></el-option>
                    <el-option key="5" label="好友电话" value="friends_phone"></el-option>
                    <el-option key="2" label="推荐人姓名" value="user_name"></el-option>
                    <el-option key="3" label="推荐人电话" value="user_phone"></el-option>

                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <label style="padding-left: 10px;"> 服务跟踪状态： </label>
                <el-select v-model="select_recommended_state" placeholder="请选择" class="handle-select mr10">
                    <el-option key="0" label="请选择" value=""></el-option>
                    <el-option key="1" label="未上门服务" value="1"></el-option>
                    <el-option key="2" label="已上门服务" value="2"></el-option>
                    <el-option key="3" label="已成交" value="3"></el-option>
                    <el-option key="4" label="失效" value="4"></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="friends_name" label="好友姓名">
                </el-table-column>
                <el-table-column prop="friends_phone" label="联系电话">
                </el-table-column>
                <el-table-column prop="friends_address" label="地址">
                </el-table-column>
                <el-table-column prop="appointment_date" label="预约日期">
                </el-table-column>
                <el-table-column prop="appointment_specific_time" label="预约时间">
                </el-table-column>
                <el-table-column prop="user_name" label="推荐人姓名">
                </el-table-column>
                <el-table-column prop="user_phone" label="推荐人电话">
                </el-table-column>
                <el-table-column prop="end_date" label="参加活动结束日期">
                </el-table-column>
                <el-table-column label="服务跟踪状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.recommended_state=='1'">
                            未上门服务
                        </div>
                        <div v-if="scope.row.recommended_state=='2'">
                            已上门服务
                        </div>
                        <div v-if="scope.row.recommended_state=='3'">
                            已成交
                        </div>
                        <div v-if="scope.row.recommended_state=='4'">
                            失效
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index, scope.row,false)">
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



        <!-- 编辑派单信息 弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest" style="border:1px solid #000;">

                    <el-form :model="form" label-width="180px" ref="ruleForm">
                        <el-row>
                            <el-col :span="24">
                                <div style="padding-top: 5px;text-align: center;">推荐好友信息</div>
                            </el-col>
                        </el-row>
                        <hr>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="好友姓名:" prop="friends_name">
                                    {{form.friends_name}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式:" prop="friends_phone">
                                    {{form.friends_phone}}
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="地址:" prop="friends_address">
                                    {{form.friends_address}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="预约日期:" prop="appointment_date">
                                    {{form.appointment_date}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="预约时间:" prop="appointment_specific_time">
                                    {{form.appointment_specific_time}}
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <hr>
                        <el-row>
                            <el-col :span="24">
                                <div style="text-align: center;">推荐人信息</div>
                            </el-col>
                        </el-row>
                        <hr>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="推荐人姓名:" prop="user_name">
                                    {{form.user_name}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="推荐人电话:" prop="user_phone">
                                    {{form.user_phone}}
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="服务跟踪状态:" prop="recommended_state">
                                <template>
                                    <el-radio v-model="form.recommended_state" label="1">未上门服务</el-radio>
                                    <el-radio v-model="form.recommended_state" label="2">已上门服务</el-radio>
                                    <el-radio v-model="form.recommended_state" label="3">已成交</el-radio>
                                    <el-radio v-model="form.recommended_state" label="4">失效</el-radio>
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

                resource: '',
                dialogVisible: false,
                imgSrc: "",
                showFlag: false,
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_recommended_state:"",
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                user_list: [],

                form: {
                    _id: "",
                    friends_name: "",
                    friends_phone: "",
                    friends_address: "",
                    appointment_date: "",
                    appointment_specific_time: "",
                    user_name: "",
                    user_phone: "",
                    openid: "",
                    uid: "",
                    policyid: "",
                    end_date: "",
                    recommended_state: "",
                    create_time: "",
                    policy_type: "",
                    orderId: "",
                    end_time: ""
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
                api.getOrderList(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            //搜索
            search() {
                this.is_search = true;
                //选择请选择查询全部否则按条件查询
                if ("" == this.select_cate &&( ""==this.select_recommended_state) ){
                    this.getData();
                }else   {
                    var selectCate = this.select_cate;//下拉框值
                    var selectRecommendedState = this.select_recommended_state;//下拉框值
                    var selectWord = this.select_word;//输入框的值
                    var param ={}
                    if("" != this.select_cate &&( ""!=this.select_recommended_state)){
                         param = {
                            [selectCate]: selectWord,
                            recommended_state:selectRecommendedState
                        }
                    }else if("" != this.select_cate &&( ""==this.select_recommended_state)){
                        param = {
                            [selectCate]: selectWord
                        }
                    }else{
                        param = {
                            recommended_state:selectRecommendedState
                        }
                    }

                    //请求搜索接口
                    api.getOrderList(this.cur_page, this.pageSize, param)
                        .then(res => {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        })
                }
            },


            //取消
            closeDistribution() {
                this.getData();
                this.editVisible = false;
            },

            // 保存
            saveEdit() {

                //const item = this.tableData[this.idx];
                var id = this.form._id;
                var recommended_state=this.form.recommended_state
                //更新参数
                var param = {
                    orderId: id,
                    recommended_state: recommended_state
                };
                //执行更新方法
                api.updateOrder(param)
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
            //弹出详情编辑框
            orderEdit(index, row, showPrimary){
                this.idx = index;
                const item = this.tableData[index];
                console.log(item)
                this.form ={
                         _id: item._id,
                        friends_name: item.friends_name,
                        friends_phone: item.friends_phone,
                        friends_address: item.friends_address,
                        appointment_date: item.appointment_date,
                        appointment_specific_time: item.appointment_specific_time,
                        user_name: item.user_name,
                        user_phone: item.user_phone,
                        openid: item.openid,
                        uid: item.uid,
                        policyid: item.policyid,
                        end_date: item.end_date,
                        recommended_state: item.recommended_state,
                        create_time: item.create_time,
                        policy_type: item.policy_type,
                        orderId: item.orderId,
                        end_time: item.end_time
                }

                this.editVisible = true;
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
