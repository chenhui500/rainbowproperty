<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">

        <div class="container">

            <div class="handle-box">
                <el-button type="primary" @click="addReward">新 增</el-button>


            </div>
            <div class="handle-box">
                <label style="color: #20a0ff">备注说明（推广类型）：0 默认推广文章 ; 1 加入我们 ; 2 客户开放日; 3 彩虹生活 ;4 配件展示</label>
            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="news_title" label="推广标题">
                </el-table-column>

                <el-table-column prop="news_type" label="推广类型">
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



        <!-- 编辑派单信息 弹出框 -->
        <el-dialog title="" :visible.sync="editVisible" @close='closeDistribution'>
            <div id="printTest">
                <!-- <iframe v-show="true" style="width: 300px"   id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src="http://localhost:8088/Ue/index.jsp"></iframe>-->

                <div v-if="addVisible==true">
                    <iframe id="add_iframe" name="add_iframe" width="850" height="600" frameborder="0" scrolling=auto src="https://yuyue.rainbowsystem.cn:8888/Ue/addNews.jsp" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true"   allowfullscreen="true"></iframe>
                </div>
                <div v-else>

                    <iframe id="ed_iframe" name="ed_iframe" width="850" height="600" frameborder="0" scrolling=auto :src="upRewardUrl"   marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true"   allowfullscreen="true"></iframe>
                </div>



            </div>

            <div slot="footer" class="dialog-footer">


                <div v-if="addVisible==true">
                    <el-button @click="editVisible = false">关 闭</el-button>
                    <!-- <el-button @click="editVisible = false">取 消</el-button>-->
                    <!-- <el-button type="primary" @click="saveAdd">确 定</el-button>-->
                </div>
                <div v-else>
                    <el-button @click="editVisible = false">关 闭</el-button>
                    <!--<el-button @click="editVisible = false">取 消</el-button>-->
                    <!--<el-button type="primary" @click="saveEdit">确 定</el-button>-->
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
                upRewardUrl:"https://yuyue.rainbowsystem.cn:8888/Ue/updateNews.jsp",
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
                    news_type: "",
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
                api.getNewsList(this.cur_page, this.pageSize, {}).then(res => {
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


            },
            //保存新增
            saveAdd() {

            },
            //弹出详情编辑框
            orderEdit(index) {
                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    _id: item._id,
                    news_title: item.news_title,
                    news_content: item.news_content
                }
                console.log("===="+item._id)
                this.upRewardUrl="https://yuyue.rainbowsystem.cn:8888/Ue/updateNews.jsp?id="+item._id;
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
                    newsId: item._id
                };
                //执行新增方法
                api.delNews(param)
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

















