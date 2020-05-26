import * as ActionTypes from './ActionTypes';

export const propmotions = (state = {
  isLoading: true,
  errMess: null,
  propmotions: []
}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_PROMOS:
      return { ...state, isLoading: false, errMess: null, propmotions: action.payload }

    case ActionTypes.PROMOS_LOADING:
      return { ...state, isLoading: true, errMess: null, propmotions: [] }

    case ActionTypes.PROMOS_FAILED:
      return { ...state, isLoading: false, errMess: action.payload, propmotions: [] }

    default:
      return state;
  }
};