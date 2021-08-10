import { useEffect, useState } from "react";
import { Post } from "../types";
import PostItem from "./postItem";
import styles from "../styles/common.module.css";

export default function Posts() {
  const [state, setState] = useState({
    posts: [] as Post[],
    start: 0,
    end: 0,
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    onInitialFetch(0, 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, false);
    return () => {
      window.removeEventListener("scroll", onScroll, false);
    };
  }, [state]);

  const onInitialFetch = (start: number, end: number) => fetchPosts(start, end);

  const getPostsUrl = (start: number, end: number) =>
    `${process.env.REACT_APP_SERVER}/posts?_start=${start}&_end=${end}`;

  const onSetResult = (start: number, end: number, result: Post[]) =>
    start === 0
      ? applySetResult(result, start, end)
      : applyUpdateResult(result, start, end);

  const applyUpdateResult = (
    result: Post[] = [],
    start: number,
    end: number
  ) => {
    setState((prevState) => ({
      posts: [...prevState.posts, ...result],
      start,
      end,
      isLoading: false,
      isError: result.length === 0,
    }));
  };

  const applySetResult = (result: Post[] = [], start: number, end: number) => {
    setState({
      posts: result,
      start,
      end,
      isLoading: false,
      isError: false,
    });
  };

  const fetchPosts = (start: number, end: number) => {
    setState({ ...state, isLoading: true });
    fetch(getPostsUrl(start, end))
      .then((response) => response.json())
      .then((result) => onSetResult(start, end, result))
      .catch(() => setState({ ...state, isLoading: false, isError: true }));
  };

  const onPaginated = () => {
    fetchPosts(state.end, state.end + 20);
  };

  const onScroll = () => {
    infiniteScrollCondition() && onPaginated();
  };

  const infiniteScrollCondition = () =>
    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    state.posts.length &&
    !state.isLoading &&
    !state.isError;

  return (
    <>
      <h1>Posts</h1>
      <div className={styles.cards}>
        {state.posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
        {state.isLoading ? <div className={styles.loader}></div> : null}
      </div>
    </>
  );
}
