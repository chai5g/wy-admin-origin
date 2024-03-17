import Layout from '@/layout'

const deploymentRouter = {
  path: '/wy',
  component: Layout,
  redirect: '/wy/fee',
  name: 'deployment',
  meta: {
    title: '物业模块',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'fee',
      component: () => import('@/views/statistics/payment/index.vue'),
      name: 'wyFee',
      meta: { title: '费用台账', icon: '' }
    },
    {
      path: 'payLog',
      component: () => import('@/views/statistics/paylog/index.vue'),
      name: 'wyPayLog',
      meta: { title: '缴费清单', icon: '' }
    },
    {
      path: 'overdue',
      component: () => import('@/views/statistics/overdue/index.vue'),
      name: 'wyOverdue',
      meta: { title: '欠费明细', icon: '' }
    }
  ]
}

export default deploymentRouter
