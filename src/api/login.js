import fetch from '@/utils/fetch'

export function loginByUsername(ad_name, ad_pwd) {
  const data = {
    ad_name,
    ad_pwd
  }
  return fetch({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout(token) {
  return fetch({
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return fetch({
    url: '/getAdInfo',
    method: 'get',
    params: { ad_name: token }
  })
}

