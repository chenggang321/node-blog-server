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
    getCategoryDetail,
    getCategoryList,
    updateCategory
} from './category'

import {
    addTag,
    delTag,
    getTagList
} from './tag'

import {
    addComment,
    addThirdComment,
    changeComment,
    changeThirdComment,
    getCommentList
} from "./comment"

import {
    addArticle,
    delArticle,
    getArticleDetail,
    getArticleList,
    likeAricle,
    updateArticle
} from "./article"

import {
    addLink,
    delLink,
    getLinkList,
    updateLink
} from "./link"

import {
    addMessage,
    addReplyMessage,
    delMessage,
    getMessageDetail,
    getMessageList
} from "./message"

import {
    addTimeAxis,
    delTimeAxis,
    getTimeAxisDetail,
    getTimeAxisList,
    updateTimeAxis
} from "./timeAxis"

export default (app) => {
    // user
    app.post('/register', register)
    app.post('/login', login)
    app.post('/userInfo', userInfo)
    app.post('/logout', logout)
    app.post('/delUserById', delUserById)
    app.get('/getUserList', getUserList)

    // category
    app.post('/addCategory', addCategory)
    app.post('/delCategory', delCategory)
    app.get('/getCategoryList', getCategoryList)
    app.post('/updateCategory', updateCategory)
    app.post('/getCategoryDetail', getCategoryDetail)

    // tag
    app.post('/addTag', addTag)
    app.post('/delTag', delTag)
    app.get('/getTagList', getTagList)

    // comment
    app.post('/addComment', addComment)
    app.post('/addThirdComment', addThirdComment)
    app.post('/changeComment', changeComment)
    app.post('/changeThirdComment', changeThirdComment)
    app.get('/getCommentList', getCommentList)

    // article
    app.post('/addArticle', addArticle)
    app.post('/updateArticle', updateArticle)
    app.post('/delArticle', delArticle)
    app.get('/getArticleList', getArticleList)
    app.post('/getArticleDetail', getArticleDetail)
    app.post('/likeArticle', likeAricle)

    // link
    app.post('/addLink', addLink)
    app.post('/updateLink', updateLink)
    app.post('/delLink', delLink)
    app.get('/getLinkList', getLinkList)

    // message
    app.post('/addMessage', addMessage)
    app.post('/addReplyMessage', addReplyMessage)
    app.post('/delMessage', delMessage)
    app.post('/getMessageDetail', getMessageDetail)
    app.get('/getMessageList', getMessageList)

    // timeAxis
    app.post('/addTimeAxis', addTimeAxis)
    app.post('/updateTimeAxis', updateTimeAxis)
    app.post('/delTimeAxis', delTimeAxis)
    app.get('/getTimeAxisList', getTimeAxisList)
    app.post('/getTimeAxisDetail', getTimeAxisDetail)
}