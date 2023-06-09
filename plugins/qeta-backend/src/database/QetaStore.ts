import {
  Statistic,
  StatisticsRequestParameters,
} from '@nytimes/backstage-plugin-qeta-common';

export interface Question {
  id: number;
  author: string;
  title: string;
  content: string;
  created: Date;
  updated?: Date;
  updatedBy?: string;
  score: number;
  views: number;
  answersCount: number;
  correctAnswer: boolean;
  favorite: boolean;
  ownVote?: number;
  tags?: string[];
  entities?: string[];
  answers?: Answer[];
  own?: boolean;
  votes?: Vote[];
  trend?: number;
  comments?: Comment[];
}

export interface Answer {
  id: number;
  questionId: number;
  author: string;
  content: string;
  correct: boolean;
  created: Date;
  updated?: Date;
  updatedBy?: string;
  score: number;
  ownVote?: number;
  own?: boolean;
  votes?: Vote[];
  comments?: Comment[];
}

export interface Vote {
  author: string;
  score: number;
  timestamp: Date;
}

export interface Comment {
  author: string;
  content: string;
  created: Date;
  own?: boolean;
  updated?: Date;
  updatedBy?: string;
}

export type MaybeAnswer = Answer | null;
export type MaybeQuestion = Question | null;

export interface Questions {
  questions: Question[];
  total: number;
}

export interface QuestionsOptions {
  limit?: number;
  offset?: number;
  author?: string;
  orderBy?:
    | 'views'
    | 'score'
    | 'answersCount'
    | 'created'
    | 'updated'
    | 'trend';
  order?: 'desc' | 'asc';
  noCorrectAnswer?: boolean;
  noAnswers?: boolean;
  noVotes?: boolean;
  favorite?: boolean;
  tags?: string[];
  entity?: string;
  includeAnswers?: boolean;
  includeVotes?: boolean;
  includeEntities?: boolean;

  includeTrend?: boolean;
  random?: boolean;
  searchQuery?: string;
}

export interface TagResponse {
  tag: string;
  questionsCount: number;
}
export interface Attachment {
  id: number;
  uuid: string;
  locationType: string;
  locationUri: string;
  path: string;
  binaryImage: Buffer;
  mimeType: string;
  extension: string;
  creator: string;
  created: Date;
}
export interface AttachmentParameters {
  uuid: string;
  locationType: string;
  locationUri: string;
  extension: string;
  mimeType: string;
  path?: string;
  binaryImage?: Buffer;
  creator?: string;
}

/**
 * Interface for fetching and modifying Q&A data
 */
export interface QetaStore {
  /**
   * Fetch all stored questions with options
   * @param user_ref user name requesting question
   * @param options Search options
   */
  getQuestions(user_ref: string, options: QuestionsOptions): Promise<Questions>;

  /**
   * Fetch single question by id
   * Question views count is increased after fetching the question
   * @param user_ref user name requesting question
   * @param id question id
   * @param recordView record question view, default true
   */
  getQuestion(
    user_ref: string,
    id: number,
    recordView?: boolean,
  ): Promise<MaybeQuestion>;

  /**
   * Fetch single question by answer id
   * Question views count is increased after fetching the question
   * @param user_ref user name requesting question
   * @param answerId answer id
   * @param recordView record question view, default true
   */
  getQuestionByAnswerId(
    user_ref: string,
    answerId: number,
    recordView?: boolean,
  ): Promise<MaybeQuestion>;

  /**
   * Post new question
   * @param user_ref user name of the user posting question
   * @param title question title
   * @param content question content
   * @param tags optional tags for the question
   * @param components optional entity refs of catalog components for the question
   */
  postQuestion(
    user_ref: string,
    title: string,
    content: string,
    tags?: string[],
    components?: string[],
    images?: number[],
  ): Promise<Question>;

  /**
   * Comment question
   * @param question_id question id
   * @param user_ref user
   * @param content comment content
   */
  commentQuestion(
    question_id: number,
    user_ref: string,
    content: string,
  ): Promise<MaybeQuestion>;

  /**
   * Delete question comment
   * @param question_id question id
   * @param id comment id
   * @param user_ref username
   */
  deleteQuestionComment(
    question_id: number,
    id: number,
    user_ref: string,
  ): Promise<MaybeQuestion>;

