import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { createBlog } from '../../utils/blogs/create-blog.test-util';
import { getBlogById } from '../../utils/blogs/get-blog-by-id.test-util';
import { UpdateBlogByIdInputDTO } from '../../../src/blogs/routes/input-dto/update-blog-by-id.input-dto';
import { updateBlogById } from '../../utils/blogs/update-blog-by-id.test-util';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { getPostById } from '../../utils/posts/get-post-by-id.test-util';
import { getBlogList } from '../../utils/blogs/get-blog-list.test-util';
import { getPostListByBlogId } from '../../utils/blogs/get-post-list-by-blog-id.test-util';
import { deleteBlogById } from '../../utils/blogs/delete-blog-by-id.test-util';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog.test-util';
import { doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { createPost } from '../../utils/posts/create-post.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { getCommentListByPostId } from '../../utils/posts/get-comment-list-by-post-id.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { PaginatedBlogListOutputDTO } from '../../../src/blogs/routes/output-dto/paginated-blog-list.output-dto';
import { PaginatedPostListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-post-list.output-dto';
import { validBlogNames, validBlogsPaginationSettings } from '../../test-data/blogs.test-data';
import { validPostsPaginationSettings } from '../../test-data/posts.test-data';
import { getUpdateBlogInputDTO } from '../../utils/blogs/input-dto-utils/get-update-blog-input-dto.test-util';
import { validUserAgents } from '../../test-data/auth.test-data';
import { likeCommentById } from '../../utils/comments/like-comment-by-id.test-util';
import { CommentLikeStatusInputDTO } from '../../../src/comments/routes/input-dto/like-comment-by-id.input-dto';
import { container } from '../../../src/ioc/container';
import { AuthRepository } from '../../../src/auth/repositories/auth.repository';
import { TYPES } from '../../../src/ioc/types';
import { CommentsRepository } from '../../../src/comments/repositories/comments.repository';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { CommentLikeDataDBType } from '../../../src/comments/repositories/types/comment-like-data-db.type';

describe('Blogs API', () => {
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should create a blog; 002. POST /api/blogs', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);

    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlog.id);
    expect(getBlogByIdResponse).toEqual(createdBlog);
  });

  it('✅ 002 should return a blog by a correct ID; 005. GET /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);

    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlog.id);

    expect(getBlogByIdResponse).toEqual(createdBlog);
  });

  it('✅ 003 should return a list of blogs; 001. GET /api/blogs', async () => {
    await Promise.all([createBlog(app), createBlog(app)]);

    const getBlogListResponse: PaginatedBlogListOutputDTO = await getBlogList(app);

    expect(getBlogListResponse.items).toBeInstanceOf(Array);
    expect(getBlogListResponse.items.length).toBe(2);
    expect(getBlogListResponse.totalCount).toBe(2);
  });

  it('✅ 004 should return a list of blogs when valid pagination settings passed; 001. GET /api/blogs', async () => {
    const url: string = `${SETTINGS.BLOGS_PATH}?pageSize=${validBlogsPaginationSettings.pageSize}&pageNumber=${validBlogsPaginationSettings.pageNumber}&searchNameTerm=${validBlogsPaginationSettings.searchNameTerm}&sortDirection=${validBlogsPaginationSettings.sortDirection}&sortBy=${validBlogsPaginationSettings.sortBy}`;

    await Promise.all([
      createBlog(app, { name: validBlogNames.name_01 }),
      createBlog(app, { name: validBlogNames.name_02 }),
      createBlog(app, { name: validBlogNames.name_03 }),
      createBlog(app, { name: validBlogNames.name_04 }),
      createBlog(app, { name: validBlogNames.name_05 }),
      createBlog(app, { name: validBlogNames.name_06 }),
      createBlog(app),
      createBlog(app),
    ]);

    const getBlogListResponse: PaginatedBlogListOutputDTO = await getBlogList(app, url);

    expect(getBlogListResponse.items).toBeInstanceOf(Array);
    expect(getBlogListResponse.items.length).toBe(5);
    expect(getBlogListResponse.totalCount).toBe(6);
    expect(getBlogListResponse.items[0].name).toBe(validBlogNames.name_01);
    expect(getBlogListResponse.items[1].name).toBe(validBlogNames.name_02);
    expect(getBlogListResponse.items[2].name).toBe(validBlogNames.name_03);
    expect(getBlogListResponse.items[3].name).toBe(validBlogNames.name_04);
    expect(getBlogListResponse.items[4].name).toBe(validBlogNames.name_05);
  });

  it('✅ 005 should update a blog by a correct ID; 006. PUT /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const updateBlogData: UpdateBlogByIdInputDTO = getUpdateBlogInputDTO();

    await updateBlogById(app, createdBlogId, updateBlogData);

    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual({
      id: createdBlogId,
      name: updateBlogData.name,
      description: updateBlogData.description,
      websiteUrl: updateBlogData.websiteUrl,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.isMembership,
    });
  });

  it('✅ 006 should delete a blog by a correct ID; 007. DELETE /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;

    await deleteBlogById(app, createdBlogId);

    await getBlogById(app, createdBlogId, HttpStatuses.NotFound_404);
  });

  it('✅ 007 should delete a blog with its posts by a correct ID; 007. DELETE /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost_01: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPost_02: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const testStatus: HttpStatuses = HttpStatuses.NotFound_404;

    await deleteBlogById(app, createdBlogId);

    await getBlogById(app, createdBlogId, testStatus);
    await getPostListByBlogId(app, createdBlogId, undefined, testStatus);
    await getPostById(app, createdPost_01.id, testStatus);
    await getPostById(app, createdPost_02.id, testStatus);
  });

  it(`✅ 008 should delete a blog with its posts, comments and comments' likes by a correct ID; 007. DELETE /api/blogs/:id`, async () => {
    const commentsRepository = container.get<CommentsRepository>(TYPES.CommentsRepository);

    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost_01: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPost_02: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId_01: string = createdPost_01.id;
    const createdPostId_02: string = createdPost_02.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment_01: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPostId_01,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdComment_01.id, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    const createdComment_02: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPostId_01,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdComment_02.id, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    const createdComment_03: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPostId_02,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdComment_03.id, {
      likeStatus: CommentLikeStatusInputDTO.Dislike,
    });

    const createdComment_04: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPostId_02,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdComment_04.id, {
      likeStatus: CommentLikeStatusInputDTO.Dislike,
    });

    const testStatus: HttpStatuses = HttpStatuses.NotFound_404;

    await deleteBlogById(app, createdBlogId);

    await getBlogById(app, createdBlogId, testStatus);
    await getPostListByBlogId(app, createdBlogId, undefined, testStatus);
    await getPostById(app, createdPostId_01, testStatus);
    await getPostById(app, createdPostId_02, testStatus);
    await getCommentListByPostId(app, testUserAgent, createdPostId_01, undefined, accessToken, testStatus);
    await getCommentListByPostId(app, testUserAgent, createdPostId_02, undefined, accessToken, testStatus);
    await getCommentById(app, testUserAgent, createdComment_01.id, accessToken, testStatus);
    await getCommentById(app, testUserAgent, createdComment_02.id, accessToken, testStatus);
    await getCommentById(app, testUserAgent, createdComment_03.id, accessToken, testStatus);
    await getCommentById(app, testUserAgent, createdComment_04.id, accessToken, testStatus);

    const commentLikeData_01: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdComment_01.id, createdUserId);

    const commentLikeData_02: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdComment_01.id, createdUserId);

    const commentLikeData_03: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdComment_01.id, createdUserId);

    const commentLikeData_04: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdComment_01.id, createdUserId);

    expect(commentLikeData_01).toBeNull();
    expect(commentLikeData_02).toBeNull();
    expect(commentLikeData_03).toBeNull();
    expect(commentLikeData_04).toBeNull();
  });

  it('✅ 009 should create a post for a blog by a correct ID; 004. POST /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);

    const createdPostForBlog: PostOutputDTO = await createPostForBlog(app, createdBlog.id);

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostForBlog.id);
    expect(getPostByIdResponse).toEqual(createdPostForBlog);
  });

  it('✅ 010 should return a list of posts for a blog by a correct ID; 003. GET /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    await Promise.all([createPostForBlog(app, createdBlogId), createPostForBlog(app, createdBlogId)]);

    const getPostListByBlogIdResponse: PaginatedPostListOutputDTO = await getPostListByBlogId(app, createdBlogId);

    expect(getPostListByBlogIdResponse.items).toBeInstanceOf(Array);
    expect(getPostListByBlogIdResponse.items.length).toBe(2);
    expect(getPostListByBlogIdResponse.totalCount).toBe(2);
  });

  it('✅ 011 should return a list of posts for a blog by a correct ID when valid pagination settings passed; 003. GET /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const url: string = `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;

    await Promise.all([
      createPostForBlog(app, createdBlogId),
      createPostForBlog(app, createdBlogId),
      createPostForBlog(app, createdBlogId),
      createPostForBlog(app, createdBlogId),
      createPostForBlog(app, createdBlogId),
      createPostForBlog(app, createdBlogId),
    ]);

    const getPostListByBlogIdResponse: PaginatedPostListOutputDTO = await getPostListByBlogId(app, createdBlogId, url);

    expect(getPostListByBlogIdResponse.items).toBeInstanceOf(Array);
    expect(getPostListByBlogIdResponse.items.length).toBe(5);
    expect(getPostListByBlogIdResponse.totalCount).toBe(6);
  });
});
