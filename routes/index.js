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
import {helloWord} from "./helloword"
import bodyParser from 'body-parser'

const api = '/api'

export default (app) => {
    // hello world
    app.get(api+'/helloworld',helloWord)
    // user
    app.post(api+'/register', register)
    app.post(api+'/login', login)
    app.post(api+'/userInfo', userInfo)
    app.post(api+'/logout', logout)
    app.post(api+'/delUserById', delUserById)
    app.get(api+'/getUserList', getUserList)

    // category
    app.post(api+'/addCategory', addCategory)
    app.post(api+'/delCategory', delCategory)
    app.get(api+'/getCategoryList', getCategoryList)
    app.post(api+'/updateCategory', updateCategory)
    app.post(api+'/getCategoryDetail', getCategoryDetail)

    // tag
    app.post(api+'/addTag', addTag)
    app.post(api+'/delTag', delTag)
    app.get(api+'/getTagList', getTagList)

    // comment
    app.post(api+'/addComment', addComment)
    app.post(api+'/addThirdComment', addThirdComment)
    app.post(api+'/changeComment', changeComment)
    app.post(api+'/changeThirdComment', changeThirdComment)
    app.get(api+'/getCommentList', getCommentList)

    // article
    app.post(api+'/addArticle',bodyParser.json({limit: '10mb'}), addArticle)
    app.post(api+'/updateArticle',bodyParser.json({limit: '10mb'}), updateArticle)
    app.post(api+'/delArticle', delArticle)
    app.get(api+'/getArticleList', getArticleList)
    app.post(api+'/getArticleDetail', getArticleDetail)
    app.post(api+'/likeArticle', likeAricle)

    // link
    app.post(api+'/addLink', addLink)
    app.post(api+'/updateLink', updateLink)
    app.post(api+'/delLink', delLink)
    app.get(api+'/getLinkList', getLinkList)

    // message
    app.post(api+'/addMessage', addMessage)
    app.post(api+'/addReplyMessage', addReplyMessage)
    app.post(api+'/delMessage', delMessage)
    app.post(api+'/getMessageDetail', getMessageDetail)
    app.get(api+'/getMessageList', getMessageList)

    // timeAxis
    app.post(api+'/addTimeAxis', addTimeAxis)
    app.post(api+'/updateTimeAxis', updateTimeAxis)
    app.post(api+'/delTimeAxis', delTimeAxis)
    app.get(api+'/getTimeAxisList', getTimeAxisList)
    app.post(api+'/getTimeAxisDetail', getTimeAxisDetail)
}