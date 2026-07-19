import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createPost } from '../../utils/posts/create-post.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { UpdateCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';
import { updateCommentById } from '../../utils/comments/update-comment-by-id.test-util';
import { getUpdateCommentInputDTO } from '../../utils/comments/input-dto-utils/get-update-comment-input-dto.test-util';
import { doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { deleteCommentById } from '../../utils/comments/delete-comment-by-id.test-util';
import {
  invalidAccessTokens,
  invalidUserAgents,
  validAccessTokens,
  validUserAgents,
} from '../../test-data/auth.test-data';
import {
  invalidCommentContents,
  invalidCommentIds,
  invalidCommentLikesData,
  validCommentIds,
} from '../../test-data/comments.test-data';
import { likeCommentById } from '../../utils/comments/like-comment-by-id.test-util';
import { CommentLikeStatusInputDTO } from '../../../src/comments/routes/input-dto/like-comment-by-id.input-dto';

describe('Comments API Validation', () => {
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not return a comment by an invalid ID; 003. GET /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;
    await createCommentForPost(app, testUserAgent, createdPost.id, accessToken);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getCommentByIdResponse_01: any = await getCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_01,
      accessToken,
      testStatus
    );

    const getCommentByIdResponse_02: any = await getCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_02,
      accessToken,
      testStatus
    );

    const getCommentByIdResponse_03: any = await getCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_03,
      accessToken,
      testStatus
    );

    expect(getCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(getCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(getCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(getCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(getCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(getCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 002 should not return a comment by an incorrect ID; 003. GET /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;
    await createCommentForPost(app, testUserAgent, createdPost.id, accessToken);

    await getCommentById(app, testUserAgent, validCommentIds.id_01, accessToken, HttpStatuses.NotFound_404);
  });

  it('❌ 003 should not update a comment by a correct ID when an invalid access token passed; 001. PUT /api/comments/:id', async () => {
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
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_01,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_02,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_03,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_04,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_05,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_06,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_07,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_08,
      updateCommentData,
      testStatus
    );

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      invalidAccessTokens.AT_09,
      updateCommentData,
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 004 should not update a comment by a correct ID when an incorrect access token passed; 001. PUT /api/comments/:id', async () => {
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

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      validAccessTokens.AT_01,
      updateCommentData,
      HttpStatuses.Unauthorized_401
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 005 should not update a comment by a correct ID when an access token not passed; 001. PUT /api/comments/:id', async () => {
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

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      updateCommentData,
      HttpStatuses.Unauthorized_401,
      false,
      true
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 006 should not update a comment by an invalid ID; 001. PUT /api/comments/:id', async () => {
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

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updateCommentByIdResponse_01: any = await updateCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_01,
      accessToken,
      updateCommentData,
      testStatus
    );

    const updateCommentByIdResponse_02: any = await updateCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_02,
      accessToken,
      updateCommentData,
      testStatus
    );

    const updateCommentByIdResponse_03: any = await updateCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_03,
      accessToken,
      updateCommentData,
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(updateCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(updateCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(updateCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(updateCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(updateCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(updateCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 007 should not update a comment by an incorrect ID; 001. PUT /api/comments/:id', async () => {
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

    await updateCommentById(
      app,
      testUserAgent,
      validCommentIds.id_01,
      accessToken,
      undefined,
      HttpStatuses.NotFound_404
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 008 should not update a comment by a correct ID when an invalid user agent passed; 001. PUT /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await updateCommentById(app, invalidUserAgents.userAgent_01, createdCommentId, accessToken, undefined, testStatus);
    await updateCommentById(app, invalidUserAgents.userAgent_02, createdCommentId, accessToken, undefined, testStatus);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 009 should not update a comment by a correct ID when a user agent not passed; 001. PUT /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;

    await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      undefined,
      HttpStatuses.Unauthorized_401,
      true
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 010 should not update a comment by a correct ID when an invalid body passed; 001. PUT /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updateCommentByIdResponse_01: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_01 },
      testStatus
    );

    const updateCommentByIdResponse_02: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_02 },
      testStatus
    );

    const updateCommentByIdResponse_03: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_03 },
      testStatus
    );

    const updateCommentByIdResponse_04: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_04 },
      testStatus
    );

    const updateCommentByIdResponse_05: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_05 },
      testStatus
    );

    const updateCommentByIdResponse_06: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_06 },
      testStatus
    );

    const updateCommentByIdResponse_07: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_07 },
      testStatus
    );

    const updateCommentByIdResponse_08: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_08 },
      testStatus
    );

    const updateCommentByIdResponse_09: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_09 },
      testStatus
    );

    const updateCommentByIdResponse_10: any = await updateCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_10 },
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(updateCommentByIdResponse_01.errorsMessages[0].field).toBe('content');

    expect(updateCommentByIdResponse_01.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(updateCommentByIdResponse_02.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_02.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(updateCommentByIdResponse_03.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(updateCommentByIdResponse_04.errorsMessages[0].field).toBe('content');

    expect(updateCommentByIdResponse_04.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(updateCommentByIdResponse_05.errorsMessages[0].field).toBe('content');

    expect(updateCommentByIdResponse_05.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(updateCommentByIdResponse_06.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_06.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updateCommentByIdResponse_07.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_07.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updateCommentByIdResponse_08.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_08.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updateCommentByIdResponse_09.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_09.errorsMessages[0].message).toBe('Field "content" is required');
    expect(updateCommentByIdResponse_10.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_10.errorsMessages[0].message).toBe('Field "content" must be a string');
  });

  it('❌ 011 should not like a comment by a correct ID when an invalid access token passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_01,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_02,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_03,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_04,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_05,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_06,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_07,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_08,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      testUserAgent,
      invalidAccessTokens.AT_09,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
  });

  it('❌ 012 should not like a comment by a correct ID when an incorrect access token passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const createdCommentId: string = createdComment.id;

    await likeCommentById(
      app,
      testUserAgent,
      validAccessTokens.AT_01,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      HttpStatuses.Unauthorized_401
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
  });

  it('❌ 013 should not like a comment by a correct ID when an access token not passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const createdCommentId: string = createdComment.id;

    await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      HttpStatuses.Unauthorized_401,
      false,
      true
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
  });

  it('❌ 014 should not like a comment by an invalid ID; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const likeCommentByIdResponse_01: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      invalidCommentIds.id_01,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    const likeCommentByIdResponse_02: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      invalidCommentIds.id_02,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    const likeCommentByIdResponse_03: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      invalidCommentIds.id_03,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
    expect(likeCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(likeCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(likeCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(likeCommentByIdResponse_02.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(likeCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(likeCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 015 should not like a comment by an incorrect ID; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      validCommentIds.id_01,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      HttpStatuses.NotFound_404
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
  });

  it('❌ 016 should not like a comment by a correct ID when an invalid user agent passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await likeCommentById(
      app,
      invalidUserAgents.userAgent_01,
      accessToken,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    await likeCommentById(
      app,
      invalidUserAgents.userAgent_02,
      accessToken,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
  });

  it('❌ 017 should not like a comment by a correct ID when a user agent not passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const createdCommentId: string = createdComment.id;

    await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: CommentLikeStatusInputDTO.Like },
      HttpStatuses.Unauthorized_401,
      true
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
  });

  it('❌ 018 should not like a comment by a correct ID when an invalid body passed; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createdComment: CommentOutputDTO = await createCommentForPost(
      app,
      testUserAgent,
      createdPost.id,
      accessToken
    );

    const createdCommentId: string = createdComment.id;

    const likeCommentByIdResponse_01: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_01 },
      testStatus
    );

    const likeCommentByIdResponse_02: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_02 },
      testStatus
    );

    const likeCommentByIdResponse_03: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_03 },
      testStatus
    );

    const likeCommentByIdResponse_04: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_04 },
      testStatus
    );

    const likeCommentByIdResponse_05: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_05 },
      testStatus
    );

    const likeCommentByIdResponse_06: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_06 },
      testStatus
    );

    const likeCommentByIdResponse_07: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_07 },
      testStatus
    );

    const likeCommentByIdResponse_08: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_08 },
      testStatus
    );

    const likeCommentByIdResponse_09: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_09 },
      testStatus
    );

    const likeCommentByIdResponse_10: any = await likeCommentById(
      app,
      testUserAgent,
      accessToken,
      createdCommentId,
      { likeStatus: invalidCommentLikesData.data_10 },
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse.likesInfo.dislikesCount).toBe(0);
    expect(likeCommentByIdResponse_01.errorsMessages[0].field).toBe('likeStatus');

    expect(likeCommentByIdResponse_01.errorsMessages[0].message).toBe(
      'Field "likeStatus" must be one of: None, Like, Dislike'
    );

    expect(likeCommentByIdResponse_02.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_02.errorsMessages[0].message).toBe('Field "likeStatus" must not be empty');
    expect(likeCommentByIdResponse_03.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "likeStatus" must not be empty');
    expect(likeCommentByIdResponse_04.errorsMessages[0].field).toBe('likeStatus');

    expect(likeCommentByIdResponse_04.errorsMessages[0].message).toBe(
      'Field "likeStatus" must be one of: None, Like, Dislike'
    );

    expect(likeCommentByIdResponse_05.errorsMessages[0].field).toBe('likeStatus');

    expect(likeCommentByIdResponse_05.errorsMessages[0].message).toBe(
      'Field "likeStatus" must be one of: None, Like, Dislike'
    );

    expect(likeCommentByIdResponse_06.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_06.errorsMessages[0].message).toBe('Field "likeStatus" must be a string');
    expect(likeCommentByIdResponse_07.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_07.errorsMessages[0].message).toBe('Field "likeStatus" must be a string');
    expect(likeCommentByIdResponse_08.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_08.errorsMessages[0].message).toBe('Field "likeStatus" must be a string');
    expect(likeCommentByIdResponse_09.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_09.errorsMessages[0].message).toBe('Field "likeStatus" is required');
    expect(likeCommentByIdResponse_10.errorsMessages[0].field).toBe('likeStatus');
    expect(likeCommentByIdResponse_10.errorsMessages[0].message).toBe('Field "likeStatus" must be a string');
  });

  it('❌ 019 should not like a comment by a correct ID when a user tries to set the same like status; 004. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData_01);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData_01.login,
      password: createUserData_01.password,
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
      likeStatus: CommentLikeStatusInputDTO.None,
    });

    const getCommentByIdResponse_01: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    likeCommentById(app, testUserAgent, accessToken, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Like,
    });

    const getCommentByIdResponse_02: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    await likeCommentById(app, testUserAgent, accessToken, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Dislike,
    });

    likeCommentById(app, testUserAgent, accessToken, createdCommentId, {
      likeStatus: CommentLikeStatusInputDTO.Dislike,
    });

    const getCommentByIdResponse_03: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse_01.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.None);
    expect(getCommentByIdResponse_01.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse_01.likesInfo.dislikesCount).toBe(0);

    expect(getCommentByIdResponse_02.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.Like);
    expect(getCommentByIdResponse_02.likesInfo.likesCount).toBe(1);
    expect(getCommentByIdResponse_02.likesInfo.dislikesCount).toBe(0);

    expect(getCommentByIdResponse_03.likesInfo.myStatus).toBe(CommentLikeStatusInputDTO.Dislike);
    expect(getCommentByIdResponse_03.likesInfo.likesCount).toBe(0);
    expect(getCommentByIdResponse_03.likesInfo.dislikesCount).toBe(1);
  });

  it('❌ 020 should not delete a comment by a correct ID when an invalid access token passed; 002. DELETE /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_01, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_02, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_03, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_04, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_05, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_06, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_07, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_08, testStatus);
    await deleteCommentById(app, testUserAgent, createdCommentId, invalidAccessTokens.AT_09, testStatus);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 021 should not delete a comment by a correct ID when an incorrect access token passed; 002. DELETE /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;

    await deleteCommentById(
      app,
      testUserAgent,
      createdCommentId,
      validAccessTokens.AT_01,
      HttpStatuses.Unauthorized_401
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 022 should not delete a comment by a correct ID when an access token not passed; 002. DELETE /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;

    await deleteCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken,
      HttpStatuses.Unauthorized_401,
      false,
      true
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 023 should not delete a comment by an invalid ID; 002. DELETE /api/comments/:id', async () => {
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

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const deleteCommentByIdResponse_01: any = await deleteCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_01,
      accessToken,
      testStatus
    );

    const deleteCommentByIdResponse_02: any = await deleteCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_02,
      accessToken,
      testStatus
    );

    const deleteCommentByIdResponse_03: any = await deleteCommentById(
      app,
      testUserAgent,
      invalidCommentIds.id_03,
      accessToken,
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(deleteCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(deleteCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deleteCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(deleteCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deleteCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(deleteCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 024 should not delete a comment by an incorrect ID; 002. DELETE /api/comments/:id', async () => {
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

    await deleteCommentById(app, testUserAgent, validCommentIds.id_01, accessToken, HttpStatuses.NotFound_404);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdComment.id,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 025 should not delete a comment by a correct ID when an invalid user agent passed; 002. DELETE /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await deleteCommentById(app, invalidUserAgents.userAgent_01, createdCommentId, accessToken, testStatus);
    await deleteCommentById(app, invalidUserAgents.userAgent_02, createdCommentId, accessToken, testStatus);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 026 should not delete a comment by a correct ID when a user agent not passed; 002. DELETE /api/comments/:id', async () => {
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

    const createdCommentId: string = createdComment.id;

    await deleteCommentById(app, testUserAgent, createdCommentId, accessToken, HttpStatuses.Unauthorized_401, true);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(
      app,
      testUserAgent,
      createdCommentId,
      accessToken
    );

    expect(getCommentByIdResponse).toEqual(createdComment);
  });
});
