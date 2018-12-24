import {
    register,
    login,
    userInfo,
    logout,
    delUserById,
    getUserList
} from './user'

import {
    addCategory,
    delCategory,
    getCategoryList
} from './category'

import {
    addTag,
    delTag,
    getTagList
} from './tag'

export default (app)=>{
    // user
    app.post('/register',register)
    app.post('/login',login)
    app.post('/userInfo',userInfo)
    app.post('/logout',logout)
    app.post('/delUserById',delUserById)
    app.get('/getUserList',getUserList)

    // category
    app.post('/addCategory',addCategory)
    app.post('/delCategory',delCategory)
    app.get('/getCategoryList',getCategoryList)

    // tag
    app.post('/addTag',addTag)
    app.post('/delTag',delTag)
    app.get('/getTagList',getTagList)
}