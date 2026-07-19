<template>
  <view class="fix-top-window">
    <app-page fluid>
    <view class="uni-container">
      <app-page-header :title="greeting + '，' + displayName" :description="todayDate">
        <template #breadcrumb>
          <uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
        </template>
      </app-page-header>

      <!-- 提示条 -->
      <uni-notice-bar
        v-if="showdbInit"
        showGetMore
        showIcon
        class="mb-m pointer"
        text="检测到您未初始化db_init.json，请先右键uniCloud/database/db_init.json文件，执行初始化云数据库，否则左侧无法显示菜单等数据"
        @click="toAddAppId"
      />
      <uni-notice-bar
        v-if="showAddAppId"
        showGetMore
        showIcon
        class="mb-m pointer"
        text="检测到您还未添加应用，点击前往应用管理添加"
        @click="toAddAppId"
      />
      <uni-notice-bar
        v-if="!deviceTableData.length && !userTableData.length && !query.platform_id && complete"
        showGetMore
        showIcon
        class="mb-m pointer"
        text="暂无数据, 统计相关功能需开通 uni 统计后才能使用, 如未开通, 点击查看具体流程"
        @click="navTo('https://uniapp.dcloud.io/uni-stat-v2.html')"
      />

      <app-section class="dashboard-metrics">
        <view class="kpi-grid">
          <app-stat-card label="总设备数" :value="summaryStats.totalDevices" :loading="!complete">
            <template #meta>今日 {{ summaryStats.activeDevices }}</template>
          </app-stat-card>
          <app-stat-card label="活跃设备" :value="summaryStats.activeDevices" :change="summaryStats.activeDevicesChange" :loading="!complete" />
          <app-stat-card label="总用户数" :value="summaryStats.totalUsers" :loading="!complete">
            <template #meta>今日 {{ summaryStats.activeUsers }}</template>
          </app-stat-card>
          <app-stat-card label="活跃用户" :value="summaryStats.activeUsers" :change="summaryStats.activeUsersChange" :loading="!complete" />
        </view>
      </app-section>

      <app-section title="平台选择">
        <app-surface padding="compact">
          <uni-stat-tabs type="boldLine" mode="platform" v-model="query.platform_id" />
        </app-surface>
      </app-section>

      <app-section title="设备概览">
        <app-surface padding="none">
        <uni-table :loading="loading" stripe emptyText="暂无数据">
          <uni-tr>
            <block v-for="(mapper, index) in deviceTableFields" :key="index">
              <uni-th v-if="mapper.title" :key="index" align="center">{{ mapper.title }}</uni-th>
            </block>
          </uni-tr>
          <uni-tr v-for="(item, i) in deviceTableData" :key="i">
            <block v-for="(mapper, index) in deviceTableFields" :key="index">
              <uni-td v-if="mapper.field === 'appid'" align="center">
                <view v-if="item.appid" @click="navTo('/pages/uni-stat/device/overview/overview', item.appid)" class="link-btn-color">
                  {{ item[mapper.field] !== undefined ? item[mapper.field] : '-' }}
                </view>
                <view v-else @click="navTo('/pages/system/app/add')" class="link-btn-color"> 需添加此应用的 appid </view>
              </uni-td>
              <uni-td v-else :key="index" align="center">
                {{ item[mapper.field] !== undefined ? item[mapper.field] : '-' }}
              </uni-td>
            </block>
          </uni-tr>
        </uni-table>
        </app-surface>
      </app-section>

      <app-section title="注册用户概览">
        <app-surface padding="none">
        <uni-table :loading="loading" stripe emptyText="暂无数据">
          <uni-tr>
            <block v-for="(mapper, index) in userTableFields" :key="index">
              <uni-th v-if="mapper.title" :key="index" align="center">{{ mapper.title }}</uni-th>
            </block>
          </uni-tr>
          <uni-tr v-for="(item, i) in userTableData" :key="i">
            <block v-for="(mapper, index) in userTableFields" :key="index">
              <uni-td v-if="mapper.field === 'appid'" align="center">
                <view v-if="item.appid" @click="navTo('/pages/uni-stat/user/overview/overview', item.appid)" class="link-btn-color">
                  {{ item[mapper.field] !== undefined ? item[mapper.field] : '-' }}
                </view>
                <view v-else @click="navTo('/pages/system/app/add')" class="link-btn-color"> 需添加此应用的 appid </view>
              </uni-td>
              <uni-td v-else :key="index" align="center">
                {{ item[mapper.field] !== undefined ? item[mapper.field] : '-' }}
              </uni-td>
            </block>
          </uni-tr>
        </uni-table>
        </app-surface>
      </app-section>
    </view>
    </app-page>

    <!-- #ifndef H5 -->
    <fix-window />
    <!-- #endif -->
  </view>
