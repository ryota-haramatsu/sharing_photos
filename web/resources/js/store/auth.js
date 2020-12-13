import { OK, CREATED, UNPROCESSABLE_ENTITY } from '../utils'

const state = {
  user: null,
  apiStatus: null,
  loginErrorMessages: null,
  registerErrorMessages: null,
}

// ステートを元に演算した結果が欲しい場合
const getters = {
    check: state => !! state.user,
    username: state => state.user ? state.user.name : ''
}

// 値の更新 第一引数は絶対state
const mutations = {
    setUser(state, user) {
        state.user = user
  },
    setApiStatus(state, status) {
      state.apiStatus = status
  },
  setLoginErrorMessages(state, messages) {
      state.loginErrorMessages = messages
  },
  setRegisterErrorMessages(state, messages) {
      state.registerErrorMessages = messages
  }
}

// APIの呼び出し 非同期
// contextオブジェクトにミューテーションを呼び出すcommitなどがある
// アクション→コミットでミューテーションを呼び出し(ここではsetUser)→ステートの更新
const actions = {

  // 新規登録
  async register(context, data) {
    // setApiStatusが空
    // もしステータスがCREATEDなら、ステータスをtrueにしユーザーのデータを持ってreturn
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/register', data)
    if (response.status === CREATED) {
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return false
    }

    context.commit('setApiStatus', false)
    if (response.data === UNPROCESSABLE_ENTITY) {
      context.commit('setRegisterErrorMessages', response.data.errors)
    } else {
      context.commit('error/setCode', response.status, { root: true })
    }

    context.commit('setUser', response.data)
  },

  // ログイン
  async login(context, data) {
    // 1. 最初はsetApiStatusがnull 
    // 2. .catchでエラーを取得
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/login', data)
    
    if (response.status === OK) {
      // 3. 成功したらsetApiStatusがtrue
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return false
    }
    // 4. 失敗ならsetApiStatusがfalse
    context.commit('setApiStatus', false)
    if (response.status === UNPROCESSABLE_ENTITY) {
      context.commit('setLoginErrorMessages', response.data.errors)
    } else {
      // 5. 別モジュールのミューテーションを呼び出す → {root:true}にする
      context.commit('error/setCode', response.status, { root: true })
    }
  },

  // ログアウト
  async logout(context) {
    context.commit('setUser', null)
    const response = await axios.post('/api/logout')

    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', null)
      return false
    }

    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })

  },
  
  // カレントユーザーチェック
  async currentUser(context) {
    context.commit('setUser', null)
    const response = await axios.get('/api/user')
    const user = response.data || null

    if (response.status === OK) {
      context.commit('setAppStatus', true)
      context.commit('setUser', user)
      return false
    }

    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })
  }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}