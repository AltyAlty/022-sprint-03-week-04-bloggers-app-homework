import { container } from '../../../src/ioc/container';
import { TYPES } from '../../../src/ioc/types';
import { CommentsRepository } from '../../../src/comments/repositories/comments.repository';
import { PostsRepository } from '../../../src/posts/repositories/posts.repository';
import { CommentLikeDataDBType } from '../../../src/comments/repositories/types/comment-like-data-db.type';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { PostLikeDataDBType } from '../../../src/posts/repositories/types/post-like-data-db.type';
import { CommentLikeStatusInputDTO } from '../../../src/comments/routes/input-dto/like-comment-by-id.input-dto';
import { PostLikeStatusInputDTO } from '../../../src/posts/routes/input-dto/like-post-by-id.input-dto';
import { UpdatePostByIdInputDTO } from '../../../src/posts/routes/input-dto/update-post-by-id.input-dto';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { PaginatedCommentListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comment-list.output-dto';
import { PaginatedPostListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-post-list.output-dto';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { validUserAgents } from '../../test-data/auth.test-data';
import { validCommentsPaginationSettings } from '../../test-data/comments.test-data';
import { validPostsPaginationSettings } from '../../test-data/posts.test-data';
import { validUserEmails, validUserLogins, validUserPasswords } from '../../test-data/users.test-data';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { likeCommentById } from '../../utils/comments/like-comment-by-id.test-util';
import { doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { createPost } from '../../utils/posts/create-post.test-util';
import { deletePostById } from '../../utils/posts/delete-post-by-id.test-util';
import { getCommentListByPostId } from '../../utils/posts/get-comment-list-by-post-id.test-util';
import { getPostById } from '../../utils/posts/get-post-by-id.test-util';
import { getPostList } from '../../utils/posts/get-post-list.test-util';
import { getUpdatePostInputDTO } from '../../utils/posts/input-dto-utils/get-update-post-input-dto.test-util';
import { likePostById } from '../../utils/posts/like-post-by-id.test-util';
import { updatePostById } from '../../utils/posts/update-post-by-id.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';

describe('Posts API', () => {
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should create a post; 004. POST /api/posts', async () => {
    const createdPost: PostOutputDTO = await createPost(app);

    const getPostByIdResponse: PostOutputDTO = await getPostById(
      app,
      undefined,
      createdPost.id,
      undefined,
      undefined,
      true,
      true
    );

    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('✅ 002 should return a post by a correct ID; 005. GET /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);

    const getPostByIdResponse: PostOutputDTO = await getPostById(
      app,
      undefined,
      createdPost.id,
      undefined,
      undefined,
      true,
      true
    );

    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('✅ 003 should return a list of posts; 003. GET /api/posts', async () => {
    await Promise.all([createPost(app), createPost(app)]);

    const getPostListResponse: PaginatedPostListOutputDTO = await getPostList(app);

    expect(getPostListResponse.items).toBeInstanceOf(Array);
    expect(getPostListResponse.items.length).toBe(2);
    expect(getPostListResponse.totalCount).toBe(2);
  });

  it('✅ 004 should return a list of posts when valid pagination settings passed; 003. GET /api/posts', async () => {
    const url: string = `${SETTINGS.POSTS_PATH}?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;

    await Promise.all([
      createPost(app),
      createPost(app),
      createPost(app),
      createPost(app),
      createPost(app),
      createPost(app),
    ]);

    const getPostListResponse: PaginatedPostListOutputDTO = await getPostList(app, url);

    expect(getPostListResponse.items).toBeInstanceOf(Array);
    expect(getPostListResponse.items.length).toBe(5);
    expect(getPostListResponse.totalCount).toBe(6);
  });

  it('✅ 005 should update a post by a correct ID; 006. PUT /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createdPostBlogId: string = createdPost.blogId;
    const updatePostData: UpdatePostByIdInputDTO = getUpdatePostInputDTO(createdPostBlogId);

    await updatePostById(app, createdPostId, createdPostBlogId, updatePostData);

    const getPostByIdResponse: PostOutputDTO = await getPostById(
      app,
      undefined,
      createdPostId,
      undefined,
      undefined,
      true,
      true
    );

    expect(getPostByIdResponse).toEqual({
      id: createdPostId,
      title: updatePostData.title,
      shortDescription: updatePostData.shortDescription,
      content: updatePostData.content,
      blogId: createdPostBlogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  it('✅ 006 should like a post by a correct ID when a valid access token passed; 008. PUT /api/posts/:id/like-status', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();

    const createUserData_02: CreateUserInputDTO = {
      login: validUserLogins.login_01,
      password: validUserPasswords.password_01,
      email: validUserEmails.email_01,
    };

    const createUserData_03: CreateUserInputDTO = {
      login: validUserLogins.login_03,
      password: validUserPasswords.password_01,
      email: validUserEmails.email_03,
    };

    const createdUser_01: UserOutputDTO = await createUser(app, createUserData_01);
    const createdUser_02: UserOutputDTO = await createUser(app, createUserData_02);
    const createdUser_03: UserOutputDTO = await createUser(app, createUserData_03);

    const accessToken_01: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const accessToken_02: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_02.login,
      password: createUserData_02.password,
    });

    const accessToken_03: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_03.login,
      password: createUserData_03.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    await likePostById(app, testUserAgent, accessToken_01, createdPostId, {
      likeStatus: PostLikeStatusInputDTO.Like,
    });

    const getPostByIdResponse_01: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_01);
    await likePostById(app, testUserAgent, accessToken_01, createdPostId, { likeStatus: PostLikeStatusInputDTO.None });
    const getPostByIdResponse_02: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_01);

    await likePostById(app, testUserAgent, accessToken_01, createdPostId, {
      likeStatus: PostLikeStatusInputDTO.Dislike,
    });

    const getPostByIdResponse_03: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_01);
    await likePostById(app, testUserAgent, accessToken_01, createdPostId, { likeStatus: PostLikeStatusInputDTO.None });
    const getPostByIdResponse_04: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_01);
    await likePostById(app, testUserAgent, accessToken_01, createdPostId, { likeStatus: PostLikeStatusInputDTO.Like });
    const getPostByIdResponse_05: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_01);
    const getPostByIdResponse_06: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_02);

    const getPostByIdResponse_07: PostOutputDTO = await getPostById(
      app,
      testUserAgent,
      createdPostId,
      undefined,
      undefined,
      false,
      true
    );

    await likePostById(app, testUserAgent, accessToken_02, createdPostId, { likeStatus: PostLikeStatusInputDTO.Like });
    await likePostById(app, testUserAgent, accessToken_03, createdPostId, { likeStatus: PostLikeStatusInputDTO.Like });
    const getPostByIdResponse_08: PostOutputDTO = await getPostById(app, testUserAgent, createdPostId, accessToken_01);

    expect(getPostByIdResponse_01.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.Like);
    expect(getPostByIdResponse_01.extendedLikesInfo.likesCount).toBe(1);
    expect(getPostByIdResponse_01.extendedLikesInfo.dislikesCount).toBe(0);
    expect(getPostByIdResponse_02.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.None);
    expect(getPostByIdResponse_02.extendedLikesInfo.likesCount).toBe(0);
    expect(getPostByIdResponse_02.extendedLikesInfo.dislikesCount).toBe(0);
    expect(getPostByIdResponse_03.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.Dislike);
    expect(getPostByIdResponse_03.extendedLikesInfo.likesCount).toBe(0);
    expect(getPostByIdResponse_03.extendedLikesInfo.dislikesCount).toBe(1);
    expect(getPostByIdResponse_04.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.None);
    expect(getPostByIdResponse_04.extendedLikesInfo.likesCount).toBe(0);
    expect(getPostByIdResponse_04.extendedLikesInfo.dislikesCount).toBe(0);
    expect(getPostByIdResponse_05.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.Like);
    expect(getPostByIdResponse_05.extendedLikesInfo.likesCount).toBe(1);
    expect(getPostByIdResponse_05.extendedLikesInfo.dislikesCount).toBe(0);
    expect(getPostByIdResponse_06.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.None);
    expect(getPostByIdResponse_06.extendedLikesInfo.likesCount).toBe(1);
    expect(getPostByIdResponse_06.extendedLikesInfo.dislikesCount).toBe(0);
    expect(getPostByIdResponse_07.extendedLikesInfo.myStatus).toBe(PostLikeStatusInputDTO.None);
    expect(getPostByIdResponse_07.extendedLikesInfo.likesCount).toBe(1);
    expect(getPostByIdResponse_07.extendedLikesInfo.dislikesCount).toBe(0);
    expect(getPostByIdResponse_08.extendedLikesInfo.newestLikes.length).toBe(3);
    expect(getPostByIdResponse_08.extendedLikesInfo.newestLikes[0].userId).toBe(createdUser_03.id);
    expect(getPostByIdResponse_08.extendedLikesInfo.newestLikes[1].userId).toBe(createdUser_02.id);
    expect(getPostByIdResponse_08.extendedLikesInfo.newestLikes[2].userId).toBe(createdUser_01.id);
  });

  it('✅ 007 should delete a post and its likes by a correct ID; 007. DELETE /api/posts/:id', async () => {
    const postsRepository = container.get<PostsRepository>(TYPES.PostsRepository);

    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await likePostById(app, validUserAgents.userAgent_01, accessToken, createdPostId, {
      likeStatus: PostLikeStatusInputDTO.Like,
    });

    await deletePostById(app, createdPostId);

    await getPostById(app, undefined, createdPostId, undefined, HttpStatuses.NotFound_404, true, true);

    const postLikeData: PostLikeDataDBType | null = await postsRepository.findPostLikeDataByPostIdAndUserId(
      createdPostId,
      createdUser.id
    );

    expect(postLikeData).toBeNull();
  });

  it(`✅ 008 should delete a post with its likes, its comments and comments' likes by a correct ID; 007. DELETE /api/posts/:id`, async () => {
    const postsRepository = container.get<PostsRepository>(TYPES.PostsRepository);
    const commentsRepository = container.get<CommentsRepository>(TYPES.CommentsRepository);

    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;
    await likePostById(app, testUserAgent, accessToken, createdPostId, { likeStatus: PostLikeStatusInputDTO.Like });

    const createdComment_01: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPostId,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdComment_01.id, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    const createdComment_02: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPostId,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdComment_02.id, {
      likeStatus: CommentLikeStatusInputDTO.Dislike,
    });

    const testStatus: HttpStatuses = HttpStatuses.NotFound_404;

    await deletePostById(app, createdPostId);

    await getPostById(app, undefined, createdPostId, undefined, testStatus, true, true);
    await getCommentListByPostId(app, testUserAgent, createdPostId, undefined, accessToken, testStatus);
    await getCommentById(app, testUserAgent, createdComment_01.id, accessToken, testStatus);
    await getCommentById(app, testUserAgent, createdComment_02.id, accessToken, testStatus);

    const postLikeData: PostLikeDataDBType | null = await postsRepository.findPostLikeDataByPostIdAndUserId(
      createdPostId,
      createdUser.id
    );

    expect(postLikeData).toBeNull();

    const commentLikeData_01: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdComment_01.id, createdUserId);

    const commentLikeData_02: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdComment_01.id, createdUserId);

    expect(commentLikeData_01).toBeNull();
    expect(commentLikeData_02).toBeNull();
  });

  it('✅ 009 should create a comment for a post by a correct ID; 002. POST /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(getCommentByIdResponse.commentatorInfo.userId).toBe(createdUser.id);
    expect(getCommentByIdResponse.commentatorInfo.userLogin).toBe(createdUser.login);
  });

  it('✅ 010 should return a list of comments for a post by a correct ID; 001. GET /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    await Promise.all([
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
    ]);

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      testUserAgent,
      createdPostId,
      undefined,
      accessToken
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(2);
    expect(getCommentListByPostIdResponse.totalCount).toBe(2);
  });

  it('✅ 011 should return a list of comments for a post by a correct ID when valid pagination settings passed; 001. GET /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const url: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${validCommentsPaginationSettings.pageSize}&pageNumber=${validCommentsPaginationSettings.pageNumber}&sortDirection=${validCommentsPaginationSettings.sortDirection}&sortBy=${validCommentsPaginationSettings.sortBy}`;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    await Promise.all([
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
      createCommentForPost(app, testUserAgent, createdPostId, accessToken),
    ]);

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      testUserAgent,
      createdPostId,
      url,
      accessToken
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(5);
    expect(getCommentListByPostIdResponse.totalCount).toBe(6);
  });
});
