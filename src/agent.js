import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_BACKEND_URL || 'https://api.realworld.io/api';

const encode = encodeURIComponent;

/** Mock Server Responses for prototyped functionality **/
const alphabetResponse = {"articles":[{"slug":"first-1097","title":"Vowels","description":"aeiou","body":"these are vowels","createdAt":"2021-11-30T03:33:33.004Z","updatedAt":"2021-11-30T03:33:33.004Z","tagList":[],"author":{"username":"abcdef","bio":"something","image":"https://api.realworld.io/images/smiley-cyrus.jpeg"},"comments":[],"favoritesCount":1,"favorited":true}],"articlesCount":4};

const mathResponse = {"articles":[{"slug":"first-1097","title":"Compute Square Root","description":"Sqrt(2) ","body":"Sqrt(2) = 1.41","createdAt":"2021-11-30T03:33:33.004Z","updatedAt":"2021-11-30T03:33:33.004Z","tagList":[],"author":{"username":"abcdef","bio":"something","image":"https://api.realworld.io/images/smiley-cyrus.jpeg"},"comments":[],"favoritesCount":1,"favorited":true},
    {"slug":"first-1097","title":"Compute Logarithm","description":"Log(x) ","body":"The logarithm is denoted \"logb x\" (pronounced as \"the logarithm of x to base b\", \"the base-b logarithm of x\", or most commonly \"the log, base b, of x\")","createdAt":"2021-12-1T03:33:33.004Z","updatedAt":"2021-12-1T03:33:33.004Z","tagList":[],"author":{"username":"abcdef","bio":"something","image":"https://api.realworld.io/images/smiley-cyrus.jpeg"},"comments":[],"favoritesCount":1,"favorited":true}],"articlesCount":4};

const allSubjectResponse = {"articles":[{"slug":"first-1097","title":"Vowels","description":"aeiou","body":"these are vowels","createdAt":"2021-11-30T03:33:33.004Z","updatedAt":"2021-11-30T03:33:33.004Z","tagList":[],"author":{"username":"abcdef","bio":"something","image":"https://api.realworld.io/images/smiley-cyrus.jpeg"},"comments":[],"favoritesCount":1,"favorited":true},
    {"slug":"first-1097","title":"Compute Square Root","description":"Sqrt(2) ","body":"Sqrt(2) = 1.41","createdAt":"2021-11-30T03:33:33.004Z","updatedAt":"2021-11-30T03:33:33.004Z","tagList":[],"author":{"username":"abcdef","bio":"something","image":"https://api.realworld.io/images/smiley-cyrus.jpeg"},"comments":[],"favoritesCount":1,"favorited":true},
    {"slug":"first-1097","title":"Compute Logarithm","description":"Log(x) ","body":"The logarithm is denoted \"logb x\" (pronounced as \"the logarithm of x to base b\", \"the base-b logarithm of x\", or most commonly \"the log, base b, of x\")","createdAt":"2021-12-1T03:33:33.004Z","updatedAt":"2021-12-1T03:33:33.004Z","tagList":[],"author":{"username":"abcdef","bio":"something","image":"https://api.realworld.io/images/smiley-cyrus.jpeg"},"comments":[],"favoritesCount":1,"favorited":true}],"articlesCount":4};
/** End Mock Responses **/

const responseBody = res => {console.log(res.body); return res.body;};

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: _ => allSubjectResponse,
  alphaFeed: _ => alphabetResponse,
  math: _ => mathResponse,
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: _token => { token = _token; }
};
