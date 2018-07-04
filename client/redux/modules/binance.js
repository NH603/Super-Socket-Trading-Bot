import axios from 'axios'

const DEFAULT_STATE = {
  tickers: [],
  chartData: [],
  indicatorData: []
}

// ******* Action Types *******

const GET_TICKERS = 'GET_TICKERS'

// ******* Action Creators & Reducers *******

export function getTickersRequest () {
  return dispatch => {
    return axios.get(`/api/binance/get-all-tickers`).then(tickers => {
      dispatch(getTickers(tickers.data))
    })
  }
}

export function getTickers (tickers) {
  return { type: GET_TICKERS, tickers }
}
function getTickersReducer (state, action) {
  return Object.assign({}, state, { tickers: action.tickers })
}

export function getTickerChartRequest (ticker) {
  return dispatch => {
    dispatch({ type: 'server/getChart', data: ticker })
  }
}

function getTickerChartReducer (state, action) {
  const copy = state.chartData
  const index = copy.findIndex(obj => obj.name === action.data.name)
  if (index === -1) {
    return {
      tickers: [...state.tickers],
      chartData: state.chartData.concat(action.data),
      indicatorData: [...state.indicatorData]
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [
        ...state.chartData.slice(0, index), // everything before current post
        action.data,
        ...state.chartData.slice(index + 1) // everything after current post
      ],
      indicatorData: [...state.indicatorData]
    }
  }
}

function getTickerIndicatorReducer (state, action) {
  const copy = state.chartData
  const index = copy.findIndex(obj => obj.name === action.data.name)
  if (index === -1) {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: state.indicatorData.concat(action.data)
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: [
        ...state.indicatorData.slice(0, index), // everything before current post
        action.data,
        ...state.indicatorData.slice(index + 1) // everything after current post
      ]
    }
  }
}

export function closeSocketRequest (ticker) {
  return dispatch => {
    return axios.post(`/api/binance/close-web-socket`, {
      params: {
        ticker: ticker
      }
    }).then(res => {
    })
  }
}

export function engageRequest (ticker) {
  return dispatch => {
    dispatch({ type: 'server/engageRequest', data: ticker })
  }
}

export function changeSpeed (ticker) {
  return dispatch => {
    dispatch({ type: 'server/changeSpeed', data: ticker })
  }
}

export default function binance (state = DEFAULT_STATE, action) {
  switch (action.type) {
  case GET_TICKERS:
    return getTickersReducer(state, action)
  case 'CLIENT_GET_TICKER_CHART':
    return getTickerChartReducer(state, action)
  case 'CLIENT_GET_INDICATOR_CHART':
    return getTickerIndicatorReducer(state, action)
  default:
    return state
  }
}
