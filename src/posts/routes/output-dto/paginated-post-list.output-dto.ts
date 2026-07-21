import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';
import { PostListOutputDTO } from './post-list.output-dto';

/*Output DTO для постов с пагинацией: содержит метаданные пагинации и массив элементов постов.*/
export type PaginatedPostListOutputDTO = PaginationMetaDataOutputDTO & { items: PostListOutputDTO };
