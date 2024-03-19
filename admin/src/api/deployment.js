// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/utils/request'

/**
 * 新增客户部署
 * @param pram
 */
export function deployList(pram) {
  return request({
    url: '/admin/deploy/app/list',
    method: 'POST',
    data: pram
  })
}

/**
 * 新增客户部署
 * @param pram
 */
export function addDeploy(pram) {
  return request({
    url: '/admin/deploy/app/add',
    method: 'POST',
    data: pram
  })
}

/**
 * 删除客户部署
 * @param pram
 */
export function delDeploy(pram) {
  return request({
    url: '/admin/deploy/app/delete',
    method: 'POST',
    data: pram
  })
}

/**
 * 客户部署下线
 * @param pram
 */
export function offlineDeploy(pram) {
  return request({
    url: '/admin/deploy/app/offline',
    method: 'POST',
    data: pram
  })
}

/**
 * 客户部署上线
 * @param pram
 */

export function onlineDeploy(pram) {
  return request({
    url: '/admin/deploy/app/online',
    method: 'POST',
    data: pram
  })
}

/**
 * 修改客户部署
 * @param pram
 */
export function updateDeploy(pram) {
  return request({
    url: '/admin/deploy/app/update',
    method: 'POST',
    data: pram
  })
}
