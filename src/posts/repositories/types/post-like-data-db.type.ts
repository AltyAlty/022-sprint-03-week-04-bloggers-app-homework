import { PostLikeDataType } from '../../application/types/post-like-data.type';
import { WithId } from 'mongodb';

/*Тип для данных о лайке комментария в БД.*/
export type PostLikeDataDBType = WithId<PostLikeDataType>;
