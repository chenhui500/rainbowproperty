<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">

        <div class="container">

            <div class="handle-box">
                <el-button type="primary" @click="addSynopsis">新 增</el-button>

            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange">

                <el-table-column prop="grade_type" label="会员等级编号">
                </el-table-column>
                <el-table-column prop="grade_name" label="会员等级名称">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">

                        <div v-if="scope.$index==0">
                            <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index)">
                                编辑
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index)">
                                编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-edit" @click="showRewardDel(scope.$index)">
                                删除
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


        <!-- 编辑  弹出框 -->
        <el-dialog title="" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest">

                <el-form :model="form" label-width="180px" ref="ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <div style="padding-top: 15px; padding-bottom:15px;text-align: center;font-size: 20px;">
                                会员等级内容
                            </div>
                        </el-col>
                    </el-row>


                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="等级编号:" prop="reward_title">
                                <div v-if="addVisible==true">
                                    <el-input v-model="form.grade_type"  placeholder="请输入类型内容（只能是数字）"></el-input>
                                </div>
                                <div v-else>
                                    {{form.grade_type}}
                                </div>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="等级名称:" prop="reward_title">
                                <el-input v-model="form.grade_name"  placeholder="请输入等级名称"></el-input>
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
            :before-close="handleClose"  @close='closeDistribution'
        >
            <span>确定要删除数据？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="synopsisDel">确 定</el-button>
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
                    grade_type: "",
                    grade_name:""
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
                api.getRankList(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            //弹出新增框
            addSynopsis() {
                this.form.grade_name = "";
                this.form.grade_type = "";
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
                var grade_name = this.form.grade_name
                //更新参数
                var param = {
                    rid: id,
                    grade_name: grade_name
                };
                //执行更新方法
                api.updateRank(param)
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

                var grade_type = this.form.grade_type
                var grade_name = this.form.grade_name
                //参数
                var param = {
                    grade_type: grade_type,
                    grade_name: grade_name
                };
                //执行新增方法
                api.addRank(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            if(res.data.code==1){
                                this.$message.error("会员等级编号重复，请重新输入");
                            }else{
                                this.editVisible = false;
                                this.$message.success("添加成功");
                            }

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
                    grade_type: item.grade_type,
                    grade_name: item.grade_name
                }
                this.editVisible = true;
                this.addVisible = false;
            },
            //显示确认删除框
            showRewardDel(index){
                this.idx = index;
                this.dialogVisible= true;
            },
            //删除
            synopsisDel() {
                var index=this.idx;
                const item = this.tableData[index];
                //参数
                var param = {
                    rid: item._id
                };
                //执行
                api.delRank(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.dialogVisible= false;
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error("删除不成功");
                        }

                    });
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
