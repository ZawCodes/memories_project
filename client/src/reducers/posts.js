import { COMMENT, FETCH_POST, START_LOADING, END_LOADING, FETCH_BY_SEARCH, FETCH_ALL, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';
//adding data/payload into redux storage here
export default (state = {isLoading: true, posts: []}, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true}
        case END_LOADING:
            return { ...state, isLoading: false}
        case FETCH_ALL:
            return {...state, posts: action.payload.data,
            currentPage: action.payload.currentPage,
            numberOfPages: action.payload.numberOfPages};//add whole action.payload into redux
        case FETCH_BY_SEARCH:
            return {...state,
                posts: action.payload};
        case FETCH_POST:
            return { ...state, post: action.payload};

        case CREATE:
            return { ...state, posts: [...state, action.payload]};//add action.payload in addition to existing posts
        case UPDATE:
        case LIKE:
            // console.log('reducer',action.payload);
            return { ...state, posts: state.posts.map((post)=> post._id === action.payload._id? action.payload: post)};
        case COMMENT:
            return { ...state, posts: state.posts.map((post) => {
                if(post._id === action.payload._id) {
                    return action.payload;
                }
                return post;
            })}
        case DELETE:
            return { ...state, posts: state.filter((post)=> post._id !== action.payload)};
        default:
            return state;
    }
}