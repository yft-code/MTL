import {getEmail,getPermission,judgeContact} from '@/api/profile'
import Vue from "vue";
const actions={
  // 获取用户邮箱
getUserEmail (context) {
       return new Promise((resolve,reject)=>{
          getEmail({}).then(res=>{
              if(res.code==200){
                  context.commit('setUserEmail', res.data);
              }else{
                  Message.error(res.msg);
              }
                  resolve()
          }).catch(error=>{
              reject(error)
          })
       })
  },

  //获取用户权限
   getUserAuth (context) {
      return new Promise((resolve,reject)=>{
          getPermission({}).then(res=>{
              if(res.code==200){
                  context.commit('setIsTester',res.data.tester);
                  context.commit('setIsAdmin', res.data.manager);
              }else{
               context.commit('setIsTester', false);
               context.commit('setIsAdmin', false);
               Message.error(res.msg);
              }
              resolve()
          }).catch(error=>{
              reject(error)
          })

       })
  },

  // 获取是否是接口人
  async judgeContact (context) {
      context.commit("setIsContact", true);
      await Vue.axiosGet('/service/get_reminder/').then(res => {
          if (res.code == 200) {
              for(let k in res.data){
                  if(res.data[k].popo.indexOf(context.getters.getUserEmail) !== -1){
                      context.commit("setIsContact", true);
                      return
                  }
              }
              context.commit("setIsContact", false);
          }
          else {
              context.commit("setIsContact", false);
              Message.error(res.msg);
          }
          context.commit("setIsContact", false);
      })
  }  
}
export default actions;