</template>

<script>
  import { stringifyQuery, stringifyField, stringifyGroupField, getTimeOfSomeDayAgo, division, format, parseDateTime, getFieldTotal, debounce } from '@/js_sdk/uni-stat/util.js';

  import { deviceFeildsMap, userFeildsMap } from './fieldsMap.js';
  import AppPage from '@/components/app-page/app-page.vue';
  import AppPageHeader from '@/components/app-page-header/app-page-header.vue';
  import AppSection from '@/components/app-section/app-section.vue';
  import AppSurface from '@/components/app-surface/app-surface.vue';
  import AppStatCard from '@/components/app-stat-card/app-stat-card.vue';

  export default {
    components: {
      AppPage,
      AppPageHeader,
      AppSection,
      AppSurface,
      AppStatCard,
    },
    data() {
      return {
        query: {
          platform_id: '',
          start_time: [getTimeOfSomeDayAgo(1), new Date().getTime()],
        },
        deviceTableData: [],
        userTableData: [],
        // panelData: panelOption,
        // 每页数据量
        pageSize: 10,
        // 当前页
        pageCurrent: 1,
        // 数据总量
        total: 0,
        loading: false,
        complete: false,
        statSetting: {
          mode: '',
          day: 7,
        },
        statModeList: [
          { value: 'open', text: '开启' },
          { value: 'close', text: '关闭' },
          { value: 'auto', text: '节能' },
        ],
        showAddAppId: false,
        showdbInit: false,
      };
    },
    onReady() {
      // 创建一个防抖函数，延迟执行getAllData方法
      this.debounceGet = debounce(() => {
        this.getAllData(this.queryStr);
      }, 300);

      // 执行防抖函数
      this.debounceGet();

      // 检查appId
      this.checkAppId();

      this.checkdbInit();
    },

    watch: {
      query: {
        deep: true,
        handler(newVal) {
          // 监听query对象的变化，并在变化时执行防抖函数
          this.debounceGet(this.queryStr);
        },
      },
    },

    computed: {
      queryStr() {
        // 默认查询条件
        const defQuery = `(dimension == "hour" || dimension == "day")`;
        // 将query对象转换为查询字符串并与默认查询条件合并
        return stringifyQuery(this.query) + ' && ' + defQuery;
      },

      deviceTableFields() {
        // 返回设备表格的字段映射
        return this.tableFieldsMap(deviceFeildsMap);
      },

      userTableFields() {
        // 返回用户表格的字段映射
        return this.tableFieldsMap(userFeildsMap);
      },

      displayName() {
        const u = this.$uniIdPagesStore.store.userInfo || {};
        return u.nickname || u.username || u.mobile || u.email || 'Admin';
      },

      greeting() {
        const h = new Date().getHours();
        if (h < 6) return '夜深了';
        if (h < 9) return '早上好';
        if (h < 12) return '上午好';
        if (h < 14) return '中午好';
        if (h < 18) return '下午好';
        return '晚上好';
      },

      todayDate() {
        const d = new Date();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`;
      },

      summaryStats() {
        const sum = (arr, key) => {
          let total = 0;
          for (const item of arr) {
            const v = parseFloat(String(item[key] || '0').replace(/,/g, ''));
            if (!isNaN(v)) total += v;
          }
          return total;
        };
        const fmt = (n) => {
          if (n >= 10000) return (n / 10000).toFixed(1) + '万';
          if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
          return String(n);
        };
        const pct = (today, yesterday) => {
          if (!yesterday || yesterday === 0) return 0;
          return Math.round(((today - yesterday) / yesterday) * 100);
        };

        const activeDevicesToday = sum(this.deviceTableData, 'active_device_count_value');
        const activeDevicesYesterday = sum(this.deviceTableData, 'active_device_count_contrast');
        const activeUsersToday = sum(this.userTableData, 'active_user_count_value');
        const activeUsersYesterday = sum(this.userTableData, 'active_user_count_contrast');

        return {
          totalDevices: fmt(sum(this.deviceTableData, 'total_devices_value')),
          activeDevices: fmt(activeDevicesToday),
          activeDevicesChange: pct(activeDevicesToday, activeDevicesYesterday),
          totalUsers: fmt(sum(this.userTableData, 'total_users_value')),
          activeUsers: fmt(activeUsersToday),
          activeUsersChange: pct(activeUsersToday, activeUsersYesterday),
        };
      },
    },

    methods: {
      getAllData(queryStr) {
        // 获取设备数据
        this.getApps(this.queryStr, deviceFeildsMap, 'device');
        // 获取用户数据
        this.getApps(this.queryStr, userFeildsMap, 'user');
      },

      tableFieldsMap(fieldsMap) {
        let tableFields = [];
        const today = [];
        const yesterday = [];
        const other = [];

        for (const mapper of fieldsMap) {
          if (mapper.field) {
            if (mapper.hasOwnProperty('value')) {
              // 如果字段映射中有'value'属性，则根据映射生成今天和昨天的字段
              const t = JSON.parse(JSON.stringify(mapper));
              const y = JSON.parse(JSON.stringify(mapper));

              if (mapper.field !== 'total_users' && mapper.field !== 'total_devices') {
                t.title = '今日' + mapper.title;
                t.field = mapper.field + '_value';
                y.title = '昨日' + mapper.title;
                y.field = mapper.field + '_contrast';

                today.push(t);
                yesterday.push(y);
              } else {
                t.field = mapper.field + '_value';
                other.push(t);
              }
            } else {
              // 将其他字段直接添加到tableFields中
              tableFields.push(mapper);
            }
          }
        }

        // 按顺序合并所有的字段
        tableFields = [...tableFields, ...today, ...yesterday, ...other];

        return tableFields;
      },

      getApps(query, fieldsMap, type = 'device') {
        this.loading = true;
        const db = uniCloud.database();
        const appDaily = db.collection('uni-stat-result').where(query).getTemp();
        const appList = db.collection('opendb-app-list').getTemp();
        db.collection(appDaily, appList)
          .field(`${stringifyField(fieldsMap, '', 'value')},stat_date,appid,dimension`)
          .groupBy(`appid,dimension,stat_date`)
          .groupField(stringifyGroupField(fieldsMap, '', 'value'))
          .orderBy(`appid`, 'desc')
          .get()
          .then((res) => {
            let { data } = res.result;
            // console.log('data: ', JSON.parse(JSON.stringify(data)));
            this[`${type}TableData`] = [];
            if (!data.length) return;
            let appids = [],
              todays = [],
              yesterdays = [],
              isToday = parseDateTime(getTimeOfSomeDayAgo(0), '', ''),
              isYesterday = parseDateTime(getTimeOfSomeDayAgo(1), '', '');
            for (const item of data) {
              const { appid, name } = (item.appid && item.appid[0]) || {};
              item.appid = appid;
              item.name = name;

              if (appids.indexOf(item.appid) < 0) {
                appids.push(item.appid);
              }
              if (item.dimension === 'hour' && item.stat_date === isToday) {
                todays.push(item);
              }
              if (item.dimension === 'day' && item.stat_date === isYesterday) {
                yesterdays.push(item);
              }
            }
            const keys = fieldsMap.map((f) => f.field).filter(Boolean);
            for (const appid of appids) {
              const rowData = {};
              const t = todays.find((item) => item.appid === appid);
              const y = yesterdays.find((item) => item.appid === appid);
              const appInfo = t || y || {};
              for (const key of keys) {
                if (key === 'appid' || key === 'name') {
                  rowData[key] = key === 'appid' ? appInfo[key] || appid : appInfo[key];
                } else {
                  const value = t && t[key];
                  const contrast = y && y[key];
                  rowData[key + '_value'] = format(value);
                  rowData[key + '_contrast'] = format(contrast);
                }
              }
              if (appid) {
                rowData[`total_${type}s_value`] = '获取中...';
              }
              this[`${type}TableData`].push(rowData);
              if (appid) {
                // total_users 不准确，置空后由 getFieldTotal 处理, appid 不存在时暂不处理
                if (t) {
                  t[`total_${type}s`] = 0;
                }
                const query = JSON.parse(JSON.stringify(this.query));
                query.start_time = [getTimeOfSomeDayAgo(0), new Date().getTime()];
                query.appid = appid;
                getFieldTotal.call(this, query, `total_${type}s`).then((total) => {
                  this[`${type}TableData`].find((item) => item.appid === appid)[`total_${type}s_value`] = total;
                });
              }
            }
          })
          .catch((err) => {
            console.error(err);
            // err.message 错误信息
            // err.code 错误码
          })
          .finally(() => {
            this.loading = false;
            this.complete = true;
          });
      },

      navTo(url, id) {
        if (url.indexOf('http') > -1) {
          // 如果url中包含'http'，则在新窗口中打开该链接
          // #ifdef H5
          window.open(url);
          // #endif
        } else {
          if (id) {
            // 如果有提供id参数，则将其添加到url中作为查询参数
            url = `${url}?appid=${id}`;
          }
          // 使用uni.navigateTo方法进行页面跳转
          uni.navigateTo({
            url,
          });
        }
      },

      toUrl(url) {
        // #ifdef H5
        // 在新窗口中打开url链接（仅适用于H5平台）
        window.open(url, '_blank');
        // #endif
      },

      toAddAppId() {
        // 隐藏添加App ID的标识
        this.showAddAppId = false;
        // 使用uni.navigateTo方法进行页面跳转到指定路径
        uni.navigateTo({
          url: '/pages/system/app/list',
          events: {
            // 注册事件，用于在目标页面刷新数据后执行回调
            refreshData: () => {
              this.checkAppId();
            },
          },
        });
      },

      async checkAppId() {
        // 获取uniCloud数据库的实例
        const db = uniCloud.database();
        // 查询'opendb-app-list'集合的数据数量
        let res = await db.collection('opendb-app-list').count();
        // 如果查询结果为空或total为0，则显示添加App ID的标识
        this.showAddAppId = !res.result || res.result.total === 0 ? true : false;
      },

      async checkdbInit() {
        // 获取uniCloud数据库的实例
        const db = uniCloud.database();
        // 查询'opendb-app-list'集合的数据数量
        let res = await db.collection('opendb-admin-menus').count();
        // 如果查询结果为空或total为0，则显示添加App ID的标识
        this.showdbInit = !res.result || res.result.total === 0 ? true : false;
        if (this.showdbInit) {
          uni.showModal({
            title: '重要提示',
            content: `检测到您未初始化数据库，请先右键uni-admin项目根目下的 uniCloud/database 目录，执行初始化云数据库，否则左侧无法显示菜单等数据`,
            showCancel: false,
            confirmText: '我知道了',
          });
        }
      },
    },
  };
</script>

<style lang="scss">
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-4);
  }

  .uni-stat-tooltip-s {
    width: 400px;
    white-space: normal;
  }

  @media screen and (max-width: 1023px) {
    .kpi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (max-width: 599px) {
    .kpi-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
