<template>
    <div>
        <self-dialog 
            ref="deviceSelectRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '85%', top: '3rem'}" 
            @close="close"
            >
            <div>
                <!-- 搜索 -->
                <div style="">
                    <el-select v-model="searchType" placeholder="请选择" @change="changeSearchType" class="switchSearchType" style="width: 11rem;">
                        <!-- <el-option label="设备名称/资产编号" value="deviceName/device_id"></el-option> -->
                        <!-- <el-option label="设备平台" value="total"></el-option> -->
                        <el-option label="设备平台" value="total"></el-option>
                        <el-option label="替换设备" value="replace"></el-option>
                        <el-option label="模拟器" value="simulator"></el-option>
                    </el-select>
                    <el-input v-if="searchType == 'total'" ref="selectref" style="width: 22rem;" v-model="searchValue" placeholder="请输入内容" @keyup.enter.native="aaaa"></el-input>
                    <el-button v-if="searchType == 'total'" id="bbb" type="primary" icon="el-icon-search" @click="searchData" style="border-radius: 0 4px 4px 0;">搜索</el-button>
                    <span v-if="searchType == 'total'">
                    
                        <a v-if="deviceList && deviceList[0] && deviceList[0].id" :href="'http://mtl-devices.leihuo.netease.com:30064/devices/page/devicesInfo?id=' + deviceList[0].id" target="blank" style="margin-left: 15px;">点此查看设备信息</a>
                        <a v-else href="http://mtl-devices.leihuo.netease.com:30064/devices/page/devicesInfo" target="blank" style="margin-left: 15px;">点此进入设备平台</a>
                    </span>
                    <span v-if="searchType == 'replace'">
                        <el-autocomplete
                            class="inline-input"
                            v-model="replaceDevice.device_id"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入设备编号"
                            style="width:22rem"
                            @select="getDeiveData"
                        ></el-autocomplete>
                        <el-tooltip placement="top" effect="light" content="重新获取设备信息">
                            <i class="el-icon-refresh" @click="getDeiveData"></i>
                        </el-tooltip>
                    </span>
                    <span v-if="searchType == 'simulator'">
                        <el-select 
                            v-model="replaceDevice.device" 
                            filterable 
                            clearable
                            placeholder="请选择测试机型"
                            style="width:22rem"
                            allow-create
                            >
                            <el-option v-for="(item,index) in asDeviceOptions" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </span>
                </div>

                <!-- 雷火MTL设备库 -->
                <div v-if="searchType == 'total'">
                    <!-- 已筛选的条件 -->
                    <div id="filterConditionDiv" style="margin-top: 5px;">
                        <span style="display:inline-block">已筛选的条件:</span>
                        <div id="selectedConditionDiv">
                            <div v-for="item in selectedCondition" :key="item.value" style="display: inline-block;">
                                <el-tag size="small" class="conditionTag" closable :disable-transitions="false" @close="removeTag(item,false)" :title="item.name">
                                    <span> {{item.typeName}} : {{item.name}} </span>
                                </el-tag>
                            </div>
                        </div>
                        <div id="clearFilter">
                            <el-button size="mini" @click="clearFilterTag($event)">清空</el-button>
                        </div>
                    </div>

                    <!-- 筛选 -->
                    <ul id="filterUl" @mouseleave="expandModel('')" style="background: #fff;">
                        <li class="filterLi" v-for="(item,index) in totalCondition" :key="index" style="position: relative;">
                            <span class="conditionType" @mouseenter="expandModel('')">
                                <span style="align-self:center" v-for="(conditionValue,conditionKey,index1) in item" :key="index1">
                                    <span v-if="item[conditionKey].name != '地点'">{{item[conditionKey].name}}</span>
                                </span>
                            </span>
                            <div class="itemDetail" v-for="(conditionValue,conditionKey,index2) in item" :key="index2">
                                <!-- 多选单个值 z-index: 12!important; -->
                                <div v-if="typeof(conditionValue.data[0]) != 'object'"
                                    :ref="'filterNoramlItem' + index"
                                    style="padding-right: 120px;height: 35px;overflow: hidden;"
                                    @mouseenter="expandModel('')"
                                >
                                    <!-- 筛选条件 -->
                                    <div class="conditionItem" v-for="(itemData,index3) in conditionValue.data" :key="index3" style="padding: 0.51rem 0.4rem;border: 1px solid #fff;">
                                        <!-- 屏幕类型 -->
                                        <span v-if="multipleSelectData[index] === false">
                                            <!-- style="padding: 0.51rem 0.4rem;" -->
                                            <span style="padding: 0.4rem;" v-if="conditionKey === 'screenType'" @click="addTag(itemData,item[conditionKey],conditionKey,multipleSelectData[index])">
                                                {{itemData}}
                                                <el-tooltip class="item" effect="dark" placement="top" :open-delay='200'>
                                                    <div slot="content">
                                                        <span>
                                                            {{ screenTypeTips[itemData] }}
                                                        </span>
                                                    </div>
                                                    <img class="questionImg" src="../../../assets/img/question.png" v-if="screenTypeTips[itemData]" style="" />
                                                </el-tooltip>
                                            </span>
                                            <!-- padding: 0.51rem 0.4rem; -->
                                            <span style="padding: 0.4rem;" v-else @click="addTag(itemData,item[conditionKey],conditionKey,multipleSelectData[index])">
                                                {{itemData}}
                                            </span>
                                        </span>
                                        <el-checkbox v-else @change="addMultipleSelectItem(itemData,item[conditionKey].name,conditionKey)">{{itemData}}</el-checkbox>
                                    </div>

                                    <!-- 除了os、其他 的确定、取消 -->
                                    <div class="multipleSelectDiv" v-if="multipleSelectData[index] == true">
                                        <div style="width: 46px;">
                                            <el-button type="primary" size="mini" 
                                                v-if="conditionKey !== 'qita' && conditionKey !== 'os' && isShowSureBtn"
                                                @click="submitMultipleSelect(index, '', '', '')" 
                                            >
                                                确定
                                            </el-button>
                                        </div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" 
                                                v-if="conditionKey !== 'qita' && conditionKey !== 'os'"
                                                @click="cancelMultipleSelect(index, conditionKey, $event)" 
                                            >
                                                取消
                                            </el-button>
                                        </div>
                                    </div>
                                    <!-- 除了os、其他 的多选 -->
                                    <div class="multipleSelectDiv" v-else>
                                        <div style="width: 46px;">
                                            <el-button size="mini" v-if="conditionValue.isShowMore" @click="expandNormalItem(index, conditionKey)">更多</el-button>
                                            <el-button size="mini" v-if="conditionValue.isShowFold" @click="foldNormalItem(index, conditionKey)">收起</el-button>
                                        </div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" 
                                                v-if="conditionKey !== 'qita' && conditionKey !== 'os'"
                                                @click="changeMultipleSelect(index, $event, conditionKey, '')" 
                                            >
                                                多选
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 系统版本 os filterOsItem -->
                                <div v-if="conditionKey === 'os'" :ref="'filterNoramlItem' + index"
                                    style="position: relative;padding-right: 120px;height: 35px;overflow: hidden;"
                                >
                                    <!-- 非多选 multipleSelectData[index] == false && isShowBigOs-->
                                    <div v-if="isShowBigOs">
                                        <div class="conditionItem itemDataOsInfo" v-for="(itemData,index3) in conditionValue.data" :key="index3" 
                                            @mouseenter="openOsMoreDetail(itemData, index3, index)" 
                                            @click="addTag(itemData.name,item[conditionKey],conditionKey,multipleSelectData[index])"
                                            style="padding: 0.51rem 0.4rem;border: 1px solid #fff;"
                                        >
                                            <span class="itemInfo" style="padding:0.4rem;">
                                                {{itemData.name}}
                                                <i :class="curOsHoverIconIndex === index3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <!-- 多选 -->
                                    <div v-else>
                                        <div v-for="(itemData,index3) in conditionValue.data" :key="index3" style="display: inline-block;padding: 0.51rem 0.4rem;margin-left:0.625rem;">
                                            <el-checkbox @change="addMultipleSelectItem(itemData.name,item[conditionKey].name,conditionKey)">{{itemData.name}}</el-checkbox>
                                        </div>
                                    </div>
                                    <!-- os的确定、取消  v-if="multipleSelectData[index] == true"-->
                                    <div class="multipleSelectDiv" v-if="multipleSelectData[index] == true && isShowBigosMore">
                                        <div style="width: 46px;">
                                            <el-button type="primary" size="mini"
                                                v-if="isShowSureBtn"
                                                @click="submitMultipleSelect(index, '', '', '')" 
                                            >确定</el-button>
                                        </div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" @click="cancelMultipleSelect(index, 'big' + conditionKey, $event)" >取消</el-button>
                                        </div>
                                    </div>
                                    <!-- 更多、收起 -->
                                    <div class="multipleSelectDiv" v-else>
                                        <div style="width: 46px;">
                                            <el-button size="mini" v-if="conditionValue.isShowMore" @click="expandNormalItem(index, conditionKey)">更多</el-button>
                                            <el-button size="mini" v-if="conditionValue.isShowFold" @click="foldNormalItem(index, conditionKey)">收起</el-button>
                                        </div>
                                        <!-- os 多选 -->
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" 
                                                @click="changeMultipleSelect(index, $event, conditionKey, 'bigos')"
                                            >
                                                多选
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 蓝框 系统版本 -->
                                <div v-if="conditionKey == 'os' && isShowOs" :style="{top: currentOsTop + 'px', left: blueBoxLeftVal + 'px'}" 
                                    @mouseleave="expandModel('os')"
                                    class="osBlueBox"
                                    style="position: absolute;border: solid 1px #3e72fd;border-radius: 5px;background: #fff;z-index: 20;padding: 45px 170px 45px 5px;">
                                    <div class="conditionItem" v-for="(itemData,index3) in osOpenItem.data" :key="index3" style="padding: 0.51rem 0.4rem;">
                                        <span class="itemInfo" style="padding:0.4rem;"
                                            v-if="multipleSelectData[index] === false"
                                            @click="addTag(itemData,item[conditionKey],conditionKey,multipleSelectData[index])"
                                        >
                                            {{itemData}}
                                        </span>
                                        <el-checkbox v-else @change="addMultipleSelectItem(itemData,item[conditionKey].name,conditionKey)">{{itemData}}</el-checkbox>
                                    </div>
                                    <!-- 确定、取消 -->
                                    <div class="multipleSelectDiv" v-if="multipleSelectData[index] == true" style="top: 50px;">
                                        <div style="width: 46px;">
                                            <el-button type="primary" size="mini" v-if="isShowSureBtn" @click="submitMultipleSelect(index, 'os', '', '')">确定</el-button>
                                        </div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" @click="cancelMultipleSelect(index, conditionKey, $event)">取消</el-button>
                                        </div>
                                    </div>
                                    <!-- 多选 -->
                                    <div class="multipleSelectDiv" v-else style="top: 50px;">
                                        <div style="width: 46px;"></div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini"  @click="changeMultipleSelect(index, $event, conditionKey, 'smallos')">多选</el-button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 其他 qita filterQiTaItem -->
                                <div v-if="conditionKey === 'qita'" :ref="'filterNoramlItem' + index"
                                    style="position: relative;padding-right: 120px;height: 35px;overflow: hidden;"
                                >
                                    <!-- 显示内容 -->
                                    <div class="conditionItem itemDataQiTaInfo" v-for="(itemData,index3) in conditionValue.data" :key="index3" 
                                        @mouseenter="openQiTaMoreDetail(itemData, index3, index)" style="padding: 0.51rem 0.4rem;border: 1px solid #fff;"
                                    >
                                        <span class="itemInfo" style="padding:0.4rem;" v-if="itemData.name_value === 'openGLES'">
                                            {{itemData.name}}
                                            <el-tooltip class="item" effect="dark" placement="top">
                                                <div slot="content">
                                                    <span>
                                                        OpenGL ES (OpenGL for Embedded Systems) 是 OpenGL 三维图形 API 的子集，针对手机、PDA和游戏主机等嵌入式设备而设计。<br/>
                                                        手机端下载devcheck，在硬件页面可查询到OpenGL版本
                                                    </span>
                                                </div>
                                                <img class="questionImg" src="../../../assets/img/question.png" style="" />
                                            </el-tooltip>
                                            <i :class="curQitaHoverIconIndex === index3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                        </span>
                                        <!-- 是否热门设备 -->
                                        <!-- hotDevice -->
                                        <span class="itemInfo" style="padding:0.4rem;" v-else-if="itemData.name_value === 'hotDevice'">
                                            {{itemData.name}}
                                            <el-tooltip class="item" effect="dark" placement="top">
                                                <div slot="content">
                                                    <span>
                                                        热门设备的定义：<br/>
                                                        1) 大陆市场覆盖率TOP50 <br/>
                                                        2) 大厂三年内旗舰（华为、三星、OPPO、vivo、魅族、小米）<br/>
                                                        华为：Mate 系列、P 系列 <br/>
                                                        荣耀：荣耀系列 <br/>
                                                        三星：S 系统、Note 系列 <br/>
                                                        OPPO：Reno 系列、Find 系列 <br/>
                                                        vivo：X 系列、NEX 系列、iQOO 系列 <br/>
                                                        魅族：魅族系列、魅蓝 Note 系列 <br/>
                                                        小米：小米系列、Note 系列 <br/>
                                                        红米：Note 系列
                                                    </span>
                                                </div>
                                                <img class="questionImg" src="../../../assets/img/question.png" style="" />
                                            </el-tooltip>
                                            <i :class="curQitaHoverIconIndex === index3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                        </span>
                                        <span class="itemInfo" style="padding:0.4rem;" v-else>
                                            {{itemData.name}}
                                            <i :class="curQitaHoverIconIndex === index3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                        </span>
                                    </div>
                                    <!-- 更多、收起 -->
                                    <div class="multipleSelectDiv">
                                        <div style="width: 46px;">
                                            <el-button size="mini" v-if="conditionValue.isShowMore" @click="expandNormalItem(index, conditionKey)">更多</el-button>
                                            <el-button size="mini" v-if="conditionValue.isShowFold" @click="foldNormalItem(index, conditionKey)">收起</el-button>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="conditionKey == 'qita' && isShowQiTa" :style="{top: currentQiTaTop + 'px', left: blueBoxLeftVal + 'px'}" 
                                    @mouseleave="expandModel('qita')"
                                    style="position: absolute;border: solid 1px #3e72fd;border-radius: 5px;background: #fff;z-index: 20;padding: 45px 170px 45px 5px;">
                                    <div class="conditionItem" v-for="(itemData,index3) in qiTaOpenItem.value" :key="index3" style="padding: 0.51rem 0.4rem;">
                                        <span class="itemInfo" style="padding:0.4rem;"
                                            v-if="multipleSelectData[index] === false"
                                            @click="addTag(itemData,item[conditionKey],conditionKey,multipleSelectData[index], qiTaOpenItem.name, qiTaOpenItem.name_value)"
                                        >
                                            {{itemData}}
                                        </span>
                                        <el-checkbox v-else @change="addMultipleSelectItem(itemData,item[conditionKey].name,conditionKey)">{{itemData}}</el-checkbox>
                                    </div>
                                    <!-- 多选 -->
                                    <div class="multipleSelectDiv" v-if="multipleSelectData[index] == true" style="top: 50px;">
                                        <div style="width: 46px;">
                                            <el-button type="primary" size="mini" v-if="isShowSureBtn" @click="submitMultipleSelect(index, 'qita', qiTaOpenItem.name, qiTaOpenItem.name_value)">确定</el-button>
                                        </div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" @click="cancelMultipleSelect(index, conditionKey, $event)">取消</el-button>
                                        </div>
                                    </div>
                                    <div class="multipleSelectDiv" v-else style="top: 50px;">
                                        <div style="width: 46px;"></div>
                                        <div style="width: 46px;margin-left: 10px;">
                                            <el-button size="mini" @click="changeMultipleSelect(index, $event, conditionKey, '')">多选</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <!-- 原浮动元素处理 -->
                    <div style="display: flex;align-items: center;justify-content: space-between;padding: 6px 0;">
                        <!-- 左边 -->
                        <div style="display: flex;align-items: center;">
                            <!-- 共多少条数据 -->
                            <div style="color: #333;">
                                共<span style="display: inline-block;font-size: 24px;color: #333;padding: 0 4px;">{{ sizeTotal }}</span>条数据
                                <span style="display: inline-block;font-size: 18px;color: #333;">
                                <!-- （{{ canBorrowNumber }}条可借） -->
                                </span>
                            </div>  
                        </div>
                    </div>

                    <!-- 设备表格 -->
                    <div class="deviceQueryTableContent" >
                        <el-table ref="deviceTableRef" :data="deviceList" max-height="calc(100vh - 400px)" :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <div style="background-color: #f9f9f9;border-radius: 4px;padding: 15px 30px;display: flex;flex-wrap: wrap;">
                                        <!-- device model -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">device model</span>
                                            <span class="expandItemValContent">{{ scope.row.deviceModel }}</span>
                                        </span>
                                        <!-- CPU型号 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">CPU型号</span>
                                            <span class="expandItemValContent">{{ scope.row.cpu_model }}</span>
                                        </span>
                                        <!-- GPU型号 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">GPU型号</span>
                                            <span class="expandItemValContent">{{ scope.row.gpu_model }}</span>
                                        </span>
                                        <!-- CPU核数 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">CPU核数</span>
                                            <span class="expandItemValContent">{{ scope.row.cpu_core }}</span>
                                        </span>
                                        <!-- 屏幕类型 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">屏幕类型</span>
                                            <span class="expandItemValContent">{{ scope.row.show_screen }}</span>
                                        </span>

                                        <!-- 是否Root -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否Root</span>
                                            <span class="expandItemValContent">{{ scope.row.isRoot }}</span>
                                        </span>
                                        <!-- 是否SD卡 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否SD卡</span>
                                            <span class="expandItemValContent">{{ scope.row.sdCard }}</span>
                                        </span>
                                        <!-- Google框架 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">Google框架</span>
                                            <span class="expandItemValContent">{{ scope.row.GooglePlay }}</span>
                                        </span>
                                        <!-- 运营商 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">运营商</span>
                                            <span class="expandItemValContent">{{ scope.row.operators }}</span>
                                        </span>
                                        <!-- OpenGL ES -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent" style="">OpenGL ES</span>
                                            <span class="expandItemValContent">{{ scope.row.openGLES }}</span>
                                        </span>
                                        <!-- 上市时间 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">上市时间</span>
                                            <span class="expandItemValContent">{{ scope.row.AnnounceDate }}</span>
                                        </span>
                                        <!-- 品牌 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">品牌</span>
                                            <span class="expandItemValContent">{{ scope.row.DeviceBrand }}</span>
                                        </span>
                                        <!-- CPU频率 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">CPU频率</span>
                                            <span class="expandItemValContent">{{ scope.row.cpu_freq }}</span>
                                        </span>
                                        <!-- CPU架构 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">CPU架构</span>
                                            <span class="expandItemValContent">{{ scope.row.cpu_framework }}</span>
                                        </span>
                                        <!-- 设备ID -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">设备ID</span>
                                            <span class="expandItemValContent">{{ scope.row.device_id }}</span>
                                        </span>
                                        <!-- unique_id -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">unique_id</span>
                                            <span class="expandItemValContent">{{ scope.row.unique_id }}</span>
                                        </span>
                                        <!-- rfid -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">rfid</span>
                                            <span class="expandItemValContent">{{ scope.row.rfid }}</span>
                                        </span>
                                        <!-- UDID -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">UDID</span>
                                            <span class="expandItemValContent">{{ scope.row.UDID }}</span>
                                        </span>
                                        <!-- 是否ART模式 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否ART模式</span>
                                            <span class="expandItemValContent">{{ scope.row.hasART }}</span>
                                        </span>
                                        <!-- 是否虚拟按键 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否虚拟按键</span>
                                            <span class="expandItemValContent">{{ scope.row.hasNavigationBar }}</span>
                                        </span>
                                        <!-- 是否MHL -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否MHL</span>
                                            <span class="expandItemValContent">{{ scope.row.isMHL }}</span>
                                        </span>
                                        <!-- 是否安装APP -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否安装APP</span>
                                            <span class="expandItemValContent">{{ scope.row.installApp }}</span>
                                        </span>
                                        <!-- 是否HDCP -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否HDCP</span>
                                            <span class="expandItemValContent">{{ scope.row.isHDCP }}</span>
                                        </span>
                                        <!-- 是否登记资产 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否登记资产</span>
                                            <span class="expandItemValContent">{{ scope.row.isRecordProperty }}</span>
                                        </span>
                                        <!-- 是否弹框 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否弹框</span>
                                            <span class="expandItemValContent">{{ scope.row.isPopWindow }}</span>
                                        </span>
                                        <!-- MAC地址 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">MAC地址</span>
                                            <span class="expandItemValContent">{{ scope.row.MACAddress }}</span>
                                        </span>
                                        <!-- 是否热门设备 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent" style="">是否热门设备</span>
                                            <span class="expandItemValContent">{{ scope.row.hotDevice }}</span>
                                        </span>
                                        <!-- 是否淘汰设备 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否淘汰设备</span>
                                            <span class="expandItemValContent">{{ scope.row.outDevice }}</span>
                                        </span>
                                        <!-- CPU厂商 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">CPU厂商</span>
                                            <span class="expandItemValContent">{{ scope.row.cpu_company }}</span>
                                        </span>
                                        <!-- GPU厂商 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">GPU厂商</span>
                                            <span class="expandItemValContent">{{ scope.row.gpu_company }}</span>
                                        </span>
                                        <!-- WIFI频段 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">WIFI频段</span>
                                            <span class="expandItemValContent">{{ scope.row.wifiFreq }}</span>
                                        </span>
                                        <!-- Sandbox -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">Sandbox</span>
                                            <span class="expandItemValContent">{{ scope.row.sandBox }}</span>
                                        </span>
                                        <!-- 备注 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">备注</span>
                                            <span class="expandItemValContent">{{ scope.row.note }}</span>
                                        </span>
                                        <!-- 发行版本 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">发行版本</span>
                                            <span class="expandItemValContent">{{ scope.row.coverage_area }}</span>
                                        </span>
                                        <!-- Systeminfo -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">Systeminfo</span>
                                            <span class="expandItemValContent">{{ scope.row.Systeminfo }}</span>
                                        </span>
                                        <!-- 是否实名绑定 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">是否实名绑定</span>
                                            <span class="expandItemValContent">{{ scope.row.isBinding }}</span>
                                        </span>
                                        <!-- 个人开发者账号 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">个人开发者账号</span>
                                            <span class="expandItemValContent">{{ scope.row.personalDeveloperAccount }}</span>
                                        </span>
                                        <!-- 异形屏位置 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">异形屏位置</span>
                                            <span class="expandItemValContent">{{ scope.row.notch }}</span>
                                        </span>
                                        <!-- 屏幕圆角弧度 -->
                                        <span class="expandItem" style="width: 20%;">
                                            <span class="expandItemContent">屏幕圆角弧度</span>
                                            <span class="expandItemValContent">{{ scope.row.circleCorner }}</span>
                                        </span>
                                        <!-- 屏幕图片 -->
                                        <span class="expandItem" style="width: 20%;display: flex;">
                                            <span class="expandItemContent">屏幕图片</span>
                                            <el-image v-if="scope.row.screen_picture !== ''"
                                                style="width: 40px;height: 40px;"
                                                :src="'/apis'+scope.row.screen_picture" 
                                                :preview-src-list="['/apis'+scope.row.screen_picture]">
                                            </el-image>
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-for="item,index in tableItemList" :label="item.titleName" :key="index" align="center">
                                <template slot-scope="scope">
                                    <div v-if="item.propName == 'status'">
                                        <span v-if="scope.row[item.propName] == 0">可借</span>
                                        <span v-if="scope.row[item.propName] == 1">借用人：{{scope.row.name}}<self-popo :email="scope.row.popo"></self-popo></span>
                                        <span v-if="scope.row[item.propName] == 2">损坏</span>
                                        <span v-if="scope.row[item.propName] == 3">送审</span>
                                        <span v-if="scope.row[item.propName] == 4">自持</span>
                                        <span v-if="scope.row[item.propName] == 5">遗失</span>
                                        <span v-if="scope.row[item.propName] == 6">电量测试机</span>
                                        <span v-if="scope.row[item.propName] == 7">性能测试机</span>
                                        <span v-if="scope.row[item.propName] == 8">管理员临时借用</span>
                                        <span v-if="scope.row[item.propName] == 9">自动化测试机</span>
                                        <span v-if="scope.row[item.propName] == 10">维修中</span>
                                    </div>
                                    <div v-else-if="item.propName !== 'operation'">
                                        {{scope.row[item.propName]}}
                                    </div>
                                    
                                    <div v-else>
                                        <el-button type="primary" size="mini" @click="selectDevice(scope.row)">选用</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <!-- 替换设备 -->
                <!-- <div v-if="searchType == 'replace'" style="margin-top:15px;"> -->
                <div v-else style="margin-top:15px;">
                    <div class="deviceQueryTableContent" >
                        <el-table ref="deviceTableRef" :data="(replaceDevice.device_id && searchType == 'replace') || (replaceDevice.device && searchType == 'simulator') ? [replaceDevice]: []" :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }">
                            <el-table-column v-for="item,index in replaceTableItem" :label="item.titleName" :key="index" align="center">
                                <template slot-scope="scope">
                                    <div v-if="item.propName == 'device_type'">
                                        {{scope.row[item.propName] == 'AS' ? 'Android模拟器':scope.row[item.propName]}}
                                    </div>
                                    <div v-else-if="item.propName !== 'operation'">
                                        {{scope.row[item.propName]}}
                                    </div>
                                    
                                    <div v-else>
                                        <el-button type="primary" size="mini" @click="selectDevice(scope.row)">选用</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            
        </self-dialog>
    </div>