  /**
   * Update question
   * @param id question id
   * @param user_ref user name of the user updating question
   * @param title new title
   * @param content new content
   * @param tags new tags
   * @param components new components
   */
  updateQuestion(
    id: number,
    user_ref: string,
    title: string,
    content: string,
    tags?: string[],
    components?: string[],
    images?: number[],
  ): Promise<MaybeQuestion>;

  /**
   * Delete question. Only the user who created the question can delete it.
   * @param user_ref user name of the user deleting question
   * @param id question id
   */
  deleteQuestion(user_ref: string, id: number): Promise<boolean>;

  /**
   * Answer question
   * @param user_ref user name of the user answering question
   * @param questionId question id
   * @param answer answer content
   */
  answerQuestion(
    user_ref: string,
    questionId: number,
    answer: string,
    images?: number[],
  ): Promise<MaybeAnswer>;

  /**
   * Comment answer
   * @param answer_id answer id
   * @param user_ref user commenting
   * @param content comment content
   */
  commentAnswer(
    answer_id: number,
    user_ref: string,
    content: string,
  ): Promise<MaybeAnswer>;

  /**
   * Delete answer comment
   * @param answer_id answer id
   * @param id comment id
   * @param user_ref username
   */
  deleteAnswerComment(
    answer_id: number,
    id: number,
    user_ref: string,
  ): Promise<MaybeAnswer>;

  /**
   * Update answer to a question
   * @param user_ref user name of the user updating the answer
   * @param questionId question id
   * @param answerId answer id
   * @param answer answer content
   */
  updateAnswer(
    user_ref: string,
    questionId: number,
    answerId: number,
    answer: string,
    images?: number[],
  ): Promise<MaybeAnswer>;

  /** Get answer by id
   * @param answerId answer id
   */
  getAnswer(answerId: number): Promise<MaybeAnswer>;

  /**
   * Delete answer. Only the user who created the answer can delete it.
   * @param user_ref user name of the user deleting answer
   * @param id answer id
   */
  deleteAnswer(user_ref: string, id: number): Promise<boolean>;

  /**
   * Vote question with given score
   * @param user_ref user name of the user voting question
   * @param questionId question id
   * @param score score to vote with
   */
  voteQuestion(
    user_ref: string,
    questionId: number,
    score: number,
  ): Promise<boolean>;

  /**
   * Vote answer with given score
   * @param user_ref user name of the user voting answer
   * @param answerId answwer id
   * @param score score to vote with
   */
  voteAnswer(
    user_ref: string,
    answerId: number,
    score: number,
  ): Promise<boolean>;

  /**
   * Mark answer correct for question. Only user who created the question can mark answer correct
   * @param user_ref user name of the user marking the answer correct
   * @param questionId question id
   * @param answerId answer id
   */
  markAnswerCorrect(
    user_ref: string,
    questionId: number,
    answerId: number,
  ): Promise<boolean>;

  /**
   * Mark answer incorrect for question. Only user who created the question can mark answer incorrect
   * @param user_ref user name of the user marking the answer incorrect
   * @param questionId question id
   * @param answerId answer id
   */
  markAnswerIncorrect(
    user_ref: string,
    questionId: number,
    answerId: number,
  ): Promise<boolean>;

  /**
   * Mark question favorite for user
   * @param user_ref user name of the user voting question
   * @param questionId question id
   */
  favoriteQuestion(user_ref: string, questionId: number): Promise<boolean>;

  /**
   * Mark question unfavorite for user
   * @param user_ref user name of the user voting question
   * @param questionId question id
   */
  unfavoriteQuestion(user_ref: string, questionId: number): Promise<boolean>;

  /**
   * Returns all used tags for questions
   */
  getTags(): Promise<TagResponse[]>;

  postAttachment({
    uuid,
    locationType,
    locationUri,
    extension,
    mimeType,
    binaryImage,
    path,
    creator,
  }: AttachmentParameters): Promise<Attachment>;

  getAttachment(uuid: string): Promise<Attachment | undefined>;

  getMostUpvotedQuestions({
    author,
    options,
  }: StatisticsRequestParameters): Promise<Statistic[]>;
  getTotalQuestions({
    author,
    options,
  }: StatisticsRequestParameters): Promise<Statistic[]>;
  getMostUpvotedAnswers({
    author,
    options,
  }: StatisticsRequestParameters): Promise<Statistic[]>;
  getMostUpvotedCorrectAnswers({
    author,
    options,
  }: StatisticsRequestParameters): Promise<Statistic[]>;
  getTotalAnswers({
    author,
    options,
  }: StatisticsRequestParameters): Promise<Statistic[]>;
}
