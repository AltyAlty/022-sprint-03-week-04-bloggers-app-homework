import { BlogType } from '../../application/types/blog.type';

/*Output DTO для блога.*/
export type BlogOutputDTO = BlogType & { id: string };
