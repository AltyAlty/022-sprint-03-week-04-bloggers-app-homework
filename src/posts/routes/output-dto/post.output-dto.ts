import { PostType } from '../../application/types/post.type';

/*Output DTO для поста.*/
export type PostOutputDTO = PostType & { id: string };
