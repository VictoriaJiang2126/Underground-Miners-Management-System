import Utils from '@/lin/util/util'

// import adminInfoManagementConfig from './adminInfoManagement'
import minersInfoManagementConfig from './minersInfoManagement'
import areaInfoManagementConfig from './areaInfoManagement'
import stationInfoManagementConfig from './stationInfoManagement'
import attendanceInfoManagementConfig from './attendanceInfoManagement'
import localpathInfoRouterConfig from './localpathInfo'
import trackerControlRouterConfig from './trackerControl'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
	{
	  title: 'Admin Info',
	  type: 'view',
	  name: Symbol('adminInfoManagement'),
	  route: '/adminInfoManagement',
	  filePath: 'view/adminInfoManagement/index.vue',
	  inNav: true,
	  icon: 'iconfont icon-iconset0103',
	  order: 1,
	},
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  // adminInfoManagementConfig,
  minersInfoManagementConfig,
  areaInfoManagementConfig,
  stationInfoManagementConfig,
	attendanceInfoManagementConfig,
  localpathInfoRouterConfig,
  trackerControlRouterConfig
]


// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)
deepReduceName(homeRouter)

export default homeRouter

/**
 * 筛除已经被添加的插件
 */
function filterPlugin(data) {
  if (plugins.length === 0) {
    return
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    const findResult = plugins.findIndex(item => data === item)
    if (findResult >= 0) {
      plugins.splice(findResult, 1)
    }
    if (data.children) {
      filterPlugin(data.children)
    }
  }
}

/**
 * 使用 Symbol 处理 name 字段, 保证唯一性
 */
function deepReduceName(target) {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      target.name = target.name || Utils.getRandomStr()
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}
