import { WithId } from 'mongodb';
import { PostLikeDataType } from '../../application/types/post-like-data.type';

/*Тип для данных о лайке комментария в БД.*/
export type PostLikeDataDBType = WithId<PostLikeDataType>;
