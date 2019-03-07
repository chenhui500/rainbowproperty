<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
    <div class="table">

        <div class="container">

            <div class="handle-box">
                <el-button type="primary" @click="addSynopsis">新 增</el-button>
            </div>
            <!--显示列表-->
            <el-table :data="tableData" border class="table"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      >

                <el-table-column prop="imgUrl" label="图片">
                    <img src="imgUrl"/>
                    <template slot-scope="scope">
                            <img :src="scope.row.imgUrl" style="width:160px;height:100px;" v-popover:popover  @click="bigImg(scope.row.imgUrl)">
                    </template>
                </el-table-column>
                <el-table-column prop="hyperlink" label="超链接地址">

                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">


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
        <!--新增-->
        <el-dialog :visible.sync="modelShow">
        <el-form :model="form" label-width="80px"  ref="ruleForm">
            <el-form-item label="超链接" prop="repair_place">
                <el-input v-model="form.hyperlink"></el-input>
            </el-form-item>

            <el-form-item label="图片">

                <el-upload
                    :action="uploadImgUrl"
                    list-type="picture-card"
                    accept="image/jpeg,image/gif,image/png"
                    :limit="1"
                    :on-success="successHandle"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>

            </el-form-item>

        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modelShow = false">取 消</el-button>
                <el-button type="primary" @click="addCarousel" >确 定</el-button>
            </div>
        </el-dialog>
        <!--删除-->
        <el-dialog
            title="提示"
            width="30%"
            :visible.sync="dellDialogVisible"
              @close='closeDistribution'
        >
            <span>确定要删除数据？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dellDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="synopsisDel">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>

    import config from '@/config'
    import * as api from '@/api/index.js';
    let base = config[process.env.NODE_ENV].host; //接口地址
    export default {
        data() {
            return {
                dellDialogVisible:false,
                imgSrc: "",
                showFlag: false,
                dialogImageUrl: '',
                dialogVisible: false,
                modelShow: false, //新增修改莫弹框开关
                imgBaseUrl:base+'img/',
                uploadImgUrl:base+'upload',
                dialogVisible: false,
                tableData: [],
                cur_page: 1,
                editVisible: false,
                addVisible: true,
                form: {
                    _id: "",
                    imgUrl: "",
                    hyperlink:""
                },
                formMovie:{posterURL:""},
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
            handleRemove(file, fileList) {
                console.log("handleRemove:"+file.url)
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                console.log("handlePictureCardPreview:"+file.url)
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            //初始化数据
            getData() {
                //获取所有的数据
                api.getCarouselImgLists(this.cur_page, this.pageSize, {}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            //弹出新增框
            addSynopsis() {
                this.modelShow=true;
            },


            //取消
            closeDistribution() {
                this.getData();
                this.editVisible = false;
                this.addVisible = false;
            },


            //显示确认删除框
            showRewardDel(index){
                this.idx = index;
                this.dellDialogVisible= true;
            },

            //关闭弹框的事件
            closeDialog() {
                //清空数据
                this.imgSrc = "";
                this.showFlag = false;
            },
            successHandle(response, file, fileList){
                console.log(response, file, fileList)
                this.form.imgUrl=this.imgBaseUrl+response.filename
                /*this.form.picture.push({minFilename:this.imgBaseUrl+response.minFilename,
                    filename:this.imgBaseUrl+response.filename})*/
            },
            //新增数据
            addCarousel(){
                let param={
                    imgUrl:this.form.imgUrl,
                    hyperlink:this.form.hyperlink
                }
                //执行更新方法
                api.addCarouselImg(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.modelShow = false;
                            this.$message.success("新增成功");
                            this.getData();
                        } else {
                            this.$message.error("新增不成功");
                        }

                    });
            },
            //显示大图片
            bigImg(imgUrl) {
                this.imgSrc = imgUrl;
                this.showFlag = true;
            },
            //删除
            synopsisDel() {
                var index=this.idx;
                const item = this.tableData[index];
                //参数
                var param = {
                    cid: item._id
                };
                //执行
                api.delCarouselImg(param)
                    .then(res => {
                        res.data.success
                        if (res.data.success) {
                            this.dellDialogVisible= false;
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
