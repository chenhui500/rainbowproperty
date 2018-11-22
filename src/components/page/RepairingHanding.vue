<!--打印订单-->
<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">
        <!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 公司订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>-->
        <div class="container">

            <div class="handle-box">

                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                    <el-option key="1" label="请选择" value=""></el-option>
                    <el-option key="2" label="姓名" value="staff_name"></el-option>
                    <el-option key="3" label="电话号码" value="staff_tel"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="orderId" label="单号">
                </el-table-column>
                <el-table-column prop="staff_name" label="接单员">
                </el-table-column>
                <el-table-column prop="staff_tel" label="联系方式">
                </el-table-column>
                <el-table-column prop="order_type" label="类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.order_type=="personal"?"个人":"公共"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="repair_place" label="维修位置">
                </el-table-column>
                <el-table-column prop="content" label="维修内容">
                </el-table-column>
                <el-table-column prop="duration" label="计划完成时间">
                </el-table-column>
                <el-table-column prop="picture" label="图片">

                    <template slot-scope="scope">

                        <div v-if="scope.row.picture.length>0">
                            <el-popover
                                placement="top-start"
                                title="大图"
                                width="200"
                                trigger="hover"
                                content="">
                                <img :src="item.minFilename" title="点击查看大图" style="width:80px;height:100px;"
                                     @click="bigImg(item.filename)" class="img-item" alt=""
                                     v-for="(item) in scope.row.picture">

                                <el-button slot="reference"><img :src="scope.row.picture[0].minFilename"
                                                                 style="width:60px;height:100px;"
                                                                 v-popover:popover></el-button>
                            </el-popover>
                        </div>
                        <span v-show="scope.row.picture.length==0">用户没有上传图片</span>
                    </template>
                </el-table-column>
                <el-table-column prop="material_cost" label="材料费（元）">
                </el-table-column>
                <el-table-column prop="maintenance_cost" label="维修费（元）">
                </el-table-column>
                <el-table-column prop="offer" label="合计（元）">
                </el-table-column>

                <el-table-column label="派单操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.order_state=='pending'">
                            <el-button type="text" icon="el-icon-edit"
                                       @click="distributionEdit(scope.$index, scope.row,false)">
                                订单派送
                            </el-button>
                        </div>
                        <div v-else>

                            <el-button type="text" icon="el-icon-printer"
                                       @click="distributionEdit(scope.$index, scope.row,true)">
                                打印派单
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

        <!--显示大图-->
        <div class="dial-header">
            <el-dialog style="background-color:transparent;" title="显示大图" :visible.sync="showFlag" @close='closeDialog'>
                <div style="text-align: left; margin: 0;width:10%;height: 50%">
                    <div class="adp"
                         style="width:300px;height:600px;line-height:600px;border-top:none;margin:0px 0px 0px 40px">
                        <img :src="imgSrc"
                             style="width:700px;height:600px;">
                    </div>
                </div>
            </el-dialog>
        </div>


        <!-- 派单 弹出框 -->
        <el-dialog title="订单派送" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest">

                <div class="title-top">管理处（入户）维修派工单</div>
                <el-form :model="form" label-width="80px" ref="ruleForm" style="border:1px solid black;">
                    <el-row>
                        <el-col class="col-title">
                            派工单
                        </el-col>
                    </el-row>

                    <hr>

                    <el-row>
                        <el-col :span="8">
                            &nbsp;编号:
                        </el-col>
                        <el-col :span="8">
                            <div v-if="form.order_type=='personal'?true:false"><img src="../../assets/checked.png"
                                                                                    height="15" width="15"/> 有偿
                            </div>
                            <div v-if="form.order_type=='personal'?false:true"> 有偿</div>

                        </el-col>
                        <el-col :span="8">
                            <div v-if="form.order_type=='personal'?false:true"><img src="../../assets/checked.png"
                                                                                    height="15" width="15"/> 公共
                            </div>
                            <div v-if="form.order_type=='personal'?true:false"> 公共</div>
                        </el-col>
                    </el-row>

                    <hr>
                    <el-row>
                        <el-col :span="8">
                            &nbsp;接修约定时间:
                        </el-col>
                        <el-col :span="16">
                            {{form.date}}
                        </el-col>
                    </el-row>
                    <hr>
                    <el-row>
                        <el-col :span="8">
                            &nbsp;实际到达维修时间:
                        </el-col>
                        <el-col :span="2">
                            年
                        </el-col>
                        <el-col :span="2">
                            月
                        </el-col>
                        <el-col :span="2">
                            日
                        </el-col>
                        <el-col :span="2">
                            时
                        </el-col>
                        <el-col :span="2">
                            分
                        </el-col>
                    </el-row>
                    <hr>
                    <el-row>
                        <el-col :span="4">
                            &nbsp;修复情况:
                        </el-col>
                        <el-col :span="3">
                            <el-checkbox v-model="checked">已修复</el-checkbox>
                        </el-col>
                        <el-col :span="3">
                            <el-checkbox v-model="checked">未修复</el-checkbox>
                        </el-col>
                        <el-col :span="8">
                            未修复原因：
                        </el-col>

                    </el-row>
                    <hr>

                    <el-row style="margin-bottom: 10px">
                        <el-col :span="4">
                            &nbsp;维修内容：
                        </el-col>
                        <el-col :span="12">
                            维修所在的位置{{form.repair_place}}，主要维修原因是{{form.content}}
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            &nbsp;用工、用料及费用：
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;margin-top: 10px">
                        <el-col :span="4">
                            &nbsp;
                        </el-col>
                        <el-col :span="14">
                            材料费：{{form.material_cost}} 元；维修费：{{form.maintenance_cost}} 元；合计费用：{{form.offer}} 元
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="10">
                            &nbsp;维修人员签字：
                        </el-col>
                        <el-col :span="4">
                            完成时间：
                        </el-col>
                        <el-col :span="2">
                            年
                        </el-col>
                        <el-col :span="2">
                            月
                        </el-col>
                        <el-col :span="2">
                            日
                        </el-col>
                        <el-col :span="2">
                            时
                        </el-col>
                        <el-col :span="2">
                            分
                        </el-col>
                    </el-row>
                    <hr>
                    <el-row style="margin-bottom: 30px">
                        <el-col :span="8">
                            &nbsp;其他反馈意见：
                        </el-col>


                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            &nbsp;
                        </el-col>
                        <el-col :span="8">
                            业主签字：
                        </el-col>
                        <el-col :span="2">
                            年
                        </el-col>
                        <el-col :span="2">
                            月
                        </el-col>
                        <el-col :span="2">
                            日
                        </el-col>

                    </el-row>
                    <hr>
                    <el-row>
                        <el-col :span="10">
                            &nbsp;主管回访：
                        </el-col>
                        <el-col :span="4">
                            时间：
                        </el-col>
                        <el-col :span="2">
                            年
                        </el-col>
                        <el-col :span="2">
                            月
                        </el-col>
                        <el-col :span="2">
                            日
                        </el-col>
                        <el-col :span="2">
                            时
                        </el-col>
                        <el-col :span="2">
                            分
                        </el-col>
                        <el-col :span="10">
                            &nbsp;主任回访：
                        </el-col>
                        <el-col :span="4">
                            时间：
                        </el-col>
                        <el-col :span="2">
                            年
                        </el-col>
                        <el-col :span="2">
                            月
                        </el-col>
                        <el-col :span="2">
                            日
                        </el-col>
                        <el-col :span="2">
                            时
                        </el-col>
                        <el-col :span="2">
                            分
                        </el-col>
                    </el-row>
                    <hr>
                    <el-row>
                        <el-col>
                            &nbsp;备注：
                        </el-col>
                        <el-col style="height: 250px">

                        </el-col>
                    </el-row>

                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">

                <el-button @click="closeDistribution">取 消</el-button>
                <el-button @click="print">打印</el-button>

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

                primaryVisble: false,
                resource: '',
                dialogVisible: false,
                imgSrc: "",
                showFlag: false,
                radio: "1",
                url: 'http://localhost:8082/static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                checked: false,
                user_list: [],
                options: [{
                    value: '1小时',
                    label: '1小时'
                }, {
                    value: '2小时',
                    label: '2小时'
                }, {
                    value: '3小时',
                    label: '3小时'
                }, {
                    value: '半天',
                    label: '半天'
                }, {
                    value: '一天',
                    label: '一天'
                }],
                duration: "1小时",
                form: {
                    _id: "",
                    openID: "",
                    repair_place: "",
                    content: "",
                    staff_tel: "",
                    staff_name: "",
                    date: "",
                    picture: [],
                    position: "",
                    material_cost: "",
                    maintenance_cost: "",
                    offer: "",
                    order_state: "",
                    order_type: ""
                },
                total: 10,
                currentPage: 0,
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

            // 获取所有待处理维修单
            getData() {
                //查询所有的待处理维修单
                api.getOrder(this.cur_page, this.pageSize, {"$or": [{"order_state": "repairing"}]}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
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
                        [selectCate]: selectWord,
                        "$or": [{"order_state": "repairing"}]
                    }
                    //请求搜索接口
                    api.getOrder(this.page, this.pageSize, param)
                        .then(res => {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        })
                }
            },
            //显示大图片
            bigImg(imgUrl) {
                this.imgSrc = imgUrl;
                this.showFlag = true;
            },
            //关闭弹框的事件
            closeDialog() {
                //清空数据
                this.imgSrc = "";
                this.showFlag = false;
            },
            //取消打印
            closeDistribution() {
                this.getData();
                this.editVisible = false;
            },
            //选择人员
            onRadioChange(item) {
                //console.log("item", item);
                //console.log("----" + this.user_list[item].telephone_number);
                this.form.staff_tel = this.user_list[item].telephone_number;
                this.form.staff_name = this.user_list[item].maintenance_name;
            },
            // 保存分配人員
            saveEdit() {
                //this.$set(this.tableData, this.idx, this.form);
                console.log(this.idx + "this.idx");


                console.log("---staff_tel--" + this.form.staff_tel);
                console.log("---this._id--" + this.form._id);
                console.log("--ssss-" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

                const item = this.tableData[this.idx];
                var id = this.form._id;
                var param = {
                    content: item.content,
                    date: this.form.date,
                    maintenance_cost: item.maintenance_cost,
                    material_cost: item.material_cost,
                    offer: item.offer,
                    order_state: "repairing",
                    order_type: item.order_type,
                    picture: item.picture,
                    repair_place: item.repair_place,
                    staff_name: this.form.staff_name,
                    staff_tel: this.form.staff_tel
                };
                console.log(param);
                //执行更新操作
                api.updateOrder(id, param)
                    .then(res => {
                        console.log(res);
                        //需要执行
                        this.$message.success("派单成功");
                        //this.getData();
                        //显示打印按钮
                        this.primaryVisble = true;
                    });


            },
            //订单分配人员
            distributionEdit(index, row, showPrimary) {
                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    _id: item._id,
                    repair_place: item.repair_place,
                    content: item.content,
                    staff_tel: item.staff_tel,
                    staff_name: item.staff_name,
                    date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    picture: item.picture,
                    material_cost: item.material_cost,
                    maintenance_cost: item.maintenance_cost,
                    offer: item.offer,
                    order_state: item.order_state,
                    order_type: item.order_type
                };
                //获取所有的维修工人员信息
                api.getAllMaintenance()
                    .then(res => {
                        console.log(res.data.success);
                        if (res.data.success) {
                            this.user_list = res.data.data;
                            if (this.user_list.length > 0 && showPrimary == false) {
                                this.form.staff_name = this.user_list[0].maintenance_name;
                                this.form.staff_tel = this.user_list[0].telephone_number;
                            }

                        }
                    });

                this.primaryVisble = showPrimary;
                this.editVisible = true;
            },
            //选择查询类别
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //打印功能
            print() {
                this.remove_ie_header_and_footer();
                let subOutputRankPrint = document.getElementById('printTest');
                console.log(subOutputRankPrint.innerHTML);
                let newContent = subOutputRankPrint.innerHTML;
                let oldContent = document.body.innerHTML;
                document.body.innerHTML = newContent;
                window.print();
                window.location.reload();
                document.body.innerHTML = oldContent;
                return false;
            },

            //去掉页眉和页脚
            remove_ie_header_and_footer() {
                var hkey_path;
                hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
                try {
                    var RegWsh = new ActiveXObject("WScript.Shell");
                    RegWsh.RegWrite(hkey_path + "header", "");
                    RegWsh.RegWrite(hkey_path + "footer", "");
                } catch (e) {
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

    .title-top {
        padding: 5px;
        width: 100%;
        margin: auto;
        font-size: 26px;
        text-align: center;
    }

    .col-title {
        width: 100%;
        padding: 5px;
        text-align: center;
        font-size: 24px;
    }

    hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }


</style>
