import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createPost } from '../../utils/posts/create-post.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { updateCommentById } from '../../utils/comments/update-comment-by-id.test-util';
import { UpdateCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { getUpdateCommentInputDTO } from '../../utils/comments/input-dto-utils/get-update-comment-input-dto.test-util';
import { deleteCommentById } from '../../utils/comments/delete-comment-by-id.test-util';
import { likeCommentById } from '../../utils/comments/like-comment-by-id.test-util';
import { validUserAgents } from '../../test-data/auth.test-data';
import { CommentLikeStatusInputDTO } from '../../../src/comments/routes/input-dto/like-comment-by-id.input-dto';
import { validUserEmails, validUserLogins, validUserPasswords } from '../../test-data/users.test-data';
import { CommentLikeDataDBType } from '../../../src/comments/repositories/types/comment-like-data-db.type';
import { container } from '../../../src/ioc/container';
import { CommentsRepository } from '../../../src/comments/repositories/comments.repository';
import { TYPES } from '../../../src/ioc/types';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';

describe('Comments API', () => {
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should return a comment by a correct ID; 003. GET /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

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
  });

  it('✅ 002 should update a comment by a correct ID when a valid access token passed; 001. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const updateCommentData: UpdateCommentByIdInputDTO = getUpdateCommentInputDTO();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

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

    const createdCommentId: string = createdComment.id;

    await updateCommentById(app, testUserAgent, createdCommentId, accessToken, updateCommentData);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual({
      id: createdCommentId,
      content: updateCommentData.content,
      commentatorInfo: createdComment.commentatorInfo,
      createdAt: createdComment.createdAt,
      likesInfo: createdComment.likesInfo,
    });
  });

  it('✅ 003 should like a comment by a correct ID when a valid access token passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();

    const createUserData_02: CreateUserInputDTO = {
      login: validUserLogins.login_01,
      password: validUserPasswords.password_01,
      email: validUserEmails.email_01,
    };

    await createUser(app, createUserData_01);
    await createUser(app, createUserData_02);

    const accessToken_01: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const accessToken_02: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_02.login,
      password: createUserData_02.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken_01
    );

    const createdCommentId: string = createdComment.id;

    await likeCommentById(app, testUserAgent, accessToken_01, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    const getCommentByIdResponse_01: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken_01
    );

    await likeCommentById(app, testUserAgent, accessToken_01, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.None,
    });

    const getCommentByIdResponse_02: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken_01
    );

    await likeCommentById(app, testUserAgent, accessToken_01, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Dislike,
    });

    const getCommentByIdResponse_03: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken_01
    );

    await likeCommentById(app, testUserAgent, accessToken_01, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.None,
    });

    const getCommentByIdResponse_04: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken_01
    );

    await likeCommentById(app, testUserAgent, accessToken_01, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    const getCommentByIdResponse_05: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken_01
    );

    const getCommentByIdResponse_06: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken_02
    );

    const getCommentByIdResponse_07: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      undefined,
      undefined,
      false,
      true
    );

    expect(getCommentByIdResponse_01.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.Like);
    expect(getCommentByIdResponse_01.likesInfo.likesCount).toBe(1);
    expect(getCommentByIdResponse_01.likesInfo.dislikesCount).toBe(0);
    expect(getCommentByIdResponse_02.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse_02.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse_02.likesInfo.dislikesCount).toBe(0);
    expect(getCommentByIdResponse_03.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.Dislike);
    expect(getCommentByIdResponse_03.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse_03.likesInfo.dislikesCount).toBe(1);
    expect(getCommentByIdResponse_04.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse_04.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse_04.likesInfo.dislikesCount).toBe(0);
    expect(getCommentByIdResponse_05.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.Like);
    expect(getCommentByIdResponse_05.likesInfo.likesCount).toBe(1);
    expect(getCommentByIdResponse_05.likesInfo.dislikesCount).toBe(0);
    expect(getCommentByIdResponse_06.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse_06.likesInfo.likesCount).toBe(1);
    expect(getCommentByIdResponse_06.likesInfo.dislikesCount).toBe(0);
    expect(getCommentByIdResponse_07.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse_07.likesInfo.likesCount).toBe(1);
    expect(getCommentByIdResponse_07.likesInfo.dislikesCount).toBe(0);
  });

  it('✅ 004 should delete a comment and its likes by a correct ID when a valid access token passed; 002. DELETE /api/comments/:id', async () => {
    const commentsRepository = container.get<CommentsRepository>(TYPES.CommentsRepository);

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

    const createdCommentId: string = createdComment.id;

    await likeCommentById(app, testUserAgent, accessToken, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    await deleteCommentById(app, testUserAgent, createdCommentId, accessToken);

    await getCommentById(app, testUserAgent, createdCommentId, accessToken, HttpStatuses.NotFound_404);

    const commentLikeData_01: CommentLikeDataDBType | null =
      await commentsRepository.findCommentLikeDataByCommentIdAndUserId(createdCommentId, createdUser.id);

    expect(commentLikeData_01).toBeNull();
  });
});
