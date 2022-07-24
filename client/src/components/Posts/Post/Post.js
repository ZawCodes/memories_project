import React, {useState} from 'react'
import useStyles from './styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {deletePost, likePost} from '../../../actions/posts'
import { useHistory } from 'react-router-dom';

const Post = ({post, setCurrentId}) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const userId = user?.result?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);
    const handleLike = async () => {
        dispatch(likePost(post._id));
        console.log(likes);//state
        if(hasLikedPost){
          setLikes(likes.filter((id) => id !== userId))
          console.log('unlike', likes);
        }
        else {
          setLikes([...likes, userId]);
          console.log('like', likes);
        }
    };
    

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const Likes = () => {
      if(likes.length > 0) {
        
        return likes.find((like) => like === userId)
        ?(
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length -1 } others`:`${likes.length} like${likes.length >1?'s':''}`}</>
        ):(
          <><ThumbUpAltOutlined fontSize="small"/>&nbsp;{likes.length} {likes.length === 1? 'Like' : 'Likes'}</>
        )
      }
      return <><ThumbUpAltOutlined fontSize="small"/>&nbsp;Like</>
    }

    const openPost =() => {
      history.push(`/posts/${post._id}`)
    };
    
  return (
    <Card className={classes.card} raised elevation={6}>
      <div style={{cursor: 'pointer'}} className={classes.cardAction} onClick={openPost}>
      <CardMedia className={classes.media} image={post.selectedFile} title={post.title}/>
      <div className={classes.overlay}>
        <Typography variant="h6">{post.name}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </div>
      </div>
      {(user?.token === post?.creator || user?.result?._id === post?.creator) && (
            <div className={classes.overlay2}>
          <Button style={{color: 'white'}} size="small" onClick={() => setCurrentId(post._id)}>
            <MoreHorizIcon fontSize="medium" />
          </Button>
      </div>
      )}
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary">{post.tags.map((tag)=> `#${tag} `)}</Typography>
      </div>
              <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
      {/* <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
      </CardContent> */}
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>
        {(user?.token === post?.creator || user?.result?._id === post?.creator) && (
             <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
          <DeleteIcon fontSize="small"/>
          Delete
        </Button>
        )}
     
      </CardActions>
    </Card>
  )
}

export default Post