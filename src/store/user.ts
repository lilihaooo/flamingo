import { defineStore } from 'pinia';

export const useUserStore = defineStore('user',{
    state: () => ({
        user_name: '',
        nick_name: '',
        avatar_img: './src/assets/img/img.jpg',
        profile: '',
        group_id: 0,
        user_id: 0,
        group_title: '',
        role_ids:[],
        role_title: '',
    }),
    getters: {
        getUserName: (state) => state.user_name,
        getUserID: (state) => state.user_id,
        getUserNickName: (state) => state.nick_name,
        getUserAvatarImg: (state) => state.avatar_img,
        getUserProfile: (state) => state.profile,
        getGroupTitle: (state) => state.group_title,
        getGroupID: (state) => state.group_id,
    },
    actions: {
        setUserName(user_name: string){
            this.user_name = user_name
        },
        setUserID(user_id: number){
            this.user_id = user_id
        },
        setNickName(nick_name: string){
            this.nick_name = nick_name
        },
        setAvatarImg(avatar_img: string){
            this.avatar_img = avatar_img
        },
        recoverAvatarImg(){
            this.avatar_img = './src/assets/img/img.jpg'
        },
        setRoleIDs(role_id: number[]){
            // @ts-ignore
            this.role_ids = role_id
        },
        setRoleTitle(role_title: string){
            this.role_title = role_title
        },
        setGroupID(group_id: number[]){
            // @ts-ignore
            this.group_id = group_id
        },
        setGroupTitle(group_title: string){
            this.group_title = group_title
        }
    },
});
