import axios from 'axios';

const API = axios.create({baseURL: 'http://localhost:5000'});

API.interceptors.request.use( (req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => {
    if(searchQuery.search && searchQuery.tags) return API.get(`/posts/search?searchQuery=${searchQuery.search}&tags=${searchQuery.tags}`);
    else if(searchQuery.search && !searchQuery.tags) return API.get(`/posts/search?searchQuery=${searchQuery.search}`);
    else if(!searchQuery.search && searchQuery.tags) return API.get(`/posts/search?${searchQuery.search}tags=${searchQuery.tags}`);
    else if(!searchQuery.search && !searchQuery.tags) return API.get(`/posts/search`);
};
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`posts/${id}`);
export const likePost = (id) => API.patch(`posts/${id}/likePost`);
export const comment = (value, id) => API.post(`posts/${id}/commentPost`, {value});

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);