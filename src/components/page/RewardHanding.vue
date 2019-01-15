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
                <el-table-column prop="reward_title" label="标题">
                </el-table-column>
                <el-table-column prop="reward_content" label="说明内容">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="orderEdit(scope.$index)">
                            编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" @click="showRewardDel(scope.$index)">
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


        <!--<div class="components-container">
            <div class="info">UE编辑器示例<br>需要使用编辑器时，调用UE公共组件即可。可设置填充内容defaultMsg，配置信息config(宽度和高度等)，可调用组件中获取内容的方法。</div>
            <button @click="getUEContent()">获取内容</button>
            <div class="editor-container">
                <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
            </div>
        </div>-->





<!--
        <template>
            <div class="accept-container">
                <div class="go-back" v-show="goBackState" @click="goBack">GoBack</div>
                <ul>
                    <li v-for="item in webAddress">
                        <a :href="item.link" target="showHere" @click="showIframe">{{item.name}}</a>
                    </li>
                </ul>
                <iframe v-show="iframeState" id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src=""></iframe>


            </div>
        </template>
-->

<!--    可以张贴文本

        <template>
            <div class="ui-editor"
                 contenteditable="true"
                 @paste="paste"
                 @input="input"></div>
        </template>
-->


        <!-- 编辑派单信息 弹出框 -->
        <el-dialog title="" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest">
               <!-- <iframe v-show="true" style="width: 300px"   id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src="http://localhost:8088/Ue/index.jsp"></iframe>-->

                <div v-if="addVisible==true">
                    <iframe id="add_iframe" name="add_iframe" width="870" height="600" frameborder="0" scrolling=auto src="http://localhost:8088/Ue/index.jsp" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true"   allowfullscreen="true"></iframe>
                </div>
                <div v-else>

                    <iframe id="ed_iframe" name="ed_iframe" width="870" height="600" frameborder="0" scrolling=auto :src="upRewardUrl"   marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true"   allowfullscreen="true"></iframe>
                </div>


              <!--  <el-form :model="form" label-width="180px" ref="ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <div style="padding-top: 15px; padding-bottom:15px;text-align: center;font-size: 20px;">
                                推荐奖励说明
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="推荐奖励标题:" prop="reward_title">
                                <el-input v-model="form.reward_title" placeholder="请输入标题内容"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="推荐奖励内容:" prop="reward_content">
                                <el-input
                                    type="textarea"
                                    :rows="8"
                                    placeholder="请输入内容"
                                    v-model="form.reward_content">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>-->

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
            <span>确定要删除数据？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="rewardDel">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import UE from '@/components/common/ue.vue';
    import * as api from '@/api/index.js';
    import moment from 'moment';

    export default {
        name: 'hello',
        components: {UE},
        props: {
            value: String
        },
        data() {
            return {
                upRewardUrl:"http://localhost:8088/Ue/updateReward.jsp",
                iframeState:false,
                goBackState:false,
                webAddress: [
                    {
                        name:'segmentFault',
                        link:'http://localhost:8088/Ue/index.jsp'
                    }
                ],
                defaultMsg: '这里是UE测试',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350,
                    UEDITOR_HOME_URL:'static/ueditor/'
                },
                html: '',
                dialogVisible: false,
                tableData: [],
                cur_page: 1,
                editVisible: false,
                addVisible: true,
                form: {
                    _id: "",
                    reward_title: "",
                    reward_content: ""
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

        watch: {
            value(v) {
                if (v !== this.html) {
                    this.$el.innerHTML = v
                }
            }
        },


        methods: {
            goBack(){
                this.goBackState = false;
                this.iframeState = false;
            },
            showIframe(){
                this.goBackState = true;
                this.iframeState = true;
            },

            getUEContent() {
                let content = this.$refs.ue.getUEContent();
                this.$notify({
                    title: '获取成功，可在控制台查看！',
                    message: content,
                    type: 'success'
                });
                console.log(content)
            },
            paste(e) {
                e.preventDefault()
                const html = e.clipboardData.getData('text/html')
                document.execCommand('insertHTML', false, html)
                this.input()
            },
            input() {
                const v = this.$el.innerHTML
                this.html = v
                this.$emit('input', v)
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            //初始化数据
            getData() {
                //获取所有的数据
                api.getRewardList(this.cur_page, this.pageSize, {}).then(res => {
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


               /* var reward_title = this.form.reward_title
                var reward_content = this.form.reward_content
                //参数
                var param = {
                    reward_title: reward_title,
                    reward_content: reward_content
                };
                //执行新增方法
                api.addReward(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.editVisible = false;
                            this.$message.success("添加成功");
                        } else {
                            this.$message.error("添加不成功");
                        }

                    });
                */
            },
            //弹出详情编辑框
            orderEdit(index) {
                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    _id: item._id,
                    reward_title: item.reward_title,
                    reward_content: item.reward_content
                }
                console.log("===="+item._id)
                this.upRewardUrl="http://localhost:8088/Ue/updateReward.jsp?id="+item._id;
                this.editVisible = true;
                this.addVisible = false;
            },
            //显示确认删除框
            showRewardDel(index){
                this.idx = index;
                this.dialogVisible= true;
            },
            //删除
            rewardDel() {
                var index=this.idx;
                console.log("--index--"+index);
                const item = this.tableData[index];
                console.log("--item--"+item);
                //参数
                var param = {
                    rewardId: item._id
                };
                //执行新增方法
                api.delReward(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.dialogVisible= false;
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error("删除不成功");
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

    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }

    .ui-editor {
        margin: 10px auto;
        width: 100%;
        min-height: 300px;
        padding: 0 15px;
        box-shadow: inset 0 0 12px rgba(63, 70, 82, 0.5);
        background-color: #fff;
        overflow: hidden;
        user-select: all;


    }

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
