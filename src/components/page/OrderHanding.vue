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

                    <el-option key="6" label="地址" value="friends_address"></el-option>
                    <el-option key="7" label="预约日期" value="appointment_date"></el-option>
                    <el-option key="8" label="预约时间" value="appointment_specific_time"></el-option>
                    <el-option key="9" label="参加活动结束日期" value="end_date"></el-option>
                    <el-option key="10" label="创建申请时间" value="create_time"></el-option>

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

                <!--根据时间导出数据-->
                <el-date-picker
                    v-model="creat_time_value"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <!--导出Excel-->
                <el-button type="success" @click="outExePart" >导出指定日期到当前日期信息</el-button>
                <!--导出Excel-->
                <el-button type="success" @click="outExe" >导出全部信息</el-button>
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
                <el-table-column prop="salesman_name" label="业务员" >
                    <template scope="scope">
                        <span  style="color: #37B328">{{ scope.row.salesman_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="salesman_phone" label="业务员电话">
                </el-table-column>
                <el-table-column prop="create_time" label="申请时间">
                </el-table-column>
                <el-table-column label="服务跟踪状态">
                    <template scope="scope">
                        <div v-if="scope.row.recommended_state=='1'">
                            未上门服务
                        </div>
                        <div v-if="scope.row.recommended_state=='2'">
                            <span  style="color: #F4A460">已上门服务</span>
                        </div>
                        <div v-if="scope.row.recommended_state=='3'">
                            <span  style="color: #00BFFF">已成交</span>
                        </div>
                        <div v-if="scope.row.recommended_state=='4'">
                                <span  style="color: #FF4500">失效</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="业务员提交审核状态">
                    <template scope="scope">
                        <div v-if="scope.row.submit_audit_status=='1'">
                            未上门服务
                        </div>
                        <div v-if="scope.row.submit_audit_status=='2'">
                            <span  style="color: #F4A460">已上门服务</span>
                        </div>
                        <div v-if="scope.row.submit_audit_status=='3'">
                            <span  style="color: #00BFFF">已成交</span>
                        </div>
                        <div v-if="scope.row.submit_audit_status=='4'">
                            <span  style="color: #FF4500">失效</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="finance_remarks" label="财务备注">
                </el-table-column>
                <el-table-column prop="salesman_remarks" label="业务员备注">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                            <el-button type="text"   @click="orderEdit(scope.$index, scope.row,false)">
                                编辑
                            </el-button>
                        <div v-if="scope.row.audit_status=='2'">
                            <el-button type="text"   @click="showAudit(scope.$index,scope.row.recommended_state,scope.row.submit_audit_status)">审核</el-button>
                        </div>

                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[100, 200, 300, 500, 1000, 2000]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" >
                </el-pagination>
            </div>
        </div>


        <!--审核框-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>确认审核信息是否通过</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitAudit('1')">不通过</el-button>
                <el-button type="primary" @click="submitAudit('3')">通过</el-button>
            </span>
        </el-dialog>

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
                        <hr>
                        <el-row>
                            <el-col :span="24">
                                <div style="padding-top: 5px;text-align: center;">财务备注</div>
                            </el-col>
                        </el-row>
                        <hr>
                        <el-row>
                            <el-col :span="24">
                                <div style="padding-top: 2px;padding-bottom: 5px;text-align: center;">
                                    <el-input
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请输入内容"
                                        v-model="form.finance_remarks">
                                    </el-input>
                                </div>
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
                creat_time_value:"",
                resource: '',
                dialogVisible: false,
                imgSrc: "",
                showFlag: false,
                tableData: [],
                outExeData: [],
                outExeDataPart: [],
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
                    end_time: "",
                    finance_remarks:""
                },
                total: 0,
                currentPage: 1,
                pageSize: 100,
                idx: -1,
                auditId:"",
                oldAuditStatus:"",
                auditStatus:""
            }
        },
        created() {
            this.getData();

        },


        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                //this.getData();
                this.search();
            },
            handleSizeChange(val) {
                this.pageSize=val;
                console.log(`每页 ${val} 条`);
                this.search();
            },
            // 初始化数据
            getData() {
                //获取分页的数据
                api.getOrderList(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
                //获取所有的数据
                /*api.getOrderLists().then(res => {
                    this.outExeData = res.data.data;
                })*/
                var param = {
                    user_type: "1"
                };
                api.getMyOrderLists(param).then(res => {

                    this.outExeData = res.data.data;
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
                        //请求搜索接口
                        api.getOrderListTwo(this.cur_page, this.pageSize, param)
                            .then(res => {
                                this.tableData = res.data.data;
                                this.total = res.data.total;
                            })
                    }else if("" != this.select_cate &&( ""==this.select_recommended_state)){
                        param = {
                            [selectCate]: selectWord
                        }
                        //请求搜索接口
                        api.getOrderList(this.cur_page, this.pageSize, param)
                            .then(res => {
                                this.tableData = res.data.data;
                                this.total = res.data.total;
                            })
                    }else{
                        param = {
                            recommended_state:selectRecommendedState
                        }
                        //请求搜索接口
                        api.getOrderList(this.cur_page, this.pageSize, param)
                            .then(res => {
                                this.tableData = res.data.data;
                                this.total = res.data.total;
                            })
                    }


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
                let finance_remarks=this.form.finance_remarks;
                //更新参数
                var param = {
                    orderId: id,
                    recommended_state: recommended_state,
                    finance_remarks:finance_remarks
                };
                //执行更新方法
                api.updateOrder(param)
                    .then(res => {
                        res.data.success
                        if(res.data.success){
                            this.editVisible = false;
                            this.$message.success("修改成功");
                            this.search();
                        }else{
                            this.$message.error("修改不成功");
                        }

                    });

            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            //显示审核界面
            showAudit(index,recommended_state,submit_audit_status){
                console.log(recommended_state+"------------recommended_state")
                console.log(submit_audit_status+"------------submit_audit_status")

                //获取当前数据
                const item = this.tableData[index];
                console.log(item._id+"------------index")
                this.oldAuditStatus=recommended_state;
                this. auditStatus=submit_audit_status;
                this.auditId=item._id;
                this.dialogVisible = true;
            },
            //提交审核结果
            submitAudit(isDetermine){
                console.log( "------------index："+this.auditId)
                console.log( "------------this.oldAuditStatus："+this.oldAuditStatus)
                console.log( "------------this. auditStatus："+this. auditStatus)
                if(isDetermine==1){
                    //更新参数
                    let param = {
                        orderId: this.auditId,
                        submit_audit_status:  this.oldAuditStatus  ,
                        recommended_state:this.oldAuditStatus ,
                        audit_status:isDetermine
                    };
                    //执行更新方法
                    api.updateOrder(param)
                        .then(res => {
                            res.data.success
                            if(res.data.success){
                                this.dialogVisible = false;
                                this.$message.success("修改成功");
                                this.search();
                            }else{
                                this.$message.error("修改不成功");
                            }

                        });
                }else{
                    //更新参数
                    let param = {
                        orderId: this.auditId,
                        submit_audit_status: this.auditStatus,
                        recommended_state:this.auditStatus,
                        audit_status:isDetermine
                    };
                    //执行更新方法
                    api.updateOrder(param)
                        .then(res => {
                            res.data.success
                            if(res.data.success){
                                this.dialogVisible = false;
                                this.$message.success("修改成功");
                                this.search();
                            }else{
                                this.$message.error("修改不成功");
                            }

                        });
                }


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
            },
            // 导出
            outExe() {
                this.$confirm('将所有推荐单导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.excelData =this.outExeData; //你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {

                });
            },
            outExePart(){
               let param = {
                    create_time:this.creat_time_value
                }
                console.log(param)
                //请求搜索接口
                api.getExportOrderLists(param)
                    .then(res => {

                        this.outExeDataPart = res.data.data;
                        console.log("----->this.outExeDataPart:"+this.outExeDataPart)
                        this.$confirm('将导出指定推荐单信息, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.excelDataPart =this.outExeDataPart; //你要导出的数据list。
                            this.exportExcelPart()
                        }).catch(() => {

                        });
                    })
            },
            exportExcelPart() {
                let moment = require("moment");
                var that = this;
                require.ensure([], () => {

                    const { export_json_to_excel } = require('@/excel/Expor2Excal'); //这里必须使用绝对路径
                    const tHeader = ['业务员名字','业务员电话','客户名字','客户电话','挚友名字','挚友电话', '挚友地址', '预约日期','预约时间','参加活动结束日期','服务状态','推荐挚友日期']; // 导出的表头名
                    const filterVal = ['salesman_name','salesman_phone','user_name','user_phone','friends_name','friends_phone','friends_address', 'appointment_date','appointment_specific_time','end_date','recommended_state','create_time']; // 导出的表头字段名
                    console.log(that.excelDataPart+"-----")
                    const list = that.excelDataPart;
                    const data = that.formatJson(filterVal, list);
                    let  time2 =moment().format('YYYY-MM-DD HH:mm:ss');
                    export_json_to_excel(tHeader, data, `[${time2}]推荐单表格`);// 导出的表格名称，根据需要自己命名
                })
            },
            export2Excel() {
                let moment = require("moment");
                var that = this;
                require.ensure([], () => {

                    const { export_json_to_excel } = require('@/excel/Expor2Excal'); //这里必须使用绝对路径
                    const tHeader = ['业务员名字','业务员电话','客户名字','客户电话','挚友名字','挚友电话', '挚友地址', '预约日期','预约时间','参加活动结束日期','服务状态','推荐挚友日期']; // 导出的表头名
                    const filterVal = ['salesman_name','salesman_phone','user_name','user_phone','friends_name','friends_phone','friends_address', 'appointment_date','appointment_specific_time','end_date','recommended_state','create_time']; // 导出的表头字段名
                    console.log(that.excelData+"-----")
                    const list = that.excelData;
                    const data = that.formatJson(filterVal, list);
                    let  time2 =moment().format('YYYY-MM-DD HH:mm:ss');
                    export_json_to_excel(tHeader, data, `[${time2}]推荐单表格`);// 导出的表格名称，根据需要自己命名
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
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
