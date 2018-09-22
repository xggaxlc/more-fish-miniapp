import { wxPromise } from '@utils';
export async function showTipModal(content = '', title = '提示') {
  await wxPromise.showModal({
    title,
    content,
    showCancel: false,
    confirmColor: '#E0B44F',
    confirmText: '知道了'
  });
}

export async function showConfirmModal(name, modalOpts: any = {}) {
  const { confirm } = await wxPromise.showModal({
    title: modalOpts.title || `删除${name}`,
    content: modalOpts.content || `确认删除此${name}？`,
    confirmColor: '#FA4444'
  });

  if (!confirm) throw new Error('ignore 用户取消');
}

