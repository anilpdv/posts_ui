import { Post } from "../types";
import styles from "../styles/common.module.css";

type PostItemProps = {
  post: Post;
};

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.card__title}>{post.title}</h2>
      <p className={styles.card__desc}>{post.body}</p>
    </div>
  );
}
