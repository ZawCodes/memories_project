import React, {useState, useEffect} from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core'
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import {useDispatch} from 'react-redux';
import { getPosts , getPostsBySearch} from '../../actions/posts';
import useStyles from './styles';
import Pagination from '../Pagination';
import {useHistory, useLocation} from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null)
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('')
    const [tags, setTags] = useState([])


    const handleKeyPress = (e) => {
      if(e.keyCode === 13) {
        searchPost();
      }
    }

    const handleAdd = (tag) => setTags([...tags, tag]);
    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

    const searchPost = () => {
      if(search.trim() || tags) {
        dispatch(getPostsBySearch({search, tags: tags.join(',')}));
        // history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        if(search && tags.join(',')) history.push(`/posts/search?searchQuery=${search}&tags=${tags.join(',')}`);
        else if(search && !tags.join(',')) history.push(`/posts/search?searchQuery=${search}`);
        else if(!search && tags.join(',')) history.push(`/posts/search?${search}tags=${tags.join(',')}`);
        else if(!search && !tags.join(',')) history.push(`/posts/search`);
      }
      else {
        history.push('/'); //navigate in new version
      }
    }
  return (
    <Grow in>
    <Container maxWidth="xl">
        <Grid style={{padding: '40px 0'}} className={classes.gridContainer} container justifyContent="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={6} md={9}>
                <Posts setCurrentId={setCurrentId}/>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppBar className={classes.appBarSearch} position="static" color="inherit" >
                <TextField name="search" variant="outlined" label="Search Memories"
                onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
                <ChipInput 
                  style={{margin: '10px 0'}}
                  value={tags}
                  onAdd={handleAdd}
                  onDelete={handleDelete}
                  label="Search Tags"
                  variant="outlined"
                />
                <Button variant="contained" onClick={searchPost} className={classes.searchButton} color="primary">Search</Button>
              </AppBar>
                <Form currentId={currentId} setCurrentId={setCurrentId}/>
                {(!searchQuery && !tags.length) && (
                   <Paper style={{padding: '20px 0'}} elevation={6} >
                    <Pagination page={page} className={classes.pagination} />
                </Paper>
                )}
            </Grid>
        </Grid>
    </Container>
</Grow>
  )
}

export default Home