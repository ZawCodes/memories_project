import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';

export default (posts = [], action) => {
    switch (action.type) {
        case FETCH_ALL:
            console.log('testing redux FETCH_ALL', posts);
            return action.payload;
        case CREATE:
            console.log('testing redux CREATE', posts);
            return [...posts, action.payload];
        case UPDATE:
        case LIKE:
            console.log('testing redux UPDATE', posts);
            return posts.map((post)=> post._id === action.payload._id? action.payload: post);
        case DELETE:
            console.log('testing redux DELETE', posts);
            return posts.filter((post)=> post._id !== action.payload);
        default:
            return posts;
    }
}