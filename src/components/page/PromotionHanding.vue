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
                <el-table-column prop="promotion_days" label="活动天数">
                </el-table-column>
                <el-table-column prop="promotion_content" label="活动简介">
                </el-table-column>
                <el-table-column prop="promotion_type" label="活动类型">
                </el-table-column>
                <el-table-column prop="promotion_state" label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.promotion_state==0">
                            启用
                        </div>
                        <div v-else>
                            禁用
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">

                        <div v-if="scope.row.promotion_state==0">
                            <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index)">
                                编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-edit" @click="showRewardDel(scope.$index)">
                                禁用
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index)">
                                编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-edit" @click="showRewardDel(scope.$index)">
                                启用
                            </el-button>
                        </div>

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

                <el-form :model="form" label-width="180px" ref="ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <div style="padding-top: 15px; padding-bottom:15px;text-align: center;font-size: 20px;">
                                活动详情
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="活动天数:" prop="promotion_days">
                                <el-input v-model="form.promotion_days" type="number" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="活动类型:" prop="promotion_type">
                                <el-input v-model="form.promotion_type" type="number" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="状态:" prop="promotion_state">
                                <template>
                                    <el-radio v-model="form.promotion_state" label="0">启用</el-radio>
                                    <el-radio v-model="form.promotion_state" label="1">禁用</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="活动内容简介:" prop="promotion_content">
                                <el-input
                                    type="textarea"
                                    :rows="8"
                                    placeholder="请输入内容"
                                    v-model="form.promotion_content">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>

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
              @close='closeDistribution'
        >
            <span v-if="form.promotion_state==0">
                确定要禁用该活动？</span>
            <span v-else>确定要启用该活动？</span>
            {{form.promotion_state}}
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="rewardDel">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>

    import * as api from '@/api/index.js';
    import moment from 'moment';

    export default {
        data() {
            return {
                dialogVisible: false,
                tableData: [],
                cur_page: 1,
                editVisible: false,
                addVisible: true,
                form: {
                    _id: "",
                    promotion_days: "",
                    promotion_content: "",
                    promotion_type: 1,
                    promotion_state: "0"
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

            //初始化数据
            getData() {
                //获取所有的数据
                api.getPromotionList(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            //弹出新增框
            addReward() {
                this.form.reward_title = "";
                this.form.reward_content = "";
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
                var reward_title = this.form.reward_title
                var reward_content = this.form.reward_content
                //更新参数
                var param = {
                    rewardId: id,
                    reward_title: reward_title,
                    reward_content: reward_content
                };
                //执行更新方法
                api.updateReward(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.editVisible = false;
                            this.$message.success("修改成功");
                        } else {
                            this.$message.error("派单不成功");
                        }

                    });

            },
            //保存新增
            saveAdd() {

                var promotion_days = this.form.promotion_days
                var promotion_type = this.form.promotion_type
                var promotion_state = this.form.promotion_state
                var promotion_content = this.form.promotion_content
                //参数
                var param = {
                    promotion_days: promotion_days,
                    promotion_type: promotion_type,
                    promotion_state: promotion_state,
                    promotion_content: promotion_content
                };
                //执行新增方法
                api.addPromotion(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.editVisible = false;
                            this.$message.success("添加成功");
                        } else {
                            this.$message.error("添加不成功");
                        }

                    });

            },
            //弹出详情编辑框
            orderEdit(index) {
                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    _id: item._id,
                    promotion_days: item.promotion_days,
                    promotion_type: item.promotion_type,
                    promotion_state: item.promotion_state == 0 ? "0" : "1",
                    promotion_content: item.promotion_content
                }
                this.editVisible = true;
                this.addVisible = false;
            },
            //显示确认删除框
            showRewardDel(index) {
                this.idx = index;
                const item = this.tableData[index];
                this.form.promotion_state = item.promotion_state;
                this.dialogVisible = true;
            },
            //删除
            rewardDel() {
                var index = this.idx;
                const item = this.tableData[index];
                //参数
                var param = {
                    promotionid: item._id,
                    promotion_state: item.promotion_state == 0 ? "1" : "0",
                };
                //执行新增方法
                api.updatePromotion(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.dialogVisible = false;
                            this.$message.success("设置成功");
                        } else {
                            this.$message.error("设置不成功");
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
