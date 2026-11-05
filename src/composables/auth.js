import Cookies from 'universal-cookie'
const cookies = new Cookies()
const TokenKey="admin-token"
export function getToken(){
  return cookies.get(TokenKey)
}
export function setToken(token){
  cookies.set(TokenKey,token)
}
export function removeToken(){
  cookies.remove(TokenKey)
}
