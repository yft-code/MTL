import { getUserEmail, getUserAuth, judgeContact } from '@/api/profile'
const actions = {
    // 获取用户邮箱
   async getUserEmail(context) {
    let res = await getUserEmail({});
    if(res.code == 200){
        context.commit('setUserEmail', res.data);
    }else{
        Message.error(res.msg);
    }
    },

    //获取用户权限
   async getUserAuth(context) {
        let res = await getUserAuth({});
        if(res.code == 200){
            context.commit('setIsTester', res.data.tester);
            context.commit('setIsAdmin', res.data.manager);
        }else{
            context.commit('setIsTester', false);
            context.commit('setIsAdmin', false);
            Message.error(res.msg);
        }
    },

    // 获取是否是接口人
   async judgeContact(context) {
        context.commit("setIsContact", true);
        let res=await judgeContact({});
        if (res.code == 200) {
            let flag = Object.values(res.data).some(item => {
                return item.popo.indexOf(context.getters.getUserEmail) > -1
            })
            if (flag) {
                context.commit("setIsContact", true);
            } else {
                context.commit("setIsContact", false);
            }
        } else {
            context.commit("setIsContact", false);
            Message.error(res.msg);
        }
    }
}
export default actions;