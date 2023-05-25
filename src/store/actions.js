import { getEmail, getUserAuth, judgeContact } from '@/api/profile'
const actions = {
    // 获取用户邮箱
    getUserEmail(context) {
        return new Promise((resolve, reject) => {
            getEmail({}).then(res => {
                if (res.code == 200) {
                    context.commit('setUserEmail', res.data);
                } else {
                    Message.error(res.msg);
                }
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    //获取用户权限
    getUserAuth(context) {
        return new Promise((resolve, reject) => {
            getUserAuth({}).then(res => {
                if (res.code == 200) {
                    context.commit('setIsTester', res.data.tester);
                    context.commit('setIsAdmin', res.data.manager);
                } else {
                    context.commit('setIsTester', false);
                    context.commit('setIsAdmin', false);
                    Message.error(res.msg);
                }
                resolve()
            }).catch(error => {
                console.log('error', error)
                reject(error)
            })

        })
    },

    // 获取是否是接口人
    judgeContact(context) {
        context.commit("setIsContact", true);
        return new Promise((resolve, reject) => {
            judgeContact({}).then(res => {
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
                resolve()
            }).catch(error => {
                reject(error)
            })

        })
    }
}
export default actions;