</template>
<script>
import $ from 'jquery'
import qs from 'qs'
import formRule from "@/utils/formRule.js"
export default {
    components: {
        
    },
    props: {
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "设备选择",
            searchType: "total",
            searchValue: "",    // 搜索内容
            selectedCondition: [],
            totalCondition: [],
            pageSize: 30,
            currentPage: 1,
            sizeTotal: 0,
            sortName:'',
            sortOrder:'',
            deviceList: [],
            multipleSelectData: [],
            defaultConditionList: ['deviceType', 'DeviceBrand', 'cpu_model', 'isBorrowed'],
            curOsHoverIconIndex: '',
            curQitaHoverIconIndex: '',
            isShowQiTa: false,
            isShowOs: false,
            myAppointmentFlag: false, // 我的预约状态
            myBorrowFlag: false, // 我的借用状态
            tableItemList: [
                {
                    titleName: "设备编号",
                    propName: "id"
                },
                {
                    titleName: "设备名称",
                    propName: "device"
                },
                {
                    titleName: "系统版本",
                    propName: "os"
                },
                {
                    titleName: "分辨率",
                    propName: "resolution"
                },
                {
                    titleName: "内存",
                    propName: "memory"
                },
                {
                    titleName: "CPU型号",
                    propName: "cpu_model"
                },
                // {
                //     titleName: "覆盖率",
                //     propName: "rank"
                // },
                // {
                //     titleName: "安兔兔跑分",
                //     propName: "tutu"
                // },
                {
                    titleName: "屏幕尺寸",
                    propName: "screen_size"
                },
                {
                    titleName: "借用状态",
                    propName: "status"
                },
                {
                    titleName: "操作",
                    propName: "operation"
                },
            ],
            replaceTableItem: [
                {
                    titleName: "设备编号",
                    propName: "device_id"
                },
                {
                    titleName: "设备类型",
                    propName: "device_type"
                },
                {
                    titleName: "品牌",
                    propName: "brand"
                },
                {
                    titleName: "测试机型",
                    propName: "device"
                },
                {
                    titleName: "系统版本",
                    propName: "os"
                },
                {
                    titleName: "内存",
                    propName: "ram"
                },
                {
                    titleName: "CPU型号",
                    propName: "cpuModel"
                },
                {
                    titleName: "设备来源",
                    propName: "source"
                },
                {
                    titleName: "操作",
                    propName: "operation"
                },
            ],
            totalDeviceIdList: [],
            id: "",
            testContentFormList: {
                id: "",
                device_type: "",//设备类型
                brand: "",//品牌
                device: "",//测试机型
                device_id: "",//设备编号
                os: "",//系统版本
                ram: "",//内存
                cpuModel: "", // CPU型号
            },
            replaceDevice: {
                device_id: "",
                device_type: "",//设备类型
                brand: "",//品牌
                device: "",//测试机型
                os: "",//系统版本
                ram: "",//内存
                cpuModel: "", // CPU型号
                source: "",
            },
            // 设备表头排序
            showSortStatus: {
                all: 'el-icon-d-caret',
                down: 'el-icon-caret-bottom',
                up: 'el-icon-caret-top',
            },
            status_dict : {
                '可借': 0,
                '已借出': 1,
                '损坏': 2,
                '送审': 3,
                '自持': 4,
                '遗失': 5,
                '电量测试机': 6,
                '性能测试机': 7,
                '管理员临时借用':8,
                '自动化测试机':9,
                '维修中':10
            },
            asDeviceOptions: [],
        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch: {
        selectedCondition:function(newVal,oldValue){
            let curArr = []
            if (newVal.length > 0) {
                for (let i = 0; i < this.multipleSelectData.length; i++) {
                    curArr.push(false);
                }
            }
            this.multipleSelectData = curArr;
        },
    },
    created() {
        // 获取所有设备id数据
        this.getTotalDeviceId();
        this.getAsDevices()
    },
    mounted() {
        
    },
    methods: {
        // 切换搜索类型
        changeSearchType(val) {
            this.searchValue = '';
            this.clearBasicContent()
            if(val == 'simulator'){
                this.replaceDevice.device_type = "AS"
            }else if(val == 'total'){
                this.searchData()
            }
        },

        // 获取所有设备id数据
        getTotalDeviceId() {
            let list = {
                selectedCondition: JSON.stringify([]),
                search_range: JSON.stringify(['id']),
            };
            this.$codePost("http://mtl-devices.leihuo.netease.com:30064/devices/get_filter_field_data_fun/", list).then(res => {
                if (res.code == 200) {
                    this.totalDeviceIdList = res.data;
                }
            })
        },
        handleSelect(item) {
            this.searchValue = item.value;
            // 搜索
            this.searchData();
        },
        searchData(){
            this.currentPage = 1;
            let value = this.searchValue;
            // 全部
            if(value.trim() == ''){
                this.removeTag('',true);
            }else{
                let flag = false;
                for(let i=0;i<this.selectedCondition.length;i++){
                    if(this.selectedCondition[i].type == 'search'){
                        this.selectedCondition[i].name = value;
                        this.selectedCondition[i].typeValue = "total";
                        flag = true;
                    }
                }
                if(flag == false){
                    this.selectedCondition.push({'name':value,'type':'search','typeValue':"total",'typeName':'关键字'});
                }
                // this.searchValue = '';
                //获取筛选项
                this.getFilterCondition();
            }
        },

        // 展开表格折叠项
        expandMoreInfo(index, id) {
            if (!this.deviceList[index].isExpand) {
                this.deviceList[index].isExpand = true;
            } else {
                this.deviceList[index].isExpand = false;
            }
            this.$forceUpdate();
        },

        // 远程搜索
        querySearch(queryString, cb) {
            let totalDeviceIdList = this.totalDeviceIdList.map(item => {
                return {value: item};
            });
            let results = queryString ? totalDeviceIdList.filter(this.createFilter(queryString)) : totalDeviceIdList;
            clearTimeout(this.timeout);
            cb(results);
        },

        //设备编号blur后，获取到设备信息，提示是否要填入
        getDeiveData() {
            if (!this.$checkIsNull(this.replaceDevice.device_id)) {
                let list = { table_name: this.$route.query.testRecordName, device_id: this.replaceDevice.device_id };
                this.$codePost("/service/get_device_by_number/", list, { operation: "获取设备具体信息", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        let data = res.data.data;
                        if (res.data.is_repeat) {
                            //重复机型提示
                            this.$selfConfirm("当前测试表中已存在该设备机型，确定仍要添加吗?", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                                this.setReplaceDeviceData(data);
                            }).catch(() => {
                                //取消
                                this.clearBasicContent();
                            });
                        } else {
                            //不重复直接填入
                            this.setReplaceDeviceData(data);
                        }
                    } else {
                        this.clearBasicContent();
                    }
                })
            }
        },
        setReplaceDeviceData(data){
            let deviceType = data.brand == "苹果" ? 'IOS' : 'Android';
            this.$set(this.replaceDevice, "device_type", deviceType);
            this.$set(this.replaceDevice, "brand", data.brand);
            this.$set(this.replaceDevice, "device", data.device);
            this.$set(this.replaceDevice, "os", data.os);
            this.$set(this.replaceDevice, "ram", data.ram);
            this.$set(this.replaceDevice, "cpuModel", data.cpuModel);
            this.$set(this.replaceDevice, "source", data.source);
        },

        //初始化部分数据
        clearBasicContent() {
            this.$set(this.replaceDevice, "brand", "");
            this.$set(this.replaceDevice, "device", "");
            this.$set(this.replaceDevice, "device_id", "");
            this.$set(this.replaceDevice, "os", "");
            this.$set(this.replaceDevice, "ram", "");
            this.$set(this.replaceDevice, "cpuModel", "");
            this.$set(this.replaceDevice, "device_type", "");
            this.$set(this.replaceDevice, "source", "");

            this.$set(this.testContentFormList, "brand", "");
            this.$set(this.testContentFormList, "device_type", "");
            this.$set(this.testContentFormList, "device", "");
            this.$set(this.testContentFormList, "device_id", "");
            this.$set(this.testContentFormList, "os", "");
            this.$set(this.testContentFormList, "ram", "");
            this.$set(this.testContentFormList, "cpuModel", "");
        },

        createFilter(queryString) {
            return (results) => {
                return (results.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },

        //获取筛选项
        getFilterCondition(){
            this.$store.commit("setPageIsLoading",true);
            // this.axios.post('/devices/get_filter_condition/', qs.stringify({
            this.axios.post('/expertCompatibility/get_device_filter_condition/', qs.stringify({
                selectedCondition: JSON.stringify(this.selectedCondition),
                pageSize:this.pageSize,
                currentPage: this.currentPage,
                sortName: this.sortName,
                sortOrder: this.sortOrder,
            })).then(res =>{
                //表格数据
                let resultRows = res.data.data.rows;
                for (let i = 0; i < resultRows.length; i++) {
                    if (resultRows[i].picture_list && resultRows[i].picture_list.length > 0) {
                        for (let j = 0; j < resultRows[i].picture_list.length; j++) {
                            resultRows[i].picture_list[j] = '/apis' + resultRows[i].picture_list[j];
                        }
                    }
                    // new
                    resultRows[i].isExpand = false;
                }
                this.deviceList = resultRows;
                this.sizeTotal = res.data.data.total;
                
                //处理筛选数据
                let conditionData = res.data.data.filter_condition;
                this.totalCondition = [];
                for(let item in conditionData){
                    conditionData[item]['isShowMore'] = false;
                    conditionData[item]['isShowFold'] = false;
                    //多选列表
                    this.multipleSelectData.push(false);
                }
                //整理数据显示顺序
                for(let i=0;i<this.defaultConditionList.length;i++){
                    let defaultItem = {};
                    if(conditionData[this.defaultConditionList[i]] && conditionData[this.defaultConditionList[i]].data && conditionData[this.defaultConditionList[i]].data.length > 0){
                        defaultItem[this.defaultConditionList[i]] = conditionData[this.defaultConditionList[i]];
                        this.totalCondition.push(defaultItem);
                    }
                }
                this.$nextTick(() => {
                    for (let i = 0; i < this.totalCondition.length; i++) {
                        for (let key in this.totalCondition[i]) {
                            if (this.$refs['filterNoramlItem' + i]) {
                                if (this.$refs['filterNoramlItem' + i][0].scrollHeight > 40) {
                                    this.totalCondition[i][key].isShowMore = true;
                                    this.$refs['filterNoramlItem' + i][0].style.height = '35px';
                                } else {
                                    this.totalCondition[i][key].isShowMore = false;
                                    this.totalCondition[i][key]['isShowFold'] = false;
                                }
                            }
                        }
                    }
                })
                // 解决优先级问题
                let ClassTags = document.getElementsByClassName('itemDataQiTaInfo');
                for (let i = 0; i < ClassTags.length; i++) {
                    ClassTags[i].style.zIndex="9";
                    ClassTags[i].style.border="1px solid #fff";
                }
                // 关闭蓝框
                this.$store.commit("setPageIsLoading",false);
            }).catch(err => {
                console.log('err',err)
            })
        },
        aaaa() {
            $("#bbb").trigger('click');
        },

        //删除tag
        removeTag(tagData,isRemoveSearchTag){
            let index = this.selectedCondition.findIndex(item =>{
                //删除搜索的tag
                if(isRemoveSearchTag == true){
                    if(item.type == 'search'){
                        return true;
                    }
                //删除筛选的tag
                }else{
                    if(item.typeName == tagData.typeName && item.name == tagData.name){
                        return true;
                    }
                }
            })
            this.selectedCondition.splice(index,1);
            //获取筛选项
            this.getFilterCondition();
        },
        //清空筛选tag
        clearFilterTag(e){
            e.stopPropagation();
            this.currentPage = 1;
            this.selectedCondition = [];
            // 收起其他蓝框
            this.expandModel('');
            //获取筛选项
            this.getFilterCondition();
        },

        // 收起其他蓝框
        expandModel(type) {
            this.curOsHoverIconIndex = '';
            this.curQitaHoverIconIndex = '';
            if (type === 'qita') {
                // 处理边框问题
                this.dealWithBorder('itemDataQiTaInfo');
                this.isShowQiTa = false;
                //取消多选
                this.cancelMultipleSelect(this.qiTaIndex);
            } else if (type === 'os') {
                // 处理边框问题
                this.dealWithBorder('itemDataOsInfo');
                this.isShowOs = false;
                //取消多选
                this.cancelMultipleSelect(this.osIndex);
            } else if (type === '') {
                if (this.isShowBigOs) {
                    // 处理边框问题
                    this.dealWithBorder('itemDataOsInfo');
                    this.isShowOs = false;
                    //取消多选
                    this.cancelMultipleSelect(this.osIndex);
                    // 处理边框问题
                    this.dealWithBorder('itemDataQiTaInfo');
                    this.isShowQiTa = false;
                    //取消多选
                    this.cancelMultipleSelect(this.qiTaIndex);
                } 
            }
        },
        //切换为多选
        changeMultipleSelect(index, e, key, bigKey){
            this.isShowSureBtn = false;
            if (key === 'DeviceBrand') {
                this.expandNormalItem(index, key);
            }
            if (bigKey === 'bigos') {
                this.expandNormalItem(index, key);
                this.isShowBigOs = false;
                this.isShowBigosMore = true;
                // 关闭系统版本框
                this.isShowOs = false;

                this.osIndex = index;
            } else if (bigKey === 'smallos') {
                this.isShowBigOs = true;
                this.isShowBigosMore = false;
            } else {
                this.isShowBigOs = true;
                this.isShowBigosMore = false;
            }
            for(let i=0;i<this.multipleSelectData.length;i++){
                if(i == index){
                    this.multipleSelectData[i] = true;
                }else{
                    this.multipleSelectData[i] = false;
                }
            }
            this.multipleSelectList = [];
            this.$forceUpdate();
        },
        //添加多选内容
        addMultipleSelectItem(tagName,tagTypeName,tagTypeValue){
            //多选项为空则直接加入内容
            if(this.multipleSelectList.length == 0){
                this.multipleSelectList.push({'name':tagName,'type':'filter','typeValue':tagTypeValue,'typeName':tagTypeName});
            }else{
                
                //多选项不为空则判断是否有重复内容，如果有则删除重复项
                let oldValue = String(this.multipleSelectList[0].name);
                var oldValueList = oldValue.split(',');
                if(oldValueList.indexOf(tagName) != '-1'){
                    oldValueList.splice(oldValueList.indexOf(tagName),1); // tagName第一次出现的位置
                    //去除多余的逗号
                    let newValue = this.dealWithTagName(oldValueList);
                    if(newValue == ''){
                        this.multipleSelectList = [];
                    }else{
                        this.multipleSelectList[0].name = newValue;
                    }
                }else{
                    this.multipleSelectList[0].name += ',' + tagName;
                }
            }
            if (this.multipleSelectList.length === 0) {
                this.isShowSureBtn = false;
            } else {
                this.isShowSureBtn = true;
            }
        },

        // 展开
        expandNormalItem(index, key) {
            this.$refs['filterNoramlItem' + index][0].style.height = '100%';
            if (this.totalCondition[index][key].isShowMore) {
                this.totalCondition[index][key].isShowMore = false;
                this.totalCondition[index][key].isShowFold = true;
            }
            // this.totalCondition[index][key].isShowMore = false;
            // this.totalCondition[index][key].isShowFold = true;
        },
        // 收起
        foldNormalItem(index, key) {
            this.$refs['filterNoramlItem' + index][0].style.height = '35px';
            this.totalCondition[index][key].isShowMore = true;
            this.totalCondition[index][key].isShowFold = false;
        },

        //提交多选
        submitMultipleSelect(index, field, name, nameValue){
            let typeValue = '';
            let typeName = '';
            if (field === 'qita') {
                if(this.multipleSelectList.length > 0){
                    // this.selectedCondition.push(this.multipleSelectList[0]);
                    let obj = {
                        name: this.multipleSelectList[0].name,
                        type: "filter",
                        typeName: name,
                        typeValue: nameValue,
                    }
                    this.selectedCondition.push(obj);
                    typeValue = nameValue;
                    typeName = name; 
                }
                this.qiTaOpenItem = {};
                this.isShowQiTa = false;
            } else {
                let conditionData = this.totalCondition[index];
                let tagName = '';
                typeValue = Object.keys(conditionData)[0];
                typeName = conditionData[typeValue].name;
                let itemData = conditionData[typeValue].data;
                //单个值多选
                if(typeof(itemData[0]) != 'object'){
                    if(this.multipleSelectList.length > 0){
                        this.selectedCondition.push(this.multipleSelectList[0]);
                    }
                //下拉列表多选
                }else{
                    if(this.multipleSelectList.length > 0){
                        this.selectedCondition.push(this.multipleSelectList[0]);
                    }
                    this.osOpenItem = {};
                }
            }
            this.currentPage = 1;
            //获取筛选项
            this.getFilterCondition();
            //取消多选
            this.cancelMultipleSelect(index, '');
            
            let tagsNameArr = [];
            let tagsName = '';
            for (let i = 0; i < this.selectedCondition.length; i++) {
                if (typeValue === this.selectedCondition[i].typeValue) {
                    tagsName = this.selectedCondition[i].name;
                }
            }
            if (tagsName.indexOf(',') != -1) {
                tagsNameArr = tagsName.split(',');
            } else {
                tagsNameArr.push(tagsName)
            }
            // 记录筛选条件
            // this.recordFilterCondition(typeValue, typeName, tagsNameArr);
        },
        //添加tag
        addTag(tagName,tagType,tagTypeValue,isMultipleSelect, name, nameValue){
            let tagTypeName = tagType.name;
            let that=this
            that.stopClick(`stopClickFollow`, 1000, '').then(()=>{
                this.currentPage = 1;
                if(isMultipleSelect == false){
                    if (tagTypeName === '其他') {
                        if (nameValue === 'account') {
                            // if (this.accountDict.personalDeveloperAccount.indexOf(tagName) != -1) {
                            //     nameValue = 'personalDeveloperAccount';
                            // } else if (this.accountDict.sandBox.indexOf(tagName) != -1) {
                            //     nameValue = 'sandBox';
                            // }
                            nameValue = 'sandBox';
                        }
                        if (tagName === '二楼(只能还不能借)') {
                            tagName = tagName.split('(')[0]
                        }
                        this.selectedCondition.push({'name':tagName,'type':'filter','typeValue':nameValue,'typeName':name});
                        this.qiTaOpenItem = {};
                        this.isShowQiTa = false;
                        this.curQitaHoverIconIndex = '';
                    } else {
                        this.selectedCondition.push({'name':tagName,'type':'filter','typeValue':tagTypeValue,'typeName':tagTypeName});
                        this.osOpenItem = {};
                        this.isShowOs = false;
                        this.curOsHoverIconIndex = '';
                    }
                    //获取筛选项
                    this.getFilterCondition();
                }
            })
            let tagNameArr = [];
            tagNameArr.push(tagName)
            // 记录筛选条件
            // this.recordFilterCondition(tagTypeValue, tagTypeName, tagNameArr);
        },

        // 记录筛选条件
        recordFilterCondition(filterCondition, filterConditionName, filterConditionValue) {
            let list = {
                filterCondition: filterCondition, // 英文名
                filterConditionName: filterConditionName, // 中文名
                filterConditionValue: JSON.stringify(filterConditionValue) // 值
            }
            this.axios.post(`/devices/record_filter_condition/`, qs.stringify(list)).then(res => {
                if (res.data.code === 0) {

                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },

        //通过品牌获取测试机型选项
        getAsDevices() {
            this.$codePost("/expertCompatibility/get_simulator_list_array/", {}, { operation: "获取测试机型选项", failed: true }).then(res => {
                if (res.code == 200) {
                    this.asDeviceOptions = res.data;
                }
            })
        },

        //删除tag
        removeTag(tagData,isRemoveSearchTag){
            let index = this.selectedCondition.findIndex(item =>{
                //删除搜索的tag
                if(isRemoveSearchTag == true){
                    if(item.type == 'search'){
                        return true;
                    }
                //删除筛选的tag
                }else{
                    if(item.typeName == tagData.typeName && item.name == tagData.name){
                        return true;
                    }
                }
            })
            this.selectedCondition.splice(index,1);
            //获取筛选项
            this.getFilterCondition();
        },

        //取消多选
        cancelMultipleSelect(index, key, e){
            this.multipleSelectData[index] = false;
            this.isShowBigOs = true;
            this.$forceUpdate();
        },

        // 处理边框问题
        dealWithBorder(className) {
            let ClassTags = document.getElementsByClassName(className);
            for (let i = 0; i < ClassTags.length; i++) {
                ClassTags[i].style.border="1px solid #fff";
                // 解决优先级问题
                ClassTags[i].style.zIndex="9";
            }
        },

        //排序
        getFieldOrder(field, sortStatus, statusVal){
            // 修改其他排序符号
            this.tableFieldName.osSortStatus = 'all';
            this.tableFieldName.memorySortStatus = 'all';
            this.tableFieldName.rankSortStatus = 'all';
            this.tableFieldName.tutuSortStatus = 'all';
            this.tableFieldName.dateSortStatus = 'all';
            this.tableFieldName.statusSortStatus = 'all';
            this.tableFieldName.appointUserSortStatus = 'all';

            this.tableFieldName[sortStatus] = 'down';
            this.sortOrder = 'descending';
            this.sortName = field;
            
            this.$forceUpdate();
            
            //获取筛选项
            this.getFilterCondition();
        },
        // 节流函数
        stopClick(name=`stopClick`,time=`time`,msg=`msg`){
            let that = this
            return new Promise((resolve,reject)=>{
                if(that[name]) {
                    return false
                }
                that[name] = true
                setTimeout(()=>{
                    that[name] = false
                }, time)
                resolve()
            })
        },

        deviceSelect(item){
            // console.log(item)
            this.id = item.id
            if(item.preset_device.indexOf("模拟") !== -1){
                this.searchType = "simulator"
                this.replaceDevice.device = item.preset_device     
                this.replaceDevice.device_type = 'AS'     
            }else{
                this.searchValue = item.preset_device
                this.searchData()
            }
            this.$refs.deviceSelectRef.openDialog();
        },
        close(){
            this.searchValue = ""   
            this.selectedCondition = []
            this.totalCondition = []
            this.pageSize = 30
            this.currentPage = 1
            this.sizeTotal = 0
            this.sortName = ''
            this.sortOrder = ''
            this.deviceList = []
            this.multipleSelectData = []
            this.searchType = "total"
            this.clearBasicContent()
        },
        selectDevice(item){
            // console.log(item)
            if(this.searchType == 'total'){

                let list = {
                    device_id: item.id,
                    table_name: this.$route.query.testRecordName
                }
                this.$codePost("/service/get_device_by_number/", list, { operation: "获取设备具体信息", failed: true }).then(res => {
                    if (res.code == 200) {
                        let data = res.data.data;
            
                        //不重复直接填入
                        this.setDeviceData(data);
                        let formData = new FormData();
                        //表单填写数据
                        for (let k in this.testContentFormList) {
                            formData.append(k, this.testContentFormList[k] ? this.testContentFormList[k] : '');
                        }
                        //不用用户填写，但要传给后台的固定数据
                        // formData.append("project", this.projectCode);
                        // formData.append("table_name", this.$route.query.testRecordName);
                        formData.append("id", this.id);
                        formData.append("device_id", item.id);
                        // formData.append("question", "");
                        this.updateTestRecordContent(formData)
                    }
                })
            }else{
                let formData = new FormData();
                //表单填写数据
                for (let k in this.replaceDevice) {
                    formData.append(k, this.replaceDevice[k] ? this.replaceDevice[k] : '');
                }
                formData.append("id", this.id);
                this.updateTestRecordContent(formData)
            }
        },

        updateTestRecordContent(formData){
            this.$formPost("/expertCompatibility/update_test_record_content/", formData, { operation: '选择设备', success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.$refs.deviceSelectRef.closeDialog();
                    this.$emit("afterEdit");
                    this.clearBasicContent()
                }
            })
        },

        // 填入设备信息
        setDeviceData(data) {
            let deviceType = data.brand == "苹果" ? 'IOS' : 'Android';
            this.$set(this.testContentFormList, "device_type", deviceType);
            this.$set(this.testContentFormList, "brand", data.brand);
            this.$set(this.testContentFormList, "device", data.device);
            this.$set(this.testContentFormList, "os", data.os);
            this.$set(this.testContentFormList, "ram", data.ram);
            this.$set(this.testContentFormList, "cpuModel", data.cpuModel);
        },
    },

}
</script>
<style scoped>
#filterConditionDiv{
    padding-left:0.625rem;
    display:flex;
    align-items: center;
}
#filterConditionDiv .el-tag{
    margin-right:0.625rem;
}
#selectedConditionDiv{
    flex:1;
    margin-left:1.25rem;
}
.conditionTag>span{
    max-width: 350px;
    display: block;
    float: left;
    overflow: hidden;
    height: 100%;
    text-overflow: ellipsis;
}
#filterUl{
    font-size:0.75rem;
    margin-top: 0.4rem;
}
.filterLi{ 
    min-height:2.15rem;
    display:flex;
}
#filterUl li {
    border-bottom: 1px solid #e4e7ed;
}
#filterUl li:first-child {
    border-top: 1px solid #e4e7ed;
}
.conditionType{
    background:#3E71FD;
    color:#fff;
    padding:0.5rem 0 0.5rem 0.7rem;
    min-width:5.1rem;
    display:flex;
}
.itemDetail{
    display:inline-block !important;
    flex:1;
    /* border-bottom: 1px solid #e4e7ed; */
}
.conditionItem{
    display:inline-block;
    margin-left:0.625rem;
    cursor:pointer;
}
.conditionItem:hover{
    background:#e4e7ed;
}
.multipleSelectDiv{
    display: flex;
    width: 110px;
    position: absolute;
    right: 5px;
    top: 4.5px;
}
.multipleSelectDiv button{
    align-self:center;
}
#deviceTable{
    width:100%;
    margin-top:1.25rem;
    border:0.062rem solid #e4e7ed;
    border-bottom: 0;
}
#deviceTable button{
    padding: 0.4375rem 0.3125rem;
}
#exportDiv,#addFieldContent, #operateFieldContent {
    float:left;
    margin:0.625rem 0;
}
#addFieldContent, #devicesBorrowDiv, #operateFieldContent {
    margin-left:0.625rem;
}
#expandOtherConditionDiv{
    float:right;
    margin:0.625rem 0;
}
.multipleRow{
    margin: 0.3125rem 0.625rem;
}
.multipleTitle{
    width: 113px;
    margin-right: 10px;
    position: relative;
    display:inline-block;
    -ms-flex-align: center;
    align-items: center;
    border-right:0.062rem solid #e4e7ed;
    padding-right:1.25rem;
}
.multipleTitleContent{
    border:0.062rem solid #e4e7ed;
    border-radius:0.3125rem;
    padding:0.3125rem;
}
.multipleContent{
    display:inline-block;
}
.multipleTitleItem{
    font-weight:700;
}
.sendPopoTag {
    cursor:pointer;
}
.sendPopoTag:hover{
    background-color: #ecf1ff;
    border-color: #d8e3ff;
    color: #3E71FD;
}
.formItem{
    width:45%;
    display:inline-block;
    margin-left:2rem;
}
#recordTimeLine {
    padding-top: 1.6rem;
    padding-left: 1rem;
    
}
#historyTitle {
    font-size: 17px;
    padding-left: 1.3rem;
    position: absolute;
    top: 16px;
    color: #333;
}
#historyTitle p {
    text-align: center;
}
.personTime {
    margin-bottom: 0.6rem;
}
.personTamp {
    font-size: 14px;
}
#timeTamp {
    color: #909399;
    line-height: 1;
    font-size: 13px;
}
.columnTitle {
    font-size: 14px;
}
.noDataCurrent {
    line-height: 60px;
    text-align: center;
    color: #909399;
    font-size: 14px;
}
/* 借用状态、借用人 */
.longName {
    width: 85%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    /* width: 100px; */
    /* width: 85%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */


    /* max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis; */




}
.showIcon {
    font-size: 16px;
    margin-right: 3px;
}
.showIcon:hover {
    cursor: pointer;
    color: #3E71FD;
}
/* 屏幕类型图片小图标 */
.urlTypePicture {
    width: 16px;
    height: 16px;
    vertical-align: sub;
    cursor: pointer;
}
.imgListContent {
    display: none;
}

.questionImg {
    width: 15px;
    height: 15px;
    vertical-align: middle;
}
.deviceQueryTableContent span {
    display: inline-block;
}
/* 表格显示省略号 */
.itemContent {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
/* 表格折叠项 */
.expandItem {
    padding: 8px 0;
}
.expandItemContent {
    font-size: 14px;
    color: #999;
    margin-right: 20px;
}
.expandItemValContent {
    font-size: 14px;
    color: #333;
}
.fieldName {
    display: inline-block;
    width: 6rem;
    text-align: right;
}
.tipsSpan {
    display: inline-block;
    line-height: 24px;
}
.el-table {
  display: flex;
  flex-direction: column;
}
.el-table >>> .el-table__header-wrapper {
  overflow: visible !important;
}
</style>
